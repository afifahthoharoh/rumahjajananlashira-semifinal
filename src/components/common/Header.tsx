import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Bell,
  Building2,
  UserCheck,
  RotateCcw,
  BookOpen,
  ChevronDown,
  Clock,
  Sparkles,
  Search,
  CheckCircle2,
  Layers,
  Store,
  ShieldCheck,
  Crown,
  Warehouse,
  ShoppingCart,
  Users,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentUser,
    switchUserRole,
    activeBranchId,
    setActiveBranchId,
    branches,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    resetToDemoData,
    setShowSystemDocsModal,
    setActiveTab,
  } = useApp();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [showRoleMenu, setShowRoleMenu] = useState<boolean>(false);
  const [showNotifMenu, setShowNotifMenu] = useState<boolean>(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('id-ID', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const roleOptions: { role: UserRole; title: string; desc: string; icon: React.ElementType }[] = [
    { role: 'OWNER', title: 'Owner (Pemilik)', desc: 'Akses penuh seluruh cabang, laba rugi, produksi & karyawan', icon: Crown },
    { role: 'ADMIN_GUDANG', title: 'Admin Gudang Pusat', desc: 'Kelola bahan baku, PO, BOM, produksi & distribusi', icon: Warehouse },
    { role: 'ADMIN_CABANG', title: 'Admin Cabang (Dago)', desc: 'Terima barang, stok cabang, kas kecil, request restock', icon: Store },
    { role: 'KASIR', title: 'Kasir POS', desc: 'Transaksi cepat, scan barcode, cetak struk, cek stok', icon: ShoppingCart },
    { role: 'HR_ADMIN', title: 'HR & Payroll', desc: 'Presensi GPS & selfie, data staf, hitung payroll otomatis', icon: Users },
  ];

  return (
    <header className="bg-gradient-to-r from-red-700 via-red-600 to-rose-700 text-white shadow-md sticky top-0 z-30">
      <div className="px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Brand Identity matching desain.md */}
        <div className="flex items-center gap-3">
          <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-br from-[#E87373] to-[#991B1B] text-white flex items-center justify-center shadow-xs flex-shrink-0 border border-white/20">
            <Store className="w-4.5 h-4.5 text-white" />
          </div>
          <div className="leading-tight">
            <div className="flex items-baseline gap-1.5">
              <h1 className="font-extrabold text-base tracking-tight text-white leading-none">
                Rumah Jajan Alshaira
              </h1>
              <span className="text-xs font-semibold text-stone-200 tracking-normal leading-none">
                kartika
              </span>
            </div>
            <p className="text-[10px] text-red-200/80 font-medium tracking-widest uppercase mt-0.5 leading-none">
              by haber group
            </p>
          </div>
        </div>

        {/* Center: Live Clock & Quick Branch Switcher */}
        <div className="hidden lg:flex items-center gap-4 bg-red-950/30 px-3.5 py-1.5 rounded-xl border border-white/10 backdrop-blur-xs">
          <div className="flex items-center gap-1.5 text-xs text-red-100 font-mono tabular-nums">
            <Clock className="w-3.5 h-3.5 text-red-300" />
            <span>{currentTime}</span>
          </div>

          <div className="h-4 w-px bg-white/20" />

          {/* Branch Switcher (for Owner & Gudang) */}
          <div className="flex items-center gap-1.5">
            <Store className="w-3.5 h-3.5 text-red-200" />
            <select
              id="branch-switcher-select"
              value={activeBranchId}
              onChange={(e) => setActiveBranchId(e.target.value)}
              disabled={currentUser.role === 'ADMIN_CABANG' || currentUser.role === 'KASIR'}
              className="bg-black/30 text-white text-xs font-semibold rounded-lg px-2.5 py-1 outline-none border border-white/15 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {branches.map((b) => (
                <option key={b.id} value={b.id} className="bg-stone-900 text-white">
                  {b.name} {b.isMainWarehouse ? '(Gudang Pusat)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right: Quick Actions, Role Switcher, Notifications, System Architecture */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* System Specs & ERD Button */}
          <button
            id="system-docs-btn"
            onClick={() => setShowSystemDocsModal(true)}
            className="flex items-center gap-1.5 text-xs bg-white/15 hover:bg-white/25 active:scale-95 text-white font-medium px-2.5 py-1.5 rounded-lg border border-white/20 transition backdrop-blur-sm"
            title="Lihat Arsitektur, ERD PostgreSQL & Flow Sistem"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Dokumentasi & ERD</span>
          </button>

          {/* Realtime Notification Bell */}
          <div className="relative">
            <button
              id="notif-bell-btn"
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="relative p-2 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 transition text-white"
              title="Notifikasi Realtime"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-400 text-red-950 font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-stone-900 rounded-xl shadow-2xl border border-stone-200 py-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-4 py-2 border-b border-stone-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-red-600" />
                    <span className="font-bold text-sm">Notifikasi Realtime</span>
                    <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.2 rounded-full font-bold">
                      {unreadCount} Baru
                    </span>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-xs text-red-600 hover:underline font-semibold"
                    >
                      Tandai Semua Dibaca
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-stone-100">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-stone-400 text-xs">Belum ada notifikasi</div>
                  ) : (
                    notifications.slice(0, 8).map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markNotificationAsRead(notif.id);
                          if (notif.actionLink) {
                            setActiveTab(notif.actionLink);
                            setShowNotifMenu(false);
                          }
                        }}
                        className={`p-3 text-xs transition cursor-pointer hover:bg-stone-50 ${
                          !notif.isRead ? 'bg-red-50/50' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1 mb-1">
                          <span className="font-bold text-stone-800">{notif.title}</span>
                          <span className="text-[10px] text-stone-400 whitespace-nowrap">{notif.timestamp}</span>
                        </div>
                        <p className="text-stone-600 leading-relaxed">{notif.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Role Switcher Pill */}
          <div className="relative">
            <button
              id="role-switcher-btn"
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 bg-white text-red-700 hover:bg-red-50 active:scale-95 px-3 py-1.5 rounded-lg font-bold text-xs shadow-sm transition border border-red-200"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
              <div className="text-left leading-tight hidden sm:block">
                <span className="block text-[10px] uppercase font-bold text-stone-500">Peran Aktif</span>
                <span className="font-extrabold text-red-700">{currentUser.role}</span>
              </div>
              <ChevronDown className="w-3 h-3 text-stone-500" />
            </button>

            {/* Role Switch Dropdown */}
            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white text-stone-900 rounded-xl shadow-2xl border border-stone-200 p-2 z-50">
                <div className="px-3 py-2 border-b border-stone-100 mb-1">
                  <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Simulasi Ganti Role (RBAC)</p>
                  <p className="text-xs text-stone-600">Pilih role untuk menguji hak akses modul:</p>
                </div>
                <div className="space-y-1">
                  {roleOptions.map((opt) => {
                    const RoleIcon = opt.icon;
                    return (
                      <button
                        key={opt.role}
                        onClick={() => {
                          switchUserRole(opt.role);
                          setShowRoleMenu(false);
                        }}
                        className={`w-full text-left p-2 rounded-lg flex items-start gap-2.5 text-xs transition ${
                          currentUser.role === opt.role
                            ? 'bg-red-50 text-red-700 font-bold border border-red-200'
                            : 'hover:bg-stone-50 text-stone-700'
                        }`}
                      >
                        <div className={`p-1.5 rounded-md mt-0.5 ${currentUser.role === opt.role ? 'bg-red-100 text-red-700' : 'bg-stone-100 text-stone-600'}`}>
                          <RoleIcon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="font-bold flex items-center gap-1.5">
                            {opt.title}
                            {currentUser.role === opt.role && <CheckCircle2 className="w-3 h-3 text-red-600" />}
                          </div>
                          <p className="text-[11px] text-stone-500 font-normal mt-0.5 leading-snug">{opt.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <div className="flex items-center gap-2 pl-1 border-l border-red-500/40">
            <img
              src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100'}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm flex-shrink-0"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
