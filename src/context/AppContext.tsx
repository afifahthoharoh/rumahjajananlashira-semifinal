import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Branch,
  Supplier,
  RawMaterial,
  Product,
  Recipe,
  ProductionOrder,
  PurchaseOrder,
  BranchStockItem,
  StockDistribution,
  StockRequest,
  SaleTransaction,
  FinancialRecord,
  Employee,
  AttendanceRecord,
  PayrollRecord,
  SystemNotification,
  AuditLog,
  QualityControlCheck,
  RawMaterialMutation,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_BRANCHES,
  INITIAL_SUPPLIERS,
  INITIAL_RAW_MATERIALS,
  INITIAL_RAW_MATERIAL_MUTATIONS,
  INITIAL_PRODUCTS,
  INITIAL_RECIPES,
  INITIAL_PRODUCTION_ORDERS,
  INITIAL_PURCHASES,
  INITIAL_BRANCH_STOCKS,
  INITIAL_DISTRIBUTIONS,
  INITIAL_STOCK_REQUESTS,
  INITIAL_SALES,
  INITIAL_FINANCIAL_RECORDS,
  INITIAL_EMPLOYEES,
  INITIAL_ATTENDANCE,
  INITIAL_PAYROLL,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
} from '../mockData';
import { translations, Language } from '../i18n/translations';

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  login: (role: UserRole, branchId?: string, email?: string, name?: string) => boolean;
  loginAsEmployee: (fullName: string, password: string) => { success: boolean; message: string; employee?: Employee };
  logout: () => void;
  switchUserRole: (role: UserRole, branchId?: string) => void;
  activeBranchId: string;
  setActiveBranchId: (branchId: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;

  branches: Branch[];
  suppliers: Supplier[];
  rawMaterials: RawMaterial[];
  rawMaterialMutations: RawMaterialMutation[];
  products: Product[];
  recipes: Recipe[];
  productionOrders: ProductionOrder[];
  purchases: PurchaseOrder[];
  branchStocks: BranchStockItem[];
  distributions: StockDistribution[];
  stockRequests: StockRequest[];
  sales: SaleTransaction[];
  financialRecords: FinancialRecord[];
  employees: Employee[];
  attendances: AttendanceRecord[];
  payrolls: PayrollRecord[];
  notifications: SystemNotification[];
  auditLogs: AuditLog[];

  // Language & i18n
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (typeof translations)['id'];

  // Modifiers
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  updateSupplier: (id: string, supplier: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;

  addRawMaterial: (material: Omit<RawMaterial, 'id'>) => void;
  updateRawMaterial: (id: string, material: Partial<RawMaterial>) => void;
  adjustRawMaterialStock: (id: string, newStock: number, reason: string) => void;
  recordRawMaterialInbound: (params: {
    materialId: string;
    quantity: number;
    unitPrice?: number;
    supplierName?: string;
    poNumber?: string;
    notes?: string;
  }) => void;
  recordRawMaterialUsage: (params: {
    materialId: string;
    quantity: number;
    usedFor: string;
    operatorName: string;
    notes?: string;
  }) => { success: boolean; message: string };
  recordRawMaterialOpname: (params: {
    materialId: string;
    physicalStock: number;
    reason: string;
    notes?: string;
  }) => void;

  createPurchase: (po: Omit<PurchaseOrder, 'id' | 'poNumber' | 'createdAt' | 'createdBy'>) => void;
  
  saveRecipe: (recipe: Recipe) => void;
  
  createProductionOrder: (order: {
    productId: string;
    productName: string;
    quantityTarget: number;
    operatorName: string;
    notes?: string;
  }) => { success: boolean; message: string };

  completeProductionQC: (orderId: string, qc: QualityControlCheck) => void;

  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  adjustBranchStock: (branchId: string, productId: string, newQty: number, reason: string) => void;

  createStockTransfer: (transfer: {
    fromBranchId: string;
    toBranchId: string;
    driverName: string;
    vehiclePlate: string;
    items: { productId: string; quantity: number }[];
    notes?: string;
  }) => { success: boolean; message: string };

  receiveStockTransfer: (distributionId: string, status: 'DITERIMA_LENGKAP' | 'DITERIMA_SEBAGIAN' | 'DITOLAK', notes?: string) => void;

  createStockRequest: (req: {
    branchId: string;
    requiredDate: string;
    urgency: 'NORMAL' | 'TINGGI' | 'MENDESAK';
    items: { productId: string; requestedQty: number }[];
    notes?: string;
  }) => void;

  approveStockRequest: (requestId: string) => void;

  createSaleTransaction: (sale: Omit<SaleTransaction, 'id' | 'invoiceNumber' | 'date' | 'time'>) => SaleTransaction;

  createFinancialRecord: (record: Omit<FinancialRecord, 'id' | 'transactionNumber'>) => void;

  recordAttendance: (att: {
    employeeId: string;
    clockIn: boolean;
    status?: 'HADIR' | 'TERLAMBAT' | 'IZIN' | 'SAKIT' | 'CUTI' | 'ALPA';
    photoSelfieUrl?: string;
    gpsLocation?: { latitude: number; longitude: number; address: string };
    notes?: string;
    overtimeHours?: number;
  }) => void;

  generateMonthlyPayroll: (month: string) => void;
  markPayrollPaid: (payrollId: string) => void;

  addEmployee: (emp: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, emp: Partial<Employee>) => void;

  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  resetToDemoData: () => void;
  exportDatabaseJson: () => string;
  importDatabaseJson: (json: string) => boolean;

  // Selected receipt/surat jalan modal triggers
  selectedSaleForPrint: SaleTransaction | null;
  setSelectedSaleForPrint: (sale: SaleTransaction | null) => void;
  selectedDistributionForPrint: StockDistribution | null;
  setSelectedDistributionForPrint: (dist: StockDistribution | null) => void;
  selectedPayrollForPrint: PayrollRecord | null;
  setSelectedPayrollForPrint: (pay: PayrollRecord | null) => void;
  showSystemDocsModal: boolean;
  setShowSystemDocsModal: (show: boolean) => void;
  showDocsModal: boolean;
  setShowDocsModal: (show: boolean) => void;
  showRoleGuideModal: boolean;
  setShowRoleGuideModal: (show: boolean) => void;
  autoShowRoleGuide: boolean;
  setAutoShowRoleGuide: (auto: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'LASHIRA_ERP_DATA_V1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Robust load initial or local storage state
  const loadStored = <T,>(key: string, fallback: T): T => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_${key}`);
      if (!stored || stored === 'undefined' || stored === 'null') return fallback;
      const parsed = JSON.parse(stored);
      if (parsed === null || parsed === undefined) return fallback;
      if (Array.isArray(fallback) && !Array.isArray(parsed)) return fallback;
      if (typeof fallback === 'object' && fallback !== null && typeof parsed !== 'object') return fallback;
      return parsed;
    } catch {
      return fallback;
    }
  };

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => loadStored('isAuthenticated', true));
  const [currentUser, setCurrentUser] = useState<User>(() => loadStored('currentUser', INITIAL_USERS[0]) || INITIAL_USERS[0]);
  const [activeBranchId, setActiveBranchId] = useState<string>('BR-PUSAT');
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const [branches, setBranches] = useState<Branch[]>(() => loadStored('branches', INITIAL_BRANCHES));
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => loadStored('suppliers', INITIAL_SUPPLIERS));
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>(() => loadStored('rawMaterials', INITIAL_RAW_MATERIALS));
  const [rawMaterialMutations, setRawMaterialMutations] = useState<RawMaterialMutation[]>(() => loadStored('rawMaterialMutations', INITIAL_RAW_MATERIAL_MUTATIONS));
  const [products, setProducts] = useState<Product[]>(() => loadStored('products', INITIAL_PRODUCTS));
  const [recipes, setRecipes] = useState<Recipe[]>(() => loadStored('recipes', INITIAL_RECIPES));
  const [productionOrders, setProductionOrders] = useState<ProductionOrder[]>(() => loadStored('productionOrders', INITIAL_PRODUCTION_ORDERS));
  const [purchases, setPurchases] = useState<PurchaseOrder[]>(() => loadStored('purchases', INITIAL_PURCHASES));
  const [branchStocks, setBranchStocks] = useState<BranchStockItem[]>(() => loadStored('branchStocks', INITIAL_BRANCH_STOCKS));
  const [distributions, setDistributions] = useState<StockDistribution[]>(() => loadStored('distributions', INITIAL_DISTRIBUTIONS));
  const [stockRequests, setStockRequests] = useState<StockRequest[]>(() => loadStored('stockRequests', INITIAL_STOCK_REQUESTS));
  const [sales, setSales] = useState<SaleTransaction[]>(() => loadStored('sales', INITIAL_SALES));
  const [financialRecords, setFinancialRecords] = useState<FinancialRecord[]>(() => loadStored('financialRecords', INITIAL_FINANCIAL_RECORDS));
  const [employees, setEmployees] = useState<Employee[]>(() => loadStored('employees', INITIAL_EMPLOYEES));
  const [attendances, setAttendances] = useState<AttendanceRecord[]>(() => loadStored('attendances', INITIAL_ATTENDANCE));
  const [payrolls, setPayrolls] = useState<PayrollRecord[]>(() => loadStored('payrolls', INITIAL_PAYROLL));
  const [notifications, setNotifications] = useState<SystemNotification[]>(() => loadStored('notifications', INITIAL_NOTIFICATIONS));
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => loadStored('auditLogs', INITIAL_AUDIT_LOGS));

  // Modal print states
  const [selectedSaleForPrint, setSelectedSaleForPrint] = useState<SaleTransaction | null>(null);
  const [selectedDistributionForPrint, setSelectedDistributionForPrint] = useState<StockDistribution | null>(null);
  const [selectedPayrollForPrint, setSelectedPayrollForPrint] = useState<PayrollRecord | null>(null);
  const [showSystemDocsModal, setShowSystemDocsModal] = useState<boolean>(false);
  const [showRoleGuideModal, setShowRoleGuideModal] = useState<boolean>(false);
  const [autoShowRoleGuide, setAutoShowRoleGuide] = useState<boolean>(() => loadStored('autoShowRoleGuide', true));

  // Language state
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_language`);
      return saved === 'en' || saved === 'id' ? (saved as Language) : 'id';
    } catch {
      return 'id';
    }
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(`${STORAGE_KEY}_language`, lang);
    } catch (e) {
      console.warn(e);
    }
  };

  const t = translations[language] || translations.id;

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_isAuthenticated`, JSON.stringify(isAuthenticated));
      localStorage.setItem(`${STORAGE_KEY}_autoShowRoleGuide`, JSON.stringify(autoShowRoleGuide));
      localStorage.setItem(`${STORAGE_KEY}_currentUser`, JSON.stringify(currentUser));
      localStorage.setItem(`${STORAGE_KEY}_branches`, JSON.stringify(branches));
      localStorage.setItem(`${STORAGE_KEY}_suppliers`, JSON.stringify(suppliers));
      localStorage.setItem(`${STORAGE_KEY}_rawMaterials`, JSON.stringify(rawMaterials));
      localStorage.setItem(`${STORAGE_KEY}_rawMaterialMutations`, JSON.stringify(rawMaterialMutations));
      localStorage.setItem(`${STORAGE_KEY}_products`, JSON.stringify(products));
      localStorage.setItem(`${STORAGE_KEY}_recipes`, JSON.stringify(recipes));
      localStorage.setItem(`${STORAGE_KEY}_productionOrders`, JSON.stringify(productionOrders));
      localStorage.setItem(`${STORAGE_KEY}_purchases`, JSON.stringify(purchases));
      localStorage.setItem(`${STORAGE_KEY}_branchStocks`, JSON.stringify(branchStocks));
      localStorage.setItem(`${STORAGE_KEY}_distributions`, JSON.stringify(distributions));
      localStorage.setItem(`${STORAGE_KEY}_stockRequests`, JSON.stringify(stockRequests));
      localStorage.setItem(`${STORAGE_KEY}_sales`, JSON.stringify(sales));
      localStorage.setItem(`${STORAGE_KEY}_financialRecords`, JSON.stringify(financialRecords));
      localStorage.setItem(`${STORAGE_KEY}_employees`, JSON.stringify(employees));
      localStorage.setItem(`${STORAGE_KEY}_attendances`, JSON.stringify(attendances));
      localStorage.setItem(`${STORAGE_KEY}_payrolls`, JSON.stringify(payrolls));
      localStorage.setItem(`${STORAGE_KEY}_notifications`, JSON.stringify(notifications));
      localStorage.setItem(`${STORAGE_KEY}_auditLogs`, JSON.stringify(auditLogs));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [
    currentUser,
    branches,
    suppliers,
    rawMaterials,
    rawMaterialMutations,
    products,
    recipes,
    productionOrders,
    purchases,
    branchStocks,
    distributions,
    stockRequests,
    sales,
    financialRecords,
    employees,
    attendances,
    payrolls,
    notifications,
    auditLogs,
  ]);

  // Helper to log audit
  const logAudit = (action: string, module: string, details: string) => {
    const newLog: AuditLog = {
      id: `LOG-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleString('id-ID'),
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action,
      module,
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev.slice(0, 199)]);
  };

  // Helper to add notification
  const addNotification = (title: string, message: string, type: SystemNotification['type'], actionLink?: string) => {
    const newNotif: SystemNotification = {
      id: `NOTIF-${Date.now()}`,
      title,
      message,
      type,
      timestamp: 'Baru saja',
      isRead: false,
      actionLink,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Authentication & Login
  const login = (role: UserRole, branchId?: string, email?: string, name?: string): boolean => {
    const targetUser = INITIAL_USERS.find((u) => u.role === role) || INITIAL_USERS[0];
    const targetBranch = branchId || (role === 'ADMIN_CABANG' || role === 'KASIR' ? 'BR-01' : 'BR-PUSAT');
    const branchObj = branches.find((b) => b.id === targetBranch) || branches[0];

    const loggedUser: User = {
      ...targetUser,
      name: name || targetUser.name,
      email: email || targetUser.email,
      branchId: targetBranch,
      branchName: branchObj.name,
    };

    setCurrentUser(loggedUser);
    setActiveBranchId(targetBranch);
    setIsAuthenticated(true);

    // Set landing tab based on role
    if (role === 'KASIR') {
      setActiveTab('penjualan-pos');
    } else if (role === 'HR_ADMIN') {
      setActiveTab('absensi');
    } else if (role === 'ADMIN_GUDANG') {
      setActiveTab('stok-bahan');
    } else if (role === 'ADMIN_CABANG') {
      setActiveTab('stok-produk');
    } else {
      setActiveTab('dashboard');
    }

    logAudit('USER_LOGIN', 'Autentikasi RBAC', `Pengguna ${loggedUser.name} login sebagai ${role} di ${branchObj.name}`);
    addNotification(
      'Login Berhasil',
      `Selamat datang, ${loggedUser.name}! Anda aktif sebagai ${loggedUser.roleTitle} (${branchObj.name}).`,
      'INFO'
    );

    if (autoShowRoleGuide) {
      setShowRoleGuideModal(true);
    }
    return true;
  };

  const logout = () => {
    logAudit('USER_LOGOUT', 'Autentikasi RBAC', `Pengguna ${currentUser.name} keluar dari sistem`);
    setIsAuthenticated(false);
  };

  // Dedicated Employee Login (Full Name & Password as registered by HR)
  const loginAsEmployee = (
    fullName: string,
    pass: string
  ): { success: boolean; message: string; employee?: Employee } => {
    const trimmedName = fullName.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (!trimmedName) {
      return { success: false, message: 'Masukkan nama lengkap karyawan' };
    }
    if (!cleanPass) {
      return { success: false, message: 'Masukkan kata sandi' };
    }

    // Lookup employee in the current HR registered employees list
    const matched = employees.find(
      (e) =>
        e &&
        e.name &&
        (e.name.trim().toLowerCase() === trimmedName ||
          e.name.toLowerCase().includes(trimmedName) ||
          trimmedName.includes(e.name.toLowerCase()))
    );

    if (!matched) {
      return {
        success: false,
        message: `Karyawan dengan nama "${fullName}" tidak terdaftar di sistem HR. Pastikan nama lengkap sesuai yang didaftarkan.`,
      };
    }

    const expectedPassword = matched.password || 'lashira123';
    if (cleanPass !== expectedPassword) {
      return {
        success: false,
        message: 'Kata sandi tidak sesuai. Silakan periksa kembali atau hubungi HR.',
      };
    }

    const branchObj = branches.find((b) => b.id === matched.branchId) || branches[0];
    const loggedUser: User = {
      id: matched.id,
      name: matched.name,
      role: 'KARYAWAN',
      roleTitle: matched.position,
      branchId: matched.branchId,
      branchName: branchObj ? branchObj.name : matched.branchName,
      email: matched.email,
      phone: matched.phone,
      avatarUrl:
        matched.photoUrl ||
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    };

    setCurrentUser(loggedUser);
    setActiveBranchId(matched.branchId);
    setIsAuthenticated(true);
    setActiveTab('dashboard');

    logAudit(
      'USER_LOGIN',
      'Portal Karyawan',
      `Karyawan ${matched.name} (${matched.position}) berhasil login ke Portal Presensi Mandiri`
    );
    addNotification(
      'Login Karyawan Berhasil',
      `Halo ${matched.name}, Anda berhasil masuk. Silakan lakukan presensi hari ini.`,
      'INFO'
    );

    setShowRoleGuideModal(false);
    return { success: true, message: `Selamat datang, ${matched.name}!`, employee: matched };
  };

  // Role Switcher
  const switchUserRole = (role: UserRole, branchId?: string) => {
    const targetUser = INITIAL_USERS.find((u) => u.role === role) || INITIAL_USERS[0];
    const targetBranch = branchId || targetUser.branchId;
    const branchObj = branches.find((b) => b.id === targetBranch) || branches[0];

    const updatedUser: User = {
      ...targetUser,
      branchId: targetBranch,
      branchName: branchObj.name,
    };

    setCurrentUser(updatedUser);
    setActiveBranchId(targetBranch);

    // Always navigate to the role's dedicated specialized dashboard
    setActiveTab('dashboard');

    logAudit('SWITCH_ROLE', 'Sistem RBAC', `Beralih ke peran ${role} (${branchObj.name})`);
    setShowRoleGuideModal(false);
  };

  // 1. Supplier
  const addSupplier = (supplier: Omit<Supplier, 'id'>) => {
    const newSupplier: Supplier = {
      ...supplier,
      id: `SUP-${Date.now()}`,
    };
    setSuppliers((prev) => [newSupplier, ...prev]);
    logAudit('CREATE_SUPPLIER', 'Supplier', `Menambahkan supplier: ${supplier.name}`);
    addNotification('Supplier Baru Ditambahkan', `Supplier ${supplier.name} telah berhasil didaftarkan.`, 'INFO', 'supplier');
  };

  const updateSupplier = (id: string, updated: Partial<Supplier>) => {
    setSuppliers((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
    logAudit('UPDATE_SUPPLIER', 'Supplier', `Memperbarui supplier ID: ${id}`);
  };

  const deleteSupplier = (id: string) => {
    setSuppliers((prev) => prev.filter((s) => s.id !== id));
    logAudit('DELETE_SUPPLIER', 'Supplier', `Menghapus supplier ID: ${id}`);
  };

  // 2. Purchasing
  const createPurchase = (poData: Omit<PurchaseOrder, 'id' | 'poNumber' | 'createdAt' | 'createdBy'>) => {
    const poNumber = `PO-LSH-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(purchases.length + 1).padStart(3, '0')}`;
    const newPo: PurchaseOrder = {
      ...poData,
      id: `PO-${Date.now()}`,
      poNumber,
      createdAt: new Date().toISOString(),
      createdBy: currentUser.name,
    };

    const now = new Date();
    const dateStr = poData.date || now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().slice(0, 5);

    // Auto increment Raw Materials stock!
    setRawMaterials((prev) =>
      prev.map((rm) => {
        const itemPurchased = poData.items.find((it) => it.materialId === rm.id);
        if (itemPurchased) {
          const newStock = rm.currentStock + itemPurchased.quantity;
          return {
            ...rm,
            currentStock: newStock,
            lastPurchasedPrice: itemPurchased.unitPrice,
          };
        }
        return rm;
      })
    );

    // Auto record RawMaterialMutation for each item
    const newMutations: RawMaterialMutation[] = poData.items.map((it) => {
      const rm = rawMaterials.find((m) => m.id === it.materialId);
      const before = rm ? rm.currentStock : 0;
      return {
        id: `MUT-${Date.now()}-${it.materialId}`,
        materialId: it.materialId,
        materialName: it.materialName,
        materialCode: rm?.code || 'RM',
        date: dateStr,
        time: timeStr,
        type: 'INBOUND_PO',
        quantity: it.quantity,
        unit: it.unit,
        stockBefore: before,
        stockAfter: before + it.quantity,
        referenceNumber: poNumber,
        actorName: currentUser.name,
        notes: `Penerimaan PO ${poNumber} dari ${poData.supplierName}`,
      };
    });
    setRawMaterialMutations((prev) => [...newMutations, ...prev]);

    // Auto record Financial Expense!
    const newFin: FinancialRecord = {
      id: `FIN-PO-${Date.now()}`,
      transactionNumber: `FIN-EXP-${poNumber}`,
      date: poData.date,
      type: 'PENGELUARAN',
      category: 'Pembelian Bahan Baku',
      accountType: 'BANK_BCA',
      amount: poData.grandTotal,
      branchId: 'BR-PUSAT',
      branchName: 'Pusat Produksi & Gudang Utama',
      description: `Pembelian bahan baku PO ${poNumber} dari ${poData.supplierName}`,
      recipientOrPayer: poData.supplierName,
      referenceId: newPo.id,
    };

    setPurchases((prev) => [newPo, ...prev]);
    setFinancialRecords((prev) => [newFin, ...prev]);

    logAudit('CREATE_PURCHASE', 'Pembelian Bahan', `Membuat PO ${poNumber} total Rp ${poData.grandTotal.toLocaleString('id-ID')}`);
    addNotification('Pembelian Bahan Masuk', `PO ${poNumber} dari ${poData.supplierName} selesai. Stok bahan baku bertambah.`, 'PEMBELIAN_MASUK', 'pembelian');
  };

  // 3. Raw Materials
  const addRawMaterial = (material: Omit<RawMaterial, 'id'>) => {
    const newMaterial: RawMaterial = {
      ...material,
      id: `RM-${Date.now()}`,
    };
    setRawMaterials((prev) => [newMaterial, ...prev]);
    logAudit('CREATE_RAW_MATERIAL', 'Master Bahan', `Menambahkan bahan: ${material.name}`);
  };

  const updateRawMaterial = (id: string, updated: Partial<RawMaterial>) => {
    setRawMaterials((prev) => prev.map((rm) => (rm.id === id ? { ...rm, ...updated } : rm)));
    logAudit('UPDATE_RAW_MATERIAL', 'Master Bahan', `Memperbarui bahan ID: ${id}`);
  };

  const recordRawMaterialInbound = (params: {
    materialId: string;
    quantity: number;
    unitPrice?: number;
    supplierName?: string;
    poNumber?: string;
    notes?: string;
  }) => {
    const rm = rawMaterials.find((m) => m.id === params.materialId);
    if (!rm) return;

    const before = rm.currentStock;
    const after = before + params.quantity;
    const refNum = params.poNumber || `RCV-${Date.now().toString().slice(-6)}`;
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().slice(0, 5);

    setRawMaterials((prev) =>
      prev.map((item) =>
        item.id === params.materialId
          ? {
              ...item,
              currentStock: after,
              lastPurchasedPrice: params.unitPrice || item.lastPurchasedPrice,
            }
          : item
      )
    );

    const newMutation: RawMaterialMutation = {
      id: `MUT-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      materialId: rm.id,
      materialName: rm.name,
      materialCode: rm.code,
      date: dateStr,
      time: timeStr,
      type: 'INBOUND_PO',
      quantity: params.quantity,
      unit: rm.unit,
      stockBefore: before,
      stockAfter: after,
      referenceNumber: refNum,
      actorName: currentUser.name,
      notes: params.notes || `Penerimaan kiriman dari ${params.supplierName || 'Supplier'}`,
    };

    setRawMaterialMutations((prev) => [newMutation, ...prev]);
    logAudit('RAW_MATERIAL_INBOUND', 'Gudang Bahan', `Penerimaan bahan ${rm.name}: +${params.quantity} ${rm.unit} (Ref: ${refNum})`);
    addNotification('Bahan Masuk Gudang', `Penerimaan ${params.quantity} ${rm.unit} ${rm.name} berhasil dicatat.`, 'PEMBELIAN_MASUK', 'stok-bahan');
  };

  const recordRawMaterialUsage = (params: {
    materialId: string;
    quantity: number;
    usedFor: string;
    operatorName: string;
    notes?: string;
  }): { success: boolean; message: string } => {
    const rm = rawMaterials.find((m) => m.id === params.materialId);
    if (!rm) return { success: false, message: 'Bahan baku tidak ditemukan' };

    if (rm.currentStock < params.quantity) {
      return {
        success: false,
        message: `Stok tidak mencukupi. Tersedia: ${rm.currentStock} ${rm.unit}, diminta: ${params.quantity} ${rm.unit}`,
      };
    }

    const before = rm.currentStock;
    const after = Math.max(0, before - params.quantity);
    const refNum = `USG-${Date.now().toString().slice(-6)}`;
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().slice(0, 5);

    setRawMaterials((prev) =>
      prev.map((item) =>
        item.id === params.materialId ? { ...item, currentStock: after } : item
      )
    );

    const newMutation: RawMaterialMutation = {
      id: `MUT-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      materialId: rm.id,
      materialName: rm.name,
      materialCode: rm.code,
      date: dateStr,
      time: timeStr,
      type: 'USAGE_MANUAL',
      quantity: -params.quantity,
      unit: rm.unit,
      stockBefore: before,
      stockAfter: after,
      referenceNumber: refNum,
      actorName: params.operatorName || currentUser.name,
      notes: params.notes || `Pemakaian langsung untuk ${params.usedFor}`,
    };

    setRawMaterialMutations((prev) => [newMutation, ...prev]);

    if (after <= rm.minimumStock) {
      addNotification(
        'Bahan Baku Menipis',
        `Stok ${rm.name} tersisa ${after} ${rm.unit} (Di bawah batas minimum ${rm.minimumStock} ${rm.unit})`,
        'WARNING_STOK',
        'stok-bahan'
      );
    }

    logAudit('RAW_MATERIAL_USAGE', 'Gudang Bahan', `Pemakaian bahan ${rm.name}: -${params.quantity} ${rm.unit} untuk ${params.usedFor}`);
    return { success: true, message: `Pemakaian ${params.quantity} ${rm.unit} ${rm.name} berhasil dicatat!` };
  };

  const recordRawMaterialOpname = (params: {
    materialId: string;
    physicalStock: number;
    reason: string;
    notes?: string;
  }) => {
    const rm = rawMaterials.find((m) => m.id === params.materialId);
    if (!rm) return;

    const before = rm.currentStock;
    const after = params.physicalStock;
    const diff = after - before;
    const refNum = `OPN-${Date.now().toString().slice(-6)}`;
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().slice(0, 5);

    setRawMaterials((prev) =>
      prev.map((item) =>
        item.id === params.materialId ? { ...item, currentStock: after } : item
      )
    );

    const newMutation: RawMaterialMutation = {
      id: `MUT-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      materialId: rm.id,
      materialName: rm.name,
      materialCode: rm.code,
      date: dateStr,
      time: timeStr,
      type: 'ADJUSTMENT_OPNAME',
      quantity: diff,
      unit: rm.unit,
      stockBefore: before,
      stockAfter: after,
      referenceNumber: refNum,
      actorName: currentUser.name,
      notes: `${params.reason}. ${params.notes ? `Catatan: ${params.notes}` : ''}`,
    };

    setRawMaterialMutations((prev) => [newMutation, ...prev]);
    logAudit('STOCK_OPNAME', 'Stock Opname', `Penyesuaian stok ${rm.name}: ${before} ➔ ${after} ${rm.unit} (Selisih: ${diff >= 0 ? `+${diff}` : diff} ${rm.unit}). Alasan: ${params.reason}`);
    addNotification('Stock Opname Selesai', `Stok ${rm.name} disesuaikan ke ${after} ${rm.unit} (${params.reason}).`, 'INFO', 'stok-bahan');
  };

  const adjustRawMaterialStock = (id: string, newStock: number, reason: string) => {
    recordRawMaterialOpname({ materialId: id, physicalStock: newStock, reason });
  };

  // 4. Recipe / BOM
  const saveRecipe = (recipe: Recipe) => {
    setRecipes((prev) => {
      const idx = prev.findIndex((r) => r.id === recipe.id || r.productId === recipe.productId);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...recipe, lastUpdated: new Date().toISOString().split('T')[0], updatedBy: currentUser.name };
        return copy;
      }
      return [{ ...recipe, lastUpdated: new Date().toISOString().split('T')[0], updatedBy: currentUser.name }, ...prev];
    });

    // Also update product HPP
    setProducts((prev) =>
      prev.map((p) => (p.id === recipe.productId ? { ...p, hpp: recipe.hppPerUnit, sellingPrice: recipe.suggestedSellingPrice } : p))
    );

    logAudit('SAVE_RECIPE', 'Resep / BOM', `Menyimpan resep BOM untuk: ${recipe.productName} (HPP: Rp ${recipe.hppPerUnit.toLocaleString('id-ID')})`);
  };

  // 5. Production & QC
  const createProductionOrder = (order: {
    productId: string;
    productName: string;
    quantityTarget: number;
    operatorName: string;
    notes?: string;
  }): { success: boolean; message: string } => {
    const recipe = recipes.find((r) => r.productId === order.productId);
    if (!recipe) {
      return { success: false, message: 'Resep / BOM untuk produk ini belum dibuat.' };
    }

    const batchRatio = order.quantityTarget / (recipe.batchYield || 100);

    // Check material sufficiency
    const missingMaterials: string[] = [];
    recipe.ingredients.forEach((ing) => {
      const rm = rawMaterials.find((m) => m.id === ing.materialId);
      const needed = ing.quantity * batchRatio;
      if (!rm || rm.currentStock < needed) {
        missingMaterials.push(`${ing.materialName} (Kurang ${rm ? needed - rm.currentStock : needed} ${ing.unit})`);
      }
    });

    if (missingMaterials.length > 0) {
      return {
        success: false,
        message: `Stok bahan baku tidak mencukupi: ${missingMaterials.join(', ')}`,
      };
    }

    // Deduct raw materials!
    setRawMaterials((prev) =>
      prev.map((rm) => {
        const ing = recipe.ingredients.find((i) => i.materialId === rm.id);
        if (ing) {
          const needed = ing.quantity * batchRatio;
          const remaining = Math.max(0, rm.currentStock - needed);
          // Alert if low
          if (remaining <= rm.minimumStock) {
            addNotification(
              'Bahan Baku Hampir Habis',
              `Bahan ${rm.name} sisa ${remaining} ${rm.unit}. Batas minimum: ${rm.minimumStock} ${rm.unit}.`,
              'WARNING_STOK',
              'stok-bahan'
            );
          }
          return { ...rm, currentStock: remaining };
        }
        return rm;
      })
    );

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().slice(0, 5);
    const batchNumber = `BATCH-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${order.productId.replace('PRD-', '')}`;
    const productionNumber = `PRD-RUN-${String(productionOrders.length + 91).padStart(3, '0')}`;

    // Auto record RawMaterialMutation for each consumed ingredient
    const prodMutations: RawMaterialMutation[] = recipe.ingredients.map((ing) => {
      const rm = rawMaterials.find((m) => m.id === ing.materialId);
      const needed = ing.quantity * batchRatio;
      const before = rm ? rm.currentStock : 0;
      const after = Math.max(0, before - needed);
      return {
        id: `MUT-${Date.now()}-${ing.materialId}`,
        materialId: ing.materialId,
        materialName: ing.materialName,
        materialCode: rm?.code || 'RM',
        date: dateStr,
        time: timeStr,
        type: 'OUTBOUND_PRODUCTION',
        quantity: -needed,
        unit: ing.unit,
        stockBefore: before,
        stockAfter: after,
        referenceNumber: productionNumber,
        actorName: order.operatorName || currentUser.name,
        notes: `Alokasi bahan resep BOM untuk SPK ${productionNumber} (${order.productName} ${order.quantityTarget} pcs)`,
      };
    });
    setRawMaterialMutations((prev) => [...prodMutations, ...prev]);

    const newProd: ProductionOrder = {
      id: `PROD-${Date.now()}`,
      productionNumber,
      batchNumber,
      productId: order.productId,
      productName: order.productName,
      quantityTarget: order.quantityTarget,
      quantityProduced: 0,
      quantityDefect: 0,
      startDate: now.toLocaleString('id-ID'),
      operatorName: order.operatorName,
      supervisorName: currentUser.name,
      status: 'SEDANG_PRODUKSI',
      totalMaterialCost: recipe.ingredients.reduce((s, i) => s + i.subtotalCost * batchRatio, 0),
      totalOverheadCost: (recipe.overheadCostPerBatch + recipe.laborCostPerBatch) * batchRatio,
      unitHpp: recipe.hppPerUnit,
      notes: order.notes,
    };

    setProductionOrders((prev) => [newProd, ...prev]);

    logAudit('CREATE_PRODUCTION', 'Produksi & QC', `Memulai produksi ${order.quantityTarget} pcs ${order.productName} (Batch: ${batchNumber})`);
    addNotification('Produksi Dimulai', `Produksi ${order.quantityTarget} pcs ${order.productName} sedang berjalan.`, 'INFO', 'produksi');

    return { success: true, message: `Produksi ${order.quantityTarget} pcs ${order.productName} berhasil dimulai.` };
  };

  const completeProductionQC = (orderId: string, qc: QualityControlCheck) => {
    const prod = productionOrders.find((p) => p.id === orderId);
    if (!prod) return;

    const producedQty = prod.quantityTarget;
    const isPassed = qc.status === 'PASSED';

    setProductionOrders((prev) =>
      prev.map((p) =>
        p.id === orderId
          ? {
              ...p,
              quantityProduced: producedQty,
              status: isPassed ? 'SELESAI' : 'DIRENCANAKAN',
              endDate: new Date().toLocaleString('id-ID'),
              qc,
            }
          : p
      )
    );

    if (isPassed) {
      // Add to Pusat Warehouse Finished Product Stock
      setBranchStocks((prev) => {
        const existing = prev.find((bs) => bs.branchId === 'BR-PUSAT' && bs.productId === prod.productId);
        if (existing) {
          return prev.map((bs) =>
            bs.id === existing.id
              ? { ...bs, stockQty: bs.stockQty + producedQty, lastUpdated: new Date().toLocaleString('id-ID') }
              : bs
          );
        } else {
          const product = products.find((p) => p.id === prod.productId);
          const newBs: BranchStockItem = {
            id: `BS-PST-${Date.now()}`,
            branchId: 'BR-PUSAT',
            branchName: 'Pusat Produksi & Gudang Utama',
            productId: prod.productId,
            productName: prod.productName,
            sku: product?.sku || 'SKU',
            stockQty: producedQty,
            minimumStock: 50,
            lastUpdated: new Date().toLocaleString('id-ID'),
          };
          return [...prev, newBs];
        }
      });

      addNotification(
        'Produksi Lulus QC & Masuk Gudang',
        `Batch ${prod.batchNumber} (${producedQty} pcs ${prod.productName}) lulus inspeksi QC dan siap didistribusikan.`,
        'PRODUKSI_SELESAI',
        'stok-produk'
      );
    }

    logAudit('QC_PRODUCTION', 'Produksi & QC', `Inspeksi QC Batch ${prod.batchNumber}: Status ${qc.status}`);
  };

  // 6. Products
  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: `PRD-${Date.now()}`,
    };
    setProducts((prev) => [newProduct, ...prev]);
    logAudit('CREATE_PRODUCT', 'Master Produk', `Menambahkan produk jadi: ${product.name}`);
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
    logAudit('UPDATE_PRODUCT', 'Master Produk', `Memperbarui produk ID: ${id}`);
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    logAudit('DELETE_PRODUCT', 'Master Produk', `Menonaktifkan produk ID: ${id}`);
  };

  // 7. Stock adjustments
  const adjustBranchStock = (branchId: string, productId: string, newQty: number, reason: string) => {
    setBranchStocks((prev) =>
      prev.map((bs) =>
        bs.branchId === branchId && bs.productId === productId
          ? { ...bs, stockQty: newQty, lastUpdated: new Date().toLocaleString('id-ID') }
          : bs
      )
    );
    const branch = branches.find((b) => b.id === branchId);
    const product = products.find((p) => p.id === productId);
    logAudit('STOCK_OPNAME', 'Stok Produk', `Penyesuaian stok ${product?.name || productId} di ${branch?.name || branchId} jadi ${newQty}. Alasan: ${reason}`);
  };

  // 8. Distribution & Surat Jalan
  const createStockTransfer = (transfer: {
    fromBranchId: string;
    toBranchId: string;
    driverName: string;
    vehiclePlate: string;
    items: { productId: string; quantity: number }[];
    notes?: string;
  }): { success: boolean; message: string } => {
    const fromBranch = branches.find((b) => b.id === transfer.fromBranchId);
    const toBranch = branches.find((b) => b.id === transfer.toBranchId);

    // Check available stock in fromBranch
    for (const it of transfer.items) {
      const bs = branchStocks.find((s) => s.branchId === transfer.fromBranchId && s.productId === it.productId);
      const prd = products.find((p) => p.id === it.productId);
      if (!bs || bs.stockQty < it.quantity) {
        return {
          success: false,
          message: `Stok ${prd?.name || 'produk'} di ${fromBranch?.name || 'Gudang'} tidak mencukupi (Tersedia: ${bs?.stockQty || 0} pcs, diminta: ${it.quantity} pcs)`,
        };
      }
    }

    // Deduct sender stock
    setBranchStocks((prev) =>
      prev.map((bs) => {
        if (bs.branchId === transfer.fromBranchId) {
          const sent = transfer.items.find((i) => i.productId === bs.productId);
          if (sent) {
            return { ...bs, stockQty: bs.stockQty - sent.quantity, lastUpdated: new Date().toLocaleString('id-ID') };
          }
        }
        return bs;
      })
    );

    const now = new Date();
    const suratJalanNumber = `SJ-LSH-${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(distributions.length + 1).padStart(3, '0')}`;
    const transferNumber = `TRF-LSH-${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(distributions.length + 1).padStart(2, '0')}`;

    const newDist: StockDistribution = {
      id: `DST-${Date.now()}`,
      transferNumber,
      suratJalanNumber,
      fromBranchId: transfer.fromBranchId,
      fromBranchName: fromBranch?.name || 'Pusat',
      toBranchId: transfer.toBranchId,
      toBranchName: toBranch?.name || 'Cabang',
      sentDate: now.toLocaleString('id-ID'),
      driverName: transfer.driverName,
      vehiclePlate: transfer.vehiclePlate,
      items: transfer.items.map((it) => {
        const prod = products.find((p) => p.id === it.productId);
        return {
          productId: it.productId,
          productName: prod?.name || 'Produk',
          sku: prod?.sku || 'SKU',
          quantitySent: it.quantity,
          quantityReceived: 0,
          unitPrice: prod?.sellingPrice || 0,
        };
      }),
      status: 'DALAM_PENGIRIMAN',
      notes: transfer.notes,
    };

    setDistributions((prev) => [newDist, ...prev]);
    setSelectedDistributionForPrint(newDist);

    logAudit('CREATE_DISTRIBUTION', 'Distribusi', `Membuat Surat Jalan ${suratJalanNumber} ke ${toBranch?.name}`);
    addNotification('Pengiriman Stok Dikirim', `Surat Jalan ${suratJalanNumber} dikirim menuju ${toBranch?.name}.`, 'INFO', 'distribusi');

    return { success: true, message: `Surat Jalan ${suratJalanNumber} berhasil dibuat!` };
  };

  const receiveStockTransfer = (distributionId: string, status: 'DITERIMA_LENGKAP' | 'DITERIMA_SEBAGIAN' | 'DITOLAK', notes?: string) => {
    const dist = distributions.find((d) => d.id === distributionId);
    if (!dist) return;

    setDistributions((prev) =>
      prev.map((d) =>
        d.id === distributionId
          ? {
              ...d,
              status,
              receivedDate: new Date().toLocaleString('id-ID'),
              receivedBy: currentUser.name,
              rejectionReason: status === 'DITOLAK' ? notes : undefined,
              items: d.items.map((it) => ({
                ...it,
                quantityReceived: status === 'DITOLAK' ? 0 : it.quantitySent,
              })),
            }
          : d
      )
    );

    if (status !== 'DITOLAK') {
      // Add stock to receiving branch!
      setBranchStocks((prev) => {
        let updated = [...prev];
        dist.items.forEach((it) => {
          const idx = updated.findIndex((s) => s.branchId === dist.toBranchId && s.productId === it.productId);
          if (idx >= 0) {
            updated[idx] = {
              ...updated[idx],
              stockQty: updated[idx].stockQty + it.quantitySent,
              lastUpdated: new Date().toLocaleString('id-ID'),
            };
          } else {
            updated.push({
              id: `BS-${dist.toBranchId}-${it.productId}`,
              branchId: dist.toBranchId,
              branchName: dist.toBranchName,
              productId: it.productId,
              productName: it.productName,
              sku: it.sku,
              stockQty: it.quantitySent,
              minimumStock: 20,
              lastUpdated: new Date().toLocaleString('id-ID'),
            });
          }
        });
        return updated;
      });

      addNotification(
        'Stok Telah Diterima Cabang',
        `${dist.toBranchName} telah menerima kiriman surat jalan ${dist.suratJalanNumber}. Stok otomatis bertambah.`,
        'INFO',
        'stok-produk'
      );
    }

    logAudit('RECEIVE_DISTRIBUTION', 'Distribusi', `Penerimaan Surat Jalan ${dist.suratJalanNumber}: Status ${status}`);
  };

  // 9. Stock Requests
  const createStockRequest = (req: {
    branchId: string;
    requiredDate: string;
    urgency: 'NORMAL' | 'TINGGI' | 'MENDESAK';
    items: { productId: string; requestedQty: number }[];
    notes?: string;
  }) => {
    const branch = branches.find((b) => b.id === req.branchId);
    const reqNumber = `REQ-${branch?.code || 'CBG'}-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(stockRequests.length + 1).padStart(3, '0')}`;

    const newReq: StockRequest = {
      id: `REQ-${Date.now()}`,
      requestNumber: reqNumber,
      branchId: req.branchId,
      branchName: branch?.name || 'Cabang',
      requestDate: new Date().toLocaleString('id-ID'),
      requiredDate: req.requiredDate,
      items: req.items.map((it) => {
        const prod = products.find((p) => p.id === it.productId);
        const currentBs = branchStocks.find((bs) => bs.branchId === req.branchId && bs.productId === it.productId);
        return {
          productId: it.productId,
          productName: prod?.name || 'Produk',
          currentStock: currentBs?.stockQty || 0,
          requestedQty: it.requestedQty,
          approvedQty: it.requestedQty,
        };
      }),
      urgency: req.urgency,
      status: 'MENUNGGU_PERSETUJUAN',
      requestedBy: currentUser.name,
      notes: req.notes,
    };

    setStockRequests((prev) => [newReq, ...prev]);

    logAudit('CREATE_STOCK_REQUEST', 'Permintaan Stok', `Permintaan restock ${reqNumber} dari ${branch?.name}`);
    addNotification('Permintaan Stok Cabang Baru', `${branch?.name} meminta restock barang (${req.items.length} item, Urgensi: ${req.urgency}).`, 'PERMINTAAN_CABANG', 'permintaan-stok');
  };

  const approveStockRequest = (requestId: string) => {
    const req = stockRequests.find((r) => r.id === requestId);
    if (!req) return;

    setStockRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'DISETUJUI', approvedBy: currentUser.name } : r))
    );

    logAudit('APPROVE_STOCK_REQUEST', 'Permintaan Stok', `Menyetujui permintaan stok ${req.requestNumber}`);
    addNotification('Permintaan Restock Disetujui', `Permintaan ${req.requestNumber} dari ${req.branchName} disetujui untuk dikirim.`, 'INFO', 'distribusi');
  };

  // 10. Sales / POS
  const createSaleTransaction = (saleData: Omit<SaleTransaction, 'id' | 'invoiceNumber' | 'date' | 'time'>): SaleTransaction => {
    const now = new Date();
    const branchId = saleData.branchId || currentUser.branchId || 'BR-01';
    const branch = branches.find((b) => b.id === branchId);
    const branchName = saleData.branchName || branch?.name || currentUser.branchName || 'Cabang Dago Plaza';
    const cashierId = saleData.cashierId || currentUser.id;
    const cashierName = saleData.cashierName || currentUser.name;

    const calculatedHpp = saleData.totalHpp !== undefined
      ? saleData.totalHpp
      : (saleData.items || []).reduce((s, it) => s + ((it.hpp || 0) * (it.quantity || 1)), 0);
    const calculatedProfit = saleData.grossProfit !== undefined
      ? saleData.grossProfit
      : Math.max(0, (saleData.grandTotal || 0) - calculatedHpp);

    const invoiceNumber = `INV-${branch?.code || 'POS'}-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(sales.length + 1).padStart(4, '0')}`;

    const newSale: SaleTransaction = {
      ...saleData,
      id: `TRX-${Date.now()}`,
      branchId,
      branchName,
      cashierId,
      cashierName,
      totalHpp: calculatedHpp,
      grossProfit: calculatedProfit,
      status: saleData.status || 'BERHASIL',
      invoiceNumber,
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    // Deduct branch stock
    setBranchStocks((prev) =>
      prev.map((bs) => {
        if (bs.branchId === branchId) {
          const itemSold = (saleData.items || []).find((i) => i.productId === bs.productId);
          if (itemSold) {
            const newQty = Math.max(0, bs.stockQty - itemSold.quantity);
            if (newQty <= bs.minimumStock) {
              addNotification(
                'Stok Cabang Menipis',
                `${bs.productName} di ${bs.branchName} sisa ${newQty} pcs (Batas aman: ${bs.minimumStock}).`,
                'WARNING_STOK',
                'permintaan-stok'
              );
            }
            return { ...bs, stockQty: newQty, lastUpdated: now.toLocaleString('id-ID') };
          }
        }
        return bs;
      })
    );

    // Record Financial Income
    const newFin: FinancialRecord = {
      id: `FIN-SALE-${Date.now()}`,
      transactionNumber: `FIN-IN-${invoiceNumber}`,
      date: newSale.date,
      type: 'PEMASUKAN',
      category: 'Penjualan Produk',
      accountType: saleData.paymentMethod === 'TUNAI' ? 'KAS_TUNAI' : saleData.paymentMethod === 'QRIS' ? 'QRIS_SETTLEMENT' : 'BANK_BCA',
      amount: saleData.grandTotal,
      branchId,
      branchName,
      description: `Penjualan POS ${invoiceNumber} (${saleData.customerName || 'Pelanggan'})`,
      recipientOrPayer: saleData.customerName || 'Pelanggan Walk-in',
      referenceId: newSale.id,
    };

    setSales((prev) => [newSale, ...prev]);
    setFinancialRecords((prev) => [newFin, ...prev]);

    logAudit('POS_SALE', 'Penjualan POS', `Transaksi ${invoiceNumber} total Rp ${(saleData.grandTotal || 0).toLocaleString('id-ID')} via ${saleData.paymentMethod}`);

    return newSale;
  };

  // 11. Financials
  const createFinancialRecord = (record: Omit<FinancialRecord, 'id' | 'transactionNumber'>) => {
    const now = new Date();
    const prefix = record.type === 'PEMASUKAN' ? 'FIN-IN' : 'FIN-EX';
    const transactionNumber = `${prefix}-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(financialRecords.length + 1).padStart(3, '0')}`;

    const newFin: FinancialRecord = {
      ...record,
      id: `FIN-${Date.now()}`,
      transactionNumber,
    };

    setFinancialRecords((prev) => [newFin, ...prev]);
    logAudit('CREATE_FINANCE', 'Keuangan', `Input ${record.type}: ${record.description} (Rp ${record.amount.toLocaleString('id-ID')})`);
  };

  // 12. Attendance with Automatic Zero-Touch Realtime Payroll Integration
  const recordAttendance = (att: {
    employeeId: string;
    clockIn: boolean;
    status?: 'HADIR' | 'TERLAMBAT' | 'IZIN' | 'SAKIT' | 'CUTI' | 'ALPA';
    photoSelfieUrl?: string;
    gpsLocation?: { latitude: number; longitude: number; address: string };
    notes?: string;
    overtimeHours?: number;
  }) => {
    const emp = employees.find((e) => e.id === att.employeeId);
    if (!emp) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const nowTimeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    let finalStatus: 'HADIR' | 'TERLAMBAT' | 'IZIN' | 'SAKIT' | 'CUTI' | 'ALPA' = att.status || 'HADIR';
    let lateMinutes = 0;

    if (!att.status && att.clockIn) {
      const [hours, minutes] = nowTimeStr.split(':').map(Number);
      if (hours > 8 || (hours === 8 && minutes > 5)) {
        finalStatus = 'TERLAMBAT';
        lateMinutes = (hours - 8) * 60 + minutes;
      } else {
        finalStatus = 'HADIR';
      }
    }

    setAttendances((prev) => {
      const existing = prev.find((a) => a.employeeId === att.employeeId && a.date === todayStr);
      if (existing) {
        if (!att.clockIn) {
          // Clock out
          return prev.map((a) =>
            a.id === existing.id
              ? {
                  ...a,
                  clockOutTime: nowTimeStr,
                  overtimeHours: att.overtimeHours !== undefined ? att.overtimeHours : a.overtimeHours,
                  notes: att.notes || a.notes,
                }
              : a
          );
        } else {
          // Update clock in / status
          return prev.map((a) =>
            a.id === existing.id
              ? {
                  ...a,
                  status: finalStatus,
                  lateMinutes,
                  photoSelfieUrl: att.photoSelfieUrl || a.photoSelfieUrl,
                  gpsLocation: att.gpsLocation || a.gpsLocation,
                  notes: att.notes || a.notes,
                }
              : a
          );
        }
      } else {
        // New Attendance record
        const newAtt: AttendanceRecord = {
          id: `ATT-${Date.now()}`,
          employeeId: emp.id,
          employeeName: emp.name,
          branchId: emp.branchId,
          branchName: emp.branchName,
          date: todayStr,
          clockInTime: att.clockIn ? nowTimeStr : undefined,
          status: finalStatus,
          lateMinutes,
          overtimeHours: att.overtimeHours || 0,
          photoSelfieUrl: att.photoSelfieUrl,
          gpsLocation: att.gpsLocation,
          notes: att.notes,
        };
        return [newAtt, ...prev];
      }
    });

    // DIRECT AUTO-INTEGRATION WITH HR PAYROLL (No manual recap needed!)
    setPayrolls((prevPayrolls) => {
      const currentPeriod = 'September 2026';
      const existingIndex = prevPayrolls.findIndex(
        (p) => p.employeeId === emp.id && (p.periodMonth === currentPeriod || p.periodMonth.includes('September'))
      );

      // Current attendance count for this employee including today
      const currentDays = (finalStatus === 'HADIR' || finalStatus === 'TERLAMBAT') ? 1 : 0;
      const baseDays = existingIndex >= 0 ? prevPayrolls[existingIndex].workingDaysPresent : 24;
      const newDaysPresent = Math.min(26, baseDays + (existingIndex < 0 ? currentDays : 1));

      const mealAllowance = newDaysPresent * emp.dailyMealAllowance;
      const transportAllowance = newDaysPresent * emp.dailyTransportAllowance;
      const lateDeduction = Math.floor(lateMinutes / 10) * 10000;
      const overtimePay = (att.overtimeHours || 0) * 30000;
      const bonus = emp.position.includes('Kepala') || emp.position.includes('Gudang') ? 300000 : 150000;
      const bpjs = 100000;
      const netSalary = emp.baseSalary + mealAllowance + transportAllowance + overtimePay + bonus - lateDeduction - bpjs;

      if (existingIndex >= 0) {
        return prevPayrolls.map((p, idx) =>
          idx === existingIndex
            ? {
                ...p,
                workingDaysPresent: newDaysPresent,
                mealAllowance,
                transportAllowance,
                totalLateDeductions: (p.totalLateDeductions || 0) + lateDeduction,
                overtimeHours: (p.overtimeHours || 0) + (att.overtimeHours || 0),
                overtimePay: (p.overtimePay || 0) + overtimePay,
                netSalary,
                notes: `Terintegrasi otomatis dari presensi realtime (${newDaysPresent} hari hadir).`,
              }
            : p
        );
      } else {
        const newSlip: PayrollRecord = {
          id: `PAY-${Date.now()}`,
          payrollNumber: `SLIP-LSH-202609-${String(prevPayrolls.length + 1).padStart(3, '0')}`,
          periodMonth: currentPeriod,
          employeeId: emp.id,
          employeeName: emp.name,
          position: emp.position,
          branchName: emp.branchName,
          workingDaysPresent: newDaysPresent,
          totalLateDeductions: lateDeduction,
          overtimeHours: att.overtimeHours || 0,
          baseSalary: emp.baseSalary,
          mealAllowance,
          transportAllowance,
          overtimePay,
          bonusPerformance: bonus,
          deductions: bpjs,
          netSalary,
          paymentStatus: 'DRAFT',
          notes: `Terintegrasi otomatis dari presensi realtime (${newDaysPresent} hari hadir).`,
        };
        return [newSlip, ...prevPayrolls];
      }
    });

    logAudit(
      'ATTENDANCE_SYNC',
      'Absensi & Payroll',
      `Presensi ${att.clockIn ? 'Masuk' : 'Pulang'} ${emp.name} (${finalStatus}) otomatis tersinkronisasi ke slip gaji payroll.`
    );

    addNotification(
      'Presensi Karyawan Terintegrasi HR',
      `${emp.name} telah presensi ${att.clockIn ? 'Masuk' : 'Pulang'} (${nowTimeStr} WIB). Tunjangan kehadiran otomatis terhitung di slip gaji!`,
      'INFO',
      'payroll'
    );
  };

  // 13. Payroll
  const generateMonthlyPayroll = (month: string) => {
    const generated: PayrollRecord[] = employees.map((emp, idx) => {
      // Calculate attendance for this employee
      const empAtts = attendances.filter((a) => a.employeeId === emp.id);
      const daysPresent = empAtts.filter((a) => a.status === 'HADIR' || a.status === 'TERLAMBAT').length || 24;
      const totalLateMinutes = empAtts.reduce((sum, a) => sum + (a.lateMinutes || 0), 0);
      const lateDeduction = Math.floor(totalLateMinutes / 10) * 10000;
      const overtimeHours = empAtts.reduce((sum, a) => sum + (a.overtimeHours || 0), 0);
      const overtimePay = overtimeHours * 30000;
      const meal = daysPresent * emp.dailyMealAllowance;
      const transport = daysPresent * emp.dailyTransportAllowance;
      const bonus = emp.position.includes('Kepala') || emp.position.includes('Gudang') ? 300000 : 150000;
      const bpjs = 100000;
      const net = emp.baseSalary + meal + transport + overtimePay + bonus - lateDeduction - bpjs;

      return {
        id: `PAY-${Date.now()}-${idx}`,
        payrollNumber: `SLIP-LSH-${month.replace(' ', '')}-${String(idx + 1).padStart(3, '0')}`,
        periodMonth: month,
        employeeId: emp.id,
        employeeName: emp.name,
        position: emp.position,
        branchName: emp.branchName,
        workingDaysPresent: daysPresent,
        totalLateDeductions: lateDeduction,
        overtimeHours,
        baseSalary: emp.baseSalary,
        mealAllowance: meal,
        transportAllowance: transport,
        overtimePay,
        bonusPerformance: bonus,
        deductions: bpjs,
        netSalary: net,
        paymentStatus: 'DRAFT',
        notes: `Gaji periode ${month} siap ditransfer.`,
      };
    });

    setPayrolls(generated);
    logAudit('GENERATE_PAYROLL', 'Payroll', `Membuat draft payroll periode ${month} untuk ${employees.length} karyawan`);
    addNotification('Payroll Selesai Dihitung', `Slip gaji ${month} telah dihitung otomatis dari data absensi.`, 'INFO', 'payroll');
  };

  const markPayrollPaid = (payrollId: string) => {
    const pay = payrolls.find((p) => p.id === payrollId);
    if (!pay) return;

    setPayrolls((prev) =>
      prev.map((p) => (p.id === payrollId ? { ...p, paymentStatus: 'DIBAYARKAN', paymentDate: new Date().toISOString().split('T')[0] } : p))
    );

    // Record finance expense
    const newFin: FinancialRecord = {
      id: `FIN-PAY-${Date.now()}`,
      transactionNumber: `FIN-EXP-${pay.payrollNumber}`,
      date: new Date().toISOString().split('T')[0],
      type: 'PENGELUARAN',
      category: 'Gaji & Payroll',
      accountType: 'BANK_BCA',
      amount: pay.netSalary,
      branchId: 'BR-PUSAT',
      branchName: pay.branchName,
      description: `Pembayaran Payroll ${pay.payrollNumber} an ${pay.employeeName} (${pay.position})`,
      recipientOrPayer: pay.employeeName,
      referenceId: pay.id,
    };

    setFinancialRecords((prev) => [newFin, ...prev]);
    logAudit('PAY_PAYROLL', 'Payroll', `Membayarkan slip gaji ${pay.payrollNumber} Rp ${pay.netSalary.toLocaleString('id-ID')}`);
  };

  // 14. Employees
  const addEmployee = (emp: Omit<Employee, 'id'>) => {
    const newEmp: Employee = {
      ...emp,
      id: `EMP-${String(employees.length + 1).padStart(2, '0')}`,
    };
    setEmployees((prev) => [newEmp, ...prev]);
    logAudit('CREATE_EMPLOYEE', 'Data Karyawan', `Menambahkan karyawan: ${emp.name} (${emp.position})`);
  };

  const updateEmployee = (id: string, updated: Partial<Employee>) => {
    setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, ...updated } : e)));
    logAudit('UPDATE_EMPLOYEE', 'Data Karyawan', `Memperbarui data karyawan ID: ${id}`);
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  // Backup / Reset / JSON Export Import
  const resetToDemoData = () => {
    localStorage.clear();
    setCurrentUser(INITIAL_USERS[0]);
    setActiveBranchId('BR-PUSAT');
    setBranches(INITIAL_BRANCHES);
    setSuppliers(INITIAL_SUPPLIERS);
    setRawMaterials(INITIAL_RAW_MATERIALS);
    setRawMaterialMutations(INITIAL_RAW_MATERIAL_MUTATIONS);
    setProducts(INITIAL_PRODUCTS);
    setRecipes(INITIAL_RECIPES);
    setProductionOrders(INITIAL_PRODUCTION_ORDERS);
    setPurchases(INITIAL_PURCHASES);
    setBranchStocks(INITIAL_BRANCH_STOCKS);
    setDistributions(INITIAL_DISTRIBUTIONS);
    setStockRequests(INITIAL_STOCK_REQUESTS);
    setSales(INITIAL_SALES);
    setFinancialRecords(INITIAL_FINANCIAL_RECORDS);
    setEmployees(INITIAL_EMPLOYEES);
    setAttendances(INITIAL_ATTENDANCE);
    setPayrolls(INITIAL_PAYROLL);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    logAudit('RESET_DATABASE', 'Sistem', 'Reset database ke data demo awal RumahJajananLashira');
  };

  const exportDatabaseJson = (): string => {
    const dump = {
      exportDate: new Date().toISOString(),
      version: '1.0.0',
      branches,
      suppliers,
      rawMaterials,
      rawMaterialMutations,
      products,
      recipes,
      productionOrders,
      purchases,
      branchStocks,
      distributions,
      stockRequests,
      sales,
      financialRecords,
      employees,
      attendances,
      payrolls,
      auditLogs,
    };
    return JSON.stringify(dump, null, 2);
  };

  const importDatabaseJson = (json: string): boolean => {
    try {
      const data = JSON.parse(json);
      if (data.branches) setBranches(data.branches);
      if (data.suppliers) setSuppliers(data.suppliers);
      if (data.rawMaterials) setRawMaterials(data.rawMaterials);
      if (data.rawMaterialMutations) setRawMaterialMutations(data.rawMaterialMutations);
      if (data.products) setProducts(data.products);
      if (data.recipes) setRecipes(data.recipes);
      if (data.productionOrders) setProductionOrders(data.productionOrders);
      if (data.purchases) setPurchases(data.purchases);
      if (data.branchStocks) setBranchStocks(data.branchStocks);
      if (data.distributions) setDistributions(data.distributions);
      if (data.stockRequests) setStockRequests(data.stockRequests);
      if (data.sales) setSales(data.sales);
      if (data.financialRecords) setFinancialRecords(data.financialRecords);
      if (data.employees) setEmployees(data.employees);
      if (data.attendances) setAttendances(data.attendances);
      if (data.payrolls) setPayrolls(data.payrolls);
      logAudit('IMPORT_DATABASE', 'Sistem', 'Restore backup JSON database berhasil');
      return true;
    } catch {
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        login,
        loginAsEmployee,
        logout,
        currentUser,
        setCurrentUser,
        switchUserRole,
        activeBranchId,
        setActiveBranchId,
        activeTab,
        setActiveTab,
        branches,
        suppliers,
        rawMaterials,
        rawMaterialMutations,
        products,
        recipes,
        productionOrders,
        purchases,
        branchStocks,
        distributions,
        stockRequests,
        sales,
        financialRecords,
        employees,
        attendances,
        payrolls,
        notifications,
        auditLogs,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        addRawMaterial,
        updateRawMaterial,
        adjustRawMaterialStock,
        recordRawMaterialInbound,
        recordRawMaterialUsage,
        recordRawMaterialOpname,
        createPurchase,
        saveRecipe,
        createProductionOrder,
        completeProductionQC,
        addProduct,
        updateProduct,
        deleteProduct,
        adjustBranchStock,
        createStockTransfer,
        receiveStockTransfer,
        createStockRequest,
        approveStockRequest,
        createSaleTransaction,
        createFinancialRecord,
        recordAttendance,
        generateMonthlyPayroll,
        markPayrollPaid,
        addEmployee,
        updateEmployee,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        resetToDemoData,
        exportDatabaseJson,
        importDatabaseJson,
        selectedSaleForPrint,
        setSelectedSaleForPrint,
        selectedDistributionForPrint,
        setSelectedDistributionForPrint,
        selectedPayrollForPrint,
        setSelectedPayrollForPrint,
        showSystemDocsModal,
        setShowSystemDocsModal,
        showDocsModal: showSystemDocsModal,
        setShowDocsModal: setShowSystemDocsModal,
        showRoleGuideModal,
        setShowRoleGuideModal,
        autoShowRoleGuide,
        setAutoShowRoleGuide,
        language,
        setLanguage,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
