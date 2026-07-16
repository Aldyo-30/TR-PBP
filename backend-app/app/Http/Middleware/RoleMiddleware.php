<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware untuk mengecek role user.
 *
 * Penggunaan di route: middleware('role:admin') atau middleware('role:admin,guru')
 * Menerima satu atau lebih role sebagai parameter.
 */
class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  ...$roles  Role yang diizinkan (admin, guru)
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        // Pastikan user sudah login
        if (! $request->user()) {
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => 'Unauthenticated.',
            ], 401);
        }

        // Cek apakah role user termasuk dalam daftar role yang diizinkan
        if (! in_array($request->user()->role, $roles)) {
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => 'Anda tidak memiliki akses untuk resource ini.',
            ], 403);
        }

        return $next($request);
    }
}
