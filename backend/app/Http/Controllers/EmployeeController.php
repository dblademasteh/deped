<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    public function show(Employee $employee)
    {
        return response()->json($employee);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'item_number'                      => 'nullable|string|max:255',
            'position'                         => 'nullable|string|max:255',
            'first_name'                       => 'required|string|max:255',
            'middle_name'                      => 'nullable|string|max:255',
            'last_name'                        => 'required|string|max:255',
            'extension_name'                   => 'nullable|string|max:255',
            'salary_grade'                     => 'nullable|string|max:10',
            'step'                             => 'nullable|string|max:10',
            'sex'                              => 'required|in:male,female',
            'date_of_birth'                    => 'nullable|date',
            'tin'                              => 'nullable|string|max:9',
            'date_of_original_appointment'     => 'nullable|date',
            'date_of_last_promotion'           => 'nullable|date',
            'permanent_address'                => 'nullable|string',
            'civil_status'                     => 'nullable|string|max:50',
            'gsis_bp_no'                       => 'nullable|string|max:10',
            'pag_ibig_no'                      => 'nullable|string|max:12',
            'philhealth_no'                    => 'nullable|string|max:13',
            'cellphone_no'                     => 'nullable|string|max:20',
            'email_address'                    => 'nullable|email|max:255',
            'highest_educational_attainment'   => 'nullable|string|max:255',
            'cs_eligibility'                   => 'nullable|string|max:255',
            'employee_number'                  => 'nullable|string|max:255',
        ]);

        $employee = Employee::create($validated);

        return response()->json($employee, 201);
    }

    public function update(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'item_number'                      => 'nullable|string|max:255',
            'position'                         => 'nullable|string|max:255',
            'first_name'                       => 'required|string|max:255',
            'middle_name'                      => 'nullable|string|max:255',
            'last_name'                        => 'required|string|max:255',
            'extension_name'                   => 'nullable|string|max:255',
            'salary_grade'                     => 'nullable|string|max:10',
            'step'                             => 'nullable|string|max:10',
            'sex'                              => 'required|in:male,female',
            'date_of_birth'                    => 'nullable|date',
            'tin'                              => 'nullable|string|max:9',
            'date_of_original_appointment'     => 'nullable|date',
            'date_of_last_promotion'           => 'nullable|date',
            'permanent_address'                => 'nullable|string',
            'civil_status'                     => 'nullable|string|max:50',
            'gsis_bp_no'                       => 'nullable|string|max:10',
            'pag_ibig_no'                      => 'nullable|string|max:12',
            'philhealth_no'                    => 'nullable|string|max:13',
            'cellphone_no'                     => 'nullable|string|max:20',
            'email_address'                    => 'nullable|email|max:255',
            'highest_educational_attainment'   => 'nullable|string|max:255',
            'cs_eligibility'                   => 'nullable|string|max:255',
            'employee_number'                  => 'nullable|string|max:255',
        ]);

        $employee->update($validated);

        return response()->json($employee);
    }

    public function destroy(Employee $employee)
    {
        $employee->delete();
        return response()->json(['message' => 'Employee deleted successfully.']);
    }

    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:employees,id',
        ]);

        Employee::whereIn('id', $request->ids)->delete();

        return response()->json(['message' => count($request->ids) . ' employee(s) deleted successfully.']);
    }
}
