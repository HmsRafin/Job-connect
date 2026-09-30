<?php

namespace Tests\Feature;

use App\Models\JobApplication;
use App\Models\JobListing;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PlatformWorkflowTest extends TestCase
{
    use RefreshDatabase;

    private function user(string $role): User
    {
        return User::factory()->create(['role' => $role, 'status' => 'active']);
    }

    private function listing(User $owner, string $status = 'Active'): JobListing
    {
        return JobListing::create(['user_id' => $owner->id, 'title' => 'Software Engineer', 'company' => 'Test Company',
            'description' => 'Build reliable applications.', 'status' => $status, 'category' => 'Software Development']);
    }

    public function test_public_registration_cannot_create_an_administrator(): void
    {
        $data = ['name' => 'New User', 'email' => 'new@example.com', 'password' => 'TestPassword123!', 'role' => 'admin'];
        $this->postJson('/api/register', $data)->assertUnprocessable();
        $data['role'] = 'seeker';
        $this->postJson('/api/register', $data)->assertCreated()->assertJsonPath('user.role', 'seeker')->assertJsonStructure(['token']);
    }

    public function test_inactive_accounts_cannot_login_or_use_existing_tokens(): void
    {
        $user = $this->user('seeker');
        $user->update(['status' => 'inactive']);
        $this->postJson('/api/login', ['email' => $user->email, 'password' => 'password'])->assertForbidden();
        Sanctum::actingAs($user);
        $this->getJson('/api/me')->assertForbidden();
    }

    public function test_public_listings_hide_pending_jobs_and_candidate_data(): void
    {
        $owner = $this->user('recruiter');
        $this->listing($owner);
        $pending = $this->listing($owner, 'Pending');
        $this->getJson('/api/jobs')->assertOk()->assertJsonCount(1, 'data')->assertJsonMissingPath('data.0.applications');
        $this->getJson('/api/jobs/'.$pending->id)->assertNotFound();
    }

    public function test_posting_requires_recruiter_and_administrator_approval(): void
    {
        Sanctum::actingAs($this->user('seeker'));
        $payload = ['title' => 'Developer', 'description' => 'Develop software'];
        $this->postJson('/api/jobs', $payload)->assertForbidden();
        $owner = $this->user('recruiter');
        Sanctum::actingAs($owner);
        $id = $this->postJson('/api/jobs', $payload + ['status' => 'Active'])->assertCreated()->assertJsonPath('data.status', 'Pending')->json('data.id');
        $this->putJson('/api/jobs/'.$id, ['status' => 'Active'])->assertUnprocessable();
        Sanctum::actingAs($this->user('recruiter'));
        $this->putJson('/api/jobs/'.$id, ['title' => 'Hijack'])->assertForbidden();
        Sanctum::actingAs($this->user('admin'));
        $this->putJson('/api/jobs/'.$id, ['status' => 'Active'])->assertOk()->assertJsonPath('data.status', 'Active');
    }

    public function test_candidate_to_recruiter_workflow_preserves_ownership(): void
    {
        $owner = $this->user('recruiter');
        $candidate = $this->user('seeker');
        $job = $this->listing($owner);
        Sanctum::actingAs($candidate);
        $payload = ['listing_id' => $job->id, 'candidate_name' => $candidate->name, 'candidate_email' => $candidate->email, 'cover_letter' => 'I can do this work.'];
        $id = $this->postJson('/api/applications', $payload)->assertCreated()->json('data.id');
        $this->postJson('/api/applications', $payload)->assertUnprocessable();
        $this->putJson('/api/applications/'.$id.'/status', ['status' => 'Hired'])->assertForbidden();
        Sanctum::actingAs($this->user('recruiter'));
        $this->getJson('/api/applications/'.$id)->assertForbidden();
        $this->getJson('/api/applications')->assertJsonCount(0, 'data');
        Sanctum::actingAs($owner);
        $this->putJson('/api/applications/'.$id.'/status', ['status' => 'Shortlisted'])->assertOk();
        $taskId = $this->postJson('/api/tasks', ['application_id' => $id, 'title' => 'Assessment', 'description' => 'Write a solution', 'deadline' => now()->addDays(3)->toDateString()])->assertCreated()->json('data.id');
        $interviewId = $this->postJson('/api/interviews', ['application_id' => $id, 'title' => 'Interview', 'date' => now()->addDays(4)->toDateString(), 'time' => '10:00', 'type' => 'Video', 'meeting_link' => 'https://meet.google.com/example'])->assertCreated()->json('data.id');
        Sanctum::actingAs($candidate);
        $this->putJson('/api/tasks/'.$taskId, ['status' => 'Submitted', 'submission_notes' => 'Here is my solution.'])->assertOk();
        $this->putJson('/api/interviews/'.$interviewId, ['status' => 'Confirmed'])->assertOk();
        $this->putJson('/api/interviews/'.$interviewId, ['date' => now()->addDays(8)->toDateString()])->assertUnprocessable();
        $this->getJson('/api/notifications')->assertOk();
        Sanctum::actingAs($this->user('seeker'));
        $this->putJson('/api/tasks/'.$taskId, ['status' => 'Submitted', 'submission_notes' => 'Hijack'])->assertForbidden();
    }

    public function test_bookmarks_are_persisted_and_scoped_to_the_user(): void
    {
        $job = $this->listing($this->user('recruiter'));
        Sanctum::actingAs($this->user('seeker'));
        $this->postJson('/api/saved-jobs', ['listing_id' => $job->id])->assertOk();
        $this->postJson('/api/saved-jobs', ['listing_id' => $job->id])->assertOk();
        $this->getJson('/api/saved-jobs')->assertJsonCount(1, 'data');
        Sanctum::actingAs($this->user('seeker'));
        $this->getJson('/api/saved-jobs')->assertJsonCount(0, 'data');
    }

    public function test_demo_checkout_uses_server_prices_and_has_no_real_payment_status(): void
    {
        config(['payments.mode' => 'demo']);
        $owner = $this->user('recruiter');
        $job = $this->listing($owner);
        Sanctum::actingAs($owner);
        $this->postJson('/api/jobs/'.$job->id.'/boost', ['days' => 3, 'payment_method' => 'Demo', 'amount' => 1])->assertOk();
        $this->assertDatabaseHas('payment_records', ['user_id' => $owner->id, 'amount' => 29, 'status' => 'Demo', 'payment_method' => 'Demo']);
        $this->postJson('/api/advertisements', ['title' => 'Demo ad', 'company' => 'Example', 'image_url' => 'https://example.com/image.png', 'target_url' => 'https://example.com', 'placement' => 'Sidebar', 'days' => 2, 'payment_method' => 'Demo'])->assertCreated();
        $this->getJson('/api/payments')->assertJsonCount(2, 'data');
        config(['payments.mode' => 'disabled']);
        $this->postJson('/api/jobs/'.$job->id.'/boost', ['days' => 3, 'payment_method' => 'Demo'])->assertStatus(503);
    }

    public function test_resume_upload_is_private_and_another_user_cannot_download_it(): void
    {
        Storage::fake('local');
        $candidate = $this->user('seeker');
        Sanctum::actingAs($candidate);
        $this->post('/api/profile/upload-resume', ['resume' => UploadedFile::fake()->create('resume.pdf', 20, 'application/pdf')], ['Accept' => 'application/json'])->assertOk();
        $this->get('/api/profile/resume')->assertOk();
        Sanctum::actingAs($this->user('seeker'));
        $this->getJson('/api/profile/resume')->assertNotFound();
    }

    public function test_public_settings_and_database_health_work(): void
    {
        $this->getJson('/api/health')->assertOk()->assertJsonPath('status', 'ok');
        $this->getJson('/api/categories')->assertOk()->assertJsonCount(8, 'data');
        $this->getJson('/api/settings/ad-pricing')->assertOk()->assertJsonPath('data.Sidebar', 9);
        $this->getJson('/api/settings/payment-mode')->assertOk()->assertJsonPath('data.real_money', false);
        $this->getJson('/api/unknown-path')->assertNotFound();
    }
}
