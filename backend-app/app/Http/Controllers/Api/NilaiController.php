<?php

namespace App\Http\Controllers\Api;

use App\Models\Nilai;
use App\Models\Siswa;
use App\Models\Kelas;
use App\Models\MataPelajaran;
use App\Models\TahunAjaran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use App\Http\Controllers\Controller;

class NilaiController extends Controller
{

    private const BOBOT_TUGAS = 0.30;
    private const BOBOT_UTS   = 0.30;
    private const BOBOT_UAS   = 0.40;

    public function index(Request $request)
    {
        $request->validate([
            'kelas_id'           => 'required|exists:kelas,id',
            'tahun_ajaran_id'    => 'required|exists:tahun_ajaran,id',
            'mata_pelajaran_id'  => 'nullable|exists:mata_pelajaran,id',
            'siswa_id'           => 'nullable|exists:siswa,id',
        ]);

        $user = Auth::user();

        if ($user->isGuru() && $request->has('mata_pelajaran_id')) {
            $this->authorizeGuruForKelasMapel($user, $request->kelas_id, $request->mata_pelajaran_id);
        }

        $query = Nilai::with(['siswa:id,nis,nama,kelas_id', 'mataPelajaran:id,kode,nama,kkm', 'kelas:id,nama_kelas'])
            ->where('nilai.kelas_id', $request->kelas_id)
            ->where('nilai.tahun_ajaran_id', $request->tahun_ajaran_id)
            ->join('siswa', 'siswa.id', '=', 'nilai.siswa_id')
            ->orderBy('siswa.nama')
            ->select('nilai.*');

        if ($request->has('mata_pelajaran_id') && $request->mata_pelajaran_id) {
            $query->where('nilai.mata_pelajaran_id', $request->mata_pelajaran_id);
        }
        if ($request->has('siswa_id') && $request->siswa_id) {
            $query->where('nilai.siswa_id', $request->siswa_id);
        }

        $nilai = $query->get();

        return response()->json([
            'data' => $nilai,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'siswa_id'           => 'required|exists:siswa,id',
            'tahun_ajaran_id'    => 'required|exists:tahun_ajaran,id',
            'kelas_id'           => 'required|exists:kelas,id',
            'data_nilai'         => 'required|array',
            'data_nilai.*.mata_pelajaran_id' => 'required|exists:mata_pelajaran,id',
            'data_nilai.*.nilai_tugas'       => 'required|numeric|min:0|max:100',
            'data_nilai.*.nilai_uts'         => 'required|numeric|min:0|max:100',
            'data_nilai.*.nilai_uas'         => 'required|numeric|min:0|max:100',
            'data_nilai.*.catatan'           => 'nullable|string',
        ]);

        $user = Auth::user();
        $insertedCount = 0;

        foreach ($validated['data_nilai'] as $item) {
            if ($user->isGuru()) {
                $this->authorizeGuruForKelasMapel($user, $validated['kelas_id'], $item['mata_pelajaran_id']);
            }

            [$nilaiAkhir, $predikat] = $this->hitungNilaiAkhirDanPredikat(
                $item['nilai_tugas'],
                $item['nilai_uts'],
                $item['nilai_uas'],
                $item['mata_pelajaran_id']
            );

            Nilai::updateOrCreate(
                [
                    'siswa_id'          => $validated['siswa_id'],
                    'mata_pelajaran_id' => $item['mata_pelajaran_id'],
                    'tahun_ajaran_id'   => $validated['tahun_ajaran_id'],
                    'kelas_id'          => $validated['kelas_id'],
                ],
                [
                    'nilai_tugas' => $item['nilai_tugas'],
                    'nilai_uts'   => $item['nilai_uts'],
                    'nilai_uas'   => $item['nilai_uas'],
                    'nilai_akhir' => $nilaiAkhir,
                    'predikat'    => $predikat,
                    'catatan'     => $item['catatan'] ?? null,
                ]
            );
            $insertedCount++;
        }

        return response()->json([
            'message' => "Berhasil menyimpan nilai untuk $insertedCount mata pelajaran.",
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $nilai = Nilai::findOrFail($id);

        $validated = $request->validate([
            'nilai_tugas' => 'sometimes|required|numeric|min:0|max:100',
            'nilai_uts'   => 'sometimes|required|numeric|min:0|max:100',
            'nilai_uas'   => 'sometimes|required|numeric|min:0|max:100',
            'catatan'     => 'nullable|string',
        ]);

        $user = Auth::user();
        if ($user->isGuru()) {
            $this->authorizeGuruForKelasMapel($user, $nilai->kelas_id, $nilai->mata_pelajaran_id);
        }

        $nilai->fill($validated);

        [$nilaiAkhir, $predikat] = $this->hitungNilaiAkhirDanPredikat(
            $nilai->nilai_tugas,
            $nilai->nilai_uts,
            $nilai->nilai_uas,
            $nilai->mata_pelajaran_id
        );

        $nilai->nilai_akhir = $nilaiAkhir;
        $nilai->predikat    = $predikat;
        $nilai->save();

        return response()->json([
            'message' => 'Nilai berhasil diperbarui',
            'data'    => $nilai,
        ]);
    }

    public function raport(Request $request, $siswa_id)
    {
        $request->validate([
            'tahun_ajaran_id' => 'required|exists:tahun_ajaran,id',
        ]);

        $siswa = Siswa::with('kelas.guru')->findOrFail($siswa_id);

        $nilaiList = Nilai::with('mataPelajaran:id,kode,nama,kkm')
            ->where('siswa_id', $siswa_id)
            ->where('tahun_ajaran_id', $request->tahun_ajaran_id)
            ->join('mata_pelajaran', 'mata_pelajaran.id', '=', 'nilai.mata_pelajaran_id')
            ->orderBy('mata_pelajaran.nama')
            ->select('nilai.*')
            ->get();

        $tahunAjaran = TahunAjaran::findOrFail($request->tahun_ajaran_id);

        $rataRata = $nilaiList->count() > 0
            ? round($nilaiList->avg('nilai_akhir'), 2)
            : 0;

        return response()->json([
            'siswa'        => $siswa,
            'tahun_ajaran' => $tahunAjaran,
            'nilai'        => $nilaiList,
            'rata_rata'    => $rataRata,
        ]);
    }

    public function rekap(Request $request, $kelas_id = null)
    {
        $request->validate([
            'tahun_ajaran_id' => 'required|exists:tahun_ajaran,id',
        ]);

        $kelasId = $kelas_id ?: $request->query('kelas_id');
        abort_if(!$kelasId, 422, 'kelas_id is required');

        $kelas = Kelas::with('guru')->findOrFail($kelasId);

        $siswaList = Siswa::where('kelas_id', $kelas_id)->orderBy('nama')->get();

        $rekap = $siswaList->map(function ($siswa) use ($request) {
            $nilaiSiswa = Nilai::where('siswa_id', $siswa->id)
                ->where('tahun_ajaran_id', $request->tahun_ajaran_id)
                ->get();

            $rataRata = $nilaiSiswa->count() > 0
                ? round($nilaiSiswa->avg('nilai_akhir'), 2)
                : 0;

            return [
                'siswa_id'   => $siswa->id,
                'nis'        => $siswa->nis,
                'nama'       => $siswa->nama,
                'jumlah_mapel' => $nilaiSiswa->count(),
                'rata_rata'  => $rataRata,
            ];
        });

        $rekapTeruruk = $rekap->sortByDesc('rata_rata')->values();

        $rekapDenganRanking = $rekapTeruruk->map(function ($item, $index) {
            $item['ranking'] = $index + 1;
            return $item;
        });

        return response()->json([
            'kelas' => $kelas,
            'rekap' => $rekapDenganRanking,
        ]);
    }

    private function hitungNilaiAkhirDanPredikat(
        float $tugas,
        float $uts,
        float $uas,
        int $mataPelajaranId
    ): array {
        $nilaiAkhir = ($tugas * self::BOBOT_TUGAS)
            + ($uts * self::BOBOT_UTS)
            + ($uas * self::BOBOT_UAS);
        $nilaiAkhir = round($nilaiAkhir, 2);

        $kkm = MataPelajaran::where('id', $mataPelajaranId)->value('kkm') ?? 70;

        $predikat = match (true) {
            $nilaiAkhir >= $kkm + 20 => 'A',
            $nilaiAkhir >= $kkm + 15 => 'AB',
            $nilaiAkhir >= $kkm + 10 => 'B',
            $nilaiAkhir >= $kkm + 5  => 'BC',
            $nilaiAkhir >= $kkm      => 'C',
            default                  => 'D',
        };

        return [$nilaiAkhir, $predikat];
    }

    private function authorizeGuruForKelasMapel($user, int $kelasId, int $mataPelajaranId): void
    {
        $guru = $user->guru;

        abort_if(!$guru, 403, 'Akun ini tidak terhubung ke data guru.');

        $isWaliKelas = Kelas::where('id', $kelasId)->where('guru_id', $guru->id)->exists();
        $mengampuMapel = $guru->mataPelajaran()->where('mata_pelajaran_id', $mataPelajaranId)->exists();

        abort_if(!$isWaliKelas && !$mengampuMapel, 403, 'Anda tidak berwenang mengakses data ini.');
    }

}
