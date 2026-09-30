<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobListing;
use App\Models\PlatformNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class PlatformController extends Controller
{
    public function categories()
    {
        return response()->json(['success' => true, 'data' => DB::table('categories')->orderBy('name')->get()]);
    }

    public function createCategory(Request $request)
    {
        $data = $request->validate(['name' => 'required|string|max:100|unique:categories,name', 'icon' => 'sometimes|string|max:50']);
        $id = DB::table('categories')->insertGetId($data + ['created_at' => now(), 'updated_at' => now()]);
        return response()->json(['success' => true, 'data' => DB::table('categories')->find($id)], 201);
    }

    public function updateCategory(Request $request, $id)
    {
        $category = DB::table('categories')->find($id);
        abort_unless($category, 404);
        $data = $request->validate(['name' => ['required', 'string', 'max:100', Rule::unique('categories', 'name')->ignore($id)], 'icon' => 'sometimes|string|max:50']);
        DB::transaction(function () use ($category, $data, $id) {
            DB::table('categories')->where('id', $id)->update($data + ['updated_at' => now()]);
            JobListing::where('category', $category->name)->update(['category' => $data['name']]);
        });
        return response()->json(['success' => true, 'data' => DB::table('categories')->find($id)]);
    }

    public function deleteCategory($id)
    {
        $category = DB::table('categories')->find($id);
        abort_unless($category, 404);
        abort_if(JobListing::where('category', $category->name)->exists(), 422, 'This category is used by existing listings.');
        DB::table('categories')->where('id', $id)->delete();
        return response()->json(['success' => true]);
    }

    public function savedJobs(Request $request)
    {
        return response()->json(['success' => true, 'data' => DB::table('saved_jobs')->where('user_id', $request->user()->id)->pluck('listing_id')]);
    }

    public function saveJob(Request $request)
    {
        abort_unless($request->user()->role === 'seeker', 403);
        $data = $request->validate(['listing_id' => 'required|integer|exists:listings,id']);
        abort_unless(JobListing::whereKey($data['listing_id'])->where('status', 'Active')->exists(), 422);
        DB::table('saved_jobs')->updateOrInsert(['user_id' => $request->user()->id, 'listing_id' => $data['listing_id']]);
        return $this->savedJobs($request);
    }

    public function unsaveJob(Request $request, $id)
    {
        DB::table('saved_jobs')->where('user_id', $request->user()->id)->where('listing_id', $id)->delete();
        return $this->savedJobs($request);
    }

    public function notifications(Request $request)
    {
        return response()->json(['success' => true, 'data' => PlatformNotification::where('user_id', $request->user()->id)->latest()->limit(100)->get()]);
    }

    public function readNotification(Request $request, $id)
    {
        $notification = PlatformNotification::where('user_id', $request->user()->id)->findOrFail($id);
        $data = $request->validate(['is_read' => 'required|boolean']);
        $notification->update($data);
        return response()->json(['success' => true, 'data' => $notification]);
    }

    public function readAll(Request $request)
    {
        PlatformNotification::where('user_id', $request->user()->id)->update(['is_read' => true]);
        return response()->json(['success' => true]);
    }
}