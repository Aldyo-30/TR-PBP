<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MataPelajaran extends Model
{
    protected $table = 'mata_pelajaran';
    protected $fillable = ['kode_mapel', 'nama_mapel'];

    public function nilai()
    {
        return $this->hasMany(Nilai::class, 'mata_pelajaran_id');
    }
}