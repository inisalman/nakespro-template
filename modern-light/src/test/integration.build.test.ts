// integration.build.test.ts — integration build test (Testing Strategy §4).
//
// Validates (R1.5, R1.8, R8.1, R8.3, R8.5, R9.1, R9.2, R9.4, R10.4):
//   - Copy folder template + shared/ ke lokasi terisolasi lalu `astro build`
//     menghasilkan dist/ statis tanpa server entry.
//   - 9 section build tanpa error untuk setiap preset.
//   - Build GAGAL (exit non-zero, menyebut field) pada content.ts invalid,
//     tanpa menyentuh dist/ lama.
//
// Test ini berat (menjalankan astro build di subprocess). Dijalankan dengan
// timeout longgar. Memakai folder sementara di os.tmpdir().
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { execFileSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const templateRoot = resolve(here, '..', '..'); // modern-light/
const repoRoot = resolve(templateRoot, '..'); // nakespro-template/

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

let workDir: string;
let templateCopy: string;

/** Jalankan `npm run build` di dir; kembalikan {code, output}. */
function runBuild(cwd: string): { code: number; output: string } {
  try {
    const out = execFileSync(npmCmd, ['run', 'build'], {
      cwd,
      encoding: 'utf8',
      stdio: 'pipe',
      timeout: 180000,
      // Windows: spawn .cmd butuh shell.
      shell: process.platform === 'win32',
    });
    return { code: 0, output: out };
  } catch (e: any) {
    const output = `${e.stdout ?? ''}\n${e.stderr ?? ''}`;
    return { code: e.status ?? 1, output };
  }
}

beforeAll(() => {
  workDir = mkdtempSync(join(tmpdir(), 'nakespro-build-'));
  templateCopy = join(workDir, 'modern-light');
  // Copy template tanpa node_modules & dist; lalu symlink/junction node_modules
  // dari sumber agar tidak perlu install ulang (cepat). Standalone tetap
  // terjaga karena shared/ ikut disalin.
  cpSync(templateRoot, templateCopy, {
    recursive: true,
    filter: (src) =>
      !src.includes(`${'node_modules'}`) && !/[\\/]dist([\\/]|$)/.test(src),
  });
  // Sertakan shared/ relatif sama (R1.8: copy template + shared).
  cpSync(resolve(repoRoot, 'shared'), join(workDir, 'shared'), {
    recursive: true,
  });
  // Sediakan dependency: reuse node_modules sumber via junction (Windows) atau
  // symlink. Bila gagal, fallback ke install.
  const srcModules = resolve(templateRoot, 'node_modules');
  const dstModules = join(templateCopy, 'node_modules');
  try {
    symlinkSync(srcModules, dstModules, process.platform === 'win32' ? 'junction' : 'dir');
  } catch {
    execFileSync(npmCmd, ['install'], {
      cwd: templateCopy,
      stdio: 'pipe',
      timeout: 300000,
      shell: process.platform === 'win32',
    });
  }
}, 360000);

afterAll(() => {
  if (workDir && existsSync(workDir)) {
    rmSync(workDir, { recursive: true, force: true });
  }
});

describe('Integration build (R1.5, R1.8, R8.1, R8.3, R10.4)', () => {
  it('build sukses → dist/ statis tanpa server entry, 9 section', () => {
    const { code, output } = runBuild(templateCopy);
    expect(code, output).toBe(0);

    const dist = join(templateCopy, 'dist');
    expect(existsSync(join(dist, 'index.html'))).toBe(true);

    // Tidak ada server entry (output statis). Astro SSR menulis dist/server/
    // & entry.mjs; static tidak.
    expect(existsSync(join(dist, 'server'))).toBe(false);
    expect(existsSync(join(dist, 'entry.mjs'))).toBe(false);

    // Zero-JS (R10.1): tidak ada JS yang DIKIRIM ke browser. Astro 5 menulis
    // content-assets.mjs / content-modules.mjs di root dist sebagai artefak
    // build (tidak direferensikan HTML, tidak dilayani) — yang relevan adalah
    // tidak ada <script src> di HTML dan tidak ada .js di _astro/ (client dir).
    const clientJs: string[] = [];
    const astroDir = join(dist, '_astro');
    if (existsSync(astroDir)) {
      const walkJs = (d: string) => {
        for (const e of readdirSync(d, { withFileTypes: true })) {
          const full = join(d, e.name);
          if (e.isDirectory()) walkJs(full);
          else if (e.name.endsWith('.js') || e.name.endsWith('.mjs')) clientJs.push(full);
        }
      };
      walkJs(astroDir);
    }
    expect(clientJs, `unexpected client JS: ${clientJs.join(', ')}`).toHaveLength(0);

    // 9 section: heading marker section auto-hide + hero + footer hadir di HTML
    // (konten dummy mengisi semua section).
    const html = readFileSync(join(dist, 'index.html'), 'utf8');
    // Tidak ada <script src> (modul JS) yang dikirim ke browser (R10.1).
    expect(/<script\b[^>]*\bsrc=/.test(html)).toBe(false);
    for (const id of [
      'hero-h',
      'trustbar-h',
      'services-h',
      'about-h',
      'gallery-h',
      'how-h',
      'testimonials-h',
      'contact-h',
    ]) {
      expect(html, `section ${id} hilang`).toContain(`id="${id}"`);
    }
    expect(html).toContain('Powered by NakesPro');
  }, 240000);

  it('build untuk setiap preset palette tanpa error (R9.4)', () => {
    const contentPath = join(templateCopy, 'src', 'content.ts');
    const original = readFileSync(contentPath, 'utf8');
    try {
      for (const preset of ['neutral', 'slate', 'graphite']) {
        const swapped = original.replace(
          /palette:\s*'[^']*'/,
          `palette: '${preset}'`,
        );
        writeFileSync(contentPath, swapped);
        const { code, output } = runBuild(templateCopy);
        expect(code, `preset ${preset}: ${output}`).toBe(0);
      }
    } finally {
      writeFileSync(contentPath, original);
    }
  }, 240000);

  it('content.ts invalid → build gagal (exit non-zero, menyebut field), dist/ lama utuh (R8.5)', () => {
    // Pastikan ada dist/ valid lebih dulu.
    runBuild(templateCopy);
    const distIndex = join(templateCopy, 'dist', 'index.html');
    expect(existsSync(distIndex)).toBe(true);
    const beforeHtml = readFileSync(distIndex, 'utf8');

    const contentPath = join(templateCopy, 'src', 'content.ts');
    const original = readFileSync(contentPath, 'utf8');
    try {
      // Langgar bound websiteName (>100 char) → assertSiteContent melempar.
      const invalid = original.replace(
        /websiteName:\s*'[^']*'/,
        `websiteName: '${'x'.repeat(150)}'`,
      );
      writeFileSync(contentPath, invalid);
      const { code, output } = runBuild(templateCopy);
      expect(code).not.toBe(0);
      expect(output).toContain('websiteName');
      // dist/ lama tidak dimodifikasi.
      const afterHtml = readFileSync(distIndex, 'utf8');
      expect(afterHtml).toBe(beforeHtml);
    } finally {
      writeFileSync(contentPath, original);
    }
  }, 240000);
});
