<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ItemController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\Admin\DashboardController;

use App\Http\Controllers\Api\JobController;
use App\Http\Controllers\Api\ApplicationController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\TaskInterviewController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\ComplaintController;

Route::get('/health', \App\Http\Controllers\Api\HealthController::class);

Route::get('/test', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'Backend is successfully connected!',
    ]);
});

// Public Listings & Settings
Route::get('/jobs', [JobController::class, 'index']);
Route::get('/jobs/{id}', [JobController::class, 'show']);
Route::get('/settings/boost-pricing', [SettingController::class, 'getBoostPricing']);
Route::get('/settings/payment-mode', [SettingController::class, 'paymentMode']);
Route::get('/settings/ad-pricing', [SettingController::class, 'adPricing']);
Route::get('/categories', [\App\Http\Controllers\Api\PlatformController::class, 'categories']);
Route::get('/advertisements', [TaskInterviewController::class, 'getAdvertisements']);
Route::post('/contact/submit', [ComplaintController::class, 'store'])->middleware('throttle:10,1');

// Auth Endpoints
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:10,1');
Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:10,1');

Route::middleware(['auth:sanctum', 'active'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/update-credentials', [AuthController::class, 'updateCredentials']);
    
    // Profile Management (Seeker CV & Employer Profile)
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::post('/profile', [ProfileController::class, 'update']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::post('/profile/upload-resume', [ProfileController::class, 'uploadResume']);
    Route::post('/profile/upload-image', [ProfileController::class, 'uploadImage']);
    Route::get('/profile/resume', [ProfileController::class, 'resume']);

    Route::get('/saved-jobs', [\App\Http\Controllers\Api\PlatformController::class, 'savedJobs']);
    Route::post('/saved-jobs', [\App\Http\Controllers\Api\PlatformController::class, 'saveJob']);
    Route::delete('/saved-jobs/{id}', [\App\Http\Controllers\Api\PlatformController::class, 'unsaveJob']);
    Route::get('/notifications', [\App\Http\Controllers\Api\PlatformController::class, 'notifications']);
    Route::put('/notifications/read-all', [\App\Http\Controllers\Api\PlatformController::class, 'readAll']);
    Route::put('/notifications/{id}', [\App\Http\Controllers\Api\PlatformController::class, 'readNotification']);

    // Job Listings Management
    Route::post('/jobs', [JobController::class, 'store']);
    Route::put('/jobs/{id}', [JobController::class, 'update']);
    Route::post('/jobs/{id}/boost', [JobController::class, 'boost']);
    Route::post('/jobs/{id}/cancel-boost', [JobController::class, 'cancelBoost']);
    Route::delete('/jobs/{id}', [JobController::class, 'destroy']);

    // Job Applications & Recruitment Pipeline
    Route::get('/applications', [ApplicationController::class, 'index']);
    Route::post('/applications', [ApplicationController::class, 'store']);
    Route::get('/applications/{id}', [ApplicationController::class, 'show']);
    Route::get('/applications/{id}/resume', [ApplicationController::class, 'resume']);
    Route::put('/applications/{id}/status', [ApplicationController::class, 'updateStatus']);

    // Recruitment Tasks & Interviews
    Route::get('/tasks', [TaskInterviewController::class, 'getTasks']);
    Route::post('/tasks', [TaskInterviewController::class, 'createTask']);
    Route::put('/tasks/{id}', [TaskInterviewController::class, 'updateTask']);
    Route::get('/tasks/{id}/submission', [TaskInterviewController::class, 'submission']);

    Route::get('/interviews', [TaskInterviewController::class, 'getInterviews']);
    Route::post('/interviews', [TaskInterviewController::class, 'createInterview']);
    Route::put('/interviews/{id}', [TaskInterviewController::class, 'updateInterview']);

    // Advertisements & Payments
    Route::post('/advertisements', [TaskInterviewController::class, 'createAdvertisement']);
    Route::get('/payments', [TaskInterviewController::class, 'getPayments']);

    // Boost Pricing Settings
    Route::post('/settings/boost-pricing', [SettingController::class, 'updateBoostPricing'])->middleware('admin');
    Route::post('/settings/ad-pricing', [SettingController::class, 'updateAdPricing'])->middleware('admin');
    Route::post('/categories', [\App\Http\Controllers\Api\PlatformController::class, 'createCategory'])->middleware('admin');
    Route::put('/categories/{id}', [\App\Http\Controllers\Api\PlatformController::class, 'updateCategory'])->middleware('admin');
    Route::delete('/categories/{id}', [\App\Http\Controllers\Api\PlatformController::class, 'deleteCategory'])->middleware('admin');

    // Complain Box & Support Inquiries
    Route::get('/complaints', [ComplaintController::class, 'index']);
    Route::get('/complaints/{id}', [ComplaintController::class, 'show']);
    Route::post('/complaints/{id}/reply', [ComplaintController::class, 'reply'])->middleware('admin');
    Route::put('/complaints/{id}/status', [ComplaintController::class, 'updateStatus'])->middleware('admin');

    Route::prefix('admin')->middleware('admin')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index']);
        Route::apiResource('/users', UserController::class);
    });
});
