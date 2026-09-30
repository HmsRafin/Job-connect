<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('user_profiles', fn (Blueprint $table) => $table->string('resume_path')->nullable());
        Schema::table('job_applications', fn (Blueprint $table) => $table->string('resume_path')->nullable());
        Schema::table('recruitment_tasks', function (Blueprint $table) {
            $table->string('submission_path')->nullable();
            $table->text('submission_notes')->nullable();
            $table->text('instructions')->nullable();
        });
        Schema::table('scheduled_interviews', fn (Blueprint $table) => $table->text('candidate_response')->nullable());
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('icon')->default('Briefcase');
            $table->timestamps();
        });
        foreach (['Software Development', 'Design', 'Marketing', 'Data Science', 'Finance', 'Human Resources', 'Engineering', 'Other'] as $name) {
            DB::table('categories')->insert(['name' => $name, 'icon' => 'Briefcase', 'created_at' => now(), 'updated_at' => now()]);
        }
        Schema::create('saved_jobs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('listing_id')->constrained('listings')->cascadeOnDelete();
            $table->unique(['user_id', 'listing_id']);
        });
        Schema::create('platform_notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('message');
            $table->boolean('is_read')->default(false);
            $table->timestamps();
        });
        DB::table('users')->whereIn('role', ['user', 'job_seeker'])->update(['role' => 'seeker']);
        DB::table('users')->whereIn('role', ['company', 'employer'])->update(['role' => 'recruiter']);
    }

    public function down(): void
    {
        Schema::dropIfExists('platform_notifications');
        Schema::dropIfExists('saved_jobs');
        Schema::dropIfExists('categories');
        Schema::table('scheduled_interviews', fn (Blueprint $table) => $table->dropColumn('candidate_response'));
        Schema::table('recruitment_tasks', fn (Blueprint $table) => $table->dropColumn(['submission_path', 'submission_notes', 'instructions']));
        Schema::table('job_applications', fn (Blueprint $table) => $table->dropColumn('resume_path'));
        Schema::table('user_profiles', fn (Blueprint $table) => $table->dropColumn('resume_path'));
    }
};
