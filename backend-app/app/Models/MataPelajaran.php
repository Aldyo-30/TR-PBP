<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class MataPelajaran extends Model
{
    use HasFactory;

    protected $table = 'mata_pelajaran';

    protected $fillable = [
        'kode',
        'nama',
        'kkm'
    ];

    public function guru(): BelongsToMany
    {
        return $this->belongsToMany(Guru::class, 'guru_mapel', 'mata_pelajaran_id', 'guru_id')
                    ->withTimestamps();
    }

    public function nilai()
    {
        return $this->hasMany(Nilai::class, 'mata_pelajaran_id');
    }
}
