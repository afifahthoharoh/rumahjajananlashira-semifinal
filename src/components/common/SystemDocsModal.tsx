import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  BookOpen,
  Database,
  GitMerge,
  Server,
  Layers,
  Code2,
  Workflow,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Copy,
  Check,
} from 'lucide-react';

export interface SystemDocsModalProps {
  onClose?: () => void;
}

export const SystemDocsModal: React.FC<SystemDocsModalProps> = ({ onClose }) => {
  const { showSystemDocsModal, setShowSystemDocsModal } = useApp();
  const [activeTab, setActiveTab] = useState<'FLOW' | 'USECASE' | 'ERD' | 'SQL' | 'ARCH' | 'DATAFLOW'>('FLOW');
  const [copiedSql, setCopiedSql] = useState(false);

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
    setShowSystemDocsModal(false);
  };

  if (!showSystemDocsModal && !onClose) return null;

  const postgresSqlSchema = `-- ========================================================
-- RUMAH JAJANAN LASHIRA - POSTGRESQL PRODUCTION DDL SCHEMA
-- Normal 3NF Database Structure for Snack Food UMKM ERP
-- ========================================================

-- 1. Branches & Outlets Table
CREATE TABLE branches (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    manager_name VARCHAR(100),
    is_main_warehouse BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Users & Roles (RBAC) Table
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL, -- OWNER, ADMIN_GUDANG, ADMIN_CABANG, KASIR, HR_ADMIN
    branch_id VARCHAR(36) REFERENCES branches(id) ON DELETE SET NULL,
    phone VARCHAR(20),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Suppliers Table
CREATE TABLE suppliers (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    contact_person VARCHAR(100),
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    address TEXT,
    category VARCHAR(50),
    payment_terms VARCHAR(50),
    bank_account VARCHAR(100),
    status VARCHAR(20) DEFAULT 'ACTIVE'
);

-- 4. Raw Materials (Bahan Baku) Table
CREATE TABLE raw_materials (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(30) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    unit VARCHAR(20) NOT NULL, -- kg, gram, liter, ml, pcs
    current_stock NUMERIC(12,2) DEFAULT 0,
    minimum_stock NUMERIC(12,2) DEFAULT 10,
    avg_price_per_unit NUMERIC(12,2) NOT NULL,
    last_purchased_price NUMERIC(12,2) NOT NULL,
    warehouse_location VARCHAR(100),
    barcode VARCHAR(50),
    batch_number VARCHAR(50),
    expiry_date DATE,
    supplier_id VARCHAR(36) REFERENCES suppliers(id)
);

-- 5. Finished Products Table
CREATE TABLE products (
    id VARCHAR(36) PRIMARY KEY,
    sku VARCHAR(30) UNIQUE NOT NULL,
    barcode VARCHAR(50) UNIQUE,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    weight_grams INT NOT NULL,
    package_type VARCHAR(100),
    hpp NUMERIC(12,2) NOT NULL,
    selling_price NUMERIC(12,2) NOT NULL,
    minimum_stock_warning INT DEFAULT 20,
    image_url TEXT,
    status VARCHAR(20) DEFAULT 'ACTIVE'
);

-- 6. Bill of Materials (BOM) / Recipes Table
CREATE TABLE recipes (
    id VARCHAR(36) PRIMARY KEY,
    product_id VARCHAR(36) REFERENCES products(id) ON DELETE CASCADE,
    batch_yield INT DEFAULT 100,
    labor_cost_per_batch NUMERIC(12,2) DEFAULT 0,
    overhead_cost_per_batch NUMERIC(12,2) DEFAULT 0,
    total_cost_per_batch NUMERIC(12,2) NOT NULL,
    hpp_per_unit NUMERIC(12,2) NOT NULL,
    suggested_margin_percent NUMERIC(5,2) DEFAULT 40.00,
    suggested_selling_price NUMERIC(12,2) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE recipe_ingredients (
    id VARCHAR(36) PRIMARY KEY,
    recipe_id VARCHAR(36) REFERENCES recipes(id) ON DELETE CASCADE,
    material_id VARCHAR(36) REFERENCES raw_materials(id),
    quantity NUMERIC(12,3) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    cost_per_unit NUMERIC(12,2) NOT NULL,
    subtotal_cost NUMERIC(12,2) NOT NULL
);

-- 7. Production Batches & QC Table
CREATE TABLE production_orders (
    id VARCHAR(36) PRIMARY KEY,
    production_number VARCHAR(30) UNIQUE NOT NULL,
    batch_number VARCHAR(50) NOT NULL,
    product_id VARCHAR(36) REFERENCES products(id),
    quantity_target INT NOT NULL,
    quantity_produced INT DEFAULT 0,
    quantity_defect INT DEFAULT 0,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    operator_name VARCHAR(100) NOT NULL,
    supervisor_name VARCHAR(100),
    status VARCHAR(30) DEFAULT 'SEDANG_PRODUKSI', -- SEDANG_PRODUKSI, QC_CHECK, SELESAI, DIBATALKAN
    unit_hpp NUMERIC(12,2) NOT NULL,
    qc_status VARCHAR(20), -- PASSED, REWORK, REJECTED
    qc_notes TEXT
);

-- 8. Branch Inventory / Stocks Matrix Table
CREATE TABLE branch_stocks (
    id VARCHAR(36) PRIMARY KEY,
    branch_id VARCHAR(36) REFERENCES branches(id) ON DELETE CASCADE,
    product_id VARCHAR(36) REFERENCES products(id) ON DELETE CASCADE,
    stock_qty INT DEFAULT 0,
    minimum_stock INT DEFAULT 20,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_branch_product UNIQUE (branch_id, product_id)
);

-- 9. Stock Distributions & Surat Jalan
CREATE TABLE stock_distributions (
    id VARCHAR(36) PRIMARY KEY,
    transfer_number VARCHAR(30) UNIQUE NOT NULL,
    surat_jalan_number VARCHAR(50) UNIQUE NOT NULL,
    from_branch_id VARCHAR(36) REFERENCES branches(id),
    to_branch_id VARCHAR(36) REFERENCES branches(id),
    sent_date TIMESTAMP WITH TIME ZONE NOT NULL,
    received_date TIMESTAMP WITH TIME ZONE,
    driver_name VARCHAR(100),
    vehicle_plate VARCHAR(20),
    status VARCHAR(30) DEFAULT 'DALAM_PENGIRIMAN', -- DALAM_PENGIRIMAN, DITERIMA_LENGKAP, DITOLAK
    notes TEXT
);

-- 10. Sales Transactions & POS Line Items Table
CREATE TABLE sale_transactions (
    id VARCHAR(36) PRIMARY KEY,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    branch_id VARCHAR(36) REFERENCES branches(id),
    cashier_id VARCHAR(36) REFERENCES users(id),
    customer_name VARCHAR(100),
    customer_phone VARCHAR(20),
    customer_member_type VARCHAR(30) DEFAULT 'REGULER',
    transaction_date DATE NOT NULL,
    transaction_time TIME NOT NULL,
    subtotal NUMERIC(12,2) NOT NULL,
    discount_total NUMERIC(12,2) DEFAULT 0,
    voucher_code VARCHAR(30),
    tax_ppn NUMERIC(12,2) DEFAULT 0,
    grand_total NUMERIC(12,2) NOT NULL,
    total_hpp NUMERIC(12,2) NOT NULL,
    gross_profit NUMERIC(12,2) NOT NULL,
    payment_method VARCHAR(30) NOT NULL, -- TUNAI, QRIS, TRANSFER_BANK, E-WALLET
    amount_paid NUMERIC(12,2) NOT NULL,
    change_amount NUMERIC(12,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'BERHASIL'
);

-- 11. Employees, Attendance & Payroll Tables
CREATE TABLE employees (
    id VARCHAR(36) PRIMARY KEY,
    nik VARCHAR(30) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    position VARCHAR(50) NOT NULL,
    branch_id VARCHAR(36) REFERENCES branches(id),
    phone VARCHAR(20) NOT NULL,
    join_date DATE NOT NULL,
    base_salary NUMERIC(12,2) NOT NULL,
    daily_meal_allowance NUMERIC(12,2) DEFAULT 25000,
    daily_transport_allowance NUMERIC(12,2) DEFAULT 15000,
    status VARCHAR(20) DEFAULT 'AKTIF'
);

CREATE TABLE attendances (
    id VARCHAR(36) PRIMARY KEY,
    employee_id VARCHAR(36) REFERENCES employees(id),
    date DATE NOT NULL,
    clock_in_time TIME,
    clock_out_time TIME,
    status VARCHAR(20) NOT NULL, -- HADIR, TERLAMBAT, IZIN, SAKIT, CUTI, ALPA
    late_minutes INT DEFAULT 0,
    overtime_hours NUMERIC(4,2) DEFAULT 0,
    gps_latitude NUMERIC(10,6),
    gps_longitude NUMERIC(10,6),
    photo_selfie_url TEXT
);

CREATE TABLE payrolls (
    id VARCHAR(36) PRIMARY KEY,
    payroll_number VARCHAR(50) UNIQUE NOT NULL,
    period_month VARCHAR(30) NOT NULL,
    employee_id VARCHAR(36) REFERENCES employees(id),
    base_salary NUMERIC(12,2) NOT NULL,
    meal_allowance NUMERIC(12,2) DEFAULT 0,
    transport_allowance NUMERIC(12,2) DEFAULT 0,
    overtime_pay NUMERIC(12,2) DEFAULT 0,
    bonus_performance NUMERIC(12,2) DEFAULT 0,
    deductions NUMERIC(12,2) DEFAULT 0,
    net_salary NUMERIC(12,2) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'DRAFT'
);

-- 12. Financial Cash Flow Ledger Table
CREATE TABLE financial_records (
    id VARCHAR(36) PRIMARY KEY,
    transaction_number VARCHAR(50) UNIQUE NOT NULL,
    date DATE NOT NULL,
    type VARCHAR(20) NOT NULL, -- PEMASUKAN, PENGELUARAN
    category VARCHAR(50) NOT NULL,
    account_type VARCHAR(30) NOT NULL, -- KAS_TUNAI, BANK_BCA, QRIS_SETTLEMENT
    amount NUMERIC(12,2) NOT NULL,
    branch_id VARCHAR(36) REFERENCES branches(id),
    description TEXT,
    recipient_or_payer VARCHAR(100)
);`;

  const copySql = () => {
    navigator.clipboard.writeText(postgresSqlSchema);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full h-[90vh] flex flex-col overflow-hidden border border-stone-200">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-red-800 to-red-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-amber-300" />
            <div>
              <h2 className="font-extrabold text-base leading-tight">
                Arsitektur Sistem, ERD & Blueprint ERP Lashira
              </h2>
              <p className="text-xs text-red-100">
                Spesifikasi Komprehensif: Flow Bisnis, Use Case, Database Schema & Data Flow
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-4 gap-1 overflow-x-auto">
          {[
            { id: 'FLOW', label: '1. Business Process Flow', icon: Workflow },
            { id: 'USECASE', label: '2. Use Case Matrix (RBAC)', icon: ShieldCheck },
            { id: 'ERD', label: '3. Entity Relationship (ERD)', icon: Layers },
            { id: 'SQL', label: '4. PostgreSQL DDL Schema', icon: Database },
            { id: 'ARCH', label: '5. System Architecture', icon: Server },
            { id: 'DATAFLOW', label: '6. Alur Data Antar Modul', icon: GitMerge },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`py-3 px-3.5 text-xs font-bold whitespace-nowrap flex items-center gap-2 border-b-2 transition ${
                  activeTab === t.id
                    ? 'border-red-600 text-red-600 bg-white shadow-sm'
                    : 'border-transparent text-stone-600 hover:text-stone-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 text-stone-800 text-xs leading-relaxed space-y-6">
          {/* TAB 1: BUSINESS PROCESS FLOW */}
          {activeTab === 'FLOW' && (
            <div className="space-y-6">
              <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                <h3 className="font-extrabold text-sm text-red-900 mb-1">
                  Alur Bisnis Utama (End-to-End Snack Value Chain)
                </h3>
                <p className="text-stone-600">
                  Seluruh mata rantai UMKM RumahJajananLashira dari pengadaan bahan mentah hingga ke tangan konsumen terintegrasi tanpa data terputus.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-stone-800 font-sans">
                <div className="p-3.5 bg-white rounded-xl border-2 border-red-200 shadow-sm relative">
                  <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full absolute -top-2.5 left-3">
                    TAHAP 1
                  </span>
                  <h4 className="font-bold text-red-800 mt-1 text-xs">Pemasok & Pengadaan</h4>
                  <ul className="mt-2 space-y-1 text-stone-600 list-disc list-inside">
                    <li>Input PO Supplier</li>
                    <li>Penerimaan Bahan Baku</li>
                    <li>Auto-tambah stok bahan</li>
                    <li>Pencatatan kas keluar</li>
                  </ul>
                </div>

                <div className="p-3.5 bg-white rounded-xl border-2 border-red-200 shadow-sm relative">
                  <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full absolute -top-2.5 left-3">
                    TAHAP 2
                  </span>
                  <h4 className="font-bold text-red-800 mt-1 text-xs">BOM, HPP & Produksi</h4>
                  <ul className="mt-2 space-y-1 text-stone-600 list-disc list-inside">
                    <li>Formulasi resep per gram/ml</li>
                    <li>Hitung HPP + Tenaga Kerja + Gas</li>
                    <li>Auto-potong stok bahan baku</li>
                    <li>QC Check & Nomor Batch</li>
                  </ul>
                </div>

                <div className="p-3.5 bg-white rounded-xl border-2 border-red-200 shadow-sm relative">
                  <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full absolute -top-2.5 left-3">
                    TAHAP 3
                  </span>
                  <h4 className="font-bold text-red-800 mt-1 text-xs">Distribusi Multi-Cabang</h4>
                  <ul className="mt-2 space-y-1 text-stone-600 list-disc list-inside">
                    <li>Permintaan restock cabang</li>
                    <li>Gudang buat Surat Jalan</li>
                    <li>Pengiriman oleh armada logistik</li>
                    <li>Konfirmasi terima di cabang</li>
                  </ul>
                </div>

                <div className="p-3.5 bg-white rounded-xl border-2 border-red-200 shadow-sm relative">
                  <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full absolute -top-2.5 left-3">
                    TAHAP 4
                  </span>
                  <h4 className="font-bold text-red-800 mt-1 text-xs">POS, Laba & Payroll</h4>
                  <ul className="mt-2 space-y-1 text-stone-600 list-disc list-inside">
                    <li>Scan POS barcode / QRIS</li>
                    <li>Cetak thermal receipt</li>
                    <li>Auto potong stok cabang</li>
                    <li>Laporan laba & payroll staf</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: USE CASE MATRIX */}
          {activeTab === 'USECASE' && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-stone-300 text-xs">
                  <thead>
                    <tr className="bg-red-700 text-white font-bold">
                      <th className="p-2.5 border border-red-800 text-left">Modul / Fungsionalitas</th>
                      <th className="p-2.5 border border-red-800 text-center">Owner</th>
                      <th className="p-2.5 border border-red-800 text-center">Admin Gudang</th>
                      <th className="p-2.5 border border-red-800 text-center">Admin Cabang</th>
                      <th className="p-2.5 border border-red-800 text-center">Kasir</th>
                      <th className="p-2.5 border border-red-800 text-center">HR & Finance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {[
                      { m: 'Executive Dashboard & Laba Semua Cabang', ow: true, ag: false, ac: false, ks: false, hr: false },
                      { m: 'Master Supplier & PO Pembelian Bahan', ow: true, ag: true, ac: false, ks: false, hr: false },
                      { m: 'Master Bahan Baku & Stok Opname Pusat', ow: true, ag: true, ac: false, ks: false, hr: false },
                      { m: 'Resep / BOM & Kalkulator Margin HPP', ow: true, ag: true, ac: false, ks: false, hr: false },
                      { m: 'Order Produksi, QC Batch & Packing', ow: true, ag: true, ac: false, ks: false, hr: false },
                      { m: 'Distribusi Stok & Cetak Surat Jalan', ow: true, ag: true, ac: true, ks: false, hr: false },
                      { m: 'Permintaan Restock Cabang (Stock Request)', ow: true, ag: true, ac: true, ks: false, hr: false },
                      { m: 'Kasir POS, Scan Barcode & Cetak Struk', ow: true, ag: false, ac: true, ks: true, hr: false },
                      { m: 'Laporan Penjualan (Harian/Shift/Bulan)', ow: true, ag: false, ac: true, ks: true, hr: true },
                      { m: 'Keuangan, Arus Kas & Kas Kecil', ow: true, ag: false, ac: true, ks: false, hr: true },
                      { m: 'Presensi GPS Selfie & Data Karyawan', ow: true, ag: true, ac: true, ks: true, hr: true },
                      { m: 'Payroll & Cetak Slip Gaji Otomatis', ow: true, ag: false, ac: false, ks: false, hr: true },
                      { m: 'Audit Log & Backup Database JSON', ow: true, ag: false, ac: false, ks: false, hr: false },
                    ].map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-stone-50'}>
                        <td className="p-2 font-semibold text-stone-800 border border-stone-300">{row.m}</td>
                        <td className="p-2 text-center border border-stone-300">
                          {row.ow ? <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold">Akses Penuh</span> : <span className="text-stone-300">-</span>}
                        </td>
                        <td className="p-2 text-center border border-stone-300">
                          {row.ag ? <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold">Akses</span> : <span className="text-stone-300">-</span>}
                        </td>
                        <td className="p-2 text-center border border-stone-300">
                          {row.ac ? <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold">Unit Sendiri</span> : <span className="text-stone-300">-</span>}
                        </td>
                        <td className="p-2 text-center border border-stone-300">
                          {row.ks ? <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold">Terbatas POS</span> : <span className="text-stone-300">-</span>}
                        </td>
                        <td className="p-2 text-center border border-stone-300">
                          {row.hr ? <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold">Akses HR</span> : <span className="text-stone-300">-</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ERD DIAGRAM */}
          {activeTab === 'ERD' && (
            <div className="space-y-4">
              <div className="p-4 bg-stone-900 text-stone-100 rounded-xl font-mono text-[11px] leading-relaxed overflow-x-auto border border-stone-700">
                <p className="text-amber-400 font-bold mb-2">// ENTITY RELATIONSHIP DIAGRAM (3NF SCHEMA MAP)</p>
                <pre>{`
+------------------+         +------------------+         +------------------+
|    SUPPLIERS     | 1 --- * |  PURCHASE_ORDERS | * --- 1 |  RAW_MATERIALS   |
|------------------|         |------------------|         |------------------|
| id (PK)          |         | id (PK)          |         | id (PK)          |
| name, phone      |         | supplier_id (FK) |         | current_stock    |
+------------------+         +------------------+         +------------------+
                                                                   | 1
                                                                   | *
+------------------+         +------------------+         +------------------+
|     PRODUCTS     | 1 --- 1 |     RECIPES      | 1 --- * |RECIPE_INGREDIENTS|
|------------------|         |------------------|         |------------------|
| id (PK), sku     |         | id (PK)          |         | material_id (FK) |
| hpp, price       |         | product_id (FK)  |         | quantity, unit   |
+------------------+         +------------------+         +------------------+
     | 1                          | 1
     | *                          | *
+------------------+         +------------------+
|  BRANCH_STOCKS   |         |PRODUCTION_ORDERS |
|------------------|         |------------------|
| branch_id (FK)   |         | batch_number     |
| product_id (FK)  |         | qc_status        |
+------------------+         +------------------+
     | *
     | 1
+------------------+         +------------------+         +------------------+
|     BRANCHES     | 1 --- * | SALE_TRANSACTIONS| 1 --- * |    FINANCIALS    |
|------------------|         |------------------|         |------------------|
| id (PK), name    |         | branch_id (FK)   |         | type (IN/OUT)    |
| city, is_main    |         | grand_total, hpp |         | amount, category |
+------------------+         +------------------+         +------------------+
     | 1
     | *
+------------------+         +------------------+         +------------------+
|    EMPLOYEES     | 1 --- * |   ATTENDANCES    | 1 --- 1 |     PAYROLLS     |
|------------------|         |------------------|         |------------------|
| id (PK), name    |         | employee_id (FK) |         | employee_id (FK) |
| base_salary      |         | clock_in, gps    |         | net_salary       |
+------------------+         +------------------+         +------------------+
                `}</pre>
              </div>
            </div>
          )}

          {/* TAB 4: SQL DDL */}
          {activeTab === 'SQL' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-700">PostgreSQL DDL Ready Script (3NF)</span>
                <button
                  onClick={copySql}
                  className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedSql ? 'Tersalin ke Clipboard!' : 'Salin DDL SQL'}
                </button>
              </div>
              <div className="p-4 bg-stone-900 text-stone-100 rounded-xl font-mono text-[11px] max-h-96 overflow-y-auto">
                <pre>{postgresSqlSchema}</pre>
              </div>
            </div>
          )}

          {/* TAB 5: SYSTEM ARCHITECTURE */}
          {activeTab === 'ARCH' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white border border-stone-200 rounded-xl shadow-sm space-y-2">
                  <span className="text-[10px] font-bold uppercase text-red-600 bg-red-50 px-2 py-0.5 rounded">
                    Frontend Layer
                  </span>
                  <h4 className="font-bold text-sm text-stone-900">Next.js / React + Tailwind CSS</h4>
                  <ul className="space-y-1 text-stone-600 list-disc list-inside text-xs">
                    <li>PWA Progressive Web App with offline cashier cache</li>
                    <li>Touch-friendly 44px+ buttons for ages 40-60</li>
                    <li>Red & White brand identity</li>
                    <li>Dynamic receipt, surat jalan, and payslip printing</li>
                  </ul>
                </div>

                <div className="p-4 bg-white border border-stone-200 rounded-xl shadow-sm space-y-2">
                  <span className="text-[10px] font-bold uppercase text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                    Backend & Realtime
                  </span>
                  <h4 className="font-bold text-sm text-stone-900">Express / NestJS + WebSocket</h4>
                  <ul className="space-y-1 text-stone-600 list-disc list-inside text-xs">
                    <li>JWT Authentication with Role Based Access Control (RBAC)</li>
                    <li>WebSocket real-time broadcast across all branches</li>
                    <li>Automated stock mutation & financial ledger synchronization</li>
                    <li>Open REST API for Shopee & TikTok Shop marketplace webhooks</li>
                  </ul>
                </div>

                <div className="p-4 bg-white border border-stone-200 rounded-xl shadow-sm space-y-2">
                  <span className="text-[10px] font-bold uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    Database & Storage
                  </span>
                  <h4 className="font-bold text-sm text-stone-900">PostgreSQL + Prisma ORM</h4>
                  <ul className="space-y-1 text-stone-600 list-disc list-inside text-xs">
                    <li>ACID Transactions for POS sales & stock deductions</li>
                    <li>S3/Supabase Storage for selfie attendance & nota proofs</li>
                    <li>Automated nightly database backup & JSON dumps</li>
                    <li>Immutable audit logging trail</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: DATA FLOW */}
          {activeTab === 'DATAFLOW' && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-stone-800 space-y-2">
                <h4 className="font-bold text-amber-900 text-xs uppercase tracking-wider">
                  Contoh Alur Otomatisasi Terpadu:
                </h4>
                <ol className="list-decimal list-inside space-y-1.5 text-xs text-stone-700">
                  <li>
                    <strong className="text-stone-900">Pembelian Bahan Baku:</strong> Admin Gudang input PO 250kg Tapioka -&gt; Stok Tapioka otomatis +250kg -&gt; Otomatis tercatat pengeluaran di kas/bank.
                  </li>
                  <li>
                    <strong className="text-stone-900">Produksi Snack:</strong> Dibuat batch 100 pcs Basreng Pedas -&gt; Bahan (Tapioka 12kg, Cabai 1.8kg, Pouch 100pcs) otomatis terpotong -&gt; Lulus QC -&gt; Stok Produk Pusat bertambah +100 pcs.
                  </li>
                  <li>
                    <strong className="text-stone-900">Distribusi ke Cabang Dago:</strong> Gudang kirim 30 pcs via Surat Jalan -&gt; Cabang Dago klik terima -&gt; Stok Gudang Pusat berkurang -30 pcs, stok Cabang Dago bertambah +30 pcs.
                  </li>
                  <li>
                    <strong className="text-stone-900">Penjualan di Kasir:</strong> Pelanggan beli 2 pcs Basreng -&gt; Stok Cabang Dago berkurang -2 pcs -&gt; Otomatis tercatat omzet Rp 32.000 & laba kotor Rp 13.600 di dashboard Owner.
                  </li>
                  <li>
                    <strong className="text-stone-900">Presensi & Payroll:</strong> Kasir absen selfie & GPS -&gt; Sistem mendeteksi keterlambatan & lembur -&gt; Di akhir bulan, HRD tinggal klik &quot;Hitung Payroll&quot; untuk mencetak slip gaji.
                  </li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex items-center justify-between">
          <p className="text-[11px] text-stone-500 font-medium">
            Dokumentasi Sistem RumahJajananLashira Enterprise Architecture v1.2
          </p>
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white font-bold rounded-xl text-xs shadow transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
