<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->string('item_number')->nullable();
            $table->string('position')->nullable();
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('last_name');
            $table->string('extension_name')->nullable();
            $table->string('salary_grade')->nullable();
            $table->string('step')->nullable();
            $table->enum('sex', ['male', 'female']);
            $table->date('date_of_birth')->nullable();
            $table->string('tin', 9)->nullable();
            $table->date('date_of_original_appointment')->nullable();
            $table->date('date_of_last_promotion')->nullable();
            $table->text('permanent_address')->nullable();
            $table->string('civil_status')->nullable();
            $table->string('gsis_bp_no', 10)->nullable();
            $table->string('pag_ibig_no', 12)->nullable();
            $table->string('philhealth_no', 13)->nullable();
            $table->string('cellphone_no')->nullable();
            $table->string('email_address')->nullable();
            $table->string('highest_educational_attainment')->nullable();
            $table->string('cs_eligibility')->nullable();
            $table->string('employee_number')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
