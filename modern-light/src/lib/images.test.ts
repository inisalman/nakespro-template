// images.test.ts — property-based test teks alternatif gambar (lib/images.ts).
//
// Feature: nakespro-landing-templates, Property 12: Teks alternatif gambar
// selalu bermakna.
// Validates: Requirements 11.1
//
// resolveAltText memakai caption bila tidak kosong; bila kosong, alt default
// deskriptif tidak kosong 1–125 char. Minimal 100 iterasi.
import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import {
  resolveAltText,
  DEFAULT_ALT_TEXT,
  MAX_DEFAULT_ALT_LENGTH,
} from './images.ts';
import { isEmptyText } from './empty.ts';
import type { Photo } from '../types.ts';

const RUNS = { numRuns: 100 } as const;

describe('Property 12: teks alternatif gambar bermakna (R11.1)', () => {
  it('selalu mengembalikan string tidak kosong 1–125 char saat caption kosong', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant(undefined),
          fc.constant(''),
          fc
            .array(fc.constantFrom(' ', '\t', '\n'))
            .map((cs) => cs.join('')),
        ),
        (caption) => {
          const photo: Photo = { url: 'foto.webp', caption: caption as string };
          const alt = resolveAltText(photo);
          expect(alt).toBe(DEFAULT_ALT_TEXT);
          expect(alt.length).toBeGreaterThanOrEqual(1);
          expect(alt.length).toBeLessThanOrEqual(MAX_DEFAULT_ALT_LENGTH);
        },
      ),
      RUNS,
    );
  });

  it('memakai caption (trimmed) bila tidak kosong', () => {
    fc.assert(
      fc.property(
        fc.string().filter((s) => !isEmptyText(s)),
        (caption) => {
          const photo: Photo = { url: 'foto.webp', caption };
          expect(resolveAltText(photo)).toBe(caption.trim());
        },
      ),
      RUNS,
    );
  });

  it('alt default selalu tidak kosong dan ≤125 char', () => {
    expect(DEFAULT_ALT_TEXT.trim().length).toBeGreaterThanOrEqual(1);
    expect(DEFAULT_ALT_TEXT.length).toBeLessThanOrEqual(MAX_DEFAULT_ALT_LENGTH);
  });
});
