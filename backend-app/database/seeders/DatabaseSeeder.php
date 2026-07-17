<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     * Membuat akun admin dan guru demo untuk keperluan development.
     */
    public function run(): void
    {
        // Akun Administrator
        User::factory()->create([
            'name'     => 'Administrator',
            'email'    => 'admin@raportsd.com',
            'password' => Hash::make('password'),
            'role'     => 'admin',
        ]);

        // Akun Guru Demo
        User::factory()->create([
            'name'     => 'Guru Demo',
            'email'    => 'guru@raportsd.com',
            'password' => Hash::make('password'),
            'role'     => 'guru',
        ]);
    }
}
