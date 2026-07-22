import React from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function PublicLayout({ children, title }) {
    const { auth } = usePage().props;

    const navItems = [
        { label: 'Home', route: 'home' },
        { label: 'About', route: 'about' },
        { label: 'Contact', route: 'contact' },
    ];

    const isActive = (routeName) => {
        try {
            return route().current(routeName);
        } catch (e) {
            return false;
        }
    };

    return (
        <div className="min-h-screen bg-[#070A0F] text-slate-100 font-sans selection:bg-emerald-500 selection:text-black flex flex-col">
            
            {/* Subtle Background Elements */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(800px_circle_at_20%_10%,rgba(16,185,129,0.12),transparent_60%),radial-gradient(700px_circle_at_80%_20%,rgba(56,189,248,0.10),transparent_55%),radial-gradient(900px_circle_at_50%_90%,rgba(168,85,247,0.07),transparent_60%)]"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black"></div>
            </div>

            {/* Header / Navbar */}
            <header className="sticky top-0 z-50">
                <div className="backdrop-blur-xl bg-[#070A0F]/70 border-b border-white/10">
                    <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                        
                        {/* Brand Logo */}
                        <Link href={route('home')} className="flex items-center gap-3 group">
                            <div className="h-10 w-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-emerald-500/50 transition-colors shadow-inner">
                                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h10a4 4 0 004-4M3 15a4 4 0 014-4h10a4 4 0 014  4M3 15V9a6 6 0 0112 0v6m-6-6h6" /></svg>
                            </div>
                            <div className="leading-tight">
                                <div className="font-extrabold tracking-tight text-white group-hover:text-emerald-400 transition-colors">ScanOps</div>
                                <div className="text-[11px] text-slate-400 -mt-0.5">Enterprise Fleet Intelligence</div>
                            </div>
                        </Link>

                        {/* Navigation Links */}
                        <nav className="hidden md:flex items-center">
                            <div className="flex items-center gap-1 rounded-2xl border border-white/10 bg-white/5 p-1 backdrop-blur">
                                {navItems.map((item, idx) => {
                                    const active = isActive(item.route);
                                    return (
                                        <Link
                                            key={idx}
                                            href={route(item.route)}
                                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                                                active 
                                                    ? 'bg-white/10 text-white shadow-md' 
                                                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                                            }`}
                                        >
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </div>
                        </nav>

                        {/* CTA Actions */}
                        <div className="flex items-center gap-3">
                            <Link
                                href={route('login')}
                                className="rounded-xl px-4 py-2 text-sm font-semibold border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 transition-all"
                            >
                                Login
                            </Link>

                            {auth?.user ? (
                                <Link
                                    href={route('yard_scans.create')}
                                    className="rounded-xl px-4 py-2 text-sm font-extrabold bg-emerald-500 text-gray-900 hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hidden sm:inline-flex"
                                >
                                    Open Dashboard
                                </Link>
                            ) : (
                                <Link
                                    href={route('login')}
                                    className="rounded-xl px-4 py-2 text-sm font-extrabold bg-emerald-500 text-gray-900 hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hidden sm:inline-flex"
                                >
                                    Get Started
                                </Link>
                            )}
                        </div>

                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-white/10 bg-black/40 backdrop-blur-md">
                <div className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-8">
                    <div>
                        <div className="font-extrabold text-lg text-white flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> ScanOps AI
                        </div>
                        <p className="text-sm text-slate-400 mt-3 leading-6 max-w-sm">
                            Next-generation geospatial intelligence platform utilizing computer vision and static satellite imagery for automated port and yard truck tracking.
                        </p>
                    </div>

                    <div className="text-sm text-slate-400">
                        <div className="font-bold text-slate-200 mb-3 tracking-wider uppercase text-xs">Platform Navigation</div>
                        <div className="space-y-2">
                            <Link className="block hover:text-white transition-colors" href={route('home')}>Home Overview</Link>
                            <Link className="block hover:text-white transition-colors" href={route('about')}>About Technology</Link>
                            <Link className="block hover:text-white transition-colors" href={route('contact')}>Contact & Support</Link>
                        </div>
                    </div>

                    <div className="text-sm text-slate-400">
                        <div className="font-bold text-slate-200 mb-3 tracking-wider uppercase text-xs">System Security</div>
                        <div className="space-y-2 text-slate-300">
                            <div className="flex items-center gap-2"><svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg> <span>support@scanops.enterprise</span></div>
                            <div className="flex items-center gap-2"><svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg> <span>Encrypted GIS Pipeline</span></div>
                        </div>
                    </div>
                </div>

                <div className="text-xs text-slate-500 border-t border-white/5 py-5">
                    <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <span>© {new Date().getFullYear()} ScanOps Enterprise. All rights reserved.</span>
                        <span className="text-slate-400 font-mono">Engineered with Laravel • React • Tailwind • Leaflet GIS</span>
                    </div>
                </div>
            </footer>

        </div>
    );
}