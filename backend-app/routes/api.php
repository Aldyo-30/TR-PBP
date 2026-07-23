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
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::get('/dashboard', [DashboardController::class, 'index']);

    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::put('/profile/password', [ProfileController::class, 'updatePassword']);
    Route::delete('/profile', [ProfileController::class, 'destroy']);

    Route::middleware('role:admin')->group(function () {
        Route::apiResource('users', UserController::class);

        Route::apiResource('guru', GuruController::class);

    });

    Route::middleware('role:admin,guru')->group(function () {
        Route::apiResource('siswa', SiswaController::class);
        Route::apiResource('kelas', KelasController::class);

        Route::apiResource('mata-pelajaran', MataPelajaranController::class);
        Route::apiResource('tahun-ajaran', TahunAjaranController::class);
        Route::patch('tahun-ajaran/{id}/toggle-active', [TahunAjaranController::class, 'toggleActive']);

        Route::get('nilai', [NilaiController::class, 'index']);
        Route::post('nilai', [NilaiController::class, 'store']);
        Route::put('nilai/{id}', [NilaiController::class, 'update']);

        Route::get('/raport/{id}', [NilaiController::class, 'raport']);
        Route::get('/rekap/{kelas_id?}', [NilaiController::class, 'rekap']);
    });
});
