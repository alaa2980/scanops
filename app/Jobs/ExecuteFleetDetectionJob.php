<?php

namespace App\Jobs;

use App\Models\YardScanSector;
use App\Models\YardScan;
use App\Models\FleetDetection;
use App\Services\SectorMappingService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

/**
 * Background Job to send sector images to the AI engine for fleet detection,
 * map the detected pixel coordinates to real-world GPS coordinates,
 * and finalize the scanning process if all sectors are completed.
 */
class ExecuteFleetDetectionJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(public int $sectorId) {}

    /**
     * Execute the job.
     */
    public function handle(SectorMappingService $mappingService): void
    {
        $sector = YardScanSector::findOrFail($this->sectorId);
        $scan = YardScan::find($sector->yard_scan_id);

        if ($scan && $scan->status !== 'processing') {
            $scan->update(['status' => 'processing']);
        }

        if ($sector->fetch_status !== 'done' || !$sector->image_path) {
            return;
        }

        FleetDetection::where('sector_id', $sector->id)->delete();

        $absolutePath = Storage::disk('public')->path($sector->image_path);

        $sector->update([
            'detect_status' => 'processing',
            'detect_error' => null,
        ]);

        $aiUrl = rtrim(env('AI_SERVICE_URL', 'http://127.0.0.1:8001'), '/');
        $confidenceThreshold = (float) env('AI_CONF', 0.35);

        try {
            $response = Http::timeout(120)->post("{$aiUrl}/detect", [
                'image_path' => $absolutePath,
                'conf' => $confidenceThreshold,
            ]);

            if (!$response->successful() || !($response->json('ok') ?? false)) {
                $this->markAsFailed($sector, 'AI Engine returned an error or unsuccessful response.');
                return;
            }

            $json = $response->json();
            
            [$imageWidth, $imageHeight] = getimagesize($absolutePath);
            $detectedAt = now();

            foreach (($json['detections'] ?? []) as $detection) {
                $cx = (int) ($detection['cx'] ?? 0);
                $cy = (int) ($detection['cy'] ?? 0);

                $coordinates = $mappingService->pixelToRealWorldCoordinates(
                    (int) $sector->tile_x,
                    (int) $sector->tile_y,
                    (int) $sector->zoom,
                    $cx,
                    $cy,
                    $imageWidth,
                    $imageHeight
                );

                FleetDetection::create([
                    'yard_scan_id' => $sector->yard_scan_id,
                    'sector_id' => $sector->id,
                    'vehicle_type' => 'commercial_truck',
                    'confidence_score' => (float) ($detection['confidence'] ?? 0),
                    'pixel_x' => $cx,
                    'pixel_y' => $cy,
                    'bbox_x1' => $detection['x1'] ?? null,
                    'bbox_y1' => $detection['y1'] ?? null,
                    'bbox_x2' => $detection['x2'] ?? null,
                    'bbox_y2' => $detection['y2'] ?? null,
                    'latitude' => $coordinates['lat'],
                    'longitude' => $coordinates['lon'],
                    'detected_at' => $detectedAt,
                ]);
            }

            $sector->update([
                'detect_status' => 'done',
                'detected_at' => $detectedAt,
            ]);

            $this->maybeFinalizeScan($sector->yard_scan_id);

        } catch (\Exception $e) {
            Log::error("Fleet detection failed for Sector {$sector->id}: " . $e->getMessage());
            $this->markAsFailed($sector, 'Connection to AI Engine Failed or Image Processing Error.');
        }
    }

    private function markAsFailed(YardScanSector $sector, string $error): void
    {
        $sector->update([
            'detect_status' => 'failed',
            'detect_error' => $error,
            'detected_at' => now(),
        ]);
        
        $this->maybeFinalizeScan($sector->yard_scan_id);
    }

    private function maybeFinalizeScan(int $scanId): void
    {
        $scan = YardScan::find($scanId);
        if (!$scan) return;

        $remaining = $scan->sectors()
            ->whereNotIn('detect_status', ['done', 'failed'])
            ->count();

        if ($remaining === 0) {
            $scan->update([
                'status' => 'completed',
                'finished_at' => now(),
            ]);

            \App\Jobs\FilterOutlierDetectionsJob::dispatch($scanId);
        }
    }
}