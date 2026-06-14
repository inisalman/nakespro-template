// test/helpers.ts — utilitas bersama untuk render & generator test.
//
// Menyediakan:
//   - renderPage(content): merender index page lewat Container API ke HTML.
//     Karena index.astro mengimpor content.ts statis, kita merender komposisi
//     section yang setara (PageUnderTest.astro) dengan content yang di-inject
//     via props — sehingga input SiteContent dapat divariasikan oleh PBT.
//   - arbSiteContent: generator fast-check SiteContent dengan field opsional
//     bisa kosong/terisi (whitespace, list 0–N, kategori foto sebagian kosong)
//     untuk menumbuhkan edge case Auto-Hide & urutan (R7.x).
//
// Foto yang di-generate memakai nama berkas yang BENAR-BENAR ada di
// public/images/ agar tidak memicu MissingPhotoError saat render.

import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import fc from 'fast-check';
import type {
  Credential,
  HowItWorksStep,
  Photo,
  Service,
  SiteContent,
  Testimonial,
} from '../types.ts';
import PageUnderTest from './PageUnderTest.astro';

/** Nama berkas foto yang tersedia di public/images/ (lihat content.ts). */
export const AVAILABLE_PHOTOS = [
  'nakes-1.webp',
  'nakes-2.webp',
  'ruangan-1.webp',
  'ruangan-2.webp',
  'alat-1.webp',
  'alat-2.webp',
  'hasil-1.webp',
  'hasil-2.webp',
] as const;

/** Render komposisi 9 section + FloatingWhatsApp untuk sebuah SiteContent. */
export async function renderPage(content: SiteContent): Promise<string> {
  const container = await AstroContainer.create();
  return container.renderToString(PageUnderTest, { props: { content } });
}

// — Generator field —

/** String yang mungkin whitespace-only (untuk menguji deteksi kosong). */
const arbMaybeBlank = fc.oneof(
  fc.constant(undefined),
  fc.constant(''),
  fc.constant('   '),
  fc.string({ minLength: 1, maxLength: 40 }).filter((s) => s.trim().length > 0),
);

const arbCredential: fc.Arbitrary<Credential> = fc.record({
  label: fc.string({ minLength: 1, maxLength: 30 }).map((s) => `Cred ${s}`),
  icon: fc.constantFrom('🩺', '🏅', '📋', '🤝'),
});

const arbService: fc.Arbitrary<Service> = fc.record({
  title: fc.string({ minLength: 1, maxLength: 30 }).map((s) => `Svc ${s}`),
  description: fc.string({ minLength: 1, maxLength: 60 }).map((s) => `Desc ${s}`),
});

const arbStep: fc.Arbitrary<HowItWorksStep> = fc.record({
  step: fc.integer({ min: 1, max: 10 }),
  title: fc.string({ minLength: 1, maxLength: 30 }).map((s) => `Step ${s}`),
  description: fc.string({ minLength: 1, maxLength: 60 }).map((s) => `SDesc ${s}`),
});

const arbTestimonial: fc.Arbitrary<Testimonial> = fc.record({
  name: fc.string({ minLength: 1, maxLength: 20 }).map((s) => `Name ${s}`),
  text: fc.string({ minLength: 1, maxLength: 80 }).map((s) => `Quote ${s}`),
});

/** Foto dengan url yang dijamin tersedia. */
const arbPhoto = fc.record({
  url: fc.constantFrom(...AVAILABLE_PHOTOS),
  caption: fc.option(fc.string({ minLength: 1, maxLength: 30 }), { nil: undefined }),
});

/** Galeri foto tunggal 0–6 foto (boleh kosong untuk menguji Auto-Hide). */
const arbPhotos: fc.Arbitrary<Photo[]> = fc.array(arbPhoto, { maxLength: 6 });

/**
 * Generator SiteContent acak. Field wajib selalu terisi & valid; field
 * opsional bisa kosong/undefined/terisi untuk menumbuhkan Auto-Hide.
 */
export const arbSiteContent: fc.Arbitrary<SiteContent> = fc.record({
  template: fc.constant('modern-light' as const),
  palette: fc.constantFrom('neutral', 'slate', 'graphite', 'unknown-id', ''),
  websiteName: fc
    .string({ minLength: 1, maxLength: 40 })
    .map((s) => `Klinik ${s}`.slice(0, 100)),
  description: fc
    .string({ minLength: 1, maxLength: 80 })
    .map((s) => `Layanan ${s}`.slice(0, 500)),
  serviceType: fc.constantFrom('nakes' as const, 'homecare' as const, 'both' as const),
  waNumber: fc.constantFrom('081234567890', '6281234567890', '123', '', '+62 812-3456-7890'),
  practiceHours: arbMaybeBlank,
  location: arbMaybeBlank,
  googleMaps: fc.oneof(
    fc.constant(undefined),
    fc.constant(''),
    fc.constant('https://maps.example/embed'),
  ),
  photos: fc.option(arbPhotos, { nil: undefined }),
  heroPhoto: fc.option(arbPhoto, { nil: undefined }),
  tagline: arbMaybeBlank,
  about: arbMaybeBlank,
  credentials: fc.option(fc.array(arbCredential, { maxLength: 5 }), { nil: undefined }),
  services: fc.option(fc.array(arbService, { maxLength: 5 }), { nil: undefined }),
  howItWorks: fc.option(fc.array(arbStep, { maxLength: 4 }), { nil: undefined }),
  testimonials: fc.option(fc.array(arbTestimonial, { maxLength: 5 }), { nil: undefined }),
  waMessage: fc.option(fc.string({ maxLength: 50 }), { nil: undefined }),
});
