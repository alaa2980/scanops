import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import SiteLayout from '@/Layouts/SiteLayout';

export default function Home() {
    const { auth } = usePage().props;

    return (
        <SiteLayout>
            <Head title="ScanOps | Geospatial Fleet Intelligence" />

            {/* 1. HERO SECTION (تم تقليص المسافة العلوية هنا pt-8 و md:pt-16) */}
            <section className="relative pt-8 pb-16 md:pt-16 md:pb-32 overflow-hidden">
                <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
                    
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-xs font-semibold text-emerald-400 mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        ScanOps Engine v2.0
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[1.05] mb-8">
                        Automate fleet detection <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-slate-400 to-slate-600">from orbit to terminal.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
                        Deploy advanced computer vision over static satellite imagery. Define your boundaries, run the pipeline, and let AI map your assets with pinpoint accuracy.
                    </p>

                    {/* CTA Buttons (تمت إضافة لون النص المضمن للأزرار البيضاء) */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
                        {auth?.user ? (
                            <Link 
                                href={route('yard_scans.create')} 
                                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white font-bold hover:bg-slate-200 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.15)]"
                                style={{ color: '#0f172a' }}
                            >
                                Enter Console
                            </Link>
                        ) : (
                            <Link 
                                href={route('login')} 
                                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white font-bold hover:bg-slate-200 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.15)]"
                                style={{ color: '#0f172a' }}
                            >
                                Get Started
                            </Link>
                        )}
                        <a 
                            href="#architecture" 
                            className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md font-semibold hover:bg-white/10 transition-colors"
                            style={{ color: '#ffffff' }}
                        >
                            Explore Platform
                        </a>
                    </div>

                    {/* Abstract Abstract UI Mockup (The "Wow" Factor) */}
                    <div className="relative mx-auto max-w-4xl aspect-[21/9] rounded-2xl border border-white/10 bg-[#0A0A0A]/80 backdrop-blur-xl shadow-[0_0_80px_rgba(16,185,129,0.1)] overflow-hidden flex flex-col">
                        {/* Mock Window Header */}
                        <div className="h-10 border-b border-white/5 flex items-center px-4 gap-2 bg-white/[0.02]">
                            <div className="w-3 h-3 rounded-full bg-white/10"></div>
                            <div className="w-3 h-3 rounded-full bg-white/10"></div>
                            <div className="w-3 h-3 rounded-full bg-white/10"></div>
                            <div className="mx-auto text-[10px] font-mono text-slate-500 tracking-widest">SCANOPS_TERMINAL_VIEW</div>
                        </div>
                        {/* Mock Map Area */}
                        <div className="flex-1 relative bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.05),transparent_70%)] flex items-center justify-center">
                            {/* Abstract Polygon */}
                            <svg className="w-64 h-64 text-emerald-500/20 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]" viewBox="0 0 100 100">
                                <polygon points="20,80 80,90 90,20 10,10" fill="currentColor" stroke="rgba(16,185,129,0.5)" strokeWidth="1" />
                                {/* Scanning Line Animation */}
                                <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(16,185,129,0.8)" strokeWidth="0.5" className="animate-[bounce_4s_ease-in-out_infinite]" />
                            </svg>
                            {/* Mock Detections */}
                            <div className="absolute top-1/3 left-1/3 w-2 h-2 rounded-[2px] bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,1)]"></div>
                            <div className="absolute top-1/2 left-2/3 w-2 h-2 rounded-[2px] bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,1)]"></div>
                            <div className="absolute bottom-1/3 right-1/3 w-2 h-2 rounded-[2px] bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,1)]"></div>
                            
                            {/* Floating Stats Card inside the mock */}
                            <div className="absolute bottom-4 left-4 rounded-xl border border-white/10 bg-black/50 backdrop-blur-md p-3">
                                <div className="text-[9px] text-slate-400 uppercase tracking-widest mb-1">Detections</div>
                                <div className="text-lg font-bold text-white leading-none">1,402</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. BENTO GRID FEATURES */}
            <section id="architecture" className="py-24 border-t border-white/5 relative z-10">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="mb-16">
                        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">System Capabilities</h2>
                        <p className="text-slate-400 mt-3 text-lg font-light">Engineered for accuracy, scale, and operational simplicity.</p>
                    </div>

                    {/* Grid Container */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        {/* Feature 1 (Spans 2 columns) */}
                        <div className="md:col-span-2 rounded-3xl border border-white/5 bg-[#0A0A0A]/50 backdrop-blur-sm p-8 hover:bg-[#0A0A0A]/80 transition-colors group overflow-hidden relative">
                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 mb-6">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" /></svg>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Precision Targeting</h3>
                                <p className="text-slate-400 leading-relaxed max-w-md">
                                    Draw custom 4-point polygonal boundaries on high-resolution maps to isolate specific terminal zones with absolute precision, filtering out irrelevant noise.
                                </p>
                            </div>
                            {/* Decorative background element */}
                            <div className="absolute right-0 bottom-0 opacity-10 group-hover:opacity-20 transition-opacity translate-x-1/4 translate-y-1/4">
                                <svg className="w-64 h-64 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" /></svg>
                            </div>
                        </div>

                        {/* Feature 2 (1 column) */}
                        <div className="rounded-3xl border border-white/5 bg-[#0A0A0A]/50 backdrop-blur-sm p-8 hover:bg-[#0A0A0A]/80 transition-colors">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-sky-400 mb-6">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25z" /></svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">AI Vision</h3>
                            <p className="text-slate-400 leading-relaxed text-sm">
                                Leverage state-of-the-art computer vision models designed specifically to identify and classify commercial freight trucks from satellite imagery.
                            </p>
                        </div>

                        {/* Feature 3 (Spans 3 columns visually like a wide banner) */}
                        <div className="md:col-span-3 rounded-3xl border border-white/5 bg-[#0A0A0A]/50 backdrop-blur-sm p-8 md:p-12 hover:bg-[#0A0A0A]/80 transition-colors flex flex-col md:flex-row items-center gap-8 justify-between">
                            <div className="max-w-xl">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-purple-400 mb-6">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" /></svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">Geospatial Reports & Archives</h3>
                                <p className="text-slate-400 leading-relaxed">
                                    Generate immediate, audit-ready data sets featuring exact coordinate mapping, confidence scores, and time-stamped logs. Every scan is permanently archived for historical review.
                                </p>
                            </div>
                            
                            {/* Mini UI stat element */}
                            <div className="w-full md:w-auto shrink-0 flex gap-4">
                                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 flex flex-col items-center justify-center min-w-[120px]">
                                    <span className="text-2xl font-black text-white">99.4%</span>
                                    <span className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">Accuracy</span>
                                </div>
                                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 flex flex-col items-center justify-center min-w-[120px]">
                                    <span className="text-2xl font-black text-white">&lt;2s</span>
                                    <span className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">Latency</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* 3. FAQ SECTION - Clean Text */}
            <section className="py-24 border-t border-white/5 relative z-10 bg-gradient-to-b from-transparent to-[#050505]">
                <div className="max-w-3xl mx-auto px-4">
                    <div className="mb-16">
                        <h2 className="text-3xl font-black text-white tracking-tight">Frequently Asked Questions</h2>
                    </div>

                    <div className="space-y-10">
                        <div className="pb-10 border-b border-white/5">
                            <h4 className="text-lg font-bold text-white mb-3">What is ScanOps built for?</h4>
                            <p className="text-slate-400 leading-relaxed">ScanOps is an enterprise-grade platform designed to automate the counting and spatial auditing of commercial transport trucks in designated port terminals and logistics yards.</p>
                        </div>
                        <div className="pb-10 border-b border-white/5">
                            <h4 className="text-lg font-bold text-white mb-3">How does the region selection work?</h4>
                            <p className="text-slate-400 leading-relaxed">Operators interact with a high-resolution Leaflet map to pinpoint exactly 4 coordinates. The system then restricts all computer vision analysis strictly to this defined polygon.</p>
                        </div>
                        <div className="pb-10 border-b border-white/5">
                            <h4 className="text-lg font-bold text-white mb-3">Is the data stored securely?</h4>
                            <p className="text-slate-400 leading-relaxed">Yes. All detection logs, including geospatial coordinates, timestamps, and confidence scores, are permanently stored in a relational database for compliance and historical review.</p>
                        </div>
                    </div>
                </div>
            </section>

        </SiteLayout>
    );
}