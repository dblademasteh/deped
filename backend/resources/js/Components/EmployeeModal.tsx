import { useState, useEffect } from 'react';
import axios from 'axios';
import { router } from '@inertiajs/react';
import SearchableSelect from './SearchableSelect';
import ConfirmModal from './ConfirmModal';

interface Employee {
    id?: number;
    item_number: string;
    position: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    extension_name: string;
    salary_grade: string;
    step: string;
    sex: 'male' | 'female' | '';
    date_of_birth: string;
    tin: string;
    date_of_original_appointment: string;
    date_of_last_promotion: string;
    permanent_address: string;
    civil_status: string;
    gsis_bp_no: string;
    pag_ibig_no: string;
    philhealth_no: string;
    cellphone_no: string;
    email_address: string;
    highest_educational_attainment: string;
    cs_eligibility: string;
    employee_number: string;
}

interface DropdownEntry {
    id: number;
    label: string;
    value: string;
    is_active: boolean;
}

interface Dropdown {
    id: number;
    name: string;
    slug: string;
    entries: DropdownEntry[];
}

interface FormFieldDef {
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

interface EmployeeModalProps {
    isOpen: boolean;
    mode: 'create' | 'edit' | 'view';
    employee?: Employee | null;
    dropdowns?: Dropdown[];
    formFields?: FormFieldDef[];
    onClose: () => void;
    onSaved: () => void;
}

const emptyEmployee: Employee = {
    item_number: '',
    position: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    extension_name: '',
    salary_grade: '',
    step: '',
    sex: '',
    date_of_birth: '',
    tin: '',
    date_of_original_appointment: '',
    date_of_last_promotion: '',
    permanent_address: '',
    civil_status: '',
    gsis_bp_no: '',
    pag_ibig_no: '',
    philhealth_no: '',
    cellphone_no: '',
    email_address: '',
    highest_educational_attainment: '',
    cs_eligibility: '',
    employee_number: '',
};

const inputClass = "w-full px-3 py-2 text-sm bg-[#FDFDFC] dark:bg-[#0a0a0a] border border-[#e3e3e0] dark:border-[#3E3E3A] rounded-lg text-[#1b1b18] dark:text-[#EDEDEC] placeholder-[#706f6c] dark:placeholder-[#A1A09A] focus:outline-none focus:ring-2 focus:ring-[#f53003]/50 focus:border-[#f53003] transition-colors";
const labelClass = "block text-[11px] font-medium text-[#706f6c] dark:text-[#A1A09A] mb-1.5";

const sectionIcons: Record<string, string> = {
    'Personal Information': 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z',
    'Employment Details': 'M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z',
    'Compensation & Benefits': 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z',
    'Contact Information': 'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75',
    'Additional Information': 'M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z',
};

export default function EmployeeModal({ isOpen, mode, employee, dropdowns = [], formFields = [], onClose, onSaved }: EmployeeModalProps) {
    const [form, setForm] = useState<Employee>(emptyEmployee);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [deleting, setDeleting] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    useEffect(() => {
        if (mode === 'edit' && employee) {
            setForm({ ...emptyEmployee, ...employee });
        } else if (mode === 'create') {
            setForm(emptyEmployee);
        } else if (mode === 'view' && employee) {
            setForm({ ...emptyEmployee, ...employee });
        }
        setErrors({});
        setConfirmDelete(false);
    }, [isOpen, mode, employee]);

    const set = (field: keyof Employee, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setErrors({});
        try {
            if (mode === 'create') {
                await axios.post('/records/employee', form);
            } else if (mode === 'edit' && employee?.id) {
                await axios.put(`/records/employee/${employee.id}`, form);
            }
            onSaved();
        } catch (err: any) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors || {});
            }
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!employee?.id) return;
        setDeleting(true);
        try {
            await axios.delete(`/records/employee/${employee.id}`);
            onSaved();
        } catch (err: any) {
            // silent
        } finally {
            setDeleting(false);
        }
    };

    const formatDate = (d: string) => {
        if (!d) return '';
        const dt = new Date(d);
        return dt.toISOString().split('T')[0];
    };

    const dropdownMap: Record<string, Dropdown> = {};
    dropdowns.forEach(dd => { dropdownMap[dd.slug] = dd; });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-6">
            <div className="bg-white dark:bg-[#161615] border border-[#e3e3e0] dark:border-[#3E3E3A] rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#e3e3e0] dark:border-[#3E3E3A] flex-shrink-0">
                    <div className="flex items-center gap-3">
                        {mode === 'view' && (
                            <div className="w-10 h-10 rounded-full bg-[#f53003]/10 flex items-center justify-center text-[#f53003] text-sm font-medium">
                                {form.first_name?.charAt(0)}{form.last_name?.charAt(0)}
                            </div>
                        )}
                        <div>
                            <h2 className="text-lg font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">
                                {mode === 'create' ? 'New Employee' : mode === 'edit' ? 'Edit Employee' : 'Employee Details'}
                            </h2>
                            {mode !== 'create' && (
                                <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                    {form.first_name} {form.last_name}
                                </p>
                            )}
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-[#706f6c] dark:text-[#A1A09A] hover:text-[#1b1b18] dark:hover:text-[#EDEDEC] hover:bg-[#e3e3e0]/50 dark:hover:bg-[#3E3E3A]/50 rounded-lg transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body - scrollable */}
                <div className="p-6 overflow-y-auto flex-1 min-h-0">
                    {(() => {
                        const grouped: Record<string, FormFieldDef[]> = {};
                        formFields.forEach(f => {
                            if (!grouped[f.section]) grouped[f.section] = [];
                            grouped[f.section].push(f);
                        });

                        const sectionKeys = Object.keys(grouped);

                        return sectionKeys.map((section, idx) => {
                            const fields = grouped[section];
                            return (
                            <div key={section} className={idx < sectionKeys.length - 1 ? "mb-6 pb-6 border-b border-[#e3e3e0]/50 dark:border-[#3E3E3A]/50" : "mb-2"}>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-[#f53003]/10 dark:bg-[#f53003]/20 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-[#f53003]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d={sectionIcons[section] || 'M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776'} />
                                        </svg>
                                    </div>
                                    <h3 className="text-sm font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">{section}</h3>
                                </div>
                                <div className={`grid gap-x-4 gap-y-3 ${section === 'Education & Address' ? 'grid-cols-3' : 'grid-cols-2 md:grid-cols-4 lg:grid-cols-5'}`}>
                                    {fields.map(f => {
                                        const val = f.type === 'date' ? formatDate(form[f.key as keyof Employee] as string) : (form[f.key as keyof Employee] as string) || '';
                                        const isDisabled = mode === 'view';
                                        const dd = f.dropdown_slug ? dropdownMap[f.dropdown_slug] : undefined;
                                        const span = f.col_span || 1;

                                        return (
                                            <div key={f.key} className={span > 1 ? `col-span-${span}` : ''}>
                                                <label className={labelClass}>
                                                    {f.label}
                                                    {f.required && <span className="text-red-500 ml-0.5">*</span>}
                                                </label>
                                                {f.type === 'searchable_select' && dd ? (
                                                    <SearchableSelect
                                                        options={dd.entries.filter(e => e.is_active).map(e => ({ label: e.label, value: e.value }))}
                                                        value={val}
                                                        onChange={(v) => set(f.key as keyof Employee, v)}
                                                        disabled={isDisabled}
                                                        placeholder="Select..."
                                                        dropUp={section === 'Personal Information'}
                                                    />
                                                ) : f.type === 'textarea' ? (
                                                    <textarea
                                                        value={val}
                                                        onChange={(e) => set(f.key as keyof Employee, e.target.value)}
                                                        disabled={isDisabled}
                                                        placeholder={f.placeholder || undefined}
                                                        rows={2}
                                                        className={inputClass + " resize-none"}
                                                    />
                                                ) : (
                                                    <input
                                                        type={f.type === 'number' ? 'number' : f.type}
                                                        value={val}
                                                        onChange={(e) => set(f.key as keyof Employee, e.target.value)}
                                                        disabled={isDisabled}
                                                        placeholder={f.placeholder || undefined}
                                                        className={inputClass}
                                                    />
                                                )}
                                                {errors[f.key] && <p className="text-[11px] text-red-500 mt-1">{errors[f.key]}</p>}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            );
                        });
                    })()}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-[#e3e3e0] dark:border-[#3E3E3A] flex-shrink-0 bg-white dark:bg-[#161615] rounded-b-2xl">
                    <div>
                        {mode === 'view' && employee?.id && (
                            <button
                                onClick={() => setConfirmDelete(true)}
                                className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                                Delete Employee
                            </button>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-[#706f6c] dark:text-[#A1A09A] border border-[#e3e3e0] dark:border-[#3E3E3A] rounded-lg hover:bg-[#e3e3e0]/50 dark:hover:bg-[#3E3E3A]/50 transition-colors"
                        >
                            {mode === 'view' ? 'Close' : 'Cancel'}
                        </button>
                        {mode === 'view' && employee?.id && (
                            <button
                                onClick={() => {
                                    onClose();
                                    setTimeout(() => {
                                        window.dispatchEvent(new CustomEvent('employee-edit', { detail: employee }));
                                    }, 100);
                                }}
                                className="px-4 py-2 text-sm font-medium text-[#1b1b18] dark:text-[#EDEDEC] border border-[#e3e3e0] dark:border-[#3E3E3A] rounded-lg hover:border-[#f53003] hover:text-[#f53003] transition-colors"
                            >
                                Edit
                            </button>
                        )}
                        {(mode === 'create' || mode === 'edit') && (
                            <button
                                onClick={handleSave}
                                disabled={saving || !form.first_name || !form.last_name}
                                className="px-4 py-2 text-sm font-medium text-white bg-[#f53003] rounded-lg hover:bg-[#d42600] transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
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
                                    <>
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                        {mode === 'create' ? 'Create Employee' : 'Save Changes'}
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>

                <ConfirmModal
                    isOpen={confirmDelete}
                    onClose={() => setConfirmDelete(false)}
                    onConfirm={handleDelete}
                    title="Delete Employee"
                    message={`Are you sure you want to delete ${form.first_name} ${form.last_name}? This action cannot be undone.`}
                    confirmText={deleting ? 'Deleting...' : 'Delete'}
                    cancelText="Cancel"
                    variant="danger"
                />
            </div>
        </div>
    );
}
