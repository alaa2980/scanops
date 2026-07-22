import React, { useState, useEffect, useRef } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import AppLayout from '@/Layouts/AppLayout';

export default function CreateYardScan() {
    // 1. إدارة الحالة (State Management)
    const [points, setPoints] = useState([]);
    const [scanState, setScanState] = useState('idle'); // idle, pending, processing, completed, failed
    const [progress, setProgress] = useState({ percent: 0, finished: 0, total: 0 });
    const [fleetCount, setFleetCount] = useState(0);
    
    const [scanId, setScanId] = useState(null);

    // 2. المراجع (Refs) للتحكم بكائنات Leaflet خارج دورة حياة React
    const mapRef = useRef(null);
    const layersRef = useRef({
        markers: L.featureGroup(),
        polygon: null,
        cells: L.featureGroup(),
        detections: L.featureGroup()
    });

    // 3. تهيئة الخريطة (مرة واحدة فقط عند تحميل المكون)
    useEffect(() => {
        if (!mapRef.current) {
            // إعداد الخريطة
            const map = L.map('map-container').setView([28.3835, 36.5662], 11);
            
            // إضافة طبقة Mapbox الفضائية
            L.tileLayer(
                `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/tiles/{z}/{x}/{y}?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`,
                { tileSize: 512, zoomOffset: -1, maxZoom: 20 }
            ).addTo(map);

            // إضافة الطبقات الوهمية لتنظيم العناصر
            layersRef.current.markers.addTo(map);
            layersRef.current.cells.addTo(map);
            layersRef.current.detections.addTo(map);

            // التقاط النقرات لرسم المضلع
            map.on('click', (e) => {
                setPoints((prev) => {
                    if (prev.length >= 4) return prev;
                    return [...prev, [e.latlng.lat, e.latlng.lng]];
                });
            });

            mapRef.current = map;
        }

        // تنظيف الذاكرة عند تدمير المكون (Best Practice)
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    // 4. تحديث الرسوم الهندسية كلما تغيرت النقاط
    useEffect(() => {
        const { markers } = layersRef.current;
        markers.clearLayers();

        points.forEach((p) => {
            L.circleMarker(p, { radius: 6, weight: 2, fillOpacity: 0.8, color: '#10b981' }).addTo(markers);
        });

        // رسم المضلع عند اكتمال 4 نقاط
        if (points.length === 4) {
            if (layersRef.current.polygon) layersRef.current.polygon.remove();
            
            const polygon = L.polygon(points, { color: '#10b981', weight: 2 }).addTo(mapRef.current);
            layersRef.current.polygon = polygon;
            
            mapRef.current.fitBounds(polygon.getBounds(), { padding: [40, 40] });
        }
    }, [points]);

    // 5. إرسال البيانات وبدء المهمة
    const handleRunAnalysis = async () => {
        if (points.length !== 4) return;
        setScanState('pending');

        try {
            // تنسيق الإحداثيات لـ GeoJSON
            const coords = points.map(p => [p[1], p[0]]); // GeoJSON uses [Lng, Lat]
            coords.push(coords[0]); // إغلاق المضلع

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

    // 6. رسم القطاعات (الشبكة)
    const drawSectors = (sectors) => {
        layersRef.current.cells.clearLayers();
        sectors.forEach(sector => {
            const bounds = [
                [sector.min_lat, sector.min_lon],
                [sector.max_lat, sector.max_lon]
            ];
            L.rectangle(bounds, { color: '#38bdf8', weight: 1, opacity: 0.5, fillOpacity: 0.05 }).addTo(layersRef.current.cells);
        });
    };

    // 7. الاقتراع الطويل (Long Polling) لتحديث التقدم وجلب الشاحنات
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

                // تحديث التقدم
                if (progressRes.data.ok) {
                    setProgress({
                        percent: progressRes.data.percent,
                        finished: progressRes.data.finished_cells,
                        total: progressRes.data.total_cells
                    });
                }

                // تحديث الشاحنات
                if (detectionsRes.data) {
                    setFleetCount(detectionsRes.data.length);
                    drawDetections(detectionsRes.data);
                }

                // تحديث الحالة العامة
                if (statusRes.data.ok) {
                    setScanState(statusRes.data.status); // pending, processing, completed, failed
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
            pollInterval = setInterval(pollProgress, 3000);
        }

        return () => clearInterval(pollInterval);
    }, [scanId, scanState]);

    // 8. رسم الشاحنات على الخريطة
    const drawDetections = (detections) => {
        layersRef.current.detections.clearLayers();
        
        // Custom SVG Truck Icon (بدون الاعتماد على مكتبات خارجية)
        const truckIcon = L.divIcon({
            className: 'bg-transparent',
            html: `
                <div class="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500 flex items-center justify-center shadow-lg backdrop-blur-sm">
                    <svg class="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 24 24"><path d="M19 7h-3V6a4 4 0 0 0-8 0H5a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h1a3 3 0 0 0 6 0h4a3 3 0 0 0 6 0h1a1 1 0 0 0 1-1V9a2 2 0 0 0-2-2z"/></svg>
                </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
        });

        detections.forEach(d => {
            L.marker([d.latitude, d.longitude], { icon: truckIcon }).addTo(layersRef.current.detections);
        });
    };

    // 9. تصفير الخريطة
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
    };

    // --- مكونات الواجهة الصغيرة (Sub-components) ---
    const StatusColor = {
        idle: 'text-slate-400',
        pending: 'text-sky-400',
        processing: 'text-yellow-400',
        completed: 'text-emerald-400',
        failed: 'text-red-400',
    };

    return (
        <AppLayout>
            <Head title="New Yard Scan" />
            
            <div className="relative rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                
                {/* Floating Control Bar - Glassmorphism */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[1000] backdrop-blur-xl bg-gray-900/85 border border-white/10 rounded-2xl px-5 py-3 flex items-center gap-6 shadow-2xl transition-all">
                    
                    <div className="text-sm text-slate-300">
                        Points: <span className="font-extrabold text-white ml-1">{points.length} / 4</span>
                    </div>

                    {scanState !== 'idle' && (
                        <div className="flex items-center gap-5 animate-fade-in">
                            <div className="h-6 w-px bg-white/10"></div>
                            
                            <div className="text-sm text-slate-300">
                                Fleet: <span className="font-extrabold text-white ml-1">{fleetCount}</span>
                            </div>

                            <div className="h-6 w-px bg-white/10"></div>

                            <div className="text-sm text-slate-300">
                                Status: <span className={`font-extrabold ml-1 capitalize ${StatusColor[scanState]}`}>{scanState}</span>
                            </div>

                            <div className="w-48 ml-2">
                                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                                    <span>Processing Sectors</span>
                                    <span className="font-bold text-white">{progress.percent}%</span>
                                </div>
                                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                                    <div 
                                        className="h-full rounded-full bg-emerald-500 transition-all duration-500 ease-out" 
                                        style={{ width: `${progress.percent}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-2 ml-2">
                        <button 
                            onClick={handleReset}
                            className="rounded-xl px-4 py-2 text-sm font-medium text-slate-200 bg-white/5 hover:bg-white/10 transition-colors"
                        >
                            Reset
                        </button>

                        <button 
                            onClick={handleRunAnalysis}
                            disabled={points.length !== 4 || scanState !== 'idle'}
                            className="bg-emerald-500 hover:bg-emerald-600 text-gray-900 font-extrabold px-6 py-2 rounded-xl text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                        >
                            {scanState === 'idle' ? 'Run Scan' : 'Scanning...'}
                        </button>
                    </div>
                </div>

                {/* Map Container */}
                <div id="map-container" className="h-[calc(100vh-120px)] min-h-[600px] w-full bg-gray-900 z-0"></div>
            </div>
        </AppLayout>
    );
}