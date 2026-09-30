<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobApplication;
use App\Models\JobListing;
use App\Models\PlatformNotification;
use App\Support\Access;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ApplicationController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = JobApplication::with(['listing', 'user.profile'])->latest();
        if ($user->role === 'seeker') {
            $query->where('user_id', $user->id);
        } elseif ($user->role === 'recruiter') {
            $query->whereHas('listing', fn ($q) => $q->where('user_id', $user->id));
        } else {
            abort_unless($user->role === 'admin', 403);
        }
        foreach (['listing_id', 'status'] as $filter) {
            if ($request->filled($filter)) {
                $query->where($filter, $request->input($filter));
            }
        }
        return response()->json(['success' => true, 'data' => $query->get()]);
    }

    public function store(Request $request)
    {
        abort_unless($request->user()->role === 'seeker', 403, 'Only job seekers can apply.');
        $data = $request->validate([
            'listing_id' => 'required|integer|exists:listings,id',
            'candidate_name' => 'required|string|max:255',
            'candidate_email' => 'required|email|max:255',
            'candidate_phone' => 'nullable|string|max:50',
            'resume_url' => 'nullable|string|max:2048',
            'cover_letter' => 'nullable|string|max:20000',
        ]);
        $user = $request->user();
        $application = DB::transaction(function () use ($data, $user) {
            // Serialize applications for this listing, including duplicate submission retries.
            $listing = JobListing::whereKey($data['listing_id'])->lockForUpdate()->firstOrFail();
            abort_unless($listing->status === 'Active', 422, 'This listing is not accepting applications.');
            abort_if(JobApplication::where('listing_id', $listing->id)->where('user_id', $user->id)->exists(),
                422, 'You have already applied for this position.');
            $data['user_id'] = $user->id;
            $data['candidate_email'] = $user->email;
            $data['status'] = 'Applied';
            // Store an immutable private copy so replacing a profile CV cannot alter old applications.
            $profile = $user->profile;
            if ($profile?->resume_path && Storage::disk('local')->exists($profile->resume_path)) {
                $path = 'application-resumes/'.\Illuminate\Support\Str::uuid().'.pdf';
                Storage::disk('local')->copy($profile->resume_path, $path);
                $data['resume_path'] = $path;
                $data['resume_url'] = '/api/applications/resume';
            } else {
                $data['resume_url'] = null;
            }
            $application = JobApplication::create($data);
            PlatformNotification::send($listing->user_id, 'New application', "{$user->name} applied for {$listing->title}.");
            return $application;
        });
        return response()->json(['success' => true, 'message' => 'Application submitted.', 'data' => $application->load('listing')], 201);
    }

    public function show(Request $request, $id)
    {
        $application = JobApplication::with(['listing', 'user.profile'])->findOrFail($id);
        Access::application($request->user(), $application);
        return response()->json(['success' => true, 'data' => $application]);
    }

    public function updateStatus(Request $request, $id)
    {
        $application = JobApplication::with('listing')->findOrFail($id);
        Access::application($request->user(), $application, true);
        $data = $request->validate([
            'status' => 'required|in:Applied,Screening,Shortlisted,Task,Task Assigned,Task Submitted,Interview,Interview Scheduled,Interview Completed,Offered,Hired,Rejected',
            'interview_date' => 'nullable|date',
            'task_details' => 'nullable|array',
        ]);
        $application->update($data);
        PlatformNotification::send($application->user_id, 'Application updated', "{$application->listing->title}: {$application->status}");
        return response()->json(['success' => true, 'message' => 'Application status updated.', 'data' => $application]);
    }

    public function resume(Request $request, $id)
    {
        $application = JobApplication::with('listing')->findOrFail($id);
        Access::application($request->user(), $application);
        abort_unless($application->resume_path && Storage::disk('local')->exists($application->resume_path), 404, 'No uploaded resume is available.');
        return Storage::disk('local')->download($application->resume_path, 'resume.pdf', ['Content-Type' => 'application/pdf']);
    }
}