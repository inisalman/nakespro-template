// content.ts — sumber data tunggal untuk satu website client (R13.1).
//
// Template friendly-care diisi konten dummy realistis TANPA placeholder
// (tanpa lorem/TODO/TBD) dan tanpa gambar rusak (R9.3, R9.5). Seluruh field
// SiteContent diisi sehingga kesembilan section hidup (R9.5).
// `assertSiteContent` dipanggil saat impor agar pelanggaran bound
// menghentikan build sebelum dist/ (R8.5).
//
// Profil client: praktik bidan untuk perawatan ibu & bayi (pijat bayi,
// breast care, yoga ibu hamil, konselor laktasi) dengan model home visit.
//
// Foto yang direferensikan harus ada di public/images/ (R8.2, R8.7). Nama
// berkas di sini cocok dengan berkas .webp di public/images/.

import type { SiteContent } from './types.ts';
import { assertSiteContent } from './lib/validate.ts';

const content: SiteContent = {
  // — Presentasi —
  template: 'friendly-care',
  palette: 'bubblegum',

  // — Wajib —
  websiteName: 'Bidan Bunda Asih — Perawatan Ibu & Bayi',
  description:
    'Layanan kebidanan lembut untuk ibu dan si kecil langsung di rumah ' +
    'Anda. Pijat bayi, perawatan payudara, yoga ibu hamil, dan konsultasi ' +
    'laktasi oleh bidan bersertifikat dengan jadwal yang fleksibel.',
  serviceType: 'homecare',
  waNumber: '081234567890',

  // — Turunan Order (opsional) —
  practiceHours:
    'Senin–Sabtu 08.00–19.00 WIB, kunjungan rumah dengan perjanjian. ' +
    'Konsultasi laktasi darurat tersedia di luar jam dengan perjanjian.',
  location:
    'Melayani kunjungan rumah area Jakarta Selatan, Depok, dan ' +
    'sekitarnya. Basis praktik di Jl. Kenanga Raya No. 8, Cilandak, ' +
    'Jakarta Selatan.',
  googleMaps:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.123!2d106.79!3d-6.29!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sCilandak!5e0!3m2!1sid!2sid!4v1700000000000',

  photos: {
    nakes: [
      { url: 'nakes-1.webp', caption: 'Bidan Sari Utami, A.Md.Keb., penanggung jawab' },
      { url: 'nakes-2.webp', caption: 'Bidan saat kunjungan rumah mendampingi ibu' },
    ],
    ruangan: [
      { url: 'ruangan-1.webp', caption: 'Suasana sesi pijat bayi yang nyaman di rumah ibu' },
      { url: 'ruangan-2.webp', caption: 'Sudut tenang untuk sesi yoga ibu hamil' },
    ],
    alat: [
      { url: 'alat-1.webp', caption: 'Perlengkapan pijat bayi yang lembut dan higienis' },
      { url: 'alat-2.webp', caption: 'Peralatan pendukung perawatan payudara' },
    ],
    hasil: [
      { url: 'hasil-1.webp', caption: 'Momen bonding ibu dan bayi setelah sesi pijat' },
      { url: 'hasil-2.webp', caption: 'Ibu hamil rileks usai sesi prenatal yoga' },
    ],
  },

  // — Konten —
  tagline: 'Perawatan lembut untuk ibu dan si kecil, di rumah Anda',
  about:
    'Bidan Bunda Asih hadir untuk menemani perjalanan setiap ibu, mulai ' +
    'dari masa kehamilan hingga merawat buah hati. Didampingi bidan ' +
    'bersertifikat dengan pengalaman lebih dari delapan tahun, kami ' +
    'percaya perawatan terbaik lahir dari sentuhan yang lembut dan ' +
    'suasana yang menenangkan.\n\n' +
    'Layanan kami mencakup pijat bayi, perawatan payudara, kelas yoga ibu ' +
    'hamil, hingga konsultasi laktasi. Seluruh kunjungan dilakukan di ' +
    'rumah Anda agar ibu dan bayi tetap nyaman, dengan pendampingan yang ' +
    'sabar dan edukasi untuk seluruh keluarga.',

  credentials: [
    { label: 'Bidan ber-STR aktif', icon: '🩺' },
    { label: 'Sertifikat Konselor Laktasi', icon: '🍼' },
    { label: 'Pelatihan Pijat Bayi', icon: '👶' },
    { label: 'Sertifikat Prenatal Yoga', icon: '🧘‍♀️' },
  ],

  services: [
    {
      title: 'Pijat Bayi',
      description:
        'Pijat lembut untuk menstimulasi tumbuh kembang, melancarkan ' +
        'pencernaan, dan membuat bayi tidur lebih nyenyak.',
      icon: '👶',
    },
    {
      title: 'Perawatan Payudara',
      description:
        'Breast care untuk melancarkan ASI, meredakan bengkak, dan ' +
        'mencegah sumbatan, lengkap dengan edukasi perawatan mandiri.',
      icon: '🤱',
    },
    {
      title: 'Yoga Ibu Hamil',
      description:
        'Kelas prenatal yoga untuk menjaga kebugaran, melatih pernapasan, ' +
        'dan mempersiapkan tubuh ibu menjelang persalinan.',
      icon: '🧘‍♀️',
    },
    {
      title: 'Konselor Laktasi',
      description:
        'Konsultasi menyusui untuk membantu pelekatan yang tepat, ' +
        'meningkatkan produksi ASI, dan mengatasi kesulitan menyusui.',
      icon: '🍼',
    },
  ],

  howItWorks: [
    {
      step: 1,
      title: 'Hubungi via WhatsApp',
      description: 'Ceritakan kebutuhan Anda dan si kecil melalui WhatsApp kami.',
    },
    {
      step: 2,
      title: 'Jadwalkan Kunjungan',
      description:
        'Kami atur jadwal kunjungan rumah sesuai waktu yang paling nyaman untuk Anda.',
    },
    {
      step: 3,
      title: 'Bidan Datang ke Rumah',
      description:
        'Bidan datang tepat waktu dan memberikan perawatan dengan lembut dan telaten.',
    },
    {
      step: 4,
      title: 'Pendampingan & Tindak Lanjut',
      description:
        'Anda menerima edukasi perawatan mandiri dan dukungan untuk sesi berikutnya.',
    },
  ],

  testimonials: [
    {
      name: 'Ibu Dina',
      text:
        'Bidannya sangat sabar mengajari saya cara menyusui yang benar. ' +
        'Sekarang ASI lancar dan bayi saya lebih tenang.',
      role: 'Ibu menyusui, Jakarta Selatan',
    },
    {
      name: 'Ibu Rani',
      text:
        'Pijat bayi di rumah benar-benar membantu. Anak saya jadi tidur ' +
        'lebih nyenyak dan tidak rewel. Bidannya ramah sekali.',
      role: 'Ibu dari bayi 3 bulan, Depok',
    },
    {
      name: 'Ibu Maya',
      text:
        'Ikut kelas yoga ibu hamil bareng Bunda Asih bikin saya lebih ' +
        'rileks menjelang persalinan. Gerakannya aman dan dipandu dengan teliti.',
      role: 'Ibu hamil 7 bulan',
    },
  ],

  // — CTA WhatsApp —
  waMessage:
    'Halo Bidan Bunda Asih, saya ingin bertanya tentang layanan perawatan ibu dan bayi.',
};

export default assertSiteContent(content);
