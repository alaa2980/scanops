import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import AppLayout from '@/Layouts/AppLayout';

export default function AdminScanMap({ scan }) {
    // 1. إدارة الحالات (State Management)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    
    // المراجع (Refs) للحفاظ على كائنات الخريطة خارج دورة حياة React
    const mapRef = useRef(null);
    const layersRef = useRef({
        polygon: null,
        detections: L.featureGroup()
    });
    const markersRef = useRef(new Map());

    const detections = scan.detections || [];
    const fleetCount = detections.filter(d => (d.vehicle_type || '').toLowerCase().includes('truck')).length;

    // 2. إعداد الخريطة ورسم النطاق الجغرافي (Polygon)
    useEffect(() => {
        if (!mapRef.current) {
            const map = L.map('admin-map-container', { zoomControl: false });
            L.control.zoom({ position: 'bottomleft' }).addTo(map);

            L.tileLayer(
                `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/tiles/{z}/{x}/{y}?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`,
                { tileSize: 512, zoomOffset: -1, maxZoom: 20 }
            ).addTo(map);

            layersRef.current.detections.addTo(map);

            const geojson = scan.boundaries_geojson || scan.polygon_geojson;
            if (geojson) {
                const polygonLayer = L.geoJSON(geojson, {
                    style: { color: '#38bdf8', weight: 2, fillOpacity: 0.1 }
                }).addTo(map);
                
                layersRef.current.polygon = polygonLayer;
                map.fitBounds(polygonLayer.getBounds(), { padding: [40, 40] });
            }

            mapRef.current = map;
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [scan.id]);

    // 3. رسم الشاحنات (Markers) عند تغير البيانات
    useEffect(() => {
        const layerGroup = layersRef.current.detections;
        layerGroup.clearLayers();
        markersRef.current.clear();

        const truckIcon = L.divIcon({
            className: 'bg-transparent',
            html: `
                <div class="w-9 h-9 rounded-xl bg-emerald-500/20 border-2 border-emerald-500/80 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)] backdrop-blur-md">
                    <svg class="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 24 24"><path d="M19 7h-3V6a4 4 0 0 0-8 0H5a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h1a3 3 0 0 0 6 0h4a3 3 0 0 0 6 0h1a1 1 0 0 0 1-1V9a2 2 0 0 0-2-2z"/></svg>
                </div>
            `,
            iconSize: [36, 36],
            iconAnchor: [18, 18],
            popupAnchor: [0, -20]
        });

        detections.forEach(d => {
            if (d.latitude == null || d.longitude == null) return;

            const marker = L.marker([d.latitude, d.longitude], { icon: truckIcon }).addTo(layerGroup);
            markersRef.current.set(String(d.id), marker);
            
            marker.bindPopup(`
                <div class="min-w-[200px] font-sans p-1">
                    <div class="flex items-center gap-2 mb-3 border-b border-gray-100 pb-2">
                        <div class="w-6 h-6 rounded bg-emerald-100 flex items-center justify-center">
                            <svg class="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 24 24"><path d="M19 7h-3V6a4 4 0 0 0-8 0H5a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h1a3 3 0 0 0 6 0h4a3 3 0 0 0 6 0h1a1 1 0 0 0 1-1V9a2 2 0 0 0-2-2z"/></svg>
                        </div>
                        <span class="font-bold text-gray-800 text-sm">Target Detected</span>
                    </div>
                    <div class="space-y-1.5 mb-3">
                        <div class="flex justify-between items-center text-xs">
                            <span class="text-gray-500 font-semibold">Type:</span>
                            <span class="font-bold text-gray-800 capitalize">${d.vehicle_type || 'Unknown'}</span>
                        </div>
                        <div class="flex justify-between items-center text-xs">
                            <span class="text-gray-500 font-semibold">Confidence:</span>
                            <span class="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">${Number(d.confidence_score).toFixed(2)}</span>
                        </div>
                        <div class="flex justify-between items-center text-xs">
                            <span class="text-gray-500 font-semibold">Coords:</span>
                            <span class="font-mono text-gray-700">${Number(d.latitude).toFixed(4)}, ${Number(d.longitude).toFixed(4)}</span>
                        </div>
                    </div>
                    <div class="text-[10px] text-gray-400 text-right">
                        ${new Date(d.detected_at).toLocaleString()}
                    </div>
                </div>
            `);
        });
    }, [detections]);

    // 4. دوال التحكم التفاعلية
    const handleFocus = (id) => {
        const marker = markersRef.current.get(String(id));
        if (marker && mapRef.current) {
            mapRef.current.flyTo(marker.getLatLng(), Math.max(mapRef.current.getZoom(), 17), { animate: true, duration: 1 });
            marker.openPopup();
            setIsDrawerOpen(false); // إغلاق القائمة الجانبية بعد التركيز
        }
    };

    const handleFitBounds = () => {
        if (layersRef.current.polygon && mapRef.current) {
            mapRef.current.flyToBounds(layersRef.current.polygon.getBounds(), { padding: [40, 40], duration: 1 });
        }
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        router.reload({
            only: ['scan'],
            onFinish: () => setIsRefreshing(false)
        });
    };

    // تنسيق الحالة
    const getStatusStyle = (status) => {
        const s = status?.toLowerCase();
        if (s === 'completed') return 'text-emerald-400 bg-emerald-400/10 border-emerald-500/30';
        if (s === 'processing' || s === 'running') return 'text-yellow-400 bg-yellow-400/10 border-yellow-500/30';
        if (s === 'failed') return 'text-red-400 bg-red-400/10 border-red-500/30';
        return 'text-sky-400 bg-sky-400/10 border-sky-500/30';
    };

    return (
        <AppLayout>
            <Head title={`Map Analysis #${scan.reference_code || scan.id}`} />

            <div className="flex flex-col h-[calc(100vh-80px)] space-y-4">
                
                {/* Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-extrabold text-white tracking-tight">
                            Geospatial Scan <span className="text-slate-400">#{scan.reference_code || scan.id}</span>
                        </h1>
                        <span className="text-slate-600">|</span>
                        <span className="text-sm font-medium text-slate-400">
                            {new Date(scan.created_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                        </span>
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full border capitalize ${getStatusStyle(scan.status)}`}>
                            {scan.status}
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link 
                            href={route('admin.scans.show', scan.id)}
                            className="rounded-xl px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-white/5 text-white font-semibold transition-colors text-sm flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            Back to Details
                        </Link>
                    </div>
                </div>

                {/* Map Area with Glassmorphism Overlay */}
                <div className="relative flex-1 rounded-3xl border border-white/10 overflow-hidden shadow-2xl bg-slate-900">
                    
                    {/* Floating Controls Overlay */}
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[1000] backdrop-blur-xl bg-gray-900/85 border border-white/10 rounded-2xl px-6 py-3 flex items-center gap-6 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                        
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-0.5">Fleet Detected</span>
                            <div className="text-sm text-slate-300 flex items-baseline gap-1.5">
                                <span className="text-2xl font-black text-white">{fleetCount}</span> Units
                            </div>
                        </div>

                        <div className="h-10 w-px bg-white/10"></div>

                        <button 
                            onClick={() => setIsDrawerOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold transition-all border border-white/5"
                        >
                            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                            View Logs
                        </button>

                        <button 
                            onClick={handleFitBounds}
                            title="Reset View"
                            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all border border-white/5"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                        </button>

                        <div className="h-10 w-px bg-white/10"></div>

                        <button 
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-gray-900 transition-all font-extrabold"
                        >
                            <svg className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                            {isRefreshing ? 'Syncing...' : 'Sync Live'}
                        </button>
                    </div>

                    {/* Right Side Drawer (Detections List) */}
                    <div 
                        className={`absolute top-0 right-0 z-[2000] h-full w-[380px] bg-slate-900/95 backdrop-blur-3xl border-l border-white/10 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
                    >
                        <div className="flex items-center justify-between p-6 border-b border-white/10">
                            <div>
                                <h3 className="text-lg font-extrabold text-white">Detection Logs</h3>
                                <p className="text-xs text-slate-400 mt-0.5">Click focus to locate on map.</p>
                            </div>
                            <button 
                                onClick={() => setIsDrawerOpen(false)}
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-4">
                            {detections.length === 0 ? (
                                <div className="text-center p-6 rounded-2xl bg-white/5 border border-dashed border-white/10 text-slate-400 text-sm">
                                    No targets identified in this sector.
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {detections.map(d => (
                                        <div key={d.id} className="bg-slate-800/50 border border-white/5 rounded-2xl p-4 flex items-center justify-between hover:bg-slate-800/80 transition-colors">
                                            <div>
                                                <div className="font-mono text-sm font-bold text-slate-200">#{d.id}</div>
                                                <div className="text-xs text-emerald-400 font-semibold uppercase mt-0.5">{d.vehicle_type || 'Unknown'}</div>
                                            </div>
                                            <button 
                                                onClick={() => handleFocus(d.id)}
                                                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-2"
                                            >
                                                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                Focus
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Leaflet Map Target */}
                    <div id="admin-map-container" className="w-full h-full z-0"></div>
                </div>
            </div>
        </AppLayout>
    );
}