import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import SiteLayout from '@/Layouts/SiteLayout';

export default function Login({ status, canResetPassword }) {
    // استخراج المنطق البرمجي الخاص بـ Laravel Inertia
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <SiteLayout>
            <Head title="TruckScope | Secure Authentication" />

            {/* تم التعديل هنا فقط: pt-8 pb-16 بدلاً من py-16 */}
            <section className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] pt-8 pb-16 px-4">
                
                {/* Header Info */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/5 border border-white/10 mb-6 shadow-inner">
                        <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">Access Console</h1>
                    <p className="text-sm text-slate-400 mt-3">
                        Authenticate to access your enterprise dashboard.
                    </p>
                </div>

                {/* Login Card */}
                <div className="w-full max-w-md rounded-3xl border border-white/5 bg-slate-900/40 p-8 sm:p-10 backdrop-blur-xl shadow-2xl">
                    
                    {/* Status Message (e.g. Password Reset Success) */}
                    {status && (
                        <div className="mb-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-sm font-semibold text-emerald-400">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                Corporate Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className={`w-full bg-slate-900/50 border rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-slate-600 focus:ring-2 outline-none transition-all ${
                                    errors.email 
                                        ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' 
                                        : 'border-white/10 focus:border-emerald-500/50 focus:ring-emerald-500/20'
                                }`}
                                placeholder="name@enterprise.com"
                                autoComplete="username"
                                autoFocus
                            />
                            {errors.email && (
                                <p className="text-xs font-semibold text-red-400 mt-1.5">{errors.email}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    Password
                                </label>
                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                                    >
                                        Forgot password?
                                    </Link>
                                )}
                            </div>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className={`w-full bg-slate-900/50 border rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-slate-600 focus:ring-2 outline-none transition-all ${
                                    errors.password 
                                        ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' 
                                        : 'border-white/10 focus:border-emerald-500/50 focus:ring-emerald-500/20'
                                }`}
                                placeholder="••••••••••••"
                                autoComplete="current-password"
                            />
                            {errors.password && (
                                <p className="text-xs font-semibold text-red-400 mt-1.5">{errors.password}</p>
                            )}
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center">
                            <label className="flex items-center cursor-pointer group">
                                <div className="relative flex items-center justify-center w-5 h-5 rounded border border-white/20 bg-slate-900/50 group-hover:border-emerald-500/50 transition-colors">
                                    <input
                                        type="checkbox"
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="absolute opacity-0 w-full h-full cursor-pointer peer"
                                    />
                                    <svg className={`w-3.5 h-3.5 text-emerald-400 pointer-events-none transition-opacity ${data.remember ? 'opacity-100' : 'opacity-0'}`} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <span className="ml-3 text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors">
                                    Keep me securely logged in
                                </span>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full px-8 py-3.5 rounded-xl bg-emerald-500 text-gray-900 font-extrabold hover:bg-emerald-400 transition-all text-sm disabled:opacity-50 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                        >
                            {processing ? 'Authenticating...' : 'Sign In'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="my-8 flex items-center gap-4">
                        <div className="flex-1 h-px bg-white/5"></div>
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">New to TruckScope?</div>
                        <div className="flex-1 h-px bg-white/5"></div>
                    </div>

                    {/* Registration Link */}
                    <Link
                        href={route('register')}
                        className="w-full block text-center px-8 py-3.5 rounded-xl border border-white/10 bg-transparent text-white font-semibold hover:bg-white/5 transition-colors text-sm"
                    >
                        Request Enterprise Account
                    </Link>

                </div>

                {/* Footer Security Note */}
                <div className="mt-8 flex items-center gap-2 text-xs font-medium text-slate-500">
                    <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    End-to-end encrypted session
                </div>

            </section>
        </SiteLayout>
    );
}