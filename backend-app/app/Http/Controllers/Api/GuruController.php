<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Guru;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class GuruController extends Controller
{

    public function index(Request $request): JsonResponse
    {
        $query = Guru::query()->with(['user', 'mataPelajaran']);

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                  ->orWhere('nip', 'like', "%{$search}%");
            });
        }

        $guru = $query->latest()->paginate($request->query('per_page', 15));

        return response()->json([
            'success' => true,
            'data'    => $guru,
            'message' => 'Daftar guru berhasil diambil.',
        ], 200);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nip'                => 'required|string|unique:guru,nip',
            'nama'               => 'required|string|max:255',
            'jenis_kelamin'      => 'required|in:L,P',
            'alamat'             => 'nullable|string',
            'no_telepon'         => 'nullable|string|max:20',
            'user_id'            => 'nullable|integer|exists:users,id|unique:guru,user_id',
            'mata_pelajaran_ids' => 'nullable|array',
            'mata_pelajaran_ids.*' => 'integer|exists:mata_pelajaran,id',
        ]);

        $guru = Guru::create($validated);

        if (!empty($validated['mata_pelajaran_ids'])) {
            $guru->mataPelajaran()->sync($validated['mata_pelajaran_ids']);
        }

        return response()->json([
            'success' => true,
            'data'    => $guru->load(['user', 'mataPelajaran']),
            'message' => 'Data guru berhasil dibuat.',
        ], 201);
    }

    public function show(Guru $guru): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data'    => $guru->load(['user', 'mataPelajaran']),
            'message' => 'Detail data guru berhasil diambil.',
        ], 200);
    }

    public function update(Request $request, Guru $guru): JsonResponse
    {
        $validated = $request->validate([
            'nip'                => [
                'sometimes', 'required', 'string',
                Rule::unique('guru', 'nip')->ignore($guru->id),
            ],
            'nama'               => 'sometimes|required|string|max:255',
            'jenis_kelamin'      => 'sometimes|required|in:L,P',
            'alamat'             => 'nullable|string',
            'no_telepon'         => 'nullable|string|max:20',
            'user_id'            => [
                'nullable', 'integer', 'exists:users,id',
                Rule::unique('guru', 'user_id')->ignore($guru->id),
            ],
            'mata_pelajaran_ids' => 'nullable|array',
            'mata_pelajaran_ids.*' => 'integer|exists:mata_pelajaran,id',
        ]);

        $guru->update($validated);

        if (isset($validated['mata_pelajaran_ids'])) {
            $guru->mataPelajaran()->sync($validated['mata_pelajaran_ids']);
        }

        return response()->json([
            'success' => true,
            'data'    => $guru->fresh(['user', 'mataPelajaran']),
            'message' => 'Data guru berhasil diperbarui.',
        ], 200);
    }

    public function destroy(Guru $guru): JsonResponse
    {
        $guru->delete();

        return response()->json([
            'success' => true,
            'data'    => null,
            'message' => 'Data guru berhasil dihapus.',
        ], 200);
    }
}
