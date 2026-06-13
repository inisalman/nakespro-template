// src/palettes.ts — Palette_Preset milik template clean-medical.
//
// clean-medical memakai karakter klinis bernuansa biru/teal (R7.2): warna
// dingin yang menenangkan untuk layanan medis teknis & perawatan luka. File
// ini mendefinisikan 3 preset bernama (R6.1) dengan himpunan token identik
// minimal `accent, background, surface, text, muted` (R6.2) dan tepat satu
// default (R6.6).
//
// Seluruh preset dirancang memenuhi WCAG 2.1 AA (R6.8, R11.3):
//   - text vs background ≥ 4.5:1 dan text vs surface ≥ 4.5:1
//   - accent vs background ≥ 3:1
// Kontras diverifikasi oleh property test (Property 11).

import type { Palette } from './lib/palette.ts';

const palettes: Palette[] = [
  {
    id: 'clinical-blue',
    name: 'Clinical Blue',
    tokens: {
      accent: '#0369a1', // sky-700
      background: '#ffffff',
      surface: '#f0f9ff', // sky-50
      text: '#0c2433',
      muted: '#3f6079',
    },
  },
  {
    id: 'teal',
    name: 'Teal',
    tokens: {
      accent: '#0f766e', // teal-700
      background: '#ffffff',
      surface: '#f0fdfa', // teal-50
      text: '#0f2e2b',
      muted: '#3a5c58',
    },
  },
  {
    id: 'sky-slate',
    name: 'Sky Slate',
    tokens: {
      accent: '#0e7490', // cyan-700
      background: '#f8fafc', // slate-50
      surface: '#eef6f9',
      text: '#11243a',
      muted: '#415a72',
    },
  },
];

/** Id preset default clean-medical. Tepat satu default per template (R6.6). */
export const DEFAULT_PALETTE_ID = 'clinical-blue';

export default palettes;
