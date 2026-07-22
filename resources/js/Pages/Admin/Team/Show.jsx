import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function ShowTeamMember({ user }) {
    // دالة مساعدة لتنسيق شارات الصلاحيات
    const getRoleBadge = (role) => {
        const roles = {
            admin: { bg: 'bg-purple-500/10 text-purple-400 border-purple-500/20', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
            manager: { bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
            dispatcher: { bg: 'bg-orange-500/10 text-orange-400 border-orange-500/20', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' }
        };
        return roles[role?.toLowerCase()] || roles.dispatcher;
    };

    const roleStyle = getRoleBadge(user.role);

    // دالة الحذف
    const handleDelete = () => {
        if (confirm('CRITICAL ACTION: Are you sure you want to delete this profile? All system access will be terminated.')) {
            router.delete(route('admin.team.destroy', user.id));
        }
    };

    return (
        <AppLayout>
            <Head title={`Personnel Profile | ${user.name}`} />

            <div className="max-w-4xl mx-auto space-y-6">

                {/* Header Section */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-xl">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div>
                            <div className="text-[11px] uppercase tracking-[0.2em] text-emerald-400 font-bold mb-2">
                                Administration / Workforce Directory
                            </div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
                                Personnel Profile
                            </h1>
                            <p className="text-sm text-slate-400">
                                Detailed access records, authentication metadata, and permission levels.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link 
                                href={route('admin.team.index')}
                                className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors px-4 py-2.5 text-sm font-semibold text-slate-200 flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                                Back
                            </Link>

                            <Link 
                                href={route('admin.team.edit', user.id)}
                                className="rounded-xl bg-emerald-500 hover:bg-emerald-600 transition-colors px-5 py-2.5 text-sm font-extrabold text-gray-900 flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                Edit Profile
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Profile Card */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl shadow-xl overflow-hidden">
                    
                    {/* Top Identity Bar */}
                    <div className="p-8 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/20">
                        <div className="flex items-center gap-5">
                            <div className="h-16 w-16 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center text-2xl font-black text-white shadow-inner">
                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>

                            <div>
                                <h2 className="text-xl font-extrabold text-white">{user.name}</h2>
                                <p className="text-sm text-slate-400 mt-0.5">{user.email}</p>
                            </div>
                        </div>

                        <span className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-bold uppercase tracking-wider ${roleStyle.bg}`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={roleStyle.icon} /></svg>
                            Role: {user.role}
                        </span>
                    </div>

                    {/* Metadata Grid */}
                    <div className="p-8">
                        <div className="grid md:grid-cols-3 gap-6">
                            
                            <div className="rounded-2xl border border-white/5 bg-slate-800/30 p-5">
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">User Identifier</div>
                                <div className="mt-2 text-xl font-mono font-black text-white">#{user.id}</div>
                                <div className="mt-1 text-[11px] text-slate-500">Database primary key</div>
                            </div>

                            <div className="rounded-2xl border border-white/5 bg-slate-800/30 p-5">
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Corporate Mail</div>
                                <div className="mt-2 text-sm font-semibold text-slate-200 truncate" title={user.email}>
                                    {user.email}
                                </div>
                                <div className="mt-1 text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Verified Address
                                </div>
                            </div>

                            <div className="rounded-2xl border border-white/5 bg-slate-800/30 p-5">
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Provisioned On</div>
                                <div className="mt-2 text-sm font-semibold text-slate-200">
                                    {user.created_at ? new Date(user.created_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) : '—'}
                                </div>
                                <div className="mt-1 text-[11px] text-slate-500">System registration timestamp</div>
                            </div>

                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="px-8 py-5 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-800/10">
                        <div className="text-xs text-slate-500 font-medium">
                            Account permissions are enforced through strict Laravel Middleware security rules.
                        </div>

                        <button 
                            onClick={handleDelete}
                            className="w-full sm:w-auto rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500 hover:text-white transition-colors px-4 py-2.5 text-sm font-bold text-red-400 flex items-center justify-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            Terminate Account
                        </button>
                    </div>

                </div>

            </div>
        </AppLayout>
    );
}