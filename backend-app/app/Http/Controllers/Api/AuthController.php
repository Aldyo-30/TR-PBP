<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

/**
 * Controller untuk autentikasi user.
 * Menggunakan Laravel Sanctum untuk token-based authentication.
 */
class AuthController extends Controller
{
    /**
     * Login user dan buat Sanctum token.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        // Cari user berdasarkan email
        $user = User::where('email', $request->email)->first();

        // Validasi kredensial
        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => 'Email atau password salah.',
            ], 401);
        }

        // Buat Sanctum token
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'data'    => [
                'access_token' => $token,
                'token_type'   => 'bearer',
                'user'         => $user,
            ],
            'message' => 'Login berhasil.',
        ], 200);
    }

    /**
     * Register user baru.
     * Default role: guru. Setelah register, otomatis login (return token).
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request): JsonResponse
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        // Buat user baru dengan role default 'guru'
        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => bcrypt($request->password),
            'role'     => 'guru',
        ]);

        // Auto-login: buat Sanctum token
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'data'    => [
                'access_token' => $token,
                'token_type'   => 'bearer',
                'user'         => $user,
            ],
            'message' => 'Registrasi berhasil.',
        ], 201);
    }

    /**
     * Logout user — hapus token yang sedang digunakan.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request): JsonResponse
    {
        // Hapus token yang sedang digunakan saat ini
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'data'    => null,
            'message' => 'Logout berhasil.',
        ], 200);
    }

    /**
     * Ambil data user yang sedang login beserta relasi guru.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function me(Request $request): JsonResponse
    {
        // Load relasi guru jika user memiliki role guru
        $user = $request->user()->load('guru');

        return response()->json([
            'success' => true,
            'data'    => $user,
            'message' => 'Data user berhasil diambil.',
        ], 200);
    }
}
