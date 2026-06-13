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
  template: 'clean-medical',
  palette: 'bright-health',

  // — Wajib —
  websiteName: 'Fisiomove Homecare',
  description:
    'Fisioterapi profesional langsung ke rumah Anda. Pemulihan pasca ' +
    'stroke, nyeri sendi, cedera olahraga, dan rehabilitasi lansia ' +
    'ditangani fisioterapis ber-STR dengan program yang terukur dan ' +
    'jadwal yang menyesuaikan ritme keluarga Anda.',
  serviceType: 'both',
  waNumber: '081234567890',

  // — Turunan Order (opsional) —
  practiceHours:
    'Senin–Jumat 07.00–20.00 WIB, Sabtu 07.00–16.00 WIB, ' +
    'sesi kunjungan pagi dan sore dengan perjanjian.',
  location:
    'Melayani area Jakarta Selatan, Depok, Tangerang Selatan, dan ' +
    'sekitarnya. Basis praktik di Jl. Melati Raya No. 12, Cilandak, ' +
    'Jakarta Selatan.',
  googleMaps:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.123!2d106.79!3d-6.29!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sCilandak!5e0!3m2!1sid!2sid!4v1700000000000',

  photos: {
    nakes: [
      { url: 'nakes-1.webp', caption: 'Ftr. Rina Wijaya, fisioterapis penanggung jawab' },
      { url: 'nakes-2.webp', caption: 'Sesi latihan mobilisasi bersama fisioterapis' },
    ],
    ruangan: [
      { url: 'ruangan-1.webp', caption: 'Ruang terapi dengan matras rehabilitasi' },
      { url: 'ruangan-2.webp', caption: 'Area latihan gerak yang lapang dan aman' },
    ],
    alat: [
      { url: 'alat-1.webp', caption: 'Unit TENS untuk terapi nyeri' },
      { url: 'alat-2.webp', caption: 'Resistance band dan alat latihan fungsional' },
    ],
    hasil: [
      { url: 'hasil-1.webp', caption: 'Latihan pemulihan rentang gerak lutut' },
      { url: 'hasil-2.webp', caption: 'Pendampingan latihan jalan pasca stroke' },
    ],
  },

  // — Konten —
  tagline: 'Gerak kembali, pulih di rumah sendiri',
  about:
    'Fisiomove Homecare lahir dari satu keyakinan sederhana: pemulihan ' +
    'terbaik terjadi di tempat Anda merasa paling nyaman. Tim kami terdiri ' +
    'dari fisioterapis ber-STR aktif dengan pengalaman menangani kasus ' +
    'neurologis, ortopedi, dan geriatri di rumah sakit rujukan.\n\n' +
    'Setiap program dimulai dari asesmen menyeluruh, lalu disusun menjadi ' +
    'rencana terapi terukur dengan target mingguan yang jelas. Kami ' +
    'mendampingi mulai dari latihan rentang gerak, penguatan otot, ' +
    'reedukasi jalan, hingga edukasi keluarga agar proses pemulihan tetap ' +
    'berjalan di antara kunjungan.',

  credentials: [
    { label: 'Fisioterapis ber-STR aktif', icon: '🩺' },
    { label: 'Sertifikat manual therapy', icon: '🏅' },
    { label: 'Pelatihan rehabilitasi neuro', icon: '🧠' },
    { label: 'Mitra resmi BPJS', icon: '🤝' },
  ],

  services: [
    {
      title: 'Rehabilitasi Pasca Stroke',
      description:
        'Program reedukasi gerak, latihan keseimbangan, dan penguatan ' +
        'sisi tubuh yang melemah untuk memulihkan kemandirian.',
      icon: '🧠',
    },
    {
      title: 'Terapi Nyeri Sendi & Punggung',
      description:
        'Penanganan nyeri lutut, bahu, dan low back pain dengan manual ' +
        'therapy serta modalitas TENS dan terapi latihan.',
      icon: '🦴',
    },
    {
      title: 'Pemulihan Cedera Olahraga',
      description:
        'Rehabilitasi pasca cedera dan pasca operasi agar Anda kembali ' +
        'bergerak aktif dengan aman dan bertahap.',
      icon: '🏃',
    },
    {
      title: 'Fisioterapi Geriatri',
      description:
        'Latihan mobilitas, pencegahan jatuh, dan penguatan otot untuk ' +
        'menjaga kemandirian lansia di rumah.',
      icon: '👵',
    },
  ],

  howItWorks: [
    {
      step: 1,
      title: 'Hubungi via WhatsApp',
      description: 'Ceritakan keluhan dan kebutuhan terapi Anda melalui WhatsApp kami.',
    },
    {
      step: 2,
      title: 'Asesmen Awal',
      description:
        'Fisioterapis menilai kondisi dan menyusun program terapi terukur sesuai target Anda.',
    },
    {
      step: 3,
      title: 'Terapi di Rumah',
      description:
        'Fisioterapis datang tepat waktu dan memandu setiap sesi latihan sesuai standar klinis.',
    },
    {
      step: 4,
      title: 'Evaluasi & Tindak Lanjut',
      description:
        'Anda menerima catatan perkembangan dan rencana latihan mandiri antar kunjungan.',
    },
  ],

  testimonials: [
    {
      name: 'Bapak Hadi',
      text:
        'Ayah saya pasca stroke kini bisa berjalan dengan walker. ' +
        'Fisioterapisnya sabar dan setiap latihan dijelaskan dengan detail.',
      role: 'Keluarga pasien, Depok',
    },
    {
      name: 'Ibu Sari',
      text:
        'Nyeri lutut saya jauh berkurang setelah beberapa sesi di rumah. ' +
        'Tidak perlu repot bolak-balik ke klinik dan jadwalnya fleksibel.',
      role: 'Pasien terapi nyeri, Jakarta Selatan',
    },
    {
      name: 'Ibu Lestari',
      text:
        'Pemulihan pasca operasi lutut ibu saya sangat terbantu. Programnya ' +
        'jelas dan perkembangannya dicatat rapi setiap kunjungan.',
      role: 'Keluarga pasien homecare',
    },
  ],

  // — CTA WhatsApp —
  waMessage:
    'Halo Fisiomove Homecare, saya ingin berkonsultasi tentang layanan fisioterapi di rumah.',
};

export default assertSiteContent(content);
