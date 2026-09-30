<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobListing extends Model
{
    use HasFactory;

    protected $table = 'listings';

    protected $fillable = [
        'user_id',
        'title',
        'company',
        'category_type',
        'category',
        'type',
        'work_model',
        'location',
        'salary',
        'experience',
        'description',
        'requirements',
        'tags',
        'logo',
        'featured',
        'boosted_days',
        'boost_expiry',
        'status',
    ];

    protected $casts = [
        'requirements' => 'array',
        'tags' => 'array',
        'featured' => 'boolean',
        'boost_expiry' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function applications()
    {
        return $this->hasMany(JobApplication::class, 'listing_id');
    }
}
