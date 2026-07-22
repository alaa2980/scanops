import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function AdminYardScansIndex({ stats, scans }) {
    
    // تنسيق حالات الفحص بناءً على الكود الحقيقي للكونترولر
    const getStatusStyle = (status) => {
        const s = status?.toLowerCase();
        switch (s) {
            case 'completed':
                return { badge: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300', dot: 'bg-emerald-400' };
            case 'processing':
                return { badge: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300', dot: 'bg-yellow-400' };
            case 'failed':
                return { badge: 'border-red-500/30 bg-red-500/10 text-red-300', dot: 'bg-red-400' };
            default:
                return { badge: 'border-sky-500/30 bg-sky-500/10 text-sky-300', dot: 'bg-sky-400' };
        }
    };

    return (
        <AppLayout>
            <Head title="Admin | Fleet Scans" />

            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header & Control Bar */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="text-[11px] uppercase tracking-[0.2em] text-emerald-400 font-bold mb-1">
                                Administration
                            </div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-white">
                                Fleet Yard Scans
                            </h1>
                            <p className="text-sm text-slate-400 mt-1">
                                Comprehensive monitoring of all scanning runs and live operational statuses across the logistics network.
                            </p>
                        </div>

                        <button 
                            onClick={() => router.reload({ only: ['stats', 'scans'] })}
                            className="rounded-2xl bg-emerald-500 hover:bg-emerald-600 transition-colors px-5 py-3 text-sm font-extrabold text-gray-900 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                            Sync Metrics
                        </button>
                    </div>

                    {/* KPI Cards Grid (Directly mapped to $stats) */}
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        
                        <div className="rounded-2xl border border-white/10 bg-black/30 p-5 backdrop-blur-md">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Scans</div>
                            <div className="mt-2 text-3xl font-black text-white">
                                {Number(stats?.total || 0).toLocaleString()}
                            </div>
                            <div className="mt-1 text-[11px] text-slate-500">All recorded operations</div>
                        </div>

                        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5 backdrop-blur-md">
                            <div className="text-xs font-bold text-emerald-300/80 uppercase tracking-wider">Completed</div>
                            <div className="mt-2 text-3xl font-black text-emerald-100">
                                {Number(stats?.completed || 0).toLocaleString()}
                            </div>
                            <div className="mt-1 text-[11px] text-emerald-400/60">Successfully processed</div>
                        </div>

                        <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-5 backdrop-blur-md">
                            <div className="text-xs font-bold text-yellow-300/80 uppercase tracking-wider">Processing</div>
                            <div className="mt-2 text-3xl font-black text-yellow-100">
                                {Number(stats?.processing || 0).toLocaleString()}
                            </div>
                            <div className="mt-1 text-[11px] text-yellow-400/60">Active processing pipeline</div>
                        </div>

                        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5 backdrop-blur-md">
                            <div className="text-xs font-bold text-red-300/80 uppercase tracking-wider">Failed</div>
                            <div className="mt-2 text-3xl font-black text-red-100">
                                {Number(stats?.failed || 0).toLocaleString()}
                            </div>
                            <div className="mt-1 text-[11px] text-red-400/60">Requires intervention</div>
                        </div>

                    </div>
                </div>

                {/* Main Data Table (Directly mapped to $scans Paginator) */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl shadow-xl overflow-hidden">
                    
                    <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-slate-800/20">
                        <div>
                            <h3 className="text-lg font-bold text-white">System Scans Directory</h3>
                            <p className="text-xs text-slate-400 mt-0.5">Real-time database feed of all yard scans.</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse whitespace-nowrap">
                            <thead>
                                <tr className="bg-slate-800/40 text-slate-400 text-[11px] uppercase tracking-wider">
                                    <th className="px-6 py-4 font-bold">Reference / ID</th>
                                    <th className="px-6 py-4 font-bold">Dispatcher</th>
                                    <th className="px-6 py-4 font-bold">Status</th>
                                    <th className="px-6 py-4 font-bold">Fleet Count</th>
                                    <th className="px-6 py-4 font-bold">Created At</th>
                                    <th className="px-6 py-4 font-bold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {scans.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                            <div className="inline-block p-4 rounded-2xl bg-black/20 border border-dashed border-white/10">
                                                No scan records found in the system database.
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    scans.data.map((item) => {
                                        const style = getStatusStyle(item.status);
                                        const createdAt = item.created_at ? new Date(item.created_at).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' }) : '—';

                                        return (
                                            <tr key={item.id} className="hover:bg-slate-800/20 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="font-mono text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                                                        #{item.id}
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-semibold text-slate-200">
                                                        {item.user ? item.user.name : 'System User'}
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-xl text-xs font-bold border capitalize ${style.badge}`}>
                                                        <span className={`h-2 w-2 rounded-full ${style.dot} animate-pulse`}></span>
                                                        {item.status || 'unknown'}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                                            <svg className="w-3.5 h-3.5 text-emerald-400" fill="currentColor" viewBox="0 0 24 24"><path d="M19 7h-3V6a4 4 0 0 0-8 0H5a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h1a3 3 0 0 0 6 0h4a3 3 0 0 0 6 0h1a1 1 0 0 0 1-1V9a2 2 0 0 0-2-2z"/></svg>
                                                        </div>
                                                        <span className="text-base font-black text-white">{Number(item.fleet_count || 0)}</span>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4 text-sm text-slate-300 font-mono">
                                                    {createdAt}
                                                </td>

                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link 
                                                            href={route('admin.scans.show', item.id)}
                                                            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5"
                                                        >
                                                            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                            Details
                                                        </Link>

                                                        <Link 
                                                            href={route('admin.scans.map', item.id)}
                                                            className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 hover:text-gray-900 border border-emerald-500/20 text-xs font-semibold text-emerald-400 transition-colors flex items-center gap-1.5"
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                                                            Map
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    {scans.links && scans.data.length > 0 && (
                        <div className="p-4 border-t border-white/5 flex items-center justify-between bg-slate-800/20">
                            <div className="text-xs text-slate-500 font-semibold">
                                Showing {scans.from} to {scans.to} of {scans.total} total scans
                            </div>
                            <div className="flex items-center gap-1">
                                {scans.links.map((link, index) => (
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