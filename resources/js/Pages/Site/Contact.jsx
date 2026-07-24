import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import SiteLayout from '@/Layouts/SiteLayout';

export default function Contact() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        message: '',
    });

    const submit = (e) => {
        e.preventDefault();
        // post(route('contact.submit'), { onSuccess: () => reset() });
        console.log('Form submitted (UI only)');
    };

    return (
        <SiteLayout>
            <Head title="ScanOps | Contact Engineering & Support" />

            {/* تم التعديل هنا فقط: pt-8 بدلاً من pt-24 و md:pt-16 بدلاً من md:pt-32 */}
            <section className="pt-8 pb-20 md:pt-16 md:pb-28">
                <div className="max-w-6xl mx-auto px-4">
                    
                    {/* Header */}
                    <div className="max-w-2xl mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-semibold text-slate-300 mb-6">
                            Enterprise Support
                        </div>
                        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
                            Get in touch with our <span className="text-slate-400">Engineering Team</span>
                        </h1>
                        <p className="text-lg text-slate-400 leading-relaxed">
                            Whether you need to discuss custom API integrations, request a tailored enterprise deployment, or require technical assistance, our team is ready to help.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-12">
                        
                        {/* Form Section */}
                        <div className="lg:col-span-7">
                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                                        <input 
                                            id="name"
                                            type="text" 
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-slate-600 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-xs font-bold text-slate-400 uppercase tracking-wider">Corporate Email</label>
                                        <input 
                                            id="email"
                                            type="email" 
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-slate-600 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                                            placeholder="john@enterprise.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-xs font-bold text-slate-400 uppercase tracking-wider">Message</label>
                                    <textarea 
                                        id="message"
                                        value={data.message}
                                        onChange={e => setData('message', e.target.value)}
                                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-slate-600 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all min-h-[160px] resize-y"
                                        placeholder="How can we assist your operations?"
                                    ></textarea>
                                </div>

                                <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-6">
                                    <button 
                                        type="button" 
                                        disabled={processing}
                                        className="px-8 py-3.5 rounded-xl bg-white text-black font-bold hover:bg-slate-200 transition-colors text-sm disabled:opacity-50"
                                    >
                                        Submit Request
                                    </button>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                        <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        SLA Response Time: &lt; 24 Hours
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* System & Infra Info */}
                        <div className="lg:col-span-5 space-y-6">
                            
                            {/* Status Card */}
                            <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-8 backdrop-blur-sm">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="font-extrabold text-white text-lg">Infrastructure Status</h3>
                                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-xs font-bold text-emerald-400">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                        All Systems Nominal
                                    </span>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Primary Region</div>
                                        <div className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            MENA Node (Sana'a, Yemen)
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Vision Pipeline</div>
                                        <div className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                                            GPU Inference Engine Active
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Data Governance</div>
                                        <div className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                            Encrypted Telemetry Storage
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Direct Contact */}
                            <div className="rounded-2xl border border-white/5 bg-transparent p-8">
                                <h3 className="font-extrabold text-white text-lg mb-2">Direct Channel</h3>
                                <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                                    For critical system failures or immediate architectural consultations.
                                </p>
                                <div className="flex items-center gap-3 text-white">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    </div>
                                    <span className="font-mono text-sm tracking-wide">support@scanops.enterprise</span>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </section>
        </SiteLayout>
    );
}