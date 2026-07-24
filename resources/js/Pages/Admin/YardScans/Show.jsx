import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function AdminScanDetails({ scan, progress, detections, filters }) {
    // إدارة حالة البحث
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.scans.show', scan.id), { search: searchQuery }, { preserveState: true });
    };

    const handleRefresh = () => {
        router.reload({ only: ['scan', 'progress', 'detections'] });
    };

    // تنسيقات الحالات
    const getStatusStyle = (status) => {
        const s = status?.toLowerCase();
        switch (s) {
            case 'completed': return { color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-500/30', dot: 'bg-emerald-400' };
            case 'processing': return { color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-500/30', dot: 'bg-yellow-400' };
            case 'failed': return { color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-500/30', dot: 'bg-red-400' };
            default: return { color: 'text-sky-400', bg: 'bg-sky-400/10', border: 'border-sky-500/30', dot: 'bg-sky-400' };
        }
    };
    
    const currentStatus = getStatusStyle(scan.status);

    return (
        <AppLayout>
            <Head title={`Admin Scan Details #${scan.id}`} />

            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header Section */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-xl">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                        <div>
                            <div className="text-[11px] uppercase tracking-[0.2em] text-emerald-400 font-bold mb-2">
                                Administration / Scan Analysis
                            </div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
                                Reference #{scan.id}
                            </h1>
                            <p className="text-sm text-slate-400 mb-4 max-w-xl">
                                Administrative overview of scan progress, operator details, and fleet detection logs.
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-300">
                                <span className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                    Operator: {scan.user?.name || 'System'}
                                </span>
                                <span className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    Created: {new Date(scan.created_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <Link 
                                href={route('admin.scans.index')}
                                className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition px-5 py-2.5 text-sm font-semibold text-slate-200 flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                                Back
                            </Link>

                            <Link 
                                href={route('admin.scans.map', scan.id)}
                                className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 transition px-5 py-2.5 text-sm font-semibold text-emerald-400 flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                                Global Map
                            </Link>

                            <button 
                                onClick={handleRefresh}
                                className="rounded-xl bg-emerald-500 hover:bg-emerald-600 transition px-5 py-2.5 text-sm font-extrabold text-gray-900 flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                Sync
                            </button>
                        </div>
                    </div>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-lg">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">System Status</div>
                        <div className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold border ${currentStatus.bg} ${currentStatus.border} ${currentStatus.color}`}>
                            <span className={`h-2 w-2 rounded-full ${currentStatus.dot} animate-pulse`}></span>
                            <span className="capitalize">{scan.status}</span>
                        </div>
                        <div className="mt-4 text-[11px] text-slate-500 font-medium">Current processing state</div>
                    </div>

                    <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-lg relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl"></div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Fleet Detected</div>
                        <div className="text-4xl font-black text-white">{detections.total || 0}</div>
                        <div className="mt-3 text-[11px] text-slate-500 font-medium">Total units identified</div>
                    </div>

                    {/* Progress Widget */}
                    <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-lg col-span-1 md:col-span-2">
                        <div className="flex items-center justify-between mb-4">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sector Processing Progress</div>
                            <div className="text-xs font-bold text-white">{progress.percent}% ({progress.finished}/{progress.total})</div>
                        </div>
                        
                        <div className="h-2.5 rounded-full bg-slate-800 overflow-hidden mb-6">
                            <div 
                                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 transition-all duration-1000" 
                                style={{ width: `${progress.percent}%` }}
                            ></div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-slate-800/40 rounded-xl p-3 border border-white/5">
                                <div className="text-[10px] text-slate-400 uppercase font-bold">Done</div>
                                <div className="text-lg font-black text-white">{progress.done}</div>
                            </div>
                            <div className="bg-slate-800/40 rounded-xl p-3 border border-white/5">
                                <div className="text-[10px] text-slate-400 uppercase font-bold">Failed</div>
                                <div className="text-lg font-black text-red-400">{progress.failed}</div>
                            </div>
                            <div className="bg-slate-800/40 rounded-xl p-3 border border-white/5">
                                <div className="text-[10px] text-slate-400 uppercase font-bold">Pending</div>
                                <div className="text-lg font-black text-sky-400">{progress.pending}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detections Table */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl shadow-xl overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-800/20">
                        <div>
                            <h3 className="text-lg font-bold text-white">Detection Logs</h3>
                            <p className="text-xs text-slate-400 mt-1">Detailed database records of identified targets.</p>
                        </div>

                        <form onSubmit={handleSearch} className="flex items-center gap-2 w-full md:w-auto">
                            <div className="relative w-full md:w-64">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search vehicle type or ID..."
                                    className="w-full bg-slate-900 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
                                />
                            </div>
                            <button type="submit" className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold rounded-xl transition-colors shrink-0">
                                Filter
                            </button>
                        </form>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse whitespace-nowrap">
                            <thead>
                                <tr className="bg-slate-800/40 text-slate-400 text-[11px] uppercase tracking-wider">
                                    <th className="px-6 py-4 font-bold">Log ID</th>
                                    <th className="px-6 py-4 font-bold">Class</th>
                                    <th className="px-6 py-4 font-bold">Confidence</th>
                                    <th className="px-6 py-4 font-bold">Coordinates (Lat, Lng)</th>
                                    <th className="px-6 py-4 font-bold">Timestamp</th>
                                    <th className="px-6 py-4 font-bold text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {detections.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                            <div className="inline-block p-4 rounded-2xl bg-black/20 border border-dashed border-white/10">
                                                No detections found.
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    detections.data.map((d) => (
                                        <tr key={d.id} className="hover:bg-slate-800/20 transition-colors">
                                            <td className="px-6 py-4 text-sm text-slate-300 font-mono">#{d.id}</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                                    {d.vehicle_type || 'Unknown'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 h-1.5 rounded-full bg-slate-700 overflow-hidden">
                                                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(d.confidence_score || 0) * 100}%` }}></div>
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-200">
                                                        {Number(d.confidence_score).toFixed(2)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-400 font-mono">
                                                {Number(d.latitude).toFixed(6)}, {Number(d.longitude).toFixed(6)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-400">
                                                {new Date(d.detected_at).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' })}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link 
                                                    href={route('admin.scans.map', scan.id)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 transition-colors"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                    Locate
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    {detections.links && detections.data.length > 0 && (
                        <div className="p-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-800/20">
                            <div className="text-xs text-slate-500 font-semibold">
                                Showing <span className="text-slate-300">{detections.from}</span> to <span className="text-slate-300">{detections.to}</span> of <span className="text-slate-300">{detections.total}</span> logs
                            </div>
                            <div className="flex items-center gap-1">
                                {detections.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                                            link.active 
                                                ? 'bg-emerald-500 text-gray-900' 
                                                : 'bg-white/5 text-slate-400 hover:bg-white/10'
                                        } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </AppLayout>
    );
}