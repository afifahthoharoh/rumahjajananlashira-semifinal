# 📋 Dokumen Desain & Arsitektur UI/UX
# Rumah Jajan Alshaira ERP Dashboard (Semifinal)

Dokumen ini mendokumentasikan seluruh spesifikasi desain, sistem identitas visual (*brand architecture*), standar komponen UI/UX, dan alur modul operasional untuk sistem **ERP Rumah Jajan Alshaira**.

---

## 🔗 Tautan Referensi Desain & Akses Aplikasi

| Akses | Keterangan & URL |
|---|---|
| **🐙 GitHub Repository** | [github.com/afifahthoharoh/rumahjajananlashira-semifinal](https://github.com/afifahthoharoh/rumahjajananlashira-semifinal) |
| **✨ Google AI Studio / IDX** | [Import Langsung ke Google Project IDX / AI Studio](https://idx.google.com/import?url=https://github.com/afifahthoharoh/rumahjajananlashira-semifinal) |
| **🌐 Public Web Live** | [https://afifahthoharoh.github.io/rumahjajananlashira-semifinal/](https://afifahthoharoh.github.io/rumahjajananlashira-semifinal/) |
| **🎨 Webflow Design Project** | [Buka Proyek Desain Webflow](https://webflow.com/design/rumah-jajan-alshaira-dashboard?utm_medium=project_link&utm_source=designer&utm_content=rumah-jajan-alshaira-dashboard&workflow=comment&pageId=6a9bb6a09f3a062c2d744c82) |
| **💻 Local Development Server** | [http://localhost:3000/](http://localhost:3000/) *(Port: 3000)* |
| **📦 Repository Workspace** | [`rumahjajananlashira-semifinal`](file:///f:/FOLDER%20AFIFAH/Antigravity%20Projects/rumahjajananlashira-semifinal) |

---

## 🏛️ 1. Brand Architecture & Visual Identity

### A. Hierarki Logo & Identitas
1. **Logo Mark / Footprint**:
   - Dimensi kompak: `h-8.5 w-8.5` (~34px) dengan radius membulat `rounded-xl`.
   - Gradien hangat khas kuliner: `from-[#E87373] to-[#991B1B]` dengan ikon `Store` terpusat warna putih.
2. **Contextual Brand Label**:
   - Merk Utama: **Rumah Jajan Alshaira** (`font-extrabold text-sm sm:text-base text-[#991B1B] tracking-tight`).
   - Unit Kontekstual: **kartika** (`font-semibold text-[11px] text-stone-500`, sejajar proporsional tanpa baseline clipping).
3. **Sub-branding Micro-typography**:
   - Penempatan: Tepat di bawah logo mark / judul brand.
   - Tipografi: `"by haber group"` (`text-[10px] text-slate-400 tracking-wider uppercase font-medium`).

### B. Palet Warna (Color Palette)
- **Primary Red / Accent**: `#991B1B` (Deep Maroon / Crimson Alshaira)
- **Secondary Red**: `#881337` (Hover & Active state)
- **Soft Warm Coral**: `#E87373` (Gradien & Ikon Brand)
- **Canvas / Background**: `#FAF7F5` (Warm Cream White, ramah di mata)
- **Card Background**: `#FFFFFF` (Solid White dengan bayangan halus `shadow-xs`)
- **Border & Separator**: `#F0E6E5` / `border-stone-200`
- **Tonal Dark**: `#18181B` / `#09090B` (Header actions & JSON code editor)
- **Text Hierarchies**:
  - Heading & Primary: `#1C1917` (`text-stone-900`)
  - Body & Subtitle: `#78716C` (`text-stone-500`)
  - Micro-metadata: `#A8A29E` / `#94A3B8` (`text-slate-400`)

---

## 📐 2. Layout & Ergonomi Sidebar

1. **Sidebar Navigation**:
   - Navigasi dinamis menyesuaikan peran (`UserRole`: `OWNER`, `ADMIN_GUDANG`, `ADMIN_CABANG`, `KASIR`, `HR_ADMIN`, `KARYAWAN`).
   - Padding tautan yang ergonomis: `py-3 px-3.5 rounded-xl` untuk kenyamanan tap target pada layar sentuh dan desktop.
   - Aksen aktif: Indikator bilah merah kiri (`w-1.5 h-6 bg-[#991B1B] rounded-r-full`) dan latar `bg-[#FDF2F2]`.
2. **Role Badge**:
   - Diberikan *breathing room* vertikal `my-3`.
   - Kontras lembut (*muted contrast*): `bg-stone-50/80 text-stone-700 border-stone-200/80` agar berfungsi sebagai metadata pasif.
3. **Primary CTA (+ Transaksi Baru)**:
   - Terisolasi dengan margin vertikal `my-4`.
   - Tap target lapang berstandar aksesibilitas: `h-11` (min 44px), `w-full`, dengan elevasi `shadow-sm hover:shadow-md`.

---

## 📊 3. Modul 17: Audit Trail & Data Density Table

1. **Rasio Lebar Kolom (Fixed vs Greedy)**:
   - **`WAKTU KEJADIAN`**: Compact fixed (`w-40`, tabular figures `font-mono text-[11px]`).
   - **`USER`**: Compact fixed (`w-36`, nama tebal + role badge).
   - **`MODUL SISTEM`**: Medium-fixed (`w-40`, pill-tag dengan kode warna modul).
   - **`TINDAKAN / AKSI`**: Fixed (`w-44`, judul aksi terpotong rapi).
   - **`DETAIL & PARAMETER`**: Greedy / fluid (`w-auto flex-1` mengisi sisa viewport).
2. **Data Truncation & Preview Action**:
   - Teks parameter panjang dipotong satu baris (`truncate` / `text-overflow: ellipsis`).
   - Teks dapat diklik atau dipicu via tombol ikon mata (`.view-details-btn`).
   - Menampilkan modal dialog interaktif dengan **Formatted JSON Beautifier**, syntax highlight hijau terminal, dan utilitas tombol **"Copy to Clipboard"**.
3. **Action Toolbar & Header**:
   - Pengelompokan tombol di kanan: Tombol Utama `"Backup Database JSON"` (gelap solid `bg-stone-900`) berdampingan dengan tombol sekunder `"Restore Backup"` (outline netral `border-stone-200`).
   - Irama vertikal teratur: Jarak `mb-4` (16px) memisahkan kartu judul dari bilah pencarian dan filter modul.

---

## 🔄 4. Alur Integrasi Antar-Modul (Cross-Role Integration)

```
[Bahan Baku Gudang] ➡️ [Resep BOM & SPK Produksi] ➡️ [Stok Produk Jadi]
          ⬇️                                               ⬇️
[Supplier & Purchasing]                          [Distribusi Cabang]
          ⬇️                                               ⬇️
   [HPP Otomatis]                                  [POS Kasir Toko]
          ⬇️                                               ⬇️
[Laba Kotor & Biaya Operasional] ⬅️----------------- [Omzet Penjualan]
          ⬇️
[Alokasi Penggajian Karyawan (HR)] ➡️ [Pendapatan Bersih Owner]
```

1. **Inventory & Gudang**:
   - Perhitungan otomatis HPP (Harga Pokok Produksi) berbasis real-time dari stok bahan baku yang terpakai pada resep BOM (*Bill of Materials*).
2. **Distribusi Cabang**:
   - Surat Jalan resmi dengan QRIS thermal print.
   - Stok gudang pusat otomatis berkurang saat distribusi dikirim, dan stok cabang otomatis bertambah setelah cabang melakukan konfirmasi terima.
3. **Presensi Mandiri Tanpa Kamera**:
   - Verifikasi kehadiran otomatis berbasis radius GPS (maksimal 2 meter dari kantor).
   - Waktu kehadiran tercatat otomatis secara presisi tanpa rekayasa manual.
4. **Integrasi Gaji & Keuangan**:
   - Modul HR menghitung gaji proporsional dari rekap kehadiran dan tunjangan.
   - Terintegrasi langsung dengan arus kas keluar, rekening bank, serta e-wallet (GoPay, DANA, OVO) karyawan.
5. **Dashboard Eksekutif Owner**:
   - Menyatukan ringkasan laba kotor, HPP, biaya operasional, gaji, dan laba bersih dari seluruh cabang secara terpusat.

---

## ♿ 5. Standar Aksesibilitas & Performa

- **Semantik HTML5**: Penggunaan tag `table`, `thead`, `tbody`, `th`, `td`, `aside`, `nav`, `header`, dan `section`.
- **Keyboard Navigation & ARIA**:
  - Modal audit dilengkapi `role="dialog"`, `aria-modal="true"`, dan `aria-labelledby`.
  - Penutupan modal mendukung tombol keyboard `ESC` dan klik area luar (*backdrop*).
  - Indikator fokus yang jelas (`focus:ring-2 focus:ring-[#991B1B] focus:outline-none`).
- **Build & Bundle Speed**:
  - Ditenagai oleh **Vite 6** + **Tailwind CSS 3** dengan tree-shaking optimal dan HMR instan.
