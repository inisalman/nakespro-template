// components.unit.test.ts — unit/example test komponen struktural & palette.
//
// Validates (Testing Strategy §2):
//   - Footer memuat "Powered by NakesPro" (R3.15)
//   - Hero memuat foto nakes + WA CTA accessible name tidak kosong (R3.3, R11.4)
//   - DEFAULT_PALETTE_ID valid; jumlah preset 3–4 id unik (R6.1, R6.6)
//   - iframe Maps punya title (R11.6)
//   - skenario foto hilang: STRICT gagal (R8.7), PLACEHOLDER lanjut (R9.7)
import { describe, expect, it } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Footer from '../components/Footer.astro';
import Hero from '../components/Hero.astro';
import ContactLocation from '../components/ContactLocation.astro';
import palettes, { DEFAULT_PALETTE_ID } from '../palettes.ts';
import {
  resolvePhotoPath,
  MissingPhotoError,
} from '../lib/images.ts';
import type { SiteContent } from '../types.ts';

async function render(Component: any, props: Record<string, unknown> = {}) {
  const container = await AstroContainer.create();
  return container.renderToString(Component, { props });
}

const baseContent: SiteContent = {
  template: 'modern-light',
  palette: 'neutral',
  websiteName: 'Klinik Sehat',
  description: 'Deskripsi layanan',
  serviceType: 'both',
  waNumber: '081234567890',
  heroPhoto: { url: 'nakes-1.webp', caption: 'Perawat' },
  photos: [{ url: 'nakes-1.webp', caption: 'Perawat' }],
};

describe('Footer (R3.15)', () => {
  it('selalu memuat "Powered by NakesPro"', async () => {
    const html = await render(Footer);
    expect(html).toContain('Powered by NakesPro');
  });
});

describe('Hero (R3.3, R11.4)', () => {
  it('memuat heroPhoto dan WA CTA dengan accessible name tidak kosong', async () => {
    const html = await render(Hero, { content: baseContent });
    expect(html).toContain('/images/nakes-1.webp');
    // WA CTA punya aria-label tidak kosong.
    const m = html.match(/aria-label="([^"]+)"/);
    expect(m).not.toBeNull();
    expect((m![1] ?? '').trim().length).toBeGreaterThan(0);
    expect(html.toLowerCase()).toContain('whatsapp');
  });

  it('tepat satu h1 di Hero', async () => {
    const html = await render(Hero, { content: baseContent });
    expect((html.match(/<h1[\s>]/g) || []).length).toBe(1);
  });
});

describe('Palette preset (R6.1, R6.6)', () => {
  it('DEFAULT_PALETTE_ID menunjuk preset valid', () => {
    expect(palettes.some((p) => p.id === DEFAULT_PALETTE_ID)).toBe(true);
  });
  it('jumlah preset 3–4 dengan id unik', () => {
    expect(palettes.length).toBeGreaterThanOrEqual(3);
    expect(palettes.length).toBeLessThanOrEqual(4);
    const ids = palettes.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('ContactLocation iframe (R11.6)', () => {
  it('iframe Maps punya title tidak kosong', async () => {
    const html = await render(ContactLocation, {
      practiceHours: 'Senin-Jumat',
      location: 'Jakarta',
      googleMaps: 'https://maps.example/embed',
    });
    const m = html.match(/<iframe[^>]*\btitle="([^"]+)"/);
    expect(m).not.toBeNull();
    expect((m![1] ?? '').trim().length).toBeGreaterThan(0);
  });

  it('googleMaps kosong tapi sub-field lain ada → indikasi peta tak tersedia (R3.14)', async () => {
    const html = await render(ContactLocation, {
      practiceHours: 'Senin-Jumat',
      location: 'Jakarta',
      googleMaps: undefined,
    });
    expect(html).toContain('id="contact-h"');
    expect(html).toContain('tidak tersedia');
    expect(html).not.toContain('<iframe');
  });
});

describe('Skenario foto hilang (R8.7, R9.7)', () => {
  const available = ['nakes-1.webp'];

  it('STRICT: foto hilang melempar MissingPhotoError menyebut nama berkas', () => {
    expect(() =>
      resolvePhotoPath('tidak-ada.webp', { available, allowPlaceholder: false }),
    ).toThrow(MissingPhotoError);
    try {
      resolvePhotoPath('tidak-ada.webp', { available, allowPlaceholder: false });
    } catch (e) {
      expect((e as MissingPhotoError).fileName).toBe('tidak-ada.webp');
      expect((e as Error).message).toContain('tidak-ada.webp');
    }
  });

  it('PLACEHOLDER: foto hilang → path placeholder, tidak melempar', () => {
    const result = resolvePhotoPath('tidak-ada.webp', {
      available,
      allowPlaceholder: true,
      placeholder: '/images/placeholder.webp',
    });
    expect(result).toBe('/images/placeholder.webp');
  });

  it('foto tersedia → path publik benar di kedua mode', () => {
    expect(resolvePhotoPath('nakes-1.webp', { available, allowPlaceholder: false })).toBe(
      '/images/nakes-1.webp',
    );
  });
});
