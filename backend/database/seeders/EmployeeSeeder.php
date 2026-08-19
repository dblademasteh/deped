<?php

namespace Database\Seeders;

use App\Models\Employee;
use Illuminate\Database\Seeder;

class EmployeeSeeder extends Seeder
{
    public function run(): void
    {
        $csvPath = 'C:\Users\EngrBry\Downloads\2027 BP_Template_1_ver01 for import - Copy.csv';

        if (!file_exists($csvPath)) {
            return;
        }

        $file = fopen($csvPath, 'r');
        if (!$file) return;

        $headerRow = null;
        $records = [];

        while (($row = fgetcsv($file, 0, ',', '"')) !== false) {
            if (count($row) < 23) continue;

            $firstCell = trim($row[0] ?? '');

            if (str_starts_with($firstCell, 'ITEM NUMBER')) {
                $headerRow = $row;
                continue;
            }

            if (str_starts_with($firstCell, 'OSEC-')) {
                $records[] = $row;
            }
        }

        fclose($file);

        foreach ($records as $row) {
            $data = [
                'item_number' => $this->clean($row[0] ?? ''),
                'position' => $this->clean($row[1] ?? ''),
                'first_name' => $this->clean($row[2] ?? ''),
                'middle_name' => $this->clean($row[3] ?? ''),
                'last_name' => $this->clean($row[4] ?? ''),
                'extension_name' => $this->clean($row[5] ?? ''),
                'salary_grade' => $this->clean($row[6] ?? ''),
                'step' => $this->clean($row[7] ?? ''),
                'sex' => $this->normalizeSex($row[8] ?? ''),
                'date_of_birth' => $this->parseDate($row[9] ?? ''),
                'tin' => $this->cleanNumber($row[10] ?? ''),
                'date_of_original_appointment' => $this->parseDate($row[11] ?? ''),
                'date_of_last_promotion' => $this->parseDate($row[12] ?? ''),
                'permanent_address' => $this->clean($row[13] ?? ''),
                'civil_status' => $this->clean($row[14] ?? ''),
                'gsis_bp_no' => $this->cleanNumber($row[15] ?? ''),
                'pag_ibig_no' => $this->cleanNumber($row[16] ?? ''),
                'philhealth_no' => $this->cleanNumber($row[17] ?? ''),
                'cellphone_no' => $this->clean($row[18] ?? ''),
                'email_address' => $this->clean($row[19] ?? ''),
                'highest_educational_attainment' => $this->clean($row[20] ?? ''),
                'cs_eligibility' => $this->clean($row[21] ?? ''),
                'employee_number' => $this->clean($row[22] ?? ''),
            ];

            if (empty($data['first_name']) || empty($data['last_name'])) {
                continue;
            }

            Employee::create($data);
        }
    }

    private function clean($val)
    {
        if (empty($val)) return '';
        $val = trim($val);
        return $val === '' ? '' : $val;
    }

    private function normalizeSex($val)
    {
        $val = strtolower(trim($val ?? ''));
        return match($val) {
            'm', 'male' => 'male',
            'f', 'female' => 'female',
            default => 'male'
        };
    }

    private function parseDate($dateStr)
    {
        if (empty($dateStr)) return null;
        $dateStr = trim($dateStr);
        if (preg_match('/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/', $dateStr, $matches)) {
            $month = str_pad($matches[1], 2, '0', STR_PAD_LEFT);
            $day = str_pad($matches[2], 2, '0', STR_PAD_LEFT);
            $year = $matches[3];
            return "$year-$month-$day";
        }
        if (preg_match('/^(\d{4})-(\d{1,2})-(\d{1,2})$/', $dateStr)) {
            return $dateStr;
        }
        return null;
    }

    private function cleanNumber($val)
    {
        if (empty($val)) return '';
        return preg_replace('/[^0-9]/', '', $val);
    }
}
