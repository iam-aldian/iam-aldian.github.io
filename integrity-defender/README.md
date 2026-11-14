# ALDIAN.ID Integrity Defender — Action RPG V2.1.1

Game aksi 2D bergaya pixel-art untuk GitHub Pages. Pemain mengendalikan Aldian dengan keyboard atau tombol sentuh, menghindari serangan, mengumpulkan evidence, menembakkan Integrity Pulse, dan memakai Integrity Shield.

## Kontrol
- `A` / `D` atau `←` / `→`: bergerak.
- `Space` / `↑` / `W`: melompat.
- `J` / `X`: Integrity Pulse.
- `K` / `C`: Integrity Shield.
- Combo: 3 hit beruntun memberi damage Pulse ×2; 6 hit memberi ×3. Combo terputus jika pemain terkena serangan atau jeda hit melebihi 2,4 detik.
- `Esc`: pause / resume.
- Smartphone: tombol kiri/kanan, JUMP, PULSE, SHIELD di bawah arena.

## Arena
1. Vendor District — Mr. Gratification.
2. Drilling Yard — Bribery Master.
3. Records Facility — Data Manipulator.
4. Corruption HQ — Corruption King dengan tiga fase serangan.

Setiap zona yang berhasil diselesaikan menampilkan field debrief berisi konteks edukatif dan prinsip integritas. Progres, best score, dan achievement disimpan di `localStorage` browser.

## Mode edukasi tambahan
Kuis berbasis kasus dari Integrity Defender V1 dipertahankan di `training/`. Action RPG adalah mode utama; Training Mode dapat dibuka dari kartu di bawah arena.

## Cara integrasi ke homepage ALDIAN.ID
Homepage utama ALDIAN.ID saat ini sudah memiliki navigasi dan Arcade launcher menuju `integrity-defender/`. Bagian lain homepage dipertahankan. Game ini dipublikasikan di:

`https://iam-aldian.github.io/integrity-defender/`

Struktur folder:

```text
repository/
├── index.html                 # homepage pribadi (penyesuaian user dipertahankan)
└── integrity-defender/
    ├── index.html             # Action RPG V2.1
    ├── style.css
    ├── game.js
    ├── assets/
    │   ├── aldian-sprites.svg
    │   └── corruption-king-sprites.svg
    ├── README.md
    └── training/
        ├── index.html         # Quiz V1 / Training Mode
        ├── style.css
        └── game.js
```

Tidak ada backend atau dependensi eksternal untuk menjalankan gameplay. Google Fonts bersifat opsional; ada fallback font.

## Catatan edukasi
Skenario dan karakter fiktif. Game bukan kebijakan resmi, bukan kanal pelaporan, dan tidak menggunakan data atau dokumen internal perusahaan. Pesan edukatif mendorong pemain mengikuti kebijakan dan kanal resmi organisasinya.
