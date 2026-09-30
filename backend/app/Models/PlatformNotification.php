<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlatformNotification extends Model
{
    protected $fillable = ['user_id', 'title', 'message', 'is_read'];
    protected $casts = ['is_read' => 'boolean'];

    public static function send(int $userId, string $title, string $message): self
    {
        return static::create(['user_id' => $userId, 'title' => $title, 'message' => $message]);
    }
}