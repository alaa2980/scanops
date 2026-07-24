import React from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function SiteLayout({ children }) {
    const { auth } = usePage().props;

    const navItems = [
        { label: 'Overview', route: 'home' },
        { label: 'Architecture', route: 'about' },
        { label: 'Engineering', route: 'contact' },
    ];

    const isActive = (routeName) => {
        try {
            return route().current(routeName);
        } catch (e) {
            return false;
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-emerald-500/30 selection:text-emerald-200 flex flex-col relative">
            
            {/* 1. Geospatial Grid Background (Modern SaaS touch) */}
            <div className="fixed inset-0 z-0 pointer-events-none flex justify-center">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]"></div>
                {/* Radial fade to hide edges of the grid */}
                <div className="absolute inset-0 bg-[#050505] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,transparent_20%,black_100%)]"></div>
            </div>

            {/* 2. Floating Pill Navbar */}
            <header className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
                <div className="pointer-events-auto flex items-center justify-between w-full max-w-4xl rounded-full border border-white/10 bg-[#0A0A0A]/80 backdrop-blur-xl px-2 py-2 shadow-2xl">
                    
                    {/* Brand */}
                    <Link href={route('home')} className="flex items-center gap-2.5 pl-3 pr-4 group">
                        <div className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center transition-colors">
                            <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h10a4 4 0 004-4M3 15a4 4 0 014-4h10a4 4 0 014  4M3 15V9a6 6 0 0112 0v6m-6-6h6" /></svg>
                        </div>
                        <span className="font-bold tracking-wide text-sm text-white group-hover:text-emerald-400 transition-colors">ScanOps</span>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navItems.map((item, idx) => {
                            const active = isActive(item.route);
                            return (
                                <Link
                                    key={idx}
                                    href={route(item.route)}
                                    className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all ${
                                        active 
                                            ? 'bg-white/10 text-white' 
                                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Auth CTA */}
                    <div className="flex items-center gap-2 pr-1">
                        {auth?.user ? (
                            <Link
                                href={route('yard_scans.create')}
                                className="rounded-full px-4 py-1.5 text-[13px] font-bold bg-white text-black hover:bg-slate-200 transition-all"
                            >
                                Console
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="rounded-full px-4 py-1.5 text-[13px] font-medium text-slate-300 hover:text-white transition-all hidden sm:block"
                                >
                                    Login
                                </Link>
                                <Link
                                    href={route('login')}
                                    className="rounded-full px-4 py-1.5 text-[13px] font-bold bg-white text-black hover:bg-slate-200 transition-all"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* 3. Main Content Wrapper */}
            <main className="relative z-10 flex-1 flex flex-col pt-32 pb-10">
                {children}
            </main>

            {/* 4. Minimalist Bottom Footer */}
            <footer className="relative z-10 border-t border-white/5 bg-[#0A0A0A]/80 backdrop-blur-md">
                <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                        <span>© {new Date().getFullYear()} ScanOps.</span>
                        <div className="w-1 h-1 rounded-full bg-slate-700"></div>
                        <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            All systems nominal
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-6 text-xs font-medium text-slate-500">
                        <Link href={route('home')} className="hover:text-slate-300 transition-colors">Overview</Link>
                        <Link href={route('about')} className="hover:text-slate-300 transition-colors">Architecture</Link>
                        <Link href={route('contact')} className="hover:text-slate-300 transition-colors">Contact</Link>
                        <a href="mailto:support@scanops.enterprise" className="hover:text-slate-300 transition-colors">Support</a>
                    </div>
                </div>
            </footer>

        </div>
    );
}