// cross-template.unit.test.ts — konsistensi kontrak & identitas data lintas
// 4 template (Testing Strategy §3, tasks 11.4 & 11.5).
//
// Feature: nakespro-landing-templates, Property 16: Identitas data lintas
// template.
// Validates: Requirements 7.7, 2.14, 13.3
//
// Juga memverifikasi (R1.2, R1.3, R1.6, R1.7):
//   - Tepat 4 folder template dengan id benar.
//   - Tiap template punya 5 artefak wajib.
//   - src/types.ts tiap template identik byte-for-byte dengan shared/types.ts.
//
// Dijalankan dari modern-light (punya test runner). Membaca folder saudara di
// repo root. Property 16 memakai dynamic import tiap content.ts — karena tiap
// template standalone dengan salinan types.ts & lib/ sendiri, impor relatifnya
// resolve di lokasi masing-masing.
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..', '..', '..'); // nakespro-template/

const TEMPLATE_IDS = [
  'modern-light',
  'clean-medical',
  'calm-warm',
  'friendly-care',
] as const;

describe('Struktur 4 template (R1.2, R1.3, R1.4)', () => {
  it('tepat 4 folder template dengan id benar', () => {
    for (const id of TEMPLATE_IDS) {
      const dir = resolve(repoRoot, id);
      expect(existsSync(dir), `folder template ${id} hilang`).toBe(true);
      expect(statSync(dir).isDirectory()).toBe(true);
    }
  });

  it('tiap template punya 5 artefak wajib (R1.3, R1.4)', () => {
    const required: { label: string; rel: string; kind: 'file' | 'dir' }[] = [
      { label: 'package.json', rel: 'package.json', kind: 'file' },
      { label: 'src/content.ts', rel: 'src/content.ts', kind: 'file' },
      { label: 'src/palettes.ts', rel: 'src/palettes.ts', kind: 'file' },
      { label: 'components/', rel: 'src/components', kind: 'dir' },
      { label: 'public/images/', rel: 'public/images', kind: 'dir' },
    ];
    const missing: string[] = [];
    for (const id of TEMPLATE_IDS) {
      for (const r of required) {
        const full = resolve(repoRoot, id, r.rel);
        const ok =
          existsSync(full) &&
          (r.kind === 'dir'
            ? statSync(full).isDirectory()
            : statSync(full).isFile());
        if (!ok) missing.push(`${id}/${r.label}`);
      }
    }
    expect(missing).toEqual([]);
  });
});

describe('Konsistensi tipe lintas template (R1.6, R1.7)', () => {
  const norm = (s: string) => s.replace(/\r\n/g, '\n').trimEnd();

  it('src/types.ts tiap template identik dengan shared/types.ts', () => {
    const shared = norm(
      readFileSync(resolve(repoRoot, 'shared', 'types.ts'), 'utf8'),
    );
    for (const id of TEMPLATE_IDS) {
      const local = norm(
        readFileSync(resolve(repoRoot, id, 'src', 'types.ts'), 'utf8'),
      );
      expect(local, `types.ts drift di ${id}`).toBe(shared);
    }
  });
});

describe('Property 16: identitas data lintas template (R7.7, R2.14, R13.3)', () => {
  it('seluruh field data content.ts identik kecuali template & palette', () => {
    // content.ts saudara berada di project root berbeda sehingga tidak dapat
    // di-dynamic-import (vitest hanya mentransform file di root-nya). Karena
    // setiap content.ts berisi objek SiteContent yang sama persis kecuali baris
    // `template:` dan `palette:` (presentasi), identitas data dibuktikan dengan
    // membandingkan teks file setelah menormalkan kedua baris tersebut.
    const normalize = (src: string) =>
      src
        .replace(/\r\n/g, '\n')
        .replace(/template:\s*'[^']*'/g, "template:'<T>'")
        .replace(/palette:\s*'[^']*'/g, "palette:'<P>'")
        .trimEnd();

    const baseline = normalize(
      readFileSync(resolve(repoRoot, 'modern-light', 'src', 'content.ts'), 'utf8'),
    );
    for (const id of TEMPLATE_IDS) {
      const local = normalize(
        readFileSync(resolve(repoRoot, id, 'src', 'content.ts'), 'utf8'),
      );
      expect(local, `data content.ts berbeda di ${id}`).toBe(baseline);
    }
  });

  it('field template tiap content.ts sesuai folder', () => {
    for (const id of TEMPLATE_IDS) {
      const src = readFileSync(
        resolve(repoRoot, id, 'src', 'content.ts'),
        'utf8',
      );
      const m = src.match(/template:\s*'([^']*)'/);
      expect(m?.[1], `template id salah di ${id}`).toBe(id);
    }
  });
});
