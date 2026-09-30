<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\User;
use App\Models\LoginHistory;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        return response()->json([
            'total_users' => User::count(),
            'active_users' => User::where('status', 'active')->count(),
            'new_users' => User::where('created_at', '>=', Carbon::now()->subDays(7))->count(),
            'recent_logins' => LoginHistory::with('user')->orderBy('login_at', 'desc')->take(5)->get(),
        ]);
    }
}
