<?php

namespace Database\Seeders;

use App\Models\Dropdown;
use App\Models\DropdownEntry;
use Illuminate\Database\Seeder;

class DropdownSeeder extends Seeder
{
    public function run(): void
    {
        $dropdowns = [
            [
                'name' => 'Sex',
                'slug' => 'sex',
                'description' => 'Biological sex of the employee',
                'entries' => [
                    ['label' => 'Male', 'value' => 'male', 'sort_order' => 0],
                    ['label' => 'Female', 'value' => 'female', 'sort_order' => 1],
                ],
            ],
            [
                'name' => 'Civil Status',
                'slug' => 'civil-status',
                'description' => 'Marital status of the employee',
                'entries' => [
                    ['label' => 'Single', 'value' => 'single', 'sort_order' => 0],
                    ['label' => 'Married', 'value' => 'married', 'sort_order' => 1],
                    ['label' => 'Widowed', 'value' => 'widowed', 'sort_order' => 2],
                    ['label' => 'Separated', 'value' => 'separated', 'sort_order' => 3],
                    ['label' => 'Divorced', 'value' => 'divorced', 'sort_order' => 4],
                ],
            ],
            [
                'name' => 'Salary Grade',
                'slug' => 'salary-grade',
                'description' => 'Government salary grade levels',
                'entries' => [
                    ['label' => '1', 'value' => '1', 'sort_order' => 0],
                    ['label' => '2', 'value' => '2', 'sort_order' => 1],
                    ['label' => '3', 'value' => '3', 'sort_order' => 2],
                    ['label' => '4', 'value' => '4', 'sort_order' => 3],
                    ['label' => '5', 'value' => '5', 'sort_order' => 4],
                    ['label' => '6', 'value' => '6', 'sort_order' => 5],
                    ['label' => '7', 'value' => '7', 'sort_order' => 6],
                    ['label' => '8', 'value' => '8', 'sort_order' => 7],
                    ['label' => '9', 'value' => '9', 'sort_order' => 8],
                    ['label' => '10', 'value' => '10', 'sort_order' => 9],
                    ['label' => '11', 'value' => '11', 'sort_order' => 10],
                    ['label' => '12', 'value' => '12', 'sort_order' => 11],
                    ['label' => '13', 'value' => '13', 'sort_order' => 12],
                    ['label' => '14', 'value' => '14', 'sort_order' => 13],
                    ['label' => '15', 'value' => '15', 'sort_order' => 14],
                    ['label' => '16', 'value' => '16', 'sort_order' => 15],
                    ['label' => '17', 'value' => '17', 'sort_order' => 16],
                    ['label' => '18', 'value' => '18', 'sort_order' => 17],
                    ['label' => '19', 'value' => '19', 'sort_order' => 18],
                    ['label' => '20', 'value' => '20', 'sort_order' => 19],
                    ['label' => '21', 'value' => '21', 'sort_order' => 20],
                    ['label' => '22', 'value' => '22', 'sort_order' => 21],
                    ['label' => '23', 'value' => '23', 'sort_order' => 22],
                    ['label' => '24', 'value' => '24', 'sort_order' => 23],
                    ['label' => '25', 'value' => '25', 'sort_order' => 24],
                    ['label' => '26', 'value' => '26', 'sort_order' => 25],
                    ['label' => '27', 'value' => '27', 'sort_order' => 26],
                    ['label' => '28', 'value' => '28', 'sort_order' => 27],
                ],
            ],
            [
                'name' => 'Step',
                'slug' => 'step',
                'description' => 'Salary step level within a grade',
                'entries' => [
                    ['label' => '1', 'value' => '1', 'sort_order' => 0],
                    ['label' => '2', 'value' => '2', 'sort_order' => 1],
                    ['label' => '3', 'value' => '3', 'sort_order' => 2],
                    ['label' => '4', 'value' => '4', 'sort_order' => 3],
                    ['label' => '5', 'value' => '5', 'sort_order' => 4],
                    ['label' => '6', 'value' => '6', 'sort_order' => 5],
                    ['label' => '7', 'value' => '7', 'sort_order' => 6],
                    ['label' => '8', 'value' => '8', 'sort_order' => 7],
                ],
            ],
            [
                'name' => 'Highest Educational Attainment',
                'slug' => 'highest-educational-attainment',
                'description' => 'Highest educational level completed',
                'entries' => [
                    ['label' => 'High School Graduate', 'value' => 'High School Graduate', 'sort_order' => 0],
                    ['label' => 'Vocational', 'value' => 'Vocational', 'sort_order' => 1],
                    ['label' => 'Bachelor\'s Degree', 'value' => 'Bachelor\'s Degree', 'sort_order' => 2],
                    ['label' => 'Master\'s Degree', 'value' => 'Master\'s Degree', 'sort_order' => 3],
                    ['label' => 'Doctorate Degree', 'value' => 'Doctorate Degree', 'sort_order' => 4],
                ],
            ],
            [
                'name' => 'CS Eligibility',
                'slug' => 'cs-eligibility',
                'description' => 'Civil Service eligibility type',
                'entries' => [
                    ['label' => 'Civil Service Professional', 'value' => 'CIVIL SERVICE PROFESSIONAL EXAM', 'sort_order' => 0],
                    ['label' => 'Civil Service Sub-Professional', 'value' => 'CIVIL SERVICE SUB-PROFESSIONAL EXAM', 'sort_order' => 1],
                    ['label' => 'LET / Licensure Examination for Teachers', 'value' => 'LET', 'sort_order' => 2],
                    ['label' => 'PRC Board Examination', 'value' => 'PROFESSIONAL BOARD EXAMINATION FOR TEACHERS', 'sort_order' => 3],
                    ['label' => 'RA 1080 (Teacher)', 'value' => 'RA 1080', 'sort_order' => 4],
                    ['label' => 'PRC / TESDA NC2', 'value' => 'LET/CS PROFF/TESDA NC2', 'sort_order' => 5],
                    ['label' => 'None', 'value' => '', 'sort_order' => 99],
                ],
            ],
        ];

        foreach ($dropdowns as $dropdownData) {
            $entries = $dropdownData['entries'];
            unset($dropdownData['entries']);

            $dropdown = Dropdown::create($dropdownData);

            foreach ($entries as $entry) {
                $dropdown->entries()->create($entry);
            }
        }
    }
}
