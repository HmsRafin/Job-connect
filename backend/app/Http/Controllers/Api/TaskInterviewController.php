<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Advertisement;
use App\Models\JobApplication;
use App\Models\PaymentRecord;
use App\Models\PlatformNotification;
use App\Models\RecruitmentTask;
use App\Models\ScheduledInterview;
use App\Support\Access;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class TaskInterviewController extends Controller
{
    private function ownedQuery(Request $request, string $model)
    {
        $user = $request->user();
        $query = $model::with(['application.listing', 'recruiter', 'seeker'])->latest();
        if ($user->role === 'seeker') {
            $query->where('seeker_id', $user->id);
        } elseif ($user->role === 'recruiter') {
            $query->where('recruiter_id', $user->id);
        } else {
            abort_unless($user->role === 'admin', 403);
        }
        return $query;
    }

    private function applicationFor(Request $request): JobApplication
    {
        Access::recruiter($request->user());
        $application = JobApplication::with('listing')->findOrFail($request->input('application_id'));
        Access::application($request->user(), $application, true);
        return $application;
    }

    public function getTasks(Request $request)
    {
        return response()->json(['success' => true, 'data' => $this->ownedQuery($request, RecruitmentTask::class)->get()]);
    }

    public function createTask(Request $request)
    {
        Access::recruiter($request->user());
        $data = $request->validate([
            'application_id' => 'required|integer|exists:job_applications,id',
            'title' => 'required|string|max:255', 'description' => 'required|string|max:20000',
            'deadline' => 'required|date|after_or_equal:today',
            'instructions' => 'nullable|string|max:10000',
        ]);
        $application = $this->applicationFor($request);
        $task = DB::transaction(function () use ($data, $application) {
            $task = RecruitmentTask::create([
                'application_id' => $application->id, 'recruiter_id' => $application->listing->user_id,
                'seeker_id' => $application->user_id, 'title' => $data['title'],
                'description' => $data['description'], 'deadline' => $data['deadline'],
                'instructions' => $data['instructions'] ?? null, 'status' => 'Pending',
            ]);
            $application->update(['status' => 'Task Assigned', 'task_details' => [
                'task_id' => $task->id, 'title' => $task->title, 'deadline' => $task->deadline, 'status' => 'Pending',
            ]]);
            PlatformNotification::send($application->user_id, 'New recruitment task', $task->title);
            return $task;
        });
        return response()->json(['success' => true, 'message' => 'Task assigned.', 'data' => $task->load(['application.listing', 'seeker', 'recruiter'])], 201);
    }

    public function updateTask(Request $request, $id)
    {
        $task = RecruitmentTask::findOrFail($id);
        $user = $request->user();
        $candidate = $user->role === 'seeker';
        if ($candidate) {
            Access::owner($user, $task->seeker_id);
            abort_unless(in_array($task->status, ['Pending', 'Submitted']), 422, 'This task is closed for submissions.');
            $data = $request->validate([
                'status' => 'required|in:Submitted',
                'submission_url' => 'nullable|url:http,https|max:2048',
                'submission_notes' => 'nullable|string|max:20000',
                'submission_file' => 'nullable|file|mimes:pdf,zip,txt|max:10240',
                'feedback' => 'prohibited', 'title' => 'prohibited', 'description' => 'prohibited',
                'deadline' => 'prohibited',
            ]);
            abort_unless($request->hasFile('submission_file') || $request->filled('submission_url') ||
                $request->filled('submission_notes') || $task->submission_path || $task->submission_url,
                422, 'Provide a file, URL, or written response.');
            if ($request->hasFile('submission_file')) {
                $data['submission_path'] = $request->file('submission_file')->store('task-submissions', 'local');
                $data['submission_url'] = '/api/tasks/'.$task->id.'/submission';
            }
            unset($data['submission_file']);
        } else {
            Access::recruiter($user);
            Access::owner($user, $task->recruiter_id);
            $data = $request->validate([
                'status' => 'sometimes|in:Pending,Submitted,Completed,Reviewed,Rejected',
                'feedback' => 'nullable|string|max:20000',
                'deadline' => 'sometimes|date|after_or_equal:today',
                'title' => 'sometimes|string|max:255', 'description' => 'sometimes|string|max:20000',
            ]);
        }
        DB::transaction(function () use ($task, $data, $candidate) {
            $task->update($data);
            if ($task->application_id && $task->status === 'Submitted') {
                $task->application->update(['status' => 'Task Submitted']);
            }
            PlatformNotification::send($candidate ? $task->recruiter_id : $task->seeker_id, 'Task updated', "{$task->title}: {$task->status}");
        });
        return response()->json(['success' => true, 'message' => 'Task updated.', 'data' => $task->load(['application.listing', 'seeker', 'recruiter'])]);
    }

    public function submission(Request $request, $id)
    {
        $task = RecruitmentTask::findOrFail($id);
        $user = $request->user();
        Access::owner($user, $user->role === 'seeker' ? $task->seeker_id : $task->recruiter_id);
        abort_unless($task->submission_path && Storage::disk('local')->exists($task->submission_path), 404);
        return Storage::disk('local')->download($task->submission_path);
    }

    public function getInterviews(Request $request)
    {
        return response()->json(['success' => true, 'data' => $this->ownedQuery($request, ScheduledInterview::class)->get()]);
    }

    public function createInterview(Request $request)
    {
        Access::recruiter($request->user());
        $data = $request->validate([
            'application_id' => 'required|integer|exists:job_applications,id',
            'title' => 'required|string|max:255', 'date' => 'required|date|after_or_equal:today',
            'time' => 'required|date_format:H:i', 'meeting_link' => 'nullable|url:http,https|max:2048',
            'type' => 'sometimes|in:Video,In-Person,Phone', 'notes' => 'nullable|string|max:20000',
        ]);
        $application = $this->applicationFor($request);
        $interview = DB::transaction(function () use ($data, $application) {
            $data['recruiter_id'] = $application->listing->user_id;
            $data['seeker_id'] = $application->user_id;
            $data['status'] = 'Scheduled';
            $interview = ScheduledInterview::create($data);
            $application->update(['status' => 'Interview Scheduled', 'interview_date' => $data['date'].' '.$data['time']]);
            PlatformNotification::send($application->user_id, 'Interview scheduled', "{$interview->title} on {$interview->date} at {$interview->time}");
            return $interview;
        });
        return response()->json(['success' => true, 'message' => 'Interview scheduled.', 'data' => $interview->load(['application.listing', 'seeker', 'recruiter'])], 201);
    }

    public function updateInterview(Request $request, $id)
    {
        $interview = ScheduledInterview::findOrFail($id);
        $user = $request->user();
        if ($user->role === 'seeker') {
            Access::owner($user, $interview->seeker_id);
            $data = $request->validate([
                'status' => 'sometimes|in:Confirmed,Declined',
                'candidate_response' => 'nullable|string|max:10000',
                'title' => 'prohibited', 'date' => 'prohibited', 'time' => 'prohibited', 'notes' => 'prohibited',
                'meeting_link' => 'prohibited', 'type' => 'prohibited',
            ]);
        } else {
            Access::recruiter($user);
            Access::owner($user, $interview->recruiter_id);
            $data = $request->validate([
                'title' => 'sometimes|string|max:255', 'date' => 'sometimes|date|after_or_equal:today',
                'time' => 'sometimes|date_format:H:i', 'meeting_link' => 'nullable|url:http,https|max:2048',
                'type' => 'sometimes|in:Video,In-Person,Phone',
                'status' => 'sometimes|in:Scheduled,Confirmed,Declined,Completed,Rescheduled,Cancelled',
                'notes' => 'nullable|string|max:20000',
            ]);
        }
        DB::transaction(function () use ($interview, $data, $user) {
            $interview->update($data);
            if ($interview->application_id && (isset($data['date']) || isset($data['time']))) {
                $interview->application->update(['interview_date' => $interview->date.' '.$interview->time]);
            }
            PlatformNotification::send($user->role === 'seeker' ? $interview->recruiter_id : $interview->seeker_id, 'Interview updated', "{$interview->title}: {$interview->status}");
        });
        return response()->json(['success' => true, 'message' => 'Interview updated.', 'data' => $interview->load(['application.listing', 'seeker', 'recruiter'])]);
    }

    public function getAdvertisements(Request $request)
    {
        $user = Auth::guard('sanctum')->user();
        $query = Advertisement::latest();
        if ($user?->status !== 'active' || $user->role !== 'admin') {
            $query->where(function ($q) use ($user) {
                $q->where(fn ($active) => $active->where('status', 'Active')->where('start_date', '<=', now())->where('end_date', '>', now()));
                if ($user?->status === 'active' && $user->role === 'recruiter') {
                    $q->orWhere('user_id', $user->id);
                }
            });
        }
        return response()->json(['success' => true, 'data' => $query->get()]);
    }

    public function createAdvertisement(Request $request)
    {
        Access::recruiter($request->user());
        abort_unless(config('payments.mode') === 'demo', 503, 'Checkout is disabled. No payment has been taken.');
        $data = $request->validate([
            'title' => 'required|string|max:255', 'description' => 'nullable|string|max:5000',
            'company' => 'required|string|max:255', 'image_url' => 'required|url:http,https|max:2048',
            'target_url' => 'required|url:http,https|max:2048', 'placement' => 'required|in:Sidebar,Banner,Premium',
            'days' => 'required|integer|min:1|max:365', 'payment_method' => 'required|in:Demo',
        ]);
        $pricing = \App\Models\Setting::get('ad_pricing', ['Sidebar' => 9, 'Banner' => 19, 'Premium' => 29]);
        $advertisement = DB::transaction(function () use ($request, $data, $pricing) {
            unset($data['payment_method']);
            $data += ['user_id' => $request->user()->id, 'amount' => $pricing[$data['placement']] * $data['days'],
                'start_date' => now(), 'end_date' => now()->addDays($data['days']), 'status' => 'Active'];
            $advertisement = Advertisement::create($data);
            PaymentRecord::create(['user_id' => $request->user()->id, 'type' => 'advertisement', 'reference_title' => $data['title'],
                'amount' => $data['amount'], 'payment_method' => 'Demo', 'status' => 'Demo',
                'transaction_id' => 'DEMO-'.\Illuminate\Support\Str::uuid()]);
            return $advertisement;
        });
        return response()->json(['success' => true, 'message' => 'Demo advertisement recorded. No money was charged.', 'data' => $advertisement], 201);
    }

    public function getPayments(Request $request)
    {
        $query = PaymentRecord::with('user:id,name')->latest();
        if ($request->user()->role !== 'admin') {
            $query->where('user_id', $request->user()->id);
        }
        return response()->json(['success' => true, 'data' => $query->get()]);
    }
}
