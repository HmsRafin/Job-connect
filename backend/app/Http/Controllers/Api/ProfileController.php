<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\UserProfile;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user();
        $profile = UserProfile::firstOrCreate(
            ['user_id' => $user->id],
            [
                'title' => $user->role === 'seeker' ? 'Candidate' : null,
                'company_name' => $user->role === 'recruiter' ? $user->name : null,
            ]
        );

        return response()->json([
            'success' => true,
            'user' => $user,
            'profile' => $profile,
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $rules = ['name' => 'sometimes|string|max:255', 'is_verified' => 'prohibited', 'resume_path' => 'prohibited'];
        $arrayFields = ['skills', 'languages', 'soft_skills', 'experience', 'education', 'directors', 'branch_offices',
            'achievements', 'perks_and_benefits', 'specialties', 'social_links'];
        $textFields = ['bio', 'address', 'owner_bio', 'ceo_bio', 'head_office', 'mission', 'vision', 'company_culture'];
        foreach ((new UserProfile)->getFillable() as $field) {
            if (in_array($field, ['user_id', 'is_verified', 'resume_path', 'resume_data'])) {
                continue;
            }
            $rules[$field] = in_array($field, $arrayFields) ? 'nullable|array|max:100' :
                'nullable|string|max:'.(in_array($field, $textFields) ? 20000 : 255);
        }
        $request->validate($rules);

        // Update basic User name if provided
        if ($request->filled('name')) {
            $user->name = $request->name;
            $user->save();
        }

        $profile = UserProfile::firstOrCreate(['user_id' => $user->id]);

        $profile->update($request->only([
            'avatar_url', 'title', 'phone', 'date_of_birth', 'age', 'nid_number', 'gender', 'marital_status',
            'location', 'address', 'bio', 'expected_salary', 'experience_level', 'availability',
            'skills', 'languages', 'soft_skills', 'experience', 'education',
            'portfolio_url', 'github_url', 'linkedin_url',
            // Company profile fields
            'company_name', 'tagline', 'company_website', 'company_logo', 'company_banner',
            'industry', 'company_size', 'employee_count', 'founded_year', 'company_type',
            'owner_name', 'owner_title', 'owner_photo', 'owner_bio',
            'ceo_name', 'ceo_bio', 'directors',
            'head_office', 'branch_offices', 'working_days', 'office_hours',
            'achievements', 'mission', 'vision', 'company_culture',
            'perks_and_benefits', 'specialties',
            'contact_email', 'contact_phone', 'social_links',
            'trade_license_no', 'tax_id'
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Profile updated and saved to database successfully.',
            'user' => $user,
            'profile' => $profile,
        ]);
    }

    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,webp,gif|max:5120',
            'type' => 'nullable|string',
        ]);

        $file = $request->file('image');
        $type = $request->input('type', 'company');
        $folder = in_array($type, ['logo', 'banner', 'owner', 'director', 'avatar']) ? $type . 's' : 'company_assets';
        
        $fileName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs($folder, $fileName, 'public');

        return response()->json([
            'success' => true,
            'message' => 'Image uploaded successfully.',
            'url' => '/storage/' . $path,
            'file_name' => $file->getClientOriginalName(),
        ]);
    }

    public function uploadResume(Request $request)
    {
        $request->validate([
            'resume' => 'required|file|mimes:pdf|max:10240',
        ]);

        $user = $request->user();
        $file = $request->file('resume');
        $path = $file->store('resumes', 'local');

        $profile = UserProfile::firstOrCreate(['user_id' => $user->id]);
        $profile->resume_name = $file->getClientOriginalName();
        $profile->resume_size = round($file->getSize() / (1024 * 1024), 2) . ' MB';
        $oldPath = $profile->resume_path;
        $profile->resume_path = $path;
        $profile->resume_url = '/api/profile/resume';
        $profile->save();
        if ($oldPath) {
            Storage::disk('local')->delete($oldPath);
        }

        return response()->json([
            'success' => true,
            'message' => 'Resume uploaded successfully.',
            'resume_name' => $profile->resume_name,
            'resume_size' => $profile->resume_size,
            'resume_url' => $profile->resume_url,
        ]);
    }

    public function resume(Request $request)
    {
        $profile = $request->user()->profile;
        abort_unless($profile?->resume_path && Storage::disk('local')->exists($profile->resume_path), 404);
        return Storage::disk('local')->download($profile->resume_path, 'resume.pdf', ['Content-Type' => 'application/pdf']);
    }
}
