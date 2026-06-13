# Implementation Plan: NakesPro Landing Templates

## Overview

Implementasi mengikuti urutan build pada desain: bangun `modern-light` sebagai Reference_Template secara lengkap lebih dulu (kontrak `SiteContent`, utilitas murni `lib/`, sistem palette, 9 section + FloatingWhatsApp, konten/foto dummy, lalu test berlapis), baru mereplikasi 3 template lain (`clean-medical`, `calm-warm`, `friendly-care`).

Stack: **Astro v5 (TypeScript `strict`)**, output statis, `astro:assets` untuk gambar, **fast-check + Vitest** untuk property-based test. Setiap langkah membangun di atas langkah sebelumnya dan diakhiri dengan wiring (`index.astro`) sehingga tidak ada kode menggantung.

Konvensi property test: setiap test diberi komentar tag `Feature: nakespro-landing-templates, Property {n}: {teks property}` dan dijalankan minimal 100 iterasi.

## Tasks

- [x] 1. Fondasi repo & kontrak tipe bersama
  - [x] 1.1 Buat `shared/types.ts` sebagai sumber kanonik `SiteContent`
    - Definisikan `TemplateId`, `ServiceType`, `Photo`, `PhotoSet`, `Credential`, `Service`, `HowItWorksStep`, `Testimonial`, dan interface `SiteContent` (termasuk `waMessage?`) persis seperti Data Models pada desain
    - Tandai field wajib non-optional dan field opsional pemicu Auto-Hide; sertakan komentar bound (panjang/kardinalitas) per field
    - _Requirements: 1.1, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10, 2.11, 2.13, 2.14, 2.15, 13.3_

  - [x] 1.2 Scaffold proyek standalone `modern-light`
    - Buat `modern-light/package.json` (dependency + script `build`/`check` sendiri), `astro.config.mjs` dengan `output: 'static'` dan integrasi `astro:assets`, `tsconfig.json` extends `astro/tsconfigs/strict`
    - Buat struktur folder `src/` (`lib/`, `layouts/`, `components/`, `pages/`) dan `public/images/`
    - _Requirements: 1.3, 1.5, 1.8, 8.1, 10.4_

  - [x] 1.3 Salin kontrak ke `modern-light/src/types.ts`
    - Salin isi `shared/types.ts` menjadi `src/types.ts` template (sumber data komponen)
    - _Requirements: 1.6_

- [x] 2. Implementasi utilitas murni `lib/` (kandidat PBT)
  - [x] 2.1 Implementasi `lib/empty.ts`
    - Tulis `isEmptyText` (true bila undefined/null/whitespace-only) dan `isEmptyList` (true bila undefined/null/0 entri)
    - _Requirements: 5.2_

  - [x] 2.2 Property test deteksi kosong
    - **Property 4: Deteksi "kosong" sesuai definisi kontrak**
    - **Validates: Requirements 5.2**

  - [x] 2.3 Implementasi `lib/whatsapp.ts`
    - Tulis `normalizeWaNumber` (buang `+ - ( ) spasi`, ganti `0` di depan dengan `62`) dan `buildWaUrl` (susun `wa.me`, sertakan `waMessage` ter-encode dipotong di 1000 char) plus helper validitas digit 8–15
    - _Requirements: 4.2, 4.3_

  - [x] 2.4 Property test normalisasi nomor WhatsApp
    - **Property 1: Normalisasi nomor WhatsApp menjadi digit & kode negara**
    - **Validates: Requirements 4.2, 3.4**

  - [x] 2.5 Property test pemotongan pesan prefill
    - **Property 3: Pesan prefill WhatsApp dipotong di 1000 karakter**
    - **Validates: Requirements 4.3**

  - [x] 2.6 Implementasi `lib/palette.ts`
    - Tulis `resolvePalette(palettes, id, defaultId)` (cocokkan id; fallback ke default + peringatan bila tak dikenal/kosong) dan `paletteToCssVars(palette)` (rangkai string CSS custom properties)
    - _Requirements: 6.3, 6.5, 6.7_

  - [x] 2.7 Property test resolusi palette
    - **Property 9: Resolusi palette — preset valid atau fallback default dengan peringatan**
    - **Validates: Requirements 6.5, 6.7**

  - [x] 2.8 Implementasi `lib/images.ts`
    - Tulis `resolveAltText(photo)` (pakai `caption` bila tidak kosong; selain itu alt default deskriptif 1–125 char) dan resolusi/validasi path foto dengan dukungan mode STRICT (gagal build) vs PLACEHOLDER (flag `ALLOW_PLACEHOLDER`)
    - _Requirements: 11.1, 8.7, 9.7_

  - [x] 2.9 Property test teks alternatif gambar
    - **Property 12: Teks alternatif gambar selalu bermakna**
    - **Validates: Requirements 11.1**

- [x] 3. Sistem palette preset & validator bounds
  - [x] 3.1 Buat `src/palettes.ts` (modern-light)
    - Definisikan 3–4 Palette_Preset netral (token `accent, background, surface, text, muted`, id unik, semua AA-compliant) dan `DEFAULT_PALETTE_ID` tepat satu
    - _Requirements: 6.1, 6.2, 6.6_

  - [x] 3.2 Property test keseragaman token palette
    - **Property 10: Semua preset palette mendefinisikan himpunan token yang sama**
    - **Validates: Requirements 6.2**

  - [x] 3.3 Property test kontras WCAG AA palette
    - **Property 11: Setiap preset memenuhi kontras WCAG AA**
    - **Validates: Requirements 6.8, 11.3**

  - [x] 3.4 Implementasi `lib/validate.ts` (`assertSiteContent`)
    - Validator runtime yang dipanggil dari `content.ts`: cek bound panjang string, kardinalitas daftar, `step` bilangan bulat positif, `url` tidak kosong; lempar error menyebut field yang melanggar agar `astro build` berhenti sebelum `dist/`
    - _Requirements: 2.3, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10, 2.11, 2.12, 8.5_

  - [x] 3.5 Property test validator bounds
    - **Property 15: Validator bounds menerima konten valid dan menolak pelanggaran**
    - **Validates: Requirements 2.3, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10, 2.11, 2.12**

- [x] 4. Checkpoint - Pastikan semua test lolos
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Layout & komponen struktural selalu-render (modern-light)
  - [x] 5.1 Implementasi `layouts/BaseLayout.astro`
    - Susun shell semantik (`<html lang="id">`, satu `<h1>` struktural), panggil `resolvePalette` + `paletteToCssVars` untuk inject CSS custom properties pada `<html>`, sediakan `<slot />`
    - _Requirements: 6.3, 6.4, 11.2_

  - [x] 5.2 Implementasi `components/Hero.astro`
    - Selalu render; tampilkan foto nakes (`astro:assets <Image/>` dengan width/height eksplisit) dari `photos.nakes[0]` + WhatsApp CTA above-the-fold (≥640px); accessible name CTA tidak kosong; warna via CSS var saja
    - _Requirements: 3.3, 3.4, 5.5, 6.4, 10.8, 11.4_

  - [x] 5.3 Implementasi `components/Footer.astro`
    - Selalu render teks kecil "Powered by NakesPro"; warna via CSS var saja
    - _Requirements: 3.15, 5.5, 6.4_

  - [x] 5.4 Implementasi `components/FloatingWhatsApp.astro`
    - Render sticky/floating (tetap terlihat 320–1920px) hanya bila `normalizeWaNumber` menghasilkan 8–15 digit; pakai `buildWaUrl`; sembunyikan bila invalid/kosong
    - _Requirements: 4.1, 4.4, 6.4_

  - [x] 5.5 Unit test komponen struktural
    - Footer memuat "Powered by NakesPro" (R3.15); Hero memuat foto nakes + WA CTA dengan accessible name tidak kosong (R3.3, R11.4)
    - _Requirements: 3.15, 3.3, 11.4_

- [x] 6. Komponen section auto-hide & wiring halaman (modern-light)
  - [x] 6.1 Implementasi `components/TrustBar.astro`
    - Guard `isEmptyList(credentials)` → return null; render seluruh entri `credentials`; CSS var only
    - _Requirements: 3.5, 3.12, 5.3, 5.4, 6.4_

  - [x] 6.2 Implementasi `components/Services.astro`
    - Guard `isEmptyList(services)` → return null; render seluruh entri `services`; CSS var only
    - _Requirements: 3.6, 3.12, 5.3, 5.4, 6.4_

  - [x] 6.3 Implementasi `components/About.astro`
    - Guard `isEmptyText(about)` → return null; render konten `about`; CSS var only
    - _Requirements: 3.7, 5.3, 5.4, 6.4_

  - [x] 6.4 Implementasi `components/PhotoGallery.astro`
    - Render section bila ada ≥1 foto di kategori mana pun; sembunyikan grup kategori kosong, jaga urutan `nakes, ruangan, alat, hasil`; pakai `astro:assets <Image/>` (width/height, `loading="lazy"` below-the-fold, format modern) + `resolveAltText`
    - _Requirements: 3.8, 3.13, 5.3, 5.4, 6.4, 10.8, 11.1, 12.6_

  - [x] 6.5 Implementasi `components/HowItWorks.astro`
    - Guard `isEmptyList(howItWorks)` → return null; render seluruh entri terurut; CSS var only
    - _Requirements: 3.9, 3.12, 5.3, 5.4, 6.4_

  - [x] 6.6 Implementasi `components/Testimonials.astro`
    - Guard `isEmptyList(testimonials)` → return null; render seluruh entri; CSS var only
    - _Requirements: 3.10, 3.12, 5.3, 5.4, 6.4_

  - [x] 6.7 Implementasi `components/ContactLocation.astro`
    - Render section bila ≥1 sub-field tidak kosong; render hanya sub-field tidak kosong (partial); embed Google Maps responsif dengan `title` iframe; bila `googleMaps` kosong tampilkan indikasi peta tidak tersedia sambil tetap menampilkan `practiceHours`/`location`
    - _Requirements: 3.11, 3.14, 5.3, 5.4, 5.6, 6.4, 11.6, 12.5_

  - [x] 6.8 Wiring `pages/index.astro`
    - Impor `content.ts` + seluruh section; rangkai dalam `BaseLayout` pada urutan tetap 1–9 (Hero, TrustBar, Services, About, PhotoGallery, HowItWorks, Testimonials, ContactLocation, Footer) plus FloatingWhatsApp; teruskan slice `SiteContent` yang relevan ke tiap section
    - _Requirements: 3.1, 3.2, 3.16, 5.1, 5.7_

- [x] 7. Konten & foto dummy Reference_Template (modern-light)
  - [x] 7.1 Buat `src/content.ts` dengan konten dummy realistis
    - Isi seluruh field `SiteContent` tanpa placeholder (tanpa lorem/TODO/TBD), panggil `assertSiteContent(content)` saat impor; seluruh konten render berasal dari objek ini (tanpa hardcode di komponen)
    - _Requirements: 9.3, 9.5, 13.1_

  - [x] 7.2 Tambahkan foto dummy ke `public/images/`
    - Sediakan set foto realistis untuk kategori `nakes/ruangan/alat/hasil` yang direferensikan `content.ts`
    - _Requirements: 9.6_

- [x] 8. Checkpoint - Pastikan modern-light render & semua test lolos
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Property test invarian output render (modern-light)
  - [x] 9.1 Property test kemunculan WhatsApp CTA
    - **Property 2: Validitas nomor menentukan kemunculan WhatsApp CTA**
    - **Validates: Requirements 4.4**

  - [x] 9.2 Property test auto-hide section
    - **Property 5: Auto-hide section — render jika dan hanya jika data tidak kosong**
    - **Validates: Requirements 3.12, 3.13, 3.14, 5.3, 5.4, 5.6, 7.6, 2.13**

  - [x] 9.3 Property test urutan section
    - **Property 6: Urutan section relatif selalu terjaga**
    - **Validates: Requirements 3.2, 5.7**

  - [x] 9.4 Property test Hero & Footer selalu dirender
    - **Property 7: Hero dan Footer selalu dirender**
    - **Validates: Requirements 5.5, 3.15**

  - [x] 9.5 Property test kelengkapan entri data
    - **Property 8: Render menampilkan seluruh entri data yang tidak kosong**
    - **Validates: Requirements 3.5, 3.6, 3.7, 3.8, 3.9, 3.10, 3.11**

  - [x] 9.6 Property test struktur heading
    - **Property 13: Tepat satu h1 dan struktur heading tidak melompat**
    - **Validates: Requirements 11.2**

  - [x] 9.7 Property test atribut gambar
    - **Property 14: Atribut gambar memenuhi kontrak performa**
    - **Validates: Requirements 10.8**

- [ ] 10. Test contoh, konsistensi kontrak, build & audit (modern-light)
  - [x] 10.1 Unit test palette & skenario foto hilang
    - `DEFAULT_PALETTE_ID` menunjuk preset valid; jumlah preset 3–4 dengan id unik (R6.1, R6.6); iframe Maps punya `title` (R11.6); skenario foto hilang mode STRICT gagal build (R8.7) dan mode PLACEHOLDER lanjut render (R9.7)
    - _Requirements: 6.1, 6.6, 11.6, 8.7, 9.7_

  - [x] 10.2 Test konsistensi kontrak & struktur
    - Bandingkan `src/types.ts` dengan `shared/types.ts` (drift gagal); verifikasi 5 artefak wajib ada & laporkan yang hilang
    - _Requirements: 1.4, 1.6, 1.7, 1.3_

  - [x] 10.3 Static check disiplin komponen
    - Pastikan komponen tidak memuat warna literal (hanya CSS var), tidak ada konten client di-hardcode, dan tidak ada `lorem/TODO/TBD` di modern-light
    - _Requirements: 6.4, 13.1, 9.3_

  - [x] 10.4 Integration build test
    - Copy folder template + `shared/` ke lokasi terisolasi lalu `astro build`; verifikasi `dist/` statis tanpa server entry; build 9 section tanpa error untuk setiap preset; verifikasi build gagal (exit non-zero, menyebut field) pada `content.ts` invalid tanpa menyentuh `dist/` lama
    - _Requirements: 1.5, 1.8, 8.1, 8.3, 8.5, 9.1, 9.2, 9.4, 10.4_

  - [~] 10.5 Audit performa, aksesibilitas & responsivitas
    - Konfigurasi Lighthouse CI profil mobile (Performance ≥90; LCP ≤2.5s, CLS ≤0.1, INP ≤200ms; transfer awal ≤500KB; JS ≤50KB) sebagai budget gate; verifikasi zero-JS halaman tanpa island; test axe-core (heading order, alt text, accessible names, kontras, fokus, touch target); test viewport sampel (320/375/768/1024/1920) tanpa horizontal scroll
    - _Requirements: 10.1, 10.2, 10.3, 10.5, 10.6, 10.7, 10.9, 11.5, 11.7, 12.1, 12.2, 12.3, 12.4, 12.5, 12.6_

- [x] 11. Replikasi 3 template lain dari Reference_Template
  - [x] 11.1 Bangun `clean-medical`
    - Salin struktur modern-light (types.ts, lib/, 9 section, FloatingWhatsApp, index.astro, validator); ganti hanya karakter visual (palette biru/teal, tipografi, bentuk) via `palettes.ts` + CSS var; jaga kontrak & section identik
    - _Requirements: 7.2, 7.5, 7.6, 9.8, 1.2, 1.3_

  - [x] 11.2 Bangun `calm-warm`
    - Replikasi struktur; karakter hangat lembut/earthy (bentuk soft) via palette + CSS var; kontrak & section identik
    - _Requirements: 7.3, 7.5, 7.6, 9.8, 1.2, 1.3_

  - [x] 11.3 Bangun `friendly-care`
    - Replikasi struktur; karakter ramah/cerah/rounded via palette + CSS var; kontrak & section identik
    - _Requirements: 7.4, 7.5, 7.6, 9.8, 1.2, 1.3_

  - [x] 11.4 Property test identitas data lintas template
    - **Property 16: Identitas data lintas template**
    - **Validates: Requirements 7.7, 2.14, 13.3**

  - [x] 11.5 Test konsistensi kontrak & struktur 4 template
    - Verifikasi tepat 4 folder template dengan id benar; tiap template punya 5 artefak wajib; `src/types.ts` tiap template identik dengan `shared/types.ts`
    - _Requirements: 1.2, 1.3, 1.6, 1.7_

- [x] 12. Checkpoint akhir - Pastikan semua test lolos
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Task bertanda `*` bersifat opsional (test) dan dapat dilewati untuk MVP yang lebih cepat; task implementasi inti tidak pernah opsional.
- Setiap task mereferensikan klausa requirement spesifik untuk traceability.
- Property test memvalidasi invarian universal (16 property desain); unit/integration/audit test memvalidasi contoh, edge case, dan metrik eksternal.
- Urutan build mengikuti desain: `modern-light` selesai penuh (task 1–10) sebelum replikasi (task 11).
- Checkpoint memastikan validasi inkremental.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["1.3"] },
    { "id": 2, "tasks": ["2.1", "2.3", "2.6", "2.8", "3.1", "3.4"] },
    { "id": 3, "tasks": ["2.2", "2.4", "2.5", "2.7", "2.9", "3.2", "3.3", "3.5", "5.1", "5.2", "5.3", "5.4", "6.1", "6.2", "6.3", "6.4", "6.5", "6.6", "6.7", "7.1", "7.2"] },
    { "id": 4, "tasks": ["5.5", "6.8", "10.1", "10.2", "10.3"] },
    { "id": 5, "tasks": ["9.1", "9.2", "9.3", "9.4", "9.5", "9.6", "9.7", "10.4", "10.5"] },
    { "id": 6, "tasks": ["11.1", "11.2", "11.3"] },
    { "id": 7, "tasks": ["11.4", "11.5"] }
  ]
}
```
