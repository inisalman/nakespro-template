// lib/validate.ts — validator runtime bounds untuk SiteContent.
//
// TypeScript `strict` + `astro check` menegakkan field wajib, tipe, dan enum
// (R2.12). Namun bound panjang string, kardinalitas daftar, `step` bilangan
// bulat positif, dan `url` tidak kosong tidak dapat dipaksakan murni oleh
// tipe. `assertSiteContent` menutup celah itu: dipanggil dari `content.ts`
// saat impor sehingga pelanggaran melempar error dan menghentikan
// `astro build` SEBELUM `dist/` dihasilkan (R2.3, R2.5–R2.11, R8.5).
//
// Setiap error menyebut field yang melanggar agar mudah dilacak (Property 15).
// Fungsi ini murni terhadap input (hanya membaca + melempar) → kandidat PBT.

import type {
  Credential,
  HowItWorksStep,
  Photo,
  Service,
  SiteContent,
  Testimonial,
} from '../types.ts';

/** Error bounds dengan nama field yang melanggar (Property 15). */
export class SiteContentValidationError extends Error {
  /** Nama field (atau path field) yang melanggar bound. */
  readonly field: string;

  constructor(field: string, detail: string) {
    super(`SiteContent tidak valid pada field "${field}": ${detail}`);
    this.name = 'SiteContentValidationError';
    this.field = field;
  }
}

/** Batas panjang string & kardinalitas daftar sesuai kontrak (R2.x). */
export const BOUNDS = {
  websiteName: { min: 1, max: 100 }, // R2.3
  description: { min: 1, max: 500 }, // R2.3
  practiceHours: { min: 0, max: 200 }, // R2.5
  location: { min: 0, max: 200 }, // R2.5
  googleMaps: { min: 0, max: 1000 }, // R2.5
  tagline: { min: 0, max: 160 }, // R2.7
  about: { min: 0, max: 2000 }, // R2.7
  waMessage: { min: 0, max: 1000 }, // R4.3 (dipotong; tapi disimpan bebas)
  credentials: { min: 0, max: 12 }, // R2.8
  services: { min: 0, max: 12 }, // R2.9
  howItWorks: { min: 0, max: 10 }, // R2.10
  testimonials: { min: 0, max: 20 }, // R2.11
  photos: { min: 0, max: 20 }, // R2.6 (galeri tunggal)
} as const;

function checkStringLength(
  field: string,
  value: string,
  min: number,
  max: number,
): void {
  if (value.length < min) {
    throw new SiteContentValidationError(
      field,
      `panjang ${value.length} kurang dari minimum ${min}.`,
    );
  }
  if (value.length > max) {
    throw new SiteContentValidationError(
      field,
      `panjang ${value.length} melebihi maksimum ${max}.`,
    );
  }
}

function checkListLength(
  field: string,
  value: readonly unknown[],
  max: number,
): void {
  if (value.length > max) {
    throw new SiteContentValidationError(
      field,
      `jumlah entri ${value.length} melebihi maksimum ${max}.`,
    );
  }
}

function checkNonEmptyUrl(field: string, url: string): void {
  if (url.trim().length === 0) {
    throw new SiteContentValidationError(field, 'url tidak boleh kosong.');
  }
}

function validatePhoto(field: string, photo: Photo): void {
  checkNonEmptyUrl(`${field}.url`, photo.url); // R2.6
}

function validatePhotos(photos: Photo[]): void {
  checkListLength('photos', photos, BOUNDS.photos.max); // R2.6
  photos.forEach((photo, i) => validatePhoto(`photos[${i}]`, photo));
}

function validateCredentials(items: Credential[]): void {
  checkListLength('credentials', items, BOUNDS.credentials.max); // R2.8
}

function validateServices(items: Service[]): void {
  checkListLength('services', items, BOUNDS.services.max); // R2.9
}

function validateHowItWorks(items: HowItWorksStep[]): void {
  checkListLength('howItWorks', items, BOUNDS.howItWorks.max); // R2.10
  items.forEach((s, i) => {
    if (!Number.isInteger(s.step) || s.step <= 0) {
      throw new SiteContentValidationError(
        `howItWorks[${i}].step`,
        `step harus bilangan bulat positif, diterima ${s.step}.`,
      ); // R2.10
    }
  });
}

function validateTestimonials(items: Testimonial[]): void {
  checkListLength('testimonials', items, BOUNDS.testimonials.max); // R2.11
}

/**
 * Validasi seluruh bound `SiteContent`. Dipanggil dari `content.ts` saat
 * impor; melempar {@link SiteContentValidationError} pada pelanggaran pertama
 * agar `astro build` berhenti sebelum output (R8.5, Property 15).
 *
 * Field wajib & tipe sudah dijamin TypeScript (R2.12); fungsi ini fokus pada
 * bound yang tidak tertangkap tipe.
 *
 * @param content objek SiteContent yang akan divalidasi.
 * @returns `content` yang sama (untuk chaining: `export default assertSiteContent(c)`).
 */
export function assertSiteContent(content: SiteContent): SiteContent {
  // Wajib — panjang string (R2.3).
  checkStringLength(
    'websiteName',
    content.websiteName,
    BOUNDS.websiteName.min,
    BOUNDS.websiteName.max,
  );
  checkStringLength(
    'description',
    content.description,
    BOUNDS.description.min,
    BOUNDS.description.max,
  );

  // Opsional — panjang string bila ada (R2.5, R2.7).
  if (content.practiceHours !== undefined) {
    checkStringLength(
      'practiceHours',
      content.practiceHours,
      BOUNDS.practiceHours.min,
      BOUNDS.practiceHours.max,
    );
  }
  if (content.location !== undefined) {
    checkStringLength(
      'location',
      content.location,
      BOUNDS.location.min,
      BOUNDS.location.max,
    );
  }
  if (content.googleMaps !== undefined) {
    checkStringLength(
      'googleMaps',
      content.googleMaps,
      BOUNDS.googleMaps.min,
      BOUNDS.googleMaps.max,
    );
  }
  if (content.tagline !== undefined) {
    checkStringLength(
      'tagline',
      content.tagline,
      BOUNDS.tagline.min,
      BOUNDS.tagline.max,
    );
  }
  if (content.about !== undefined) {
    checkStringLength(
      'about',
      content.about,
      BOUNDS.about.min,
      BOUNDS.about.max,
    );
  }
  if (content.waMessage !== undefined) {
    checkStringLength(
      'waMessage',
      content.waMessage,
      BOUNDS.waMessage.min,
      BOUNDS.waMessage.max,
    );
  }

  // Opsional — daftar & isi (R2.6, R2.8–R2.11).
  if (content.heroPhoto !== undefined) {
    validatePhoto('heroPhoto', content.heroPhoto);
  }
  if (content.photos !== undefined) {
    validatePhotos(content.photos);
  }
  if (content.credentials !== undefined) {
    validateCredentials(content.credentials);
  }
  if (content.services !== undefined) {
    validateServices(content.services);
  }
  if (content.howItWorks !== undefined) {
    validateHowItWorks(content.howItWorks);
  }
  if (content.testimonials !== undefined) {
    validateTestimonials(content.testimonials);
  }

  return content;
}
