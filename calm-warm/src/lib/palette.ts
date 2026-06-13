// lib/palette.ts — utilitas murni sistem palette.
//
// Berisi dua fungsi murni (kandidat property-based testing, lihat Property 9):
//   - resolvePalette(palettes, id, defaultId): pilih preset berdasarkan id;
//     fallback ke preset default + catat peringatan bila id tak dikenal/kosong
//     tanpa menghentikan proses (R6.5, R6.7).
//   - paletteToCssVars(palette): rangkai string CSS custom properties dari
//     token preset untuk di-inject pada elemen <html> oleh BaseLayout (R6.3).
//
// Tipe Palette/PaletteTokens didefinisikan di sini sebagai kontrak token dan
// di-re-use oleh `src/palettes.ts`. Fungsi resolvePalette menerima daftar
// palette sebagai argumen sehingga modul ini tidak bergantung pada
// `palettes.ts` (menghindari ketergantungan melingkar).

/**
 * Himpunan token warna minimal yang wajib didefinisikan setiap preset
 * (R6.2). Komponen hanya mereferensikan token ini via CSS custom properties,
 * bukan nilai warna literal (R6.4).
 */
export interface PaletteTokens {
  accent: string; // warna aksi/CTA
  background: string; // latar halaman
  surface: string; // latar kartu/section
  text: string; // teks utama
  muted: string; // teks sekunder
}

/** Satu Palette_Preset bernama milik sebuah template (R6.1). */
export interface Palette {
  id: string; // unik per template
  name: string; // label manusiawi
  tokens: PaletteTokens;
}

/**
 * Pilih Palette_Preset dari `palettes` berdasarkan `id`.
 *
 * Perilaku (R6.5, R6.7, Property 9):
 *   - Bila `id` cocok dengan salah satu preset, kembalikan preset tersebut.
 *   - Bila `id` kosong (undefined/null/whitespace-only) atau tidak dikenal,
 *     kembalikan preset default (id = `defaultId`) dan catat peringatan yang
 *     menyebut id palette yang diminta, tanpa menghentikan proses.
 *
 * @param palettes Daftar preset yang tersedia pada template.
 * @param id Id palette yang diminta dari `content.palette`.
 * @param defaultId Id preset default template (DEFAULT_PALETTE_ID).
 * @returns Preset yang cocok atau preset default.
 */
export function resolvePalette(
  palettes: readonly Palette[],
  id: string | null | undefined,
  defaultId: string,
): Palette {
  const requestedId = typeof id === 'string' ? id.trim() : '';

  if (requestedId !== '') {
    const matched = palettes.find((p) => p.id === requestedId);
    if (matched !== undefined) {
      return matched;
    }
  }

  // Tidak cocok / kosong → fallback ke default + peringatan.
  const fallback = palettes.find((p) => p.id === defaultId);

  const requestedLabel = requestedId === '' ? '(kosong)' : `"${requestedId}"`;
  // Peringatan dicatat (build-time console) tanpa menghentikan rendering.
  console.warn(
    `[palette] id palette ${requestedLabel} tidak dikenal; ` +
      `menggunakan preset default "${defaultId}".`,
  );

  if (fallback !== undefined) {
    return fallback;
  }

  // Pertahanan terakhir: defaultId pun tak ditemukan. Kembalikan preset
  // pertama bila ada agar rendering tetap berlanjut (R6.7).
  if (palettes.length > 0) {
    console.warn(
      `[palette] preset default "${defaultId}" tidak ditemukan; ` +
        `menggunakan preset pertama "${palettes[0].id}".`,
    );
    return palettes[0];
  }

  throw new Error(
    '[palette] tidak ada Palette_Preset yang tersedia untuk di-resolve.',
  );
}

/**
 * Rangkai token sebuah preset menjadi string CSS custom properties siap pakai
 * pada atribut `style` elemen `<html>` (R6.3).
 *
 * Contoh keluaran:
 *   "--accent:#2563eb;--background:#ffffff;--surface:#f8fafc;--text:#0f172a;--muted:#475569"
 *
 * Urutan token deterministik (accent, background, surface, text, muted).
 *
 * @param palette Preset yang sudah di-resolve.
 * @returns String CSS custom properties dipisah `;`.
 */
export function paletteToCssVars(palette: Palette): string {
  const { tokens } = palette;
  const entries: [string, string][] = [
    ['--accent', tokens.accent],
    ['--background', tokens.background],
    ['--surface', tokens.surface],
    ['--text', tokens.text],
    ['--muted', tokens.muted],
  ];

  return entries.map(([name, value]) => `${name}:${value}`).join(';');
}
