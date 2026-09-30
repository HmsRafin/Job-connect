<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('recruitment_tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_id')->nullable()->constrained('job_applications')->nullOnDelete();
            $table->foreignId('recruiter_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('seeker_id')->constrained('users')->cascadeOnDelete();
            $table->string('title');
            $table->text('description');
            $table->date('deadline')->nullable();
            $table->string('status')->default('Pending'); // Pending, Submitted, Completed, Reviewed
            $table->string('submission_url')->nullable();
            $table->text('feedback')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('recruitment_tasks');
    }
};
