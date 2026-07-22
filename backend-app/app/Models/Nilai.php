<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Nilai extends Model
{
    protected $table = 'nilai';
    protected $fillable = [
        'nama_siswa',
        'mata_pelajaran_id',
        'tahun_ajaran_id',
        'nilai_tugas',
        'nilai_uts',
        'nilai_uas',
        'nilai_akhir',
        'predikat'
    ];

    public function mataPelajaran()
    {
        return $this->belongsTo(MataPelajaran::class, 'mata_pelajaran_id');
    }

    public function tahunAjaran()
    {
        return $this->belongsTo(TahunAjaran::class, 'tahun_ajaran_id');
    }

    public function hitungNilaiAkhir()
    {
        // Bobot: 30% Tugas + 30% UTS + 40% UAS
        return ($this->nilai_tugas * 0.3) + ($this->nilai_uts * 0.3) + ($this->nilai_uas * 0.4);
    }

    public function getPredikat($nilaiAkhir)
    {
        if ($nilaiAkhir >= 85) return 'A';
        if ($nilaiAkhir >= 75) return 'B';
        if ($nilaiAkhir >= 60) return 'C';
        if ($nilaiAkhir >= 50) return 'D';
        return 'E';
    }
}