<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TahunAjaran extends Model
{
    protected $table = 'tahun_ajaran';
    protected $fillable = ['tahun_ajaran', 'semester', 'is_active'];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function nilai()
    {
        return $this->hasMany(Nilai::class, 'tahun_ajaran_id');
    }
}