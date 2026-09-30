<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RecruitmentTask extends Model
{
    use HasFactory;

    protected $fillable = [
        'application_id',
        'recruiter_id',
        'seeker_id',
        'title',
        'description',
        'deadline',
        'status',
        'submission_url',
        'feedback',
        'instructions',
        'submission_path',
        'submission_notes',
    ];

    protected $hidden = ['submission_path'];

    public function recruiter()
    {
        return $this->belongsTo(User::class, 'recruiter_id');
    }

    public function seeker()
    {
        return $this->belongsTo(User::class, 'seeker_id');
    }

    public function application()
    {
        return $this->belongsTo(JobApplication::class, 'application_id');
    }
}
