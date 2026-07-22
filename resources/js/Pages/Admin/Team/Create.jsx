import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function CreateTeamMember() {
    // استخدام useForm من Inertia لإدارة النموذج
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        role: 'dispatcher', // القيمة الافتراضية للموظف التشغيلي
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        // إرسال البيانات وتفريغ حقول كلمة المرور فقط في حال حدوث خطأ
        post(route('admin.team.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AppLayout>
            <Head title="Provision Team Member" />

            <div className="max-w-4xl mx-auto space-y-6">

                {/* Header Section */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-xl">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div>
                            <div className="text-[11px] uppercase tracking-[0.2em] text-emerald-400 font-bold mb-2">
                                Administration / Workforce
                            </div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
                                Provision New Account
                            </h1>
                            <p className="text-sm text-slate-400">
                                Create a new personnel account and assign organizational access levels.
                            </p>
                        </div>

                        <Link 
                            href={route('admin.team.index')}
                            className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors px-5 py-2.5 text-sm font-semibold text-slate-200 flex items-center gap-2 shrink-0"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            Back to Directory
                        </Link>
                    </div>
                </div>

                {/* Form Section */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl shadow-xl overflow-hidden">
                    <div className="px-8 py-5 border-b border-white/5 bg-slate-800/20">
                        <h2 className="text-lg font-bold text-white">Identity & Security Credentials</h2>
                        <p className="text-xs text-slate-400 mt-1">All fields are strictly required for system provisioning.</p>
                    </div>

                    <form onSubmit={submit} className="p-8 space-y-8">
                        
                        {/* Error Summary Box */}
                        {Object.keys(errors).length > 0 && (
                            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 shadow-inner">
                                <div className="flex items-center gap-2 font-bold text-red-400 mb-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                    Security Policy Violation
                                </div>
                                <ul className="list-disc list-inside text-sm text-red-300 space-y-1 ml-1">
                                    {Object.values(errors).map((err, index) => (
                                        <li key={index}>{err}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Name & Email Fields */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Legal Name</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="e.g. John Doe"
                                    className={`w-full bg-slate-800/50 border rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition-all ${errors.name ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/10 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20'}`}
                                />
                                {errors.name && <p className="text-xs text-red-400 font-semibold">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Corporate Email</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    placeholder="e.g. j.doe@company.com"
                                    className={`w-full bg-slate-800/50 border rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition-all ${errors.email ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/10 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20'}`}
                                />
                                {errors.email && <p className="text-xs text-red-400 font-semibold">{errors.email}</p>}
                            </div>
                        </div>

                        {/* Role Selection */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Organizational Role</label>
                            <select
                                value={data.role}
                                onChange={e => setData('role', e.target.value)}
                                className={`w-full bg-slate-800/50 border rounded-xl px-4 py-3 text-sm text-white outline-none transition-all ${errors.role ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/10 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20'}`}
                            >
                                <option value="dispatcher">Dispatcher (Core operational scans & maps access)</option>
                                <option value="manager">Operations Manager (Access to analytics and team overview)</option>
                                <option value="admin">System Administrator (Full platform control & provisioning)</option>
                            </select>
                            {errors.role && <p className="text-xs text-red-400 font-semibold">{errors.role}</p>}
                        </div>

                        {/* Password Fields */}
                        <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Temporary Password</label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    className={`w-full bg-slate-800/50 border rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition-all ${errors.password ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/10 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20'}`}
                                />
                                {errors.password && <p className="text-xs text-red-400 font-semibold">{errors.password}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Confirm Password</label>
                                <input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={e => setData('password_confirmation', e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="pt-8 flex items-center justify-end gap-4">
                            <Link 
                                href={route('admin.team.index')}
                                className="px-6 py-3 rounded-xl border border-white/10 bg-transparent hover:bg-white/5 text-sm font-semibold text-slate-300 transition-colors"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 text-sm font-extrabold transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                            >
                                {processing ? (
                                    <svg className="animate-spin w-4 h-4 text-gray-900" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                )}
                                {processing ? 'Provisioning...' : 'Provision Account'}
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </AppLayout>
    );
}