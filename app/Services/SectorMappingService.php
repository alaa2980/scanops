<?php

namespace App\Services;

/**
 * Service responsible for geospatial mapping calculations.
 * Converts logistical zones (Polygons) into measurable sectors (Tiles) 
 * for satellite imaging and AI fleet detection.
 */
class SectorMappingService
{
    /**
     * Convert Longitude to Sector X coordinate.
     */
    public function lonToSectorX(float $lon, int $zoom): int
    {
        $n = 2 ** $zoom;
        return (int) floor((($lon + 180.0) / 360.0) * $n);
    }

    /**
     * Convert Latitude to Sector Y coordinate.
     */
    public function latToSectorY(float $lat, int $zoom): int
    {
        $latRad = deg2rad($lat);
        $n = 2 ** $zoom;

        return (int) floor(
            (1.0 - log(tan($latRad) + (1 / cos($latRad))) / M_PI) / 2.0 * $n
        );
    }

    /**
     * Convert Sector X coordinate back to Longitude.
     */
    public function sectorXToLon(int $x, int $zoom): float
    {
        $n = 2 ** $zoom;
        return ($x / $n) * 360.0 - 180.0;
    }

    /**
     * Convert Sector Y coordinate back to Latitude.
     */
    public function sectorYToLat(int $y, int $zoom): float
    {
        $n = 2 ** $zoom;
        $latRad = atan(sinh(M_PI * (1 - 2 * $y / $n)));
        return rad2deg($latRad);
    }

    /**
     * Get the geographical boundaries (Bounding Box) of a specific sector.
     */
    public function getSectorBounds(int $x, int $y, int $zoom): array
    {
        return [
            'min_lat' => $this->sectorYToLat($y + 1, $zoom),
            'min_lon' => $this->sectorXToLon($x, $zoom),
            'max_lat' => $this->sectorYToLat($y, $zoom),
            'max_lon' => $this->sectorXToLon($x + 1, $zoom),
        ];
    }

    /**
     * Calculate the center point of a sector.
     */
    public function getSectorCenter(int $x, int $y, int $zoom): array
    {
        $bounds = $this->getSectorBounds($x, $y, $zoom);

        return [
            'lat' => ($bounds['min_lat'] + $bounds['max_lat']) / 2,
            'lon' => ($bounds['min_lon'] + $bounds['max_lon']) / 2,
        ];
    }

    /**
     * Get the specific sector (X, Y, Z) for a given GPS coordinate.
     */
    public function getSectorForCoordinate(float $lat, float $lon, int $zoom): array
    {
        return [
            'x' => $this->lonToSectorX($lon, $zoom),
            'y' => $this->latToSectorY($lat, $zoom),
            'z' => $zoom,
        ];
    }

    /**
     * Extract all mapping sectors that intersect with the drawn logistics zone.
     * (Replaces the old tilesForPolygon method)
     */
    public function calculateSectorsForZone(array $zoneBoundariesGeoJson, int $zoom): array
    {
        $ring = $zoneBoundariesGeoJson['coordinates'][0] ?? [];

        if (count($ring) < 4) {
            return [];
        }

        if ($ring[0] === end($ring)) {
            array_pop($ring);
        }

        $lats = array_map(fn($p) => $p[1], $ring);
        $lons = array_map(fn($p) => $p[0], $ring);

        $minLat = min($lats);
        $maxLat = max($lats);
        $minLon = min($lons);
        $maxLon = max($lons);

        $topLeft = $this->getSectorForCoordinate($maxLat, $minLon, $zoom);
        $bottomRight = $this->getSectorForCoordinate($minLat, $maxLon, $zoom);

        $minX = min($topLeft['x'], $bottomRight['x']);
        $maxX = max($topLeft['x'], $bottomRight['x']);
        $minY = min($topLeft['y'], $bottomRight['y']);
        $maxY = max($topLeft['y'], $bottomRight['y']);

        $sectors = [];

        for ($x = $minX; $x <= $maxX; $x++) {
            for ($y = $minY; $y <= $maxY; $y++) {
                $bounds = $this->getSectorBounds($x, $y, $zoom);

                if ($this->sectorIntersectsZone($bounds, $ring)) {
                    $sectors[] = [
                        'zoom' => $zoom,
                        'tile_x' => $x,
                        'tile_y' => $y,
                        'min_lat' => $bounds['min_lat'],
                        'min_lon' => $bounds['min_lon'],
                        'max_lat' => $bounds['max_lat'],
                        'max_lon' => $bounds['max_lon'],
                    ];
                }
            }
        }

        return $sectors;
    }

    /**
     * Check if a sector overlaps with the defined logistical zone.
     */
    public function sectorIntersectsZone(array $bounds, array $ring): bool
    {
        $rect = [
            [$bounds['min_lon'], $bounds['min_lat']],
            [$bounds['max_lon'], $bounds['min_lat']],
            [$bounds['max_lon'], $bounds['max_lat']],
            [$bounds['min_lon'], $bounds['max_lat']],
        ];

        // 1) Is any corner of the sector inside the zone?
        foreach ($rect as [$lon, $lat]) {
            if ($this->isPointInZone($lon, $lat, $ring)) {
                return true;
            }
        }

        // 2) Is any point of the zone inside the sector?
        foreach ($ring as [$lon, $lat]) {
            if (
                $lon >= $bounds['min_lon'] && $lon <= $bounds['max_lon'] &&
                $lat >= $bounds['min_lat'] && $lat <= $bounds['max_lat']
            ) {
                return true;
            }
        }

        // 3) Does any edge of the zone intersect any edge of the sector?
        $rectEdges = [
            [$rect[0], $rect[1]],
            [$rect[1], $rect[2]],
            [$rect[2], $rect[3]],
            [$rect[3], $rect[0]],
        ];

        $n = count($ring);
        for ($i = 0; $i < $n; $i++) {
            $a = $ring[$i];
            $b = $ring[($i + 1) % $n];

            foreach ($rectEdges as [$c, $d]) {
                if ($this->segmentsIntersect($a, $b, $c, $d)) {
                    return true;
                }
            }
        }

        return false;
    }

    private function segmentsIntersect(array $a, array $b, array $c, array $d): bool
    {
        $o1 = $this->calculateOrientation($a, $b, $c);
        $o2 = $this->calculateOrientation($a, $b, $d);
        $o3 = $this->calculateOrientation($c, $d, $a);
        $o4 = $this->calculateOrientation($c, $d, $b);

        if ($o1 !== $o2 && $o3 !== $o4) {
            return true;
        }

        if ($o1 === 0 && $this->isOnSegment($a, $c, $b)) return true;
        if ($o2 === 0 && $this->isOnSegment($a, $d, $b)) return true;
        if ($o3 === 0 && $this->isOnSegment($c, $a, $d)) return true;
        if ($o4 === 0 && $this->isOnSegment($c, $b, $d)) return true;

        return false;
    }

    private function calculateOrientation(array $p, array $q, array $r): int
    {
        $val = ($q[1] - $p[1]) * ($r[0] - $q[0]) - ($q[0] - $p[0]) * ($r[1] - $q[1]);

        if (abs($val) < 1e-12) {
            return 0;
        }

        return ($val > 0) ? 1 : 2;
    }

    private function isOnSegment(array $p, array $q, array $r): bool
    {
        return $q[0] <= max($p[0], $r[0]) && $q[0] >= min($p[0], $r[0]) &&
               $q[1] <= max($p[1], $r[1]) && $q[1] >= min($p[1], $r[1]);
    }

    public function isPointInZone(float $lon, float $lat, array $ring): bool
    {
        $inside = false;
        $n = count($ring);

        for ($i = 0, $j = $n - 1; $i < $n; $j = $i++) {
            $xi = $ring[$i][0];
            $yi = $ring[$i][1];
            $xj = $ring[$j][0];
            $yj = $ring[$j][1];

            $intersect = (($yi > $lat) !== ($yj > $lat))
                && ($lon < ($xj - $xi) * ($lat - $yi) / (($yj - $yi) ?: 1e-12) + $xi);

            if ($intersect) {
                $inside = !$inside;
            }
        }

        return $inside;
    }

    /**
     * Map AI pixel detection coordinates back to real-world GPS coordinates within a sector.
     */
    public function pixelToRealWorldCoordinates(
        int $sectorX,
        int $sectorY,
        int $zoom,
        float $pixelX,
        float $pixelY,
        int $imageWidth,
        int $imageHeight
    ): array {
        $worldTiles = 2 ** $zoom;

        $globalSectorX = $sectorX + ($imageWidth > 0 ? ($pixelX / $imageWidth) : 0.0);
        $globalSectorY = $sectorY + ($imageHeight > 0 ? ($pixelY / $imageHeight) : 0.0);

        $lon = ($globalSectorX / $worldTiles) * 360.0 - 180.0;

        $n = M_PI * (1 - 2 * $globalSectorY / $worldTiles);
        $lat = rad2deg(atan(sinh($n)));

        return [
            'lat' => $lat,
            'lon' => $lon,
        ];
    }
}