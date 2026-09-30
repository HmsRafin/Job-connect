<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Advertisement extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'company',
        'image_url',
        'target_url',
        'placement',
        'days',
        'amount',
        'start_date',
        'end_date',
        'status',
        'clicks',
        'impressions',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
