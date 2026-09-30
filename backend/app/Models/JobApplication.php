<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobApplication extends Model
{
    use HasFactory;

    protected $fillable = [
        'listing_id',
        'user_id',
        'candidate_name',
        'candidate_email',
        'candidate_phone',
        'resume_url',
        'resume_path',
        'cover_letter',
        'status',
        'ai_score',
        'task_details',
        'interview_date',
    ];

    protected $casts = [
        'task_details' => 'array',
        'interview_date' => 'datetime',
    ];

    protected $hidden = ['resume_path'];

    public function listing()
    {
        return $this->belongsTo(JobListing::class, 'listing_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
