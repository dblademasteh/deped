import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import type { User } from '../types';

interface SidebarProps {
    user: User | null;
}

interface NavItem {
    name: string;
    href?: string;
    icon: string;
    children?: { name: string; href: string; icon?: string }[];
}

const navigation: NavItem[] = [
    {
        name: 'Dashboard',
        href: '/dashboard',
        icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    },
    {
        name: 'Records',
        icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
        children: [
            {
                name: 'Employee',
                href: '/records/employee',
                icon: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z',
            },
        ],
    },
    {
        name: 'Settings',
        icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
        children: [
            { name: 'Dropdown Menu', href: '/settings/dropdowns', icon: 'M12 4.5v15m7.5-7.5h-15' },
            { name: 'Form Fields', href: '/settings/form-fields', icon: 'M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776' },
            { name: 'Users', href: '/settings/users', icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.626 2.625 0 015.25 0z' },
        ],
    },
];

function Icon({ path, className = 'w-5 h-5' }: { path: string; className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d={path} />
        </svg>
    );
}

interface PageProps {
    url: string;
}

export default function Sidebar({ user }: SidebarProps) {
    const { url } = usePage<PageProps>();
    const [openMenus, setOpenMenus] = useState<string[]>(['Records']);

    useEffect(() => {
        const activeParent = navigation.find(item =>
            item.children && item.children.some(child =>
                url === child.href || url.startsWith(child.href + '/')
            )
        );
        if (activeParent && !openMenus.includes(activeParent.name)) {
            setOpenMenus(prev => [...prev, activeParent.name]);
        }
    }, [url]);

    const toggleMenu = (name: string) => {
        setOpenMenus(prev =>
            prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
        );
    };

    const isParentActive = (item: NavItem) =>
        item.children && item.children.some(child => url === child.href || url.startsWith(child.href + '/'));

    const isChildActive = (href: string) => url === href || url.startsWith(href + '/');

    return (
        <aside className="hidden lg:flex lg:flex-col w-64 bg-white dark:bg-[#161615] border-r border-[#e3e3e0] dark:border-[#3E3E3A]">
            <div className="flex items-center gap-3 h-16 px-6 border-b border-[#e3e3e0] dark:border-[#3E3E3A]">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#f53003] to-[#d42600] flex items-center justify-center flex-shrink-0 shadow-md">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                    </svg>
                </div>
                <div className="flex-1 min-w-0">
                    <Link href="/dashboard" className="text-sm font-bold text-[#1b1b18] dark:text-[#EDEDEC] block leading-tight">
                        DepEd Records
                    </Link>
                    <p className="text-[10px] text-[#706f6c] dark:text-[#A1A09A] leading-tight truncate">
                        Employee Management System
                    </p>
                </div>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1">
                {navigation.map((item) => {
                    const hasChildren = item.children && item.children.length > 0;
                    const active = isParentActive(item);
                    const isExpanded = openMenus.includes(item.name);

                    if (hasChildren) {
                        return (
                            <div key={item.name}>
                                <button
                                    onClick={() => toggleMenu(item.name)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                                        active
                                            ? 'bg-[#f53003]/10 text-[#f53003] dark:bg-[#f53003]/20'
                                            : 'text-[#706f6c] dark:text-[#A1A09A] hover:bg-[#f5f5f4] dark:hover:bg-[#1e1e1d] hover:text-[#1b1b18] dark:hover:text-[#EDEDEC]'
                                    }`}
                                >
                                    <span className={`w-5 h-5 flex items-center justify-center ${active ? 'text-[#f53003]' : ''}`}>
                                        <Icon path={item.icon} className="w-4.5 h-4.5" />
                                    </span>
                                    <span>{item.name}</span>
                                    <svg className={`w-4 h-4 ml-auto transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                    </svg>
                                </button>
                                {isExpanded && (
                                    <div className="ml-4 mt-2 space-y-1">
                                        {item.children!.map((child) => {
                                            const childActive = isChildActive(child.href);
                                            return (
                                                <Link
                                                    key={child.name}
                                                    href={child.href}
                                                    className={`flex items-center gap-3 px-4 py-2 text-sm rounded-xl transition-all duration-200 ${
                                                        childActive
                                                            ? 'bg-[#f53003]/10 text-[#f53003] dark:bg-[#f53003]/20 border-l-3 border-[#f53003]'
                                                            : 'text-[#706f6c] dark:text-[#A1A09A] hover:bg-[#f5f5f4] dark:hover:bg-[#1e1e1d] hover:text-[#1b1b18] dark:hover:text-[#EDEDEC]'
                                                    }`}
                                                >
                                                    {child.icon && (
                                                        <span className={`w-4 h-4 flex items-center justify-center ${childActive ? 'text-[#f53003]' : ''}`}>
                                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d={child.icon} />
                                                            </svg>
                                                        </span>
                                                    )}
                                                    <span>{child.name}</span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    }

                    return (
                        <Link
                            key={item.name}
                            href={item.href!}
                            className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                                active
                                    ? 'bg-[#f53003]/10 text-[#f53003] dark:bg-[#f53003]/20 border-l-3 border-[#f53003]'
                                    : 'text-[#706f6c] dark:text-[#A1A09A] hover:bg-[#f5f5f4] dark:hover:bg-[#1e1e1d] hover:text-[#1b1b18] dark:hover:text-[#EDEDEC]'
                            }`}
                        >
                            <span className={active ? 'text-[#f53003]' : ''}>
                                <Icon path={item.icon} className="w-4.5 h-4.5" />
                            </span>
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="px-3 py-3 border-t border-[#e3e3e0] dark:border-[#3E3E3A]">
                <div className="flex items-center gap-3 px-3 py-2.5 bg-[#f5f5f4] dark:bg-[#1e1e1d] rounded-xl">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#f53003] to-[#d42600] flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 shadow-md">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#1b1b18] dark:text-[#EDEDEC] truncate">
                            {user?.name || 'User'}
                        </p>
                        <p className="text-xs text-[#706f6c] dark:text-[#A1A09A] truncate">
                            {user?.email || 'user@example.com'}
                        </p>
                        {user?.role && (
                            <span className="inline-block mt-0.5 px-1.5 py-0.25 text-[10px] font-medium bg-[#f53003]/10 text-[#f53003] rounded-full">
                                {user.role}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </aside>
    );
}
