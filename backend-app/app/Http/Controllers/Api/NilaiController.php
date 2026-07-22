<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Nilai;
use Illuminate\Http\Request;

class NilaiController extends Controller
{
    public function index(Request $request)
    {
        $query = Nilai::with(['mataPelajaran', 'tahunAjaran']);

        if ($request->has('tahun_ajaran_id')) {
            $query->where('tahun_ajaran_id', $request->tahun_ajaran_id);
        }
        if ($request->has('mata_pelajaran_id')) {
            $query->where('mata_pelajaran_id', $request->mata_pelajaran_id);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_siswa' => 'required|string',
            'mata_pelajaran_id' => 'required|exists:mata_pelajaran,id',
            'tahun_ajaran_id' => 'required|exists:tahun_ajaran,id',
            'nilai_tugas' => 'required|numeric|min:0|max:100',
            'nilai_uts' => 'required|numeric|min:0|max:100',
            'nilai_uas' => 'required|numeric|min:0|max:100',
        ]);

        $nilai = new Nilai($validated);
        $nilai->nilai_akhir = $nilai->hitungNilaiAkhir();
        $nilai->predikat = $nilai->getPredikat($nilai->nilai_akhir);
        $nilai->save();

        return response()->json($nilai->load(['mataPelajaran', 'tahunAjaran']), 201);
    }

    public function update(Request $request, $id)
    {
        $nilai = Nilai::findOrFail($id);
        $validated = $request->validate([
            'nama_siswa' => 'required|string',
            'nilai_tugas' => 'required|numeric|min:0|max:100',
            'nilai_uts' => 'required|numeric|min:0|max:100',
            'nilai_uas' => 'required|numeric|min:0|max:100',
        ]);

        $nilai->fill($validated);
        $nilai->nilai_akhir = $nilai->hitungNilaiAkhir();
        $nilai->predikat = $nilai->getPredikat($nilai->nilai_akhir);
        $nilai->save();

        return response()->json($nilai->load(['mataPelajaran', 'tahunAjaran']));
    }
}