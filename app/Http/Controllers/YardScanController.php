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
}