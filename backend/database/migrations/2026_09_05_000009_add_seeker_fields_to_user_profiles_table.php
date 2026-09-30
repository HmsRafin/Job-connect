<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('user_profiles', function (Blueprint $table) {
            $table->string('avatar_url')->nullable()->after('user_id');
            $table->string('date_of_birth')->nullable()->after('phone');
            $table->string('age')->nullable()->after('date_of_birth');
            $table->string('nid_number')->nullable()->after('age');
            $table->string('gender')->nullable()->after('nid_number');
            $table->string('marital_status')->nullable()->after('gender');
            $table->text('address')->nullable()->after('location');
            $table->string('expected_salary')->nullable()->after('bio');
            $table->string('experience_level')->nullable()->after('expected_salary');
            $table->string('availability')->nullable()->after('experience_level');
            $table->json('languages')->nullable()->after('skills');
            $table->json('soft_skills')->nullable()->after('languages');
            $table->string('resume_name')->nullable()->after('resume_url');
            $table->string('resume_size')->nullable()->after('resume_name');
            $table->longText('resume_data')->nullable()->after('resume_size');
        });
    }

    public function down(): void
    {
        Schema::table('user_profiles', function (Blueprint $table) {
            $table->dropColumn([
                'avatar_url',
                'date_of_birth',
                'age',
                'nid_number',
                'gender',
                'marital_status',
                'address',
                'expected_salary',
                'experience_level',
                'availability',
                'languages',
                'soft_skills',
                'resume_name',
                'resume_size',
                'resume_data',
            ]);
        });
    }
};
