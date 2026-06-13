// empty.test.ts — property-based test deteksi "kosong" (lib/empty.ts).
//
// Feature: nakespro-landing-templates, Property 4: Deteksi "kosong" sesuai
// definisi kontrak.
// Validates: Requirements 5.2
//
// isEmptyText true tepat ketika undefined/null/whitespace-only; isEmptyList
// true tepat ketika undefined/null/0 entri. Minimal 100 iterasi.
import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { isEmptyText, isEmptyList } from './empty.ts';

const RUNS = { numRuns: 100 } as const;

describe('Property 4: deteksi kosong sesuai kontrak (R5.2)', () => {
  it('isEmptyText: true iff undefined/null/whitespace-only', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant(undefined),
          fc.constant(null),
          fc.string(),
          // String yang dijamin whitespace-only.
          fc
            .array(fc.constantFrom(' ', '\t', '\n', '\r', '\f', '\v'))
            .map((cs) => cs.join('')),
        ),
        (value) => {
          const expected =
            value === undefined ||
            value === null ||
            value.trim().length === 0;
          expect(isEmptyText(value as string | null | undefined)).toBe(expected);
        },
      ),
      RUNS,
    );
  });

  it('isEmptyText: false untuk string dengan minimal satu non-whitespace', () => {
    fc.assert(
      fc.property(
        fc.string().filter((s) => s.trim().length > 0),
        (value) => {
          expect(isEmptyText(value)).toBe(false);
        },
      ),
      RUNS,
    );
  });

  it('isEmptyList: true iff undefined/null/0 entri', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant(undefined),
          fc.constant(null),
          fc.array(fc.anything()),
        ),
        (value) => {
          const expected =
            value === undefined || value === null || value.length === 0;
          expect(isEmptyList(value as unknown[] | null | undefined)).toBe(
            expected,
          );
        },
      ),
      RUNS,
    );
  });
});
