// shared/types.ts — sumber kanonik kontrak data SiteContent.
//
// File ini adalah SATU-SATUNYA sumber kebenaran untuk tipe SiteContent
// (R1.1). Isinya disalin apa adanya ke setiap template sebagai
// `src/types.ts` (R1.6, R2.14, R13.3). Setiap perubahan kontrak harus
// dilakukan di sini lebih dulu, lalu disalin ulang ke tiap template.
//
// Konvensi penandaan field:
//   - Field WAJIB ditulis non-optional. Bila hilang/tipe salah/nilai enum
//     di luar himpunan, `astro check` (tsc) gagal sebelum output (R2.12).
//   - Field OPSIONAL (ditandai `?`) adalah pemicu Auto-Hide: bila kosong,
//     section terkait tidak dirender (R2.13, R5.x).
//   - Komentar bound (panjang string / kardinalitas daftar) mengikat aturan
//     yang ditegakkan saat build oleh validator runtime `assertSiteContent`
//     (lihat lib/validate.ts) karena tidak semua bound dapat dipaksakan
//     murni oleh tipe TypeScript.

/**
 * Id template visual. Nilainya tepat salah satu dari 4 id template yang
 * tersedia di Template_System (R2.1).
 */
export type TemplateId =
  | 'modern-light'
  | 'clean-medical'
  | 'calm-warm'
  | 'friendly-care';

/**
 * Jenis layanan nakes. Enum tertutup untuk mencegah nilai di luar himpunan
 * (R2.4).
 */
export type ServiceType = 'nakes' | 'homecare' | 'both';

/**
 * Satu foto pada galeri/section. `url` merujuk nama berkas di
 * `public/images/` (R2.6).
 */
export interface Photo {
  url: string; // tidak kosong; nama berkas di public/images/ (R2.6)
  caption?: string; // dipakai sebagai alt bila ada (R11.1)
}

/**
 * Galeri foto sebagai satu daftar tunggal 0–20 foto (R2.6). Tanpa kategori:
 * seluruh foto dirender pada satu grid. Daftar kosong memicu Auto-Hide
 * section galeri (R3.13).
 */
export type PhotoGallery = Photo[]; // 0–20

/** Kredensial/sertifikasi nakes untuk TrustBar. Daftar 0–12 entri (R2.8). */
export interface Credential {
  label: string; // string (R2.8)
  icon: string; // string (R2.8)
}

/** Layanan yang ditawarkan. Daftar 0–12 entri (R2.9). */
export interface Service {
  title: string; // string (R2.9)
  description: string; // string (R2.9)
  icon?: string; // opsional (R2.9)
  image?: string; // opsional; nama berkas foto latar di public/images/
}

/** Langkah pada section HowItWorks. Daftar 0–10 entri (R2.10). */
export interface HowItWorksStep {
  step: number; // bilangan bulat positif (R2.10)
  title: string; // string (R2.10)
  description: string; // string (R2.10)
}

/** Testimoni pelanggan. Daftar 0–20 entri (R2.11). */
export interface Testimonial {
  name: string; // string (R2.11)
  text: string; // string (R2.11)
  role?: string; // opsional (R2.11)
}

/**
 * Kontrak data konten untuk satu website client. Identik di keempat template
 * (R2.14, R13.3). Satu `content.ts` valid harus dapat dipakai template mana
 * pun tanpa perubahan struktur.
 */
export interface SiteContent {
  // — Presentasi (wajib) —
  template: TemplateId; // R2.1
  palette: string; // id preset template terpilih; fallback diatur R6 (R2.2)

  // — Turunan Order_Model (wajib) —
  websiteName: string; // 1–100 char (R2.3)
  description: string; // 1–500 char (R2.3)
  serviceType: ServiceType; // R2.4
  waNumber: string; // hanya digit (R2.4)

  // — Turunan Order_Model (opsional, memicu Auto-Hide) —
  practiceHours?: string; // 0–200 char (R2.5)
  location?: string; // 0–200 char (R2.5)
  googleMaps?: string; // 0–1000 char (R2.5)
  heroPhoto?: Photo; // foto utama Hero; bila kosong Hero pakai fallback teks (R2.6)
  photos?: PhotoGallery; // galeri tunggal 0–20 foto (R2.6, R2.13)

  // — Konten (opsional, memicu Auto-Hide) —
  tagline?: string; // 0–160 char (R2.7)
  about?: string; // 0–2000 char (R2.7)
  credentials?: Credential[]; // 0–12 entri (R2.8)
  services?: Service[]; // 0–12 entri (R2.9)
  howItWorks?: HowItWorksStep[]; // 0–10 entri (R2.10)
  testimonials?: Testimonial[]; // 0–20 entri (R2.11)

  // — CTA WhatsApp (opsional) —
  // waMessage belum dikumpulkan form nakespro-app; untuk sekarang diisi
  // manual dari chat WhatsApp (R2.15). Dipotong di 1000 char saat dipakai
  // pada URL wa.me (R4.3).
  waMessage?: string; // pesan prefilled, dipotong di 1000 char (R4.3)
}
