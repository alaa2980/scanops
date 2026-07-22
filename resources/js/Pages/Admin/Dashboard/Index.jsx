import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function OperationsDashboard({ kpis, recent_scans }) {
    
    // دالة مساعدة لتحديد ألوان الحالات (Status Colors)
    const getStatusStyle = (status) => {
        const styles = {
            pending: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
            processing: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
            completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
            failed: 'bg-red-500/10 text-red-400 border-red-500/20',
        };
        return styles[status] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    };

    return (
        <AppLayout>
            <Head title="Operations Dashboard" />

            {/* Header Section */}
            <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">System Operations</h1>
                    <p className="text-slate-400 mt-1 text-sm">Real-time overview of logistics scans and fleet detections.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-xl border border-white/5 transition-colors">
                        Export Report
                    </button>
                    <Link href={route('admin.scans.index')} className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-gray-900 text-sm font-extrabold rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                        View All Scans
                    </Link>
                </div>
            </div>

            {/* Top KPIs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {/* Total Fleet Detected */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 p-6 rounded-3xl shadow-xl relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                            <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                        </div>
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-lg">+12% this week</span>
                    </div>
                    <h3 className="text-slate-400 text-sm font-medium">Total Fleet Detected</h3>
                    <p className="text-4xl font-black text-white mt-1">{kpis.fleet.total_detected.toLocaleString()}</p>
                </div>

                {/* Yard Scans Volume */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 p-6 rounded-3xl shadow-xl relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-sky-500/10 rounded-full blur-3xl"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-sky-500/10 rounded-2xl border border-sky-500/20">
                            <svg className="w-6 h-6 text-sky-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
                        </div>
                    </div>
                    <h3 className="text-slate-400 text-sm font-medium">Total Yard Scans</h3>
                    <p className="text-4xl font-black text-white mt-1">{kpis.scans.total}</p>
                </div>

                {/* Active Team */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 p-6 rounded-3xl shadow-xl relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                            <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        </div>
                        <div className="flex gap-1">
                            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse delay-75"></span>
                        </div>
                    </div>
                    <h3 className="text-slate-400 text-sm font-medium">Active Team Members</h3>
                    <p className="text-4xl font-black text-white mt-1">{kpis.team.total}</p>
                </div>
            </div>

            {/* Middle Section: Visual Stats without external libraries */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                {/* Scans Health Distribution */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 p-8 rounded-3xl shadow-xl">
                    <h3 className="text-lg font-bold text-white mb-6">Scan Status Distribution</h3>
                    
                    {/* Custom CSS Bar Chart */}
                    <div className="flex h-4 rounded-full overflow-hidden mb-6 bg-slate-800">
                        <div style={{ width: `${(kpis.scans.completed / kpis.scans.total) * 100}%` }} className="bg-emerald-500"></div>
                        <div style={{ width: `${(kpis.scans.processing / kpis.scans.total) * 100}%` }} className="bg-yellow-500"></div>
                        <div style={{ width: `${(kpis.scans.pending / kpis.scans.total) * 100}%` }} className="bg-sky-500"></div>
                        <div style={{ width: `${(kpis.scans.failed / kpis.scans.total) * 100}%` }} className="bg-red-500"></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                                <span className="text-sm text-slate-400">Completed</span>
                            </div>
                            <span className="text-2xl font-bold text-white">{kpis.scans.completed}</span>
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                                <span className="text-sm text-slate-400">Processing</span>
                            </div>
                            <span className="text-2xl font-bold text-white">{kpis.scans.processing}</span>
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="w-3 h-3 rounded-full bg-sky-500"></span>
                                <span className="text-sm text-slate-400">Pending</span>
                            </div>
                            <span className="text-2xl font-bold text-white">{kpis.scans.pending}</span>
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                                <span className="text-sm text-slate-400">Failed</span>
                            </div>
                            <span className="text-2xl font-bold text-white">{kpis.scans.failed}</span>
                        </div>
                    </div>
                </div>

                {/* Team Hierarchy */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 p-8 rounded-3xl shadow-xl flex flex-col justify-center">
                    <h3 className="text-lg font-bold text-white mb-6">Workforce Hierarchy</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-2xl border border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg></div>
                                <span className="font-semibold text-slate-200">Administrators</span>
                            </div>
                            <span className="text-xl font-bold text-white">{kpis.team.admins}</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-2xl border border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg></div>
                                <span className="font-semibold text-slate-200">Operations Managers</span>
                            </div>
                            <span className="text-xl font-bold text-white">{kpis.team.managers}</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-2xl border border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-orange-500/10 text-orange-400 rounded-xl"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path></svg></div>
                                <span className="font-semibold text-slate-200">Field Dispatchers</span>
                            </div>
                            <span className="text-xl font-bold text-white">{kpis.team.dispatchers}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Recent Scans Table */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl shadow-xl overflow-hidden">
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-slate-800/20">
                    <h3 className="text-lg font-bold text-white">Recent Operations</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-800/40 text-slate-400 text-xs uppercase tracking-wider">
                                <th className="p-5 font-semibold">Reference</th>
                                <th className="p-5 font-semibold">Zone Name</th>
                                <th className="p-5 font-semibold">Operator</th>
                                <th className="p-5 font-semibold">Status</th>
                                <th className="p-5 font-semibold">Started At</th>
                                <th className="p-5 font-semibold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {recent_scans.map((scan) => (
                                <tr key={scan.id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="p-5">
                                        <span className="font-mono text-sm text-white bg-white/5 px-2 py-1 rounded-md border border-white/10">
                                            {scan.reference_code}
                                        </span>
                                    </td>
                                    <td className="p-5 font-medium text-slate-200">{scan.zone_name}</td>
                                    <td className="p-5 text-slate-300">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold">
                                                {scan.user.name.charAt(0)}
                                            </div>
                                            {scan.user.name}
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border capitalize ${getStatusStyle(scan.status)}`}>
                                            {scan.status}
                                        </span>
                                    </td>
                                    <td className="p-5 text-sm text-slate-400">
                                        {new Date(scan.started_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                    <td className="p-5 text-right">
                                        <Link href={route('admin.scans.show', scan.id)} className="text-emerald-400 hover:text-emerald-300 text-sm font-semibold transition-colors">
                                            View Details &rarr;
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {recent_scans.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-slate-500">No recent operations found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}