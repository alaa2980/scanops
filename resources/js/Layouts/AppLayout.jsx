import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function AppLayout({ children }) {
    const { auth } = usePage().props;
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // دالة مساعدة لمعرفة الرابط النشط
    const isActive = (routePattern) => {
        try {
            return route().current(routePattern);
        } catch (e) {
            return false;
        }
    };

    // التحقق من الصلاحيات
    const userRole = auth.user?.role?.toLowerCase() || 'dispatcher';
    const isAdminOrManager = userRole === 'admin' || userRole === 'manager';

    return (
        <div className="min-h-screen bg-[#0B1120] text-slate-300 font-sans flex overflow-hidden">
            
            {/* Sidebar (الشريط الجانبي) */}
            <aside className={`bg-[#0F172A] border-r border-white/5 transition-all duration-300 flex flex-col relative z-20 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
                
                {/* Logo Area */}
                <div className="h-20 flex items-center justify-center border-b border-white/5 px-4">
                    <div className="flex items-center gap-3 w-full">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        {isSidebarOpen && (
                            <span className="font-extrabold text-white text-xl tracking-tight whitespace-nowrap">ScanOps</span>
                        )}
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-6">
                    
                    {/* 0. Main Dashboard (Admin & Manager Only) */}
                    {isAdminOrManager && (
                        <div className="space-y-2">
                            {isSidebarOpen && <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Overview</div>}
                            
                            <Link 
                                href={route('admin.dashboard')} 
                                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${isActive('admin.dashboard') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
                            >
                                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                                {isSidebarOpen && <span className="font-semibold text-sm">Dashboard</span>}
                            </Link>
                        </div>
                    )}

                    {/* 1. Core Operations (For Everyone) */}
                    <div className="space-y-2">
                        {isSidebarOpen && <div className={`px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 ${isAdminOrManager ? 'mt-4' : ''}`}>Operations</div>}
                        
                        <Link 
                            href={route('yard_scans.create')} 
                            className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${isActive('yard_scans.*') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
                        >
                            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                            {isSidebarOpen && <span className="font-semibold text-sm">New Scan</span>}
                        </Link>

                        <Link 
                            href={route('archive.index')} 
                            className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${isActive('archive.*') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
                        >
                            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                            {isSidebarOpen && <span className="font-semibold text-sm">My Archive</span>}
                        </Link>
                    </div>

                    {/* 2. Administration (Admin & Manager Only) */}
                    {isAdminOrManager && (
                        <div className="space-y-2">
                            {isSidebarOpen && <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-emerald-500/60 mb-2 mt-4">Administration</div>}
                            
                            <Link 
                                href={route('admin.scans.index')} 
                                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${isActive('admin.scans.*') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
                            >
                                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                {isSidebarOpen && <span className="font-semibold text-sm">Global Scans</span>}
                            </Link>

                            <Link 
                                href={route('admin.team.index')} 
                                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${isActive('admin.team.*') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
                            >
                                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                {isSidebarOpen && <span className="font-semibold text-sm">Workforce</span>}
                            </Link>
                        </div>
                    )}
                </nav>

                {/* User Info / Logout */}
                <div className="p-4 border-t border-white/5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center shrink-0 shadow-inner">
                            <span className="text-white font-bold text-sm">{auth.user.name ? auth.user.name.charAt(0).toUpperCase() : 'U'}</span>
                        </div>
                        {isSidebarOpen && (
                            <div className="overflow-hidden">
                                <p className="text-sm font-bold text-white truncate">{auth.user.name}</p>
                                <p className="text-xs text-emerald-400/80 font-semibold uppercase tracking-wider truncate">{userRole}</p>
                            </div>
                        )}
                    </div>
                    
                    <Link 
                        href={route('logout')} 
                        method="post" 
                        as="button"
                        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors ${!isSidebarOpen && 'px-0'}`}
                    >
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        {isSidebarOpen && <span className="text-sm font-bold">Logout</span>}
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#0B1120] relative">
                
                {/* Topbar */}
                <header className="h-20 flex items-center justify-between px-6 border-b border-white/5 bg-[#0F172A]/80 backdrop-blur-md z-10">
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 rounded-lg bg-white/5 text-slate-300 hover:bg-white/10 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" /></svg>
                    </button>

                    <div className="flex items-center gap-4">
                        {/* إخفاء زر الداشبورد من الشريط العلوي في الشاشات الصغيرة للموظف */}
                        {isAdminOrManager && (
                            <Link href={route('admin.dashboard')} className="text-sm font-bold text-slate-300 hover:text-white transition-colors md:hidden">
                                Dashboard
                            </Link>
                        )}
                        {/* Notification Bell */}
                        <button className="p-2.5 rounded-full bg-slate-800 text-slate-300 hover:text-white transition-colors relative shadow-inner">
                            <span className="absolute top-2 right-2.5 w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                            <span className="absolute top-2 right-2.5 w-2 h-2 bg-emerald-500 rounded-full"></span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
                    {children}
                </div>
            </main>
        </div>
    );
}