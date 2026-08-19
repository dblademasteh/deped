<?php

namespace Database\Seeders;

use App\Models\FormField;
use Illuminate\Database\Seeder;

class FormFieldSeeder extends Seeder
{
    public function run(): void
    {
        $fields = [
            // Personal Information
            ['label' => 'First Name', 'key' => 'first_name', 'type' => 'text', 'section' => 'Personal Information', 'placeholder' => 'Required', 'required' => true, 'sort_order' => 0, 'col_span' => 1],
            ['label' => 'Middle Name', 'key' => 'middle_name', 'type' => 'text', 'section' => 'Personal Information', 'placeholder' => 'Optional', 'required' => false, 'sort_order' => 1, 'col_span' => 1],
            ['label' => 'Last Name', 'key' => 'last_name', 'type' => 'text', 'section' => 'Personal Information', 'placeholder' => 'Required', 'required' => true, 'sort_order' => 2, 'col_span' => 1],
            ['label' => 'Ext. Name', 'key' => 'extension_name', 'type' => 'text', 'section' => 'Personal Information', 'placeholder' => 'e.g. Jr., Sr.', 'required' => false, 'sort_order' => 3, 'col_span' => 1],
            ['label' => 'Sex', 'key' => 'sex', 'type' => 'searchable_select', 'dropdown_slug' => 'sex', 'section' => 'Personal Information', 'required' => false, 'sort_order' => 4, 'col_span' => 1],
            ['label' => 'Date of Birth', 'key' => 'date_of_birth', 'type' => 'date', 'section' => 'Personal Information', 'required' => false, 'sort_order' => 5, 'col_span' => 1],
            ['label' => 'Civil Status', 'key' => 'civil_status', 'type' => 'searchable_select', 'dropdown_slug' => 'civil-status', 'section' => 'Personal Information', 'required' => false, 'sort_order' => 6, 'col_span' => 1],
            ['label' => 'Cellphone No.', 'key' => 'cellphone_no', 'type' => 'text', 'section' => 'Personal Information', 'placeholder' => '09XX XXX XXXX', 'required' => false, 'sort_order' => 7, 'col_span' => 1],

            // Employment Information
            ['label' => 'Item Number', 'key' => 'item_number', 'type' => 'text', 'section' => 'Employment Information', 'placeholder' => 'e.g. OSEC-DECSB-...', 'required' => false, 'sort_order' => 0, 'col_span' => 1],
            ['label' => 'Position', 'key' => 'position', 'type' => 'text', 'section' => 'Employment Information', 'placeholder' => 'e.g. TEACHER III', 'required' => false, 'sort_order' => 1, 'col_span' => 1],
            ['label' => 'Salary Grade', 'key' => 'salary_grade', 'type' => 'searchable_select', 'dropdown_slug' => 'salary-grade', 'section' => 'Employment Information', 'required' => false, 'sort_order' => 2, 'col_span' => 1],
            ['label' => 'Step', 'key' => 'step', 'type' => 'searchable_select', 'dropdown_slug' => 'step', 'section' => 'Employment Information', 'required' => false, 'sort_order' => 3, 'col_span' => 1],
            ['label' => 'Date of Original Appt.', 'key' => 'date_of_original_appointment', 'type' => 'date', 'section' => 'Employment Information', 'required' => false, 'sort_order' => 4, 'col_span' => 1],
            ['label' => 'Date of Last Promotion', 'key' => 'date_of_last_promotion', 'type' => 'date', 'section' => 'Employment Information', 'required' => false, 'sort_order' => 5, 'col_span' => 1],
            ['label' => 'Employee No. (PSU Paid)', 'key' => 'employee_number', 'type' => 'text', 'section' => 'Employment Information', 'placeholder' => 'Employee number', 'required' => false, 'sort_order' => 6, 'col_span' => 1],
            ['label' => 'Email Address', 'key' => 'email_address', 'type' => 'email', 'section' => 'Employment Information', 'placeholder' => 'name@deped.gov.ph', 'required' => false, 'sort_order' => 7, 'col_span' => 1],

            // Government IDs
            ['label' => 'TIN (9 digits)', 'key' => 'tin', 'type' => 'text', 'section' => 'Government IDs', 'placeholder' => 'XXXXXXXXX', 'required' => false, 'sort_order' => 0, 'col_span' => 1],
            ['label' => 'GSIS BP No. (10 digits)', 'key' => 'gsis_bp_no', 'type' => 'text', 'section' => 'Government IDs', 'placeholder' => 'XXXXXXXXXX', 'required' => false, 'sort_order' => 1, 'col_span' => 1],
            ['label' => 'PAG-IBIG No. (12 digits)', 'key' => 'pag_ibig_no', 'type' => 'text', 'section' => 'Government IDs', 'placeholder' => 'XXXXXXXXXXXX', 'required' => false, 'sort_order' => 2, 'col_span' => 1],
            ['label' => 'PHILHEALTH No. (13 digits)', 'key' => 'philhealth_no', 'type' => 'text', 'section' => 'Government IDs', 'placeholder' => 'XXXXXXXXXXXXX', 'required' => false, 'sort_order' => 3, 'col_span' => 1],

            // Education & Address
            ['label' => 'Highest Ed. Attainment', 'key' => 'highest_educational_attainment', 'type' => 'searchable_select', 'dropdown_slug' => 'highest-educational-attainment', 'section' => 'Education & Address', 'required' => false, 'sort_order' => 0, 'col_span' => 1],
            ['label' => 'CS Eligibility', 'key' => 'cs_eligibility', 'type' => 'searchable_select', 'dropdown_slug' => 'cs-eligibility', 'section' => 'Education & Address', 'required' => false, 'sort_order' => 1, 'col_span' => 1],
            ['label' => 'Permanent Address', 'key' => 'permanent_address', 'type' => 'textarea', 'section' => 'Education & Address', 'placeholder' => 'House No, Street Name, Village/Subd', 'required' => false, 'sort_order' => 2, 'col_span' => 3],
        ];

        foreach ($fields as $field) {
            FormField::create($field);
        }
    }
}
