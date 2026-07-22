<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class YardScanSector extends Model
{
    protected $fillable = [
        'yard_scan_id',
        'source',
        'zoom',
        'tile_x',
        'tile_y',
        'min_lat',
        'min_lon',
        'max_lat',
        'max_lon',
        'image_path',
        'image_mime',
        'fetch_status',
        'fetch_error',
        'fetched_at',
        'detect_status',
        'detect_error',
        'detected_at',
    ];

    protected $casts = [
        'fetched_at' => 'datetime',
        'detected_at' => 'datetime',
        'min_lat' => 'double',
        'min_lon' => 'double',
        'max_lat' => 'double',
        'max_lon' => 'double',
    ];

    public function yardScan(): BelongsTo
    {
        return $this->belongsTo(YardScan::class);
    }

    public function detections(): HasMany
    {
        return $this->hasMany(FleetDetection::class, 'sector_id');
    }
}