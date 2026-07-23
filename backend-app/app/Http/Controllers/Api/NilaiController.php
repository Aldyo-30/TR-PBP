<?php

namespace App\Http\Controllers;

use App\Models\Nilai;
use App\Models\Siswa;
use App\Models\Kelas;
use App\Models\MataPelajaran;
use App\Models\TahunAjaran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class NilaiController extends Controller
{
    /**
     * Bobot penilaian: Tugas 30%, UTS 30%, UAS 40%
     */
    private const BOBOT_TUGAS = 0.30;
    private const BOBOT_UTS   = 0.30;
    private const BOBOT_UAS   = 0.40;

    /**
     * GET /api/nilai
     * List nilai per kelas, per mata pelajaran, per semester (tahun_ajaran).
     * Guru hanya boleh melihat nilai untuk kelas yang ia ampu (via mapel yang diampu / wali kelas).
     */
    public function index(Request $request)
    {
        $request->validate([
            'kelas_id'           => 'required|exists:kelas,id',
            'mata_pelajaran_id'  => 'required|exists:mata_pelajaran,id',
            'tahun_ajaran_id'    => 'required|exists:tahun_ajaran,id',
        ]);

        $user = Auth::user();

        // Otorisasi: guru hanya bisa akses kelas/mapel yang ia ampu
        if ($user->isGuru()) {
            $this->authorizeGuruForKelasMapel($user, $request->kelas_id, $request->mata_pelajaran_id);
        }

        $nilai = Nilai::with(['siswa:id,nis,nama,kelas_id', 'mataPelajaran:id,kode,nama,kkm'])
            ->where('kelas_id', $request->kelas_id)
            ->where('mata_pelajaran_id', $request->mata_pelajaran_id)
            ->where('tahun_ajaran_id', $request->tahun_ajaran_id)
            ->join('siswa', 'siswa.id', '=', 'nilai.siswa_id')
            ->orderBy('siswa.nama')
            ->select('nilai.*')
            ->get();

        return response()->json([
            'data' => $nilai,
        ]);
    }

    /**
     * POST /api/nilai
     * Input nilai baru. Auto-calculate nilai_akhir & predikat.
     * Menggunakan updateOrCreate agar aman jika nilai untuk kombinasi
     * siswa+mapel+tahun_ajaran+kelas sudah ada (idempotent input).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'siswa_id'           => 'required|exists:siswa,id',
            'mata_pelajaran_id'  => 'required|exists:mata_pelajaran,id',
            'tahun_ajaran_id'    => 'required|exists:tahun_ajaran,id',
            'kelas_id'           => 'required|exists:kelas,id',
            'nilai_tugas'        => 'required|numeric|min:0|max:100',
            'nilai_uts'          => 'required|numeric|min:0|max:100',
            'nilai_uas'          => 'required|numeric|min:0|max:100',
            'catatan'            => 'nullable|string',
        ]);

        $user = Auth::user();
        if ($user->isGuru()) {
            $this->authorizeGuruForKelasMapel($user, $validated['kelas_id'], $validated['mata_pelajaran_id']);
        }

        [$nilaiAkhir, $predikat] = $this->hitungNilaiAkhirDanPredikat(
            $validated['nilai_tugas'],
            $validated['nilai_uts'],
            $validated['nilai_uas'],
            $validated['mata_pelajaran_id']
        );

        $nilai = Nilai::updateOrCreate(
            [
                'siswa_id'          => $validated['siswa_id'],
                'mata_pelajaran_id' => $validated['mata_pelajaran_id'],
                'tahun_ajaran_id'   => $validated['tahun_ajaran_id'],
                'kelas_id'          => $validated['kelas_id'],
            ],
            [
                'nilai_tugas' => $validated['nilai_tugas'],
                'nilai_uts'   => $validated['nilai_uts'],
                'nilai_uas'   => $validated['nilai_uas'],
                'nilai_akhir' => $nilaiAkhir,
                'predikat'    => $predikat,
                'catatan'     => $validated['catatan'] ?? null,
            ]
        );

        return response()->json([
            'message' => 'Nilai berhasil disimpan',
            'data'    => $nilai,
        ], 201);
    }

    /**
     * PUT /api/nilai/{id}
     * Edit nilai. Recalculate nilai_akhir & predikat setiap kali diupdate.
     */
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

    /**
     * GET /api/raport/{siswa_id}?tahun_ajaran_id=
     * Ambil semua nilai untuk 1 siswa pada 1 semester (tampilan raport).
     */
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

    /**
     * GET /api/rekap/{kelas_id}?tahun_ajaran_id=
     * GET /api/rekap?kelas_id={kelas_id}&tahun_ajaran_id=
     * Rekap nilai seluruh siswa di 1 kelas (rata-rata semua mapel) + ranking.
     */
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

        // Ranking: urutkan descending berdasarkan rata_rata, siswa tanpa nilai di paling bawah
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

    /**
     * Hitung nilai_akhir (bobot Tugas 30% + UTS 30% + UAS 40%) dan predikat.
     * Predikat dihitung relatif terhadap KKM mata pelajaran:
     *   A:  nilai_akhir >= KKM + 20
     *   AB: nilai_akhir >= KKM + 15
     *   B:  nilai_akhir >= KKM + 10
     *   BC: nilai_akhir >= KKM + 5
     *   C:  nilai_akhir >= KKM
     *   D:  nilai_akhir <  KKM
     */
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

    /**
     * Pastikan guru hanya bisa akses nilai untuk mapel yang ia ampu
     * di kelas tersebut (via tabel pivot guru_mapel) atau ia adalah wali kelasnya.
     */
    private function authorizeGuruForKelasMapel($user, int $kelasId, int $mataPelajaranId): void
    {
        $guru = $user->guru;

        abort_if(!$guru, 403, 'Akun ini tidak terhubung ke data guru.');

        $isWaliKelas = Kelas::where('id', $kelasId)->where('guru_id', $guru->id)->exists();
        $mengampuMapel = $guru->mataPelajaran()->where('mata_pelajaran_id', $mataPelajaranId)->exists();

        abort_if(!$isWaliKelas && !$mengampuMapel, 403, 'Anda tidak berwenang mengakses data ini.');
    }


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