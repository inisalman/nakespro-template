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
  websiteName: 'Peduli Luka — Layanan Perawatan Luka Modern',
  description:
    'Layanan perawatan luka profesional oleh perawat bersertifikat langsung ' +
    'di rumah Anda atau klinik. Melayani luka diabetes, luka bakar, ' +
    'pasca operasi, dan luka kronis dengan metode modern dressing.',
  serviceType: 'both',
  waNumber: '081234567890',

  // — Turunan Order (opsional) —
  practiceHours:
    'Senin–Minggu 08.00–20.00 WIB, melayani panggilan homecare dengan perjanjian. ' +
    'Layanan konsultasi darurat luka via WhatsApp tersedia 24 jam.',
  location:
    'Melayani area Jakarta, Depok, Tangerang, dan Bekasi. ' +
    'Klinik pusat di Jl. Sehat Raya No. 10, Jakarta Selatan.',
  googleMaps:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.123!2d106.79!3d-6.29!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sCilandak!5e0!3m2!1sid!2sid!4v1700000000000',

  heroPhoto: { url: 'hero.webp', caption: 'Ns. Ahmad Fauzi, S.Kep., perawat spesialis perawatan luka' },

  photos: [
    { url: 'luka_diabetes.webp', caption: 'Perawatan luka diabetes (gangren) menggunakan metode modern dressing' },
    { url: 'luka_bakar.webp', caption: 'Penanganan luka bakar dengan teknik steril dan balutan khusus' },
    { url: 'luka_operasi.webp', caption: 'Perawatan luka pasca operasi agar cepat kering dan rapi' },
    { url: 'luka_kanker.webp', caption: 'Perawatan luka kanker paliatif untuk mengurangi aroma dan nyeri' },
    { url: 'nakes-1.webp', caption: 'Ns. Ahmad Fauzi, S.Kep., bersertifikat Certified Wound Care Clinician (CWCC)' },
    { url: 'nakes-2.webp', caption: 'Edukasi perawatan luka mandiri kepada keluarga pasien' },
    { url: 'ruangan-1.webp', caption: 'Ruang tindakan klinik yang steril dan nyaman untuk pasien' },
    { url: 'ruangan-2.webp', caption: 'Fasilitas konsultasi kesehatan yang ramah dan representatif' },
  ],

  // — Konten —
  tagline: 'Penyembuhan Optimal dengan Perawatan Luka Modern & Higienis',
  about:
    'Peduli Luka adalah penyedia layanan perawatan luka modern (modern wound dressing) ' +
    'yang ditangani oleh tim perawat profesional bersertifikat (Certified Wound Care Clinician). ' +
    'Kami hadir untuk memberikan perawatan luka yang tepat, aman, dan minim nyeri guna ' +
    'mempercepat proses regenerasi jaringan kulit dan mencegah risiko amputasi.\n\n' +
    'Dengan metode modern dressing, luka tidak perlu diganti setiap hari sehingga pasien ' +
    'merasa lebih nyaman dan terhindar dari trauma saat ganti perban. Kami melayani ' +
    'tindakan langsung di klinik kami maupun kunjungan homecare ke rumah Anda untuk ' +
    'berbagai jenis luka seperti luka diabetes (gangren), luka dekubitus, luka bakar, ' +
    'luka pasca operasi, hingga luka kanker.',

  credentials: [
    { label: 'Perawat Ber-STR & Bersertifikat', icon: '🩺' },
    { label: 'Spesialis Luka (CWCC)', icon: '🏅' },
    { label: 'Metode Modern Dressing', icon: '🩹' },
    { label: 'Layanan Homecare Siaga', icon: '🚗' },
  ],

  services: [
    {
      title: 'Perawatan Luka Diabetes',
      description:
        'Penanganan luka gangren secara tepat dengan metode modern dressing ' +
        'untuk menjaga kelembapan luka dan mempercepat penyembuhan kulit.',
      image: 'luka_diabetes.webp',
    },
    {
      title: 'Perawatan Luka Pasca Operasi',
      description:
        'Perawatan bekas jahitan bedah caesar, usus buntu, atau operasi lainnya ' +
        'agar luka cepat kering, bebas dari infeksi, dan menyisakan luka minimal.',
      image: 'luka_operasi.webp',
    },
    {
      title: 'Perawatan Luka Bakar',
      description:
        'Pembersihan dan pemberian balutan modern khusus luka bakar guna meredakan ' +
        'nyeri, mencegah lepuhan pecah terinfeksi, dan meminimalkan bekas luka.',
      image: 'luka_bakar.webp',
    },
    {
      title: 'Perawatan Luka Kanker',
      description:
        'Asuhan luka kanker secara paliatif untuk mengontrol bau tidak sedap, ' +
        'menyerap cairan luka berlebih, serta meningkatkan kenyamanan pasien.',
      image: 'luka_kanker.webp',
    },
  ],

  howItWorks: [
    {
      step: 1,
      title: 'Konsultasi & Kirim Foto Luka',
      description: 'Kirimkan foto kondisi luka pasien via WhatsApp untuk konsultasi awal gratis.',
    },
    {
      step: 2,
      title: 'Penentuan Rencana Tindakan',
      description: 'Perawat spesialis luka akan menyarankan metode balutan dan estimasi biaya.',
    },
    {
      step: 3,
      title: 'Kunjungan atau Tindakan',
      description: 'Tindakan perawatan luka dilakukan secara higienis di klinik atau di rumah Anda.',
    },
    {
      step: 4,
      title: 'Pantauan Proses Pemulihan',
      description: 'Evaluasi perkembangan luka secara berkala hingga luka menutup dan sembuh total.',
    },
  ],

  testimonials: [
    {
      name: 'Pak H. Wahyudi',
      text:
        'Sangat terbantu dengan layanan homecare. Luka diabetes di kaki saya ' +
        'yang tadinya parah kini sudah menutup rapat berkat ketelatenan perawat di sini.',
      role: 'Pasien Luka Diabetes, Jakarta',
    },
    {
      name: 'Ibu Ratna',
      text:
        'Luka pasca operasi caesar saya sempat basah dan nyeri. Setelah dirawat ' +
        '2 kali dengan perban modern, luka langsung kering dan nyaman dibuat beraktivitas.',
      role: 'Pasien Luka Pasca Operasi, Depok',
    },
    {
      name: 'Mas Dedi',
      text:
        'Perawatnya sangat profesional dan menjelaskan dengan detail cara menjaga kebersihan ' +
        'luka bakar saya di rumah. Sangat direkomendasikan!',
      role: 'Pasien Luka Bakar, Tangerang',
    },
  ],

  // — CTA WhatsApp —
  waMessage:
    'Halo Peduli Luka, saya ingin berkonsultasi mengenai perawatan luka.',
};

export default assertSiteContent(content);
