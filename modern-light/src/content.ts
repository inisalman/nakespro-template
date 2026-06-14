// content.ts — sumber data tunggal untuk satu website client (R13.1).
//
// Reference_Template (modern-light) diisi konten dummy realistis TANPA
// placeholder (tanpa lorem/TODO/TBD) dan tanpa gambar rusak (R9.3, R9.5).
// Seluruh field SiteContent diisi sehingga kesembilan section hidup (R9.5).
// `assertSiteContent` dipanggil saat impor agar pelanggaran bound
// menghentikan build sebelum dist/ (R8.5).
//
// Foto yang direferensikan harus ada di public/images/ (R8.2, R8.7). Nama
// berkas di sini cocok dengan berkas .webp di public/images/.

import type { SiteContent } from './types.ts';
import { assertSiteContent } from './lib/validate.ts';

const content: SiteContent = {
  // — Presentasi —
  template: 'modern-light',
  palette: 'neutral',

  // — Wajib —
  websiteName: 'Klinik Perawat Sehat Bersama',
  description:
    'Layanan perawatan kesehatan profesional oleh tenaga kesehatan ' +
    'bersertifikat. Perawatan luka, homecare lansia, dan konsultasi ' +
    'kesehatan langsung di rumah Anda dengan jadwal yang fleksibel.',
  serviceType: 'both',
  waNumber: '081234567890',

  // — Turunan Order (opsional) —
  practiceHours:
    'Senin–Jumat 08.00–20.00 WIB, Sabtu 08.00–15.00 WIB, ' +
    'kunjungan darurat 24 jam dengan perjanjian.',
  location:
    'Melayani area Jakarta Selatan, Depok, dan sekitarnya. ' +
    'Klinik di Jl. Melati Raya No. 12, Cilandak, Jakarta Selatan.',
  googleMaps:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.123!2d106.79!3d-6.29!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sCilandak!5e0!3m2!1sid!2sid!4v1700000000000',

  heroPhoto: { url: 'nakes-1.webp', caption: 'Ns. Rina Wijaya, perawat penanggung jawab' },

  photos: [
    { url: 'nakes-1.webp', caption: 'Ns. Rina Wijaya, perawat penanggung jawab' },
    { url: 'nakes-2.webp', caption: 'Tim perawat saat kunjungan homecare' },
    { url: 'ruangan-1.webp', caption: 'Ruang perawatan klinik yang bersih' },
    { url: 'ruangan-2.webp', caption: 'Ruang tunggu pasien yang nyaman' },
    { url: 'alat-1.webp', caption: 'Peralatan perawatan luka steril' },
    { url: 'alat-2.webp', caption: 'Alat pemeriksaan tanda vital' },
    { url: 'hasil-1.webp', caption: 'Proses perawatan luka diabetik' },
    { url: 'hasil-2.webp', caption: 'Pendampingan fisioterapi lansia' },
  ],

  // — Konten —
  tagline: 'Perawatan tepercaya, langsung ke rumah Anda',
  about:
    'Klinik Perawat Sehat Bersama didirikan oleh sekelompok perawat ' +
    'bersertifikat dengan pengalaman lebih dari sepuluh tahun di rumah ' +
    'sakit rujukan. Kami percaya perawatan kesehatan yang baik dimulai ' +
    'dari rasa nyaman pasien.\n\n' +
    'Layanan kami mencakup perawatan luka kronis, pendampingan lansia, ' +
    'pemasangan dan perawatan kateter, hingga edukasi keluarga. Setiap ' +
    'tindakan mengikuti standar prosedur klinis dan dicatat secara rapi ' +
    'agar perkembangan pasien selalu terpantau.',

  credentials: [
    { label: 'Perawat ber-STR aktif', icon: '🩺' },
    { label: 'Sertifikat perawatan luka', icon: '🏅' },
    { label: 'Pelatihan BTCLS', icon: '📋' },
    { label: 'Mitra resmi BPJS', icon: '🤝' },
  ],

  services: [
    {
      title: 'Perawatan Luka',
      description:
        'Perawatan luka diabetik, luka operasi, dan luka kronis dengan ' +
        'teknik steril dan pemantauan berkala.',
      icon: '🩹',
    },
    {
      title: 'Homecare Lansia',
      description:
        'Pendampingan harian, bantuan mobilitas, dan pemantauan kondisi ' +
        'kesehatan lansia di rumah.',
      icon: '👵',
    },
    {
      title: 'Pemeriksaan Tanda Vital',
      description:
        'Pengukuran tekanan darah, gula darah, dan saturasi oksigen ' +
        'lengkap dengan laporan tertulis.',
      icon: '❤️',
    },
    {
      title: 'Konsultasi Kesehatan',
      description:
        'Konsultasi kebutuhan perawatan dan edukasi keluarga oleh perawat ' +
        'berpengalaman.',
      icon: '💬',
    },
  ],

  howItWorks: [
    {
      step: 1,
      title: 'Hubungi via WhatsApp',
      description: 'Ceritakan kebutuhan perawatan Anda melalui WhatsApp kami.',
    },
    {
      step: 2,
      title: 'Jadwalkan Kunjungan',
      description:
        'Kami atur jadwal kunjungan sesuai waktu yang paling nyaman untuk Anda.',
    },
    {
      step: 3,
      title: 'Perawatan di Rumah',
      description:
        'Perawat datang tepat waktu dan melakukan tindakan sesuai standar klinis.',
    },
    {
      step: 4,
      title: 'Laporan & Tindak Lanjut',
      description:
        'Anda menerima laporan kondisi dan rekomendasi perawatan berikutnya.',
    },
  ],

  testimonials: [
    {
      name: 'Bapak Hadi',
      text:
        'Perawatan luka ayah saya sangat telaten. Perawatnya ramah dan ' +
        'selalu menjelaskan setiap tindakan dengan sabar.',
      role: 'Keluarga pasien, Depok',
    },
    {
      name: 'Ibu Sari',
      text:
        'Sangat terbantu dengan layanan homecare untuk ibu saya. Jadwal ' +
        'fleksibel dan laporannya jelas setiap kunjungan.',
      role: 'Keluarga pasien, Jakarta Selatan',
    },
    {
      name: 'Ibu Lestari',
      text:
        'Pemeriksaan rutin gula darah jadi mudah tanpa harus antre di ' +
        'klinik. Hasilnya langsung dicatat dan dijelaskan.',
      role: 'Pasien homecare',
    },
  ],

  // — CTA WhatsApp —
  waMessage:
    'Halo Klinik Perawat Sehat Bersama, saya ingin bertanya tentang layanan perawatan di rumah.',
};

export default assertSiteContent(content);
