<?php

namespace App\Http\Controllers;

use App\Models\YardScan;
use App\Services\SectorMappingService;
use App\Jobs\ProcessSectorImageJob;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\JsonResponse;

class YardScanController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('YardScans/Create');
    }

    public function store(Request $request, SectorMappingService $mappingService): JsonResponse
    {
        if (!config('features.analysis_run_enabled', true)) {
            return response()->json([
                'ok' => false,
                'message' => 'Yard scan runs are temporarily disabled by administration.'
            ], 403);
        }

        $validated = $request->validate([
            'boundaries_geojson' => ['required', 'array'],
            'boundaries_geojson.type' => ['required', 'string'],
            'boundaries_geojson.coordinates' => ['required', 'array'],
            'zone_name' => ['nullable', 'string', 'max:255'],
        ]);

        $scan = YardScan::create([
            'user_id' => Auth::id(),
            'reference_code' => 'SCAN-' . strtoupper(substr(uniqid(), -6)),
            'zone_name' => $validated['zone_name'] ?? 'Unnamed Zone',
            'boundaries_geojson' => $validated['boundaries_geojson'],
            'status' => 'pending',
            'started_at' => now(),
        ]);

        $zoom = 19;

        $sectorsData = $mappingService->calculateSectorsForZone($validated['boundaries_geojson'], $zoom);
        $sectors = [];

        foreach ($sectorsData as $sectorData) {
            $sectors[] = $scan->sectors()->create([
                'source' => 'tile',
                'zoom' => $sectorData['zoom'],
                'tile_x' => $sectorData['tile_x'],
                'tile_y' => $sectorData['tile_y'],
                'min_lat' => $sectorData['min_lat'],
                'min_lon' => $sectorData['min_lon'],
                'max_lat' => $sectorData['max_lat'],
                'max_lon' => $sectorData['max_lon'],
            ]);
        }

        foreach ($sectors as $sector) {
            ProcessSectorImageJob::dispatch($sector->id);
        }

        return response()->json([
            'ok' => true,
            'scan_id' => $scan->id,
            'reference_code' => $scan->reference_code,
            'grid' => [
                'mode' => 'sectors',
                'zoom' => $zoom,
                'count' => count($sectors),
            ],
            'sectors' => $sectors,
        ]);
    }

    public function show(int $id): Response
    {
        $scan = Auth::user()->yardScans()
            ->with(['sectors', 'detections'])
            ->findOrFail($id);
        
        return Inertia::render('YardScans/Show', [
            'scan' => $scan
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | API Endpoints for React Map UI (Polling)
    |--------------------------------------------------------------------------
    */

    public function apiStatus(int $id): JsonResponse
    {
        $scan = Auth::user()->yardScans()->findOrFail($id);

        return response()->json([
            'ok' => true,
            'status' => $scan->status ?? 'pending',
        ]);
    }

    public function apiProgress(int $id): JsonResponse
    {
        $scan = Auth::user()->yardScans()->findOrFail($id);

        $total = $scan->sectors()->count();

        $done = $scan->sectors()->where('detect_status', 'done')->count();
        $failed = $scan->sectors()->where('detect_status', 'failed')->count();

        $finished = $done + $failed;
        $percent = $total > 0 ? round(($finished / $total) * 100, 1) : 0;

        return response()->json([
            'ok' => true,
            'scan_id' => $scan->id,
            'status' => $scan->status,
            'total_cells' => $total, // حافظت على نفس المفتاح ليطابق الواجهة الأمامية
            'done_cells' => $done,
            'failed_cells' => $failed,
            'finished_cells' => $finished,
            'percent' => $percent,
        ]);
    }

    public function apiDetections(int $id): JsonResponse
    {
        $scan = Auth::user()->yardScans()->findOrFail($id);
        
        $geo = $scan->boundaries_geojson;
        $ring = $geo['coordinates'][0] ?? [];

        // Remove closing point if duplicated
        if (count($ring) >= 2 && $ring[0] === end($ring)) {
            array_pop($ring);
        }

        // Ray casting algorithm (Point in Polygon)
        $pointInPolygon = function(float $lon, float $lat) use ($ring): bool {
            $inside = false;
            $n = count($ring);
            if ($n < 3) return false;

            for ($i = 0, $j = $n - 1; $i < $n; $j = $i++) {
                $xi = (float) $ring[$i][0]; $yi = (float) $ring[$i][1];
                $xj = (float) $ring[$j][0]; $yj = (float) $ring[$j][1];

                $intersect = (($yi > $lat) != ($yj > $lat)) &&
                    ($lon < ($xj - $xi) * ($lat - $yi) / (($yj - $yi) ?: 1e-12) + $xi);

                if ($intersect) $inside = !$inside;
            }
            return $inside;
        };

        $detections = $scan->detections()->get();

        // Filter and map to React expected format
        $filtered = $detections->filter(function($d) use ($pointInPolygon) {
            // Support both old (lat/lon) and new DB structures
            $lat = $d->latitude ?? $d->lat;
            $lon = $d->longitude ?? $d->lon;
            
            if ($lat === null || $lon === null) return false;
            return $pointInPolygon((float)$lon, (float)$lat);
        })->map(function($d) {
            return [
                'id' => $d->id,
                'label' => $d->label,
                'confidence' => $d->confidence,
                'latitude' => (float) ($d->latitude ?? $d->lat),
                'longitude' => (float) ($d->longitude ?? $d->lon),
                'detected_at' => $d->detected_at,
            ];
        })->values();

        return response()->json($filtered);
    }
}