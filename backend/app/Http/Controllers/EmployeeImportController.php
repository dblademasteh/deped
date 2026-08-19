<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EmployeeImportController extends Controller
{
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt|max:10240',
        ]);

        $file = $request->file('file');
        $rows = $this->parseCsv($file->getRealPath());

        if (count($rows) < 2) {
            return response()->json(['message' => 'CSV file is empty or has no data rows.', 'imported' => 0], 422);
        }

        // Skip header rows (up to 20 lines of multi-line headers) — find first data row
        $dataRows = [];
        foreach ($rows as $row) {
            $first = trim($row[0] ?? '');
            if ($first === '' || $first === 'ITEM NUMBER' || str_starts_with($first, 'ITEM NUMBER')) {
                continue;
            }
            // Check if first name column (index 2) has content
            if (!empty(trim($row[2] ?? ''))) {
                $dataRows[] = $row;
            }
        }

        $imported = 0;

        DB::transaction(function () use ($dataRows, &$imported) {
            // Clear existing records
            Employee::truncate();

            foreach ($dataRows as $row) {
                $sexRaw = strtoupper(trim($row[8] ?? ''));
                $sex = match ($sexRaw) {
                    'M', 'MALE' => 'male',
                    'F', 'FEMALE' => 'female',
                    default => 'male',
                };

                $data = [
                    'item_number'                      => $this->clean($row[0] ?? null),
                    'position'                         => $this->clean($row[1] ?? null),
                    'first_name'                       => $this->clean($row[2] ?? null),
                    'middle_name'                      => $this->clean($row[3] ?? null),
                    'last_name'                        => $this->clean($row[4] ?? null),
                    'extension_name'                   => $this->clean($row[5] ?? null),
                    'salary_grade'                     => $this->clean($row[6] ?? null),
                    'step'                             => $this->clean($row[7] ?? null),
                    'sex'                              => $sex,
                    'date_of_birth'                    => $this->parseDate($row[9] ?? null),
                    'tin'                              => $this->cleanDigits($row[10] ?? null),
                    'date_of_original_appointment'     => $this->parseDate($row[11] ?? null),
                    'date_of_last_promotion'           => $this->parseDate($row[12] ?? null),
                    'permanent_address'                => $this->clean($row[13] ?? null),
                    'civil_status'                     => $this->clean($row[14] ?? null),
                    'gsis_bp_no'                       => $this->cleanDigits($row[15] ?? null),
                    'pag_ibig_no'                      => $this->cleanDigits($row[16] ?? null),
                    'philhealth_no'                    => $this->cleanDigits($row[17] ?? null),
                    'cellphone_no'                     => $this->cleanDigits($row[18] ?? null),
                    'email_address'                    => $this->clean($row[19] ?? null),
                    'highest_educational_attainment'   => $this->clean($row[20] ?? null),
                    'cs_eligibility'                   => $this->clean($row[21] ?? null),
                    'employee_number'                  => $this->clean($row[22] ?? null),
                ];

                Employee::create($data);
                $imported++;
            }
        });

        return response()->json([
            'message' => "Successfully imported {$imported} employee record(s).",
            'imported' => $imported,
        ]);
    }

    private function clean(?string $value): ?string
    {
        if ($value === null) return null;
        $val = trim($value);
        return $val === '' ? null : $val;
    }

    private function cleanDigits(?string $value): ?string
    {
        if ($value === null) return null;
        $val = preg_replace('/[^0-9]/', '', trim($value));
        return $val === '' ? null : $val;
    }

    private function parseDate(?string $value): ?string
    {
        if ($value === null) return null;
        $val = trim($value);
        if ($val === '') return null;

        $formats = ['m/d/Y', 'm/d/y', 'Y-m-d', 'd/m/Y'];
        foreach ($formats as $fmt) {
            $dt = \DateTime::createFromFormat($fmt, $val);
            if ($dt !== false) {
                return $dt->format('Y-m-d');
            }
        }
        return null;
    }

    private function parseCsv(string $path): array
    {
        $handle = fopen($path, 'r');
        if ($handle === false) return [];

        $rows = [];
        $header = fgetcsv($handle);

        if ($header === false) {
            fclose($handle);
            return [];
        }

        $colCount = count($header);
        $currentRow = $header;

        // The CSV has multi-line quoted headers. We need to merge them until we find the actual data.
        // Count commas to determine if we're still in the header
        while (($line = fgets($handle)) !== false) {
            // Count fields in accumulated row
            $tempHandle = fopen('php://memory', 'r+');
            fwrite($tempHandle, implode(',', $currentRow) . "\n" . $line);
            fseek($tempHandle, 0);
            $all = fgetcsv($tempHandle);
            $count = count($all);
            fclose($tempHandle);

            if ($count >= $colCount) {
                // We've reached the data rows
                break;
            }
            $currentRow[0] .= "\n" . trim($line, "\n\r");
        }

        // Now parse remaining lines properly
        while (($row = fgetcsv($handle)) !== false) {
            // Pad to expected column count
            while (count($row) < 25) {
                $row[] = '';
            }
            $rows[] = $row;
        }

        fclose($handle);
        return $rows;
    }
}
