import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Crown,
  Warehouse,
  Store,
  ShoppingCart,
  Users,
  CheckCircle2,
  X,
  ArrowRight,
  Sparkles,
  BookOpen,
  CheckSquare,
  ShieldCheck,
  Lock,
  Lightbulb,
  DollarSign,
  Package,
  Layers,
  FileText,
  MapPin,
  Printer,
  QrCode,
  Truck,
  TrendingUp,
  AlertCircle,
  Clock,
  Briefcase,
  PlayCircle,
  RotateCcw,
  UserCheck,
} from 'lucide-react';

interface RoleDetailData {
  role: UserRole;
  title: string;
  subtitle: string;
  workLocation: string;
  icon: React.ElementType;
  themeColor: {
    bg: string;
    text: string;
    border: string;
    badge: string;
    accent: string;
  };
  summary: string;
  dailyWorkflow: {
    step: number;
    title: string;
    desc: string;
    targetTab: string;
    tabLabel: string;
    icon: React.ElementType;
  }[];
  dailyChecklist: string[];
  allowedModules: string[];
  restrictedModules: string[];
  bestPractices: { title: string; desc: string }[];
}

export const RoleGuideModal: React.FC = () => {
  const {
    showRoleGuideModal,
    setShowRoleGuideModal,
    currentUser,
    switchUserRole,
    setActiveTab,
    autoShowRoleGuide,
    setAutoShowRoleGuide,
  } = useApp();

  const [selectedRoleTab, setSelectedRoleTab] = useState<UserRole>(currentUser.role);
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  if (!showRoleGuideModal) return null;

  const roleDetails: Record<UserRole, RoleDetailData> = {
    OWNER: {
      role: 'OWNER',
      title: 'Owner / Pemilik Utama',
      subtitle: 'Pengambil Keputusan Eksekutif & Pemilik Usaha',
      workLocation: 'Kantor Pusat / Mobile Multi-Cabang',
      icon: Crown,
      themeColor: {
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200',
        badge: 'bg-red-100 text-red-800 border-red-300',
        accent: 'bg-red-600 hover:bg-red-700',
      },
      summary:
        'Memiliki akses tanpa batas ke seluruh data keuangan, omzet multi-cabang, laba rugi, kontrol HPP standar resep, monitoring produksi, dan evaluasi beban gaji tiap jabatan.',
      dailyWorkflow: [
        {
          step: 1,
          title: 'Tinjau Executive Dashboard & Penjualan Konsolidasi',
          desc: 'Pantau grafik pendapatan real-time hari ini dari seluruh outlet (Dago, Dipatiukur, Buah Batu, Cimahi) dan status pencapaian target bulanan.',
          targetTab: 'dashboard',
          tabLabel: 'Buka Executive Dashboard',
          icon: TrendingUp,
        },
        {
          step: 2,
          title: 'Kontrol Arus Kas & Beban Gaji Jabatan',
          desc: 'Tinjau arus kas masuk-keluar, likuiditas saldo rekening bank & kas kecil cabang, serta pembagian alokasi gaji sesuai grade jabatan.',
          targetTab: 'owner-keuangan-gaji',
          tabLabel: 'Buka Keuangan & Gaji Owner',
          icon: DollarSign,
        },
        {
          step: 3,
          title: 'Evaluasi Margin HPP & Efisiensi Resep BOM',
          desc: 'Periksa margin laba kotor tiap produk snack (Basreng, Keripik Kaca, Makaroni) untuk memastikan harga jual tetap kompetitif dan menguntungkan.',
          targetTab: 'hpp-calculator',
          tabLabel: 'Buka Kalkulator HPP',
          icon: Layers,
        },
        {
          step: 4,
          title: 'Tinjau Status Distribusi Antar-Cabang & Produksi',
          desc: 'Pastikan pasokan dari Pabrik Pusat tersalurkan tepat waktu ke semua cabang retail tanpa ada kendala kekurangan stok.',
          targetTab: 'distribusi',
          tabLabel: 'Buka Monitoring Distribusi',
          icon: Truck,
        },
        {
          step: 5,
          title: 'Audit Log & Integritas Transaksi',
          desc: 'Pantau riwayat aktivitas operasional semua staf untuk mencegah selisih kas, perubahan stok manual yang tidak wajar, atau fraud.',
          targetTab: 'audit-log',
          tabLabel: 'Buka Audit Log',
          icon: ShieldCheck,
        },
      ],
      dailyChecklist: [
        'Cek total omzet konsolidasi pagi/siang dan performa outlet terbaik',
        'Review persetujuan Purchase Order (PO) bahan baku besar dari supplier',
        'Pantau rasio pengeluaran operasional vs target margin laba kotor minimal 40%',
        'Tinjau ketersediaan stok produk best seller di seluruh cabang',
        'Cek rekap kehadiran dan kedisiplinan staf melalui modul HR',
      ],
      allowedModules: [
        'Dashboard Eksekutif Konsolidasi',
        'Arus Kas & Distribusi Gaji Jabatan',
        'Laporan Laba Rugi & Neraca',
        'Master Resep BOM & Kalkulator HPP',
        'Monitoring Produksi & Quality Control',
        'Stok Multi-Cabang & Distribusi',
        'Laporan Penjualan POS & Grosir',
        'Manajemen Karyawan & Payroll',
        'Audit Trail & System Logs',
      ],
      restrictedModules: [
        'Tidak ada pembatasan — Owner memiliki hak akses Superadmin Penuh',
      ],
      bestPractices: [
        {
          title: 'Pertahankan Batas Margin Bersih',
          desc: 'Gunakan fitur Kalkulator HPP setiap kali harga bahan baku (minyak goreng/bumbu) naik di pasar untuk menyesuaikan harga grosir/retail.',
        },
        {
          title: 'Review Audit Log Berkala',
          desc: 'Lakukan audit berkala terhadap transaksi diskon manual kasir dan penyesuaian stok (stock opname) mendadak di cabang.',
        },
      ],
    },
    ADMIN_GUDANG: {
      role: 'ADMIN_GUDANG',
      title: 'Admin Gudang Pusat & Pabrik',
      subtitle: 'Pengelola Pasokan Bahan, Resep Produksi, QC & Distribusi',
      workLocation: 'Gudang & Pabrik Pusat Soreang',
      icon: Warehouse,
      themeColor: {
        bg: 'bg-indigo-50',
        text: 'text-indigo-700',
        border: 'border-indigo-200',
        badge: 'bg-indigo-100 text-indigo-800 border-indigo-300',
        accent: 'bg-indigo-600 hover:bg-indigo-700',
      },
      summary:
        'Bertanggung jawab atas pasokan bahan baku mentah, pembuatan resep BOM, kontrol HPP per batch, penerbitan SPK produksi, QC produk jadi, dan pembuatan Surat Jalan distribusi ke seluruh cabang retail.',
      dailyWorkflow: [
        {
          step: 1,
          title: 'Cek Ketersediaan Stok Bahan Baku Mentah',
          desc: 'Tinjau bahan baku (tepung tapioka, cabe bubuk, minyak goreng, daun jeruk, bumbu tabur) dan pastikan tidak ada yang di bawah Safety Stock.',
          targetTab: 'stok-bahan',
          tabLabel: 'Cek Stok Bahan Baku',
          icon: Package,
        },
        {
          step: 2,
          title: 'Buat Purchase Order (PO) ke Supplier',
          desc: 'Jika stok bahan menipis, terbitkan PO resmi ke supplier terpilih dengan kesepakatan tempo bayar yang sesuai.',
          targetTab: 'pembelian',
          tabLabel: 'Buat Purchase Order',
          icon: FileText,
        },
        {
          step: 3,
          title: 'Terbitkan Surat Perintah Kerja (SPK) Produksi',
          desc: 'Buat SPK penggorengan, pembumbuan, atau pengemasan snack sesuai target kuota permintaan cabang.',
          targetTab: 'produksi',
          tabLabel: 'Kelola SPK Produksi & QC',
          icon: Layers,
        },
        {
          step: 4,
          title: 'Lakukan Quality Control (QC) Barang Jadi',
          desc: 'Uji kerenyahan, kadar minyak, berat bersih kemasan, kerapatan segel, dan loloskan produk jadi ke gudang barang siap jual.',
          targetTab: 'produksi',
          tabLabel: 'Input Hasil QC',
          icon: CheckCircle2,
        },
        {
          step: 5,
          title: 'Terbitkan Surat Jalan Pengiriman ke Cabang',
          desc: 'Proses permintaan restock dari outlet, siapkan barang, input nama supir & plat kendaraan, lalu cetak Surat Jalan resmi.',
          targetTab: 'distribusi',
          tabLabel: 'Buat Surat Jalan Pengiriman',
          icon: Truck,
        },
      ],
      dailyChecklist: [
        'Inspeksi fisik bahan baku masuk dari supplier vs nota timbangan',
        'Validasi resep BOM sebelum SPK penggorengan batch dimulai',
        'Catat reject / cacat produksi saat pengemasan snack',
        'Periksa daftar Stock Request yang masuk dari Admin Cabang',
        'Cetak fisik Surat Jalan rangkap 3 untuk supir pengiriman logistik',
      ],
      allowedModules: [
        'Data Supplier & Purchase Order (PO)',
        'Stok Bahan Baku & Log Mutasi',
        'Standar Resep BOM Produk',
        'Kalkulator Simulasi HPP',
        'SPK Produksi & Quality Control',
        'Stok Barang Jadi Pabrik',
        'Penerbitan Surat Jalan Distribusi',
      ],
      restrictedModules: [
        'Laporan Laba Rugi Owner & Payroll Gaji Staf',
        'Penjualan POS Kasir Cabang (Read Only)',
      ],
      bestPractices: [
        {
          title: 'Penerapan Sistem FIFO / FEFO',
          desc: 'Keluarkan bahan baku dan bumbu dengan tanggal kedaluwarsa terdekat terlebih dahulu untuk menjaga kesegaran rasa snack.',
        },
        {
          title: 'Verifikasi Surat Jalan Sebelum Kendaraan Berangkat',
          desc: 'Pastikan jumlah karton snack di mobil boks sesuai dengan fisik Surat Jalan sebelum supir meninggalkan pabrik Soreang.',
        },
      ],
    },
    ADMIN_CABANG: {
      role: 'ADMIN_CABANG',
      title: 'Admin Cabang Retail',
      subtitle: 'Pengelola Operasional Harian Outlet, Stok Toko & Kas Kecil',
      workLocation: 'Outlet Cabang (Dago Plaza, Dipatiukur, dll.)',
      icon: Store,
      themeColor: {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        accent: 'bg-emerald-600 hover:bg-emerald-700',
      },
      summary:
        'Bertanggung jawab atas penerimaan kiriman snack dari pusat, pengecekan surat jalan, pengelolaan stok display toko, pengajuan restock barang menipis, dan pencatatan kas kecil cabang.',
      dailyWorkflow: [
        {
          step: 1,
          title: 'Terima Pengiriman Barang dari Pabrik Pusat',
          desc: 'Ketika supir tiba, periksa fisik snack yang diterima dengan Surat Jalan. Klik "Terima Lengkap" atau catat selisih jika ada kerusakan.',
          targetTab: 'distribusi',
          tabLabel: 'Konfirmasi Distribusi Masuk',
          icon: Truck,
        },
        {
          step: 2,
          title: 'Monitoring Stok Display & Gudang Cabang',
          desc: 'Pastikan etalase snack toko selalu terisi rapi sesuai varian (Pedas Daun Jeruk, Asin Gurih, Balado, Keju).',
          targetTab: 'stok-produk',
          tabLabel: 'Lihat Stok Cabang',
          icon: Package,
        },
        {
          step: 3,
          title: 'Ajukan Permintaan Restock (Stock Request)',
          desc: 'Jika stok varian tertentu mulai menipis menjelang akhir pekan, ajukan Stock Request ke Gudang Pusat dengan urgensi yang sesuai.',
          targetTab: 'permintaan-stok',
          tabLabel: 'Buat Request Restock',
          icon: AlertCircle,
        },
        {
          step: 4,
          title: 'Catat Arus Kas Kecil (Petty Cash Cabang)',
          desc: 'Input pengeluaran operasional cabang seperti plastik kresek darurat, air galon, es batu, atau alat kebersihan toko.',
          targetTab: 'keuangan',
          tabLabel: 'Input Kas Kecil',
          icon: DollarSign,
        },
        {
          step: 5,
          title: 'Rekonsiliasi Kasir & Laporan Harian',
          desc: 'Cocokkan total penjualan kasir POS dengan uang fisik di laci kasir dan mutasi QRIS sebelum toko tutup.',
          targetTab: 'laporan-penjualan',
          tabLabel: 'Cek Laporan Penjualan Cabang',
          icon: FileText,
        },
      ],
      dailyChecklist: [
        'Hitung stok awal fisik di etalase sebelum toko buka',
        'Verifikasi tanda terima Surat Jalan kiriman supir',
        'Ajukan restock sebelum stok varian favorit di bawah 15 bungkus',
        'Simpan bukti nota fisik pengeluaran kas kecil cabang',
        'Lakukan stock opname singkat bersama kasir saat pergantian shift',
      ],
      allowedModules: [
        'Penerimaan Distribusi Surat Jalan',
        'Monitoring Stok Produk Cabang Aktif',
        'Pengajuan Permintaan Restock ke Pusat',
        'Pencatatan Kas Kecil (Petty Cash)',
        'Laporan Penjualan Cabang',
      ],
      restrictedModules: [
        'Data Cabang Lain & Laba Rugi Pusat',
        'Pengaturan Resep BOM & SPK Pabrik',
        'Penggajian Payroll Karyawan',
      ],
      bestPractices: [
        {
          title: 'Segera Laporkan Barang Cacat Pengiriman',
          desc: 'Jika ditemukan kemasan snack bocor atau rusak dari ekspedisi, tandai status DITERIMA SEBAGIAN dan lampirkan catatan di sistem.',
        },
        {
          title: 'Ajukan Restock H-2 Akhir Pekan',
          desc: 'Kirim Stock Request pada hari Rabu/Kamis agar tim gudang pusat dapat menjadwalkan rute pengiriman sebelum lonjakan belanja weekend.',
        },
      ],
    },
    KASIR: {
      role: 'KASIR',
      title: 'Kasir POS Outlet',
      subtitle: 'Garda Depan Pelayanan Transaksi Cepat & Pembayaran Toko',
      workLocation: 'Meja Kasir Outlet Cabang Aktif',
      icon: ShoppingCart,
      themeColor: {
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-200',
        badge: 'bg-rose-100 text-rose-800 border-rose-300',
        accent: 'bg-rose-600 hover:bg-rose-700',
      },
      summary:
        'Fokus pada pelayanan transaksi cepat di kasir, scan barcode produk, pemilihan level pedas, penerimaan pembayaran multi-metode (Tunai, QRIS Dinamis, Debit, Transfer), dan pencetakan struk thermal.',
      dailyWorkflow: [
        {
          step: 1,
          title: 'Buka Layar Kasir POS & Cek Modal Awal',
          desc: 'Masuk ke menu Penjualan POS, pastikan nama cabang sesuai dan modal uang kembalian di laci kasir telah siap.',
          targetTab: 'penjualan-pos',
          tabLabel: 'Buka POS Kasir',
          icon: ShoppingCart,
        },
        {
          step: 2,
          title: 'Input Snack Pesanan Pembeli',
          desc: 'Klik produk snack pada layar sentuh, gunakan tombol filter kategori, atau scan barcode pada kemasan snack untuk kecepatan input.',
          targetTab: 'penjualan-pos',
          tabLabel: 'Mulai Input Pesanan',
          icon: QrCode,
        },
        {
          step: 3,
          title: 'Terapkan Diskon / Promosi (Jika Ada)',
          desc: 'Pilih diskon persentase atau potongan nominal jika pembeli memenuhi syarat promo bundling atau pembelian grosir.',
          targetTab: 'penjualan-pos',
          tabLabel: 'Cek Keranjang Pesanan',
          icon: Sparkles,
        },
        {
          step: 4,
          title: 'Proses Pembayaran (Tunai / QRIS / Transfer)',
          desc: 'Ketik nominal uang tunai yang diterima (kembalian dihitung otomatis) atau tampilkan QRIS statis/dinamis untuk discan pelanggan.',
          targetTab: 'penjualan-pos',
          tabLabel: 'Pilih Metode Bayar',
          icon: DollarSign,
        },
        {
          step: 5,
          title: 'Cetak Struk Thermal & Selesaikan Transaksi',
          desc: 'Cetak nota struk fisik ukuran 58mm/80mm untuk pembeli. Stok otomatis berkurang dan penjualan langsung tersinkron ke dashboard.',
          targetTab: 'penjualan-pos',
          tabLabel: 'Cetak Struk Transaksi',
          icon: Printer,
        },
      ],
      dailyChecklist: [
        'Hitung uang pecahan kembalian di laci kasir saat buka shift',
        'Pastikan kertas roll printer thermal terpasang dan tinta/pemanas siap',
        'Pastikan koneksi internet stabil untuk konfirmasi transaksi QRIS',
        'Ucapkan salam ramah dan tawarkan varian snack best seller',
        'Hitung total uang fisik dan print rekap shift saat closing',
      ],
      allowedModules: [
        'Layar Kasir POS Touchscreen & Scan Barcode',
        'Kalkulator Kembalian & Multi-Payment (QRIS/Tunai)',
        'Cetak Struk Pembelian Thermal 58mm / 80mm',
        'Pengecekan Stok Cepat Produk Toko',
        'Riwayat Transaksi Shift Kasir Terkini',
      ],
      restrictedModules: [
        'Data Margin HPP, Pembelian Bahan, dan Resep Pabrik',
        'Pengelolaan Master Gaji & Keuangan Laba Rugi',
        'Pengaturan Sistem & Database',
      ],
      bestPractices: [
        {
          title: 'Verifikasi Notifikasi Pembayaran QRIS',
          desc: 'Sebelum menyerahkan barang dan struk, selalu pastikan notifikasi sukses di aplikasi m-banking pembeli atau cek mutasi kasir.',
        },
        {
          title: 'Scan Barcode untuk Menghindari Salah Varian',
          desc: 'Gunakan barcode scanner pada kemasan untuk memastikan varian bumbu (misal: Extra Pedas vs Pedas Daun Jeruk) terpotong tepat pada stok.',
        },
      ],
    },
    HR_ADMIN: {
      role: 'HR_ADMIN',
      title: 'HR & Payroll Admin',
      subtitle: 'Pengelola Data Kepegawaian, Presensi GPS Selfie & Payroll Gaji',
      workLocation: 'Kantor Pusat / HR Department',
      icon: Users,
      themeColor: {
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        border: 'border-purple-200',
        badge: 'bg-purple-100 text-purple-800 border-purple-300',
        accent: 'bg-purple-600 hover:bg-purple-700',
      },
      summary:
        'Bertanggung jawab atas administrasi karyawan seluruh cabang & pabrik, verifikasi absensi GPS & foto selfie (clock-in/clock-out), manajemen shift, perhitungan payroll bulanan otomatis, dan penerbitan slip gaji resmi.',
      dailyWorkflow: [
        {
          step: 1,
          title: 'Monitoring Presensi GPS & Selfie Staf Real-Time',
          desc: 'Tinjau absensi clock-in harian karyawan di seluruh cabang, periksa validitas koordinat radius kantor dan foto selfie presensi.',
          targetTab: 'absensi',
          tabLabel: 'Buka Monitoring Absensi',
          icon: MapPin,
        },
        {
          step: 2,
          title: 'Kelola Master Data Karyawan & Jabatan',
          desc: 'Lakukan input karyawan baru, atur status kontrak/tetap, penetapan divisi kerja, serta besaran gaji pokok dan tunjangannya.',
          targetTab: 'karyawan',
          tabLabel: 'Buka Data Karyawan',
          icon: Users,
        },
        {
          step: 3,
          title: 'Generate Rekapitulasi Payroll Bulanan Otomatis',
          desc: 'Satu kali klik untuk menghitung otomatis gaji bersih seluruh staf berdasarkan jumlah kehadiran, jam lembur, bonus, dan potongan BPJS.',
          targetTab: 'penggajian',
          tabLabel: 'Proses Payroll Bulanan',
          icon: DollarSign,
        },
        {
          step: 4,
          title: 'Cetak & Distribusikan Slip Gaji Resmi',
          desc: 'Periksa rincian slip gaji tiap staf, tandai status lunas (PAID), dan cetak dokumen slip gaji berstempel resmi perusahaan.',
          targetTab: 'penggajian',
          tabLabel: 'Cetak Slip Gaji',
          icon: Printer,
        },
        {
          step: 5,
          title: 'Tinjau Laporan Evaluasi Disiplin Staf',
          desc: 'Pantau persentase ketepatan waktu, izin sakit, dan cuti untuk evaluasi performa kerja bulanan.',
          targetTab: 'absensi',
          tabLabel: 'Lihat Evaluasi Kehadiran',
          icon: Clock,
        },
      ],
      dailyChecklist: [
        'Verifikasi foto selfie dan titik GPS absensi pagi seluruh outlet',
        'Catat surat keterangan dokter jika ada karyawan yang izin sakit',
        'Update status lembur operator pabrik saat ada lonjakan pesanan',
        'Lakukan sinkronisasi data presensi sebelum tutup periode payroll',
        'Pastikan data rekening bank karyawan valid untuk transfer gaji',
      ],
      allowedModules: [
        'Sistem Presensi GPS & Foto Selfie Real-Time',
        'Master Biodata Karyawan & Penempatan Cabang',
        'Kalkulator Payroll Otomatis & Rincian Tunjangan',
        'Penerbitan & Cetak Slip Gaji Karyawan',
        'Laporan Rekapitulasi Kehadiran & Lembur',
      ],
      restrictedModules: [
        'Formulasi Resep Rahasia & SPK Produksi Pabrik',
        'Transaksi POS Kasir Penjualan',
        'Master Rekening Kas Bank Usaha Utama (Read Only)',
      ],
      bestPractices: [
        {
          title: 'Validasi Radius GPS Maksimal 100 Meter',
          desc: 'Sistem menandai absensi di luar radius kantor/pabrik sebagai peringatan agar tidak terjadi kecurangan titip absen.',
        },
        {
          title: 'Kunci Periode Absensi Sebelum Generate Payroll',
          desc: 'Pastikan seluruh revisi presensi, izin, dan lembur telah diverifikasi sebelum tombol Generate Payroll bulanan dieksekusi.',
        },
      ],
    },
    KARYAWAN: {
      role: 'KARYAWAN',
      title: 'Karyawan (Absensi Mandiri)',
      subtitle: 'Portal Mandiri Presensi GPS, Selfie, Pengajuan Izin & Slip Gaji',
      workLocation: 'Pabrik Pusat & Seluruh Outlet Cabang',
      icon: UserCheck,
      themeColor: {
        bg: 'bg-teal-50',
        text: 'text-teal-700',
        border: 'border-teal-200',
        badge: 'bg-teal-100 text-teal-800 border-teal-300',
        accent: 'bg-teal-600 hover:bg-teal-700',
      },
      summary:
        'Fitur portal mandiri staf dan operator untuk melakukan presensi masuk (clock-in) & pulang (clock-out) menggunakan verifikasi selfie dan radius GPS. Seluruh data kehadiran langsung terakumulasi ke tunjangan makan, transport, dan slip gaji HR secara otomatis tanpa perlu rekap manual.',
      dailyWorkflow: [
        {
          step: 1,
          title: 'Presensi Masuk Ceklis & GPS (Maks 2m)',
          desc: 'Konfirmasi ceklis kehadiran fisik dan kesiapan shift pada jam realtime dengan validasi jarak maksimal 2 meter dari kantor.',
          targetTab: 'dashboard',
          tabLabel: 'Absen Masuk Sekarang',
          icon: CheckSquare,
        },
        {
          step: 2,
          title: 'Pantau Akumulasi Tunjangan Kehadiran',
          desc: 'Lihat jumlah hari hadir yang otomatis menambah tunjangan uang makan dan transport harian.',
          targetTab: 'dashboard',
          tabLabel: 'Cek Tunjangan',
          icon: DollarSign,
        },
        {
          step: 3,
          title: 'Pengajuan Izin / Sakit / Cuti',
          desc: 'Ajukan form izin jika berhalangan hadir agar tercatat resmi di dashboard HR dengan alasan dan keterangan yang jelas.',
          targetTab: 'dashboard',
          tabLabel: 'Ajukan Izin',
          icon: FileText,
        },
        {
          step: 4,
          title: 'Presensi Pulang (Clock-Out) & Catatan Lembur',
          desc: 'Lakukan clock-out di akhir shift kerja untuk merekam total jam operasional dan jam lembur jika ada.',
          targetTab: 'dashboard',
          tabLabel: 'Absen Pulang',
          icon: Clock,
        },
        {
          step: 5,
          title: 'Preview Slip Gaji Periode Berjalan',
          desc: 'Periksa transparansi slip gaji berjalan yang terhitung otomatis dari presensi harian Anda.',
          targetTab: 'payroll',
          tabLabel: 'Lihat Slip Gaji',
          icon: Banknote,
        },
      ],
      dailyChecklist: [
        'Lakukan presensi clock-in sebelum pukul 08:00 WIB untuk menghindari potongan terlambat',
        'Pastikan fitur GPS di perangkat aktif dan berada di radius tempat kerja',
        'Kirimkan surat keterangan jika mengajukan izin sakit',
        'Lakukan clock-out sebelum meninggalkan tempat kerja di akhir shift',
      ],
      allowedModules: [
        'Presensi GPS & Foto Selfie Masuk/Pulang',
        'Form Pengajuan Izin / Sakit / Cuti Mandiri',
        'Riwayat Log Kehadiran Pribadi',
        'Live Preview Slip Gaji & Akumulasi Tunjangan',
      ],
      restrictedModules: [
        'Formulasi Resep Rahasia & SPK Produksi Pabrik',
        'Transaksi Kasir POS Penjualan Toko',
        'Data Payroll Karyawan Lain',
        'Laporan Keuangan Eksekutif Usaha',
      ],
      bestPractices: [
        {
          title: 'Presensi Tepat Waktu',
          desc: 'Presensi sebelum batas jam 08:05 WIB menjamin tunjangan kehadiran harian diterima penuh tanpa potongan keterlambatan.',
        },
        {
          title: 'Foto Selfie Jelas',
          desc: 'Pastikan pencahayaan cukup saat mengambil foto selfie presensi agar terverifikasi dengan valid di sistem HR.',
        },
      ],
    },
  };

  const currentRoleData = roleDetails[selectedRoleTab] || roleDetails[currentUser?.role] || roleDetails.OWNER;
  const isCurrentActiveRole = selectedRoleTab === currentUser?.role;

  const toggleTask = (taskKey: string) => {
    setCompletedTasks((prev) => ({
      ...prev,
      [taskKey]: !prev[taskKey],
    }));
  };

  const handleNavigateToModule = (tabId: string) => {
    setActiveTab(tabId);
    setShowRoleGuideModal(false);
  };

  const handleSwitchToThisRole = (role: UserRole) => {
    switchUserRole(role);
    setSelectedRoleTab(role);
  };

  const roleTabItems: { role: UserRole; title: string; icon: React.ElementType }[] = [
    { role: 'OWNER', title: 'Owner (Pemilik)', icon: Crown },
    { role: 'ADMIN_GUDANG', title: 'Gudang & Pabrik', icon: Warehouse },
    { role: 'ADMIN_CABANG', title: 'Admin Cabang', icon: Store },
    { role: 'KASIR', title: 'Kasir POS', icon: ShoppingCart },
    { role: 'HR_ADMIN', title: 'HR & Payroll', icon: Users },
    { role: 'KARYAWAN', title: 'Karyawan (Absensi)', icon: UserCheck },
  ];

  const CurrentRoleIcon = currentRoleData?.icon || Crown;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-red-950 text-white p-5 sm:p-6 relative flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-white/10 border border-white/20 text-amber-300 shadow-inner">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
                    Tatacara & Panduan Penggunaan Sistem
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-red-500 text-white shadow-xs">
                    SOP Berdasarkan Role
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-stone-300 mt-1">
                  Panduan alur kerja harian, standar operasional (SOP), checklist tugas, dan modul utama sesuai peran Anda.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowRoleGuideModal(false)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition active:scale-95 flex-shrink-0"
              title="Tutup Panduan"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current Active User Status Bar */}
          <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-stone-400">Login Saat Ini:</span>
              <span className="font-bold text-white flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-lg border border-white/10">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {currentUser.name} ({currentUser.roleTitle})
              </span>
              <span className="text-stone-400 hidden sm:inline">• Lokasi: {currentUser.branchName}</span>
            </div>

            <div className="text-[11px] text-amber-300 flex items-center gap-1 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pilih tab di bawah untuk melihat alur peran lain</span>
            </div>
          </div>
        </div>

        {/* Role Switcher Tabs */}
        <div className="bg-stone-100 border-b border-stone-200 p-2 sm:px-6 flex-shrink-0 overflow-x-auto">
          <div className="flex items-center gap-1.5 min-w-max">
            {roleTabItems.map((tab) => {
              const TabIcon = tab.icon;
              const isSelected = selectedRoleTab === tab.role;
              const isUserActiveRole = currentUser.role === tab.role;

              return (
                <button
                  key={tab.role}
                  onClick={() => setSelectedRoleTab(tab.role)}
                  className={`px-3.5 py-2 rounded-xl font-bold text-xs transition flex items-center gap-2 border ${
                    isSelected
                      ? 'bg-white text-stone-900 border-stone-300 shadow-xs'
                      : 'bg-transparent text-stone-600 hover:bg-stone-200/70 border-transparent'
                  }`}
                >
                  <TabIcon className={`w-4 h-4 ${isSelected ? 'text-red-600' : 'text-stone-500'}`} />
                  <span>{tab.title}</span>
                  {isUserActiveRole && (
                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300">
                      Anda
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-stone-800">
          {/* Active Role Highlight Card */}
          <div className={`p-5 rounded-2xl border ${currentRoleData.themeColor.bg} ${currentRoleData.themeColor.border} flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs`}>
            <div className="flex items-start sm:items-center gap-3.5">
              <div className={`p-3 rounded-2xl bg-white shadow-sm border border-stone-200/80 ${currentRoleData.themeColor.text}`}>
                <CurrentRoleIcon className="w-7 h-7" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black text-stone-900">
                    {currentRoleData.title}
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${currentRoleData.themeColor.badge}`}>
                    {currentRoleData.subtitle}
                  </span>
                  {isCurrentActiveRole && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white shadow-xs flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Role Aktif Anda
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed max-w-2xl">
                  {currentRoleData.summary}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-stone-500 font-medium mt-2">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  <span>Area Kerja Utama: <strong>{currentRoleData.workLocation}</strong></span>
                </div>
              </div>
            </div>

            {!isCurrentActiveRole && (
              <button
                onClick={() => handleSwitchToThisRole(selectedRoleTab)}
                className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl transition shadow-sm flex items-center justify-center gap-2 flex-shrink-0 active:scale-95"
              >
                <RotateCcw className="w-4 h-4 text-amber-400" />
                <span>Beralih ke Role Ini</span>
              </button>
            )}
          </div>

          {/* Section 1: Alur Kerja Harian Step-by-Step */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-red-100 text-red-700">
                  <PlayCircle className="w-4 h-4" />
                </div>
                <h4 className="font-extrabold text-sm sm:text-base text-stone-900">
                  Alur Kerja & SOP Harian (Step-by-Step)
                </h4>
              </div>
              <span className="text-xs text-stone-500 font-medium">
                {currentRoleData.dailyWorkflow.length} Tahapan Utama
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {currentRoleData.dailyWorkflow.map((step) => {
                const StepIcon = step.icon;
                return (
                  <div
                    key={step.step}
                    className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-stone-300 transition shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-stone-900 text-white font-black text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
                        {step.step}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <StepIcon className="w-4 h-4 text-red-600" />
                          <h5 className="font-extrabold text-xs sm:text-sm text-stone-900">
                            {step.title}
                          </h5>
                        </div>
                        <p className="text-xs text-stone-600 leading-relaxed max-w-xl">
                          {step.desc}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleNavigateToModule(step.targetTab)}
                      className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-red-50 hover:text-red-700 text-stone-700 font-bold text-xs transition border border-stone-200 hover:border-red-200 flex items-center justify-center gap-1.5 flex-shrink-0 self-start md:self-center active:scale-95"
                    >
                      <span>{step.tabLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Checklist & Tugas Harian Interaktif */}
          <div className="bg-stone-50 rounded-2xl border border-stone-200 p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-600" />
                <h4 className="font-extrabold text-xs sm:text-sm text-stone-900">
                  Checklist Tugas Harian ({selectedRoleTab})
                </h4>
              </div>
              <span className="text-xs font-bold text-stone-500">
                Klik kotak untuk mencentang tugas yang sudah selesai
              </span>
            </div>

            <div className="space-y-2">
              {currentRoleData.dailyChecklist.map((task, idx) => {
                const taskKey = `${selectedRoleTab}_task_${idx}`;
                const isChecked = !!completedTasks[taskKey];

                return (
                  <div
                    key={idx}
                    onClick={() => toggleTask(taskKey)}
                    className={`p-3 rounded-xl border transition cursor-pointer flex items-center gap-3 ${
                      isChecked
                        ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                        : 'bg-white border-stone-200/80 text-stone-700 hover:bg-stone-100/50'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-lg flex items-center justify-center border transition flex-shrink-0 ${
                        isChecked
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-stone-300 bg-white'
                      }`}
                    >
                      {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <span className={`text-xs font-medium ${isChecked ? 'line-through text-stone-500' : ''}`}>
                      {task}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Hak Akses RBAC & Best Practices Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Hak Akses Modul */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-3 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-extrabold text-stone-900 border-b border-stone-100 pb-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>Hak Akses & Kewenangan Modul</span>
              </div>

              <div className="space-y-1.5">
                <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Modul yang Dapat Diakses:</p>
                {currentRoleData.allowedModules.map((mod, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-stone-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>{mod}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1.5 pt-2 border-t border-stone-100">
                <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Batasan Hak Akses:</p>
                {currentRoleData.restrictedModules.map((res, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-stone-500">
                    <Lock className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                    <span>{res}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Best Practices UMKM */}
            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/70 space-y-3 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-extrabold text-amber-900 border-b border-amber-200/50 pb-2">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span>Tips Operasional & Best Practices UMKM</span>
              </div>

              <div className="space-y-3">
                {currentRoleData.bestPractices.map((tip, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-white/90 border border-amber-200/50 space-y-1">
                    <h5 className="font-extrabold text-xs text-amber-950 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      {tip.title}
                    </h5>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {tip.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:px-6 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0">
          <label className="flex items-center gap-2 text-xs text-stone-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={autoShowRoleGuide}
              onChange={(e) => setAutoShowRoleGuide(e.target.checked)}
              className="w-4 h-4 text-red-600 rounded border-stone-300 focus:ring-red-500 cursor-pointer"
            />
            <span>Selalu tampilkan panduan tatacara ini setelah login / ganti role</span>
          </label>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => setShowRoleGuideModal(false)}
              className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center gap-1.5 active:scale-95"
            >
              <span>Mulai Bekerja Sekarang</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
