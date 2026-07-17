<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — Aplikasi Raport SD
|--------------------------------------------------------------------------
|
| Route API menggunakan Laravel Sanctum untuk autentikasi.
| Semua response menggunakan format JSON standar:
| { "success": bool, "data": mixed, "message": string }
|
*/

// ======================================================================
// Public Routes (tanpa autentikasi)
// ======================================================================
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// ======================================================================
// Protected Routes (memerlukan autentikasi Sanctum)
// ======================================================================
Route::middleware('auth:sanctum')->group(function () {

    // --- Auth ---
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // --- Dashboard ---
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // --- Profil (semua user) ---
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::put('/profile/password', [ProfileController::class, 'updatePassword']);
    Route::delete('/profile', [ProfileController::class, 'destroy']);

    // ==================================================================
    // Admin Only Routes
    // ==================================================================
    Route::middleware('role:admin')->group(function () {

        // Manajemen User (ALDYO)
        Route::apiResource('users', UserController::class);

        // ----------------------------------------------------------
        // TODO: KEVIN — Tambahkan route Guru & Mata Pelajaran di sini
        // Route::apiResource('guru', GuruController::class);
        // Route::apiResource('mata-pelajaran', MataPelajaranController::class);
        // ----------------------------------------------------------
    });

    // ==================================================================
    // Admin & Guru Routes
    // ==================================================================
    Route::middleware('role:admin,guru')->group(function () {

        // ----------------------------------------------------------
        // TODO: JOSAN — Tambahkan route Siswa & Kelas di sini
        // Route::apiResource('siswa', SiswaController::class);
        // Route::apiResource('kelas', KelasController::class);
        // ----------------------------------------------------------

        // ----------------------------------------------------------
        // TODO: ARIL — Tambahkan route Nilai & Raport di sini
        // Route::apiResource('nilai', NilaiController::class);
        // Route::get('/raport/{siswa}', [RaportController::class, 'show']);
        // Route::get('/raport/{siswa}/cetak', [RaportController::class, 'cetak']);
        // ----------------------------------------------------------
    });
});
