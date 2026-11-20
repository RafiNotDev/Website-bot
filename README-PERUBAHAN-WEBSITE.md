# Rafibot Management — UI Refresh

## Perubahan
- Perombakan visual dashboard dengan tema gelap modern, panel rapat, responsif untuk desktop dan ponsel.
- Animasi pembuka baru; menghilangkan animasi logo berputar.
- Navigasi halaman Game HTML dan Dunia RPG.
- Katalog 50 mini-game dengan tantangan dan hadiah koin/EXP.
- Profil RPG tersimpan di database JSON/PostgreSQL dashboard: uang, EXP, level, HP, energi, statistik, inventaris, dan log aktivitas.
- Aktivitas RPG: bekerja, bertani, berdagang hasil panen, berburu, mencuri, bertarung, istirahat.
- Toko item RPG: ramuan HP, ramuan energi, perisai kayu, dan jimat.
- Pertukaran item antar akun berdasarkan nama pemain.
- Musik website: pemilihan track di header dan upload khusus role developer/owner. File tersimpan di `public/uploads/music`.
- Panel pemutar musik bawah disembunyikan agar tidak menutupi tombol/fitur lain.

## Catatan
- Fitur bot WhatsApp, login, monitoring, tools existing, dan fitur dashboard lama tetap dipertahankan sebagai basis.
- Hadiah mini-game memakai batas klaim 1 kali per 10 detik di server. Ini fondasi reward sederhana, belum sistem anti-cheat kompetitif.
- 50 game saat ini berupa mini-game browser dengan beberapa pola tantangan yang digunakan ulang; bukan 50 game besar dengan engine dan level unik.
- Autoplay audio mengikuti kebijakan browser. Jika browser memblokir autoplay, pengguna perlu menekan tombol musik sekali.
- Database RPG mengikuti mode database dashboard yang aktif (PostgreSQL bila `DATABASE_URL` tersedia, fallback JSON bila tidak).


## Pembaruan galeri musik dan mini game
- Developer memiliki panel khusus Galeri Musik untuk mengunggah file audio dari perangkat (maks. 20 MB).
- Musik baru ditambahkan ke daftar database tanpa menghapus track sebelumnya; seluruh pengguna dapat memilih track di kontrol musik header.
- Pilihan musik terakhir disimpan pada browser pengguna. Autoplay dicoba, tetapi browser tetap dapat meminta interaksi pengguna.
- Kuis Sains, Tebak Bendera, Tebak Hewan, Tebak Film, Asah Otak, Susun Kata, Matematika Pro, dan Memory Flip menggunakan materi/mekanisme yang sesuai nama game.
- Hadiah tetap memakai endpoint RPG yang sudah ada: +10 koin dan +5 EXP per penyelesaian yang berhasil.


## Pembaruan lanjutan (20 November 2026)
- Foto avatar kini dirender sebagai elemen gambar dengan ukuran penuh dan `object-fit: cover`, sehingga foto pas di dalam kotak avatar.
- Menekan area avatar sidebar membuka kartu profil berisi nama, username tampilan, email, Edit Profil, dan Logout.
- Edit Profil mengarahkan pengguna ke bagian profil di halaman Preferensi.
- Pembuatan bot baru langsung membuka panel Pengaturan Bot; tombol Kelola Profil Bot untuk bot yang sudah ada tetap membuka tampilan detail normal.
- Memperbaiki galeri musik yang sebelumnya belum memiliki handler upload/list/pilih/hapus di sisi browser.
- Upload musik memakai data biner file langsung, validasi format/ukuran, dan menambahkan track ke galeri tanpa menghapus track lama.
- Menambahkan pemilihan musik di header untuk semua pengguna dan kontrol pemutar.


## Visual HTML Arcade (40 game)
- Menambahkan 40 dunia mini-game visual dengan cover ilustratif, layar monitor canvas, tombol kiri/kanan/lompat/lari, dukungan keyboard dan kontrol sentuh, koin, nyawa, skor, serta hadiah RPG/EXP melalui endpoint reward yang sudah ada.
