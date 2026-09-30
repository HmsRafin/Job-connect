<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('scheduled_interviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_id')->nullable()->constrained('job_applications')->nullOnDelete();
            $table->foreignId('recruiter_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('seeker_id')->constrained('users')->cascadeOnDelete();
            $table->string('title');
            $table->date('date');
            $table->string('time');
            $table->string('meeting_link')->nullable();
            $table->string('type')->default('Video'); // Video, In-Person, Phone
            $table->string('status')->default('Scheduled'); // Scheduled, Completed, Rescheduled, Cancelled
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('scheduled_interviews');
    }
};
