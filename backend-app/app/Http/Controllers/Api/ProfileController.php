<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

/**
 * Controller untuk manajemen profil user.
 * Mengikuti pola dari tugas2_auth ProfileController.
 * Fitur: update info profil, update password, hapus akun.
 */
class ProfileController extends Controller
{
    /**
     * Ambil data profil user yang sedang login.
     */
    public function show(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data'    => $request->user()->load('guru'),
            'message' => 'Data profil berhasil diambil.',
        ], 200);
    }

    /**
     * Update informasi profil (nama & email).
     * Mengikuti pola ProfileUpdateRequest dari tugas2_auth.
     */
    public function update(Request $request): JsonResponse
    {
        $request->validate([
            'name'  => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($request->user()->id),
            ],
        ]);

        $user = $request->user();
        $user->fill($request->only(['name', 'email']));

        // Reset email verification jika email berubah (seperti tugas2_auth)
        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return response()->json([
            'success' => true,
            'data'    => $user,
            'message' => 'Profil berhasil diperbarui.',
        ], 200);
    }

    /**
     * Update password user.
     * Memerlukan current_password untuk verifikasi.
     */
    public function updatePassword(Request $request): JsonResponse
    {
        $request->validate([
            'current_password' => ['required', 'string', 'current_password'],
            'password'         => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $request->user()->update([
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'success' => true,
            'data'    => null,
            'message' => 'Password berhasil diperbarui.',
        ], 200);
    }

    /**
     * Hapus akun user (dengan konfirmasi password).
     * Mengikuti pola delete dari tugas2_auth.
     */
    public function destroy(Request $request): JsonResponse
    {
        $request->validate([
            'password' => ['required', 'string', 'current_password'],
        ]);

        $user = $request->user();

        // Hapus semua token terlebih dahulu
        $user->tokens()->delete();

        // Hapus akun
        $user->delete();

        return response()->json([
            'success' => true,
            'data'    => null,
            'message' => 'Akun berhasil dihapus.',
        ], 200);
    }
}
