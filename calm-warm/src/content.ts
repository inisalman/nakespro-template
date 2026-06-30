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
  template: 'calm-warm',
  palette: 'terracotta',

  // — Wajib —
  websiteName: 'Insan Care — Perawatan Lansia & Paliatif',
  description:
    'Layanan homecare lansia dan perawatan paliatif profesional langsung di rumah ' +
    'Anda. Dampingi orang tua tercinta dengan perawat berlisensi, penuh kasih, dan berdedikasi.',
  serviceType: 'homecare',
  waNumber: '081234567890',

  // — Turunan Order (opsional) —
  practiceHours: 'Layanan Kunjungan & Standby Homecare 24 Jam',
  location: 'Melayani kunjungan rumah di Jakarta Selatan, Depok, Tangerang, dan Bekasi.',
  googleMaps:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.123!2d106.79!3d-6.29!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sCilandak!5e0!3m2!1sid!2sid!4v1700000000000',

  heroPhoto: {
    url: 'hero_perawat_lansia.webp',
    caption: 'Layanan homecare lansia penuh kasih oleh perawat profesional berhijab',
  },

  photos: [
    {
      url: 'hero_perawat_lansia.webp',
      caption: 'Perawat melakukan pendampingan penuh empati',
    },
    {
      url: 'perawatan_paliatif.webp',
      caption: 'Perawatan paliatif dengan kenyamanan ekstra untuk pasien',
    },
    {
      url: 'pemantauan_vital.webp',
      caption: 'Pemantauan vital sign dan kondisi kesehatan pasien secara berkala',
    },
    {
      url: 'pendampingan_aktivitas.webp',
      caption: 'Pendampingan aktivitas harian untuk menjaga kemandirian lansia',
    },
  ],

  // — Konten —
  tagline: 'Pendampingan Profesional dan Penuh Kasih di Rumah Anda',
  about:
    'Insan Care berkomitmen menyediakan layanan perawatan lansia (geriatri) dan ' +
    'asuhan paliatif berkualitas tinggi langsung di kenyamanan rumah pasien. Kami ' +
    'percaya bahwa setiap lansia dan pasien berhak mendapatkan masa tua serta masa ' +
    'pemulihan yang damai, dihormati, dan penuh kasih sayang.\n\n' +
    'Didukung oleh tim perawat muda bersertifikat dan berhijab yang terlatih dalam ' +
    'kompetensi medis geriatri, kami siap membantu asuhan harian, manajemen nyeri ' +
    'paliatif, pemantauan tanda vital, perawatan luka, hingga terapi okupasi ' +
    'ringan. Kami mengutamakan komunikasi yang hangat dengan keluarga serta pencatatan ' +
    'asuhan yang disiplin.',

  credentials: [
    { label: 'Perawat Ber-STR & Berlisensi', icon: '🩺' },
    { label: 'Sertifikasi Asuhan Geriatri', icon: '👵' },
    { label: 'Keahlian Perawatan Paliatif', icon: '❤️' },
    { label: 'Siaga Kunjungan 24/7', icon: '⏰' },
  ],

  services: [
    {
      title: 'Homecare Geriatri (Lansia)',
      description:
        'Pendampingan aktivitas harian, pemenuhan nutrisi, bantuan mobilisasi, ' +
        'serta kenyamanan dan keamanan lansia di rumah.',
      icon: '👵',
      image: 'pendampingan_aktivitas.webp',
    },
    {
      title: 'Perawatan Paliatif',
      description:
        'Pemberian asuhan medis and emosional untuk meningkatkan kualitas hidup ' +
        'pasien dengan penyakit kronis atau stadium lanjut.',
      icon: '❤️',
      image: 'perawatan_paliatif.webp',
    },
    {
      title: 'Pemantauan Medis Berkala',
      description:
        'Pemeriksaan rutin tanda vital, kepatuhan minum obat, terapi oksigen, ' +
        'dan koordinasi dengan dokter penanggung jawab.',
      icon: '🩺',
      image: 'pemantauan_vital.webp',
    },
    {
      title: 'Terapi & Edukasi Keluarga',
      description:
        'Bimbingan mobilitas ringan bagi lansia serta edukasi perawatan mandiri ' +
        'agar keluarga lebih tenang dan terlatih.',
      icon: '💬',
      image: 'hero_perawat_lansia.webp',
    },
  ],

  howItWorks: [
    {
      step: 1,
      title: 'Hubungi via WhatsApp',
      description: 'Konsultasikan kondisi pasien dan kebutuhan asuhan orang tua Anda.',
    },
    {
      step: 2,
      title: 'Asesmen & Rencana Asuhan',
      description:
        'Tim kami melakukan asesmen kondisi fisik untuk menyusun rencana keperawatan.',
    },
    {
      step: 3,
      title: 'Kunjungan & Perawatan',
      description:
        'Perawat berlisensi datang untuk memberikan tindakan medis dan pendampingan.',
    },
    {
      step: 4,
      title: 'Evaluasi & Laporan Harian',
      description: 'Keluarga menerima pembaruan berkala mengenai perkembangan kondisi pasien.',
    },
  ],

  testimonials: [
    {
      name: 'Ibu Rahayu',
      text:
        'Perawat dari Insan Care sangat sabar merawat ibu saya yang pasca-stroke. ' +
        'Tutur katanya lembut, sopan, dan ibunya merasa sangat dihargai.',
      role: 'Keluarga pasien, Jakarta Selatan',
    },
    {
      name: 'Bapak Gunawan',
      text:
        'Sangat terbantu dengan layanan perawatan paliatifnya. Kehadiran perawat ' +
        'berhijab yang ramah membuat ayah saya tenang menjalani pengobatan.',
      role: 'Anak pasien geriatri, Depok',
    },
    {
      name: 'Ibu Ratna',
      text:
        'Pemantauan tensi dan obat harian jadi praktis. Perawat selalu datang ' +
        'tepat waktu dan laporannya sangat detail membantu kami.',
      role: 'Keluarga pasien, Tangerang',
    },
  ],

  // — CTA WhatsApp —
  waMessage:
    'Halo Insan Care, saya ingin berkonsultasi mengenai layanan homecare lansia / perawatan paliatif untuk keluarga saya.',
};

export default assertSiteContent(content);
