# NakesPro Template - Deployment Workflow

Repository ini berisi 4 template utama (`modern-light`, `clean-medical`, `calm-warm`, `friendly-care`). Template ini di-build menggunakan **Astro v5 (Static Output)**, sehingga hasil akhirnya berupa **murni HTML, CSS, JS statis** tanpa Node.js runtime.

## 1. Deploy Preview 4 Template (Live)
Untuk preview galeri 4 template (contoh: `modernlight.nakespro.id`), repo ini menggunakan 1 `Dockerfile` dan `nginx.conf` di root direktori. Nginx melayani keempat folder `dist/` sekaligus berdasarkan virtual host (subdomain). Container ini berjalan dengan footprint memori sangat kecil karena menggunakan `nginx:alpine`.

## 2. Workflow Client Baru (Fase 1 - Human CMS)

Ketika ada klien baru yang order (misal memilih template `calm-warm`):

1. **Duplikat Template:**
   Copy folder `calm-warm` ke repo baru, misal `nakespro-custom-klinikandi`.
2. **Input Data:**
   Ubah data klinik (nama, layanan, foto, kontak) di dalam file `src/content.ts`.
3. **Deploy Sangat Ringan (Nginx Static):**
   Taruh `Dockerfile` berikut di root repo klien tersebut agar Easypanel menjalankannya dengan Nginx statis. **Ini penting agar server sangat ringan** (hanya memakan ~5MB RAM per klien, tanpa proses Node.js yang menetap di background):

```dockerfile
# Stage 1: Build sementara menggunakan Node
FROM node:20 AS builder
RUN corepack enable && corepack prepare pnpm@9 --activate
WORKDIR /app
COPY . .
RUN pnpm install && pnpm run build

# Stage 2: Serve menggunakan Nginx (sangat ringan)
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
```

4. **Easypanel Setup:**
   Buat service baru di Easypanel dengan source GitHub klien tersebut, arahkan domain ke `klinikandi.nakespro.id` dan centang HTTPS.

Dengan cara ini, meskipun ada 100 klien, VPS hanya akan menjalankan 100 instance Nginx yang sangat ringan dan tidak pernah crash.
