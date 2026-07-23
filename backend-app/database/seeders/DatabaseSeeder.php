<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Guru;
use App\Models\TahunAjaran;
use App\Models\MataPelajaran;
use App\Models\Kelas;
use App\Models\Siswa;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     * Membuat akun admin, guru, tahun ajaran, mapel, kelas, dan siswa default.
     */
    public function run(): void
    {
        // 1. Akun Administrator
        $adminUser = User::factory()->create([
            'name'     => 'Administrator',
            'email'    => 'admin@raportsd.com',
            'password' => Hash::make('password'),
            'role'     => 'admin',
        ]);

        // 2. Akun Guru Demo 1
        $guruUser1 = User::factory()->create([
            'name'     => 'Budi Santoso, S.Pd.',
            'email'    => 'guru@raportsd.com',
            'password' => Hash::make('password'),
            'role'     => 'guru',
        ]);

        // Akun Guru Demo 2
        $guruUser2 = User::factory()->create([
            'name'     => 'Siti Rahma, S.Pd.',
            'email'    => 'siti@raportsd.com',
            'password' => Hash::make('password'),
            'role'     => 'guru',
        ]);

        // 3. Tahun Ajaran
        $ta1 = TahunAjaran::create([
            'tahun'     => '2024/2025',
            'semester'  => 'Ganjil',
            'is_active' => true,
        ]);

        $ta2 = TahunAjaran::create([
            'tahun'     => '2024/2025',
            'semester'  => 'Genap',
            'is_active' => false,
        ]);

        // 4. Mata Pelajaran
        $mapels = [
            ['kode' => 'MAPEL-AGM', 'nama' => 'Pendidikan Agama', 'kkm' => 75],
            ['kode' => 'MAPEL-PKN', 'nama' => 'Pendidikan Pancasila dan Kewarganegaraan (PKn)', 'kkm' => 70],
            ['kode' => 'MAPEL-IND', 'nama' => 'Bahasa Indonesia', 'kkm' => 70],
            ['kode' => 'MAPEL-MTK', 'nama' => 'Matematika', 'kkm' => 70],
            ['kode' => 'MAPEL-IPA', 'nama' => 'Ilmu Pengetahuan Alam (IPA)', 'kkm' => 70],
            ['kode' => 'MAPEL-IPS', 'nama' => 'Ilmu Pengetahuan Sosial (IPS)', 'kkm' => 70],
            ['kode' => 'MAPEL-SBK', 'nama' => 'Seni Budaya & Keterampilan (SBK)', 'kkm' => 70],
            ['kode' => 'MAPEL-PJK', 'nama' => 'Pendidikan Jasmani Olahraga & Kesehatan (PJOK)', 'kkm' => 70],
            ['kode' => 'MAPEL-ING', 'nama' => 'Bahasa Inggris', 'kkm' => 75],
        ];

        $createdMapels = [];
        foreach ($mapels as $mapel) {
            $createdMapels[] = MataPelajaran::create($mapel);
        }

        // 5. Data Guru
        $guru1 = Guru::create([
            'user_id'       => $guruUser1->id,
            'nip'           => '198001012005011001',
            'nama'          => 'Budi Santoso, S.Pd.',
            'jenis_kelamin' => 'L',
            'alamat'        => 'Jl. Merdeka No. 12, Jakarta',
            'no_telepon'    => '081234567890',
        ]);

        $guru2 = Guru::create([
            'user_id'       => $guruUser2->id,
            'nip'           => '198505122010122002',
            'nama'          => 'Siti Rahma, S.Pd.',
            'jenis_kelamin' => 'P',
            'alamat'        => 'Jl. Mawar No. 45, Bandung',
            'no_telepon'    => '089876543210',
        ]);

        // Sync Guru 1 dengan beberapa Mapel
        $guru1->mataPelajaran()->sync([$createdMapels[2]->id, $createdMapels[3]->id, $createdMapels[4]->id]); // IND, MTK, IPA
        // Sync Guru 2 dengan beberapa Mapel
        $guru2->mataPelajaran()->sync([$createdMapels[0]->id, $createdMapels[1]->id, $createdMapels[5]->id]); // AGM, PKN, SBK

        // 6. Kelas
        $kelas1 = Kelas::create([
            'nama_kelas'      => '6A',
            'guru_id'         => $guru1->id,
            'tahun_ajaran_id' => $ta1->id,
        ]);

        $kelas2 = Kelas::create([
            'nama_kelas'      => '6B',
            'guru_id'         => $guru2->id,
            'tahun_ajaran_id' => $ta1->id,
        ]);

        // 7. Siswa
        $siswas = [
            [
                'nis'            => '10001',
                'nisn'           => '0091234501',
                'nama'           => 'Aldo Saputra',
                'jenis_kelamin'  => 'L',
                'tempat_lahir'   => 'Jakarta',
                'tanggal_lahir'  => '2013-05-10',
                'alamat'         => 'Jl. Melati No. 5',
                'nama_ortu_wali' => 'Bambang Saputra',
                'kelas_id'       => $kelas1->id,
            ],
            [
                'nis'            => '10002',
                'nisn'           => '0091234502',
                'nama'           => 'Bela Pratiwi',
                'jenis_kelamin'  => 'P',
                'tempat_lahir'   => 'Jakarta',
                'tanggal_lahir'  => '2013-08-15',
                'alamat'         => 'Jl. Anggrek No. 8',
                'nama_ortu_wali' => 'Hendra Pratiwi',
                'kelas_id'       => $kelas1->id,
            ],
            [
                'nis'            => '10003',
                'nisn'           => '0091234503',
                'nama'           => 'Citra Lestari',
                'jenis_kelamin'  => 'P',
                'tempat_lahir'   => 'Bandung',
                'tanggal_lahir'  => '2013-11-20',
                'alamat'         => 'Jl. Dahlia No. 10',
                'nama_ortu_wali' => 'Joko Lestari',
                'kelas_id'       => $kelas1->id,
            ],
            [
                'nis'            => '10004',
                'nisn'           => '0091234504',
                'nama'           => 'Doni Wijaya',
                'jenis_kelamin'  => 'L',
                'tempat_lahir'   => 'Surabaya',
                'tanggal_lahir'  => '2013-02-25',
                'alamat'         => 'Jl. Kamboja No. 3',
                'nama_ortu_wali' => 'Rudi Wijaya',
                'kelas_id'       => $kelas2->id,
            ],
            [
                'nis'            => '10005',
                'nisn'           => '0091234505',
                'nama'           => 'Elisa Fitri',
                'jenis_kelamin'  => 'P',
                'tempat_lahir'   => 'Jakarta',
                'tanggal_lahir'  => '2013-07-07',
                'alamat'         => 'Jl. Flamboyan No. 14',
                'nama_ortu_wali' => 'Yusuf Fitri',
                'kelas_id'       => $kelas2->id,
            ],
        ];

        foreach ($siswas as $siswa) {
            Siswa::create($siswa);
        }
        // Matapelajaran sama Tahun Ajaran
        MataPelajaran::insert([
            ['kode_mapel' => 'MATH-SD', 'nama_mapel' => 'Matematika'],
            ['kode_mapel' => 'BINDO-SD', 'nama_mapel' => 'Bahasa Indonesia'],
            ['kode_mapel' => 'IPA-SD', 'nama_mapel' => 'Ilmu Pengetahuan Alam'],
        ]);

        TahunAjaran::insert([
            ['tahun_ajaran' => '2024/2025', 'semester' => 'Ganjil', 'is_active' => true],
            ['tahun_ajaran' => '2024/2025', 'semester' => 'Genap', 'is_active' => false],
        ]);
    
    }
}
