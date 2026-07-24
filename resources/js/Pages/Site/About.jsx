import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import SiteLayout from '@/Layouts/SiteLayout';

export default function About() {
    const { auth } = usePage().props;

    const architecturalPillars = [
        {
            title: 'Geospatial Ingestion',
            value: 'Input Phase',
            desc: 'Users define precise terminal boundaries using an interactive Leaflet mapping interface. The system captures the polygonal coordinates to strictly limit the scanning zone.'
        },
        {
            title: 'Computer Vision Pipeline',
            value: 'Processing Phase',
            desc: 'Asynchronous backend queues orchestrate the retrieval of high-resolution satellite imagery, feeding it into a specialized AI model trained exclusively for commercial vehicle detection.'
        },
        {
            title: 'Telemetry & Storage',
            value: 'Output Phase',
            desc: 'Detections are translated back into global coordinates, assigned confidence thresholds, and persisted in a relational database to build comprehensive historical audits.'
        }
    ];

    const techStack = [
        {
            layer: 'Client Interface (SPA)',
            tech: 'React, Inertia.js, Tailwind CSS, Leaflet',
            desc: 'A seamless, single-page application delivering real-time map interactivity and state management without full-page reloads.'
        },
        {
            layer: 'Server & Queue Architecture',
            tech: 'Laravel 11, Redis, Horizon',
            desc: 'Robust backend processing that handles concurrent analysis requests, API routing, and strictly enforced role-based access control.'
        },
        {
            layer: 'Data Persistence',
            tech: 'MySQL, Eloquent ORM',
            desc: 'Highly structured relational data mapping for users, scan sessions, polygonal bounds, and individual geospatial detection logs.'
        }
    ];

    return (
        <SiteLayout>
            <Head title="TruckScope | Platform Architecture" />

            {/* Header Section */}
            {/* التعديل الوحيد هنا: تقليل المسافة العلوية pt-8 و md:pt-16 */}
            <section className="pt-8 pb-16 md:pt-16 md:pb-24 border-b border-white/5">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-semibold text-slate-300 mb-6">
                            System Overview
                        </div>
                        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
                            Bridging the gap between <span className="text-slate-400">orbital data</span> and terminal operations.
                        </h1>
                        <p className="text-lg text-slate-400 leading-relaxed">
                            TruckScope replaces manual, error-prone yard auditing with an automated, AI-driven pipeline. 
                            By combining static satellite imagery with advanced object detection, we provide logistics 
                            managers with a scalable tool to quantify fleet presence inside custom-defined geospatial zones.
                        </p>
                    </div>
                </div>
            </section>

            {/* Problem vs Solution (Minimalist Split) */}
            <section className="py-20 border-b border-white/5">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 md:gap-8">
                        <div>
                            <h2 className="text-sm font-bold tracking-widest text-slate-500 uppercase mb-4">The Challenge</h2>
                            <p className="text-slate-300 leading-relaxed">
                                Auditing expansive logistics yards historically requires immense manual effort. Disconnected systems, massive geographic footprints, and temporal delays make it nearly impossible to maintain an accurate, historical count of commercial assets across multiple terminal sectors simultaneously.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-sm font-bold tracking-widest text-emerald-500 uppercase mb-4">The TruckScope Solution</h2>
                            <p className="text-slate-300 leading-relaxed">
                                We digitize the auditing process. By drawing a simple bounding polygon on a digital map, users trigger a highly optimized analysis pipeline. The system handles image acquisition, object isolation, and coordinate mapping automatically, securely logging every verified truck into an immutable historical record.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Architectural Pillars */}
            <section className="py-24 bg-white/[0.01] border-b border-white/5">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Platform Architecture</h2>
                        <p className="text-sm text-slate-400 mt-2">How data flows through the TruckScope ecosystem.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {architecturalPillars.map((pillar, idx) => (
                            <div key={idx} className="p-8 rounded-2xl border border-white/5 bg-slate-900/30 hover:bg-slate-900/60 transition-colors">
                                <div className="text-xs font-bold font-mono text-emerald-400 mb-4">{pillar.value}</div>
                                <h3 className="text-lg font-bold text-white mb-3">{pillar.title}</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    {pillar.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Technology Stack */}
            <section className="py-24 border-b border-white/5">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Technology Stack</h2>
                        <p className="text-sm text-slate-400 mt-2">Built on modern, enterprise-grade frameworks.</p>
                    </div>

                    <div className="space-y-4">
                        {techStack.map((stack, idx) => (
                            <div key={idx} className="p-6 md:p-8 rounded-2xl border border-white/5 bg-transparent hover:bg-white/[0.02] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="md:w-1/3 shrink-0">
                                    <div className="text-sm font-bold text-white">{stack.layer}</div>
                                    <div className="text-xs text-emerald-400 mt-1 font-mono">{stack.tech}</div>
                                </div>
                                <div className="md:w-2/3">
                                    <p className="text-sm text-slate-400 leading-relaxed">{stack.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="py-24">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-4">Ready to automate your yard auditing?</h2>
                    <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                        Access the console to define your first terminal boundary and experience the speed of AI-driven geospatial analysis.
                    </p>
                    
                    <div className="flex items-center justify-center gap-4">
                        {auth?.user ? (
                            <Link
                                href={route('yard_scans.create')}
                                className="px-6 py-3 rounded-xl bg-white text-black font-bold hover:bg-slate-200 transition-colors text-sm"
                            >
                                Open Dispatcher Console
                            </Link>
                        ) : (
                            <Link
                                href={route('login')}
                                className="px-6 py-3 rounded-xl bg-white text-black font-bold hover:bg-slate-200 transition-colors text-sm"
                            >
                                Access Platform
                            </Link>
                        )}
                        <Link
                            href={route('contact')}
                            className="px-6 py-3 rounded-xl border border-white/10 bg-transparent text-white font-semibold hover:bg-white/5 transition-colors text-sm"
                        >
                            Contact Engineering
                        </Link>
                    </div>
                </div>
            </section>

        </SiteLayout>
    );
}