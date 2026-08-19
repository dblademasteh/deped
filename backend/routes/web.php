<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Employee;
use App\Http\Controllers\EmployeeImportController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\EmployeeExportController;
use App\Http\Controllers\DropdownController;
use App\Http\Controllers\FormFieldController;
use App\Http\Controllers\UserController;
use App\Models\Dropdown;
use App\Models\FormField;

Route::get('/', function () {
    if (Auth::check()) {
        return redirect('/dashboard');
    }
    return redirect('/login');
});

Route::middleware('guest')->group(function () {
    Route::get('/login', function () {
        return Inertia::render('Login', [
            'canResetPassword' => true,
        ]);
    })->name('login');

    Route::post('/login', function (\Illuminate\Http\Request $request) {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();
            return redirect()->intended('/dashboard');
        }

        throw \Illuminate\Validation\ValidationException::withMessages([
            'email' => __('auth.failed'),
        ]);
    });
});

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', function () {
        $totalEmployees = Employee::count();
        $maleCount = Employee::where('sex', 'male')->count();
        $femaleCount = Employee::where('sex', 'female')->count();
        $recentEmployees = Employee::latest()->take(5)->get();
        $salaryGrades = Employee::whereNotNull('salary_grade')->where('salary_grade', '!=', '')->count();

        return Inertia::render('Dashboard', [
            'stats' => [
                'total' => $totalEmployees,
                'male' => $maleCount,
                'female' => $femaleCount,
                'salaryGrades' => $salaryGrades,
            ],
            'recentEmployees' => $recentEmployees,
        ]);
    })->name('dashboard');

    Route::get('/records/employee', function () {
        return Inertia::render('Employee', [
            'employees' => Employee::all(),
            'dropdowns' => Dropdown::with('entries')->get(),
            'formFields' => FormField::where('is_active', true)->orderBy('section')->orderBy('sort_order')->get(),
        ]);
    })->name('employee');

    Route::post('/records/employee/import', [EmployeeImportController::class, 'import'])
        ->name('employee.import');

    Route::get('/records/employee/export', [EmployeeExportController::class, 'export'])
        ->name('employee.export');

    Route::get('/offline', function () {
        return response()->file(public_path('offline.html'));
    })->name('offline');

    Route::post('/records/employee', [EmployeeController::class, 'store'])
        ->name('employee.store');
    Route::get('/records/employee/{employee}', [EmployeeController::class, 'show'])
        ->name('employee.show');
    Route::put('/records/employee/{employee}', [EmployeeController::class, 'update'])
        ->name('employee.update');
    Route::delete('/records/employee/{employee}', [EmployeeController::class, 'destroy'])
        ->name('employee.destroy');
    Route::post('/records/employee/bulk-delete', [EmployeeController::class, 'bulkDestroy'])
        ->name('employee.bulk-destroy');

    Route::get('/settings', function () {
        return redirect('/settings/dropdowns');
    })->name('settings');

    Route::get('/settings/dropdowns', function () {
        return Inertia::render('Settings', [
            'dropdowns' => Dropdown::with('entries')->get(),
        ]);
    })->name('settings.dropdowns');

    Route::get('/api/settings/dropdowns', [DropdownController::class, 'index'])
        ->name('dropdowns.index');
    Route::post('/api/settings/dropdowns', [DropdownController::class, 'store'])
        ->name('dropdowns.store');
    Route::put('/api/settings/dropdowns/{dropdown}', [DropdownController::class, 'update'])
        ->name('dropdowns.update');
    Route::delete('/api/settings/dropdowns/{dropdown}', [DropdownController::class, 'destroy'])
        ->name('dropdowns.destroy');

    Route::post('/api/settings/dropdowns/{dropdown}/entries', [DropdownController::class, 'storeEntry'])
        ->name('dropdowns.entries.store');
    Route::put('/api/settings/dropdowns/{dropdown}/entries/{entry}', [DropdownController::class, 'updateEntry'])
        ->name('dropdowns.entries.update');
    Route::delete('/api/settings/dropdowns/{dropdown}/entries/{entry}', [DropdownController::class, 'destroyEntry'])
        ->name('dropdowns.entries.destroy');
    Route::post('/api/settings/dropdowns/{dropdown}/reorder', [DropdownController::class, 'reorder'])
        ->name('dropdowns.entries.reorder');

    Route::get('/api/dropdowns/{slug}', [DropdownController::class, 'entriesBySlug'])
        ->name('dropdowns.entries.by-slug');

    // Form Fields CMS
    Route::get('/settings/form-fields', function () {
        return Inertia::render('FormFieldSettings', [
            'formFields' => FormField::orderBy('section')->orderBy('sort_order')->get(),
            'dropdowns' => Dropdown::with('entries')->get(),
        ]);
    })->name('settings.form-fields');

    Route::get('/api/settings/form-fields', [FormFieldController::class, 'index'])
        ->name('form-fields.index');
    Route::get('/api/settings/form-fields/active', [FormFieldController::class, 'activeFields'])
        ->name('form-fields.active');
    Route::post('/api/settings/form-fields', [FormFieldController::class, 'store'])
        ->name('form-fields.store');
    Route::put('/api/settings/form-fields/{formField}', [FormFieldController::class, 'update'])
        ->name('form-fields.update');
    Route::delete('/api/settings/form-fields/{formField}', [FormFieldController::class, 'destroy'])
        ->name('form-fields.destroy');
    Route::post('/api/settings/form-fields/reorder', [FormFieldController::class, 'reorder'])
        ->name('form-fields.reorder');

    // Users
    Route::get('/settings/users', function () {
        return Inertia::render('UserSettings', [
            'users' => \App\Models\User::select('id', 'name', 'email', 'role', 'created_at')->get(),
        ]);
    })->name('settings.users');

    Route::get('/api/settings/users', [UserController::class, 'index'])
        ->name('users.index');
    Route::post('/api/settings/users', [UserController::class, 'store'])
        ->name('users.store');
    Route::put('/api/settings/users/{user}', [UserController::class, 'update'])
        ->name('users.update');
    Route::delete('/api/settings/users/{user}', [UserController::class, 'destroy'])
        ->name('users.destroy');

    Route::post('/logout', function () {
        Auth::logout();
        request()->session()->invalidate();
        request()->session()->regenerateToken();
        return redirect('/login');
    })->name('logout');
});
