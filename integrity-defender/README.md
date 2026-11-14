# ALDIAN.ID Integrity Defender — Action RPG V2

Game aksi 2D bergaya pixel-art untuk GitHub Pages. Pemain mengendalikan Aldian dengan keyboard atau tombol sentuh, menghindari serangan, mengumpulkan evidence, menembakkan Integrity Pulse, dan memakai Integrity Shield.

## Kontrol
- `A` / `D` atau `←` / `→`: bergerak.
- `Space` / `↑` / `W`: melompat.
- `J` / `X`: Integrity Pulse.
- `K` / `C`: Integrity Shield.
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
Homepage V6.2 yang sudah memiliki link/kartu `integrity-defender/` tidak perlu diubah. Upload/replace folder `integrity-defender/` ini di root repository, sehingga URL game tetap:

`https://USERNAME.github.io/NAMA-REPOSITORY/integrity-defender/`

Struktur folder:

```text
repository/
├── index.html                 # homepage V6.2, tetap dipertahankan
└── integrity-defender/
    ├── index.html             # Action RPG V2
    ├── style.css
    ├── game.js
    ├── README.md
    └── training/
        ├── index.html         # Quiz V1 / Training Mode
        ├── style.css
        └── game.js
```

Tidak ada backend atau dependensi eksternal untuk menjalankan gameplay. Google Fonts bersifat opsional; ada fallback font.

## Catatan edukasi
Skenario dan karakter fiktif. Game bukan kebijakan resmi, bukan kanal pelaporan, dan tidak menggunakan data atau dokumen internal perusahaan. Pesan edukatif mendorong pemain mengikuti kebijakan dan kanal resmi organisasinya.
