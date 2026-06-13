// lib/whatsapp.ts — utilitas murni untuk WhatsApp CTA.
//
// Fungsi di sini bersifat pure (tanpa side-effect) sehingga menjadi kandidat
// property-based testing. Tiga tanggung jawab:
//   1. normalizeWaNumber  — normalisasi nomor menjadi hanya digit + kode negara
//                           (R4.2; Property 1).
//   2. isValidWaNumber    — validitas jumlah digit 8–15 setelah normalisasi,
//                           penentu kemunculan WhatsApp_CTA (R4.4; Property 2).
//   3. buildWaUrl         — susun URL wa.me dengan pesan prefilled ter-encode
//                           yang dipotong di 1000 karakter (R4.3; Property 3).

/** Panjang maksimum pesan prefilled WhatsApp sebelum di-encode (R4.3). */
export const MAX_WA_MESSAGE_LENGTH = 1000;

/** Batas bawah jumlah digit nomor WhatsApp yang valid (R4.4). */
export const MIN_WA_DIGITS = 8;

/** Batas atas jumlah digit nomor WhatsApp yang valid (R4.4). */
export const MAX_WA_DIGITS = 15;

/**
 * Normalisasi nomor WhatsApp menjadi string hanya-digit dengan kode negara
 * Indonesia (R4.2).
 *
 * Langkah:
 *   1. Buang seluruh karakter non-digit (termasuk `+`, `-`, `(`, `)`, dan
 *      spasi) sehingga hasilnya dijamin hanya berisi digit.
 *   2. Bila hasil bersih diawali `0`, ganti `0` di depan dengan kode negara
 *      `62`.
 *
 * @param input nomor mentah dari `content.waNumber` (boleh mengandung simbol)
 * @returns string yang hanya berisi digit; string kosong bila tidak ada digit
 */
export function normalizeWaNumber(input: string | null | undefined): string {
  if (input == null) return '';

  // Buang semua karakter selain digit. Ini sekaligus menghapus
  // `+ - ( ) spasi` dan separator lain, menjamin output hanya-digit.
  const digitsOnly = input.replace(/\D/g, '');

  // Ganti angka 0 di depan dengan kode negara 62.
  if (digitsOnly.startsWith('0')) {
    return '62' + digitsOnly.slice(1);
  }

  return digitsOnly;
}

/**
 * Tentukan apakah sebuah nomor valid untuk menampilkan WhatsApp_CTA.
 *
 * Valid jika jumlah digit setelah normalisasi berada pada rentang
 * {@link MIN_WA_DIGITS}–{@link MAX_WA_DIGITS} inklusif (R4.4). Nomor kosong /
 * undefined / di luar rentang dianggap tidak valid.
 *
 * @param input nomor mentah dari `content.waNumber`
 * @returns true bila jumlah digit ternormalisasi 8–15
 */
export function isValidWaNumber(input: string | null | undefined): boolean {
  const digits = normalizeWaNumber(input).length;
  return digits >= MIN_WA_DIGITS && digits <= MAX_WA_DIGITS;
}

/**
 * Susun URL `wa.me` untuk nomor dan pesan prefilled opsional (R4.3).
 *
 * Nomor dinormalisasi via {@link normalizeWaNumber}. Bila `waMessage` diisi,
 * pesan dipotong di {@link MAX_WA_MESSAGE_LENGTH} karakter (potongan adalah
 * prefix dari pesan asli — tidak ada karakter ditambah/diubah) lalu di-encode
 * sebagai query `?text=`.
 *
 * @param waNumber nomor mentah dari `content.waNumber`
 * @param waMessage pesan prefilled opsional dari `content.waMessage`
 * @returns URL wa.me lengkap
 */
export function buildWaUrl(
  waNumber: string | null | undefined,
  waMessage?: string | null,
): string {
  const normalized = normalizeWaNumber(waNumber);
  const baseUrl = `https://wa.me/${normalized}`;

  if (waMessage == null || waMessage.length === 0) {
    return baseUrl;
  }

  // Potong di 1000 karakter pada string mentah agar hasilnya tetap prefix
  // dari pesan asli (Property 3), baru kemudian di-encode untuk URL.
  const truncated = waMessage.slice(0, MAX_WA_MESSAGE_LENGTH);
  return `${baseUrl}?text=${encodeURIComponent(truncated)}`;
}
