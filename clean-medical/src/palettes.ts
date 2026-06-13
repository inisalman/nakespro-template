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
      accent: '#1f6fff', // biru terang health-tech — CTA & aksen
      background: '#ffffff',
      surface: '#eef1fb', // lavender muda untuk section blok
      text: '#0f1726',
      muted: '#4a5570',
    },
  },
  {
    id: 'sky-clean',
    name: 'Sky Clean',
    tokens: {
      accent: '#0b74d1', // biru langit sedikit lebih dalam
      background: '#ffffff',
      surface: '#eaf3fb',
      text: '#102433',
      muted: '#42596c',
    },
  },
  {
    id: 'ink-lavender',
    name: 'Ink Lavender',
    tokens: {
      accent: '#3b59e6', // indigo cerah di atas latar lavender
      background: '#f7f8fc',
      surface: '#eceefb',
      text: '#12172b',
      muted: '#454d6b',
    },
  },
];

/** Id preset default clean-medical. Tepat satu default per template (R6.6). */
export const DEFAULT_PALETTE_ID = 'bright-health';

export default palettes;
