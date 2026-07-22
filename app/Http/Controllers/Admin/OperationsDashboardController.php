<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\YardScan;
use App\Models\FleetDetection;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OperationsDashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $usersTotal       = User::count();
        $adminsCount      = User::where('role', 'admin')->count();
        $managersCount    = User::where('role', 'manager')->count();
        $dispatchersCount = User::where('role', 'dispatcher')->count();

        $scansTotal      = YardScan::count();
        $scansPending    = YardScan::where('status', 'pending')->count();
        $scansProcessing = YardScan::where('status', 'processing')->count();
        $scansCompleted  = YardScan::where('status', 'completed')->count();
        $scansFailed     = YardScan::where('status', 'failed')->count();

        $recentScans = YardScan::query()
            ->with('user:id,name') 
            ->orderByDesc('id')
            ->limit(8)
            ->get(['id', 'user_id', 'reference_code', 'zone_name', 'status', 'started_at', 'created_at']);

        $fleetTotal = FleetDetection::where('vehicle_type', 'commercial_truck')->count();

        return Inertia::render('Admin/Dashboard/Index', [
            'kpis' => [
                'team' => [
                    'total'       => $usersTotal,
                    'admins'      => $adminsCount,
                    'managers'    => $managersCount,
                    'dispatchers' => $dispatchersCount,
                ],
                'scans' => [
                    'total'      => $scansTotal,
                    'pending'    => $scansPending,
                    'processing' => $scansProcessing,
                    'completed'  => $scansCompleted,
                    'failed'     => $scansFailed,
                ],
                'fleet' => [
                    'total_detected' => $fleetTotal,
                ],
            ],
            'recent_scans' => $recentScans,
        ]);
    }
}