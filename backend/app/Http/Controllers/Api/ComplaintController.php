<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Complaint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ComplaintController extends Controller
{
    /**
     * Submit a new complaint / support inquiry (Public or Auth)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:50',
            'role' => 'nullable|string|max:50',
            'category' => 'nullable|string|max:100',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
            'priority' => 'nullable|string|in:Low,Normal,High,Urgent',
        ]);

        $user = Auth::guard('sanctum')->user();

        $initialHistory = [
            [
                'action' => 'Submitted',
                'actor' => $validated['name'],
                'role' => $validated['role'] ?? ($user ? $user->role : 'Guest'),
                'email' => $validated['email'],
                'message' => $validated['message'],
                'timestamp' => now()->toIso8601String(),
            ]
        ];

        $complaint = Complaint::create([
            'user_id' => $user ? $user->id : null,
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'role' => $validated['role'] ?? ($user ? $user->role : 'guest'),
            'category' => $validated['category'] ?? 'General Support',
            'subject' => $validated['subject'],
            'message' => $validated['message'],
            'status' => 'Open',
            'priority' => $validated['priority'] ?? 'Normal',
            'history' => $initialHistory,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Your message / inquiry has been submitted successfully to system administration.',
            'data' => $complaint,
        ], 201);
    }

    /**
     * List complaints (Admin gets all, Users get their own)
     */
    public function index(Request $request)
    {
        $user = Auth::guard('sanctum')->user();
        
        $query = Complaint::with(['user', 'admin'])->orderBy('created_at', 'desc');

        if ($user && ($user->role === 'admin' || $user->role === 'superadmin')) {
            // Admin can filter by status, category, role
            if ($request->has('status') && $request->status !== 'All') {
                $query->where('status', $request->status);
            }
            if ($request->has('role') && $request->role !== 'All') {
                $query->where('role', $request->role);
            }
            if ($request->has('category') && $request->category !== 'All') {
                $query->where('category', $request->category);
            }
            if ($request->has('search') && !empty($request->search)) {
                $s = $request->search;
                $query->where(function($q) use ($s) {
                    $q->where('name', 'like', "%{$s}%")
                      ->orWhere('email', 'like', "%{$s}%")
                      ->orWhere('subject', 'like', "%{$s}%")
                      ->orWhere('message', 'like', "%{$s}%");
                });
            }
        } elseif ($user) {
            // Seeker or Recruiter
            $query->where(function($q) use ($user) {
                $q->where('user_id', $user->id);
            });
        } else {
            return response()->json(['data' => []]);
        }

        return response()->json([
            'success' => true,
            'data' => $query->get(),
        ]);
    }

    /**
     * Show complaint details
     */
    public function show(Request $request, $id)
    {
        $complaint = Complaint::with(['user', 'admin'])->findOrFail($id);
        abort_unless($request->user()->role === 'admin' || $complaint->user_id === $request->user()->id, 403);
        return response()->json([
            'success' => true,
            'data' => $complaint,
        ]);
    }

    /**
     * Admin Reply / Feedback to complaint
     */
    public function reply(Request $request, $id)
    {
        $validated = $request->validate([
            'feedback' => 'required|string',
            'status' => 'nullable|string|in:Open,In Review,Resolved,Closed',
            'priority' => 'nullable|string|in:Low,Normal,High,Urgent',
        ]);

        $complaint = Complaint::findOrFail($id);
        $admin = Auth::guard('sanctum')->user();

        $history = $complaint->history ?? [];
        $history[] = [
            'action' => 'Admin Feedback',
            'actor' => $admin ? $admin->name : 'System Administrator',
            'role' => 'admin',
            'email' => $admin ? $admin->email : 'admin@jobconnect.com',
            'message' => $validated['feedback'],
            'new_status' => $validated['status'] ?? $complaint->status,
            'timestamp' => now()->toIso8601String(),
        ];

        $complaint->update([
            'admin_feedback' => $validated['feedback'],
            'admin_id' => $admin ? $admin->id : null,
            'status' => $validated['status'] ?? 'Resolved',
            'priority' => $validated['priority'] ?? $complaint->priority,
            'replied_at' => now(),
            'history' => $history,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Feedback response submitted and recorded in history.',
            'data' => $complaint->fresh(['user', 'admin']),
        ]);
    }

    /**
     * Admin status update
     */
    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:Open,In Review,Resolved,Closed',
            'priority' => 'nullable|string|in:Low,Normal,High,Urgent',
            'note' => 'nullable|string',
        ]);

        $complaint = Complaint::findOrFail($id);
        $admin = Auth::guard('sanctum')->user();

        $history = $complaint->history ?? [];
        $history[] = [
            'action' => 'Status Change',
            'actor' => $admin ? $admin->name : 'System Administrator',
            'role' => 'admin',
            'note' => $validated['note'] ?? "Status changed to {$validated['status']}",
            'new_status' => $validated['status'],
            'timestamp' => now()->toIso8601String(),
        ];

        $complaint->update([
            'status' => $validated['status'],
            'priority' => $validated['priority'] ?? $complaint->priority,
            'history' => $history,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Status updated successfully.',
            'data' => $complaint->fresh(['user', 'admin']),
        ]);
    }
}
