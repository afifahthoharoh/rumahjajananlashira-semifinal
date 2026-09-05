export type UserRole = 'OWNER' | 'ADMIN_GUDANG' | 'ADMIN_CABANG' | 'KASIR' | 'HR_ADMIN' | 'KARYAWAN';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  roleTitle: string;
  branchId: string; // 'PUSAT' or specific branch id
  branchName: string;
  email: string;
  avatarUrl?: string;
  phone: string;
}

export interface Branch {
  id: string;
  code: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  managerName: string;
  isMainWarehouse: boolean;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Supplier {
  id: string;
  code: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  category: string; // 'Tepung & Bumbu' | 'Minyak & Gas' | 'Kemasan & Plastik' | 'Lainnya'
  status: 'ACTIVE' | 'INACTIVE';
  paymentTerms: string; // 'COD' | 'Tempo 14 Hari' | 'Tempo 30 Hari' | 'Transfer Dimuka'
  bankAccount?: string;
  notes?: string;
}

export interface RawMaterial {
  id: string;
  code: string;
  name: string;
  category: 'Tepung & Pati' | 'Bumbu & Cabai' | 'Minyak & Lemak' | 'Kemasan & Plastik' | 'Bahan Penunjang';
  unit: 'kg' | 'gram' | 'liter' | 'ml' | 'pcs' | 'lembar' | 'roll';
  currentStock: number;
  minimumStock: number;
  avgPricePerUnit: number;
  lastPurchasedPrice: number;
  warehouseLocation: string;
  barcode: string;
  batchNumber?: string;
  expiryDate?: string;
  supplierId?: string;
  supplierName?: string;
}

export interface RawMaterialMutation {
  id: string;
  materialId: string;
  materialName: string;
  materialCode: string;
  date: string;
  time: string;
  type: 'INBOUND_PO' | 'OUTBOUND_PRODUCTION' | 'ADJUSTMENT_OPNAME' | 'USAGE_MANUAL' | 'WASTE_EXPIRED';
  quantity: number; // positive for additions, negative for deductions
  unit: string;
  stockBefore: number;
  stockAfter: number;
  referenceNumber: string; // PO number, SPK batch, Opname code, etc.
  actorName: string;
  notes?: string;
}

export interface PurchaseOrderItem {
  materialId: string;
  materialName: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  date: string;
  supplierId: string;
  supplierName: string;
  items: PurchaseOrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  taxPpn: number; // 11% or nominal
  grandTotal: number;
  paymentStatus: 'LUNAS' | 'BELUM_LUNAS' | 'TEMPO';
  dueDate?: string;
  invoiceProofUrl?: string;
  notes?: string;
  receivedStatus: 'DITERIMA_LENGKAP' | 'SEBAGIAN' | 'MENUNGGU';
  createdAt: string;
  createdBy: string;
}

export interface RecipeIngredient {
  materialId: string;
  materialName: string;
  quantity: number;
  unit: string;
  costPerUnit: number;
  subtotalCost: number;
}

export interface Recipe {
  id: string;
  productId: string;
  productName: string;
  batchYield: number; // e.g., 100 pcs
  ingredients: RecipeIngredient[];
  laborCostPerBatch: number;
  overheadCostPerBatch: number; // gas, electric, machine depreciation
  packagingCostPerBatch: number;
  totalCostPerBatch: number;
  hppPerUnit: number;
  suggestedMarginPercent: number; // 30, 40, 50%
  suggestedSellingPrice: number;
  lastUpdated: string;
  updatedBy: string;
}

export interface QualityControlCheck {
  appearanceScore: number; // 1-5
  crunchinessScore: number; // 1-5
  tasteSpiceScore: number; // 1-5
  packagingSealScore: number; // 1-5
  status: 'PASSED' | 'REWORK' | 'REJECTED';
  inspectorName: string;
  checkedAt: string;
  notes?: string;
}

export interface ProductionOrder {
  id: string;
  productionNumber: string;
  batchNumber: string;
  productId: string;
  productName: string;
  quantityTarget: number;
  quantityProduced: number;
  quantityDefect: number;
  startDate: string;
  endDate?: string;
  operatorName: string;
  supervisorName: string;
  status: 'DIRENCANAKAN' | 'SEDANG_PRODUKSI' | 'QC_CHECK' | 'SELESAI' | 'DIBATALKAN';
  totalMaterialCost: number;
  totalOverheadCost: number;
  unitHpp: number;
  qc?: QualityControlCheck;
  notes?: string;
}

export interface Product {
  id: string;
  sku: string;
  barcode: string;
  name: string;
  category: 'Basreng' | 'Keripik Kaca' | 'Makaroni' | 'Seblak Kering' | 'Usus & Kulit' | 'Kriuk Pedas Lainnya';
  weightGrams: number;
  packageType: 'Standing Pouch 14x22' | 'Pouch Ziplock Metalik' | 'Toples Tabung 800ml' | 'Plastik Curah 1kg';
  hpp: number;
  sellingPrice: number;
  minimumStockWarning: number;
  imageUrl?: string;
  description: string;
  status: 'ACTIVE' | 'DISCONTINUED';
  spicyLevel?: 'Original' | 'Pedas Sedang' | 'Ekstra Pedas Daun Jeruk' | 'Super Pedas Mampus';
}

export interface BranchStockItem {
  id: string;
  branchId: string;
  branchName: string;
  productId: string;
  productName: string;
  sku: string;
  stockQty: number;
  minimumStock: number;
  lastUpdated: string;
}

export interface StockTransferItem {
  productId: string;
  productName: string;
  sku: string;
  quantitySent: number;
  quantityReceived?: number;
  unitPrice?: number;
}

export type StockDistributionItem = StockTransferItem;

export interface StockDistribution {
  id: string;
  transferNumber: string;
  suratJalanNumber: string;
  fromBranchId: string;
  fromBranchName: string;
  toBranchId: string;
  toBranchName: string;
  sentDate: string;
  receivedDate?: string;
  driverName: string;
  vehiclePlate: string;
  items: StockTransferItem[];
  status: 'DALAM_PENGIRIMAN' | 'DITERIMA_LENGKAP' | 'DITERIMA_SEBAGIAN' | 'DITOLAK';
  notes?: string;
  receivedBy?: string;
  rejectionReason?: string;
}

export interface StockRequest {
  id: string;
  requestNumber: string;
  branchId: string;
  branchName: string;
  requestDate: string;
  requiredDate: string;
  items: {
    productId: string;
    productName: string;
    currentStock: number;
    requestedQty: number;
    approvedQty?: number;
  }[];
  urgency: 'NORMAL' | 'TINGGI' | 'MENDESAK';
  status: 'MENUNGGU_PERSETUJUAN' | 'DISETUJUI' | 'SEDANG_DIKIRIM' | 'SELESAI' | 'DITOLAK';
  requestedBy: string;
  approvedBy?: string;
  distributionId?: string;
  notes?: string;
}

export interface CartItem {
  productId: string;
  productName: string;
  sku: string;
  price: number;
  hpp: number;
  quantity: number;
  subtotal: number;
  discount?: number;
}

export type SaleItem = CartItem;
export type Sale = SaleTransaction;

export interface SaleTransaction {
  id: string;
  invoiceNumber: string;
  branchId: string;
  branchName: string;
  cashierId: string;
  cashierName: string;
  customerName?: string;
  customerPhone?: string;
  customerMemberType?: 'REGULER' | 'MEMBER_VIP' | 'RESELLER' | 'DROPSHIP';
  date: string;
  time: string;
  items: CartItem[];
  subtotal: number;
  discountTotal: number;
  voucherCode?: string;
  taxPpn: number;
  grandTotal: number;
  totalHpp: number;
  grossProfit: number;
  paymentMethod: 'TUNAI' | 'QRIS' | 'TRANSFER_BANK' | 'SHOPEEPAY' | 'GOPAY_OVO';
  amountPaid: number;
  changeAmount: number;
  status: 'BERHASIL' | 'RETUR';
  notes?: string;
}

export interface FinancialRecord {
  id: string;
  transactionNumber: string;
  date: string;
  type: 'PEMASUKAN' | 'PENGELUARAN';
  category: 
    | 'Penjualan Produk'
    | 'Pembelian Bahan Baku'
    | 'Gaji & Payroll'
    | 'Listrik & Gas Produksi'
    | 'Sewa Tempat & Cabang'
    | 'Operasional & Kas Kecil'
    | 'Logistik & Distribusi'
    | 'Maintenance Alat'
    | 'Pemasukan Lainnya';
  accountType: 'KAS_TUNAI' | 'BANK_BCA' | 'BANK_MANDIRI' | 'QRIS_SETTLEMENT';
  amount: number;
  branchId: string;
  branchName: string;
  description: string;
  recipientOrPayer: string;
  proofUrl?: string;
  referenceId?: string; // invoiceId, poId, payrollId
}

export interface Employee {
  id: string;
  nik: string;
  name: string;
  position: 'Owner' | 'Kepala Produksi' | 'Operator Goreng & Bumbu' | 'Staff Packing' | 'Admin Gudang' | 'Kepala Cabang' | 'Kasir' | 'Driver Logistik' | 'HR & Keuangan';
  branchId: string;
  branchName: string;
  phone: string;
  email: string;
  address: string;
  joinDate: string;
  employmentStatus: 'TETAP' | 'KONTRAK' | 'HARIAN_LEPAS';
  baseSalary: number;
  dailyMealAllowance: number;
  dailyTransportAllowance: number;
  bankName: string;
  bankAccountNumber: string;
  status: 'AKTIF' | 'CUTI' | 'NON_AKTIF';
  photoUrl?: string;
  password?: string; // Kata sandi login portal karyawan, default: 'lashira123'
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  branchId: string;
  branchName: string;
  date: string;
  clockInTime?: string;
  clockOutTime?: string;
  status: 'HADIR' | 'TERLAMBAT' | 'IZIN' | 'SAKIT' | 'CUTI' | 'ALPA';
  lateMinutes: number;
  overtimeHours: number;
  photoSelfieUrl?: string;
  gpsLocation?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  notes?: string;
}

export interface PayrollRecord {
  id: string;
  payrollNumber: string;
  periodMonth: string; // e.g. 'September 2026'
  employeeId: string;
  employeeName: string;
  position: string;
  branchName: string;
  workingDaysPresent: number;
  totalLateDeductions: number;
  overtimeHours: number;
  baseSalary: number;
  mealAllowance: number;
  transportAllowance: number;
  overtimePay: number;
  bonusPerformance: number;
  deductions: number; // BPJS or cash advance
  netSalary: number;
  paymentStatus: 'DRAFT' | 'DIBAYARKAN';
  paymentDate?: string;
  notes?: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'WARNING_STOK' | 'PERMINTAAN_CABANG' | 'PRODUKSI_SELESAI' | 'PEMBELIAN_MASUK' | 'PENJUALAN_BESAR' | 'INFO';
  timestamp: string;
  isRead: boolean;
  actionLink?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  module: string;
  details: string;
}
