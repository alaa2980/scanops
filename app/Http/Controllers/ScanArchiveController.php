<?php

namespace App\Http\Controllers;

use App\Models\YardScan;
use App\Models\FleetDetection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ScanArchiveController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->query('status', 'all');
        $range  = $request->query('range', '30');
        $min    = (int) $request->query('min', 0);

        $query = Auth::user()->yardScans();

        if ($range === '7') {
            $query->where('started_at', '>=', now()->subDays(7));
        } elseif ($range === '30') {
            $query->where('started_at', '>=', now()->subDays(30));
        }

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        $query->withCount([
            'detections as fleet_count' => function ($q) {
                $q->where('vehicle_type', 'commercial_truck');
            }
        ]);

        if ($min > 0) {
            $query->having('fleet_count', '>=', $min);
        }

        $scans = $query->latest()->paginate(12)->withQueryString();

        return Inertia::render('Archive/Index', [
            'filters' => [
                'status' => $status,
                'range'  => $range,
                'min'    => $min,
            ],
            'scans' => $scans,
        ]);
    }

    public function show(Request $request, int $scanId): Response
    {
        $scan = Auth::user()->yardScans()->with('sectors')->findOrFail($scanId);
        
        $sectorsTotal    = $scan->sectors->count();
        $sectorsDone     = $scan->sectors->where('detect_status', 'done')->count();
        $sectorsFailed   = $scan->sectors->where('detect_status', 'failed')->count();
        $sectorsFinished = $sectorsDone + $sectorsFailed;
        $sectorsPending  = max(0, $sectorsTotal - $sectorsFinished);

        $progressPercent = $sectorsTotal > 0 ? round(($sectorsFinished / $sectorsTotal) * 100, 1) : 0;

        $searchQuery = trim((string) $request->get('search', ''));

        $detections = FleetDetection::where('yard_scan_id', $scan->id)
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

        return Inertia::render('Archive/Show', [
            'scan' => $scan,
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
}