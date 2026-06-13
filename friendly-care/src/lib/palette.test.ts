// palette.test.ts — property-based test resolusi palette & token (lib/palette.ts,
// palettes.ts).
//
// Feature: nakespro-landing-templates, Property 9: Resolusi palette — preset
// valid atau fallback default dengan peringatan.
// Validates: Requirements 6.5, 6.7
//
// Feature: nakespro-landing-templates, Property 10: Semua preset palette
// mendefinisikan himpunan token yang sama.
// Validates: Requirements 6.2
//
// Feature: nakespro-landing-templates, Property 11: Setiap preset memenuhi
// kontras WCAG AA.
// Validates: Requirements 6.8, 11.3
//
// Minimal 100 iterasi per property.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import fc from 'fast-check';
import { resolvePalette, type Palette } from './palette.ts';
import palettes, { DEFAULT_PALETTE_ID } from '../palettes.ts';

const RUNS = { numRuns: 100 } as const;
const REQUIRED_TOKENS = ['accent', 'background', 'surface', 'text', 'muted'] as const;

const knownIds = palettes.map((p) => p.id);

/** Hitung relative luminance (WCAG) dari hex #rrggbb. */
function luminance(hex: string): number {
  const m = hex.replace('#', '');
  const r = parseInt(m.slice(0, 2), 16) / 255;
  const g = parseInt(m.slice(2, 4), 16) / 255;
  const b = parseInt(m.slice(4, 6), 16) / 255;
  const lin = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/** Rasio kontras WCAG antara dua warna hex. */
function contrast(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  const [hi, lo] = la >= lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

describe('Property 9: resolusi palette (R6.5, R6.7)', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterEach(() => warnSpy.mockRestore());

  it('id dikenal → kembalikan preset yang cocok tanpa peringatan', () => {
    fc.assert(
      fc.property(fc.constantFrom(...knownIds), (id) => {
        warnSpy.mockClear();
        const result = resolvePalette(palettes, id, DEFAULT_PALETTE_ID);
        expect(result.id).toBe(id);
        expect(warnSpy).not.toHaveBeenCalled();
      }),
      RUNS,
    );
  });

  it('id tak dikenal/kosong → fallback default + peringatan menyebut id', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant(undefined),
          fc.constant(null),
          fc.constant(''),
          fc.string().filter((s) => !knownIds.includes(s.trim()) && s.trim() !== ''),
        ),
        (badId) => {
          warnSpy.mockClear();
          const result = resolvePalette(palettes, badId, DEFAULT_PALETTE_ID);
          expect(result.id).toBe(DEFAULT_PALETTE_ID);
          expect(warnSpy).toHaveBeenCalled();
          // Peringatan menyebut id yang diminta (atau penanda kosong).
          const logged = warnSpy.mock.calls.map((c) => String(c[0])).join(' ');
          const trimmed = typeof badId === 'string' ? badId.trim() : '';
          if (trimmed !== '') {
            expect(logged).toContain(trimmed);
          }
        },
      ),
      RUNS,
    );
  });
});

describe('Property 10: keseragaman token preset (R6.2)', () => {
  it('setiap preset punya himpunan token sama & memuat token wajib', () => {
    fc.assert(
      fc.property(fc.constantFrom(...palettes), (palette: Palette) => {
        const keys = Object.keys(palette.tokens).sort();
        expect(keys).toEqual([...REQUIRED_TOKENS].sort());
      }),
      RUNS,
    );
  });
});

describe('Property 11: kontras WCAG AA tiap preset (R6.8, R11.3)', () => {
  it('text vs background & surface ≥ 4.5:1; accent vs background ≥ 3:1', () => {
    fc.assert(
      fc.property(fc.constantFrom(...palettes), (palette: Palette) => {
        const { text, background, surface, accent } = palette.tokens;
        expect(contrast(text, background)).toBeGreaterThanOrEqual(4.5);
        expect(contrast(text, surface)).toBeGreaterThanOrEqual(4.5);
        expect(contrast(accent, background)).toBeGreaterThanOrEqual(3);
      }),
      RUNS,
    );
  });
});
