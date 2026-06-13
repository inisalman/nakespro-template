// scripts/build.mjs — wrapper build atomik (R8.5).
//
// astro build mengosongkan outDir di AWAL build, sebelum content.ts diimpor.
// Akibatnya bila content.ts invalid (gagal assertSiteContent / typecheck),
// dist/ yang sudah ada akan terhapus — melanggar R8.5 ("tanpa memodifikasi
// dist/ yang sudah ada").
//
// Wrapper ini menegakkan perilaku desain (design.md): build ke folder
// SEMENTARA lalu hanya menukar ke dist/ saat SUKSES. Bila check/build gagal,
// dist/ lama tidak disentuh dan proses keluar dengan exit non-zero serta pesan
// yang menyebut field/metrik pelanggar (diteruskan dari astro/validator).
//
// Alur:
//   1. astro check          (typecheck; gagal → keluar, dist/ utuh)
//   2. astro build --outDir <tmp>   (gagal → hapus tmp, dist/ utuh)
//   3. swap: hapus dist/ lama, rename tmp → dist/   (hanya saat sukses)

import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, renameSync, rmSync, cpSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import process from 'node:process';

const root = process.cwd();
const distDir = resolve(root, 'dist');
const isWin = process.platform === 'win32';

function run(cmd, args) {
  const result = spawnSync(cmd, args, {
    cwd: root,
    stdio: 'inherit',
    shell: isWin, // Windows: .cmd butuh shell
  });
  return result.status ?? 1;
}

// 1. Typecheck. Gagal di sini tidak menyentuh dist/.
const checkCode = run('astro', ['check']);
if (checkCode !== 0) {
  console.error('[build] astro check gagal; dist/ tidak dimodifikasi.');
  process.exit(checkCode);
}

// 2. Build ke folder sementara.
const stageParent = mkdtempSync(join(tmpdir(), 'nakespro-dist-'));
const stageDir = join(stageParent, 'dist');

const buildCode = run('astro', ['build', '--outDir', stageDir]);
if (buildCode !== 0) {
  console.error('[build] astro build gagal; dist/ lama dipertahankan utuh.');
  rmSync(stageParent, { recursive: true, force: true });
  process.exit(buildCode);
}

// 3. Swap atomik: ganti dist/ hanya setelah build sukses.
try {
  if (existsSync(distDir)) {
    rmSync(distDir, { recursive: true, force: true });
  }
  try {
    renameSync(stageDir, distDir);
  } catch {
    // rename lintas-volume (tmp di drive berbeda) → fallback copy.
    cpSync(stageDir, distDir, { recursive: true });
    rmSync(stageDir, { recursive: true, force: true });
  }
} finally {
  rmSync(stageParent, { recursive: true, force: true });
}

console.log('[build] sukses; dist/ diperbarui secara atomik.');
process.exit(0);
