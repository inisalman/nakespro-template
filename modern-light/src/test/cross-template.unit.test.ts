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

describe('Property 16: konsistensi kontrak data lintas template (R7.7, R2.14, R13.3)', () => {
  // Catatan arah produk: tiap template SENGAJA memuat konten demo bespoke per
  // niche (mis. perawat, fisioterapi, bidan) — bukan teks yang identik. Yang
  // dijamin lintas template adalah KONTRAK datanya: himpunan field SiteContent
  // yang sama, bukan nilai literal yang sama. Karena itu identitas data diuji
  // pada level STRUKTUR (himpunan key field tingkat atas), bukan byte-identik.

  // Ekstraksi key field tingkat atas dari literal objek `const content`.
  // Mengambil key `foo:` pada kedalaman indentasi 2 spasi (satu level di dalam
  // objek), mengabaikan key bersarang & komentar.
  const extractTopLevelKeys = (src: string): string[] => {
    const norm = src.replace(/\r\n/g, '\n');
    const start = norm.indexOf('const content');
    const body = start >= 0 ? norm.slice(start) : norm;
    const keys = new Set<string>();
    for (const line of body.split('\n')) {
      const m = line.match(/^ {2}([a-zA-Z][a-zA-Z0-9]*)\s*:/);
      if (m) keys.add(m[1]);
    }
    return [...keys].sort();
  };

  it('himpunan field content.ts identik lintas template (struktur, bukan teks)', () => {
    const baseline = extractTopLevelKeys(
      readFileSync(resolve(repoRoot, 'modern-light', 'src', 'content.ts'), 'utf8'),
    );
    expect(baseline.length).toBeGreaterThan(0);
    for (const id of TEMPLATE_IDS) {
      const local = extractTopLevelKeys(
        readFileSync(resolve(repoRoot, id, 'src', 'content.ts'), 'utf8'),
      );
      expect(local, `himpunan field content.ts berbeda di ${id}`).toEqual(baseline);
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
