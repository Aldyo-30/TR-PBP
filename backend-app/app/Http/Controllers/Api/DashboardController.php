<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Guru;
use App\Models\Kelas;
use App\Models\Siswa;
use App\Models\TahunAjaran;
use Illuminate\Http\JsonResponse;

/**
 * Controller untuk menampilkan data ringkasan di dashboard.
 */
class DashboardController extends Controller
{
    /**
     * Tampilkan ringkasan data untuk dashboard.
     * Mengembalikan total siswa, guru, kelas, dan tahun ajaran aktif.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(): JsonResponse
    {
        $data = [
            'total_siswa'        => Siswa::count(),
            'total_guru'         => Guru::count(),
            'total_kelas'        => Kelas::count(),
            'tahun_ajaran_aktif' => TahunAjaran::where('is_active', true)->first(),
        ];

        return response()->json([
            'success' => true,
            'data'    => $data,
            'message' => 'Data dashboard berhasil diambil.',
        ], 200);
    }
}
