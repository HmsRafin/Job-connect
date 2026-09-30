<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserProfile extends Model
{
    protected $hidden = ['resume_path', 'resume_data'];
    use HasFactory;

    protected $fillable = [
        'user_id',
        'avatar_url',
        'title',
        'phone',
        'date_of_birth',
        'age',
        'nid_number',
        'gender',
        'marital_status',
        'location',
        'address',
        'bio',
        'expected_salary',
        'experience_level',
        'availability',
        'skills',
        'languages',
        'soft_skills',
        'experience',
        'education',
        'resume_url',
        'resume_path',
        'resume_name',
        'resume_size',
        'resume_data',
        'portfolio_url',
        'github_url',
        'linkedin_url',
        'company_name',
        'tagline',
        'company_website',
        'company_logo',
        'company_banner',
        'industry',
        'company_size',
        'employee_count',
        'founded_year',
        'company_type',
        'owner_name',
        'owner_title',
        'owner_photo',
        'owner_bio',
        'ceo_name',
        'ceo_bio',
        'directors',
        'head_office',
        'branch_offices',
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
    ];

    protected $casts = [
        'skills' => 'array',
        'languages' => 'array',
        'soft_skills' => 'array',
        'experience' => 'array',
        'education' => 'array',
        'directors' => 'array',
        'branch_offices' => 'array',
        'achievements' => 'array',
        'perks_and_benefits' => 'array',
        'specialties' => 'array',
        'social_links' => 'array',
        'is_verified' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
