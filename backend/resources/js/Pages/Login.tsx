import { useState } from 'react';
import { useForm, Head } from '@inertiajs/react';
import { useTheme } from '../Contexts/ThemeContext';
import type { PageProps } from '../types';

interface LoginProps extends PageProps {
    status?: string;
    canResetPassword?: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { theme, setTheme } = useTheme();
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const cycleTheme = () => {
        if (theme === 'light') setTheme('dark');
        else if (theme === 'dark') setTheme('system');
        else setTheme('light');
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login', {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Log in" />

            <div className="min-h-screen flex bg-[#FDFDFC] dark:bg-[#0a0a0a]">
                {/* Left Panel - Branding */}
                <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#1b1b18] dark:bg-[#161615]">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#f53003]/20 via-transparent to-[#f53003]/5" />
                    <div className="relative z-10 flex flex-col justify-between p-12 w-full">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#f53003] flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                                </svg>
                            </div>
                            <span className="text-xl font-semibold text-white">Dashboard</span>
                        </div>

                        {/* Center Content */}
                        <div className="flex-1 flex flex-col justify-center max-w-md">
                            <h1 className="text-4xl font-bold text-white leading-tight mb-6">
                                Build something{' '}
                                <span className="text-[#f53003]">remarkable</span>
                            </h1>
                            <p className="text-lg text-[#A1A09A] leading-relaxed">
                                Access your dashboard to manage projects, track metrics, and collaborate with your team in real-time.
                            </p>
                        </div>

                        {/* Bottom Stats */}
                        <div className="flex gap-12">
                            <div>
                                <p className="text-3xl font-bold text-white">10k+</p>
                                <p className="text-sm text-[#A1A09A] mt-1">Active users</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-white">99.9%</p>
                                <p className="text-sm text-[#A1A09A] mt-1">Uptime</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-white">24/7</p>
                                <p className="text-sm text-[#A1A09A] mt-1">Support</p>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-20 right-20 w-64 h-64 bg-[#f53003]/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 left-20 w-48 h-48 bg-[#f53003]/5 rounded-full blur-2xl" />
                </div>

                {/* Right Panel - Form */}
                <div className="flex-1 flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 lg:p-8">
                        <div className="flex items-center gap-3 lg:hidden">
                            <div className="w-8 h-8 rounded-lg bg-[#f53003] flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                                </svg>
                            </div>
                            <span className="text-lg font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">Dashboard</span>
                        </div>

                        <button
                            onClick={cycleTheme}
                            className="p-2.5 rounded-lg text-[#706f6c] dark:text-[#A1A09A] hover:bg-[#e3e3e0]/50 dark:hover:bg-[#3E3E3A]/50 transition-colors"
                            title={`Theme: ${theme}`}
                            aria-label={`Switch theme (current: ${theme})`}
                        >
                            {theme === 'light' && (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                                </svg>
                            )}
                            {theme === 'dark' && (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                                </svg>
                            )}
                            {theme === 'system' && (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 7.41A2.25 2.25 0 012.25 5.495V5.25" />
                                </svg>
                            )}
                        </button>
                    </div>

                    {/* Form Section */}
                    <div className="flex-1 flex items-center justify-center px-6 lg:px-12">
                        <div className="w-full max-w-sm">
                            <div className="mb-10">
                                <h2 className="text-2xl font-bold text-[#1b1b18] dark:text-[#EDEDEC] mb-2">
                                    Welcome back
                                </h2>
                                <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                    Sign in to your account to continue
                                </p>
                            </div>

                            {status && (
                                <div className="mb-6 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                                    <p className="text-sm text-green-700 dark:text-green-300">{status}</p>
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-5">
                                {/* Email Field */}
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-[#1b1b18] dark:text-[#EDEDEC] mb-2"
                                    >
                                        Email address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <svg
                                                className={`w-5 h-5 transition-colors ${
                                                    focusedField === 'email'
                                                        ? 'text-[#f53003]'
                                                        : 'text-[#706f6c] dark:text-[#A1A09A]'
                                                }`}
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={1.5}
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                            </svg>
                                        </div>
                                        <input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            onFocus={() => setFocusedField('email')}
                                            onBlur={() => setFocusedField(null)}
                                            className={`w-full pl-11 pr-4 py-3 rounded-lg border bg-white dark:bg-[#0a0a0a] text-[#1b1b18] dark:text-[#EDEDEC] placeholder-[#706f6c] dark:placeholder-[#A1A09A] transition-all duration-200 text-[15px] ${
                                                errors.email
                                                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                                                    : 'border-[#e3e3e0] dark:border-[#3E3E3A] focus:border-[#f53003] focus:ring-2 focus:ring-[#f53003]/20'
                                            }`}
                                            placeholder="you@example.com"
                                            autoComplete="username"
                                            autoFocus
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="mt-2 text-sm text-red-500 flex items-center gap-1.5">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                            </svg>
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                {/* Password Field */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label
                                            htmlFor="password"
                                            className="block text-sm font-medium text-[#1b1b18] dark:text-[#EDEDEC]"
                                        >
                                            Password
                                        </label>
                                        {canResetPassword && (
                                            <a
                                                href="#"
                                                className="text-sm text-[#f53003] hover:text-[#d42600] dark:hover:text-[#ff6b3d] transition-colors font-medium"
                                            >
                                                Forgot password?
                                            </a>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <svg
                                                className={`w-5 h-5 transition-colors ${
                                                    focusedField === 'password'
                                                        ? 'text-[#f53003]'
                                                        : 'text-[#706f6c] dark:text-[#A1A09A]'
                                                }`}
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={1.5}
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                            </svg>
                                        </div>
                                        <input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            onFocus={() => setFocusedField('password')}
                                            onBlur={() => setFocusedField(null)}
                                            className={`w-full pl-11 pr-12 py-3 rounded-lg border bg-white dark:bg-[#0a0a0a] text-[#1b1b18] dark:text-[#EDEDEC] placeholder-[#706f6c] dark:placeholder-[#A1A09A] transition-all duration-200 text-[15px] ${
                                                errors.password
                                                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                                                    : 'border-[#e3e3e0] dark:border-[#3E3E3A] focus:border-[#f53003] focus:ring-2 focus:ring-[#f53003]/20'
                                            }`}
                                            placeholder="Enter your password"
                                            autoComplete="current-password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#706f6c] dark:text-[#A1A09A] hover:text-[#1b1b18] dark:hover:text-[#EDEDEC] transition-colors"
                                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        >
                                            {showPassword ? (
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="mt-2 text-sm text-red-500 flex items-center gap-1.5">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                            </svg>
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                {/* Remember Me */}
                                <div className="flex items-center">
                                    <button
                                        type="button"
                                        role="checkbox"
                                        aria-checked={data.remember}
                                        onClick={() => setData('remember', !data.remember)}
                                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                                            data.remember
                                                ? 'bg-[#f53003] border-[#f53003]'
                                                : 'border-[#e3e3e0] dark:border-[#3E3E3A] hover:border-[#f53003]'
                                        }`}
                                    >
                                        {data.remember && (
                                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                            </svg>
                                        )}
                                    </button>
                                    <label
                                        htmlFor="remember"
                                        className="ml-3 text-sm text-[#706f6c] dark:text-[#A1A09A] cursor-pointer select-none"
                                        onClick={() => setData('remember', !data.remember)}
                                    >
                                        Remember me for 30 days
                                    </label>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full py-3 px-4 bg-[#f53003] hover:bg-[#d42600] active:bg-[#b82000] text-white font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#f53003] focus:ring-offset-2 dark:focus:ring-offset-[#0a0a0a] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {processing ? (
                                        <>
                                            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Signing in...
                                        </>
                                    ) : (
                                        <>
                                            Sign in
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Divider */}
                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-[#e3e3e0] dark:border-[#3E3E3A]" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-[#FDFDFC] dark:bg-[#0a0a0a] text-[#706f6c] dark:text-[#A1A09A]">
                                        Demo credentials
                                    </span>
                                </div>
                            </div>

                            {/* Demo Info */}
                            <div className="p-4 rounded-lg bg-[#e3e3e0]/30 dark:bg-[#3E3E3A]/30 border border-[#e3e3e0] dark:border-[#3E3E3A]">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#f53003]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <svg className="w-4 h-4 text-[#f53003]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-[#1b1b18] dark:text-[#EDEDEC]">
                                            Test credentials
                                        </p>
                                        <div className="mt-1 space-y-1">
                                            <p className="text-xs text-[#706f6c] dark:text-[#A1A09A]">
                                                <span className="font-medium">Admin:</span>
                                                <code className="ml-1 px-1.5 py-0.5 rounded bg-[#e3e3e0]/50 dark:bg-[#3E3E3A]/50 text-[#f53003] font-mono text-xs">
                                                    test@example.com
                                                </code>
                                                <span className="mx-1 text-[#706f6c] dark:text-[#A1A09A]">/</span>
                                                <code className="px-1.5 py-0.5 rounded bg-[#e3e3e0]/50 dark:bg-[#3E3E3A]/50 text-[#f53003] font-mono text-xs">
                                                    password
                                                </code>
                                            </p>
                                            <p className="text-xs text-[#706f6c] dark:text-[#A1A09A]">
                                                <span className="font-medium">Staff:</span>
                                                <code className="ml-1 px-1.5 py-0.5 rounded bg-[#e3e3e0]/50 dark:bg-[#3E3E3A]/50 text-[#f53003] font-mono text-xs">
                                                    staff@example.com
                                                </code>
                                                <span className="mx-1 text-[#706f6c] dark:text-[#A1A09A]">/</span>
                                                <code className="px-1.5 py-0.5 rounded bg-[#e3e3e0]/50 dark:bg-[#3E3E3A]/50 text-[#f53003] font-mono text-xs">
                                                    password
                                                </code>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <p className="mt-8 text-center text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                Don't have an account?{' '}
                                <a href="#" className="text-[#f53003] hover:text-[#d42600] dark:hover:text-[#ff6b3d] font-medium transition-colors">
                                    Contact sales
                                </a>
                            </p>
                        </div>
                    </div>

                    {/* Bottom Footer */}
                    <div className="p-6 lg:p-8">
                        <p className="text-xs text-center text-[#706f6c] dark:text-[#A1A09A]">
                            Protected by industry-standard encryption. By signing in, you agree to our{' '}
                            <a href="#" className="underline hover:text-[#f53003] transition-colors">Terms</a>
                            {' '}and{' '}
                            <a href="#" className="underline hover:text-[#f53003] transition-colors">Privacy Policy</a>.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
