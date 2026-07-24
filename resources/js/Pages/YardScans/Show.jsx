import React, { useState, useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import AppLayout from '@/Layouts/AppLayout';

export default function ShowYardScan({ scan }) {
    // 1. إدارة الحالة
    const [detections, setDetections] = useState([]);
    const [truckCount, setTruckCount] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // 2. المراجع للكائنات خارج React
    const mapRef = useRef(null);
    const layersRef = useRef({
        polygon: null,
        detections: L.featureGroup()
    });

    // تنسيقات الحالات (Status Styles)
    const statusConfig = {
        completed: { color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-500/30', dot: 'bg-emerald-400' },
        running: { color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-500/30', dot: 'bg-yellow-400' },
        failed: { color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-500/30', dot: 'bg-red-400' },
        queued: { color: 'text-sky-400', bg: 'bg-sky-400/10', border: 'border-sky-500/30', dot: 'bg-sky-400' },
    };
    const currentStatus = statusConfig[scan.status?.toLowerCase()] || statusConfig.queued;

    // 3. تهيئة الخريطة ورسم المضلع الأساسي
    useEffect(() => {
        if (!mapRef.current) {
            const map = L.map('map-container', { zoomControl: false });
            
            // إضافة أزرار الزووم في مكان مخصص
            L.control.zoom({ position: 'bottomright' }).addTo(map);

            L.tileLayer(
                `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/tiles/{z}/{x}/{y}?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`,
                { tileSize: 512, zoomOffset: -1, maxZoom: 20 }
            ).addTo(map);

            layersRef.current.detections.addTo(map);

            // رسم المضلع (Zone Boundary)
            if (scan.boundaries_geojson) {
                const polygonLayer = L.geoJSON(scan.boundaries_geojson, {
                    style: { color: '#38bdf8', weight: 2, fillOpacity: 0.1 }
                }).addTo(map);
                
                layersRef.current.polygon = polygonLayer;
                map.fitBounds(polygonLayer.getBounds(), { padding: [40, 40] });
            }

            mapRef.current = map;
            
            // جلب البيانات لأول مرة
            fetchDetections();
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    // 4. جلب بيانات الاكتشافات عبر API
    const fetchDetections = async () => {
        setIsRefreshing(true);
        try {
            const response = await axios.get(route('yard_scans.api.detections', scan.id));
            if (response.data) {
                setDetections(response.data);
                
                // حساب عدد الشاحنات فقط
                const count = response.data.length;
                setTruckCount(count);
            }
        } catch (error) {
            console.error("Failed to load detections", error);
        } finally {
            setIsRefreshing(false);
        }
    };

    // 5. رسم الشاحنات على الخريطة كلما تغيرت البيانات
    useEffect(() => {
        const layerGroup = layersRef.current.detections;
        layerGroup.clearLayers();

        // أيقونة الشاحنة الفخمة
        const truckIcon = L.divIcon({
            className: 'bg-transparent',
            html: `
                <div class="w-9 h-9 rounded-xl bg-emerald-500/20 border-2 border-emerald-500/80 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)] backdrop-blur-md transition-transform hover:scale-110">
                    <svg class="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 24 24"><path d="M19 7h-3V6a4 4 0 0 0-8 0H5a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h1a3 3 0 0 0 6 0h4a3 3 0 0 0 6 0h1a1 1 0 0 0 1-1V9a2 2 0 0 0-2-2z"/></svg>
                </div>
            `,
            iconSize: [36, 36],
            iconAnchor: [18, 18],
            popupAnchor: [0, -20]
        });

        detections.forEach(d => {
            const marker = L.marker([d.latitude, d.longitude], { icon: truckIcon }).addTo(layerGroup);
            
            // تصميم الـ Popup المودرن
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
                            <span class="text-gray-500 font-semibold">Confidence:</span>
                            <span class="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">${Number(d.confidence).toFixed(2)}</span>
                        </div>
                        <div class="flex justify-between items-center text-xs">
                            <span class="text-gray-500 font-semibold">Lat:</span>
                            <span class="font-mono text-gray-700">${Number(d.latitude).toFixed(6)}</span>
                        </div>
                        <div class="flex justify-between items-center text-xs">
                            <span class="text-gray-500 font-semibold">Lng:</span>
                            <span class="font-mono text-gray-700">${Number(d.longitude).toFixed(6)}</span>
                        </div>
                    </div>
                    <div class="text-[10px] text-gray-400 text-right">
                        ${new Date(d.detected_at).toLocaleString()}
                    </div>
                </div>
            `);
        });
    }, [detections]);

    return (
        <AppLayout>
            <Head title={`Scan Details #${scan.id}`} />

            {/* Header Section */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-extrabold text-white tracking-tight">
                        Operation <span className="text-slate-400">#{scan.reference_code || scan.id}</span>
                    </h1>
                    
                    <span className="text-slate-600">|</span>
                    
                    <span className="text-sm font-medium text-slate-400">
                        {new Date(scan.created_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>

                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full border ${currentStatus.bg} ${currentStatus.border} ${currentStatus.color} capitalize`}>
                        <span className={`h-2 w-2 rounded-full ${currentStatus.dot} animate-pulse`}></span>
                        {scan.status}
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <Link 
                        href={route('archive.index')}
                        className="rounded-xl px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-white/5 text-white font-semibold transition-colors text-sm flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Back to Archive
                    </Link>
                </div>
            </div>

            {/* Map Area */}
            <div className="relative rounded-3xl border border-white/10 overflow-hidden shadow-2xl bg-slate-900">
                
                {/* Floating KPIs Dashboard (Glassmorphism) */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[1000] backdrop-blur-xl bg-gray-900/85 border border-white/10 rounded-2xl px-6 py-3 flex items-center gap-6 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                    
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-0.5">Fleet Detected</span>
                        <div className="text-sm text-slate-300 flex items-baseline gap-1.5">
                            <span className="text-2xl font-black text-white">{truckCount}</span> Units
                        </div>
                    </div>

                    <div className="h-10 w-px bg-white/10"></div>

                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-0.5">System Status</span>
                        <div className={`text-sm font-black capitalize ${currentStatus.color}`}>
                            {scan.status}
                        </div>
                    </div>

                    <div className="h-10 w-px bg-white/10"></div>

                    <button 
                        onClick={fetchDetections}
                        disabled={isRefreshing}
                        className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all disabled:opacity-50"
                    >
                        <svg className={`w-4 h-4 text-emerald-400 ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        <span className="text-sm font-bold">{isRefreshing ? 'Syncing...' : 'Live Sync'}</span>
                    </button>
                </div>

                {/* Map Container */}
                <div id="map-container" className="h-[calc(100vh-240px)] min-h-[600px] w-full z-0"></div>
            </div>
        </AppLayout>
    );
}