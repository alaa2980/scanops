<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Service responsible for communicating with satellite/mapping providers (e.g., Mapbox).
 * Fetches high-resolution images for specific logistical sectors to be processed by the AI engine.
 */
class SatelliteImagingService
{
    /**
     * Fetch the satellite image for a specific sector.
     *
     * @param int $zoom The zoom level.
     * @param int $sectorX The X coordinate of the sector.
     * @param int $sectorY The Y coordinate of the sector.
     * @param bool $highResolution Whether to fetch a retina (@2x) quality image.
     * @return array
     */
    public function fetchSectorImage(
        int $zoom,
        int $sectorX,
        int $sectorY,
        bool $highResolution = true
    ): array {
        $token = config('services.mapbox.token');
        $user  = config('services.mapbox.user', 'mapbox');
        $style = config('services.mapbox.style', 'satellite-v9');

        $tileSize = 512;
        $scale = $highResolution ? '@2x' : '';

        $url = "https://api.mapbox.com/styles/v1/{$user}/{$style}/tiles/{$tileSize}/{$zoom}/{$sectorX}/{$sectorY}{$scale}";

        try {
            $response = Http::timeout(60)->get($url, [
                'access_token' => $token,
            ]);

            if (!$response->successful()) {
                Log::error("Failed to fetch satellite image for Sector ({$sectorX}, {$sectorY}) at Zoom {$zoom}.", [
                    'status' => $response->status(),
                    'response' => $response->body(),
                ]);

                return [
                    'ok' => false,
                    'status' => $response->status(),
                    'error' => $response->body(),
                ];
            }

            return [
                'ok' => true,
                'bytes' => $response->body(),
                'mime' => $response->header('Content-Type'),
            ];
            
        } catch (\Exception $e) {
            Log::critical("Exception occurred while fetching satellite image: " . $e->getMessage());
            
            return [
                'ok' => false,
                'status' => 500,
                'error' => 'Internal Server Error or Connection Timeout.',
            ];
        }
    }
}