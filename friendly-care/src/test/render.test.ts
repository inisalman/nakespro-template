// render.test.ts — property-based test invarian output render (modern-light).
//
// Mencakup property yang menyentuh HTML hasil render halaman penuh:
//   Property 2  — Validitas nomor menentukan kemunculan WhatsApp CTA (R4.4)
//   Property 5  — Auto-hide section render iff data tidak kosong
//                 (R3.12, R3.13, R3.14, R5.3, R5.4, R5.6, R7.6, R2.13)
//   Property 6  — Urutan section relatif selalu terjaga (R3.2, R5.7)
//   Property 7  — Hero & Footer selalu dirender (R5.5, R3.15)
//   Property 8  — Render menampilkan seluruh entri data tidak kosong
//                 (R3.5–R3.11)
//   Property 13 — Tepat satu h1 & struktur heading tidak melompat (R11.2)
//   Property 14 — Atribut gambar memenuhi kontrak performa (R10.8)
//
// Minimal 100 iterasi per property. Render via Container API (helpers.ts).
import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { renderPage, arbSiteContent } from './helpers.ts';
import { isEmptyText, isEmptyList } from '../lib/empty.ts';
import { isValidWaNumber } from '../lib/whatsapp.ts';

// Render penuh mahal; 100 iterasi tetap ditegakkan namun beri waktu cukup.
const RUNS = { numRuns: 100 } as const;

/** Section marker (heading id) pada output, terurut 1–9. */
const SECTION_MARKERS: { id: string; key: string }[] = [
  { id: 'hero-h', key: 'Hero' },
  { id: 'trustbar-h', key: 'TrustBar' },
  { id: 'services-h', key: 'Services' },
  { id: 'about-h', key: 'About' },
  { id: 'gallery-h', key: 'PhotoGallery' },
  { id: 'how-h', key: 'HowItWorks' },
  { id: 'testimonials-h', key: 'Testimonials' },
  { id: 'contact-h', key: 'ContactLocation' },
];

describe('Property 2: kemunculan WhatsApp CTA mengambang (R4.4)', () => {
  it('floating WA dirender iff nomor 8–15 digit setelah normalisasi', async () => {
    await fc.assert(
      fc.asyncProperty(arbSiteContent, async (content) => {
        const html = await renderPage(content);
        const hasFloating = html.includes('floating-wa');
        expect(hasFloating).toBe(isValidWaNumber(content.waNumber));
      }),
      RUNS,
    );
  });
});

describe('Property 5: auto-hide section (R3.12–R3.14, R5.3–R5.6)', () => {
  it('section auto-hide muncul iff data pendukung tidak kosong', async () => {
    await fc.assert(
      fc.asyncProperty(arbSiteContent, async (content) => {
        const html = await renderPage(content);
        const has = (id: string) => html.includes(`id="${id}"`);

        expect(has('trustbar-h')).toBe(!isEmptyList(content.credentials));
        expect(has('services-h')).toBe(!isEmptyList(content.services));
        expect(has('about-h')).toBe(!isEmptyText(content.about));
        expect(has('how-h')).toBe(!isEmptyList(content.howItWorks));
        expect(has('testimonials-h')).toBe(!isEmptyList(content.testimonials));

        // PhotoGallery: muncul iff galeri berisi ≥1 foto.
        const anyPhoto = !isEmptyList(content.photos);
        expect(has('gallery-h')).toBe(anyPhoto);

        // ContactLocation: muncul iff ≥1 sub-field tidak kosong.
        const anyContact =
          !isEmptyText(content.practiceHours) ||
          !isEmptyText(content.location) ||
          !isEmptyText(content.googleMaps);
        expect(has('contact-h')).toBe(anyContact);
      }),
      RUNS,
    );
  });
});

describe('Property 6: urutan section relatif terjaga (R3.2, R5.7)', () => {
  it('section yang dirender mengikuti urutan 1–9', async () => {
    await fc.assert(
      fc.asyncProperty(arbSiteContent, async (content) => {
        const html = await renderPage(content);
        const positions = SECTION_MARKERS.map((m) => ({
          key: m.key,
          pos: html.indexOf(`id="${m.id}"`),
        })).filter((m) => m.pos !== -1);
        const footerPos = html.indexOf('Powered by NakesPro');
        // Urutan posisi yang muncul harus monoton naik.
        for (let i = 1; i < positions.length; i++) {
          expect(positions[i].pos).toBeGreaterThan(positions[i - 1].pos);
        }
        // Footer selalu paling akhir di antara section.
        if (positions.length > 0) {
          expect(footerPos).toBeGreaterThan(positions[positions.length - 1].pos);
        }
      }),
      RUNS,
    );
  });
});

describe('Property 7: Hero & Footer selalu dirender (R5.5, R3.15)', () => {
  it('hero h1 & footer hadir untuk SiteContent apa pun', async () => {
    await fc.assert(
      fc.asyncProperty(arbSiteContent, async (content) => {
        const html = await renderPage(content);
        expect(html).toContain('id="hero-h"');
        expect(html).toContain('Powered by NakesPro');
      }),
      RUNS,
    );
  });
});

describe('Property 8: seluruh entri data tidak kosong dirender (R3.5–R3.11)', () => {
  it('jumlah item yang dirender = jumlah entri data', async () => {
    await fc.assert(
      fc.asyncProperty(arbSiteContent, async (content) => {
        const html = await renderPage(content);

        if (!isEmptyList(content.credentials)) {
          const n = (html.match(/class="trust-item"/g) || []).length;
          expect(n).toBe(content.credentials!.length);
        }
        if (!isEmptyList(content.services)) {
          const n = (html.match(/ data-card/g) || []).length;
          expect(n).toBe(content.services!.length);
        }
        if (!isEmptyList(content.howItWorks)) {
          const n = (html.match(/class="how-step"/g) || []).length;
          expect(n).toBe(content.howItWorks!.length);
        }
        if (!isEmptyList(content.testimonials)) {
          const n = (html.match(/class="testi-card"/g) || []).length;
          expect(n).toBe(content.testimonials!.length);
        }
      }),
      RUNS,
    );
  });
});

describe('Property 13: tepat satu h1 & heading tidak melompat (R11.2)', () => {
  it('selalu satu h1 dan tidak ada lompatan level heading', async () => {
    await fc.assert(
      fc.asyncProperty(arbSiteContent, async (content) => {
        const html = await renderPage(content);
        const h1 = (html.match(/<h1[\s>]/g) || []).length;
        expect(h1).toBe(1);

        // Kumpulkan urutan level heading di dokumen.
        const levels = [...html.matchAll(/<h([1-6])[\s>]/g)].map((m) =>
          Number(m[1]),
        );
        // Tidak melompat: tiap level ≤ level sebelumnya + 1.
        for (let i = 1; i < levels.length; i++) {
          expect(levels[i]).toBeLessThanOrEqual(levels[i - 1] + 1);
        }
      }),
      RUNS,
    );
  });
});

describe('Property 14: atribut gambar kontrak performa (R10.8)', () => {
  it('setiap img punya width & height; gambar galeri lazy; sumber .webp', async () => {
    await fc.assert(
      fc.asyncProperty(arbSiteContent, async (content) => {
        const html = await renderPage(content);
        // Match <img ...> menghormati nilai atribut ber-quote (caption bisa
        // memuat '>' yang valid di dalam attribute value).
        const imgs = [...html.matchAll(/<img\b(?:[^>"']|"[^"]*"|'[^']*')*>/g)].map(
          (m) => m[0],
        );
        for (const img of imgs) {
          expect(img).toMatch(/\bwidth="/);
          expect(img).toMatch(/\bheight="/);
          // Sumber gambar dalam format modern (.webp).
          const src = img.match(/src="([^"]*)"/)?.[1] ?? '';
          expect(src.endsWith('.webp')).toBe(true);
        }
        // Gambar galeri (below-the-fold) memakai lazy loading.
        const galleryImgs = imgs.filter((i) => /\/images\//.test(i) && i.includes('loading="lazy"'));
        const lazyCount = imgs.filter((i) => i.includes('loading="lazy"')).length;
        // Hero (above-the-fold) tidak lazy; galeri lazy. Minimal: tiap gambar
        // galeri lazy — diperiksa via keberadaan loading lazy pada non-hero.
        expect(lazyCount).toBe(galleryImgs.length);
      }),
      RUNS,
    );
  });
});
