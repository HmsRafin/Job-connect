<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('user_profiles', function (Blueprint $table) {
            $table->string('tagline')->nullable()->after('company_name');
            $table->string('company_banner')->nullable()->after('company_logo');
            $table->string('owner_name')->nullable()->after('company_size');
            $table->string('owner_title')->nullable()->after('owner_name');
            $table->string('owner_photo')->nullable()->after('owner_title');
            $table->text('owner_bio')->nullable()->after('owner_photo');
            $table->string('ceo_name')->nullable()->after('owner_bio');
            $table->text('ceo_bio')->nullable()->after('ceo_name');
            $table->json('directors')->nullable()->after('ceo_bio');
            $table->text('head_office')->nullable()->after('directors');
            $table->json('branch_offices')->nullable()->after('head_office');
            $table->string('employee_count')->nullable()->after('branch_offices');
            $table->string('founded_year')->nullable()->after('employee_count');
            $table->string('company_type')->nullable()->after('founded_year');
            $table->string('working_days')->nullable()->after('company_type');
            $table->string('office_hours')->nullable()->after('working_days');
            $table->json('achievements')->nullable()->after('office_hours');
            $table->text('mission')->nullable()->after('achievements');
            $table->text('vision')->nullable()->after('mission');
            $table->text('company_culture')->nullable()->after('vision');
            $table->json('perks_and_benefits')->nullable()->after('company_culture');
            $table->json('specialties')->nullable()->after('perks_and_benefits');
            $table->string('contact_email')->nullable()->after('specialties');
            $table->string('contact_phone')->nullable()->after('contact_email');
            $table->json('social_links')->nullable()->after('contact_phone');
            $table->string('trade_license_no')->nullable()->after('social_links');
            $table->string('tax_id')->nullable()->after('trade_license_no');
            $table->boolean('is_verified')->default(false)->after('tax_id');
        });
    }

    public function down(): void
    {
        Schema::table('user_profiles', function (Blueprint $table) {
            $table->dropColumn([
                'tagline',
                'company_banner',
                'owner_name',
                'owner_title',
                'owner_photo',
                'owner_bio',
                'ceo_name',
                'ceo_bio',
                'directors',
                'head_office',
                'branch_offices',
                'employee_count',
                'founded_year',
                'company_type',
                'working_days',
                'office_hours',
                'achievements',
                'mission',
                'vision',
                'company_culture',
                'perks_and_benefits',
                'specialties',
                'contact_email',
                'contact_phone',
                'social_links',
                'trade_license_no',
                'tax_id',
                'is_verified',
            ]);
        });
    }
};
