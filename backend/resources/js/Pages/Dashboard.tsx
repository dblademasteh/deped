import { router } from '@inertiajs/react';
import AppLayout from '../Components/AppLayout';
import type { PageProps } from '../types';

interface Stats {
    total: number;
    male: number;
    female: number;
    salaryGrades: number;
}

interface RecentEmployee {
    id: number;
    first_name: string;
    last_name: string;
    middle_name: string;
    extension_name: string;
    position: string;
    item_number: string;
    salary_grade: string;
    sex: string;
    created_at: string;
}

interface DashboardProps extends PageProps {
    stats: Stats;
    recentEmployees: RecentEmployee[];
}

export default function Dashboard({ auth, stats, recentEmployees }: DashboardProps) {
    const user = auth?.user;

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    const formatName = (emp: RecentEmployee) => {
        const parts = [emp.first_name, emp.middle_name ? emp.middle_name.charAt(0) + '.' : '', emp.last_name, emp.extension_name].filter(Boolean);
        return parts.join(' ');
    };

    const statCards = [
        {
            label: 'Total Employees',
            value: stats.total,
            icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z',
            color: 'bg-[#f53003]/10 text-[#f53003]',
            bg: 'bg-[#f53003]/5 dark:bg-[#f53003]/10',
        },
        {
            label: 'Male',
            value: stats.male,
            icon: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z',
            color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
            bg: 'bg-blue-500/5 dark:bg-blue-500/10',
        },
        {
            label: 'Female',
            value: stats.female,
            icon: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z',
            color: 'bg-pink-500/10 text-pink-600 dark:text-pink-400',
            bg: 'bg-pink-500/5 dark:bg-pink-500/10',
        },
        {
            label: 'With Salary Grade',
            value: stats.salaryGrades,
            icon: 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z',
            color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
            bg: 'bg-emerald-500/5 dark:bg-emerald-500/10',
        },
    ];

    const quickActions = [
        { label: 'View all employees', icon: 'M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z', route: '/records/employee' },
        { label: 'Add new employee', icon: 'M12 4.5v15m7.5-7.5h-15', route: '/records/employee' },
        { label: 'Import CSV', icon: 'M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3', route: '/records/employee' },
        { label: 'Manage dropdowns', icon: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z M15 12a3 3 0 11-6 0 3 3 0 016 0z', route: '/settings/dropdowns' },
        { label: 'Form fields', icon: 'M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776', route: '/settings/form-fields' },
    ];

    return (
        <AppLayout user={user}>
            <div className="space-y-6">
                {/* Welcome Banner */}
                <div className="relative overflow-hidden bg-gradient-to-br from-[#1b1b18] via-[#1b1b18] to-[#2a2a26] dark:from-[#161615] dark:via-[#161615] dark:to-[#1c1c1a] rounded-xl p-6">
                    <div className="relative z-10">
                        <p className="text-[#A1A09A] text-xs font-medium uppercase tracking-wider">{getGreeting()}</p>
                        <h1 className="text-xl font-bold text-white mt-1">
                            {user?.name || 'User'}
                        </h1>
                        <p className="text-[#A1A09A] mt-1.5 text-sm max-w-md">
                            {stats.total === 0
                                ? 'Start by adding employees or importing a CSV file.'
                                : `Managing ${stats.total} employee record${stats.total !== 1 ? 's' : ''} across your department.`}
                        </p>
                        <div className="flex items-center gap-2 mt-4">
                            <button
                                onClick={() => router.visit('/records/employee')}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f53003] hover:bg-[#d42600] text-white text-xs font-medium rounded-lg transition-colors"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
                                </svg>
                                View Records
                            </button>
                            <button
                                onClick={() => router.visit('/records/employee')}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/15 text-white text-xs font-medium rounded-lg transition-colors"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                                Add Employee
                            </button>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-48 h-48 bg-[#f53003]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
                    <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-[#f53003]/3 rounded-full blur-2xl translate-y-1/2" />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {statCards.map((stat) => (
                        <div key={stat.label} className="bg-white dark:bg-[#161615] border border-[#e3e3e0] dark:border-[#3E3E3A] rounded-xl p-4 hover:border-[#f53003]/20 dark:hover:border-[#f53003]/20 transition-all">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${stat.bg}`}>
                                    <svg className={`w-5 h-5 ${stat.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-xs text-[#706f6c] dark:text-[#A1A09A]">{stat.label}</p>
                                    <p className="text-xl font-bold text-[#1b1b18] dark:text-[#EDEDEC] tabular-nums">{stat.value}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Employees - 2 cols */}
                    <div className="lg:col-span-2 bg-white dark:bg-[#161615] border border-[#e3e3e0] dark:border-[#3E3E3A] rounded-xl">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e3e3e0] dark:border-[#3E3E3A]">
                            <div>
                                <h2 className="text-sm font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">Recent Employees</h2>
                                <p className="text-xs text-[#706f6c] dark:text-[#A1A09A] mt-0.5">{recentEmployees.length} most recent</p>
                            </div>
                            <button
                                onClick={() => router.visit('/records/employee')}
                                className="text-xs font-medium text-[#f53003] hover:text-[#d42600] transition-colors"
                            >
                                View all
                            </button>
                        </div>
                        <div className="divide-y divide-[#e3e3e0]/50 dark:divide-[#3E3E3A]/50">
                            {recentEmployees.length === 0 ? (
                                <div className="px-5 py-10 text-center">
                                    <svg className="w-10 h-10 mx-auto text-[#e3e3e0] dark:text-[#3E3E3A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                                    </svg>
                                    <p className="text-sm text-[#706f6c] dark:text-[#A1A09A] mt-3">No employees yet</p>
                                    <p className="text-xs text-[#706f6c] dark:text-[#A1A09A] mt-1">Add your first employee to get started</p>
                                </div>
                            ) : (
                                recentEmployees.map((emp) => (
                                    <div
                                        key={emp.id}
                                        onClick={() => router.visit('/records/employee')}
                                        className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#f5f5f4]/50 dark:hover:bg-[#1e1e1d]/50 cursor-pointer transition-colors"
                                    >
                                        <div className="w-9 h-9 rounded-full bg-[#f53003]/10 dark:bg-[#f53003]/20 flex items-center justify-center text-[#f53003] text-xs font-semibold flex-shrink-0">
                                            {emp.first_name?.charAt(0)}{emp.last_name?.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-[#1b1b18] dark:text-[#EDEDEC] truncate">
                                                {formatName(emp)}
                                            </p>
                                            <p className="text-xs text-[#706f6c] dark:text-[#A1A09A] truncate">
                                                {emp.position || 'No position'}
                                            </p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            {emp.salary_grade && (
                                                <span className="text-xs font-medium text-[#706f6c] dark:text-[#A1A09A] bg-[#e3e3e0]/50 dark:bg-[#3E3E3A]/50 px-2 py-0.5 rounded-full">
                                                    SG-{emp.salary_grade}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Quick Actions - 1 col */}
                    <div className="bg-white dark:bg-[#161615] border border-[#e3e3e0] dark:border-[#3E3E3A] rounded-xl">
                        <div className="px-5 py-4 border-b border-[#e3e3e0] dark:border-[#3E3E3A]">
                            <h2 className="text-sm font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">Quick Actions</h2>
                        </div>
                        <div className="p-3">
                            {quickActions.map((action) => (
                                <button
                                    key={action.label}
                                    onClick={() => router.visit(action.route)}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#706f6c] dark:text-[#A1A09A] hover:bg-[#e3e3e0]/50 dark:hover:bg-[#3E3E3A]/50 hover:text-[#1b1b18] dark:hover:text-[#EDEDEC] transition-colors text-left"
                                >
                                    <svg className="w-4.5 h-4.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d={action.icon} />
                                    </svg>
                                    <span className="font-medium">{action.label}</span>
                                    <svg className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                    </svg>
                                </button>
                            ))}
                        </div>

                        {/* System Info */}
                        <div className="px-5 py-4 border-t border-[#e3e3e0] dark:border-[#3E3E3A]">
                            <h3 className="text-xs font-semibold text-[#706f6c] dark:text-[#A1A09A] uppercase tracking-wider mb-3">System</h3>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-[#706f6c] dark:text-[#A1A09A]">Database</span>
                                    <span className="font-medium text-[#1b1b18] dark:text-[#EDEDEC]">PostgreSQL</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-[#706f6c] dark:text-[#A1A09A]">Framework</span>
                                    <span className="font-medium text-[#1b1b18] dark:text-[#EDEDEC]">Laravel 13</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-[#706f6c] dark:text-[#A1A09A]">Frontend</span>
                                    <span className="font-medium text-[#1b1b18] dark:text-[#EDEDEC]">React + Inertia</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
