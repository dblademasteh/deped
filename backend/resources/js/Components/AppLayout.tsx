import Sidebar from './Sidebar';
import TopBar from './TopBar';
import type { User } from '../types';

interface AppLayoutProps {
    children: React.ReactNode;
    user: User | null;
}

export default function AppLayout({ children, user }: AppLayoutProps) {
    return (
        <div className="flex h-screen overflow-hidden bg-[#FDFDFC] dark:bg-[#0a0a0a]">
            <Sidebar user={user} />
            <div className="flex flex-col flex-1 overflow-hidden">
                <TopBar />
                <main className="flex-1 overflow-hidden p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
