// whatsapp.test.ts — property-based test utilitas WhatsApp (lib/whatsapp.ts).
//
// Feature: nakespro-landing-templates, Property 1: Normalisasi nomor WhatsApp
// menjadi digit & kode negara.
// Validates: Requirements 4.2, 3.4
//
// Feature: nakespro-landing-templates, Property 3: Pesan prefill WhatsApp
// dipotong di 1000 karakter.
// Validates: Requirements 4.3
//
// Minimal 100 iterasi per property.
import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import {
  normalizeWaNumber,
  buildWaUrl,
  MAX_WA_MESSAGE_LENGTH,
} from './whatsapp.ts';

const RUNS = { numRuns: 100 } as const;

/**
 * Generator nomor: rangkai digit dengan sisipan simbol `+ - ( ) spasi` dan
 * variasi leading 0 / 62, sehingga menumbuhkan edge case normalisasi (R4.2).
 */
const arbWaNumber = fc
  .tuple(
    fc.constantFrom('', '0', '62', '+62', '+', ' '),
    fc.array(fc.constantFrom('0', '1', '2', '3', '4', '5', '6', '7', '8', '9'), {
      minLength: 0,
      maxLength: 18,
    }),
    fc.array(fc.constantFrom('+', '-', '(', ')', ' '), { maxLength: 6 }),
  )
  .map(([prefix, digits, symbols]) => {
    // Selipkan simbol di antara digit secara longgar.
    const parts: string[] = [prefix];
    digits.forEach((d, i) => {
      parts.push(d);
      if (symbols[i % symbols.length]) parts.push(symbols[i % symbols.length]);
    });
    return parts.join('');
  });

describe('Property 1: normalisasi nomor WhatsApp (R4.2, R3.4)', () => {
  it('hasil hanya berisi digit (tanpa simbol non-digit)', () => {
    fc.assert(
      fc.property(arbWaNumber, (input) => {
        const out = normalizeWaNumber(input);
        expect(out).toMatch(/^[0-9]*$/);
      }),
      RUNS,
    );
  });

  it('leading 0 (setelah dibersihkan) diganti dengan 62', () => {
    fc.assert(
      fc.property(arbWaNumber, (input) => {
        const cleaned = input.replace(/\D/g, '');
        const out = normalizeWaNumber(input);
        if (cleaned.startsWith('0')) {
          expect(out).toBe('62' + cleaned.slice(1));
        } else {
          expect(out).toBe(cleaned);
        }
      }),
      RUNS,
    );
  });

  it('null/undefined menghasilkan string kosong', () => {
    expect(normalizeWaNumber(null)).toBe('');
    expect(normalizeWaNumber(undefined)).toBe('');
  });
});

describe('Property 3: pesan prefill dipotong di 1000 char (R4.3)', () => {
  it('text pada URL adalah prefix pesan asli dengan panjang ≤ 1000', () => {
    fc.assert(
      fc.property(
        arbWaNumber.filter((n) => normalizeWaNumber(n).length >= 8),
        fc.string({ maxLength: 3000 }),
        (number, message) => {
          const url = buildWaUrl(number, message);
          if (message.length === 0) {
            // Tanpa pesan → tanpa query text.
            expect(url).not.toContain('?text=');
            return;
          }
          const expectedRaw = message.slice(0, MAX_WA_MESSAGE_LENGTH);
          // Panjang potongan ≤ 1000 dan merupakan prefix pesan asli.
          expect(expectedRaw.length).toBeLessThanOrEqual(MAX_WA_MESSAGE_LENGTH);
          expect(message.startsWith(expectedRaw)).toBe(true);
          // URL memuat encoding dari prefix tersebut (tidak ada karakter
          // ditambah/diubah, hanya dipotong lalu di-encode).
          const idx = url.indexOf('?text=');
          expect(idx).toBeGreaterThan(-1);
          const encoded = url.slice(idx + '?text='.length);
          expect(decodeURIComponent(encoded)).toBe(expectedRaw);
        },
      ),
      RUNS,
    );
  });
});
