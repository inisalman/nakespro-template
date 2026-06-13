// src/palettes.ts — Palette_Preset milik template friendly-care.
//
// friendly-care memakai karakter ramah, cerah, dan rounded (R7.4): warna
// segar dan ceria untuk layanan anak, ibu & bayi, fisioterapi, dan wellness.
// File ini mendefinisikan 3 preset bernama (R6.1) dengan himpunan token
// identik minimal `accent, background, surface, text, muted` (R6.2) dan tepat
// satu default (R6.6).
//
// Seluruh preset dirancang memenuhi WCAG 2.1 AA (R6.8, R11.3):
//   - text vs background ≥ 4.5:1 dan text vs surface ≥ 4.5:1
//   - accent vs background ≥ 3:1
// Kontras diverifikasi oleh property test (Property 11).

import type { Palette } from './lib/palette.ts';

const palettes: Palette[] = [
  {
    id: 'sunny',
    name: 'Sunny',
    tokens: {
      accent: '#c2410c', // orange-700 cerah
      background: '#fffdf7',
      surface: '#fef3e2', // kuning lembut
      text: '#2e2235',
      muted: '#6d5577',
    },
  },
  {
    id: 'bubblegum',
    name: 'Bubblegum',
    tokens: {
      accent: '#be185d', // pink-700
      background: '#fff7fb',
      surface: '#fdeaf3', // pink lembut
      text: '#34172a',
      muted: '#7a4760',
    },
  },
  {
    id: 'mint',
    name: 'Mint',
    tokens: {
      accent: '#047857', // emerald-700
      background: '#f6fffb',
      surface: '#e7f8f0', // mint lembut
      text: '#10241c',
      muted: '#3f6356',
    },
  },
];

/** Id preset default friendly-care. Tepat satu default per template (R6.6). */
export const DEFAULT_PALETTE_ID = 'sunny';

export default palettes;
