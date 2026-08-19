import AppLayout from '../Components/AppLayout';
import ConfirmModal from '../Components/ConfirmModal';
import { useState } from 'react';
import axios from 'axios';
import type { PageProps } from '../types';

interface UserRecord {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
}

interface UserSettingsProps extends PageProps {
    users: UserRecord[];
}

interface UserForm {
    name: string;
    email: string;
    password: string;
    role: string;
}

export default function UserSettings({ auth, users: initialUsers }: UserSettingsProps) {
    const user = auth?.user;
    const [users, setUsers] = useState<UserRecord[]>(initialUsers);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [confirmDelete, setConfirmDelete] = useState<UserRecord | null>(null);
    const [form, setForm] = useState<UserForm>({
        name: '',
        email: '',
        password: '',
        role: 'admin',
    });

    const openCreate = () => {
        setEditingUser(null);
        setForm({ name: '', email: '', password: '', role: 'admin' });
        setErrors({});
        setShowCreateModal(true);
    };

    const openEdit = (u: UserRecord) => {
        setEditingUser(u);
        setForm({
            name: u.name,
            email: u.email,
            password: '',
            role: u.role,
        });
        setErrors({});
        setShowCreateModal(true);
    };

    const handleSave = async () => {
        setSaving(true);
        setErrors({});
        try {
            if (editingUser) {
                await axios.put(`/api/settings/users/${editingUser.id}`, form);
            } else {
                await axios.post('/api/settings/users', form);
            }
            const res = await axios.get('/api/settings/users');
            setUsers(res.data);
            setShowCreateModal(false);
        } catch (err: any) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors || {});
            }
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirmDelete) return;
        try {
            await axios.delete(`/api/settings/users/${confirmDelete.id}`);
            setUsers(users.filter(u => u.id !== confirmDelete.id));
            setConfirmDelete(null);
        } catch (err: any) {
            // silent
        }
    };

    return (
        <AppLayout user={user}>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[#1b1b18] dark:text-[#EDEDEC]">Users</h1>
                        <p className="text-sm text-[#706f6c] dark:text-[#A1A09A] mt-1">
                            {users.length} user{users.length !== 1 ? 's' : ''} registered
                        </p>
                    </div>
                    <button
                        onClick={openCreate}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#f53003] hover:bg-[#d42600] text-white text-sm font-medium rounded-lg transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Add User
                    </button>
                </div>

                <div className="bg-white dark:bg-[#161615] border border-[#e3e3e0] dark:border-[#3E3E3A] rounded-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-[#F5F5F4] dark:bg-[#1e1e1d] border-b-2 border-[#e3e3e0] dark:border-[#3E3E3A]">
                                    <th className="py-3 px-4 text-left text-xs font-semibold text-[#706f6c] dark:text-[#A1A09A] uppercase tracking-wider">Name</th>
                                    <th className="py-3 px-4 text-left text-xs font-semibold text-[#706f6c] dark:text-[#A1A09A] uppercase tracking-wider">Email</th>
                                    <th className="py-3 px-4 text-left text-xs font-semibold text-[#706f6c] dark:text-[#A1A09A] uppercase tracking-wider">Role</th>
                                    <th className="py-3 px-4 text-left text-xs font-semibold text-[#706f6c] dark:text-[#A1A09A] uppercase tracking-wider">Created</th>
                                    <th className="py-3 px-4 text-right text-xs font-semibold text-[#706f6c] dark:text-[#A1A09A] uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center">
                                            <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">No users found</p>
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((u) => (
                                        <tr key={u.id} className="border-b border-[#e3e3e0] dark:border-[#3E3E3A] hover:bg-[#F5F5F4] dark:hover:bg-[#1e1e1d]">
                                            <td className="py-3 px-4 text-sm text-[#1b1b18] dark:text-[#EDEDEC]">{u.name}</td>
                                            <td className="py-3 px-4 text-sm text-[#706f6c] dark:text-[#A1A09A]">{u.email}</td>
                                            <td className="py-3 px-4">
                                                <span className={"px-2 py-0.5 text-xs font-medium rounded-full " + (u.role === 'admin' ? 'bg-[#f53003]/10 text-[#f53003]' : 'bg-blue-500/10 text-blue-600 dark:text-blue-400')}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                                {new Date(u.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <button
                                                    onClick={() => openEdit(u)}
                                                    className="p-1.5 text-[#706f6c] dark:text-[#A1A09A] hover:text-[#f53003] transition-colors"
                                                    title="Edit"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                                                    </svg>
                                                </button>
                                                {u.id !== user?.id && (
                                                    <button
                                                        onClick={() => setConfirmDelete(u)}
                                                        className="p-1.5 text-[#706f6c] dark:text-[#A1A09A] hover:text-red-500 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0H4.5" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Create/Edit Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-[#161615] border border-[#e3e3e0] dark:border-[#3E3E3A] rounded-xl w-full max-w-md shadow-xl">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e3e3e0] dark:border-[#3E3E3A]">
                            <h2 className="text-lg font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">
                                {editingUser ? 'Edit User' : 'New User'}
                            </h2>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="p-1.5 text-[#706f6c] dark:text-[#A1A09A] hover:text-[#1b1b18] dark:hover:text-[#EDEDEC] rounded-lg hover:bg-[#e3e3e0] dark:hover:bg-[#3E3E3A] transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-5 space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-[#706f6c] dark:text-[#A1A09A] mb-1">Name</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Full name"
                                    className="w-full px-3 py-2 text-sm bg-[#FDFDFC] dark:bg-[#0a0a0a] border border-[#e3e3e0] dark:border-[#3E3E3A] rounded-lg text-[#1b1b18] dark:text-[#EDEDEC] placeholder-[#706f6c] dark:placeholder-[#A1A09A] focus:outline-none focus:ring-2 focus:ring-[#f53003]/50 focus:border-[#f53003] transition-colors"
                                />
                                {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-[#706f6c] dark:text-[#A1A09A] mb-1">Email</label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                                    placeholder="name@deped.gov.ph"
                                    className="w-full px-3 py-2 text-sm bg-[#FDFDFC] dark:bg-[#0a0a0a] border border-[#e3e3e0] dark:border-[#3E3E3A] rounded-lg text-[#1b1b18] dark:text-[#EDEDEC] placeholder-[#706f6c] dark:placeholder-[#A1A09A] focus:outline-none focus:ring-2 focus:ring-[#f53003]/50 focus:border-[#f53003] transition-colors"
                                />
                                {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-[#706f6c] dark:text-[#A1A09A] mb-1">Password</label>
                                <input
                                    type="password"
                                    value={form.password}
                                    onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))}
                                    placeholder={editingUser ? 'Leave blank to keep current' : 'Min 8 characters'}
                                    className="w-full px-3 py-2 text-sm bg-[#FDFDFC] dark:bg-[#0a0a0a] border border-[#e3e3e0] dark:border-[#3E3E3A] rounded-lg text-[#1b1b18] dark:text-[#EDEDEC] placeholder-[#706f6c] dark:placeholder-[#A1A09A] focus:outline-none focus:ring-2 focus:ring-[#f53003]/50 focus:border-[#f53003] transition-colors"
                                />
                                {errors.password && <p className="text-[11px] text-red-500 mt-1">{errors.password}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-[#706f6c] dark:text-[#A1A09A] mb-1">Role</label>
                                <select
                                    value={form.role}
                                    onChange={(e) => setForm(prev => ({ ...prev, role: e.target.value }))}
                                    className="w-full px-3 py-2 text-sm bg-[#FDFDFC] dark:bg-[#0a0a0a] border border-[#e3e3e0] dark:border-[#3E3E3A] rounded-lg text-[#1b1b18] dark:text-[#EDEDEC] focus:outline-none focus:ring-2 focus:ring-[#f53003]/50 focus:border-[#f53003] transition-colors"
                                >
                                    <option value="admin">Admin</option>
                                    <option value="staff">Staff</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-[#e3e3e0] dark:border-[#3E3E3A]">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="px-4 py-2 text-sm font-medium text-[#706f6c] dark:text-[#A1A09A] border border-[#e3e3e0] dark:border-[#3E3E3A] rounded-lg hover:bg-[#e3e3e0] dark:hover:bg-[#3E3E3A] transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving || !form.name || !form.email}
                                className="px-4 py-2 text-sm font-medium text-white bg-[#f53003] rounded-lg hover:bg-[#d42600] transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
                            >
                                {saving ? (
                                    <>
                                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Saving...
                                    </>
                                ) : (
                                    'Save'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={!!confirmDelete}
                onClose={() => setConfirmDelete(null)}
                onConfirm={handleDelete}
                title="Delete User"
                message={`Are you sure you want to delete ${confirmDelete?.name}? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                variant="danger"
            />
        </AppLayout>
    );
}
