import sharp from 'sharp';
import path from 'path';

const artifactDir = '/Users/salman/.gemini/antigravity-ide/brain/2597557a-745d-4cd2-af9d-8a43d7f1e3b0';
const targetDir = './public/images';

const mappings = [
  {
    src: 'hero_perawat_lansia_1782835396578.png',
    dest: 'hero_perawat_lansia.webp'
  },
  {
    src: 'perawatan_paliatif_1782835411108.png',
    dest: 'perawatan_paliatif.webp'
  },
  {
    src: 'pemantauan_vital_1782835429737.png',
    dest: 'pemantauan_vital.webp'
  },
  {
    src: 'pendampingan_aktivitas_1782835450755.png',
    dest: 'pendampingan_aktivitas.webp'
  }
];

async function convert() {
  for (const map of mappings) {
    const srcPath = path.join(artifactDir, map.src);
    const destPath = path.join(targetDir, map.dest);
    console.log(`Converting ${srcPath} to ${destPath}...`);
    await sharp(srcPath)
      .webp({ quality: 85 })
      .toFile(destPath);
    console.log(`Saved ${map.dest}`);
  }
  console.log('All images successfully converted and saved.');
}

convert().catch(err => {
  console.error('Error during conversion:', err);
  process.exit(1);
});
