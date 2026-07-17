<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

/**
 * Controller untuk manajemen data user (CRUD).
 * Hanya bisa diakses oleh admin.
 */
class UserController extends Controller
{
    /**
     * Tampilkan daftar semua user dengan pagination.
     * Mendukung pencarian berdasarkan nama atau email.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $query = User::query();

        // Filter pencarian berdasarkan nama atau email
        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filter berdasarkan role (opsional)
        if ($role = $request->query('role')) {
            $query->where('role', $role);
        }

        $users = $query->latest()->paginate($request->query('per_page', 15));

        return response()->json([
            'success' => true,
            'data'    => $users,
            'message' => 'Daftar user berhasil diambil.',
        ], 200);
    }

    /**
     * Simpan user baru.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role'     => 'required|in:admin,guru',
        ]);

        $validated['password'] = Hash::make($validated['password']);

        $user = User::create($validated);

        return response()->json([
            'success' => true,
            'data'    => $user,
            'message' => 'User berhasil dibuat.',
        ], 201);
    }

    /**
     * Tampilkan detail satu user.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(User $user): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data'    => $user->load('guru'),
            'message' => 'Detail user berhasil diambil.',
        ], 200);
    }

    /**
     * Update data user.
     * Password bersifat opsional — hanya diupdate jika diisi.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'name'     => 'sometimes|required|string|max:255',
            'email'    => [
                'sometimes', 'required', 'email',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
            'password' => 'nullable|string|min:8',
            'role'     => 'sometimes|required|in:admin,guru',
        ]);

        // Hash password hanya jika diisi
        if (! empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        return response()->json([
            'success' => true,
            'data'    => $user->fresh(),
            'message' => 'User berhasil diperbarui.',
        ], 200);
    }

    /**
     * Hapus user.
     * User tidak bisa menghapus dirinya sendiri.
     *
     * @param  \Illuminate\Http\Request  $request — injected to get current user
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Request $request, User $user): JsonResponse
    {
        // Cegah user menghapus dirinya sendiri
        if ($request->user()->id === $user->id) {
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => 'Anda tidak dapat menghapus akun sendiri.',
            ], 403);
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'data'    => null,
            'message' => 'User berhasil dihapus.',
        ], 200);
    }
}
