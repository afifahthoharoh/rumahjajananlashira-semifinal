import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  LayoutDashboard,
  Truck,
  ShoppingCart,
  Boxes,
  ScrollText,
  Calculator,
  Factory,
  Package,
  Layers,
  Send,
  GitPullRequest,
  Store,
  BarChart3,
  Wallet,
  Clock,
  Banknote,
  Users,
  ShieldAlert,
  Database,
  ChevronRight,
  ChevronDown,
  BookOpen,
  Crown,
  HelpCircle,
  Sparkles,
  Settings as SettingsIcon,
  LogOut,
  Plus,
  Compass,
  X,
} from 'lucide-react';

export const Sidebar: React.FC<{ isOpen?: boolean; onClose?: () => void }> = ({
  isOpen = true,
  onClose,
}) => {
  const {
    currentUser,
    activeTab,
    setActiveTab,
    stockRequests,
    branchStocks,
    logout,
    language,
    t,
  } = useApp();

  const [showAllModules, setShowAllModules] = useState(false);

  const pendingRequestsCount = stockRequests.filter(
    (r) => r.status === 'MENUNGGU_PERSETUJUAN'
  ).length;
  const lowStockCount = branchStocks.filter(
    (b) => b.stockQty <= b.minimumStock
  ).length;

  // Strict role-based navigation menus based purely on role function
  const getRoleMenuItems = (role: UserRole) => {
    switch (role) {
      case 'KASIR':
        return [
          {
            id: 'dashboard',
            label: language === 'id' ? 'Dashboard Kasir' : 'Cashier Dashboard',
            icon: LayoutDashboard,
            matchTabs: ['dashboard'],
          },
          {
            id: 'pos',
            label: language === 'id' ? 'Kasir POS' : 'Cashier POS',
            icon: Store,
            matchTabs: ['pos', 'penjualan-pos'],
          },
          {
            id: 'laporan-penjualan',
            label: language === 'id' ? 'Struk Penjualan Shift' : 'Shift Receipts',
            icon: BarChart3,
            matchTabs: ['laporan-penjualan'],
          },
          {
            id: 'absensi',
            label: language === 'id' ? 'Presensi Saya' : 'My Attendance',
            icon: Clock,
            matchTabs: ['absensi', 'presensi'],
          },
        ];

      case 'ADMIN_GUDANG':
        return [
          {
            id: 'dashboard',
            label: language === 'id' ? 'Dashboard Gudang' : 'Warehouse Dashboard',
            icon: LayoutDashboard,
            matchTabs: ['dashboard'],
          },
          {
            id: 'stok-bahan',
            label: t.nav.rawMaterials,
            icon: Boxes,
            badge: lowStockCount > 0 ? `${lowStockCount}` : undefined,
            matchTabs: ['stok-bahan', 'bahan-baku'],
          },
          {
            id: 'produksi',
            label: t.nav.production,
            icon: Factory,
            matchTabs: ['produksi', 'produksi-qc', 'resep-bom', 'hitung-hpp'],
          },
          {
            id: 'distribusi',
            label: t.nav.distribution,
            icon: Send,
            matchTabs: ['distribusi'],
          },
          {
            id: 'permintaan-stok',
            label: language === 'id' ? 'Permintaan Cabang' : 'Branch Requests',
            icon: GitPullRequest,
            badge: pendingRequestsCount > 0 ? `${pendingRequestsCount}` : undefined,
            matchTabs: ['permintaan-stok'],
          },
          {
            id: 'pembelian',
            label: t.nav.procurement,
            icon: ShoppingCart,
            matchTabs: ['pembelian', 'pembelian-po'],
          },
          {
            id: 'supplier',
            label: t.nav.supplier,
            icon: Truck,
            matchTabs: ['supplier'],
          },
        ];

      case 'ADMIN_CABANG':
        return [
          {
            id: 'dashboard',
            label: language === 'id' ? 'Dashboard Cabang' : 'Branch Dashboard',
            icon: LayoutDashboard,
            matchTabs: ['dashboard'],
          },
          {
            id: 'pos',
            label: t.nav.pos,
            icon: Store,
            matchTabs: ['pos', 'penjualan-pos'],
          },
          {
            id: 'stok-produk',
            label: language === 'id' ? 'Stok Toko Cabang' : 'Branch Store Stock',
            icon: Layers,
            badge: lowStockCount > 0 ? `${lowStockCount}` : undefined,
            matchTabs: ['stok-produk', 'manajemen-stok'],
          },
          {
            id: 'distribusi',
            label: language === 'id' ? 'Terima Distribusi' : 'Receive Shipments',
            icon: Send,
            matchTabs: ['distribusi'],
          },
          {
            id: 'permintaan-stok',
            label: language === 'id' ? 'Request Restock' : 'Restock Request',
            icon: GitPullRequest,
            matchTabs: ['permintaan-stok'],
          },
          {
            id: 'laporan-penjualan',
            label: language === 'id' ? 'Laporan Toko' : 'Branch Sales Report',
            icon: BarChart3,
            matchTabs: ['laporan-penjualan'],
          },
          {
            id: 'absensi',
            label: language === 'id' ? 'Presensi Staf' : 'Staff Attendance',
            icon: Clock,
            matchTabs: ['absensi', 'presensi'],
          },
        ];

      case 'HR_ADMIN':
        return [
          {
            id: 'dashboard',
            label: language === 'id' ? 'Dashboard HR' : 'HR Dashboard',
            icon: LayoutDashboard,
            matchTabs: ['dashboard'],
          },
          {
            id: 'karyawan',
            label: t.nav.employees,
            icon: Users,
            matchTabs: ['karyawan'],
          },
          {
            id: 'absensi',
            label: t.nav.attendance,
            icon: Clock,
            matchTabs: ['absensi', 'presensi'],
          },
          {
            id: 'payroll',
            label: t.nav.payroll,
            icon: Banknote,
            matchTabs: ['payroll'],
          },
          {
            id: 'laporan-penjualan',
            label: language === 'id' ? 'Laporan SDM' : 'HR Reports',
            icon: BarChart3,
            matchTabs: ['laporan-penjualan'],
          },
        ];

      case 'KARYAWAN':
        return [
          {
            id: 'dashboard',
            label: language === 'id' ? 'Portal Presensi Mandiri' : 'Self Attendance',
            icon: Clock,
            matchTabs: ['dashboard'],
          },
          {
            id: 'absensi',
            label: language === 'id' ? 'Riwayat Kehadiran' : 'My Attendance Logs',
            icon: LayoutDashboard,
            matchTabs: ['absensi', 'presensi'],
          },
        ];

      case 'OWNER':
      default:
        return [
          {
            id: 'dashboard',
            label: language === 'id' ? 'Dashboard Eksekutif' : 'Executive Dashboard',
            icon: LayoutDashboard,
            matchTabs: ['dashboard'],
          },
          {
            id: 'owner-keuangan-gaji',
            label: language === 'id' ? 'Keuangan & Gaji Owner' : 'Owner Finance & Salary',
            icon: Crown,
            matchTabs: ['owner-keuangan-gaji'],
          },
          {
            id: 'laporan-penjualan',
            label: language === 'id' ? 'Laporan Semua Cabang' : 'All Branches Report',
            icon: BarChart3,
            matchTabs: ['laporan-penjualan', 'keuangan'],
          },
          {
            id: 'pos',
            label: t.nav.pos,
            icon: Store,
            matchTabs: ['pos', 'penjualan-pos'],
          },
          {
            id: 'stok-bahan',
            label: t.nav.inventory,
            icon: Boxes,
            matchTabs: ['stok-bahan', 'bahan-baku', 'master-produk', 'stok-produk', 'distribusi'],
          },
          {
            id: 'produksi',
            label: t.nav.production,
            icon: Factory,
            matchTabs: ['produksi', 'resep-bom', 'hitung-hpp'],
          },
          {
            id: 'karyawan',
            label: t.nav.hr,
            icon: Users,
            matchTabs: ['karyawan', 'absensi', 'payroll'],
          },
          {
            id: 'audit-log',
            label: t.nav.auditLog,
            icon: Database,
            matchTabs: ['audit-log'],
          },
        ];
    }
  };

  const primaryMenuItems = getRoleMenuItems(currentUser.role);

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    if (onClose) onClose();
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-[#F0E6E5] flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 md:static ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Mobile Drawer Top Bar with Close Button */}
      {onClose && (
        <div className="p-3 border-b border-[#F0E6E5] flex md:hidden items-center justify-between bg-[#FAF7F5]">
          <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
            Menu Navigasi
          </span>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-200/60 rounded-lg transition"
            aria-label="Tutup menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Active Session / Role Context Card (Replaces Redundant Brand Header) */}
      <div className="p-3.5 border-b border-[#F0E6E5] bg-gradient-to-b from-[#FAF7F5] to-white">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500">
                Sesi Aktif
              </span>
            </div>
            <p className="font-extrabold text-xs text-stone-900 truncate mt-0.5">
              {currentUser.name}
            </p>
            <p className="text-[10px] text-stone-500 truncate font-medium">
              {currentUser.branchName}
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-stone-100 text-stone-700 border border-stone-200/80 flex-shrink-0">
            {currentUser.role}
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-4 py-1 space-y-2">
        {/* Primary CTA: + Transaksi Baru isolated with vertical margins my-4 & h-11 */}
        {(currentUser.role === 'KASIR' || currentUser.role === 'ADMIN_CABANG' || currentUser.role === 'OWNER') && (
          <div className="my-4">
            <button
              id="btn-new-transaction"
              onClick={() => handleNavClick('pos')}
              className="w-full h-11 px-4 bg-[#991B1B] hover:bg-[#881337] active:scale-[0.98] text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition focus:outline-none focus:ring-2 focus:ring-[#991B1B] focus:ring-offset-1"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>+ {t.nav.newTransaction}</span>
            </button>
          </div>
        )}

        {/* Primary Role-Tailored Nav Items with Tap target py-3 px-3.5 */}
        <nav className="space-y-1">
          {primaryMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.matchTabs.includes(activeTab);

            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`relative w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-medium transition active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-[#991B1B]/20 ${
                  isActive
                    ? 'bg-[#FDF2F2] text-[#991B1B] font-bold shadow-2xs'
                    : 'text-stone-700 hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                {/* Red Left Accent Indicator when active */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#991B1B] rounded-r-full" />
                )}

                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4.5 h-4.5 ${
                      isActive ? 'text-[#991B1B]' : 'text-stone-500'
                    }`}
                  />
                  <span className="tracking-tight text-left">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold font-mono tabular-nums ${
                      isActive
                        ? 'bg-[#991B1B] text-white'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Nav: Settings & Logout */}
      <div className="p-3 border-t border-[#F0E6E5] bg-[#FCFAF8] space-y-1">
        {/* Settings button */}
        <button
          id="sidebar-nav-settings"
          onClick={() => handleNavClick('settings')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'settings'
              ? 'bg-[#FDF2F2] text-[#991B1B] font-bold'
              : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <SettingsIcon
              className={`w-4 h-4 ${
                activeTab === 'settings' ? 'text-[#991B1B]' : 'text-stone-500'
              }`}
            />
            <span>{t.nav.settings}</span>
          </div>
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
            {language.toUpperCase()}
          </span>
        </button>

        {/* Logout button */}
        <button
          id="sidebar-nav-logout"
          onClick={() => {
            if (
              confirm(
                language === 'id'
                  ? 'Apakah Anda yakin ingin keluar?'
                  : 'Are you sure you want to log out?'
              )
            ) {
              logout();
            }
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:bg-red-50 hover:text-[#991B1B] transition"
        >
          <LogOut className="w-4 h-4 text-stone-500 hover:text-[#991B1B]" />
          <span>{t.nav.logout}</span>
        </button>
      </div>
    </aside>
  );
};
