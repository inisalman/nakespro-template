// src/palettes.ts — Palette_Preset milik template modern-light.
//
// modern-light memakai karakter visual bersih/netral (R7.1): palette netral,
// kontras tinggi, bentuk minimal. File ini mendefinisikan 3 preset bernama
// (R6.1) yang masing-masing memuat himpunan token identik minimal `accent,
// background, surface, text, muted` (R6.2) dan tepat satu default (R6.6).
//
// Seluruh preset dirancang memenuhi WCAG 2.1 AA (R6.8, R11.3):
//   - text vs background ≥ 4.5:1 dan text vs surface ≥ 4.5:1
//   - accent vs background ≥ 3:1 (dipakai pada elemen UI/CTA)
// Kontras diverifikasi oleh property test (Property 11).
//
// Tipe `Palette`/`PaletteTokens` di-reuse dari lib/palette.ts agar kontrak
// token tunggal dan resolvePalette tidak bergantung pada file ini.

import type { Palette } from './lib/palette.ts';

/**
 * Daftar Palette_Preset modern-light. Tiga preset netral kontras-tinggi,
 * semua AA-compliant (R6.1, R6.8).
 */
const palettes: Palette[] = [
  {
    id: 'neutral',
    name: 'Netral',
    tokens: {
      accent: '#2563eb', // blue-600
      background: '#ffffff',
      surface: '#f8fafc', // slate-50
      text: '#0f172a', // slate-900
      muted: '#475569', // slate-600
    },
  },
  {
    id: 'slate',
    name: 'Slate',
    tokens: {
      accent: '#1d4ed8', // blue-700
      background: '#ffffff',
      surface: '#f1f5f9', // slate-100
      text: '#1e293b', // slate-800
      muted: '#475569', // slate-600
    },
  },
  {
    id: 'graphite',
    name: 'Graphite',
    tokens: {
      accent: '#b45309', // amber-700 (kontras hangat netral)
      background: '#fafaf9', // stone-50
      surface: '#f5f5f4', // stone-100
      text: '#1c1917', // stone-900
      muted: '#57534e', // stone-600
    },
  },
];

/**
 * Id preset default modern-light. Tepat satu default per template (R6.6).
 * Dipakai oleh resolvePalette sebagai fallback bila `content.palette` kosong
 * atau tidak dikenal (R6.7).
 */
export const DEFAULT_PALETTE_ID = 'neutral';

export default palettes;
