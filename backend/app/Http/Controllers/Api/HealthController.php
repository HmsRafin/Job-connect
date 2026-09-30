<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Throwable;

class HealthController extends Controller
{
    public function __invoke()
    {
        try {
            DB::select('SELECT 1');
            return response()->json(['status' => 'ok', 'database' => 'connected']);
        } catch (Throwable $exception) {
            report($exception);
            return response()->json(['status' => 'unavailable'], 503);
        }
    }
}
