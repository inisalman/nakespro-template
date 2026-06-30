// content.ts — sumber data tunggal untuk satu website client (R13.1).
//
// Reference_Template (modern-light) diisi konten dummy realistis TANPA
// placeholder (tanpa lorem/TODO/TBD) dan tanpa gambar rusak (R9.3, R9.5).
// Seluruh field SiteContent diisi sehingga kesembilan section hidup (R9.5).
// `assertSiteContent` dipanggil saat impor agar pelanggaran bound
// menghentikan build sebelum dist/ (R8.5).
//
// Profil client: praktik perawat sunat modern (circumcision) dengan metode
// minim nyeri dan layanan homecare maupun di klinik.
//
// Foto yang direferensikan harus ada di public/images/ (R8.2, R8.7). Nama
// berkas di sini cocok dengan berkas .webp di public/images/.

import type { SiteContent } from './types.ts';
import { assertSiteContent } from './lib/validate.ts';

const content: SiteContent = {
  // — Presentasi —
  template: 'clean-medical',
  palette: 'bright-health',

  // — Wajib —
  websiteName: 'Klinik Sunat Modern Bersama',
  description:
    'Layanan sunat modern profesional oleh perawat bersertifikat langsung ' +
    'di rumah Anda atau di klinik. Metode minim nyeri, tanpa jahitan, ' +
    'dan cepat sembuh untuk kenyamanan jagoan Anda.',
  serviceType: 'both',
  waNumber: '081234567890',

  // — Turunan Order (opsional) —
  practiceHours:
    'Senin–Minggu 08.00–20.00 WIB, melayani panggilan ke rumah dengan perjanjian. ' +
    'Konsultasi online pasca sunat sedia 24 jam.',
  location:
    'Melayani area Jakarta, Depok, Tangerang, dan Bekasi. ' +
    'Klinik pusat di Jl. Sehat Raya No. 10, Jakarta Selatan.',
  googleMaps:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.123!2d106.79!3d-6.29!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sCilandak!5e0!3m2!1sid!2sid!4v1700000000000',

  heroPhoto: { url: 'nakes-1.webp', caption: 'Ns. Ahmad Fauzi, praktisi sunat modern' },

  photos: [
    { url: 'nakes-1.webp', caption: 'Ns. Ahmad Fauzi, praktisi sunat modern' },
    { url: 'nakes-2.webp', caption: 'Perawat memberikan edukasi kepada orang tua' },
    { url: 'ruangan-1.webp', caption: 'Ruang tindakan klinik yang nyaman dan steril' },
    { url: 'ruangan-2.webp', caption: 'Area bermain anak di ruang tunggu' },
    { url: 'alat-1.webp', caption: 'Peralatan sunat modern sekali pakai (disposable)' },
    { url: 'alat-2.webp', caption: 'Perlengkapan bius minim nyeri (tanpa jarum)' },
    { url: 'hasil-1.webp', caption: 'Anak tetap ceria setelah tindakan sunat' },
    { url: 'hasil-2.webp', caption: 'Pendampingan dan kontrol pasca sunat' },
  ],

  // — Konten —
  tagline: 'Sunat modern minim nyeri, jagoan tetap ceria',
  about:
    'Klinik Sunat Modern Bersama hadir untuk memberikan pengalaman khitan ' +
    'yang menyenangkan dan bebas trauma bagi jagoan Anda. Ditangani oleh ' +
    'tim perawat terlatih dan bersertifikat khusus khitan modern, kami ' +
    'mengutamakan standar keamanan, sterilitas, dan kenyamanan.\n\n' +
    'Kami menyediakan berbagai metode sunat terkini seperti Super Ring ' +
    'dan Smart Clamp yang minim perdarahan dan tanpa jahitan. Layanan ' +
    'kami dapat dilakukan di klinik yang ramah anak maupun panggilan ' +
    'ke rumah (homecare), lengkap dengan pendampingan hingga sembuh total.',

  credentials: [
    { label: 'Perawat ber-STR aktif', icon: '🩺' },
    { label: 'Sertifikat Khitan Modern', icon: '🏅' },
    { label: 'Pelatihan Bius Tanpa Jarum', icon: '💉' },
    { label: 'Pendampingan 24 Jam', icon: '📞' },
  ],

  services: [
    {
      title: 'Sunat Metode Super Ring',
      description:
        'Metode canggih tanpa jahit dan tanpa perban. Anak bebas mandi ' +
        'seperti biasa dan penyembuhan lebih cepat.',
      icon: '💍',
    },
    {
      title: 'Sunat Metode Smart Clamp',
      description:
        'Pengerjaan cepat, minim perdarahan, dan hasil estetis yang rapi. ' +
        'Sangat direkomendasikan untuk anak aktif.',
      icon: '🛡️',
    },
    {
      title: 'Sunat Dewasa / Pria',
      description:
        'Layanan sunat privat untuk pria dewasa dengan metode khusus ' +
        'yang nyaman, aman, dan menjaga kerahasiaan.',
      icon: '👨',
    },
    {
      title: 'Sunat Panggilan (Homecare)',
      description:
        'Praktis tanpa antre. Tim medis kami datang ke rumah Anda ' +
        'dengan peralatan steril dan standar klinik lengkap.',
      icon: '🏠',
    },
  ],

  howItWorks: [
    {
      step: 1,
      title: 'Konsultasi via WhatsApp',
      description: 'Tanya jawab mengenai metode sunat dan biaya via admin kami.',
    },
    {
      step: 2,
      title: 'Atur Jadwal & Lokasi',
      description:
        'Pilih metode sunat dan atur jadwal tindakan, di klinik atau di rumah.',
    },
    {
      step: 3,
      title: 'Tindakan Sunat',
      description:
        'Proses tindakan cepat dengan bius minim nyeri agar anak tidak trauma.',
    },
    {
      step: 4,
      title: 'Kontrol & Pantauan',
      description:
        'Pendampingan gratis via WhatsApp hingga alat lepas dan sembuh total.',
    },
  ],

  testimonials: [
    {
      name: 'Bunda Rafi',
      text:
        'Alhamdulillah sunat Rafi berjalan lancar. Anaknya malah main HP ' +
        'terus pas disunat. Besoknya udah bisa lari-lari lagi.',
      role: 'Orang tua pasien, Jakarta',
    },
    {
      name: 'Ayah Bima',
      text:
        'Pilih sunat di rumah ternyata sangat praktis. Perawatnya sabar ' +
        'banget bujuk Bima supaya nggak takut. Terima kasih tim.',
      role: 'Orang tua pasien, Depok',
    },
    {
      name: 'Bunda Kenzo',
      text:
        'Metode ringnya bagus banget, nggak perlu ganti perban dan ' +
        'anak bisa langsung mandi. Perawatnya juga fast respon kalau di-WA.',
      role: 'Orang tua pasien, Tangerang',
    },
  ],

  // — CTA WhatsApp —
  waMessage:
    'Halo Klinik Sunat Modern Bersama, saya ingin konsultasi mengenai layanan sunat.',
};

export default assertSiteContent(content);
