<?php

namespace App\Jobs;

use App\Models\YardScan;
use App\Models\FleetDetection;
use App\Services\SectorMappingService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

/**
 * Background Job to clean up and filter out any fleet detections 
 * that fall completely outside the designated logistical zone boundaries.
 */
class FilterOutlierDetectionsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(public int $scanId) {}

    /**
     * Execute the job.
     */
    public function handle(SectorMappingService $mappingService): void
    {
        $scan = YardScan::find($this->scanId);
        if (!$scan) {
            return;
        }

        $geo = $scan->boundaries_geojson;
        $ring = $geo['coordinates'][0] ?? [];

        if (count($ring) >= 2 && $ring[0] === end($ring)) {
            array_pop($ring);
        }

        FleetDetection::where('yard_scan_id', $scan->id)
            ->select(['id', 'latitude', 'longitude'])
            ->chunkById(500, function ($rows) use ($mappingService, $ring) {
                foreach ($rows as $detection) {
                    if ($detection->latitude === null || $detection->longitude === null) {
                        $detection->delete();
                        continue;
                    }

                    $isInsideZone = $mappingService->isPointInZone(
                        (float) $detection->longitude, 
                        (float) $detection->latitude, 
                        $ring
                    );

                    if (!$isInsideZone) {
                        $detection->delete();
                    }
                }
            });
    }
}