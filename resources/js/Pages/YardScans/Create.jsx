import React, { useState, useEffect, useRef } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import AppLayout from '@/Layouts/AppLayout';

export default function CreateYardScan() {
    const [points, setPoints] = useState([]);
    const [scanState, setScanState] = useState('idle');
    const [progress, setProgress] = useState({ percent: 0, finished: 0, total: 0 });
    const [fleetCount, setFleetCount] = useState(0);
    const [scanId, setScanId] = useState(null);

    const mapRef = useRef(null);
    const layersRef = useRef({
        markers: L.featureGroup(),
        polygon: null,
        cells: L.featureGroup(),
        detections: L.featureGroup()
    });

    useEffect(() => {
        if (!mapRef.current) {
            const map = L.map('map-container', {
                zoomControl: false, // Custom UI approach, hide default zoom
            }).setView([33.7438, -118.2673], 14);
            
            // Add zoom control to bottom right for cleaner top area
            L.control.zoom({ position: 'bottomright' }).addTo(map);

            const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
            
            L.tileLayer(
                `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/tiles/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`,
                { tileSize: 512, zoomOffset: -1, maxZoom: 20 }
            ).addTo(map);

            layersRef.current.markers.addTo(map);
            layersRef.current.cells.addTo(map);
            layersRef.current.detections.addTo(map);

            map.on('click', (e) => {
                setPoints((prev) => {
                    if (prev.length >= 4) return prev;
                    return [...prev, [e.latlng.lat, e.latlng.lng]];
                });
            });

            mapRef.current = map;
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        const { markers } = layersRef.current;
        markers.clearLayers();

        points.forEach((p, idx) => {
            // Enterprise style minimal markers
            L.circleMarker(p, { 
                radius: 5, 
                weight: 2, 
                color: '#fff', 
                fillColor: '#10b981',
                fillOpacity: 1 
            }).addTo(markers);
        });

        if (points.length === 4) {
            if (layersRef.current.polygon) layersRef.current.polygon.remove();
            
            // Enterprise style targeting polygon
            const polygon = L.polygon(points, { 
                color: '#10b981', 
                weight: 2,
                dashArray: '5, 5',
                fillColor: '#10b981',
                fillOpacity: 0.1
            }).addTo(mapRef.current);
            layersRef.current.polygon = polygon;
            
            mapRef.current.fitBounds(polygon.getBounds(), { padding: [60, 60], animate: true, duration: 1 });
        }
    }, [points]);

    const handleRunAnalysis = async () => {
        if (points.length !== 4) return;
        setScanState('pending');

        try {
            const coords = points.map(p => [p[1], p[0]]);
            coords.push(coords[0]);

            const response = await axios.post(route('yard_scans.store'), {
                boundaries_geojson: { type: "Polygon", coordinates: [coords] },
                zone_name: 'Target Logistics Zone'
            });

            if (response.data.ok) {
                setScanId(response.data.scan_id);
                drawSectors(response.data.sectors);
            }
        } catch (error) {
            setScanState('failed');
            console.error("Failed to start scan:", error);
        }
    };

    const drawSectors = (sectors) => {
        layersRef.current.cells.clearLayers();
        sectors.forEach(sector => {
            const bounds = [
                [sector.min_lat, sector.min_lon],
                [sector.max_lat, sector.max_lon]
            ];
            L.rectangle(bounds, { 
                color: '#38bdf8', 
                weight: 1, 
                opacity: 0.3, 
                fillOpacity: 0.02,
                className: 'sector-grid-line'
            }).addTo(layersRef.current.cells);
        });
    };

    useEffect(() => {
        let pollInterval;

        const pollProgress = async () => {
            if (!scanId || scanState === 'completed' || scanState === 'failed' || scanState === 'idle') return;

            try {
                const [progressRes, statusRes, detectionsRes] = await Promise.all([
                    axios.get(route('yard_scans.api.progress', scanId)),
                    axios.get(route('yard_scans.api.status', scanId)),
                    axios.get(route('yard_scans.api.detections', scanId))
                ]);

                if (progressRes.data.ok) {
                    setProgress({
                        percent: progressRes.data.percent,
                        finished: progressRes.data.finished_cells,
                        total: progressRes.data.total_cells
                    });
                }

                if (detectionsRes.data) {
                    setFleetCount(detectionsRes.data.length);
                    drawDetections(detectionsRes.data);
                }

                if (statusRes.data.ok) {
                    setScanState(statusRes.data.status);
                    if (statusRes.data.status === 'completed' || statusRes.data.status === 'failed') {
                        clearInterval(pollInterval);
                    }
                }
            } catch (error) {
                clearInterval(pollInterval);
                setScanState('failed');
            }
        };

        if (scanId && (scanState === 'pending' || scanState === 'processing')) {
            pollInterval = setInterval(pollProgress, 2000);
        }

        return () => clearInterval(pollInterval);
    }, [scanId, scanState]);

    const drawDetections = (detections) => {
        layersRef.current.detections.clearLayers();
        
        const truckIcon = L.divIcon({
            className: 'bg-transparent',
            html: `
                <div class="relative w-6 h-6 rounded-md bg-[#0A0A0A] border border-emerald-500/50 flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                    <div class="absolute inset-0 bg-emerald-500/20 rounded-md animate-pulse"></div>
                    <svg class="w-3.5 h-3.5 text-emerald-400 relative z-10" fill="currentColor" viewBox="0 0 24 24"><path d="M19 7h-3V6a4 4 0 0 0-8 0H5a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h1a3 3 0 0 0 6 0h4a3 3 0 0 0 6 0h1a1 1 0 0 0 1-1V9a2 2 0 0 0-2-2z"/></svg>
                </div>
            `,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
        });

        detections.forEach(d => {
            L.marker([d.latitude, d.longitude], { icon: truckIcon }).addTo(layersRef.current.detections);
        });
    };

    const handleReset = () => {
        setPoints([]);
        setScanState('idle');
        setScanId(null);
        setProgress({ percent: 0, finished: 0, total: 0 });
        setFleetCount(0);
        
        layersRef.current.markers.clearLayers();
        layersRef.current.cells.clearLayers();
        layersRef.current.detections.clearLayers();
        if (layersRef.current.polygon) {
            layersRef.current.polygon.remove();
            layersRef.current.polygon = null;
        }
        
        mapRef.current.setView([33.7438, -118.2673], 14, { animate: true });
    };

    const ThemeConfig = {
        idle: { text: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20', dot: 'bg-slate-500' },
        pending: { text: 'text-sky-400', bg: 'bg-sky-400/10', border: 'border-sky-400/20', dot: 'bg-sky-400 animate-pulse' },
        processing: { text: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20', dot: 'bg-yellow-400 animate-pulse' },
        completed: { text: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', dot: 'bg-emerald-400' },
        failed: { text: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20', dot: 'bg-red-400' },
    };

    const currentTheme = ThemeConfig[scanState] || ThemeConfig.idle;

    return (
        <AppLayout>
            <Head title="ScanOps | Geospatial Targeting" />
            
            <div className="relative rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl bg-[#050505]">
                
                {/* Enterprise HUD (Heads Up Display) Panel */}
                <div className="absolute top-6 left-6 right-6 z-[1000] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pointer-events-none">
                    
                    {/* Left: Targeting & Data Acquisition Panel */}
                    <div className="pointer-events-auto flex items-center bg-[#0A0A0A]/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-2 shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
                        
                        {/* 1. Targeting Sequence */}
                        <div className="flex flex-col justify-center px-4 py-1.5 border-r border-white/5">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Targeting</span>
                            <div className="flex items-center gap-1.5">
                                {[1, 2, 3, 4].map((step) => (
                                    <div 
                                        key={step} 
                                        className={`h-1.5 rounded-full transition-all duration-300 ${
                                            points.length >= step 
                                                ? 'w-6 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' 
                                                : 'w-3 bg-white/10'
                                        }`} 
                                    />
                                ))}
                            </div>
                        </div>

                        {/* 2. Live Telemetry (Visible only during/after scan) */}
                        <div className={`transition-all duration-500 flex items-center overflow-hidden ${scanState !== 'idle' ? 'w-auto opacity-100 px-4 border-r border-white/5' : 'w-0 opacity-0 px-0 border-transparent'}`}>
                            <div className="flex flex-col justify-center">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Asset Count</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-xl font-black text-white leading-none">{fleetCount}</span>
                                    <span className="text-[10px] text-slate-400">units</span>
                                </div>
                            </div>
                        </div>

                        {/* 3. Pipeline Status */}
                        <div className={`transition-all duration-500 flex items-center overflow-hidden ${scanState !== 'idle' ? 'w-auto opacity-100 px-4' : 'w-0 opacity-0 px-0'}`}>
                            <div className="flex flex-col w-32">
                                <div className="flex items-center justify-between mb-1.5">
                                    <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${currentTheme.bg} ${currentTheme.border}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${currentTheme.dot}`}></div>
                                        <span className={`text-[9px] font-bold uppercase tracking-wider ${currentTheme.text}`}>{scanState}</span>
                                    </div>
                                    <span className="text-[10px] font-mono font-bold text-white">{progress.percent}%</span>
                                </div>
                                <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                                    <div 
                                        className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-700 ease-out" 
                                        style={{ width: `${progress.percent}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right: Command Actions */}
                    <div className="pointer-events-auto flex items-center gap-2 bg-[#0A0A0A]/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-2 shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
                        <button 
                            onClick={handleReset}
                            className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 transition-all text-slate-400 hover:text-white group"
                            title="Reset Grid"
                        >
                            <svg className="w-4 h-4 group-hover:-rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        </button>

                        <button 
                            onClick={handleRunAnalysis}
                            disabled={points.length !== 4 || scanState !== 'idle'}
                            className="relative flex items-center gap-2 h-10 px-6 rounded-xl bg-emerald-500 text-black font-extrabold text-[13px] tracking-wide transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] overflow-hidden"
                        >
                            {scanState === 'idle' ? (
                                <>
                                    <span>Execute Scan</span>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                </>
                            ) : (
                                <span>Processing Protocol...</span>
                            )}
                            
                            {/* Scanning laser effect overlay when points are ready but not scanned */}
                            {points.length === 4 && scanState === 'idle' && (
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                            )}
                        </button>
                    </div>

                </div>

                {/* Map Interface Container */}
                <div id="map-container" className="h-[calc(100vh-100px)] min-h-[700px] w-full bg-[#050505] z-0 [&_.leaflet-control-container_.leaflet-control]:border-white/10 [&_.leaflet-control-container_.leaflet-control]:bg-[#0A0A0A]/90 [&_.leaflet-control-container_.leaflet-control]:backdrop-blur-xl [&_.leaflet-control-container_.leaflet-control]:text-white"></div>
                
                {/* CSS for custom UI animations */}
                <style dangerouslySetInnerHTML={{__html: `
                    @keyframes shimmer {
                        100% { transform: translateX(100%); }
                    }
                    /* Subtle styling for Leaflet controls to match dark theme */
                    .leaflet-bar { border: 1px solid rgba(255,255,255,0.1) !important; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.5) !important; border-radius: 0.75rem !important; overflow: hidden; }
                    .leaflet-bar a { background-color: rgba(10,10,10,0.9) !important; color: #a1a1aa !important; border-bottom: 1px solid rgba(255,255,255,0.05) !important; width: 36px !important; height: 36px !important; line-height: 36px !important; transition: all 0.2s; }
                    .leaflet-bar a:hover { background-color: rgba(255,255,255,0.05) !important; color: #fff !important; }
                    .leaflet-control-attribution { background: transparent !important; color: rgba(255,255,255,0.3) !important; font-size: 9px !important; }
                    .leaflet-control-attribution a { color: rgba(255,255,255,0.5) !important; }
                `}} />
            </div>
        </AppLayout>
    );
}