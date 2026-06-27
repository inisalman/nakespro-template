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
    id: 'bright-health',
    name: 'Bright Health',
    tokens: {
      accent: '#2563eb',
      background: '#ffffff',
      surface: '#f0f4f8',
      text: '#0f172a',
      muted: '#475569',
    },
  },
  {
    id: 'sky-clean',
    name: 'Sky Clean',
    tokens: {
      accent: '#0284c7',
      background: '#ffffff',
      surface: '#f0f9ff',
      text: '#0c4a6e',
      muted: '#0369a1',
    },
  },
  {
    id: 'teal-medical',
    name: 'Teal Medical',
    tokens: {
      accent: '#0d9488',
      background: '#f8fafc',
      surface: '#ecfeff',
      text: '#134e4a',
      muted: '#0f766e',
    },
  },
];

/** Id preset default clean-medical. Tepat satu default per template (R6.6). */
export const DEFAULT_PALETTE_ID = 'bright-health';

export default palettes;