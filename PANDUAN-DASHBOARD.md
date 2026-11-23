# Panduan dashboard portofolio

Dashboard memakai **Pages CMS** (app.pagescms.org). Kamu login dengan GitHub, upload foto, isi keterangan, lalu klik Save. Website di Netlify ikut ter-update otomatis dalam 1–2 menit.

Alurnya: Pages CMS → menyimpan ke repository GitHub → Netlify membaca GitHub dan memperbarui website.

## Setup (sekali saja)

### 1. Taruh website di GitHub
1. Daftar atau masuk di github.com.
2. Klik **New repository**. Nama: `portfolio`. Pilih **Public** atau **Private** (dua-duanya bisa). Klik **Create repository**.
3. Klik **uploading an existing file**.
4. Seret isi folder ini ke halaman itu: `index.html`, `work.html`, `style.css`, `main.js`, `.pages.yml`, folder `images`, folder `content`.
   - Jangan unggah folder `.claude`.
   - File `.pages.yml` wajib ikut. Kalau tidak terlihat di File Explorer, aktifkan **View → Show → Hidden items**.
5. Klik **Commit changes**.

### 2. Sambungkan Netlify ke GitHub
1. Buka app.netlify.com → **Add new project** → **Import an existing project** → **GitHub**.
2. Izinkan Netlify mengakses GitHub, lalu pilih repository `portfolio`.
3. Biarkan **Build command** kosong. Isi **Publish directory** dengan `.` (titik) atau biarkan kosong.
4. Klik **Deploy**.
5. Kalau sebelumnya sudah punya site hasil drag-and-drop, kamu bisa hapus site lama itu, lalu ganti nama site baru di **Site configuration → Change site name**.

### 3. Buka dashboard
1. Buka app.pagescms.org dan klik **Sign in with GitHub**.
2. Klik **Install** pada GitHub App, lalu pilih repository `portfolio`.
3. Buka repository `portfolio`. Di menu kiri akan muncul **Photography**, **Branding**, **Editorial**, **Website**.

## Cara pakai sehari-hari

**Menambah foto**
1. Buka kategori, misalnya **Branding**.
2. Di bagian **Foto portofolio**, klik **Add an entry** (tombol tambah).
3. Klik kolom **Foto**, upload gambar dari komputer atau HP, lalu pilih.
4. Isi **Keterangan foto** kalau mau (boleh kosong).
5. Klik **Save**. Tunggu 1–2 menit, lalu refresh website.

**Mengubah urutan:** seret entri foto ke atas atau ke bawah, lalu Save. Urutan di dashboard = urutan di website.

**Menghapus foto:** hapus entrinya, lalu Save. File gambarnya tetap tersimpan di folder `images`. Hapus juga lewat menu **Media** kalau mau benar-benar dibuang.

**Mengubah judul atau keterangan kategori:** ubah kolom **Judul halaman** dan **Keterangan singkat**, lalu Save.

## Tips
- Ukuran foto ideal di bawah 500 KB. Foto langsung dari kamera biasanya 3–10 MB dan membuat website lambat. Kecilkan dulu, misalnya lewat squoosh.app.
- Format yang aman: JPG, PNG, WebP.
- Yang bisa diatur dari dashboard saat ini: foto, keterangan foto, judul, dan keterangan tiap kategori. Teks di halaman utama (headline, perkenalan, kartu) masih diubah langsung di `index.html`.
