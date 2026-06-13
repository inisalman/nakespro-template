// src/palettes.ts — Palette_Preset milik template calm-warm.
//
// calm-warm memakai karakter hangat lembut/earthy (R7.3): nuansa terakota,
// amber, dan cokelat tanah yang menenangkan untuk perawatan lansia, paliatif,
// kesehatan mental, dan home nursing. File ini mendefinisikan 3 preset bernama
// (R6.1) dengan himpunan token identik minimal `accent, background, surface,
// text, muted` (R6.2) dan tepat satu default (R6.6).
//
// Seluruh preset dirancang memenuhi WCAG 2.1 AA (R6.8, R11.3):
//   - text vs background ≥ 4.5:1 dan text vs surface ≥ 4.5:1
//   - accent vs background ≥ 3:1
// Kontras diverifikasi oleh property test (Property 11).

import type { Palette } from './lib/palette.ts';

const palettes: Palette[] = [
  {
    id: 'terracotta',
    name: 'Terracotta',
    tokens: {
      accent: '#b45309', // amber-700
      background: '#fffaf5', // krem hangat
      surface: '#fdf1e7', // peach lembut
      text: '#3a2415', // cokelat tanah gelap
      muted: '#7c5a3f',
    },
  },
  {
    id: 'clay',
    name: 'Clay',
    tokens: {
      accent: '#9a3412', // orange-800
      background: '#fdf8f4',
      surface: '#f7ece4',
      text: '#3c2317',
      muted: '#785847',
    },
  },
  {
    id: 'sand',
    name: 'Sand',
    tokens: {
      accent: '#a16207', // yellow-700
      background: '#fefcf6',
      surface: '#f6efe1',
      text: '#3a2e16',
      muted: '#766442',
    },
  },
];

/** Id preset default calm-warm. Tepat satu default per template (R6.6). */
export const DEFAULT_PALETTE_ID = 'terracotta';

export default palettes;
