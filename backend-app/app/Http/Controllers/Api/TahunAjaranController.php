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
            'tahun_ajaran' => 'required|string',
            'semester' => 'required|in:Ganjil,Genap',
        ]);

        $ta = TahunAjaran::create($validated);
        return response()->json($ta, 201);
    }

    public function update(Request $request, $id)
    {
        $ta = TahunAjaran::findOrFail($id);
        $validated = $request->validate([
            'tahun_ajaran' => 'required|string',
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
        TahunAjaran::query()->update(['is_active' => false]);
        $ta = TahunAjaran::findOrFail($id);
        $ta->update(['is_active' => true]);

        return response()->json(['message' => 'Tahun ajaran aktif diubah', 'data' => $ta]);
    }
}