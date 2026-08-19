import AppLayout from '../Components/AppLayout';
import ConfirmModal from '../Components/ConfirmModal';
import SearchableSelect from '../Components/SearchableSelect';
import { useState } from 'react';
import axios from 'axios';
import { router } from '@inertiajs/react';
import type { PageProps } from '../types';

interface FormField {
    id: number;
    label: string;
    key: string;
    type: string;
    dropdown_slug: string | null;
    section: string;
    placeholder: string | null;
    required: boolean;
    is_active: boolean;
    sort_order: number;
    col_span: number;
}

interface Dropdown {
    id: number;
    name: string;
    slug: string;
}

interface FormFieldSettingsProps extends PageProps {
    formFields: FormField[];
    dropdowns: Dropdown[];
}

const fieldTypes = [
    { label: 'Text', value: 'text' },
    { label: 'Email', value: 'email' },
    { label: 'Number', value: 'number' },
    { label: 'Date', value: 'date' },
    { label: 'Textarea', value: 'textarea' },
    { label: 'Searchable Select', value: 'searchable_select' },
];

const sectionIcons: Record<string, string> = {
    'Personal Information': 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z',
    'Employment Information': 'M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0',
    'Government IDs': 'M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z',
    'Education & Address': 'M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5',
};

export default function FormFieldSettings({ auth, formFields: initialFields, dropdowns }: FormFieldSettingsProps) {
    const user = auth?.user;
    const [fields, setFields] = useState<FormField[]>(initialFields);
    const [showNewField, setShowNewField] = useState(false);
    const [editingField, setEditingField] = useState<FormField | null>(null);
    const [saving, setSaving] = useState(false);

    // Form state
    const [formLabel, setFormLabel] = useState('');
    const [formKey, setFormKey] = useState('');
    const [formType, setFormType] = useState('text');
    const [formDropdownSlug, setFormDropdownSlug] = useState('');
    const [formSection, setFormSection] = useState('');
    const [formPlaceholder, setFormPlaceholder] = useState('');
    const [formRequired, setFormRequired] = useState(false);
    const [formColSpan, setFormColSpan] = useState(1);

    // Confirm
    const [confirmDelete, setConfirmDelete] = useState<FormField | null>(null);

    const sections = [...new Set(fields.map(f => f.section))];

    const resetForm = () => {
        setFormLabel('');
        setFormKey('');
        setFormType('text');
        setFormDropdownSlug('');
        setFormSection('');
        setFormPlaceholder('');
        setFormRequired(false);
        setFormColSpan(1);
    };

    const openNew = () => {
        resetForm();
        setEditingField(null);
        setShowNewField(true);
    };

    const openEdit = (field: FormField) => {
        setEditingField(field);
        setFormLabel(field.label);
        setFormKey(field.key);
        setFormType(field.type);
        setFormDropdownSlug(field.dropdown_slug || '');
        setFormSection(field.section);
        setFormPlaceholder(field.placeholder || '');
        setFormRequired(field.required);
        setFormColSpan(field.col_span);
        setShowNewField(true);
    };

    const autoKey = (label: string) => {
        return label.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
    };

    const saveField = async () => {
        if (!formLabel || !formSection) return;
        setSaving(true);
        try {
            const key = editingField ? formKey : autoKey(formLabel);
            const payload = {
                label: formLabel,
                key,
                type: formType,
                dropdown_slug: formType === 'searchable_select' ? formDropdownSlug : null,
                section: formSection,
                placeholder: formPlaceholder || null,
                required: formRequired,
                col_span: formColSpan,
            };

            if (editingField) {
                const res = await axios.put(`/api/settings/form-fields/${editingField.id}`, payload);
                setFields(prev => prev.map(f => f.id === editingField.id ? res.data : f));
            } else {
                const res = await axios.post('/api/settings/form-fields', payload);
                setFields(prev => [...prev, res.data]);
            }
            setShowNewField(false);
            resetForm();
        } catch (err) {
            // silent
        } finally {
            setSaving(false);
        }
    };

    const deleteField = async (id: number) => {
        await axios.delete(`/api/settings/form-fields/${id}`);
        setFields(prev => prev.filter(f => f.id !== id));
    };

    const toggleActive = async (field: FormField) => {
        const res = await axios.put(`/api/settings/form-fields/${field.id}`, {
            ...field,
            is_active: !field.is_active,
        });
        setFields(prev => prev.map(f => f.id === field.id ? res.data : f));
    };

    const inputClass = "w-full px-3 py-2 text-sm bg-[#FDFDFC] dark:bg-[#0a0a0a] border border-[#e3e3e0] dark:border-[#3E3E3A] rounded-lg text-[#1b1b18] dark:text-[#EDEDEC] placeholder-[#706f6c] dark:placeholder-[#A1A09A] focus:outline-none focus:ring-2 focus:ring-[#f53003]/50 focus:border-[#f53003] transition-colors";
    const labelClass = "block text-xs font-medium text-[#706f6c] dark:text-[#A1A09A] mb-1";

    return (
        <AppLayout user={user}>
            <div className="flex flex-col h-full gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[#1b1b18] dark:text-[#EDEDEC] tracking-tight">Form Fields</h1>
                        <p className="text-sm text-[#706f6c] dark:text-[#A1A09A] mt-1">Configure which fields appear in the Employee form</p>
                    </div>
                    <button
                        onClick={openNew}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[#f53003] rounded-lg hover:bg-[#d42600] transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Add Field
                    </button>
                </div>

                {/* Fields by section */}
                <div className="flex-1 min-h-0 overflow-y-auto space-y-4">
                    {sections.map(section => (
                        <div key={section} className="bg-white dark:bg-[#161615] border border-[#e3e3e0] dark:border-[#3E3E3A] rounded-xl overflow-hidden">
                            <div className="px-4 py-3 border-b border-[#e3e3e0] dark:border-[#3E3E3A] flex items-center gap-2 bg-[#FAFAF9] dark:bg-[#1a1a18]">
                                <svg className="w-4 h-4 text-[#f53003]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d={sectionIcons[section] || 'M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776'} />
                                </svg>
                                <h2 className="text-sm font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">{section}</h2>
                                <span className="text-xs text-[#706f6c] dark:text-[#A1A09A]">
                                    {fields.filter(f => f.section === section).length} fields
                                </span>
                            </div>
                            <div className="divide-y divide-[#e3e3e0] dark:divide-[#3E3E3A]">
                                {fields.filter(f => f.section === section).map(field => (
                                    <div key={field.id} className="flex items-center gap-4 px-4 py-3 group hover:bg-[#e3e3e0]/20 dark:hover:bg-[#3E3E3A]/20 transition-colors">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className={`text-sm font-medium ${field.is_active ? 'text-[#1b1b18] dark:text-[#EDEDEC]' : 'text-[#706f6c] dark:text-[#A1A09A] line-through'}`}>{field.label}</p>
                                                {!field.is_active && (
                                                    <span className="px-1.5 py-0.5 text-[10px] font-medium bg-[#e3e3e0] dark:bg-[#3E3E3A] text-[#706f6c] dark:text-[#A1A09A] rounded">Hidden</span>
                                                )}
                                                {field.required && (
                                                    <span className="px-1.5 py-0.5 text-[10px] font-medium bg-[#f53003]/10 text-[#f53003] rounded">Required</span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3 mt-0.5">
                                                <p className="text-xs text-[#706f6c] dark:text-[#A1A09A] font-mono">{field.key}</p>
                                                <span className="text-xs text-[#706f6c] dark:text-[#A1A09A]">·</span>
                                                <p className="text-xs text-[#706f6c] dark:text-[#A1A09A]">{field.type}</p>
                                                {field.dropdown_slug && (
                                                    <>
                                                        <span className="text-xs text-[#706f6c] dark:text-[#A1A09A]">·</span>
                                                        <p className="text-xs text-[#f53003]">{field.dropdown_slug}</p>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => toggleActive(field)}
                                                className={`p-1.5 rounded-lg transition-colors ${field.is_active ? 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20' : 'text-[#706f6c] dark:text-[#A1A09A] hover:bg-[#e3e3e0]/50 dark:hover:bg-[#3E3E3A]/50'}`}
                                                title={field.is_active ? 'Hide from form' : 'Show on form'}
                                            >
                                                {field.is_active ? (
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                                    </svg>
                                                )}
                                            </button>
                                            <button
                                                onClick={() => openEdit(field)}
                                                className="p-1.5 text-[#706f6c] dark:text-[#A1A09A] hover:text-[#f53003] hover:bg-[#f53003]/10 rounded-lg transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => setConfirmDelete(field)}
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
                        </div>
                    ))}
                </div>
            </div>

            {/* Field Modal */}
            {showNewField && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-[#161615] border border-[#e3e3e0] dark:border-[#3E3E3A] rounded-2xl w-full max-w-lg mx-4 shadow-2xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e3e3e0] dark:border-[#3E3E3A]">
                            <h2 className="text-lg font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">
                                {editingField ? 'Edit Field' : 'New Field'}
                            </h2>
                            <button onClick={() => { setShowNewField(false); resetForm(); }} className="p-2 text-[#706f6c] dark:text-[#A1A09A] hover:text-[#1b1b18] dark:hover:text-[#EDEDEC] hover:bg-[#e3e3e0]/50 dark:hover:bg-[#3E3E3A]/50 rounded-lg transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className={labelClass}>Label</label>
                                <input
                                    type="text"
                                    value={formLabel}
                                    onChange={(e) => {
                                        setFormLabel(e.target.value);
                                        if (!editingField) setFormKey(autoKey(e.target.value));
                                    }}
                                    className={inputClass}
                                    placeholder="e.g. First Name"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Key (database column)</label>
                                <input
                                    type="text"
                                    value={formKey}
                                    onChange={(e) => setFormKey(e.target.value)}
                                    disabled={!!editingField}
                                    className={inputClass + " font-mono" + (editingField ? " opacity-60" : "")}
                                    placeholder="e.g. first_name"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Type</label>
                                    <SearchableSelect
                                        options={fieldTypes}
                                        value={formType}
                                        onChange={setFormType}
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Section</label>
                                    <input
                                        type="text"
                                        value={formSection}
                                        onChange={(e) => setFormSection(e.target.value)}
                                        className={inputClass}
                                        placeholder="e.g. Personal Information"
                                        list="sections-list"
                                    />
                                    <datalist id="sections-list">
                                        {sections.map(s => <option key={s} value={s} />)}
                                    </datalist>
                                </div>
                            </div>
                            {formType === 'searchable_select' && (
                                <div>
                                    <label className={labelClass}>Dropdown Slug</label>
                                    <SearchableSelect
                                        options={dropdowns.map(d => ({ label: `${d.name} (${d.slug})`, value: d.slug }))}
                                        value={formDropdownSlug}
                                        onChange={setFormDropdownSlug}
                                        placeholder="Select a dropdown..."
                                    />
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Placeholder</label>
                                    <input
                                        type="text"
                                        value={formPlaceholder}
                                        onChange={(e) => setFormPlaceholder(e.target.value)}
                                        className={inputClass}
                                        placeholder="Optional"
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Column Span (1-4)</label>
                                    <SearchableSelect
                                        options={[
                                            { label: '1 column', value: '1' },
                                            { label: '2 columns', value: '2' },
                                            { label: '3 columns', value: '3' },
                                            { label: '4 columns (full)', value: '4' },
                                        ]}
                                        value={String(formColSpan)}
                                        onChange={(v) => setFormColSpan(Number(v))}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={formRequired} onChange={() => setFormRequired(!formRequired)} className="sr-only peer" />
                                    <div className="w-9 h-5 bg-[#e3e3e0] dark:bg-[#3E3E3A] peer-focus:ring-2 peer-focus:ring-[#f53003]/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#f53003]"></div>
                                </label>
                                <span className="text-sm text-[#1b1b18] dark:text-[#EDEDEC]">Required field</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#e3e3e0] dark:border-[#3E3E3A]">
                            <button onClick={() => { setShowNewField(false); resetForm(); }} className="px-4 py-2 text-sm font-medium text-[#706f6c] dark:text-[#A1A09A] border border-[#e3e3e0] dark:border-[#3E3E3A] rounded-lg hover:bg-[#e3e3e0]/50 dark:hover:bg-[#3E3E3A]/50 transition-colors">Cancel</button>
                            <button
                                onClick={saveField}
                                disabled={saving || !formLabel || !formSection}
                                className="px-4 py-2 text-sm font-medium text-white bg-[#f53003] rounded-lg hover:bg-[#d42600] transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                            >
                                {saving ? 'Saving...' : editingField ? 'Save Changes' : 'Create Field'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Delete */}
            <ConfirmModal
                isOpen={!!confirmDelete}
                title="Delete Field"
                message={`Are you sure you want to delete "${confirmDelete?.label}"? This cannot be undone.`}
                confirmLabel="Delete"
                danger
                onConfirm={() => { if (confirmDelete) { deleteField(confirmDelete.id); setConfirmDelete(null); } }}
                onCancel={() => setConfirmDelete(null)}
            />
        </AppLayout>
    );
}
