<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ScheduledInterview extends Model
{
    use HasFactory;

    protected $fillable = [
        'application_id',
        'recruiter_id',
        'seeker_id',
        'title',
        'date',
        'time',
        'meeting_link',
        'type',
        'status',
        'notes',
        'candidate_response',
    ];

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
