// discipline.unit.test.ts — static check disiplin komponen (Testing Strategy §3).
//
// Validates:
//   - Komponen .astro tidak memuat warna literal; hanya var(--token) (R6.4).
//   - Tidak ada konten client di-hardcode (heuristik): teks panjang berbahasa
//     pengguna hanya boleh dari content.ts (R13.1) — dicek via tidak adanya
//     literal hex/rgb di style komponen + tidak ada placeholder lorem/TODO/TBD.
//   - Tidak ada 'lorem/TODO/TBD' di seluruh src/ modern-light (R9.3).
import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, relative } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const templateRoot = resolve(here, '..', '..');
const srcDir = resolve(templateRoot, 'src');
const componentsDir = resolve(srcDir, 'components');

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = resolve(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

/** Buang blok komentar /* *​/ dan // agar literal di komentar tidak false-positive. */
function stripComments(code: string): string {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');
}

const COLOR_LITERAL =
  /#[0-9a-fA-F]{3,8}\b|\brgb\(|\brgba\(|\bhsl\(|\bhsla\(/;

describe('Disiplin warna komponen (R6.4)', () => {
  // BaseLayout (layouts/) adalah lapisan definisi token: ia meng-inject CSS
  // var palette dan mendefinisikan design token global (mis. --shadow). R6.4
  // mensyaratkan KOMPONEN hanya mereferensikan var(--token), bukan literal —
  // jadi pemeriksaan literal dibatasi pada components/.
  const astroFiles = walk(componentsDir).filter((f) => f.endsWith('.astro'));

  it('ditemukan komponen .astro untuk diperiksa', () => {
    expect(astroFiles.length).toBeGreaterThan(0);
  });

  for (const file of walk(componentsDir).filter((f) => f.endsWith('.astro'))) {
    const rel = relative(templateRoot, file);
    it(`tanpa warna literal: ${rel}`, () => {
      const code = stripComments(readFileSync(file, 'utf8'));
      const match = code.match(COLOR_LITERAL);
      expect(match, `warna literal "${match?.[0]}" ditemukan di ${rel}`).toBeNull();
    });
  }
});

describe('Tanpa placeholder lorem/TODO/TBD (R9.3)', () => {
  for (const file of walk(srcDir).filter(
    (f) =>
      /\.(astro|ts)$/.test(f) &&
      !/\.(test|spec)\.ts$/.test(f) &&
      !f.includes(`${'/test/'}`) &&
      !f.includes(`\\test\\`),
  )) {
    const rel = relative(templateRoot, file);
    it(`tanpa lorem/TODO/TBD: ${rel}`, () => {
      const code = stripComments(readFileSync(file, 'utf8'));
      expect(/lorem ipsum/i.test(code), `lorem di ${rel}`).toBe(false);
      expect(/\bTODO\b/.test(code), `TODO di ${rel}`).toBe(false);
      expect(/\bTBD\b/.test(code), `TBD di ${rel}`).toBe(false);
    });
  }
});
