<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

/**
 * Controller untuk manajemen data kelas (CRUD).
 * Hanya bisa diakses oleh admin.
 */
class KelasController extends Controller
{
    /**
     * Tampilkan daftar semua kelas.
     * Mendukung pencarian berdasarkan nama kelas.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Kelas::query()->with(['guru', 'tahunAjaran'])->withCount('siswa');

        if ($search = $request->query('search')) {
            $query->where('nama_kelas', 'like', "%{$search}%");
        }

        // Filter berdasarkan tahun ajaran (opsional)
        if ($tahunAjaranId = $request->query('tahun_ajaran_id')) {
            $query->where('tahun_ajaran_id', $tahunAjaranId);
        }

        $kelas = $query->latest()->paginate($request->query('per_page', 15));

        return response()->json([
            'success' => true,
            'data'    => $kelas,
            'message' => 'Daftar kelas berhasil diambil.',
        ], 200);
    }

    /**
     * Simpan data kelas baru.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nama_kelas'      => 'required|string|max:50',
            'guru_id'         => [
                'nullable', 'integer', 'exists:guru,id',
                'unique:kelas,guru_id'
            ],
            'tahun_ajaran_id' => 'required|integer|exists:tahun_ajaran,id',
        ]);

        $kelas = Kelas::create($validated);

        return response()->json([
            'success' => true,
            'data'    => $kelas->load(['guru', 'tahunAjaran']),
            'message' => 'Data kelas berhasil dibuat.',
        ], 201);
    }

    /**
     * Tampilkan detail satu kelas.
     */
    public function show(Kelas $kela): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data'    => $kela->load(['guru', 'tahunAjaran', 'siswa']),
            'message' => 'Detail data kelas berhasil diambil.',
        ], 200);
    }

    /**
     * Update data kelas.
     */
    public function update(Request $request, Kelas $kela): JsonResponse
    {
        $validated = $request->validate([
            'nama_kelas'      => 'sometimes|required|string|max:50',
            'guru_id'         => [
                'nullable', 'integer', 'exists:guru,id',
                Rule::unique('kelas', 'guru_id')->ignore($kela->id),
            ],
            'tahun_ajaran_id' => 'sometimes|required|integer|exists:tahun_ajaran,id',
        ]);

        $kela->update($validated);

        return response()->json([
            'success' => true,
            'data'    => $kela->fresh(['guru', 'tahunAjaran']),
            'message' => 'Data kelas berhasil diperbarui.',
        ], 200);
    }

    /**
     * Hapus data kelas.
     */
    public function destroy(Kelas $kela): JsonResponse
    {
        $kela->delete();

        return response()->json([
            'success' => true,
            'data'    => null,
            'message' => 'Data kelas berhasil dihapus.',
        ], 200);
    }
}
