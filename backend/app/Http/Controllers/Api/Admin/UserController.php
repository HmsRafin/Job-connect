<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::select('id', 'name', 'email', 'role', 'status', 'created_at', 'last_login_at')->latest()->get();
        return response()->json($users);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => 'sometimes|string|in:admin,recruiter,seeker',
            'status' => 'nullable|string|in:active,inactive',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $validated['role'] ??= 'seeker';
        $validated['status'] ??= 'active';

        $user = User::create($validated);

        return response()->json($user, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = User::findOrFail($id);
        return response()->json($user);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,'.$user->id,
            'password' => 'nullable|string|min:8',
            'role' => 'sometimes|string|in:admin,recruiter,seeker',
            'status' => 'sometimes|string|in:active,inactive',
        ]);

        abort_if($user->id === $request->user()->id &&
            (($validated['role'] ?? 'admin') !== 'admin' || ($validated['status'] ?? 'active') !== 'active'),
            422, 'You cannot remove your own administrator access.');

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);
        if (isset($validated['password']) || ($validated['status'] ?? null) === 'inactive' || isset($validated['role'])) {
            $user->tokens()->delete();
        }

        return response()->json($user);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        $user = User::findOrFail($id);
        abort_if($user->id === $request->user()->id, 422, 'You cannot delete your own administrator account.');
        $user->delete();

        return response()->json(null, 204);
    }
}
