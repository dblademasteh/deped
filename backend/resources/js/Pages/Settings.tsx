import AppLayout from '../Components/AppLayout';
import ConfirmModal from '../Components/ConfirmModal';
import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import type { PageProps } from '../types';

interface DropdownEntry {
    id: number;
    dropdown_id: number;
    label: string;
    value: string;
    sort_order: number;
    is_active: boolean;
}

interface Dropdown {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    entries: DropdownEntry[];
}

interface SettingsProps extends PageProps {
    dropdowns: Dropdown[];
}

export default function Settings({ auth, dropdowns: initialDropdowns }: SettingsProps) {
    const user = auth?.user;
    const [dropdowns, setDropdowns] = useState<Dropdown[]>(initialDropdowns);
    const [selectedDropdown, setSelectedDropdown] = useState<Dropdown | null>(initialDropdowns[0] || null);
    const [showNewDropdown, setShowNewDropdown] = useState(false);
    const [newDropdownName, setNewDropdownName] = useState('');
    const [newDropdownSlug, setNewDropdownSlug] = useState('');
    const [newDropdownDesc, setNewDropdownDesc] = useState('');

    // Entry modal
    const [showEntryModal, setShowEntryModal] = useState(false);
    const [editingEntry, setEditingEntry] = useState<DropdownEntry | null>(null);
    const [entryLabel, setEntryLabel] = useState('');
    const [entryValue, setEntryValue] = useState('');
    const [entryActive, setEntryActive] = useState(true);
    const [saving, setSaving] = useState(false);

    // Confirm modals
    const [confirmDeleteDropdown, setConfirmDeleteDropdown] = useState<Dropdown | null>(null);
    const [confirmDeleteEntry, setConfirmDeleteEntry] = useState<DropdownEntry | null>(null);

    const refresh = async () => {
        const res = await axios.get('/api/settings/dropdowns');
        setDropdowns(res.data);
        if (selectedDropdown) {
            const updated = res.data.find((d: Dropdown) => d.id === selectedDropdown.id);
            if (updated) setSelectedDropdown(updated);
        }
    };

    const createDropdown = async () => {
        if (!newDropdownName) return;
        try {
            const slug = newDropdownSlug || newDropdownName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            await axios.post('/api/settings/dropdowns', {
                name: newDropdownName,
                slug,
                description: newDropdownDesc || null,
            });
            setShowNewDropdown(false);
            setNewDropdownName('');
            setNewDropdownSlug('');
            setNewDropdownDesc('');
            await refresh();
        } catch (err) {
            // silent
        }
    };

    const deleteDropdown = async (id: number) => {
        await axios.delete(`/api/settings/dropdowns/${id}`);
        if (selectedDropdown?.id === id) {
            setSelectedDropdown(dropdowns.find(d => d.id !== id) || null);
        }
        await refresh();
    };

    const openNewEntry = () => {
        setEditingEntry(null);
        setEntryLabel('');
        setEntryValue('');
        setEntryActive(true);
        setShowEntryModal(true);
    };

    const openEditEntry = (entry: DropdownEntry) => {
        setEditingEntry(entry);
        setEntryLabel(entry.label);
        setEntryValue(entry.value);
        setEntryActive(entry.is_active);
        setShowEntryModal(true);
    };

    const saveEntry = async () => {
        if (!selectedDropdown || !entryLabel || !entryValue) return;
        setSaving(true);
        try {
            if (editingEntry) {
                await axios.put(`/api/settings/dropdowns/${selectedDropdown.id}/entries/${editingEntry.id}`, {
                    label: entryLabel,
                    value: entryValue,
                    is_active: entryActive,
                });
            } else {
                await axios.post(`/api/settings/dropdowns/${selectedDropdown.id}/entries`, {
                    label: entryLabel,
                    value: entryValue,
                    is_active: entryActive,
                    sort_order: selectedDropdown.entries.length,
                });
            }
            setShowEntryModal(false);
            await refresh();
        } catch (err) {
            // silent
        } finally {
            setSaving(false);
        }
    };

    const deleteEntry = async (entryId: number) => {
        if (!selectedDropdown) return;
        await axios.delete(`/api/settings/dropdowns/${selectedDropdown.id}/entries/${entryId}`);
        await refresh();
    };

    const toggleEntryActive = async (entry: DropdownEntry) => {
        if (!selectedDropdown) return;
        await axios.put(`/api/settings/dropdowns/${selectedDropdown.id}/entries/${entry.id}`, {
            label: entry.label,
            value: entry.value,
            is_active: !entry.is_active,
        });
        await refresh();
    };

    const inputClass = "w-full px-3 py-2 text-sm bg-[#FDFDFC] dark:bg-[#0a0a0a] border border-[#e3e3e0] dark:border-[#3E3E3A] rounded-lg text-[#1b1b18] dark:text-[#EDEDEC] placeholder-[#706f6c] dark:placeholder-[#A1A09A] focus:outline-none focus:ring-2 focus:ring-[#f53003]/50 focus:border-[#f53003] transition-colors";
    const labelClass = "block text-xs font-medium text-[#706f6c] dark:text-[#A1A09A] mb-1";

    return (
        <AppLayout user={user}>
            <div className="flex flex-col h-full gap-4">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-[#1b1b18] dark:text-[#EDEDEC] tracking-tight">Settings</h1>
                    <p className="text-sm text-[#706f6c] dark:text-[#A1A09A] mt-1">Manage dropdown entries used across the application</p>
                </div>

                {/* Content */}
                <div className="flex-1 min-h-0 flex gap-4">
                    {/* Sidebar - Dropdown list */}
                    <div className="w-72 flex-shrink-0 bg-white dark:bg-[#161615] border border-[#e3e3e0] dark:border-[#3E3E3A] rounded-xl flex flex-col overflow-hidden">
                        <div className="p-4 border-b border-[#e3e3e0] dark:border-[#3E3E3A] flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">Dropdowns</h2>
                            <button
                                onClick={() => setShowNewDropdown(true)}
                                className="p-1.5 text-[#f53003] hover:bg-[#f53003]/10 rounded-lg transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                            </button>
                        </div>

                        {showNewDropdown && (
                            <div className="p-4 border-b border-[#e3e3e0] dark:border-[#3E3E3A] space-y-3 bg-[#FAFAF9] dark:bg-[#1a1a18]">
                                <input
                                    type="text"
                                    placeholder="Name (e.g. Position)"
                                    value={newDropdownName}
                                    onChange={(e) => setNewDropdownName(e.target.value)}
                                    className={inputClass}
                                    autoFocus
                                />
                                <input
                                    type="text"
                                    placeholder="Slug (auto-generated if empty)"
                                    value={newDropdownSlug}
                                    onChange={(e) => setNewDropdownSlug(e.target.value)}
                                    className={inputClass}
                                />
                                <input
                                    type="text"
                                    placeholder="Description (optional)"
                                    value={newDropdownDesc}
                                    onChange={(e) => setNewDropdownDesc(e.target.value)}
                                    className={inputClass}
                                />
                                <div className="flex gap-2">
                                    <button onClick={createDropdown} className="px-3 py-1.5 text-xs font-medium text-white bg-[#f53003] rounded-lg hover:bg-[#d42600] transition-colors">Create</button>
                                    <button onClick={() => { setShowNewDropdown(false); setNewDropdownName(''); setNewDropdownSlug(''); setNewDropdownDesc(''); }} className="px-3 py-1.5 text-xs font-medium text-[#706f6c] dark:text-[#A1A09A] border border-[#e3e3e0] dark:border-[#3E3E3A] rounded-lg hover:bg-[#e3e3e0]/50 dark:hover:bg-[#3E3E3A]/50 transition-colors">Cancel</button>
                                </div>
                            </div>
                        )}

                        <div className="flex-1 overflow-y-auto">
                            {dropdowns.map((dd) => (
                                <button
                                    key={dd.id}
                                    onClick={() => setSelectedDropdown(dd)}
                                    className={`w-full text-left px-4 py-3 border-b border-[#e3e3e0] dark:border-[#3E3E3A] transition-colors ${
                                        selectedDropdown?.id === dd.id
                                            ? 'bg-[#f53003]/5 border-l-2 border-l-[#f53003]'
                                            : 'hover:bg-[#e3e3e0]/30 dark:hover:bg-[#3E3E3A]/30'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className={`text-sm font-medium ${selectedDropdown?.id === dd.id ? 'text-[#f53003]' : 'text-[#1b1b18] dark:text-[#EDEDEC]'}`}>{dd.name}</p>
                                            <p className="text-xs text-[#706f6c] dark:text-[#A1A09A] mt-0.5">{dd.entries.length} entries</p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Main - Entries */}
                    <div className="flex-1 min-h-0 bg-white dark:bg-[#161615] border border-[#e3e3e0] dark:border-[#3E3E3A] rounded-xl flex flex-col overflow-hidden">
                        {selectedDropdown ? (
                            <>
                                <div className="p-4 border-b border-[#e3e3e0] dark:border-[#3E3E3A] flex items-center justify-between flex-shrink-0">
                                    <div>
                                        <h2 className="text-base font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">{selectedDropdown.name}</h2>
                                        {selectedDropdown.description && (
                                            <p className="text-xs text-[#706f6c] dark:text-[#A1A09A] mt-0.5">{selectedDropdown.description}</p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={openNewEntry}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-[#f53003] rounded-lg hover:bg-[#d42600] transition-colors"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                            </svg>
                                            Add Entry
                                        </button>
                                        <button
                                            onClick={() => setConfirmDeleteDropdown(selectedDropdown)}
                                            className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto">
                                    {selectedDropdown.entries.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full py-12">
                                            <svg className="w-10 h-10 text-[#e3e3e0] dark:text-[#3E3E3A] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
                                            </svg>
                                            <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">No entries yet</p>
                                            <p className="text-xs text-[#706f6c] dark:text-[#A1A09A] mt-1">Click "Add Entry" to create one</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-[#e3e3e0] dark:divide-[#3E3E3A]">
                                            {selectedDropdown.entries.map((entry) => (
                                                <div key={entry.id} className="flex items-center gap-4 px-4 py-3 group hover:bg-[#e3e3e0]/20 dark:hover:bg-[#3E3E3A]/20 transition-colors">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <p className={`text-sm font-medium ${entry.is_active ? 'text-[#1b1b18] dark:text-[#EDEDEC]' : 'text-[#706f6c] dark:text-[#A1A09A] line-through'}`}>{entry.label}</p>
                                                            {!entry.is_active && (
                                                                <span className="px-1.5 py-0.5 text-[10px] font-medium bg-[#e3e3e0] dark:bg-[#3E3E3A] text-[#706f6c] dark:text-[#A1A09A] rounded">Inactive</span>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-[#706f6c] dark:text-[#A1A09A] font-mono mt-0.5">{entry.value}</p>
                                                    </div>
                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => toggleEntryActive(entry)}
                                                            className={`p-1.5 rounded-lg transition-colors ${entry.is_active ? 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20' : 'text-[#706f6c] dark:text-[#A1A09A] hover:bg-[#e3e3e0]/50 dark:hover:bg-[#3E3E3A]/50'}`}
                                                            title={entry.is_active ? 'Deactivate' : 'Activate'}
                                                        >
                                                            {entry.is_active ? (
                                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                            ) : (
                                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                                                </svg>
                                                            )}
                                                        </button>
                                                        <button
                                                            onClick={() => openEditEntry(entry)}
                                                            className="p-1.5 text-[#706f6c] dark:text-[#A1A09A] hover:text-[#f53003] hover:bg-[#f53003]/10 rounded-lg transition-colors"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => setConfirmDeleteEntry(entry)}
                                                            className="p-1.5 text-[#706f6c] dark:text-[#A1A09A] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center">
                                <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">Select a dropdown to manage its entries</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Entry Modal */}
            {showEntryModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-[#161615] border border-[#e3e3e0] dark:border-[#3E3E3A] rounded-2xl w-full max-w-md mx-4 shadow-2xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e3e3e0] dark:border-[#3E3E3A]">
                            <h2 className="text-lg font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">
                                {editingEntry ? 'Edit Entry' : 'New Entry'}
                            </h2>
                            <button onClick={() => setShowEntryModal(false)} className="p-2 text-[#706f6c] dark:text-[#A1A09A] hover:text-[#1b1b18] dark:hover:text-[#EDEDEC] hover:bg-[#e3e3e0]/50 dark:hover:bg-[#3E3E3A]/50 rounded-lg transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className={labelClass}>Label (displayed to users)</label>
                                <input type="text" value={entryLabel} onChange={(e) => setEntryLabel(e.target.value)} className={inputClass} placeholder="e.g. Married" autoFocus />
                            </div>
                            <div>
                                <label className={labelClass}>Value (stored in database)</label>
                                <input type="text" value={entryValue} onChange={(e) => setEntryValue(e.target.value)} className={inputClass + " font-mono"} placeholder="e.g. married" />
                            </div>
                            <div className="flex items-center gap-3">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={entryActive} onChange={() => setEntryActive(!entryActive)} className="sr-only peer" />
                                    <div className="w-9 h-5 bg-[#e3e3e0] dark:bg-[#3E3E3A] peer-focus:ring-2 peer-focus:ring-[#f53003]/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#f53003]"></div>
                                </label>
                                <span className="text-sm text-[#1b1b18] dark:text-[#EDEDEC]">Active</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#e3e3e0] dark:border-[#3E3E3A]">
                            <button onClick={() => setShowEntryModal(false)} className="px-4 py-2 text-sm font-medium text-[#706f6c] dark:text-[#A1A09A] border border-[#e3e3e0] dark:border-[#3E3E3A] rounded-lg hover:bg-[#e3e3e0]/50 dark:hover:bg-[#3E3E3A]/50 transition-colors">Cancel</button>
                            <button
                                onClick={saveEntry}
                                disabled={saving || !entryLabel || !entryValue}
                                className="px-4 py-2 text-sm font-medium text-white bg-[#f53003] rounded-lg hover:bg-[#d42600] transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                            >
                                {saving ? 'Saving...' : editingEntry ? 'Save Changes' : 'Create Entry'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Confirm Delete Dropdown */}
            <ConfirmModal
                isOpen={!!confirmDeleteDropdown}
                title="Delete Dropdown"
                message={`Are you sure you want to delete "${confirmDeleteDropdown?.name}" and all its entries? This cannot be undone.`}
                confirmLabel="Delete"
                danger
                onConfirm={() => { if (confirmDeleteDropdown) { deleteDropdown(confirmDeleteDropdown.id); setConfirmDeleteDropdown(null); } }}
                onCancel={() => setConfirmDeleteDropdown(null)}
            />

            {/* Confirm Delete Entry */}
            <ConfirmModal
                isOpen={!!confirmDeleteEntry}
                title="Delete Entry"
                message={`Are you sure you want to delete "${confirmDeleteEntry?.label}"? This cannot be undone.`}
                confirmLabel="Delete"
                danger
                onConfirm={() => { if (confirmDeleteEntry) { deleteEntry(confirmDeleteEntry.id); setConfirmDeleteEntry(null); } }}
                onCancel={() => setConfirmDeleteEntry(null)}
            />
        </AppLayout>
    );
}
