<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FleetDetection extends Model
{
    protected $fillable = [
        'yard_scan_id',
        'sector_id',
        'vehicle_type',
        'confidence_score',
        'pixel_x',
        'pixel_y',
        'bbox_x1',
        'bbox_y1',
        'bbox_x2',
        'bbox_y2',
        'latitude',
        'longitude',
        'detected_at',
    ];

    protected $casts = [
        'detected_at' => 'datetime',
        'confidence_score' => 'float',
        'latitude' => 'double',
        'longitude' => 'double',
    ];

    public function yardScan(): BelongsTo
    {
        return $this->belongsTo(YardScan::class);
    }

    public function sector(): BelongsTo
    {
        return $this->belongsTo(YardScanSector::class, 'sector_id');
    }
}