<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\User;
use App\Models\LoginHistory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
            'role' => 'nullable|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials do not match our records.'],
            ]);
        }

        abort_unless($user->status === 'active', 403, 'This account is inactive.');

        // Normalize legacy or alternative role names
        if ($user->role === 'job_seeker') {
            $user->role = 'seeker';
            $user->save();
        } elseif ($user->role === 'employer') {
            $user->role = 'recruiter';
            $user->save();
        }

        $user->update(['last_login_at' => now()]);

        LoginHistory::create([
            'user_id' => $user->id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'status' => 'success',
            'login_at' => now(),
        ]);

        $token = $user->createToken('auth_token', ['*'], now()->addDays(7))->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }

    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user(),
        ]);
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|max:255',
            'role' => 'nullable|string|in:seeker,job_seeker,recruiter,employer,company',
            'company' => 'nullable|string|max:255',
        ]);

        $rawRole = $request->input('role', 'seeker');
        $role = match ($rawRole) {
            'recruiter', 'employer', 'company' => 'recruiter',
            default => 'seeker',
        };

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $role,
            'status' => 'active',
        ]);

        if ($role === 'recruiter') {
            \App\Models\UserProfile::create(['user_id' => $user->id, 'company_name' => $request->input('company') ?: $user->name]);
        }

        $token = $user->createToken('auth_token', ['*'], now()->addDays(7))->plainTextToken;

        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user->load('profile'),
            'token' => $token,
        ], 201);
    }

    /**
     * Handover / Update Account Credentials (Name, Email, Password)
     * Requires verifying current password before allowing email or password change.
     */
    public function updateCredentials(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $user->id,
            'current_password' => 'required|string',
            'new_password' => 'nullable|string|min:8|max:255',
        ]);

        // Security verification of existing password
        if (! Hash::check($request->current_password, $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['The current password you entered is incorrect.'],
            ]);
        }

        $user->name = $request->name;
        $user->email = $request->email;

        if ($request->filled('new_password')) {
            $user->password = Hash::make($request->new_password);
        }

        $user->save();

        if ($request->filled('new_password')) {
            $user->tokens()->where('id', '!=', $user->currentAccessToken()?->id)->delete();
        }

        return response()->json([
            'message' => 'Account credentials and handover information updated successfully.',
            'user' => $user,
        ]);
    }
}
