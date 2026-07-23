<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Siswa;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SiswaController extends Controller
{

    public function index(Request $request): JsonResponse
    {
        $query = Siswa::query()->with('kelas.tahunAjaran');

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                  ->orWhere('nis', 'like', "%{$search}%")
                  ->orWhere('nisn', 'like', "%{$search}%");
            });
        }

        if ($kelasId = $request->query('kelas_id')) {
            $query->where('kelas_id', $kelasId);
        }

        $siswa = $query->latest()->paginate($request->query('per_page', 15));

        return response()->json([
            'success' => true,
            'data'    => $siswa,
            'message' => 'Daftar siswa berhasil diambil.',
        ], 200);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nis'            => 'required|string|unique:siswa,nis',
            'nisn'           => 'required|string|unique:siswa,nisn',
            'nama'           => 'required|string|max:255',
            'jenis_kelamin'  => 'required|in:L,P',
            'tempat_lahir'   => 'required|string|max:100',
            'tanggal_lahir'  => 'required|date',
            'alamat'         => 'nullable|string',
            'nama_ortu_wali' => 'required|string|max:255',
            'kelas_id'       => 'nullable|integer|exists:kelas,id',
        ]);

        $siswa = Siswa::create($validated);

        return response()->json([
            'success' => true,
            'data'    => $siswa->load('kelas'),
            'message' => 'Data siswa berhasil dibuat.',
        ], 201);
    }

    public function show(Siswa $siswa): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data'    => $siswa->load('kelas.tahunAjaran'),
            'message' => 'Detail data siswa berhasil diambil.',
        ], 200);
    }

    public function update(Request $request, Siswa $siswa): JsonResponse
    {
        $validated = $request->validate([
            'nis'            => [
                'sometimes', 'required', 'string',
                Rule::unique('siswa', 'nis')->ignore($siswa->id),
            ],
            'nisn'           => [
                'sometimes', 'required', 'string',
                Rule::unique('siswa', 'nisn')->ignore($siswa->id),
            ],
            'nama'           => 'sometimes|required|string|max:255',
            'jenis_kelamin'  => 'sometimes|required|in:L,P',
            'tempat_lahir'   => 'sometimes|required|string|max:100',
            'tanggal_lahir'  => 'sometimes|required|date',
            'alamat'         => 'nullable|string',
            'nama_ortu_wali' => 'sometimes|required|string|max:255',
            'kelas_id'       => 'nullable|integer|exists:kelas,id',
        ]);

        $siswa->update($validated);

        return response()->json([
            'success' => true,
            'data'    => $siswa->fresh('kelas'),
            'message' => 'Data siswa berhasil diperbarui.',
        ], 200);
    }

    public function destroy(Siswa $siswa): JsonResponse
    {
        $siswa->delete();

        return response()->json([
            'success' => true,
            'data'    => null,
            'message' => 'Data siswa berhasil dihapus.',
        ], 200);
    }
}
