// lib/empty.ts — utilitas murni deteksi "kosong" sesuai definisi kontrak.
//
// Definisi "kosong" pada Template_System (R5.2):
//   - Field bertipe TEKS dianggap kosong bila bernilai undefined, null, atau
//     hanya berisi whitespace (mis. "", "   ", "\t\n").
//   - Field bertipe DAFTAR dianggap kosong bila bernilai undefined, null, atau
//     berisi 0 entri.
//
// Fungsi-fungsi ini murni (tanpa side-effect) sehingga menjadi kandidat
// property-based testing (lihat Property 4). Section auto-hide memakainya
// sebagai guard untuk memutuskan render/hide (R5.3, R5.4).

/**
 * Mengembalikan `true` bila nilai teks dianggap kosong.
 *
 * Kosong = `undefined`, `null`, atau string yang setelah di-trim tidak
 * menyisakan karakter apa pun (whitespace-only). Selain itu `false`.
 *
 * @param value - nilai teks opsional yang akan diperiksa.
 * @returns `true` tepat ketika nilai undefined/null/whitespace-only (R5.2).
 */
export function isEmptyText(value: string | null | undefined): boolean {
  if (value === undefined || value === null) {
    return true;
  }
  return value.trim().length === 0;
}

/**
 * Mengembalikan `true` bila nilai daftar dianggap kosong.
 *
 * Kosong = `undefined`, `null`, atau daftar dengan 0 entri. Selain itu
 * `false`.
 *
 * @typeParam T - tipe elemen daftar.
 * @param value - daftar opsional yang akan diperiksa.
 * @returns `true` tepat ketika nilai undefined/null/0 entri (R5.2).
 */
export function isEmptyList<T>(value: readonly T[] | null | undefined): boolean {
  if (value === undefined || value === null) {
    return true;
  }
  return value.length === 0;
}
