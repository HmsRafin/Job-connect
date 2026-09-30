<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database with the official master Admin account.
     */
    public function run(): void
    {
        $email = config('setup.admin_email');
        $password = config('setup.admin_password');
        if (User::where('role', 'admin')->exists()) {
            return;
        }
        if (!$email || !$password) {
            return;
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($password) < 12) {
            throw new \RuntimeException('Provide a valid ADMIN_EMAIL and ADMIN_PASSWORD of at least 12 characters.');
        }
        $existing = User::where('email', $email)->first();
        if ($existing) {
            if ($existing->role !== 'admin') {
                throw new \RuntimeException('The configured administrator email belongs to another account.');
            }
            return;
        }
        User::create(
            [
                'name' => 'Platform Administrator',
                'email' => $email,
                'password' => Hash::make($password),
                'role' => 'admin',
                'status' => 'active',
            ]
        );
    }
}
