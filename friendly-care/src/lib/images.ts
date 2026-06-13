// lib/images.ts — utilitas murni untuk teks alternatif gambar serta resolusi
// & validasi path foto dengan dua mode kebijakan foto hilang.
//
// Dua tanggung jawab modul ini (R11.1, R8.7, R9.7):
//
//   1. resolveAltText(photo): menentukan teks alternatif yang selalu
//      bermakna untuk sebuah Photo. Memakai `caption` bila tidak kosong;
//      selain itu memberi alt default deskriptif yang tidak kosong dan
//      panjangnya 1–125 karakter (R11.1, Property 12).
//
//   2. Resolusi/validasi path foto dengan dua mode:
//        - STRICT (default, build client): foto yang direferensikan namun
//          tidak ada di public/images/ menyebabkan error yang menyebut nama
//          berkas — sehingga `astro build` berhenti sebelum output (R8.7).
//        - PLACEHOLDER (Reference_Template): bila flag `ALLOW_PLACEHOLDER`
//          aktif, foto hilang diganti gambar placeholder dan rendering
//          section lain tetap berlanjut (R9.7).
//
// resolveAltText murni (tanpa side-effect) sehingga menjadi kandidat
// property-based testing (lihat Property 12).

import type { Photo } from '../types.ts';
import { isEmptyText } from './empty.ts';

/**
 * Teks alternatif default deskriptif yang dipakai bila sebuah foto tidak
 * memiliki `caption`. Wajib tidak kosong dan panjangnya 1–125 karakter agar
 * memenuhi kontrak aksesibilitas (R11.1, Property 12).
 */
export const DEFAULT_ALT_TEXT =
  'Foto dokumentasi praktik dan layanan tenaga kesehatan';

/**
 * Batas atas panjang teks alternatif default (karakter). Alt default tidak
 * boleh melampaui batas ini (R11.1).
 */
export const MAX_DEFAULT_ALT_LENGTH = 125;

/**
 * Path publik gambar placeholder yang dipakai pada mode PLACEHOLDER ketika
 * foto yang direferensikan tidak ditemukan (R9.7).
 */
export const PLACEHOLDER_IMAGE = '/images/placeholder.svg';

/**
 * Prefix path publik tempat foto client disajikan. `Photo.url` adalah nama
 * berkas relatif terhadap direktori ini (R2.6).
 */
const PUBLIC_IMAGE_DIR = '/images/';

/**
 * Menentukan teks alternatif yang bermakna untuk sebuah Photo.
 *
 * Aturan (R11.1, Property 12):
 *   - Bila `photo.caption` TIDAK kosong (bukan undefined/null/whitespace-only),
 *     caption dipakai sebagai alt.
 *   - Bila caption kosong, dikembalikan alt default deskriptif yang tidak
 *     kosong sepanjang 1–125 karakter.
 *
 * Fungsi ini murni dan selalu mengembalikan string tidak kosong.
 *
 * @param photo - foto yang akan ditentukan teks alternatifnya.
 * @returns teks alternatif yang bermakna dan tidak kosong.
 */
export function resolveAltText(photo: Photo): string {
  if (!isEmptyText(photo.caption)) {
    // caption sudah dipastikan tidak undefined/null oleh isEmptyText.
    return (photo.caption as string).trim();
  }
  return DEFAULT_ALT_TEXT;
}

/**
 * Error yang dilempar pada mode STRICT ketika foto yang direferensikan tidak
 * ditemukan di `public/images/`. Pesannya menyebut nama berkas yang hilang
 * agar mudah dilacak saat build gagal (R8.7).
 */
export class MissingPhotoError extends Error {
  /** Nama berkas foto yang hilang. */
  readonly fileName: string;

  constructor(fileName: string) {
    super(
      `Foto tidak ditemukan di public/images/: "${fileName}". ` +
        `Tambahkan berkas tersebut, atau jalankan dengan ALLOW_PLACEHOLDER=1 ` +
        `untuk memakai gambar placeholder (khusus Reference_Template).`,
    );
    this.name = 'MissingPhotoError';
    this.fileName = fileName;
  }
}

/**
 * Sumber environment yang dapat dibaca untuk flag mode placeholder. Astro
 * memakai `import.meta.env`; Node/Vitest memakai `process.env`. Tipe ini
 * memungkinkan keduanya (dan injeksi pada test).
 */
export type EnvSource = Record<string, string | boolean | undefined>;

function readFlag(env: EnvSource | undefined, key: string): string | undefined {
  if (env && env[key] !== undefined) {
    return String(env[key]);
  }
  // Fallback ke process.env bila tersedia (build/test di Node).
  if (typeof process !== 'undefined' && process.env && process.env[key] !== undefined) {
    return process.env[key];
  }
  return undefined;
}

/**
 * Menentukan apakah mode PLACEHOLDER aktif berdasarkan flag
 * `ALLOW_PLACEHOLDER`. Aktif bila flag bernilai `"1"` atau `"true"`
 * (case-insensitive). Selain itu mode STRICT yang berlaku (R8.7, R9.7).
 *
 * @param env - sumber environment opsional (default membaca `process.env`).
 * @returns `true` bila mode placeholder aktif.
 */
export function isPlaceholderModeEnabled(env?: EnvSource): boolean {
  const flag = readFlag(env, 'ALLOW_PLACEHOLDER');
  if (flag === undefined) {
    return false;
  }
  const normalized = flag.trim().toLowerCase();
  return normalized === '1' || normalized === 'true';
}

/**
 * Menormalkan `Photo.url` menjadi nama berkas murni (tanpa prefix path atau
 * leading slash), sehingga dapat dibandingkan dengan daftar berkas yang
 * tersedia di `public/images/`.
 */
function toFileName(url: string): string {
  let name = url.trim();
  // Buang prefix path publik bila disertakan, lalu leading slash.
  name = name.replace(/^\/+/, '');
  if (name.toLowerCase().startsWith('images/')) {
    name = name.slice('images/'.length);
  }
  return name;
}

/**
 * Opsi resolusi path foto.
 */
export interface ResolvePhotoOptions {
  /**
   * Daftar nama berkas foto yang tersedia di `public/images/`. Dipakai untuk
   * memvalidasi keberadaan foto yang direferensikan.
   */
  available: Iterable<string>;
  /**
   * Paksa mode placeholder. Bila tidak diberikan, ditentukan dari flag
   * `ALLOW_PLACEHOLDER` pada environment.
   */
  allowPlaceholder?: boolean;
  /** Sumber environment opsional (untuk test/injeksi). */
  env?: EnvSource;
  /** Path placeholder kustom; default `PLACEHOLDER_IMAGE`. */
  placeholder?: string;
}

/**
 * Meresolusi path publik sebuah foto sambil memvalidasi keberadaannya.
 *
 * Perilaku (R8.7, R9.7):
 *   - Bila nama berkas ada pada `available`, kembalikan path publik
 *     `"/images/<berkas>"`.
 *   - Bila tidak ada:
 *       - Mode PLACEHOLDER aktif → kembalikan path placeholder dan catat
 *         peringatan (rendering lanjut).
 *       - Mode STRICT (default) → lempar `MissingPhotoError` menyebut nama
 *         berkas (menghentikan build sebelum output).
 *
 * @param url - `Photo.url` yang akan diresolusi.
 * @param options - daftar berkas tersedia + opsi mode.
 * @returns path publik foto (atau placeholder pada mode PLACEHOLDER).
 * @throws {MissingPhotoError} pada mode STRICT bila foto tidak ditemukan.
 */
export function resolvePhotoPath(url: string, options: ResolvePhotoOptions): string {
  const fileName = toFileName(url);
  const availableSet =
    options.available instanceof Set
      ? (options.available as Set<string>)
      : new Set(options.available);

  if (availableSet.has(fileName)) {
    return `${PUBLIC_IMAGE_DIR}${fileName}`;
  }

  const placeholderMode =
    options.allowPlaceholder ?? isPlaceholderModeEnabled(options.env);

  if (placeholderMode) {
    // eslint-disable-next-line no-console
    console.warn(
      `[images] Foto "${fileName}" tidak ditemukan di public/images/; ` +
        `memakai placeholder (ALLOW_PLACEHOLDER aktif).`,
    );
    return options.placeholder ?? PLACEHOLDER_IMAGE;
  }

  throw new MissingPhotoError(fileName);
}
