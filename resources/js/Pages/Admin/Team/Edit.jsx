import React from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function EditTeamMember({ user }) {
    // تهيئة حالة النموذج بالبيانات الحالية للمستخدم
    const { data, setData, put, processing, errors, reset } = useForm({
        name: user.name || '',
        email: user.email || '',
        role: user.role?.toLowerCase() || 'dispatcher',
        password: '',
        password_confirmation: '',
    });

    // دالة تحديث البيانات
    const submit = (e) => {
        e.preventDefault();
        put(route('admin.team.update', user.id), {
            // تفريغ حقول كلمة المرور عند نجاح التحديث
            onSuccess: () => reset('password', 'password_confirmation'),
        });
    };

    // دالة الحذف
    const handleDelete = () => {
        if (confirm('CRITICAL ACTION: Are you absolutely sure you want to delete this user? All their access will be revoked.')) {
            router.delete(route('admin.team.destroy', user.id));
        }
    };

    return (
        <AppLayout>
            <Head title={`Edit Personnel | ${user.name}`} />

            <div className="max-w-4xl mx-auto space-y-6">

                {/* Header Section */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-xl">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div>
                            <div className="text-[11px] uppercase tracking-[0.2em] text-emerald-400 font-bold mb-2">
                                Administration / Workforce
                            </div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
                                Modify Access Profile
                            </h1>
                            <p className="text-sm text-slate-400">
                                Update organizational details, adjust access roles, or reset security credentials for this personnel.
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

                {/* Main Edit Form */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl shadow-xl overflow-hidden">
                    <div className="px-8 py-5 border-b border-white/5 bg-slate-800/20 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-white">Profile Configuration</h2>
                            <p className="text-xs text-slate-400 mt-1">Adjust the core settings for this account.</p>
                        </div>
                        <div className="text-xs font-mono text-slate-300 rounded-xl border border-white/10 bg-black/40 px-4 py-2">
                            UID: <span className="font-extrabold text-emerald-400">#{user.id}</span>
                        </div>
                    </div>

                    <form onSubmit={submit} className="p-8 space-y-8">
                        
                        {/* Error Summary Box */}
                        {Object.keys(errors).length > 0 && (
                            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 shadow-inner">
                                <div className="flex items-center gap-2 font-bold text-red-400 mb-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                    Update Failed: Validation Errors
                                </div>
                                <ul className="list-disc list-inside text-sm text-red-300 space-y-1 ml-1">
                                    {Object.values(errors).map((err, index) => (
                                        <li key={index}>{err}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Basic Info */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Legal Name</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
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
                                <option value="dispatcher">Dispatcher (Core operational access)</option>
                                <option value="manager">Operations Manager (Analytics & team oversight)</option>
                                <option value="admin">System Administrator (Full platform control)</option>
                            </select>
                            {errors.role && <p className="text-xs text-red-400 font-semibold">{errors.role}</p>}
                        </div>

                        {/* Security Override */}
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-6 space-y-4">
                            <div>
                                <h3 className="font-extrabold text-white">Security Override (Optional)</h3>
                                <p className="text-xs text-slate-400 mt-1">Leave these fields entirely blank if you do not wish to reset the user's password.</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 pt-2">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">New Password</label>
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        placeholder="Leave blank to keep current"
                                        autoComplete="new-password"
                                        className={`w-full bg-slate-900 border rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition-all ${errors.password ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/10 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20'}`}
                                    />
                                    {errors.password && <p className="text-xs text-red-400 font-semibold">{errors.password}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Confirm Password</label>
                                    <input
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={e => setData('password_confirmation', e.target.value)}
                                        placeholder="Leave blank to keep current"
                                        autoComplete="new-password"
                                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="pt-4 flex items-center justify-end gap-4 border-t border-white/5 mt-8">
                            <Link 
                                href={route('admin.team.index')}
                                className="px-6 py-3 rounded-xl border border-white/10 bg-transparent hover:bg-white/5 text-sm font-semibold text-slate-300 transition-colors"
                            >
                                Cancel Changes
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 text-sm font-extrabold transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                            >
                                {processing ? (
                                    <svg className="animate-spin w-4 h-4 text-gray-900" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                )}
                                {processing ? 'Committing...' : 'Commit Changes'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Danger Zone */}
                <div className="bg-red-900/10 border border-red-500/20 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 mt-8">
                    <div>
                        <h3 className="text-lg font-extrabold text-red-400 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            Danger Zone
                        </h3>
                        <p className="text-sm text-red-200/70 mt-2 max-w-xl">
                            Permanently delete this user account. This action cannot be undone and will immediately revoke all system access for <span className="font-bold text-red-200">{user.email}</span>.
                        </p>
                    </div>
                    <button 
                        onClick={handleDelete}
                        className="w-full md:w-auto px-6 py-3 rounded-xl bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/30 text-red-400 font-extrabold text-sm transition-colors flex items-center justify-center gap-2 shrink-0"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        Revoke & Delete
                    </button>
                </div>

            </div>
        </AppLayout>
    );
}