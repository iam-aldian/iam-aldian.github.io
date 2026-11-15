# Integrasi Integrity Defender V2.2.0

Integrity Defender sudah terpasang di repository ALDIAN.ID sebagai dua mode:
- **Action RPG**: platformer pixel-art dengan empat arena dan field debrief.
- **Decision Training**: empat chapter kasus dan final boss tiga ronde, dengan Integrity Points, feedback untuk setiap pilihan, dan progres tersimpan lokal.

Homepage utama sudah memiliki:
- Link navigasi **Integrity Defender**.
- Kartu launcher **PLAY INTEGRITY DEFENDER** setelah bagian Field Run dan sebelum Kontak.

Perubahan pada homepage utama tidak diperlukan untuk pembaruan ini. Penyesuaian homepage yang sudah ada tetap dipertahankan.

## Struktur
```text
iam-aldian.github.io/
├── index.html
└── integrity-defender/
    ├── index.html
    ├── style.css
    ├── game.js
    ├── assets/
    │   ├── aldian-sprites.svg
    │   └── corruption-king-sprites.svg
    ├── README.md
    └── training/
        ├── index.html
        ├── style.css
        └── game.js
```

## URL
- Homepage: https://iam-aldian.github.io/
- Action RPG: https://iam-aldian.github.io/integrity-defender/
- Decision Training: https://iam-aldian.github.io/integrity-defender/training/

## Cara update

1. Unggah isi folder `integrity-defender/` ke path yang sama di repository.
2. Commit ke branch `main`.
3. Tunggu GitHub Pages selesai deploy, lalu hard refresh halaman bila browser masih memakai cache lama.
4. Jangan replace root `index.html` saat hanya memperbarui game.

## Catatan
Semua skenario fiktif dan tidak merepresentasikan kebijakan atau kasus internal perusahaan. Tidak ada backend; penyimpanan progres memakai `localStorage` pada browser masing-masing.
