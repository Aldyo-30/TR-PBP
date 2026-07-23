<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Nilai extends Model
{
    use HasFactory;

    protected $table = 'nilai';

    protected $fillable = [
        'siswa_id',
        'mata_pelajaran_id',
        'tahun_ajaran_id',
        'kelas_id',
        'nilai_tugas',
        'nilai_uts',
        'nilai_uas',
        'nilai_akhir',
        'predikat',
        'catatan',
    ];

    /**
     * Relasi ke Siswa.
     */
    public function siswa(): BelongsTo
    {
        return $this->belongsTo(Siswa::class);
    }

    /**
     * Relasi ke Mata Pelajaran.
     */
    public function mataPelajaran(): BelongsTo
    {
        return $this->belongsTo(MataPelajaran::class, 'mata_pelajaran_id');
    }

    /**
     * Relasi ke Tahun Ajaran.
     */
    public function tahunAjaran(): BelongsTo
    {
        return $this->belongsTo(TahunAjaran::class, 'tahun_ajaran_id');
    }

    /**
     * Relasi ke Kelas.
     */
    public function kelas(): BelongsTo
    {
        return $this->belongsTo(Kelas::class);
    }

    /**
     * Hitung nilai akhir berdasarkan bobot.
     * Bobot: 30% Tugas + 30% UTS + 40% UAS
     */
    public function hitungNilaiAkhir(): float
    {
        return ($this->nilai_tugas * 0.3) + ($this->nilai_uts * 0.3) + ($this->nilai_uas * 0.4);
    }

    /**
     * Tentukan predikat berdasarkan nilai akhir.
     */
    public function getPredikat(float $nilaiAkhir): string
    {
        if ($nilaiAkhir >= 85) return 'A';
        if ($nilaiAkhir >= 75) return 'B';
        if ($nilaiAkhir >= 60) return 'C';
        if ($nilaiAkhir >= 50) return 'D';
        return 'E';
    }
}