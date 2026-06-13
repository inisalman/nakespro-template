/// <reference types="vitest/config" />
// vitest.config.ts — konfigurasi test untuk modern-light.
//
// Memakai `getViteConfig` dari Astro agar test dapat mengimpor modul `.astro`
// dan memakai Container API (`astro/container`) untuk merender komponen ke
// string pada property/unit test render (Testing Strategy §1–§2). Berlaku juga
// untuk test utilitas murni (lib/) dan validator.
//
// Catatan kompatibilitas: butuh vitest ≥3 (Vite 6) agar selaras dengan Vite
// yang dibundel Astro v5; vitest 2 (Vite 5) menyebabkan error opaque.
//
// Minimal 100 iterasi per property test ditegakkan di tiap test via opsi
// fast-check `{ numRuns: 100 }`.
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.{test,spec}.ts'],
    testTimeout: 30000,
  },
});
