<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{

    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (! $request->user()) {
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => 'Unauthenticated.',
            ], 401);
        }

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
