<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobListing;
use App\Models\PlatformNotification;
use App\Support\Access;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class JobController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::guard('sanctum')->user();
        $query = JobListing::withCount('applications')
            ->orderByRaw('CASE WHEN featured = 1 AND (boost_expiry IS NULL OR boost_expiry > ?) THEN 1 ELSE 0 END DESC', [now()])
            ->latest();
        if (!$user || $user->status !== 'active' || $user->role !== 'admin') {
            $query->where(function ($q) use ($user) {
                $q->where('status', 'Active');
                if ($user?->status === 'active' && $user->role === 'recruiter') {
                    $q->orWhere('user_id', $user->id);
                }
            });
        }
        foreach (['user_id', 'category', 'category_type', 'type', 'status'] as $filter) {
            if ($request->filled($filter)) {
                $query->where($filter, $request->input($filter));
            }
        }
        if ($request->filled('search')) {
            $search = mb_substr($request->string('search')->toString(), 0, 200);
            $query->where(function ($q) use ($search) {
                foreach (['title', 'company', 'description', 'location'] as $field) {
                    $q->orWhere($field, 'like', "%{$search}%");
                }
            });
        }
        return response()->json(['success' => true, 'data' => $query->get()]);
    }

    public function show($id)
    {
        $job = JobListing::withCount('applications')->findOrFail($id);
        $user = Auth::guard('sanctum')->user();
        abort_unless($job->status === 'Active' || ($user?->status === 'active' &&
            ($user->role === 'admin' || $user->id === $job->user_id)), 404);
        return response()->json(['success' => true, 'data' => $job]);
    }

    private function rules(bool $creating = false): array
    {
        $rules = [
            'title' => ($creating ? 'required' : 'sometimes').'|string|max:255',
            'description' => ($creating ? 'required' : 'sometimes').'|string|max:50000',
            'category_type' => 'sometimes|string|in:Job,Internship',
            'requirements' => 'sometimes|array|max:100',
            'requirements.*' => 'string|max:2000',
            'tags' => 'sometimes|array|max:30',
            'tags.*' => 'string|max:100',
            'logo' => 'nullable|string|max:2048',
        ];
        foreach (['company', 'category', 'type', 'work_model', 'location', 'salary', 'experience'] as $field) {
            $rules[$field] = 'sometimes|string|max:255';
        }
        return $rules;
    }

    public function store(Request $request)
    {
        Access::recruiter($request->user());
        $data = $request->validate($this->rules(true));
        $data += [
            'company' => $request->user()->name, 'category_type' => 'Job',
            'category' => 'Software Development', 'type' => 'Full-Time',
            'work_model' => 'Remote', 'location' => 'Remote', 'salary' => 'Competitive',
            'experience' => 'Not specified', 'requirements' => [], 'tags' => [],
        ];
        $data['user_id'] = $request->user()->id;
        $data['status'] = $request->user()->role === 'admin' ? 'Active' : 'Pending';
        $listing = JobListing::create($data);
        return response()->json(['success' => true, 'message' => 'Listing saved.', 'data' => $listing], 201);
    }

    public function update(Request $request, $id)
    {
        $listing = JobListing::findOrFail($id);
        $user = $request->user();
        Access::recruiter($user);
        Access::owner($user, $listing->user_id);
        $rules = $this->rules();
        $rules['status'] = ['sometimes', Rule::in($user->role === 'admin'
            ? ['Active', 'Pending', 'Paused', 'Closed', 'Rejected']
            : ['Pending', 'Paused', 'Closed'])];
        $rules['featured'] = $user->role === 'admin' ? 'sometimes|boolean' : 'prohibited';
        $data = $request->validate($rules);
        // Material edits must be reviewed again before the public sees them.
        if ($user->role !== 'admin' && count(array_diff(array_keys($data), ['status'])) > 0) {
            $data['status'] = 'Pending';
        }
        $oldStatus = $listing->status;
        $listing->update($data);
        if ($oldStatus !== $listing->status) {
            PlatformNotification::send($listing->user_id, 'Listing status updated', "{$listing->title}: {$listing->status}");
        }
        return response()->json(['success' => true, 'message' => 'Listing updated.', 'data' => $listing]);
    }

    public function boost(Request $request, $id)
    {
        $listing = JobListing::findOrFail($id);
        Access::recruiter($request->user());
        Access::owner($request->user(), $listing->user_id);
        $data = $request->validate(['days' => 'required|integer|min:1|max:365', 'payment_method' => 'required|in:Demo']);
        abort_unless(config('payments.mode') === 'demo', 503, 'Checkout is disabled. No payment has been taken.');
        abort_unless($listing->status === 'Active', 422, 'Only approved active listings can be boosted.');
        $pricing = \App\Models\Setting::get('boost_pricing', ['day3' => 29, 'day7' => 59, 'day15' => 99, 'day30' => 169, 'customPerDay' => 6]);
        $amount = $pricing['day'.$data['days']] ?? ($data['days'] * $pricing['customPerDay']);
        \Illuminate\Support\Facades\DB::transaction(function () use ($listing, $data, $amount, $request) {
            $listing->update(['featured' => true, 'boosted_days' => $data['days'], 'boost_expiry' => now()->addDays($data['days'])]);
            \App\Models\PaymentRecord::create([
                'user_id' => $request->user()->id, 'type' => 'job_boost', 'reference_title' => $listing->title,
                'amount' => $amount, 'payment_method' => 'Demo', 'status' => 'Demo',
                'transaction_id' => 'DEMO-'.\Illuminate\Support\Str::uuid(),
            ]);
        });
        return response()->json(['success' => true, 'message' => 'Demo boost recorded. No money was charged.', 'data' => $listing]);
    }

    public function cancelBoost(Request $request, $id)
    {
        $listing = JobListing::findOrFail($id);
        Access::recruiter($request->user());
        Access::owner($request->user(), $listing->user_id);
        $listing->update(['featured' => false, 'boosted_days' => 0, 'boost_expiry' => null]);
        return response()->json(['success' => true, 'message' => 'Boost cancelled.', 'data' => $listing]);
    }

    public function destroy(Request $request, $id)
    {
        $listing = JobListing::findOrFail($id);
        Access::recruiter($request->user());
        Access::owner($request->user(), $listing->user_id);
        $listing->delete();
        return response()->json(['success' => true, 'message' => 'Listing deleted.']);
    }
}
