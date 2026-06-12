// @ts-check
import { defineConfig } from 'astro/config';

// Standalone Astro v5 static site (Reference_Template: modern-light).
// - output: 'static' menghasilkan HTML/CSS/aset tanpa Node runtime per-site (R1.5, R10.4).
// - astro:assets adalah integrasi gambar bawaan Astro v5 (WebP/AVIF, width/height eksplisit,
//   lazy-loading) yang diaktifkan lewat image service `sharp` (R10.8).
export default defineConfig({
  output: 'static',
  image: {
    // Image service bawaan astro:assets (optimasi gambar lokal di build time).
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
});
