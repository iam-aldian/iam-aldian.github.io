# ALDIAN.ID — Integrity Defender (Prototype V1)

Game edukasi integritas bertema lingkungan kerja minyak & gas. Dibuat dengan HTML, CSS, dan JavaScript murni; tidak membutuhkan framework, build step, server, akun, atau API eksternal. Siap di-host sebagai static site di GitHub Pages.

## Fitur

- 4 skenario utama: gratifikasi, suap, integritas data, dan konflik kepentingan.
- Final boss dengan 3 ronde: pekerjaan tidak terverifikasi, pemecahan tagihan untuk menghindari otorisasi, dan upaya menyembunyikan pembayaran/komunikasi.
- Setiap pilihan memberi atau mengurangi Integrity Points dengan feedback dan penjelasan.
- Boss health bar, Integrity Points bar, laporan hasil, replay, serta 5 achievement.
- Penyimpanan achievement dan best integrity score memakai `localStorage` di browser pengunjung.
- Kontrol desktop: klik pilihan atau tombol `1`, `2`, `3`; `Enter` atau `Space` untuk lanjut setelah feedback.
- Mobile: semua pilihan berupa tombol besar yang dapat disentuh.
- Tampilan pixel-RPG dengan palet cream, terracotta, orange, mint, dan blue yang mengikuti gaya ALDIAN.ID.
- Reduced-motion support dan fallback jika local storage diblokir.
- Tanpa analytics atau pengiriman data pemain ke server.

## Jalankan lokal

Buka `index.html` langsung di browser. Untuk pengujian lokal dengan server statis, dari folder induk jalankan misalnya:

```bash
python -m http.server 8000
```

Lalu buka `http://localhost:8000/integrity-defender/` jika folder game ditempatkan di root project.

## Pasang ke GitHub Pages ALDIAN.ID

1. Extract ZIP.
2. Salin folder `integrity-defender` ke root repository yang sama dengan `index.html` utama dan folder `assets`.
3. Pastikan susunan folder seperti ini:

```text
aldian-portfolio/
├── index.html                  # homepage ALDIAN.ID yang sudah ada
├── assets/
│   └── Aldian_CV_Professional.pdf  # file website yang sudah ada
└── integrity-defender/
    ├── index.html
    ├── style.css
    ├── game.js
    └── README.md
```

4. Tambahkan link navigasi atau kartu game dari `integration-snippets.html` ke homepage utama. Tempatkan di area Arcade/Bonus Experience, misalnya sesudah PHM FIELD RUN.
5. Commit dan push. URL game akan menjadi:

```text
https://USERNAME.github.io/REPOSITORY/integrity-defender/
```

Ganti `USERNAME` dan `REPOSITORY` sesuai alamat GitHub Pages milikmu.

## Tentang skenario dan disclaimer

Semua orang, vendor, perusahaan, data, dan kejadian di game adalah fiktif. Isi game merupakan edukasi umum, bukan kebijakan resmi PHM/Pertamina, nasihat hukum, atau kanal pelaporan. Untuk situasi nyata, ikuti kode etik, kebijakan gratifikasi/anti-suap, prosedur pengadaan, dan kanal pelaporan resmi organisasi masing-masing.

## Penyimpanan

Game hanya menyimpan `unlocked`, `bestIntegrity`, dan `completedRuns` dalam local storage browser dengan key `aldianIntegrityDefenderV1`. Data ini tidak disinkronkan ke perangkat lain. Membersihkan data situs/browser dapat menghapus progress tersebut.

## Catatan prototype

Prototipe ini menggunakan skenario pilihan ganda dan satu final boss berbasis tiga keputusan. Poin awal adalah 40; jawaban etis menambah poin, jawaban berisiko mengurangi poin. Nilai dibatasi antara 0–100. Pemain menang jika menyelesaikan tiga ronde boss dan menurunkan boss HP ke nol. Ini merupakan model gameplay edukatif sederhana, bukan sistem penilaian kepatuhan atau investigasi nyata.
