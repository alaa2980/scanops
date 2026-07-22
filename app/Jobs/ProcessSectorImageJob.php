<?php

namespace App\Jobs;

use App\Models\YardScanSector;
use App\Services\SatelliteImagingService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

/**
 * Background Job to fetch and store satellite images for a specific logistical sector.
 * Triggers the AI Fleet Detection Job upon successful image retrieval.
 */
class ProcessSectorImageJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(public int $sectorId) {}

    /**
     * Execute the job.
     */
    public function handle(SatelliteImagingService $imagingService): void
    {
        $sector = YardScanSector::findOrFail($this->sectorId);

        $sector->update([
            'fetch_status' => 'pending',
            'fetch_error' => null,
        ]);

        $highResolution = (bool) env('MAPBOX_RETINA', true);

        if ($sector->source !== 'tile' || $sector->zoom === null || $sector->tile_x === null || $sector->tile_y === null) {
            $sector->update([
                'fetch_status' => 'failed',
                'fetch_error' => 'Sector is not configured with valid mapping coordinates.',
            ]);
            return;
        }

        $response = $imagingService->fetchSectorImage(
            (int) $sector->zoom,
            (int) $sector->tile_x,
            (int) $sector->tile_y,
            $highResolution
        );

        if (!$response['ok']) {
            $sector->update([
                'fetch_status' => 'failed',
                'fetch_error' => "HTTP {$response['status']}: " . substr($response['error'], 0, 500),
            ]);
            return;
        }

        $extension = str_contains($response['mime'] ?? '', 'jpeg') ? 'jpg' : 'png';
        $storagePath = "yard_scans/scan_{$sector->yard_scan_id}/sectors/z{$sector->zoom}_x{$sector->tile_x}_y{$sector->tile_y}.{$extension}";

        Storage::disk('public')->put($storagePath, $response['bytes']);

        $sector->update([
            'image_path' => $storagePath,
            'image_mime' => $response['mime'],
            'fetch_status' => 'done',
            'fetched_at' => now(),
        ]);

        \App\Jobs\ExecuteFleetDetectionJob::dispatch($sector->id);
    }
}