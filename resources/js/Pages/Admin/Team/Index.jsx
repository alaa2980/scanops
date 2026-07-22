import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function TeamIndex({ team, filters }) {
    // إدارة حالة البحث
    const [searchQuery, setSearchQuery] = useState(filters?.q || '');

    // دالة البحث مع الحفاظ على حالة الصفحة
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.team.index'), { q: searchQuery }, { preserveState: true });
    };

    const clearSearch = () => {
        setSearchQuery('');
        router.get(route('admin.team.index'));
    };

    // دالة الحذف باستخدام Inertia
    const handleDelete = (id) => {
        if (confirm('Are you sure you want to revoke access and delete this team member?')) {
            router.delete(route('admin.team.destroy', id), {
                preserveScroll: true
            });
        }
    };

    // دوال مساعدة لتنسيق شارات الصلاحيات (Role Badges)
    const getRoleBadge = (role) => {
        const roles = {
            admin: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
            manager: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
            dispatcher: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
        };
        return roles[role?.toLowerCase()] || 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    };

    // استخراج الحرف الأول للصورة الرمزية (Avatar)
    const getInitials = (name) => {
        return name ? name.charAt(0).toUpperCase() : 'U';
    };

    return (
        <AppLayout>
            <Head title="Team Management" />

            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header Section */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-xl">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div>
                            <div className="text-[11px] uppercase tracking-[0.2em] text-emerald-400 font-bold mb-2">
                                Administration
                            </div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
                                Workforce Management
                            </h1>
                            <p className="text-sm text-slate-400 max-w-xl">
                                Provision accounts, assign organizational roles, and monitor system access for all logistics and dispatch personnel.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <button 
                                onClick={() => router.reload({ only: ['team'] })}
                                className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors px-5 py-2.5 text-sm font-semibold text-slate-200 flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                Sync Data
                            </button>

                            <Link 
                                href={route('admin.team.create')}
                                className="rounded-xl bg-emerald-500 hover:bg-emerald-600 transition-colors px-5 py-2.5 text-sm font-extrabold text-gray-900 flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                                Provision Member
                            </Link>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="mt-8">
                        <form onSubmit={handleSearch} className="relative max-w-2xl">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by name, email, or exact ID..."
                                className="w-full bg-slate-800/50 border border-white/10 rounded-2xl pl-12 pr-24 py-3.5 text-sm text-white placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
                            />
                            <div className="absolute inset-y-0 right-2 flex items-center">
                                <button type="submit" className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-colors">
                                    Search
                                </button>
                            </div>
                        </form>

                        {filters?.q && (
                            <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                                Showing results for: <span className="text-white font-bold">"{filters.q}"</span>
                                <button onClick={clearSearch} className="ml-2 text-emerald-400 hover:text-emerald-300 underline transition-colors">
                                    Clear filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl shadow-xl overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex items-center justify-between bg-slate-800/20">
                        <div>
                            <h3 className="text-lg font-bold text-white">Active Personnel</h3>
                            <p className="text-xs text-slate-400 mt-1">Total of {team.total} registered accounts.</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse whitespace-nowrap">
                            <thead>
                                <tr className="bg-slate-800/40 text-slate-400 text-[11px] uppercase tracking-wider">
                                    <th className="px-6 py-4 font-bold">Identity</th>
                                    <th className="px-6 py-4 font-bold">Contact</th>
                                    <th className="px-6 py-4 font-bold">Security Role</th>
                                    <th className="px-6 py-4 font-bold">Account Status</th>
                                    <th className="px-6 py-4 font-bold text-right">Administrative Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {team.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center">
                                            <div className="inline-block p-6 rounded-2xl bg-black/20 border border-dashed border-white/10 text-slate-400">
                                                No personnel records found matching your criteria.
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    team.data.map((user) => (
                                        <tr key={user.id} className="hover:bg-slate-800/20 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-lg font-black text-slate-300 shadow-inner">
                                                        {getInitials(user.name)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white group-hover:text-emerald-400 transition-colors">{user.name}</div>
                                                        <div className="text-xs text-slate-500 font-mono mt-0.5">UID: {user.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-slate-300">{user.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold border uppercase tracking-wider ${getRoleBadge(user.role)}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="relative flex h-2.5 w-2.5">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                                    </span>
                                                    <span className="text-sm font-semibold text-slate-300">Active</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link 
                                                        href={route('admin.team.show', user.id)}
                                                        className="p-2 rounded-lg bg-white/5 text-slate-300 hover:bg-white/10 transition-colors"
                                                        title="View Profile"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                    </Link>
                                                    <Link 
                                                        href={route('admin.team.edit', user.id)}
                                                        className="p-2 rounded-lg bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 transition-colors"
                                                        title="Edit Permissions"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                    </Link>
                                                    <button 
                                                        onClick={() => handleDelete(user.id)}
                                                        className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                                                        title="Revoke Access"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {team.links && team.data.length > 0 && (
                        <div className="p-4 border-t border-white/5 flex items-center justify-between bg-slate-800/20">
                            <div className="text-xs text-slate-500 font-semibold">
                                Showing {team.from} to {team.to} of {team.total} personnel
                            </div>
                            <div className="flex items-center gap-1">
                                {team.links.map((link, index) => (
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