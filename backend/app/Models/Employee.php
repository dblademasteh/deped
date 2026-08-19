<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

    protected $fillable = [
        'item_number',
        'position',
        'first_name',
        'middle_name',
        'last_name',
        'extension_name',
        'salary_grade',
        'step',
        'sex',
        'date_of_birth',
        'tin',
        'date_of_original_appointment',
        'date_of_last_promotion',
        'permanent_address',
        'civil_status',
        'gsis_bp_no',
        'pag_ibig_no',
        'philhealth_no',
        'cellphone_no',
        'email_address',
        'highest_educational_attainment',
        'cs_eligibility',
        'employee_number',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'date_of_original_appointment' => 'date',
        'date_of_last_promotion' => 'date',
    ];
}
