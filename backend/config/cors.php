<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => array_filter(array_merge(
        [
            'http://localhost:5173',
            'http://127.0.0.1:5173',
            'http://localhost:3000',
        ],
        // VPS: set FRONTEND_URL (e.g. http://187.52.122.100:5173 or https://yourdomain.com)
        // or comma-separated CORS_ALLOWED_ORIGINS (e.g. https://a.com,https://b.com)
        array_filter(explode(',', env('CORS_ALLOWED_ORIGINS', ''))),
        env('FRONTEND_URL') ? [env('FRONTEND_URL')] : []
    )),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
