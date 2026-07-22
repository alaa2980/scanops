<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// User / Dispatcher Controllers
use App\Http\Controllers\YardScanController;
use App\Http\Controllers\ScanArchiveController;

// Admin / Management Controllers
use App\Http\Controllers\Admin\OperationsDashboardController;
use App\Http\Controllers\Admin\TeamManagementController;
use App\Http\Controllers\Admin\AdminYardScanController;

/*
|--------------------------------------------------------------------------
| Public Website (Inertia SPA)
|--------------------------------------------------------------------------
*/
Route::get('/', fn () => Inertia::render('Site/Home'))->name('home');
Route::get('/about', fn () => Inertia::render('Public/About'))->name('about');
Route::get('/contact', fn () => Inertia::render('Public/Contact'))->name('contact');

/*
|--------------------------------------------------------------------------
| User / Dispatcher Dashboard
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function () {

    // Yard Scans (Core Logistics Operations)
    Route::prefix('yard-scans')->name('yard_scans.')->group(function () {
        Route::get('/create', [YardScanController::class, 'create'])->name('create');
        Route::post('/', [YardScanController::class, 'store'])->name('store');
        Route::get('/{yardScan}', [YardScanController::class, 'show'])->name('show');

        // API Endpoints for React Map UI 
        Route::get('/{yardScan}/detections', [YardScanController::class, 'apiDetections'])->name('api.detections');
        Route::get('/{yardScan}/status', [YardScanController::class, 'apiStatus'])->name('api.status');
        Route::get('/{yardScan}/progress', [YardScanController::class, 'apiProgress'])->name('api.progress');
    });

    // Archive & Reports
    Route::prefix('archive')->name('archive.')->group(function () {
        Route::get('/', [ScanArchiveController::class, 'index'])->name('index');
        Route::get('/{scanId}', [ScanArchiveController::class, 'show'])->name('show');
    });

});

/*
|--------------------------------------------------------------------------
| Admin & Operations Management
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:admin,manager'])->prefix('admin')->name('admin.')->group(function () {

    // Central Operations Dashboard
    Route::get('/dashboard', [OperationsDashboardController::class, 'index'])->name('dashboard');

    // Team & Roles Management
    Route::resource('team', TeamManagementController::class)->parameters([
        'team' => 'user'
    ]);

    // Admin Yard Scans Overview
    Route::prefix('scans')->name('scans.')->group(function () {
        Route::get('/', [AdminYardScanController::class, 'index'])->name('index');
        Route::get('/{yardScan}', [AdminYardScanController::class, 'show'])->name('show');
        Route::get('/{yardScan}/map', [AdminYardScanController::class, 'map'])->name('map');
    });

});

/*
|--------------------------------------------------------------------------
| Authentication Routes (Laravel Breeze)
|--------------------------------------------------------------------------
*/
require __DIR__.'/auth.php';