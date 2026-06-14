// validate.test.ts — property-based test validator bounds (lib/validate.ts).
//
// Feature: nakespro-landing-templates, Property 15: Validator bounds menerima
// konten valid dan menolak pelanggaran.
// Validates: Requirements 2.3, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10, 2.11, 2.12
//
// Minimal 100 iterasi. arbValidContent menghasilkan SiteContent dalam batas;
// pelanggaran tepat satu bound harus dilempar dengan menyebut field.
import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import {
  assertSiteContent,
  SiteContentValidationError,
  BOUNDS,
} from './validate.ts';
import type { SiteContent } from '../types.ts';

const RUNS = { numRuns: 100 } as const;

/** String dengan panjang persis n (karakter non-whitespace). */
function strOfLen(n: number): string {
  return 'a'.repeat(n);
}

/** Generator SiteContent valid (seluruh field dalam batas). */
const arbValidContent: fc.Arbitrary<SiteContent> = fc.record({
  template: fc.constant('modern-light' as const),
  palette: fc.constant('neutral'),
  websiteName: fc
    .integer({ min: BOUNDS.websiteName.min, max: BOUNDS.websiteName.max })
    .map(strOfLen),
  description: fc
    .integer({ min: BOUNDS.description.min, max: BOUNDS.description.max })
    .map(strOfLen),
  serviceType: fc.constantFrom('nakes' as const, 'homecare' as const, 'both' as const),
  waNumber: fc.constant('081234567890'),
  credentials: fc.array(
    fc.record({ label: fc.string(), icon: fc.string() }),
    { maxLength: BOUNDS.credentials.max },
  ),
  services: fc.array(
    fc.record({ title: fc.string(), description: fc.string() }),
    { maxLength: BOUNDS.services.max },
  ),
  howItWorks: fc.array(
    fc.record({
      step: fc.integer({ min: 1, max: 100 }),
      title: fc.string(),
      description: fc.string(),
    }),
    { maxLength: BOUNDS.howItWorks.max },
  ),
  testimonials: fc.array(
    fc.record({ name: fc.string(), text: fc.string() }),
    { maxLength: BOUNDS.testimonials.max },
  ),
});

describe('Property 15: validator bounds (R2.3, R2.5–R2.12)', () => {
  it('menerima konten valid tanpa error', () => {
    fc.assert(
      fc.property(arbValidContent, (content) => {
        expect(() => assertSiteContent(content)).not.toThrow();
      }),
      RUNS,
    );
  });

  it('menolak websiteName melebihi 100 char menyebut field', () => {
    fc.assert(
      fc.property(
        arbValidContent,
        fc.integer({ min: BOUNDS.websiteName.max + 1, max: 300 }),
        (content, len) => {
          const bad = { ...content, websiteName: strOfLen(len) };
          expect(() => assertSiteContent(bad)).toThrow(SiteContentValidationError);
          try {
            assertSiteContent(bad);
          } catch (e) {
            expect((e as SiteContentValidationError).field).toBe('websiteName');
          }
        },
      ),
      RUNS,
    );
  });

  it('menolak credentials melebihi 12 entri', () => {
    fc.assert(
      fc.property(
        arbValidContent,
        fc.integer({ min: BOUNDS.credentials.max + 1, max: 30 }),
        (content, n) => {
          const bad = {
            ...content,
            credentials: Array.from({ length: n }, () => ({ label: 'x', icon: 'y' })),
          };
          expect(() => assertSiteContent(bad)).toThrow(/credentials/);
        },
      ),
      RUNS,
    );
  });

  it('menolak howItWorks.step non-integer / non-positif', () => {
    fc.assert(
      fc.property(
        arbValidContent,
        fc.oneof(
          fc.integer({ min: -50, max: 0 }),
          fc.double({ min: 0.1, max: 5, noNaN: true }).filter((x) => !Number.isInteger(x)),
        ),
        (content, badStep) => {
          const bad = {
            ...content,
            howItWorks: [{ step: badStep, title: 't', description: 'd' }],
          };
          expect(() => assertSiteContent(bad)).toThrow(/step/);
        },
      ),
      RUNS,
    );
  });

  it('menolak photo url kosong menyebut field', () => {
    fc.assert(
      fc.property(
        arbValidContent,
        fc.constantFrom('', '   ', '\t'),
        (content, emptyUrl) => {
          const bad = {
            ...content,
            photos: [{ url: emptyUrl }],
          };
          expect(() => assertSiteContent(bad)).toThrow(/url/);
        },
      ),
      RUNS,
    );
  });
});
