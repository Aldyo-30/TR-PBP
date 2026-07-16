<?php

/**
 * Konfigurasi CORS (Cross-Origin Resource Sharing)
 * Mengizinkan frontend mengakses API dari origin yang berbeda
 */

return [

    /*
    |--------------------------------------------------------------------------
    | Paths
    |--------------------------------------------------------------------------
    |
    | Path yang diizinkan untuk CORS. Sanctum csrf-cookie diperlukan
    | untuk autentikasi berbasis cookie (SPA).
    |
    */
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    /*
    |--------------------------------------------------------------------------
    | Allowed Origins
    |--------------------------------------------------------------------------
    |
    | Origin frontend yang diizinkan mengakses API.
    | - http://localhost:3000 (Next.js / React dev server)
    | - http://localhost:5173 (Vite dev server)
    |
    */
    'allowed_origins' => [
        'http://localhost:3000',
        'http://localhost:5173',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    /*
    |--------------------------------------------------------------------------
    | Supports Credentials
    |--------------------------------------------------------------------------
    |
    | Harus true agar Sanctum cookie-based auth berfungsi dengan benar.
    |
    */
    'supports_credentials' => true,

];
