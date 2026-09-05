import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Store,
  Crown,
  Warehouse,
  ShoppingCart,
  Users,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  X,
  UserCheck,
  Sparkles,
  ChevronDown,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, loginAsEmployee, branches = [], employees = [] } = useApp();

  const safeEmployees = Array.isArray(employees) ? employees.filter(Boolean) : [];
  const safeBranches = Array.isArray(branches) ? branches.filter(Boolean) : [];

  // Mode: 'karyawan' (Portal Mandiri Presensi) or 'admin' (Manajemen ERP)
  const [loginMode, setLoginMode] = useState<'karyawan' | 'admin'>('karyawan');

  // Employee Login State
  const [employeeName, setEmployeeName] = useState<string>('Cecep Hidayat');
  const [employeePassword, setEmployeePassword] = useState<string>('lashira123');

  // Admin Login State
  const [emailOrUsername, setEmailOrUsername] = useState<string>('owner@lashira.com');
  const [password, setPassword] = useState<string>('lashira123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('OWNER');
  const [selectedBranchId, setSelectedBranchId] = useState<string>('BR-01');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState<boolean>(false);
  const [showQuickRoleHelper, setShowQuickRoleHelper] = useState<boolean>(false);

  const rolePresets: {
    role: UserRole;
    label: string;
    username: string;
    email: string;
    name: string;
    branchId: string;
    branchName: string;
    icon: React.ElementType;
    badgeColor: string;
  }[] = [
    {
      role: 'OWNER',
      label: 'Owner / Pemilik',
      username: 'owner',
      email: 'owner@lashira.com',
      name: 'Hj. Siti Lashira',
      branchId: 'BR-PUSAT',
      branchName: 'Kantor & Pabrik Pusat',
      icon: Crown,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    },
    {
      role: 'ADMIN_GUDANG',
      label: 'Admin Gudang & Pabrik',
      username: 'gudang',
      email: 'gudang@lashira.com',
      name: 'Budi Santoso',
      branchId: 'BR-PUSAT',
      branchName: 'Gudang Pusat Soreang',
      icon: Warehouse,
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    },
    {
      role: 'ADMIN_CABANG',
      label: 'Admin Cabang (Dago)',
      username: 'dago',
      email: 'dago@lashira.com',
      name: 'Rian Pratama',
      branchId: 'BR-01',
      branchName: 'Cabang Dago Plaza',
      icon: Store,
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    {
      role: 'KASIR',
      label: 'Kasir POS (Dago)',
      username: 'kasir',
      email: 'kasir.dago@lashira.com',
      name: 'Nisa Rahmawati',
      branchId: 'BR-01',
      branchName: 'Cabang Dago Plaza',
      icon: ShoppingCart,
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    },
    {
      role: 'HR_ADMIN',
      label: 'HR & Kepegawaian',
      username: 'hr',
      email: 'hr@lashira.com',
      name: 'Maya Kusuma',
      branchId: 'BR-PUSAT',
      branchName: 'Kantor & Pabrik Pusat',
      icon: Users,
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    },
  ];

  const handleSelectRolePreset = (preset: typeof rolePresets[0]) => {
    setSelectedRole(preset.role);
    setEmailOrUsername(preset.email);
    setPassword('lashira123');
    setSelectedBranchId(preset.branchId);
    setErrorMsg(null);
  };

  const handleSelectEmployeePreset = (emp: { name: string; position: string; password?: string }) => {
    setEmployeeName(emp.name);
    setEmployeePassword(emp.password || 'lashira123');
    setErrorMsg(null);
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (loginMode === 'karyawan') {
      const name = employeeName.trim();
      const pass = employeePassword.trim();

      if (!name) {
        setErrorMsg('Silakan masukkan Nama Lengkap Anda sesuai yang didaftarkan oleh HR.');
        return;
      }
      if (!pass) {
        setErrorMsg('Silakan masukkan Kata Sandi (Password) Anda.');
        return;
      }

      setIsLoading(true);
      setTimeout(() => {
        const result = loginAsEmployee(name, pass);
        setIsLoading(false);
        if (!result.success) {
          setErrorMsg(result.message);
        }
      }, 350);
      return;
    }

    // Admin Mode Submit
    const input = emailOrUsername.trim().toLowerCase();

    if (!input) {
      setErrorMsg('Masukkan email atau username Anda');
      return;
    }
    if (!password) {
      setErrorMsg('Masukkan kata sandi');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // If user typed an employee name in the admin box, handle seamlessly!
      const matchedEmp = safeEmployees.find(
        (e) => e && e.name && e.name.toLowerCase().includes(input)
      );
      if (matchedEmp) {
        const res = loginAsEmployee(matchedEmp.name, password);
        setIsLoading(false);
        if (!res.success) setErrorMsg(res.message);
        return;
      }

      // Find matching preset or fallback to selected role
      let targetRole: UserRole = selectedRole;
      let targetBranch = selectedBranchId;
      let targetName = 'Pengguna Lashira';
      let targetEmail = emailOrUsername.trim();

      if (input.includes('owner') || input === 'owner@lashira.com') {
        targetRole = 'OWNER';
        targetBranch = 'BR-PUSAT';
        targetName = 'Hj. Siti Lashira';
      } else if (input.includes('gudang') || input === 'gudang@lashira.com') {
        targetRole = 'ADMIN_GUDANG';
        targetBranch = 'BR-PUSAT';
        targetName = 'Budi Santoso';
      } else if (input.includes('dago') || input.includes('cabang') || input === 'dago@lashira.com') {
        targetRole = 'ADMIN_CABANG';
        targetBranch = selectedBranchId || 'BR-01';
        targetName = 'Rian Pratama';
      } else if (input.includes('kasir') || input === 'kasir.dago@lashira.com') {
        targetRole = 'KASIR';
        targetBranch = selectedBranchId || 'BR-01';
        targetName = 'Nisa Rahmawati';
      } else if (input.includes('hr') || input === 'hr@lashira.com') {
        targetRole = 'HR_ADMIN';
        targetBranch = 'BR-PUSAT';
        targetName = 'Maya Kusuma';
      } else {
        const matched = rolePresets.find((p) => p.role === selectedRole);
        if (matched) {
          targetRole = matched.role;
          targetBranch = matched.branchId;
          targetName = matched.name;
        }
      }

      login(targetRole, targetBranch, targetEmail, targetName);
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white font-sans text-stone-800">
      {/* Left Column: Authentic Indonesian Snack Photography Banner */}
      <div className="hidden md:block md:w-1/2 lg:w-1/2 relative bg-stone-100 overflow-hidden select-none">
        <img
          src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1400&q=85"
          alt="Rumah Jajanan Lashira - Aneka Snack & Camilan Pedas Gurih"
          className="w-full h-full object-cover object-center transform scale-105 hover:scale-100 transition duration-1000 ease-out"
          referrerPolicy="no-referrer"
        />
        {/* Subtle Warm Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

        {/* Floating Brand Badge on Image (Bottom Left) */}
        <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-black/50 backdrop-blur-md border border-white/20 text-white flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">
              Sistem Terpadu ERP Pabrik & Cabang
            </p>
            <h3 className="text-base font-bold text-white mt-0.5">
              Rumah Jajanan Lashira
            </h3>
          </div>
          <span className="text-[11px] bg-[#991B1B] text-white font-bold px-2.5 py-1 rounded-lg">
            Versi 1.0.0
          </span>
        </div>
      </div>

      {/* Right Column: Clean, Minimalist Login Card */}
      <div className="w-full md:w-1/2 flex flex-col justify-between p-6 sm:p-10 md:p-12 lg:p-14 overflow-y-auto">
        <div className="w-full max-w-sm sm:max-w-md mx-auto my-auto py-4">
          {/* Logo Brand */}
          <div className="flex flex-col items-start mb-6">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#991B1B] text-white flex items-center justify-center shadow-md shadow-red-900/20">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M12 2L2 9.5V20C2 20.5523 2.44772 21 3 21H21C21.5523 21 22 20.5523 22 20V9.5L12 2ZM12 4.5L19.5 10.5V19H4.5V10.5L12 4.5ZM10 13H14V19H10V13Z" />
                </svg>
              </div>
              <div>
                <span className="text-sm font-extrabold tracking-tight text-[#991B1B] uppercase block leading-none">
                  RumahJajananLashira
                </span>
                <span className="text-[10px] text-stone-400 font-medium tracking-wide">
                  Enterprise Resource Planning
                </span>
              </div>
            </div>

            {/* Title and Subtitle */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-5">
              {loginMode === 'karyawan' ? 'Portal Presensi Karyawan' : 'Selamat Datang Kembali'}
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              {loginMode === 'karyawan'
                ? 'Masuk menggunakan Nama Lengkap & Password yang didaftarkan HR'
                : 'Silakan masuk ke akun ERP Manajemen & Operasional'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-2xl mb-5 border border-stone-200">
            <button
              type="button"
              onClick={() => {
                setLoginMode('karyawan');
                setErrorMsg(null);
              }}
              className={`py-2.5 px-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${
                loginMode === 'karyawan'
                  ? 'bg-white text-[#991B1B] shadow-xs border border-[#F0E6E5]'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Login Karyawan</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginMode('admin');
                setErrorMsg(null);
              }}
              className={`py-2.5 px-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${
                loginMode === 'admin'
                  ? 'bg-white text-[#991B1B] shadow-xs border border-[#F0E6E5]'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Manajemen & Admin</span>
            </button>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* TAB 1: PORTAL KARYAWAN LOGIN (Nama Lengkap & Password) */}
          {loginMode === 'karyawan' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nama Lengkap Karyawan */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-stone-700">
                    Nama Lengkap Karyawan
                  </label>
                  <span className="text-[10px] text-stone-400 font-medium">
                    Sesuai didaftarkan HR
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <User className="w-4 h-4 text-[#991B1B]" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Masukkan nama lengkap (contoh: Cecep Hidayat)"
                    value={employeeName}
                    onChange={(e) => setEmployeeName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-3 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm font-semibold text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#991B1B] focus:ring-1 focus:ring-[#991B1B] transition"
                  />
                </div>

                {/* Quick select employee dropdown from active HR database */}
                <div className="mt-2 flex items-center gap-1.5 text-[11px] text-stone-500">
                  <span className="font-semibold text-stone-600">Pilih cepat:</span>
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        const found = safeEmployees.find((emp) => emp.id === e.target.value);
                        if (found) {
                          setEmployeeName(found.name);
                          setEmployeePassword(found.password || 'lashira123');
                          setErrorMsg(null);
                        }
                      }
                    }}
                    defaultValue=""
                    className="text-[11px] font-bold text-[#991B1B] bg-[#FAF2F0] border border-[#F0E6E5] rounded-lg px-2 py-1 outline-none max-w-[240px] truncate"
                  >
                    <option value="" disabled>
                      Pilih dari data HR ({safeEmployees.length} karyawan)...
                    </option>
                    {safeEmployees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} — {emp.position} ({emp.branchName})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-stone-700">
                    Kata Sandi (Password)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPasswordModal(true)}
                    className="text-[11px] font-bold text-[#991B1B] hover:underline"
                  >
                    Lupa Password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Lock className="w-4 h-4 text-[#991B1B]" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Masukkan password (default: lashira123)"
                    value={employeePassword}
                    onChange={(e) => setEmployeePassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm font-mono text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#991B1B] focus:ring-1 focus:ring-[#991B1B] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600 transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Information Banner */}
              <div className="p-3 bg-[#FAF2F0] border border-[#F0E6E5] rounded-xl text-[11px] text-stone-600 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-[#991B1B] flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Portal Khusus Karyawan:</strong> Absensi selfie kamera & GPS terverifikasi, pengajuan izin/cuti, dan cek kalkulasi tunjangan otomatis yang langsung masuk ke rekap gaji HR.
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-[#991B1B] hover:bg-[#881337] active:scale-[0.99] text-white text-xs sm:text-sm font-black rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Masuk ke Portal Presensi Karyawan</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Quick Employee Presets */}
              <div className="pt-3 border-t border-stone-100">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-2">
                  Uji Coba Akun Karyawan (1-Klik):
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {safeEmployees.slice(0, 4).map((emp) => (
                    <button
                      key={emp.id}
                      type="button"
                      onClick={() => handleSelectEmployeePreset(emp)}
                      className={`p-2 rounded-xl text-left border transition flex items-center gap-2 ${
                        employeeName === emp.name
                          ? 'border-[#991B1B] bg-[#FAF2F0] text-[#991B1B] font-bold'
                          : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                      }`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-stone-200 overflow-hidden flex-shrink-0">
                        <img
                          src={
                            emp.photoUrl ||
                            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
                          }
                          alt={emp.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="truncate">
                        <span className="block text-[11px] font-bold truncate leading-tight">
                          {emp.name}
                        </span>
                        <span className="block text-[9px] text-stone-400 truncate">
                          {emp.position}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </form>
          ) : (
            /* TAB 2: ADMIN & MANAJEMEN LOGIN */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email / Username Field */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Email / Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="Masukkan email atau username"
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-3 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#991B1B] focus:ring-1 focus:ring-[#991B1B] transition"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#991B1B] focus:ring-1 focus:ring-[#991B1B] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600 transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-[#991B1B] hover:bg-[#881337] active:scale-[0.99] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Masuk ke Sistem Manajemen</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Quick Role Tester / Preset Switcher */}
              <div className="mt-5 pt-4 border-t border-stone-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                    Akses Cepat Demo Manajemen:
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowQuickRoleHelper(!showQuickRoleHelper)}
                    className="text-[11px] font-bold text-[#991B1B] hover:underline"
                  >
                    {showQuickRoleHelper ? 'Tutup Pilihan' : 'Pilih Role'}
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {rolePresets.map((preset) => {
                    const isSelected = selectedRole === preset.role;
                    const Icon = preset.icon;
                    return (
                      <button
                        key={preset.role}
                        type="button"
                        onClick={() => handleSelectRolePreset(preset)}
                        className={`p-2 rounded-xl text-left border transition flex items-center gap-2 ${
                          isSelected
                            ? 'border-[#991B1B] bg-[#FAF2F0] text-[#991B1B] font-bold shadow-xs'
                            : 'border-stone-200 bg-stone-50/70 hover:bg-stone-100 text-stone-700'
                        }`}
                      >
                        <div
                          className={`p-1 rounded-lg text-xs ${
                            isSelected ? 'bg-[#991B1B] text-white' : 'bg-stone-200 text-stone-600'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="truncate">
                          <span className="block text-[11px] font-bold truncate leading-tight">
                            {preset.label}
                          </span>
                          <span className="block text-[9px] text-stone-400 truncate">
                            {preset.username}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-[11px] text-stone-400 font-medium pt-4">
          Versi 1.0.0 | © 2024 RumahJajananLashira • Terhubung Database HR & Payroll
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                <HelpCircle className="w-4 h-4 text-[#991B1B]" />
                <span>Bantuan Password Karyawan</span>
              </div>
              <button
                onClick={() => setShowForgotPasswordModal(false)}
                className="p-1 hover:bg-stone-100 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Kata sandi akun portal karyawan dikelola langsung oleh <strong>Admin HR & Keuangan</strong>. Jika Anda lupa kata sandi atau ingin meresetnya, silakan hubungi bagian HR.
            </p>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1">
              <span className="font-bold text-stone-800 block">Hubungi HR & Personalia:</span>
              <p className="text-stone-600">WhatsApp HRD: <strong>+62 811-2233-4455 (Maya Kusuma)</strong></p>
              <p className="text-stone-600">Email: <strong>hr@lashira.com</strong></p>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800">
              <span className="font-semibold">Password Bawaan:</span> Seluruh karyawan baru yang didaftarkan HR memiliki kata sandi standar awal: <strong>lashira123</strong>.
            </div>

            <button
              onClick={() => setShowForgotPasswordModal(false)}
              className="w-full py-2.5 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-xl transition"
            >
              Saya Mengerti
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
