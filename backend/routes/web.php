<?php

use Illuminate\Support\Facades\Route;

Route::get('/{path?}', function () {
    $entry = public_path('app/index.html');
    abort_unless(is_file($entry), 503, 'The frontend build is missing. Build the frontend before starting the application.');

    return response()->file($entry, ['Cache-Control' => 'no-cache']);
})->where('path', '(?!api(?:/|$)|up(?:/|$)|storage(?:/|$)|app(?:/|$)).*');
