// contract.unit.test.ts — konsistensi kontrak & struktur (Testing Strategy §3).
//
// Validates:
//   - src/types.ts identik dengan shared/types.ts (R1.6, R1.7) — drift gagal.
//   - 5 artefak struktural wajib ada (R1.3, R1.4): package.json,
//     src/content.ts, src/palettes.ts, components/, public/images/.
import { describe, expect, it } from 'vitest';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const templateRoot = resolve(here, '..', '..'); // modern-light/
const repoRoot = resolve(templateRoot, '..'); // nakespro-template/

describe('Konsistensi kontrak tipe (R1.6, R1.7)', () => {
  it('src/types.ts identik byte-for-byte dengan shared/types.ts', () => {
    const shared = readFileSync(resolve(repoRoot, 'shared', 'types.ts'), 'utf8');
    const local = readFileSync(resolve(templateRoot, 'src', 'types.ts'), 'utf8');
    // Normalisasi newline agar tidak terganggu CRLF/LF antar-OS.
    const norm = (s: string) => s.replace(/\r\n/g, '\n').trimEnd();
    expect(norm(local)).toBe(norm(shared));
  });
});

describe('Artefak struktural wajib (R1.3, R1.4)', () => {
  const required: { label: string; path: string; kind: 'file' | 'dir' }[] = [
    { label: 'package.json', path: 'package.json', kind: 'file' },
    { label: 'src/content.ts', path: 'src/content.ts', kind: 'file' },
    { label: 'src/palettes.ts', path: 'src/palettes.ts', kind: 'file' },
    { label: 'components/', path: 'src/components', kind: 'dir' },
    { label: 'public/images/', path: 'public/images', kind: 'dir' },
  ];

  it('kelima artefak wajib ada; laporkan yang hilang', () => {
    const missing = required.filter((r) => {
      const full = resolve(templateRoot, r.path);
      if (!existsSync(full)) return true;
      const st = statSync(full);
      return r.kind === 'dir' ? !st.isDirectory() : !st.isFile();
    });
    expect(missing.map((m) => m.label)).toEqual([]);
  });
});
