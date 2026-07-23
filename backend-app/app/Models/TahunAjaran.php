<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;

class TahunAjaran extends Model
{
    use HasFactory;

    protected $table = 'tahun_ajaran';

    protected $fillable = [
        'tahun',
        'semester',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean'
    ];

    /**
     * Scope untuk mengambil tahun ajaran yang aktif.
     */
    public function scopeActive(Builder $query): Builder
use Illuminate\Database\Eloquent\Model;

class TahunAjaran extends Model
{
    protected $table = 'tahun_ajaran';
    protected $fillable = ['tahun_ajaran', 'semester', 'is_active'];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Relasi ke Kelas.
     */
    public function kelas(): HasMany
    {
        return $this->hasMany(Kelas::class);
    }
}
    public function nilai()
    {
        return $this->hasMany(Nilai::class, 'tahun_ajaran_id');
    }
}
