import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/common/Sidebar';
import { PrintReceiptModal } from './components/common/PrintReceiptModal';
import { PrintSuratJalanModal } from './components/common/PrintSuratJalanModal';
import { PrintSlipGajiModal } from './components/common/PrintSlipGajiModal';
import { SystemDocsModal } from './components/common/SystemDocsModal';
import { RoleGuideModal } from './components/common/RoleGuideModal';
import { LoginPage } from './components/auth/LoginPage';
import { UserRole } from './types';

// Modules
import { OwnerDashboard } from './components/modules/OwnerDashboard';
import { SupplierModule } from './components/modules/SupplierModule';
import { PurchasingModule } from './components/modules/PurchasingModule';
import { RawMaterialsModule } from './components/modules/RawMaterialsModule';
import { RecipeBOMModule } from './components/modules/RecipeBOMModule';
import { HppCalculatorModule } from './components/modules/HppCalculatorModule';
import { ProductionQCModule } from './components/modules/ProductionQCModule';
import { FinishedProductsModule } from './components/modules/FinishedProductsModule';
import { StockManagementModule } from './components/modules/StockManagementModule';
import { DistributionModule } from './components/modules/DistributionModule';
import { StockRequestsModule } from './components/modules/StockRequestsModule';
import { PosSalesModule } from './components/modules/PosSalesModule';
import { SalesReportsModule } from './components/modules/SalesReportsModule';
import { FinancialsModule } from './components/modules/FinancialsModule';
import { AttendanceModule } from './components/modules/AttendanceModule';
import { PayrollModule } from './components/modules/PayrollModule';
import { EmployeesModule } from './components/modules/EmployeesModule';
import { AuditLogModule } from './components/modules/AuditLogModule';
import { OwnerFinancePayrollExecutive } from './components/modules/OwnerFinancePayrollExecutive';
import { SettingsModule } from './components/modules/SettingsModule';

import {
  Menu,
  Bell,
  LogOut,
  HelpCircle,
  Building,
  Store,
  Crown,
  Warehouse,
  ShoppingCart,
  Users,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Wifi,
  Smartphone,
  ChevronDown,
  ShieldAlert,
  ArrowRight,
  UserCheck,
  X,
  MapPin,
  Search,
  Grid,
  Globe,
} from 'lucide-react';

const MainLayout: React.FC = () => {
  const {
    isAuthenticated,
    logout,
    activeTab,
    setActiveTab,
    currentUser,
    switchUserRole,
    activeBranchId,
    setActiveBranchId,
    branches,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    showDocsModal,
    setShowDocsModal,
    selectedSaleForPrint,
    setSelectedSaleForPrint,
    selectedDistributionForPrint,
    setSelectedDistributionForPrint,
    selectedPayrollForPrint,
    setSelectedPayrollForPrint,
    showRoleGuideModal,
    setShowRoleGuideModal,
    language,
    setLanguage,
    t,
  } = useApp();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showBranchMenu, setShowBranchMenu] = useState(false);
  const [showGuideBanner, setShowGuideBanner] = useState(false);

  // If not logged in, show the dedicated Login Page
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const unreadNotificationCount = Array.isArray(notifications)
    ? notifications.filter((n) => n && !n.isRead).length
    : 0;

  const roleOptions: {
    role: UserRole;
    title: string;
    branchId: string;
    branchName: string;
    desc: string;
    icon: React.ElementType;
    badgeColor: string;
  }[] = [
    {
      role: 'OWNER',
      title: 'Owner / Pemilik Utama',
      branchId: 'BR-PUSAT',
      branchName: 'Kantor & Pabrik Pusat',
      desc: 'Akses penuh seluruh cabang, laba rugi, HPP, produksi & audit log',
      icon: Crown,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    },
    {
      role: 'ADMIN_GUDANG',
      title: 'Admin Gudang Pusat & Pabrik',
      branchId: 'BR-PUSAT',
      branchName: 'Gudang Pusat Soreang',
      desc: 'Bahan baku, resep BOM, kontrol HPP, SPK produksi & distribusi',
      icon: Warehouse,
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    },
    {
      role: 'ADMIN_CABANG',
      title: 'Admin Per-Cabang (Dago Plaza)',
      branchId: 'BR-01',
      branchName: 'Cabang Dago Plaza Bandung',
      desc: 'Kelola stok cabang, terima mutasi pusat, kas kecil, request restock',
      icon: Store,
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    {
      role: 'KASIR',
      title: 'Kasir Per-Cabang (Dago Plaza)',
      branchId: 'BR-01',
      branchName: 'Cabang Dago Plaza Bandung',
      desc: 'Transaksi POS kilat, scan barcode, cetak struk thermal & QRIS',
      icon: ShoppingCart,
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    },
    {
      role: 'HR_ADMIN',
      title: 'HR / Admin Kepegawaian & Payroll',
      branchId: 'BR-PUSAT',
      branchName: 'Kantor & Pabrik Pusat',
      desc: 'Data karyawan semua cabang, presensi GPS selfie & slip gaji otomatis',
      icon: Users,
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    },
    {
      role: 'KARYAWAN',
      title: 'Karyawan (Absensi Mandiri)',
      branchId: 'BR-PUSAT',
      branchName: 'Kantor & Pabrik Pusat',
      desc: 'Presensi selfie GPS mandiri, ajukan izin/cuti & cek slip gaji otomatis',
      icon: UserCheck,
      badgeColor: 'bg-teal-100 text-teal-800 border-teal-300',
    },
  ];

  const renderActiveModule = () => {
    switch (activeTab) {
      case 'dashboard':
        return <OwnerDashboard />;
      case 'pos':
      case 'penjualan-pos':
        return <PosSalesModule />;
      case 'laporan-penjualan':
        return <SalesReportsModule />;
      case 'produk-jadi':
      case 'master-produk':
        return <FinishedProductsModule />;
      case 'manajemen-stok':
      case 'stok-produk':
        return <StockManagementModule />;
      case 'distribusi':
        return <DistributionModule />;
      case 'permintaan-stok':
        return <StockRequestsModule />;
      case 'produksi-qc':
      case 'produksi':
        return <ProductionQCModule />;
      case 'resep-bom':
        return <RecipeBOMModule />;
      case 'hitung-hpp':
        return <HppCalculatorModule />;
      case 'bahan-baku':
      case 'stok-bahan':
        return <RawMaterialsModule />;
      case 'pembelian-po':
      case 'pembelian':
        return <PurchasingModule />;
      case 'supplier':
        return <SupplierModule />;
      case 'keuangan':
        return <FinancialsModule />;
      case 'presensi':
      case 'absensi':
        return <AttendanceModule />;
      case 'payroll':
        if (currentUser?.role === 'KARYAWAN') {
          return <OwnerDashboard />;
        }
        return <PayrollModule />;
      case 'karyawan':
        return <EmployeesModule />;
      case 'audit-log':
        return <AuditLogModule />;
      case 'owner-keuangan-gaji':
      case 'keuangan-owner':
      case 'gaji-jabatan':
        return <OwnerFinancePayrollExecutive />;
      case 'settings':
      case 'pengaturan':
        return <SettingsModule />;
      default:
        return <OwnerDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F5] flex flex-col font-sans text-stone-900 antialiased selection:bg-[#991B1B] selection:text-white">
      {/* Top Navbar matching screenshot */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#F0E6E5] shadow-xs">
        <div className="flex items-center justify-between px-4 lg:px-6 py-2.5 gap-2">
          {/* Left: Mobile Menu Toggle & Brand Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-xl text-stone-600 hover:bg-[#FDF2F2] transition active:scale-95"
              aria-label="Toggle Sidebar"
            >
              <Menu className="w-5 h-5 text-[#991B1B]" />
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className="text-left group transition flex items-center gap-2.5 focus:outline-none"
            >
              <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-br from-[#E87373] to-[#991B1B] text-white flex items-center justify-center shadow-xs flex-shrink-0 group-hover:scale-105 transition-transform">
                <Store className="w-4.5 h-4.5" />
              </div>
              <div className="min-w-0 leading-tight">
                <div className="flex items-baseline gap-1.5">
                  <h1 className="text-sm sm:text-base font-extrabold text-[#991B1B] tracking-tight leading-none">
                    Rumah Jajan Alshaira
                  </h1>
                  <span className="text-[11px] font-semibold text-stone-500 tracking-normal leading-none">
                    kartika
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase mt-0.5 leading-none">
                  by haber group
                </p>
              </div>
            </button>
          </div>

          {/* Center: Search pill & Branch Selector */}
          <div className="hidden md:flex items-center gap-2.5 flex-1 max-w-xl mx-4">
            {/* Search Pill */}
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={
                  activeTab === 'pos' || activeTab === 'penjualan-pos'
                    ? t.header.searchPlaceholder
                    : activeTab === 'stok-bahan' || activeTab === 'bahan-baku'
                    ? t.header.searchInventory
                    : activeTab === 'produksi' || activeTab === 'resep-bom'
                    ? t.header.searchProduction
                    : t.header.searchGeneral
                }
                className="w-full pl-9 pr-3 py-1.5 bg-[#FAF7F5] border border-[#F0E6E5] rounded-full text-xs placeholder-stone-400 outline-none focus:bg-white focus:border-[#991B1B] transition font-normal"
              />
            </div>

            {/* Branch Selector Pill Dropdown */}
            <div className="relative">
              <button
                id="btn-branch-selector"
                onClick={() => setShowBranchMenu(!showBranchMenu)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF7F5] hover:bg-[#F5ECE9] border border-[#F0E6E5] rounded-full text-xs font-semibold text-stone-700 transition"
              >
                <MapPin className="w-3.5 h-3.5 text-[#991B1B]" />
                <span className="truncate max-w-[130px]">
                  {currentUser.branchId === 'BR-PUSAT'
                    ? t.header.centralBranch
                    : currentUser.branchName}
                </span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {showBranchMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-200 p-2 z-50 text-xs animate-in fade-in duration-150">
                  <div className="px-2 py-1 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                    {language === 'id' ? 'Pilih Cabang / Outlet' : 'Select Branch / Outlet'}
                  </div>
                  {branches.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => {
                        setActiveBranchId(b.id);
                        setShowBranchMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl transition flex items-center justify-between ${
                        activeBranchId === b.id
                          ? 'bg-[#FDF2F2] text-[#991B1B] font-bold'
                          : 'hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <div className="truncate">
                        <p className="font-bold truncate">{b.name}</p>
                        <p className="text-[10px] text-stone-400">{b.city}</p>
                      </div>
                      {activeBranchId === b.id && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#991B1B]" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Action Icons: Language Toggle, Bell, Help, Grid, Profile */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Quick Language Selector (🇮🇩 / 🇬🇧) */}
            <div className="flex items-center p-0.5 bg-[#FAF7F5] border border-[#F0E6E5] rounded-lg">
              <button
                onClick={() => setLanguage('id')}
                className={`px-2 py-1 rounded text-[11px] font-extrabold transition ${
                  language === 'id'
                    ? 'bg-[#991B1B] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="Ganti ke Bahasa Indonesia"
              >
                🇮🇩 ID
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded text-[11px] font-extrabold transition ${
                  language === 'en'
                    ? 'bg-[#991B1B] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="Switch to English"
              >
                🇬🇧 EN
              </button>
            </div>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                id="btn-notifications"
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-full text-stone-600 hover:bg-[#FAF7F5] relative transition active:scale-95"
                title={t.header.notifications}
              >
                <Bell className="w-4 h-4 text-stone-600" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#991B1B] rounded-full ring-2 ring-white" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-stone-200 p-4 space-y-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                    <h4 className="font-extrabold text-xs text-stone-900">
                      {t.header.notifications}
                    </h4>
                    {unreadNotificationCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-[10px] text-[#991B1B] hover:underline font-bold"
                      >
                        {t.header.markAllRead}
                      </button>
                    )}
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-stone-400 text-center py-4">{t.header.noNotif}</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationAsRead(n.id);
                            if (n.actionLink) {
                              setActiveTab(n.actionLink);
                              setShowNotifications(false);
                            }
                          }}
                          className={`p-2.5 rounded-xl text-xs cursor-pointer transition ${
                            n.isRead ? 'bg-stone-50 text-stone-600' : 'bg-[#FDF2F2] text-stone-900 font-semibold border border-red-100'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <span className="font-bold">{n.title}</span>
                            <span className="text-[10px] text-stone-400 font-normal">{n.timestamp}</span>
                          </div>
                          <p className="text-[11px] text-stone-600 mt-0.5">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Help / SOP Guide Button */}
            <button
              id="btn-role-guide"
              onClick={() => setShowRoleGuideModal(true)}
              className="p-2 rounded-full text-stone-600 hover:bg-[#FAF7F5] border border-transparent hover:border-[#F0E6E5] transition active:scale-95"
              title={t.header.sopGuide}
            >
              <HelpCircle className="w-4 h-4 text-stone-600" />
            </button>

            {/* Profile & Role Switcher Pill */}
            <div className="relative">
              <button
                id="btn-user-profile-menu"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full bg-[#FAF7F5] hover:bg-[#F5ECE9] border border-[#F0E6E5] transition text-left active:scale-95"
                title="Profil Pengguna & Ganti Peran"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#E87373] to-[#991B1B] text-white font-bold flex items-center justify-center text-xs shadow-xs overflow-hidden flex-shrink-0">
                  {currentUser.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    currentUser.name.slice(0, 1)
                  )}
                </div>
                <div className="hidden sm:block text-left leading-none">
                  <span className="block text-xs font-bold text-stone-900 truncate max-w-[90px]">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <span className="block text-[9px] font-extrabold text-[#991B1B] uppercase tracking-wider mt-0.5">
                    {currentUser.role}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-stone-200 p-3 space-y-3 z-50 text-xs animate-in fade-in duration-150">
                  {/* Current Active Account Box */}
                  <div className="p-3 bg-[#FDF2F2] rounded-xl border border-red-100">
                    <span className="text-[10px] text-[#991B1B] font-extrabold uppercase tracking-wider block">
                      {language === 'id' ? 'PENGGUNA AKTIF' : 'ACTIVE USER'}
                    </span>
                    <p className="font-black text-stone-900 text-sm mt-0.5">{currentUser.name}</p>
                    <p className="text-stone-600 text-[11px] font-medium">{currentUser.email}</p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 bg-[#991B1B] text-white font-bold text-[10px] rounded-full">
                        {currentUser.role}
                      </span>
                      <span className="text-[11px] text-stone-600 truncate">
                        {currentUser.branchName}
                      </span>
                    </div>
                  </div>

                  {/* 5 Roles Quick Switch List */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-stone-400 font-extrabold uppercase px-1 block tracking-wider">
                      {language === 'id' ? 'SIMULASI GANTI ROLE (5 PERAN):' : 'SWITCH ROLE SIMULATION (5 ROLES):'}
                    </span>
                    {roleOptions.map((opt) => {
                      const Icon = opt.icon;
                      const isCurrent = currentUser.role === opt.role;

                      return (
                        <button
                          key={opt.role}
                          onClick={() => {
                            switchUserRole(opt.role, opt.branchId);
                            setShowUserMenu(false);
                          }}
                          className={`w-full text-left p-2 rounded-xl transition flex items-start gap-2.5 ${
                            isCurrent
                              ? 'bg-[#FDF2F2] text-[#991B1B] font-bold border border-red-200'
                              : 'hover:bg-stone-50 text-stone-700'
                          }`}
                        >
                          <div className={`p-1.5 rounded-lg border flex-shrink-0 ${opt.badgeColor}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-extrabold truncate text-xs">{opt.title}</span>
                              {isCurrent && <CheckCircle2 className="w-3.5 h-3.5 text-[#991B1B] flex-shrink-0" />}
                            </div>
                            <p className="text-[10px] text-stone-500 font-normal leading-tight mt-0.5 line-clamp-1">
                              {opt.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Settings and Logout Buttons */}
                  <div className="pt-2 border-t border-stone-100 space-y-1">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setActiveTab('settings');
                      }}
                      className="w-full py-2 px-3 hover:bg-stone-100 text-stone-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition"
                    >
                      <Globe className="w-4 h-4 text-[#991B1B]" />
                      <span>{t.nav.settings} (Bahasa / Language)</span>
                    </button>
                    <button
                      id="btn-logout-dropdown"
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                      }}
                      className="w-full py-2 px-3 bg-stone-100 hover:bg-red-50 text-stone-700 hover:text-[#991B1B] font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition"
                    >
                      <LogOut className="w-4 h-4 text-[#991B1B]" />
                      <span>{t.nav.logout}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* App Body (Sidebar + Content View) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Responsive Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-4">
          {/* Quick Role Guide Notification Banner */}
          {showGuideBanner && (
            <div className="bg-gradient-to-r from-red-900 via-stone-900 to-stone-900 text-white rounded-2xl p-3.5 sm:p-4 shadow-sm border border-red-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-150">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-red-600/80 text-white flex-shrink-0 shadow-xs">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs text-white">
                      Panduan Operasional {currentUser.roleTitle || currentUser.role}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.2 bg-red-500/30 text-red-200 rounded-full border border-red-400/30">
                      {currentUser.branchName}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-300 mt-0.5">
                    Pelajari tatacara dan alur kerja (SOP) harian khusus peran Anda untuk mempermudah operasional.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                <button
                  onClick={() => setShowRoleGuideModal(true)}
                  className="px-3 py-1.5 bg-white text-stone-900 hover:bg-stone-100 font-bold text-xs rounded-xl shadow-xs transition active:scale-95 flex items-center gap-1.5"
                >
                  <span>Buka Panduan SOP</span>
                  <ArrowRight className="w-3.5 h-3.5 text-red-600" />
                </button>
                <button
                  onClick={() => setShowGuideBanner(false)}
                  className="p-1.5 text-stone-400 hover:text-white rounded-lg transition"
                  title="Sembunyikan pesan ini"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {renderActiveModule()}
        </main>
      </div>

      {/* Role-Based Usage Guide & SOP Modal */}
      {showRoleGuideModal && <RoleGuideModal />}

      {/* Thermal Receipt Print Modal */}
      {selectedSaleForPrint && (
        <PrintReceiptModal
          sale={selectedSaleForPrint}
          onClose={() => setSelectedSaleForPrint(null)}
        />
      )}

      {/* Surat Jalan Delivery Print Modal */}
      {selectedDistributionForPrint && (
        <PrintSuratJalanModal
          distribution={selectedDistributionForPrint}
          onClose={() => setSelectedDistributionForPrint(null)}
        />
      )}

      {/* Employee Pay Slip Modal */}
      {selectedPayrollForPrint && (
        <PrintSlipGajiModal
          payroll={selectedPayrollForPrint}
          onClose={() => setSelectedPayrollForPrint(null)}
        />
      )}

      {/* System Docs & ERD Modal */}
      {showDocsModal && (
        <SystemDocsModal onClose={() => setShowDocsModal(false)} />
      )}
    </div>
  );
};

class GlobalErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Lashira ERP Global Runtime Error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF7F5] flex items-center justify-center p-4 font-sans text-stone-900">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#F0E6E5] text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-[#FAF2F0] text-[#991B1B] mx-auto flex items-center justify-center shadow-xs">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-black text-stone-900 tracking-tight">
                Rumah Jajanan Lashira
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Data browser sedang disinkronkan ulang. Silakan klik muat ulang atau reset data demo.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-rose-50 text-rose-800 rounded-xl text-left text-[11px] font-mono overflow-auto max-h-28 border border-rose-200">
                {this.state.error.message}
              </div>
            )}

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full py-3 px-4 bg-[#991B1B] hover:bg-[#881337] text-white font-bold text-xs rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
              >
                Muat Ulang Halaman
              </button>
              <button
                onClick={this.handleReset}
                className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Reset Cache Data Demo
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <GlobalErrorBoundary>
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </GlobalErrorBoundary>
  );
}

