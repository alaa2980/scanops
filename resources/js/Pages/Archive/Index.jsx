import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function ScanArchive({ scans, filters }) {
    // 1. إدارة حالة الفلاتر
    const [values, setValues] = useState({
        status: filters?.status || 'all',
        range: filters?.range || 'all',
        min: filters?.min || '0',
    });

    const handleChange = (e) => {
        setValues(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleApply = (e) => {
        e.preventDefault();
        router.get(route('archive.index'), values, { preserveState: true });
    };

    const handleReset = () => {
        router.get(route('archive.index'));
    };

    // 2. دوال مساعدة لتنسيق الحالات
    const getStatusStyle = (status) => {
        const styles = {
            completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
            running: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
            failed: 'bg-red-500/10 text-red-400 border-red-500/20',
            queued: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
        };
        return styles[status?.toLowerCase()] || styles.queued;
    };

    return (
        <AppLayout>
            <Head title="Scan Archive" />

            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-extrabold tracking-tight text-white">Operations Archive</h1>
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/5 text-slate-300 border border-white/10">
                                {scans.total} Records
                            </span>
                        </div>
                        <p className="text-slate-400 mt-1 text-sm">
                            Historical overview and analytics of all logistics yard scans.
                        </p>
                    </div>
                </div>

                {/* Filters Control Bar (Glassmorphism) */}
                <form onSubmit={handleApply} className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-4 shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    
                    <div className="flex items-center gap-2 text-slate-400 font-semibold text-sm">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                        Refine Data
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                        <select 
                            name="status" 
                            value={values.status} 
                            onChange={handleChange}
                            className="w-full sm:w-40 rounded-xl bg-slate-800 border border-white/10 px-3 py-2 text-sm text-slate-200 focus:ring-2 focus:ring-emerald-500/50 outline-none"
                        >
                            <option value="all">All Statuses</option>
                            <option value="queued">Queued</option>
                            <option value="running">Processing</option>
                            <option value="completed">Completed</option>
                            <option value="failed">Failed</option>
                        </select>

                        <select 
                            name="range" 
                            value={values.range} 
                            onChange={handleChange}
                            className="w-full sm:w-40 rounded-xl bg-slate-800 border border-white/10 px-3 py-2 text-sm text-slate-200 focus:ring-2 focus:ring-emerald-500/50 outline-none"
                        >
                            <option value="all">All Time</option>
                            <option value="7">Last 7 Days</option>
                            <option value="30">Last 30 Days</option>
                        </select>

                        <select 
                            name="min" 
                            value={values.min} 
                            onChange={handleChange}
                            className="w-full sm:w-40 rounded-xl bg-slate-800 border border-white/10 px-3 py-2 text-sm text-slate-200 focus:ring-2 focus:ring-emerald-500/50 outline-none"
                        >
                            <option value="0">Any Volume</option>
                            <option value="1">&ge; 1 Target</option>
                            <option value="10">&ge; 10 Targets</option>
                            <option value="100">&ge; 100 Targets</option>
                        </select>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <button type="submit" className="flex-1 sm:flex-none px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-gray-900 font-bold text-sm rounded-xl transition-colors">
                                Apply
                            </button>
                            <button type="button" onClick={handleReset} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-semibold text-sm rounded-xl transition-colors">
                                Reset
                            </button>
                        </div>
                    </div>
                </form>

                {/* Data Table */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-2xl shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse whitespace-nowrap">
                            <thead>
                                <tr className="bg-slate-800/40 text-slate-400 text-[11px] uppercase tracking-wider">
                                    <th className="px-6 py-4 font-bold">Reference ID</th>
                                    <th className="px-6 py-4 font-bold">Status</th>
                                    <th className="px-6 py-4 font-bold">Fleet Count</th>
                                    <th className="px-6 py-4 font-bold">Created At</th>
                                    <th className="px-6 py-4 font-bold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {scans.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                                            No scans found matching your criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    scans.data.map((scan) => (
                                        <tr key={scan.id} className="hover:bg-slate-800/20 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="font-mono text-sm font-bold text-slate-200 group-hover:text-emerald-400 transition-colors">
                                                    #{scan.reference_code || scan.id}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border capitalize ${getStatusStyle(scan.status)}`}>
                                                    {scan.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                                        <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 24 24"><path d="M19 7h-3V6a4 4 0 0 0-8 0H5a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h1a3 3 0 0 0 6 0h4a3 3 0 0 0 6 0h1a1 1 0 0 0 1-1V9a2 2 0 0 0-2-2z"/></svg>
                                                    </div>
                                                    <span className="text-lg font-black text-white">{scan.trucks_count || 0}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-semibold text-slate-300">
                                                    {new Date(scan.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </div>
                                                <div className="text-xs text-slate-500 mt-0.5">
                                                    {new Date(scan.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link 
                                                        href={route('yard_scans.show', scan.id)}
                                                        className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-gray-900 transition-colors"
                                                        title="Open on Map"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                                                    </Link>
                                                    <Link 
                                                        href={route('archive.show', scan.id)}
                                                        className="p-2 rounded-lg bg-white/5 text-slate-300 hover:bg-white/10 transition-colors"
                                                        title="View Details"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Pagination */}
                    {scans.links && scans.data.length > 0 && (
                        <div className="p-4 border-t border-white/5 flex items-center justify-between bg-slate-800/20">
                            <div className="text-xs text-slate-500 font-semibold">
                                Showing {scans.from} to {scans.to} of {scans.total} results
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