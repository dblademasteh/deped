<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;

class EmployeeExportController extends Controller
{
    public function export(Request $request)
    {
        $employees = Employee::all();

        $headers = [
            'Item Number', 'Position', 'First Name', 'Middle Name', 'Last Name',
            'Ext. Name', 'Salary Grade', 'Step', 'Sex', 'Date of Birth', 'TIN',
            'Date of Original Appt.', 'Date of Last Promotion', 'Permanent Address',
            'Civil Status', 'GSIS BP No.', 'PAG-IBIG No.', 'PHILHEALTH No.',
            'Cellphone No.', 'Email Address', 'Highest Ed. Attainment',
            'CS Eligibility', 'Employee No.',
        ];

        $keys = [
            'item_number', 'position', 'first_name', 'middle_name', 'last_name',
            'extension_name', 'salary_grade', 'step', 'sex', 'date_of_birth', 'tin',
            'date_of_original_appointment', 'date_of_last_promotion', 'permanent_address',
            'civil_status', 'gsis_bp_no', 'pag_ibig_no', 'philhealth_no',
            'cellphone_no', 'email_address', 'highest_educational_attainment',
            'cs_eligibility', 'employee_number',
        ];

        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $xml .= '<?mso-application progid="Excel.Sheet"?>' . "\n";
        $xml .= '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"' . "\n";
        $xml .= ' xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">' . "\n";

        $xml .= '<Styles>' . "\n";
        $xml .= '<Style ss:ID="header">' . "\n";
        $xml .= '<Font ss:Bold="1" ss:Size="11" />' . "\n";
        $xml .= '<Interior ss:Color="#F5F5F4" ss:Pattern="Solid" />' . "\n";
        $xml .= '</Style>' . "\n";
        $xml .= '<Style ss:ID="date">' . "\n";
        $xml .= '<NumberFormat ss:Format="yyyy-mm-dd" />' . "\n";
        $xml .= '</Style>' . "\n";
        $xml .= '</Styles>' . "\n";

        $xml .= '<Worksheet ss:Name="Employees">' . "\n";
        $xml .= '<Table>' . "\n";

        // Header row
        $xml .= '<Row>' . "\n";
        foreach ($headers as $h) {
            $xml .= '<Cell ss:StyleID="header"><Data ss:Type="String">' . htmlspecialchars($h) . '</Data></Cell>' . "\n";
        }
        $xml .= '</Row>' . "\n";

        // Data rows
        $dateFields = ['date_of_birth', 'date_of_original_appointment', 'date_of_last_promotion'];

        foreach ($employees as $emp) {
            $xml .= '<Row>' . "\n";
            foreach ($keys as $key) {
                $val = $emp->$key ?? '';
                $isDate = in_array($key, $dateFields);

                if ($isDate && $val) {
                    $xml .= '<Cell ss:StyleID="date"><Data ss:Type="DateTime">' . substr($val, 0, 10) . 'T00:00:00.000</Data></Cell>' . "\n";
                } elseif ($isDate) {
                    $xml .= '<Cell><Data ss:Type="String"></Data></Cell>' . "\n";
                } else {
                    $xml .= '<Cell><Data ss:Type="String">' . htmlspecialchars((string) $val) . '</Data></Cell>' . "\n";
                }
            }
            $xml .= '</Row>' . "\n";
        }

        $xml .= '</Table>' . "\n";
        $xml .= '</Worksheet>' . "\n";
        $xml .= '</Workbook>' . "\n";

        return response($xml)
            ->header('Content-Type', 'application/vnd.ms-excel')
            ->header('Content-Disposition', 'attachment; filename="employees_export.xls"')
            ->header('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
}
