import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import SiteLayout from '@/Layouts/SiteLayout';

export default function Home() {
    const { auth } = usePage().props;

    const steps = [
        {
            title: 'Define Sector Boundary',
            desc: 'Interactively pinpoint 4 precise coordinates on high-resolution satellite imagery to enclose the port terminal or logistics yard.',
            icon: (
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            ),
            bg: 'bg-emerald-500/15 border-emerald-500/30'
        },
        {
            title: 'AI Vision Pipeline',
            desc: 'Our deep learning models execute automated object detection to isolate commercial transport vehicles within the target boundary.',
            icon: (
                <svg className="w-5 h-5 text-sky-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
            ),
            bg: 'bg-sky-500/15 border-sky-500/30'
        },
        {
            title: 'Geospatial Intelligence',
            desc: 'Instantly retrieve accurate inventory metrics, spatial distribution markers, and audit-ready reports stored securely in the cloud.',
            icon: (
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
            ),
            bg: 'bg-purple-500/15 border-purple-500/30'
        }
    ];

    const faqs = [
        {
            q: 'What objects does the computer vision pipeline detect?',
            a: 'The core neural engine specializes in commercial transport trucks and logistics assets, filtering out irrelevant objects to extract clean, verified operational counts.'
        },
        {
            q: 'How are terminal sectors defined on the map?',
            a: 'Operators zoom into the desired port or terminal area and designate 4 distinct geospatial points to generate a restricted polygonal analysis boundary.'
        },
        {
            q: 'Where is the analysis telemetry stored?',
            a: 'All session metrics, bounding coordinates, and detection timestamps are persisted in a secure database layer for compliance reporting and historical auditing.'
        },
        {
            q: 'Can supervisors review past scanning operations?',
            a: 'Yes. Authorized personnel can access the complete enterprise archive at any time, complete with live Leaflet map reconstruction capabilities.'
        }
    ];

    return (
        <SiteLayout>
            <Head title="ScanOps | Enterprise Fleet Intelligence" />

            {/* Hero Section */}
            <section className="max-w-6xl mx-auto px-4 pt-20 pb-16">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    
                    {/* Left Column (Copywriting) */}
                    <div>
                        <div className="inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-emerald-400 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 shadow-inner">
                            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            Geospatial AI & Automated Port Monitoring
                        </div>

                        <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
                            Port Logistics Intelligence <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-400">Powered by AI</span>
                        </h1>

                        <p className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
                            Automate fleet counting and spatial auditing across complex terminal yards using high-resolution satellite imagery, custom polygonal boundaries, and advanced computer vision.
                        </p>

                        <div className="mt-8 flex flex-wrap items-center gap-4">
                            <Link
                                href={route('login')}
                                className="rounded-2xl px-8 py-4 bg-emerald-500 text-gray-900 font-extrabold hover:bg-emerald-400 transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] text-sm"
                            >
                                Access Platform
                            </Link>

                            {auth?.user ? (
                                <Link
                                    href={route('yard_scans.create')}
                                    className="rounded-2xl px-8 py-4 border border-white/10 bg-white/5 hover:bg-white/10 transition-all font-bold text-sm text-slate-200"
                                >
                                    Open Dispatcher Console
                                </Link>
                            ) : (
                                <Link
                                    href={route('login')}
                                    className="rounded-2xl px-8 py-4 border border-white/10 bg-white/5 hover:bg-white/10 transition-all font-bold text-sm text-slate-200"
                                >
                                    Request Enterprise Trial
                                </Link>
                            )}
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="mt-12 grid grid-cols-3 gap-4">
                            <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 backdrop-blur-md">
                                <div className="text-2xl sm:text-3xl font-black text-white">4-Point</div>
                                <div className="text-xs text-slate-400 mt-1 font-semibold">Polygon Zoning</div>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 backdrop-blur-md">
                                <div className="text-2xl sm:text-3xl font-black text-emerald-400">99.4%</div>
                                <div className="text-xs text-slate-400 mt-1 font-semibold">Detection Accuracy</div>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 backdrop-blur-md">
                                <div className="text-2xl sm:text-3xl font-black text-sky-400">GIS</div>
                                <div className="text-xs text-slate-400 mt-1 font-semibold">Leaflet Mapping</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Workflow Card Component) */}
                    <div className="relative">
                        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-950/90 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
                            
                            <div className="flex items-center justify-between pb-6 border-b border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                    <span className="font-extrabold text-white tracking-wide">Operational Workflow</span>
                                </div>
                                <span className="text-xs font-bold font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">3-Step Pipeline</span>
                            </div>

                            <div className="mt-6 space-y-4">
                                {steps.map((step, idx) => (
                                    <div key={idx} className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 hover:bg-white/[0.04] transition-colors">
                                        <div className="flex items-start gap-4">
                                            <div className={`h-10 w-10 rounded-xl border flex items-center justify-center shrink-0 shadow-inner ${step.bg}`}>
                                                {step.icon}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white text-base">{step.title}</div>
                                                <div className="text-sm text-slate-400 mt-1 leading-relaxed">{step.desc}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-amber-200/90 flex items-start gap-3">
                                <svg className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                <div>
                                    <span className="font-bold text-amber-400">Security Notice:</span> Telemetry filters out-of-bounds anomalies automatically, verifying that objects strictly fall within designated terminal polygons.
                                </div>
                            </div>
                        </div>

                        {/* Ambient Glow Effects */}
                        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none"></div>
                        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-sky-500/15 blur-3xl pointer-events-none"></div>
                    </div>

                </div>
            </section>

            {/* FAQ Section */}
            <section className="max-w-6xl mx-auto px-4 py-16">
                <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-8 sm:p-12 backdrop-blur-xl shadow-xl">
                    <div className="max-w-2xl">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Frequently Asked Questions</h2>
                        <p className="text-sm text-slate-400 mt-2">Everything you need to know about the ScanOps geospatial analytics platform.</p>
                    </div>

                    <div className="mt-8 grid md:grid-cols-2 gap-6">
                        {faqs.map((faq, index) => (
                            <div key={index} className="rounded-2xl border border-white/5 bg-slate-800/40 p-6 shadow-inner">
                                <h3 className="font-bold text-white text-base">{faq.q}</h3>
                                <p className="mt-2 text-sm text-slate-300 leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </SiteLayout>
    );
}