<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TahunAjaran;
use Illuminate\Http\Request;

class TahunAjaranController extends Controller
{
    public function index()
    {
        return response()->json(TahunAjaran::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tahun' => 'required|string',
            'semester' => 'required|in:Ganjil,Genap',
        ]);

        $ta = TahunAjaran::create($validated);
        return response()->json($ta, 201);
    }

    public function update(Request $request, $id)
    {
        $ta = TahunAjaran::findOrFail($id);
        $validated = $request->validate([
            'tahun' => 'required|string',
            'semester' => 'required|in:Ganjil,Genap',
        ]);

        $ta->update($validated);
        return response()->json($ta);
    }

    public function destroy($id)
    {
        TahunAjaran::destroy($id);
        return response()->json(['message' => 'Berhasil dihapus']);
    }

    public function toggleActive($id)
    {
        $ta = TahunAjaran::findOrFail($id);
        $newState = !$ta->is_active;

        if ($newState) {
            TahunAjaran::query()->update(['is_active' => false]);
        }

        $ta->update(['is_active' => $newState]);

        return response()->json(['message' => 'Status tahun ajaran berhasil diubah', 'data' => $ta]);
    }
}
