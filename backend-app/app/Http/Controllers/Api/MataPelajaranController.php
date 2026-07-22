<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MataPelajaran;
use Illuminate\Http\Request;

class MataPelajaranController extends Controller
{
    public function index()
    {
        return response()->json(MataPelajaran::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'kode_mapel' => 'required|unique:mata_pelajaran,kode_mapel',
            'nama_mapel' => 'required|string',
        ]);

        $mapel = MataPelajaran::create($validated);
        return response()->json($mapel, 201);
    }

    public function show($id)
    {
        return response()->json(MataPelajaran::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $mapel = MataPelajaran::findOrFail($id);
        $validated = $request->validate([
            'kode_mapel' => 'required|unique:mata_pelajaran,kode_mapel,' . $id,
            'nama_mapel' => 'required|string',
        ]);

        $mapel->update($validated);
        return response()->json($mapel);
    }

    public function destroy($id)
    {
        MataPelajaran::destroy($id);
        return response()->json(['message' => 'Berhasil dihapus']);
    }
}