<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\YardScan;
use App\Models\FleetDetection;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminYardScanController extends Controller
{
    public function index(): Response
    {
        $totalScans      = YardScan::count();
        $completedCount  = YardScan::where('status', 'completed')->count();
        $processingCount = YardScan::where('status', 'processing')->count();
        $failedCount     = YardScan::where('status', 'failed')->count();

        $scans = YardScan::with('user:id,name')
            ->withCount(['detections as fleet_count' => function ($query) {
                $query->where('vehicle_type', 'commercial_truck');
            }])
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/YardScans/Index', [
            'stats' => [
                'total'      => $totalScans,
                'completed'  => $completedCount,
                'processing' => $processingCount,
                'failed'     => $failedCount,
            ],
            'scans' => $scans,
        ]);
    }

    public function show(Request $request, YardScan $yardScan): Response
    {
        $yardScan->load('user:id,name,email');

        $sectorsTotal    = $yardScan->sectors()->count();
        $sectorsDone     = $yardScan->sectors()->where('detect_status', 'done')->count();
        $sectorsFailed   = $yardScan->sectors()->where('detect_status', 'failed')->count();
        $sectorsFinished = $sectorsDone + $sectorsFailed;
        $sectorsPending  = max(0, $sectorsTotal - $sectorsFinished);

        $progressPercent = $sectorsTotal > 0 ? round(($sectorsFinished / $sectorsTotal) * 100, 1) : 0;

        $searchQuery = trim((string) $request->get('search', ''));

        $detections = FleetDetection::where('yard_scan_id', $yardScan->id)
            ->select(['id', 'vehicle_type', 'confidence_score', 'latitude', 'longitude', 'detected_at'])
            ->when($searchQuery !== '', function ($query) use ($searchQuery) {
                $query->where(function ($q) use ($searchQuery) {
                    $q->where('vehicle_type', 'like', "%{$searchQuery}%")
                      ->orWhere('id', $searchQuery);
                });
            })
            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/YardScans/Show', [
            'scan' => $yardScan,
            'progress' => [
                'total'    => $sectorsTotal,
                'done'     => $sectorsDone,
                'failed'   => $sectorsFailed,
                'pending'  => $sectorsPending,
                'finished' => $sectorsFinished,
                'percent'  => $progressPercent,
            ],
            'filters' => [
                'search' => $searchQuery,
            ],
            'detections' => $detections,
        ]);
    }

    public function map(YardScan $yardScan): Response
    {
        $yardScan->load(['sectors', 'detections', 'user:id,name']);

        return Inertia::render('Admin/YardScans/Map', [
            'scan' => $yardScan,
        ]);
    }
}