# Memory — Perubahan Belum Di-commit (nakespro-template)

Catatan kerja per **2026-06-14**. Merangkum semua perubahan yang **belum
di-commit** di repo `nakespro-template`. 45 file modified di 4 template
(`calm-warm`, `clean-medical`, `friendly-care`, `modern-light`) + `shared/`.

## Tema besar

**Hapus kategori foto.** Galeri yang dulu terbagi per kategori
(`nakes`/`ruangan`/`alat`/`hasil`) diubah jadi **satu daftar foto tunggal**,
plus tambahan field `heroPhoto`. Perubahan ini sinkron dengan repo `nakespro-app`
yang menghapus kolom `OrderPhoto.category`.

---

## 1. Model data foto (`shared/types.ts` + tiap `src/types.ts`)

- `interface PhotoSet { nakes; ruangan; alat; hasil }` **dihapus**.
- Diganti `type PhotoGallery = Photo[]` (galeri tunggal 0–20 foto, R2.6).
- `SiteContent`:
  - `photos?: PhotoSet` → `photos?: PhotoGallery`
  - Tambah `heroPhoto?: Photo` — foto utama Hero; bila kosong Hero pakai
    fallback teks (R2.6).
- Diterapkan identik di: `shared/types.ts`, dan `src/types.ts` tiap template.

## 2. Data demo (`*/src/content.ts`)

- Objek `photos: { nakes:[...], ruangan:[...], alat:[...], hasil:[...] }`
  diratakan jadi satu array `photos: [...]` (semua foto digabung, urutan
  dipertahankan).
- Ditambah `heroPhoto: {...}` (umumnya foto nakes pertama).
- Tiap template tetap punya konten demo bespoke per niche (perawat, fisioterapi,
  bidan, dll) — **sengaja tidak identik** antar template.

## 3. Validasi (`*/src/lib/validate.ts` + `validate.test.ts`)

- `BOUNDS.photosPerCategory` → `BOUNDS.photos` (`{ min:0, max:20 }`, galeri
  tunggal).
- Fungsi `validatePhotoSet()` → `validatePhotos(photos: Photo[])` (cek panjang
  list + tiap foto).
- `assertSiteContent()`: tambah validasi `heroPhoto` bila ada; `photos`
  divalidasi lewat `validatePhotos`.
- Import `PhotoSet` dihapus.
- Test divalidasi ulang menyesuaikan kontrak baru.

## 4. Komponen galeri (`*/src/components/PhotoGallery.astro`)

- Props `photos?: PhotoSet` → `photos?: Photo[]`.
- Hapus `LABELS`/`ORDER` per kategori dan logika grouping.
- Render jadi **satu `<ul class="gallery-grid">` tunggal** untuk semua foto.
- Auto-Hide: section di-`return null` bila galeri kosong (R5.3).
- Hapus CSS `.gallery-group` / `.gallery-cat` (judul kategori).

## 5. Hero (`*/src/components/Hero.astro`)

- Disesuaikan untuk memakai `heroPhoto` (perubahan kecil, ~4-6 baris/template).

## 6. Komponen lain

- `modern-light`: `Services.astro`, `Testimonials.astro`, `pages/index.astro`
  diperbarui. `friendly-care` & `modern-light`: `Services.astro`.
- **`modern-light/src/layouts/BaseLayout.astro` (+35 baris)**: tambah banyak
  token warna CSS var (R6.4) — `--star`, `--overlay-*`, `--shadow-card*`,
  mesh gradient `--grad-1..6` + `--grad-fallback`, token teks di atas kartu
  gelap (`--on-dark*`), hairline, `--overlay-card*`, `--shadow-card-lift`.
  Tujuannya: komponen hanya mereferensikan `var(--token)`, tidak hardcode warna.

## 7. Test lintas template (`modern-light/src/test/cross-template.unit.test.ts`)

- Property 16 diubah: dulu membandingkan **teks `content.ts` byte-identik**
  (setelah normalisasi `template:`/`palette:`). Sekarang membandingkan
  **himpunan key field tingkat atas** (`extractTopLevelKeys`).
- Alasan: tiap template sengaja punya konten demo bespoke; yang dijamin lintas
  template adalah **kontrak data** (set field SiteContent sama), bukan nilai
  literal sama.

## 8. Test helper & unit (semua template)

- `src/test/helpers.ts`, `src/test/components.unit.test.ts`,
  `src/test/render.test.ts` disesuaikan ke model galeri tunggal + `heroPhoto`.

## 9. package-lock.json (`calm-warm`, `clean-medical`)

- Berkurang ~130 baris masing-masing (pembersihan dependency). Perlu dicek
  apakah disengaja sebelum commit.

---

## Status verifikasi

- Test (`vitest run` / `astro check`) **belum lolos diverifikasi** di environment
  ini — eksekusi `astro check` lambat / timeout, bukan indikasi gagal.
  **TODO: jalankan ulang test tiap template di mesin yang memadai.**

## TODO sebelum commit

- [ ] Jalankan `npm test` (vitest) di tiap template, pastikan hijau.
- [ ] Cek perubahan `package-lock.json` (calm-warm, clean-medical) memang
      diinginkan.
- [ ] Pastikan asset foto Hero (`heroPhoto`) tersedia di `public/images`
      tiap template.
- [ ] Konsisten dengan `nakespro-app`: app sudah hapus `OrderPhoto.category`
      dan pakai galeri tunggal — pastikan kontrak data app↔template cocok.
