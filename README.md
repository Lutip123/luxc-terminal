# ⚡ Luxc // Arch Linux Hacker Web Terminal

<p align="center">
  <img src="https://img.shields.io/badge/Arch_Linux-Simulated-1793d1?style=for-the-badge&logo=arch-linux&logoColor=white" />
  <img src="https://img.shields.io/badge/Theme-Matrix_Green-00ff66?style=for-the-badge&logo=terminal&logoColor=black" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" />
</p>

**Luxc** adalah web-based terminal simulator dengan tema **Hacker Retro Green Phosphor / CRT & Matrix Rain** berbasis lingkungan **Arch Linux**. Dapat dijalankan di jaringan lokal dan dibuka di Google Chrome / browser lain menggunakan IP LAN.

---

## 🚀 Fitur Unggulan

- 🟢 **Retro Hacker Aesthetic:** Efek CRT scanlines, green glow bloom, Matrix code rain background, dan suara ketikan keyboard mekanik sintetis (Web Audio API).
- 🐧 **Arch Linux Experience:**
  - `neofetch` kustom dengan logo Arch Linux & spesifikasi sistem.
  - `pacman` simulation: `pacman -Syu`, `pacman -S <pkg>`, `pacman -Ss <query>`.
  - In-Terminal Text Editor: `nano <file>` atau `vim <file>`.
  - Interactive `htop` / `top` process monitor.
- 📁 **Virtual Persistent Filesystem (VFS):** Struktur direktori Linux `/home/luxc`, `/etc`, `/bin`, `/var/log` yang tersimpan otomatis di `localStorage`.
- 🛡️ **Hacker Tools:** Port scanner `nmap`, `ping`, `curl`, visualisasi `bruteforce` & `decrypt`, `cmatrix` fullscreen, dan `ip`/`ifconfig`.
- 🌐 **Auto LAN IP Detection:** Otomatis mendeteksi IP lokal mesin sehingga bisa diakses dari HP atau device lain di satu WiFi.

---

## 📦 Cara Instalasi & Menjalankan

### Prasyarat
- [Node.js](https://nodejs.org/) (versi 16 atau lebih baru)

### Langkah Cepat
```bash
# 1. Clone repository ini
git clone https://github.com/USERNAME_KAMU/luxc-terminal.git

# 2. Masuk ke folder project
cd luxc-terminal

# 3. Install dependencies
npm install

# 4. Jalankan server
npm start
```

Setelah server aktif, buka browser Chrome di:
- **Lokal:** `http://localhost:3000`
- **Jaringan LAN:** `http://<IP_KOMPUTER_KAMU>:3000`

---

## ⌨️ Daftar Perintah (Cheatsheet)

| Perintah | Deskripsi |
| :--- | :--- |
| `help` | Menampilkan bantuan perintah |
| `neofetch` | Spesifikasi sistem & logo Arch Linux |
| `pacman -Syu` | Simulasi update paket sistem Arch |
| `pacman -S <pkg>` | Install paket baru (cth: nmap, metasploit, htop) |
| `cmatrix` | Layar penuh hujan digital Matrix (`q` untuk keluar) |
| `nano <file>` | Editor teks in-terminal (`Ctrl+O` simpan, `Ctrl+X` keluar) |
| `htop` | Monitor proses CPU & RAM interaktif |
| `nmap <host>` | Simulasi port scanner |
| `ping <host>` | Cek latency jaringan |
| `theme <nama>` | Ganti tema (matrix, cyan, amber, blood, purple, white) |
| `audio` | Nyalakan/matikan suara keyboard mekanik |

---

## 📄 Lisensi
Distributed under the **MIT License**.
