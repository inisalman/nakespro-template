# Memory (nakespro-template)

Catatan status terkini proyek per **2026-06-15**.

## Status Repositori

- **Git Working Tree**: Bersih (Clean), sinkron dengan `origin/main`.
- **Refaktor Kategori Foto (Selesai & Commit)**:
  - Struktur `PhotoSet` yang membagi foto per kategori (nakes, ruangan, alat, hasil) **sudah dihapus** (ter-commit sebelumnya).
  - Menggunakan struktur galeri tunggal (`PhotoGallery = Photo[]`) yang dibatasi 0-20 foto.
  - Penambahan `heroPhoto` untuk foto utama Hero sudah berjalan, di-fallback ke teks bila kosong.
  - Perubahan ini termanifestasi utuh di `shared/types.ts` dan masing-masing `content.ts` keempat template.

## Infrastruktur & Deployment

- **Workflow Static Client**: Diimplementasi dalam file `DEPLOYMENT_WORKFLOW.md`. Klien baru di-handle secara manual (copy folder, isi data) sebelum di-deploy via Nginx statis.
- **Dockerfile & nginx.conf (Selesai & Commit)**: Menggunakan multi-stage build (`node:20` via pnpm v9 untuk build Astro) dengan serve hasil akhir ke 4 virtual host (`*.nakespro.id`) melalui footprint kecil `nginx:alpine`. Commit `a0446ae` dan `999b2be`.
- **Sharp/Node fix**: Commit `2173961` (builder node:20) dan `901cf53` (pin pnpm v9) menyortir isu Sharp.

## Sisa Pekerjaan

Berdasarkan Kiro `.kiro/specs/nakespro-landing-templates/tasks.md` (59 dari 60 tugas selesai), hanya ada satu sisa tugas terbuka:
- `[ ] 10. Test contoh, konsistensi kontrak, build & audit (modern-light)`
  - *Tindakan selanjutnya*: Verifikasi ulang test cross-template (`modern-light/src/test/cross-template.unit.test.ts`) dan build script apakah sepenuhnya mematuhi ekspektasi audit di mesin runner.

## Catatan Tambahan
- `PRD.md` kosong di root. Bila ada requirement yang tidak ter-cover di `.kiro/specs/nakespro-landing-templates/requirements.md`, bisa didokumentasikan di sini.
- Aset gambar masih menggunakan _naming convention_ lama (`nakes-1.webp`, `ruangan-2.webp`), tapi secara arsitektur ia diolah sebagai galeri tunggal (valid).
