# ALDIAN.ID Integrity Defender — Prototype V2.2.0

Prototipe edukasi integritas bergaya pixel-RPG untuk GitHub Pages. Tersedia dua mode yang saling melengkapi: action platformer dan latihan pengambilan keputusan berbasis skenario.

## Mode 1 — Action RPG

Pemain mengendalikan Aldian, menghindari serangan, mengumpulkan evidence, menggunakan Integrity Pulse dan Integrity Shield, lalu menyelesaikan empat arena:

1. Vendor District — risiko gratifikasi.
2. Drilling Yard — upaya suap.
3. Records Facility — manipulasi data.
4. Corruption HQ — Corruption King dengan tiga fase serangan.

Setiap area menampilkan field debrief berisi konteks dan prinsip integritas.

### Kontrol
- `A` / `D` atau `←` / `→`: bergerak.
- `Space` / `↑` / `W`: melompat.
- `J` / `X`: Integrity Pulse.
- `K` / `C`: Integrity Shield.
- `Esc`: pause / resume.
- Smartphone: tombol kiri/kanan, JUMP, PULSE, dan SHIELD di bawah arena.
- Combo: 3 hit beruntun memberi damage Pulse ×2; 6 hit memberi ×3. Combo terputus jika pemain terkena serangan atau jeda hit melebihi 2,4 detik.

## Mode 2 — Decision Training

Mode berbasis pilihan dapat dibuka langsung dari mission briefing atau tautan di bawah arena. Alurnya terdiri dari empat chapter kasus — gratifikasi, suap, integritas data, dan konflik kepentingan — lalu final boss dengan tiga ronde: pekerjaan tanpa verifikasi, pemecahan invoice untuk menghindari otorisasi, dan upaya menyembunyikan pembayaran.

Setiap ronde menyediakan tiga opsi. Setelah pemain memilih, game menampilkan perubahan **Integrity Points**, konsekuensi pilihan, umpan balik, dan prinsip yang sebaiknya diterapkan. Integrity dimulai dari 40/100; pilihan yang tepat menambah poin dan melemahkan boss, sedangkan pilihan yang berisiko mengurangi poin. Progres dan pencapaian tersimpan di `localStorage` browser.

## Integrasi dan publikasi

Homepage utama ALDIAN.ID sudah memiliki navigasi dan launcher menuju folder ini. Untuk memperbarui game, unggah/perbarui folder `integrity-defender/` saja. Jangan menimpa `index.html` di root repository karena file tersebut berisi penyesuaian homepage pribadi.

URL:
- Homepage: https://iam-aldian.github.io/
- Action RPG: https://iam-aldian.github.io/integrity-defender/
- Decision Training: https://iam-aldian.github.io/integrity-defender/training/

Tidak ada backend atau dependensi JavaScript eksternal. Google Fonts hanya untuk tipografi dan memiliki fallback font.

## Ringkasan pemeriksaan — 15 November 2026

Pemeriksaan source-level sebelum commit:
- Parsing/syntax JavaScript untuk `game.js` dan `training/game.js`: lulus.
- Pemeriksaan ID HTML yang dirujuk dari JavaScript: tidak ditemukan ID yang hilang.
- Event handler utama untuk start, pause/resume, pergantian area, hasil, dan kontrol sentuh ditemukan di source.
- Lima topik edukasi dan tiga ronde boss pada Decision Training teridentifikasi.
- Kontrol sentuh menggunakan Pointer Events dan pointer capture untuk tombol gerak.

Belum dilakukan pengujian visual/interaksi langsung pada browser desktop atau perangkat smartphone fisik dalam sesi ini. Karena itu kompatibilitas perangkat nyata tetap perlu diuji setelah GitHub Pages selesai memperbarui deployment.

## Batasan edukasi

Seluruh karakter, vendor, transaksi, dan kejadian adalah fiktif. Game bukan kebijakan resmi, bukan kanal pelaporan, dan tidak memakai data atau dokumen internal Pertamina Hulu Mahakam. Untuk situasi nyata, ikuti kebijakan dan kanal resmi organisasi masing-masing.
