<?php

namespace App\Support;

use App\Models\JobApplication;
use App\Models\User;

class Access
{
    public static function recruiter(User $user): void
    {
        abort_unless(in_array($user->role, ['admin', 'recruiter']), 403, 'Recruiter access required.');
    }

    public static function owner(User $user, int $ownerId): void
    {
        abort_unless($user->role === 'admin' || $user->id === $ownerId, 403, 'You cannot access this record.');
    }

    public static function application(User $user, JobApplication $application, bool $manage = false): void
    {
        if (!$manage && $user->role === 'seeker' && $user->id === $application->user_id) {
            return;
        }
        self::recruiter($user);
        self::owner($user, $application->listing->user_id);
    }
}
