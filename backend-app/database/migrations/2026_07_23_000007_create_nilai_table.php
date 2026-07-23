<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('nilai', function (Blueprint $table) {
            $table->id();
            $table->foreignId('siswa_id')
                  ->constrained('siswa')
                  ->onDelete('cascade');
            $table->foreignId('mata_pelajaran_id')
                  ->constrained('mata_pelajaran')
                  ->onDelete('cascade');
            $table->foreignId('tahun_ajaran_id')
                  ->constrained('tahun_ajaran')
                  ->onDelete('cascade');
            $table->foreignId('kelas_id')
                  ->constrained('kelas')
                  ->onDelete('cascade');

            // Komponen Nilai
            $table->decimal('nilai_tugas', 5, 2)->default(0);
            $table->decimal('nilai_uts', 5, 2)->default(0);
            $table->decimal('nilai_uas', 5, 2)->default(0);

            // Hasil Olahan (Kalkulasi)
            $table->decimal('nilai_akhir', 5, 2)->nullable();
            $table->string('predikat', 2)->nullable();

            // Catatan/Deskripsi
            $table->text('catatan')->nullable();

            $table->timestamps();

            // Unique constraint: 1 siswa hanya punya 1 nilai per mapel per semester per kelas
            $table->unique(
                ['siswa_id', 'mata_pelajaran_id', 'tahun_ajaran_id', 'kelas_id'],
                'nilai_unique'
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nilai');
    }
};
