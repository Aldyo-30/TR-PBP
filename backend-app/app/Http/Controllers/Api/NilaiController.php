<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class NilaiController extends Controller
{
	/**
	 * Return raport data for a single student (stub/example data).
	 */
	public function raport($id)
	{
		// Example payload shape expected by frontend
		$data = [
			'student' => [
				'id' => (int) $id,
				'name' => 'Siswa Contoh',
				'nis' => 'S12345',
				'kelas' => '3A',
			],
			'semester' => '2025/2026 - Genap',
			'subjects' => [
				['subject' => 'Matematika', 'nilai' => 88],
				['subject' => 'Bahasa Indonesia', 'nilai' => 92],
				['subject' => 'IPA', 'nilai' => 85],
			],
		];

		return response()->json(['success' => true, 'data' => $data, 'message' => 'Raport siswa'], 200);
	}

	/**
	 * Return rekap & ranking per kelas (stub/example data).
	 */
	public function rekap(Request $request)
	{
		$data = [
			['kelas' => '3A', 'nama' => 'Siswa A', 'rata_rata' => 88.5, 'ranking' => 1],
			['kelas' => '3A', 'nama' => 'Siswa B', 'rata_rata' => 85.25, 'ranking' => 2],
			['kelas' => '3B', 'nama' => 'Siswa C', 'rata_rata' => 83.0, 'ranking' => 1],
		];

		return response()->json(['success' => true, 'data' => $data, 'message' => 'Rekap nilai per kelas'], 200);
	}
}