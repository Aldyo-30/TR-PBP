<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\GuruController;
use App\Http\Controllers\Api\KelasController;
use App\Http\Controllers\Api\SiswaController;
use App\Http\Controllers\Api\MataPelajaranController;
use App\Http\Controllers\Api\TahunAjaranController;
use App\Http\Controllers\Api\NilaiController;
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

        // Data Guru (KEVIN)
        Route::apiResource('guru', GuruController::class);
        
        // Route::apiResource('mata-pelajaran', MataPelajaranController::class);
    });

    // ==================================================================
    // Admin & Guru Routes
    // ==================================================================
    Route::middleware('role:admin,guru')->group(function () {

        // Data Siswa & Kelas (KEVIN)
        Route::apiResource('siswa', SiswaController::class);
        Route::apiResource('kelas', KelasController::class);
        
        // Data Mata Pelajaran & Tahun Ajaran
        Route::apiResource('mata-pelajaran', MataPelajaranController::class);
        Route::apiResource('tahun-ajaran', TahunAjaranController::class);
        Route::patch('tahun-ajaran/{id}/toggle-active', [TahunAjaranController::class, 'toggleActive']);

        // Data Nilai
        Route::get('nilai', [NilaiController::class, 'index']);
        Route::post('nilai', [NilaiController::class, 'store']);
        Route::put('nilai/{id}', [NilaiController::class, 'update']);

        // Raport & Rekap (ARIL)
        Route::get('/raport/{id}', [NilaiController::class, 'raport']);
        Route::get('/rekap/{kelas_id?}', [NilaiController::class, 'rekap']);
    });
});
