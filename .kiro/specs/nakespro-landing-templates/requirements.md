# Requirements Document

## Introduction

**NakesPro Landing Templates** adalah repo boilerplate template landing page berbasis **Astro** yang TERPISAH dari aplikasi Next.js `nakespro-app`. Repo ini adalah sisi *website builder* yang memproduksi website client aktual di `{nama}.nakespro.id` untuk pelanggan **Paket Hemat**.

Repo ini berisi 4 proyek Astro standalone (bukan monorepo, bukan satu proyek dengan template yang bisa di-switch). Tiap template adalah company-profile landing page statis tanpa auth/DB/interaktivitas berat, sehingga di-build sebagai static files (zero-JS by default) dan di-host murah secara massal (target ~270-400 site aktif di satu VPS via Easypanel/nginx).

Jantung sistem adalah **data contract** `SiteContent`: satu file `content.ts` per website client, diketik oleh sebuah shared type. Kontrak ini IDENTIK di keempat template, sehingga satu sumber data dapat menggerakkan template mana pun — ini disengaja agar auto-generation di masa depan (script: order-id → content.ts → astro build → deploy) menjadi murah. Auto-generation itu sendiri OUT OF SCOPE untuk build ini; alur saat ini manual.

Dokumen ini mengunci requirement untuk: data contract & shared type, 4 template, 9 section wajib + perilaku auto-hide, sistem palette preset, alur copy/build/deploy per-client, NFR performa/static-output, aksesibilitas, responsivitas, dan urutan build (modern-light dulu sebagai referensi).

## Glossary

- **Template_System**: Keseluruhan repo boilerplate `nakespro-template` yang berisi 4 proyek Astro standalone plus folder `shared/`.
- **Template**: Satu proyek Astro standalone (salah satu dari `modern-light`, `clean-medical`, `calm-warm`, `friendly-care`) yang berdiri sendiri dengan `package.json`, `src/`, `components/`, dan `public/images/` sendiri.
- **SiteContent**: Tipe TypeScript yang mendefinisikan data contract untuk konten satu website client. Didefinisikan di `shared/types.ts` dan disalin ke tiap Template.
- **content.ts**: File data per-client (satu per website) yang meng-export sebuah objek bertipe `SiteContent`, berisi seluruh konten dan pilihan presentasi website tersebut.
- **palettes.ts**: File per-Template yang mendefinisikan kumpulan Palette_Preset milik Template tersebut.
- **Palette_Preset**: Satu skema warna bernama (preset) milik sebuah Template, diterapkan via CSS custom properties.
- **Section**: Satu blok konten pada halaman (Hero, TrustBar, Services, About, Photo Gallery, HowItWorks, Testimonials, Contact & Location, Footer).
- **Auto_Hide**: Perilaku di mana sebuah Section tidak me-render output apa pun ketika data pendukungnya kosong atau tidak ada.
- **WhatsApp_CTA**: Elemen call-to-action yang mengarahkan pengunjung ke `wa.me` dengan nomor dari `content.waNumber`.
- **Build_Process**: Proses `astro build` yang menghasilkan output statis (`dist/`) untuk satu website client.
- **Deployment**: Proses men-deploy folder `dist/` sebagai static site ke Easypanel/nginx di host `{nama}.nakespro.id`.
- **Order_Model**: Model `Order` dan `OrderPhoto` pada aplikasi `nakespro-app` (`prisma/schema.prisma`) yang menjadi sumber sebagian field `SiteContent`.
- **Maintainer**: Orang yang menjalankan alur per-client manual (copy folder, isi `content.ts`, build, deploy) — saat ini Salman.
- **Reference_Template**: Template `modern-light` yang dibangun pertama dan paling lengkap sebagai acuan struktur untuk 3 Template lainnya.

## Requirements

### Requirement 1: Struktur Repo & Proyek Standalone

**User Story:** Sebagai Maintainer, saya ingin repo berisi 4 proyek Astro standalone dengan folder `shared` terpusat, supaya tiap website client dapat dibangun dengan menyalin satu folder Template tanpa ketergantungan monorepo.

#### Acceptance Criteria

1. THE Template_System SHALL menyediakan folder `shared/types.ts` yang berisi definisi tipe `SiteContent`.
2. THE Template_System SHALL berisi tepat 4 folder Template (tidak lebih dan tidak kurang) dengan id: `modern-light`, `clean-medical`, `calm-warm`, dan `friendly-care`.
3. THE Template_System SHALL membuat setiap Template sebagai proyek Astro standalone yang memuat seluruh lima artefak wajib: `package.json`, `src/content.ts`, `src/palettes.ts`, folder `components/`, dan folder `public/images/`.
4. IF salah satu dari lima artefak struktural wajib pada sebuah Template tidak ada, THEN THE Template_System SHALL menunjukkan artefak yang hilang tersebut.
5. THE Template_System SHALL mengonfigurasi setiap Template untuk menghasilkan output statis berupa berkas HTML, CSS, dan aset statis tanpa server runtime yang berjalan saat penyajian.
6. WHEN sebuah Template dibangun, THE Template SHALL memuat salinan tipe `SiteContent` yang memiliki himpunan field dan tipe data sama persis dengan definisi di `shared/types.ts`.
7. IF salinan tipe `SiteContent` pada sebuah Template memiliki himpunan field atau tipe data yang berbeda dari `shared/types.ts`, THEN THE Build_Process SHALL gagal dengan kesalahan tipe yang menunjukkan field yang tidak sesuai.
8. THE Template_System SHALL menyusun keempat Template tanpa konfigurasi workspace monorepo sehingga setiap Template dapat di-build dengan menyalin satu folder Template beserta folder `shared`, dan tanpa mekanisme switch template di dalam satu proyek tunggal.

### Requirement 2: Data Contract `SiteContent` (Shared Type)

**User Story:** Sebagai Maintainer, saya ingin satu tipe `SiteContent` yang identik di keempat Template, supaya satu sumber data dapat menggerakkan Template mana pun dan auto-generation di masa depan menjadi murah.

#### Acceptance Criteria

1. THE SiteContent SHALL mendefinisikan field presentasi wajib `template` yang nilainya tepat salah satu dari id Template: `modern-light`, `clean-medical`, `calm-warm`, atau `friendly-care`.
2. THE SiteContent SHALL mendefinisikan field presentasi wajib `palette` yang nilainya tepat salah satu id Palette_Preset milik Template terpilih (perilaku fallback palette diatur pada Requirement 6).
3. THE SiteContent SHALL mendefinisikan field wajib `websiteName` sebagai string sepanjang 1 hingga 100 karakter dan field wajib `description` sebagai string sepanjang 1 hingga 500 karakter.
4. THE SiteContent SHALL mendefinisikan field wajib `serviceType` sebagai enum bernilai `nakes`, `homecare`, atau `both`, dan field wajib `waNumber` sebagai string berisi digit.
5. THE SiteContent SHALL mendefinisikan field opsional yang berasal dari Order_Model: `practiceHours` (string 0 hingga 200 karakter), `location` (string 0 hingga 200 karakter), dan `googleMaps` (string 0 hingga 1000 karakter).
6. THE SiteContent SHALL mendefinisikan field `photos` sebagai objek dengan kategori `nakes`, `ruangan`, `alat`, dan `hasil`, di mana setiap kategori adalah daftar berisi 0 hingga 20 foto dan setiap foto memiliki field `url` berupa string tidak kosong serta field `caption` opsional.
7. THE SiteContent SHALL mendefinisikan field konten `tagline` opsional (string 0 hingga 160 karakter untuk satu baris hero) dan field konten `about` opsional (string 0 hingga 2000 karakter untuk kisah/narasi nakes).
8. THE SiteContent SHALL mendefinisikan field konten `credentials` sebagai daftar berisi 0 hingga 12 entri dengan field `label` (string) dan field `icon` (string).
9. THE SiteContent SHALL mendefinisikan field konten `services` sebagai daftar berisi 0 hingga 12 entri dengan field `title` (string), field `description` (string), dan field `icon` (string) opsional.
10. THE SiteContent SHALL mendefinisikan field konten `howItWorks` sebagai daftar berisi 0 hingga 10 entri dengan field `step` (bilangan bulat positif), field `title` (string), dan field `description` (string).
11. THE SiteContent SHALL mendefinisikan field konten `testimonials` sebagai daftar berisi 0 hingga 20 entri dengan field `name` (string), field `text` (string), dan field `role` (string) opsional.
12. IF salah satu field wajib (`template`, `palette`, `websiteName`, `description`, `serviceType`, atau `waNumber`) hilang atau kosong, THEN THE Build_Process SHALL gagal pada pemeriksaan tipe sebelum menghasilkan output.
13. THE SiteContent SHALL menetapkan field berikut sebagai opsional yang kekosongannya menggerakkan Auto_Hide: `tagline`, `credentials`, `services`, `about`, `howItWorks`, `testimonials`, `photos`, `practiceHours`, `location`, dan `googleMaps`.
14. THE Template_System SHALL menjaga struktur `SiteContent` identik di keempat Template sehingga satu `content.ts` valid dapat dipakai oleh Template mana pun tanpa perubahan struktur.
15. WHERE sebuah field konten baru belum dikumpulkan oleh form aplikasi `nakespro-app`, THE Template_System SHALL menandai field tersebut sebagai data yang nantinya perlu dikumpulkan oleh form aplikasi dan untuk saat ini diisi manual dari chat WhatsApp.

### Requirement 3: Sembilan Section Wajib

**User Story:** Sebagai pemilik praktik nakes, saya ingin website saya memuat seluruh section pembangun kepercayaan dalam urutan yang konsisten, supaya pengunjung memperoleh informasi layanan kesehatan yang lengkap dan tepercaya.

#### Acceptance Criteria

1. THE Template SHALL menyediakan komponen untuk kesembilan Section: Hero, TrustBar, Services, About, Photo Gallery, HowItWorks, Testimonials, Contact & Location, dan Footer.
2. THE Template SHALL menampilkan Section pada posisi berurutan tepat 1 sampai 9: Hero (1), TrustBar (2), Services (3), About (4), Photo Gallery (5), HowItWorks (6), Testimonials (7), Contact & Location (8), dan Footer (9), tanpa Section yang tampil di luar urutan tersebut.
3. THE Hero SHALL menampilkan foto nakes asli dari kategori foto `nakes` dan sebuah WhatsApp_CTA yang berada above-the-fold sehingga terlihat tanpa scroll pada viewport selebar 640px atau lebih.
4. WHEN pengunjung menge-tap WhatsApp_CTA pada Hero, THE WhatsApp_CTA SHALL membuka tautan WhatsApp.
5. THE TrustBar SHALL menampilkan entri dari field `credentials`.
6. THE Services SHALL menampilkan entri dari field `services`.
7. THE About SHALL menampilkan konten dari field `about`.
8. THE Photo_Gallery SHALL menampilkan foto yang dikelompokkan menurut kategori `nakes`, `ruangan`, `alat`, dan `hasil`.
9. THE HowItWorks SHALL menampilkan entri dari field `howItWorks`.
10. THE Testimonials SHALL menampilkan entri dari field `testimonials`.
11. THE Contact_And_Location SHALL menampilkan `practiceHours`, area layanan dari `location`, dan embed Google Maps dari `googleMaps`.
12. IF data `services`, `credentials`, `howItWorks`, atau `testimonials` kosong, THEN THE Section terkait SHALL disembunyikan tanpa menyisakan area kosong dan tanpa mengubah urutan Section lain.
13. IF sebuah kategori pada Photo_Gallery kosong, THEN THE Photo_Gallery SHALL menyembunyikan grup kategori tersebut tanpa menyisakan area kosong dan tetap mempertahankan urutan kategori yang tersedia.
14. IF embed Google Maps tidak tersedia, THEN THE Contact_And_Location SHALL tetap menampilkan `practiceHours` dan `location` dengan indikasi bahwa peta tidak tersedia.
15. THE Footer SHALL menampilkan teks kecil "Powered by NakesPro".
16. THE Template_System SHALL menjaga kesembilan Section ini ada di keempat Template.

### Requirement 4: WhatsApp sebagai CTA Utama

**User Story:** Sebagai pemilik praktik nakes, saya ingin tombol WhatsApp selalu mudah dijangkau, supaya pengunjung dapat menghubungi saya melalui kanal yang paling sering dipakai di Indonesia.

#### Acceptance Criteria

1. THE Template SHALL menampilkan WhatsApp_CTA mengambang (floating/sticky) yang tetap terlihat di seluruh rentang scroll pada viewport selebar 320px hingga 1920px.
2. WHEN pengunjung mengaktifkan WhatsApp_CTA, THE WhatsApp_CTA SHALL membuka `wa.me` menggunakan `waNumber` yang dinormalisasi menjadi hanya digit (tanpa `+`, `-`, spasi, atau tanda kurung) dengan angka 0 di depan diganti kode negara `62`.
3. WHERE field `waMessage` diisi, THE WhatsApp_CTA SHALL menyertakannya sebagai pesan prefilled sepanjang maksimal 1000 karakter dan memotong kelebihannya.
4. IF `waNumber` kosong atau tidak ada, atau setelah normalisasi jumlah digitnya kurang dari 8 atau lebih dari 15, THEN THE Template SHALL menyembunyikan WhatsApp_CTA mengambang.

### Requirement 5: Perilaku Auto-Hide Section

**User Story:** Sebagai Maintainer, saya ingin section dengan data kosong tidak ditampilkan, supaya sebuah website dapat diluncurkan walau sebagian konten (misal testimoni atau kredensial) belum siap.

#### Acceptance Criteria

1. THE Template SHALL menyertakan komponen setiap Section di dalam setiap Template terlepas dari ketersediaan data.
2. THE Template SHALL menganggap sebuah field "kosong" ketika field bertipe teks bernilai undefined, null, atau hanya berisi whitespace, dan ketika field bertipe daftar bernilai undefined, null, atau berisi 0 entri.
3. IF data pendukung sebuah Section kosong, THEN THE Section SHALL tidak menghasilkan elemen, heading, atau container apa pun pada output build.
4. WHILE data pendukung sebuah Section tersedia dan tidak kosong, THE Section SHALL me-render kontennya.
5. THE Template SHALL selalu me-render Hero dan Footer serta mengecualikannya dari Auto_Hide, di mana Footer membawa teks "Powered by NakesPro" dan Hero bersifat struktural beserta WhatsApp_CTA.
6. WHILE sebagian sub-field Contact_And_Location terisi dan sebagian kosong, THE Contact_And_Location SHALL me-render hanya sub-field yang tidak kosong tanpa placeholder, sedangkan Auto_Hide penuh Contact_And_Location mengikuti aturan kosong umum.
7. WHEN satu atau lebih Section ter-Auto_Hide, THE Build_Process SHALL selesai tanpa error dan THE Template SHALL tetap me-render Section lain yang memiliki data dengan urutan relatif sesuai Requirement 3.

### Requirement 6: Sistem Palette Preset

**User Story:** Sebagai Maintainer, saya ingin memilih skema warna lewat satu baris di `content.ts`, supaya saya dapat menyesuaikan tampilan tanpa menyentuh kode komponen dan tanpa risiko kombinasi warna yang bentrok.

#### Acceptance Criteria

1. THE Template SHALL mendefinisikan 3 sampai 4 Palette_Preset bernama di `palettes.ts`, di mana setiap Palette_Preset memiliki id yang unik.
2. THE Template SHALL membuat setiap Palette_Preset mendefinisikan himpunan token yang sama, minimal: `accent`, `background`, `surface`, `text`, dan `muted`.
3. WHEN sebuah Template di-render, THE Template SHALL menerapkan Palette_Preset terpilih melalui CSS custom properties yang di-inject pada elemen `<html>`.
4. THE Template SHALL membuat komponen hanya mereferensikan CSS custom properties untuk warna, bukan nilai warna literal.
5. WHEN field `palette` diubah ke id Palette_Preset lain yang valid, THE Template SHALL menerapkan palette baru tanpa perubahan pada file komponen mana pun.
6. THE Template SHALL menetapkan tepat satu Palette_Preset sebagai default per Template.
7. IF field `palette` berisi id yang tidak dikenal atau kosong, THEN THE Template SHALL menerapkan Palette_Preset default, menyelesaikan rendering tanpa menghentikan proses, dan mencatat peringatan yang menunjukkan id palette yang tidak dikenal.
8. THE Template SHALL membuat setiap Palette_Preset memenuhi WCAG 2.1 level AA: minimal 4.5:1 untuk teks terhadap `background` dan `surface`, serta minimal 3:1 untuk teks besar (minimal 18.66px bold atau 24px regular) dan untuk `accent` yang dipakai pada elemen UI.

### Requirement 7: Karakter Visual 4 Template

**User Story:** Sebagai Maintainer, saya ingin tiap Template punya karakter visual yang berbeda untuk segmen layanan tertentu, supaya saya dapat mencocokkan website dengan jenis praktik client.

#### Acceptance Criteria

1. WHEN modern-light di-render, THE modern-light SHALL menerapkan karakter visual bersih/netral (palette netral, tipografi standar, bentuk minimal) secara konsisten di kesembilan Section sebagai pilihan default untuk praktik mandiri umum.
2. WHEN clean-medical di-render, THE clean-medical SHALL menerapkan karakter klinis bernuansa biru/teal secara konsisten di kesembilan Section untuk layanan medis teknis dan perawatan luka.
3. WHEN calm-warm di-render, THE calm-warm SHALL menerapkan karakter hangat lembut/earthy (bentuk soft) secara konsisten di kesembilan Section untuk perawatan lansia, paliatif, kesehatan mental, dan home nursing.
4. WHEN friendly-care di-render, THE friendly-care SHALL menerapkan karakter ramah, cerah, dan rounded secara konsisten di kesembilan Section untuk layanan anak, ibu & bayi, fisioterapi, dan wellness.
5. THE Template_System SHALL menjaga data contract `SiteContent` dan kesembilan Section identik di keempat Template sehingga data yang sama dapat di-render pada Template mana pun tanpa perubahan struktur atau kehilangan field.
6. IF sebuah Section tidak memiliki konten, THEN THE keempat Template SHALL menerapkan perilaku Auto_Hide yang identik.
7. WHEN Template diganti dari satu ke lainnya, THE Template_System SHALL mempertahankan seluruh nilai field `SiteContent` tanpa perubahan atau kehilangan, dan hanya karakter visual (palette, tipografi, bentuk) yang berubah.

### Requirement 8: Alur Copy/Build/Deploy Per-Client

**User Story:** Sebagai Maintainer, saya ingin alur per-client yang sederhana dan manual, supaya saya dapat memproduksi satu website client dengan menyalin satu folder, mengisi konten, dan men-deploy output statis.

#### Acceptance Criteria

1. WHEN sebuah folder Template disalin, THE folder hasil salinan SHALL memuat seluruh file dependency dan konfigurasi build sehingga dapat di-build tanpa mereferensikan folder Template sumber.
2. THE Maintainer SHALL mengisi konten website dengan mengedit `src/content.ts` dan meletakkan foto di `public/images/`.
3. WHEN Maintainer menjalankan Build_Process pada folder Template terisi, THE Build_Process SHALL menghasilkan static site di folder `dist/`.
4. THE Deployment SHALL menyajikan folder `dist/` sebagai static files di host `{nama}.nakespro.id` melalui Easypanel/nginx.
5. IF `content.ts` tidak sesuai tipe `SiteContent`, THEN THE Build_Process SHALL berhenti sebelum menghasilkan output `dist/` dan menampilkan kesalahan tipe yang mengidentifikasi field yang tidak sesuai, tanpa memodifikasi `dist/` yang sudah ada.
6. WHERE auto-generation belum diterapkan, THE alur per-client SHALL dijalankan secara manual untuk build ini.
7. IF sebuah foto yang direferensikan oleh `content.ts` tidak ada di `public/images/`, THEN THE Build_Process SHALL berhenti sebelum menghasilkan output dan menampilkan kesalahan yang mengidentifikasi nama berkas foto yang hilang.
8. IF Deployment folder `dist/` ke host gagal, THEN THE Deployment SHALL tetap menyajikan static files yang sebelumnya aktif dan menampilkan indikasi kegagalan kepada Maintainer.

### Requirement 9: Konten & Foto Dummy untuk Reference_Template

**User Story:** Sebagai Maintainer, saya ingin modern-light dibangun pertama secara lengkap dengan konten dan foto dummy yang realistis, supaya saya punya acuan yang terlihat hidup untuk mereplikasi 3 Template lainnya.

#### Acceptance Criteria

1. THE Template_System SHALL membangun modern-light sebagai Reference_Template pertama, yaitu menyelesaikan seluruh kriteria Requirement 9 sebelum ketiga Template lain mulai dibangun.
2. THE Reference_Template SHALL mengimplementasikan kesembilan Section sehingga setiap Section ter-render tanpa error.
3. THE Reference_Template SHALL mengisi seluruh field data contract `SiteContent` tanpa teks placeholder (tanpa lorem ipsum, TODO, atau TBD) dan tanpa gambar rusak.
4. THE Reference_Template SHALL menerapkan setiap Palette_Preset miliknya ke kesembilan Section tanpa error rendering.
5. THE Reference_Template SHALL menyertakan satu set konten dummy realistis di `content.ts`.
6. THE Reference_Template SHALL menyertakan satu set foto dummy realistis di `public/images/`.
7. IF sebuah foto yang direferensikan tidak ada, THEN THE Reference_Template SHALL menampilkan placeholder dan tetap melanjutkan rendering Section lainnya.
8. WHEN ketiga Template lain dibangun, THE Template lain SHALL mereplikasi struktur Section dan data contract Reference_Template dengan desain visual masing-masing.

### Requirement 10: Performa & Static Output (NFR)

**User Story:** Sebagai Maintainer, saya ingin tiap website ringan dan statis, supaya ratusan site dapat di-host murah di satu VPS dengan performa tinggi.

#### Acceptance Criteria

1. THE Template SHALL menghasilkan output statis tanpa JavaScript (zero-JS) secara default sehingga total payload JavaScript untuk halaman tanpa Section interaktif adalah 0 KB.
2. WHERE sebuah Section membutuhkan interaktivitas, THE Template SHALL membatasi JavaScript hanya pada Section tersebut (partial hydration) dan tidak mengirim JavaScript untuk Section statis lainnya.
3. WHERE sebuah Section membutuhkan interaktivitas, THE Template SHALL menjaga ukuran JavaScript terkompresi (gzip/brotli) per halaman maksimal 50 KB.
4. THE Build_Process SHALL menghasilkan static files yang dapat disajikan tanpa proses Node.js runtime per-site.
5. WHEN halaman client diuji dengan Lighthouse profil mobile (CPU throttling 4x, Slow 4G: RTT 150ms, 1.6 Mbps), THE halaman SHALL mencapai skor Performance minimal 90 dari 100.
6. WHEN halaman client diuji dengan Lighthouse profil mobile, THE halaman SHALL memenuhi Core Web Vitals: LCP maksimal 2.5s, CLS maksimal 0.1, dan INP maksimal 200ms.
7. WHEN halaman di-build, THE halaman SHALL menjaga total transfer terkompresi halaman awal maksimal 500 KB (HTML, CSS, font, dan gambar above-the-fold).
8. WHEN sebuah gambar di-render, THE Template SHALL menyajikannya dalam format modern (WebP/AVIF) dengan width dan height eksplisit serta lazy-loading untuk gambar below-the-fold.
9. IF sebuah halaman melampaui ambang pada kriteria 3, 5, 6, atau 7, THEN THE Build_Process SHALL gagal dengan pesan yang menunjukkan metrik dan nilai yang dilanggar.

### Requirement 11: Aksesibilitas (NFR)

**User Story:** Sebagai pengunjung dengan kebutuhan aksesibilitas, saya ingin website dapat digunakan dengan teknologi bantu, supaya saya dapat mengakses informasi layanan kesehatan.

#### Acceptance Criteria

1. THE Template SHALL menyediakan teks alternatif untuk setiap gambar menggunakan `caption` bila tersedia, atau teks alternatif deskriptif default sepanjang 1 hingga 125 karakter bila `caption` tidak ada.
2. THE Template SHALL menggunakan elemen HTML semantik dan struktur heading berurutan tanpa melewati level (h1→h2→h3) per Section, dengan tepat satu h1 per halaman.
3. THE Template SHALL menjaga rasio kontras pada setiap Palette_Preset memenuhi WCAG 2.1 level AA: minimal 4.5:1 untuk teks normal dan minimal 3:1 untuk teks besar (minimal 18pt atau 14pt bold).
4. THE WhatsApp_CTA SHALL memiliki nama yang dapat diakses (accessible name) berupa teks tidak kosong yang menyatakan tujuan menghubungi via WhatsApp.
5. WHEN pengunjung menavigasi dengan keyboard, THE Template SHALL membuat seluruh elemen interaktif (tautan, tombol, WhatsApp_CTA) dapat dijangkau dan diaktifkan sesuai urutan baca, dengan indikator fokus terlihat berkontras minimal 3:1 terhadap sekitarnya.
6. WHERE sebuah Section menyematkan Google Maps, THE Section SHALL menyediakan nama yang dapat diakses (accessible name) berupa teks tidak kosong yang menjelaskan isi peta pada frame embed.
7. THE Template SHALL menyediakan target sentuh minimal 24x24 CSS px untuk setiap elemen interaktif, atau jarak antar target minimal 24 CSS px bila ukurannya lebih kecil.

### Requirement 12: Responsivitas (NFR)

**User Story:** Sebagai pengunjung yang mayoritas memakai ponsel, saya ingin website tampil baik di layar apa pun, supaya saya dapat membaca dan menghubungi nakes dengan nyaman.

#### Acceptance Criteria

1. THE Template SHALL me-render tata letak yang dapat digunakan pada viewport selebar 320px hingga 1920px tanpa horizontal scroll yang tidak disengaja.
2. THE Template SHALL menerapkan breakpoint mobile (lebar maksimal 767px), tablet (768px hingga 1023px), dan desktop (lebar minimal 1024px) untuk kesembilan Section dengan pendekatan mobile-first.
3. THE Template SHALL menyediakan target sentuh minimal 44x44px untuk setiap elemen interaktif pada viewport mobile.
4. WHILE ditampilkan di viewport mobile, THE WhatsApp_CTA mengambang SHALL tetap terlihat dan dapat dijangkau tanpa menutupi konten utama atau CTA primer.
5. WHILE ditampilkan di viewport mobile, THE embed Google Maps SHALL menyesuaikan ukuran di dalam container tanpa overflow.
6. WHILE ditampilkan di viewport mobile, THE Photo_Gallery SHALL menata foto sehingga tetap terbaca dan dapat digulir tanpa overflow yang merusak tata letak.

### Requirement 13: Disiplin Kontrak untuk Auto-Generation Masa Depan (NFR)

**User Story:** Sebagai pemilik produk, saya ingin data contract dijaga ketat dan konsisten, supaya auto-generation di masa depan (order-id → content.ts → astro build → deploy) menjadi murah tanpa membangun ulang Template.

#### Acceptance Criteria

1. THE Template_System SHALL menjaga `content.ts` sebagai satu-satunya sumber data konten per-website tanpa teks atau data spesifik client yang di-hardcode di komponen, sehingga seluruh konten yang di-render berasal dari objek `SiteContent` di `content.ts`.
2. THE Template_System SHALL memetakan setiap field `SiteContent` yang berasal dari Order_Model (`websiteName`, `description`, `serviceType`, `waNumber`, `practiceHours`, `location`, `googleMaps`, `photos`) satu-ke-satu ke field Order terkait sehingga dapat disalin langsung dari satu Order tanpa merge, split, atau drop.
3. THE Template_System SHALL menjaga struktur `SiteContent` identik di keempat Template sehingga satu `content.ts` valid dapat di-build pada Template mana pun tanpa perubahan struktur tipe.
4. WHERE auto-generation belum diterapkan, THE Build_Process dan alur per-client SHALL dijalankan secara manual dan tidak menyertakan script generation (order-id → content.ts) pada build saat ini.
