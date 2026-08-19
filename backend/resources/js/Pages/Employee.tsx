import AppLayout from '../Components/AppLayout';
import EmployeeModal from '../Components/EmployeeModal';
import ConfirmModal from '../Components/ConfirmModal';
import { useState, useRef, useEffect } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import type { PageProps } from '../types';

interface Employee {
    id: number;
    item_number: string | null;
    position: string | null;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    extension_name: string | null;
    salary_grade: string | null;
    step: string | null;
    sex: 'male' | 'female';
    date_of_birth: string | null;
    tin: string | null;
    date_of_original_appointment: string | null;
    date_of_last_promotion: string | null;
    permanent_address: string | null;
    civil_status: string | null;
    gsis_bp_no: string | null;
    pag_ibig_no: string | null;
    philhealth_no: string | null;
    cellphone_no: string | null;
    email_address: string | null;
    highest_educational_attainment: string | null;
    cs_eligibility: string | null;
    employee_number: string | null;
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

interface EmployeeProps extends PageProps {
    employees: Employee[];
    dropdowns: Dropdown[];
    formFields: FormFieldDef[];
}

export default function Employee({ auth, employees, dropdowns, formFields }: EmployeeProps) {
    const user = auth?.user;
    const [search, setSearch] = useState('');
    const [showImportModal, setShowImportModal] = useState(false);
    const [importFile, setImportFile] = useState<File | null>(null);
    const [importing, setImporting] = useState(false);
    const [importResult, setImportResult] = useState<{ success: boolean; message: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dropRef = useRef<HTMLDivElement>(null);

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('view');
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [actionMenuOpen, setActionMenuOpen] = useState<number | null>(null);
    const [confirmDeleteEmployee, setConfirmDeleteEmployee] = useState<Employee | null>(null);

    const filteredEmployees = employees.filter((emp) => {
        const s = search.toLowerCase();
        return (
            emp.first_name.toLowerCase().includes(s) ||
            emp.last_name.toLowerCase().includes(s) ||
            (emp.middle_name && emp.middle_name.toLowerCase().includes(s)) ||
            (emp.position && emp.position.toLowerCase().includes(s)) ||
            (emp.item_number && emp.item_number.toLowerCase().includes(s)) ||
            (emp.employee_number && emp.employee_number.toLowerCase().includes(s)) ||
            (emp.email_address && emp.email_address.toLowerCase().includes(s))
        );
    });

    // Listen for edit event from modal
    useEffect(() => {
        const handler = (e: CustomEvent) => {
            setSelectedEmployee(e.detail);
            setModalMode('edit');
            setModalOpen(true);
            setActionMenuOpen(null);
            setConfirmDeleteEmployee(null);
        };
        window.addEventListener('employee-edit', handler as EventListener);
        return () => window.removeEventListener('employee-edit', handler as EventListener);
    }, []);

    // Close action menu on outside click or Escape
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest('button')) return;
            setActionMenuOpen(null);
        };
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setActionMenuOpen(null);
        };
        if (actionMenuOpen !== null) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscape);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [actionMenuOpen]);

    const openRow = (emp: Employee) => {
        setSelectedEmployee(emp);
        setModalMode('view');
        setModalOpen(true);
        setActionMenuOpen(null);
        setConfirmDeleteEmployee(null);
    };

    const openCreate = () => {
        setSelectedEmployee(null);
        setModalMode('create');
        setModalOpen(true);
    };

    const openEdit = (emp: Employee) => {
        setSelectedEmployee(emp);
        setModalMode('edit');
        setModalOpen(true);
        setActionMenuOpen(null);
        setConfirmDeleteEmployee(null);
    };

    const handleSaved = () => {
        setModalOpen(false);
        setSelectedEmployee(null);
        setActionMenuOpen(null);
        setConfirmDeleteEmployee(null);
        router.reload({ only: ['employees'] });
    };

    const fmtDate = (d: string | null) => {
        if (!d) return '-';
        const dt = new Date(d);
        const mm = String(dt.getMonth() + 1).padStart(2, '0');
        const dd = String(dt.getDate()).padStart(2, '0');
        const yyyy = dt.getFullYear();
        return `${mm}/${dd}/${yyyy}`;
    };

    const fmtNum = (n: string | null, len: number) => {
        if (!n) return '-';
        return n.padStart(len, '0');
    };

    const th = "py-3 px-3 text-xs font-semibold text-[#706f6c] dark:text-[#A1A09A] uppercase tracking-wider whitespace-nowrap sticky top-0 bg-[#F5F5F4] dark:bg-[#1e1e1d] border-b-2 border-[#e3e3e0] dark:border-[#3E3E3A] z-10";
    const td = "py-3 px-3 text-sm text-[#1b1b18] dark:text-[#EDEDEC] whitespace-nowrap";

    const handleImport = async () => {
        if (!importFile) return;
        setImporting(true);
        setImportResult(null);
        try {
            const formData = new FormData();
            formData.append('file', importFile);
            const response = await axios.post('/records/employee/import', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setImportResult({ success: true, message: response.data.message });
            setTimeout(() => {
                router.reload({ only: ['employees'] });
                setShowImportModal(false);
                setImportFile(null);
                setImportResult(null);
            }, 1500);
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Import failed. Please check the CSV format.';
            setImportResult({ success: false, message: msg });
        } finally {
            setImporting(false);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        if (dropRef.current) dropRef.current.classList.add('border-[#f53003]');
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        if (dropRef.current) dropRef.current.classList.remove('border-[#f53003]');
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (dropRef.current) dropRef.current.classList.remove('border-[#f53003]');
        const files = e.dataTransfer.files;
        if (files.length > 0 && (files[0].name.endsWith('.csv') || files[0].name.endsWith('.txt'))) {
            setImportFile(files[0]);
            setImportResult(null);
        }
    };

    return (
        <AppLayout user={user}>
            <div className="flex flex-col h-full gap-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-[#1b1b18] dark:text-[#EDEDEC] tracking-tight">Employee Records</h1>
                        <p className="text-sm text-[#706f6c] dark:text-[#A1A09A] mt-1">
                            {employees.length} total record{employees.length !== 1 ? 's' : ''} &middot; {filteredEmployees.length} shown
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => { setShowImportModal(true); setImportFile(null); setImportResult(null); }}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-[#161615] border border-[#e3e3e0] dark:border-[#3E3E3A] text-[#1b1b18] dark:text-[#EDEDEC] text-sm font-medium rounded-lg hover:border-[#f53003] hover:text-[#f53003] transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                            Import CSV
                        </button>
                        <a
                            href="/records/employee/export"
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-[#161615] border border-[#e3e3e0] dark:border-[#3E3E3A] text-[#1b1b18] dark:text-[#EDEDEC] text-sm font-medium rounded-lg hover:border-[#f53003] hover:text-[#f53003] transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                            Export to Excel
                        </a>
                        <button
                            onClick={openCreate}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#f53003] hover:bg-[#d42600] text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Add Employee
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="flex-1 min-h-0 bg-white dark:bg-[#161615] border border-[#e3e3e0] dark:border-[#3E3E3A] rounded-xl flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-[#e3e3e0] dark:border-[#3E3E3A] flex-shrink-0">
                        <div className="relative max-w-md">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#706f6c] dark:text-[#A1A09A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search by name, position, item number..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 text-sm bg-[#FDFDFC] dark:bg-[#0a0a0a] border border-[#e3e3e0] dark:border-[#3E3E3A] rounded-lg text-[#1b1b18] dark:text-[#EDEDEC] placeholder-[#706f6c] dark:placeholder-[#A1A09A] focus:outline-none focus:ring-2 focus:ring-[#f53003]/50 focus:border-[#f53003] transition-colors"
                            />
                        </div>
                    </div>

                    <div className="flex-1 min-h-0 overflow-auto">
                        <table className="w-full min-w-[2200px]">
                            <thead>
                                <tr className="border-b-2 border-[#e3e3e0] dark:border-[#3E3E3A]">
                                    <th className={th}>Item Number</th>
                                    <th className={th}>Position</th>
                                    <th className={th}>First Name</th>
                                    <th className={th}>Middle Name</th>
                                    <th className={th}>Last Name</th>
                                    <th className={th}>Ext. Name</th>
                                    <th className={th}>Salary Grade</th>
                                    <th className={th}>Step</th>
                                    <th className={th}>Sex</th>
                                    <th className={th}>Date of Birth</th>
                                    <th className={th}>TIN</th>
                                    <th className={th}>Date of Original Appt.</th>
                                    <th className={th}>Date of Last Promotion</th>
                                    <th className={th}>Permanent Address</th>
                                    <th className={th}>Civil Status</th>
                                    <th className={th}>GSIS BP No.</th>
                                    <th className={th}>PAG-IBIG No.</th>
                                    <th className={th}>PHILHEALTH No.</th>
                                    <th className={th}>Cellphone No.</th>
                                    <th className={th}>Email Address</th>
                                    <th className={th}>Highest Ed. Attainment</th>
                                    <th className={th}>CS Eligibility</th>
                                    <th className={th}>Employee No.</th>
                                    <th className={th}>Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#e3e3e0] dark:divide-[#3E3E3A]">
                                {filteredEmployees.length === 0 ? (
                                    <tr>
                                        <td colSpan={25} className="py-12 text-center">
                                            <div className="flex flex-col items-center">
                                                <svg className="w-12 h-12 text-[#e3e3e0] dark:text-[#3E3E3A] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                                </svg>
                                                <p className="text-sm font-medium text-[#706f6c] dark:text-[#A1A09A]">
                                                    {search ? 'No employees match your search' : 'No employee records yet'}
                                                </p>
                                                <p className="text-xs text-[#706f6c] dark:text-[#A1A09A] mt-1">
                                                    {search ? 'Try adjusting your search terms' : 'Add your first employee or import a CSV'}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredEmployees.map((emp) => (
                                        <tr
                                            key={emp.id}
                                            onClick={(e) => {
                                                if ((e.target as HTMLElement).closest('button')) return;
                                                openRow(emp);
                                            }}
                                            className="group hover:bg-[#e3e3e0]/20 dark:hover:bg-[#3E3E3A]/20 transition-colors cursor-pointer"
                                        >
                                            <td className={`${td} font-mono text-[13px]`}>{emp.item_number || '-'}</td>
                                            <td className={td}>{emp.position || '-'}</td>
                                            <td className={`${td} font-medium`}>{emp.first_name}</td>
                                            <td className={td}>{emp.middle_name || '-'}</td>
                                            <td className={`${td} font-medium`}>{emp.last_name}</td>
                                            <td className={td}>{emp.extension_name || ''}</td>
                                            <td className={td}>{emp.salary_grade || '-'}</td>
                                            <td className={td}>{emp.step || '-'}</td>
                                            <td className={td}>
                                                <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                                                    emp.sex === 'male' ? 'bg-blue-500/10 text-blue-700 dark:text-blue-400' : 'bg-pink-500/10 text-pink-700 dark:text-pink-400'
                                                }`}>
                                                    {emp.sex === 'male' ? 'Male' : 'Female'}
                                                </span>
                                            </td>
                                            <td className={td}>{fmtDate(emp.date_of_birth)}</td>
                                            <td className={`${td} font-mono text-[13px]`}>{fmtNum(emp.tin, 9)}</td>
                                            <td className={td}>{fmtDate(emp.date_of_original_appointment)}</td>
                                            <td className={td}>{fmtDate(emp.date_of_last_promotion)}</td>
                                            <td className={`${td} max-w-[200px] truncate`} title={emp.permanent_address || ''}>{emp.permanent_address || '-'}</td>
                                            <td className={td}>{emp.civil_status || '-'}</td>
                                            <td className={`${td} font-mono text-[13px]`}>{fmtNum(emp.gsis_bp_no, 10)}</td>
                                            <td className={`${td} font-mono text-[13px]`}>{fmtNum(emp.pag_ibig_no, 12)}</td>
                                            <td className={`${td} font-mono text-[13px]`}>{fmtNum(emp.philhealth_no, 13)}</td>
                                            <td className={`${td} font-mono text-[13px]`}>{emp.cellphone_no || '-'}</td>
                                            <td className={`${td} text-[#f53003]`}>{emp.email_address || '-'}</td>
                                            <td className={td}>{emp.highest_educational_attainment || '-'}</td>
                                            <td className={td}>{emp.cs_eligibility || '-'}</td>
                                            <td className={`${td} font-mono text-[13px]`}>{emp.employee_number || '-'}</td>
                                            <td className="py-3 px-3 text-right relative">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActionMenuOpen(actionMenuOpen === emp.id ? null : emp.id);
                                                    }}
                                                    className="p-1.5 text-[#706f6c] dark:text-[#A1A09A] hover:text-[#f53003] hover:bg-[#f53003]/10 rounded-lg transition-colors"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                                                    </svg>
                                                </button>
                                                {actionMenuOpen === emp.id && (
                                                    <div className="absolute right-3 top-full z-20 mt-1 w-36 bg-white dark:bg-[#161615] border border-[#e3e3e0] dark:border-[#3E3E3A] rounded-lg shadow-lg py-1">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); openRow(emp); setActionMenuOpen(null); }}
                                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#1b1b18] dark:text-[#EDEDEC] hover:bg-[#e3e3e0]/50 dark:hover:bg-[#3E3E3A]/50 transition-colors"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                            View
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); openEdit(emp); }}
                                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#1b1b18] dark:text-[#EDEDEC] hover:bg-[#e3e3e0]/50 dark:hover:bg-[#3E3E3A]/50 transition-colors"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" /></svg>
                                                            Edit
                                                        </button>
                                                        <div className="border-t border-[#e3e3e0] dark:border-[#3E3E3A] my-1" />
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setActionMenuOpen(null);
                                                                setConfirmDeleteEmployee(emp);
                                                            }}
                                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                                                            Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center justify-between px-4 py-3 border-t border-[#e3e3e0] dark:border-[#3E3E3A] flex-shrink-0">
                        <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">
                            Showing <span className="font-medium text-[#1b1b18] dark:text-[#EDEDEC]">{filteredEmployees.length}</span> of <span className="font-medium text-[#1b1b18] dark:text-[#EDEDEC]">{employees.length}</span> records
                        </p>
                    </div>
                </div>
            </div>

            {/* Employee Modal */}
            <EmployeeModal
                isOpen={modalOpen}
                mode={modalMode}
                employee={selectedEmployee}
                dropdowns={dropdowns}
                formFields={formFields}
                onClose={() => { setModalOpen(false); setSelectedEmployee(null); setActionMenuOpen(null); setConfirmDeleteEmployee(null); }}
                onSaved={handleSaved}
            />

            {/* Import Modal */}
            {showImportModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-[#161615] border border-[#e3e3e0] dark:border-[#3E3E3A] rounded-2xl w-full max-w-lg mx-4 shadow-2xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e3e3e0] dark:border-[#3E3E3A]">
                            <div>
                                <h2 className="text-lg font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">Import Employee CSV</h2>
                                <p className="text-sm text-[#706f6c] dark:text-[#A1A09A] mt-0.5">Upload a CSV file matching the BP Template format</p>
                            </div>
                            <button
                                onClick={() => setShowImportModal(false)}
                                className="p-2 text-[#706f6c] dark:text-[#A1A09A] hover:text-[#1b1b18] dark:hover:text-[#EDEDEC] hover:bg-[#e3e3e0]/50 dark:hover:bg-[#3E3E3A]/50 rounded-lg transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6">
                            {!importResult ? (
                                <>
                                    <div
                                        ref={dropRef}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed border-[#e3e3e0] dark:border-[#3E3E3A] rounded-xl p-8 text-center cursor-pointer hover:border-[#f53003]/50 transition-colors"
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept=".csv,.txt"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) { setImportFile(file); setImportResult(null); }
                                            }}
                                            className="hidden"
                                        />
                                        {importFile ? (
                                            <div className="flex flex-col items-center">
                                                <div className="w-12 h-12 rounded-full bg-[#f53003]/10 flex items-center justify-center mb-3">
                                                    <svg className="w-6 h-6 text-[#f53003]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                                    </svg>
                                                </div>
                                                <p className="text-sm font-medium text-[#1b1b18] dark:text-[#EDEDEC]">{importFile.name}</p>
                                                <p className="text-xs text-[#706f6c] dark:text-[#A1A09A] mt-1">
                                                    {(importFile.size / 1024).toFixed(1)} KB &middot; Click to change
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center">
                                                <svg className="w-12 h-12 text-[#e3e3e0] dark:text-[#3E3E3A] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                                </svg>
                                                <p className="text-sm font-medium text-[#1b1b18] dark:text-[#EDEDEC]">Drop CSV file here</p>
                                                <p className="text-xs text-[#706f6c] dark:text-[#A1A09A] mt-1">or click to browse</p>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-xs text-[#706f6c] dark:text-[#A1A09A] mt-3">
                                        Accepts the DepEd BP Template CSV format. Existing records will be replaced.
                                    </p>
                                </>
                            ) : (
                                <div className="flex flex-col items-center py-6">
                                    {importResult.success ? (
                                        <>
                                            <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                                                <svg className="w-7 h-7 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                </svg>
                                            </div>
                                            <p className="text-sm font-medium text-[#1b1b18] dark:text-[#EDEDEC]">{importResult.message}</p>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                                                <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </div>
                                            <p className="text-sm font-medium text-red-600 dark:text-red-400">{importResult.message}</p>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#e3e3e0] dark:border-[#3E3E3A]">
                            <button
                                onClick={() => setShowImportModal(false)}
                                className="px-4 py-2 text-sm font-medium text-[#706f6c] dark:text-[#A1A09A] border border-[#e3e3e0] dark:border-[#3E3E3A] rounded-lg hover:bg-[#e3e3e0]/50 dark:hover:bg-[#3E3E3A]/50 transition-colors"
                            >
                                Cancel
                            </button>
                            {!importResult && (
                                <button
                                    onClick={handleImport}
                                    disabled={!importFile || importing}
                                    className="px-4 py-2 text-sm font-medium text-white bg-[#f53003] rounded-lg hover:bg-[#d42600] transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                                >
                                    {importing ? (
                                        <>
                                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Importing...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                            </svg>
                                            Import
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {/* Confirm Delete Employee */}
            <ConfirmModal
                isOpen={!!confirmDeleteEmployee}
                title="Delete Employee"
                message={`Are you sure you want to delete ${confirmDeleteEmployee?.first_name} ${confirmDeleteEmployee?.last_name}? This cannot be undone.`}
                confirmLabel="Delete"
                danger
                onConfirm={async () => {
                    if (confirmDeleteEmployee) {
                        await axios.delete(`/records/employee/${confirmDeleteEmployee.id}`);
                        setConfirmDeleteEmployee(null);
                        router.reload({ only: ['employees'] });
                    }
                }}
                onCancel={() => setConfirmDeleteEmployee(null)}
            />
        </AppLayout>
    );
}
