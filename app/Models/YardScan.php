<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class YardScan extends Model
{
    protected $fillable = [
        'user_id',
        'reference_code',
        'zone_name',
        'boundaries_geojson',
        'status',
        'started_at',
        'finished_at',
    ];

    protected $casts = [
        'boundaries_geojson' => 'array',
        'started_at' => 'datetime',
        'finished_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function sectors(): HasMany
    {
        return $this->hasMany(YardScanSector::class);
    }

    public function detections(): HasMany
    {
        return $this->hasMany(FleetDetection::class);
    }
}