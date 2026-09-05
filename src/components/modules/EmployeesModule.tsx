import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Employee } from '../../types';
import {
  Users,
  Plus,
  Search,
  Building,
  Phone,
  Calendar,
  DollarSign,
  ShieldCheck,
  Edit2,
  Trash2,
  X,
  UserCheck,
  CheckCircle2,
  Clock,
  Wallet,
  CreditCard,
  AlertCircle,
  Filter,
  FileText,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export const EmployeesModule: React.FC = () => {
  const { employees, branches, addEmployee, attendances, t, language, setActiveTab } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTabSub, setActiveTabSub] = useState<'employees' | 'attendance'>('employees');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    role: 'KASIR' as const,
    position: 'Kasir & Pelayanan',
    branchId: 'BR-01',
    baseSalary: 3200000,
    dailyMealAllowance: 25000,
    dailyTransportAllowance: 15000,
    bankName: 'BCA',
    bankAccountNumber: '8899-231-001',
    password: 'lashira123',
    joinDate: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const b = branches.find((br) => br.id === formData.branchId);

    addEmployee({
      nik: `327301${Date.now().toString().slice(-8)}`,
      name: formData.name,
      position: formData.position as any,
      branchId: formData.branchId,
      branchName: b ? b.name : 'Cabang Utama',
      phone: formData.phone,
      email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, '.')}@lashira.com`,
      address: 'Bandung, Jawa Barat',
      joinDate: formData.joinDate,
      employmentStatus: 'KONTRAK',
      baseSalary: formData.baseSalary,
      dailyMealAllowance: formData.dailyMealAllowance,
      dailyTransportAllowance: formData.dailyTransportAllowance,
      bankName: formData.bankName,
      bankAccountNumber: formData.bankAccountNumber,
      status: 'AKTIF',
      password: formData.password || 'lashira123',
    });

    setShowAddModal(false);
  };

  const filteredEmployees = employees.filter((emp) => {
    return (
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.phone.includes(searchTerm)
    );
  });

  // Initials generator
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const avatarColors = [
    'bg-[#FCE7E7] text-[#991B1B]',
    'bg-orange-100 text-orange-800',
    'bg-amber-100 text-amber-800',
    'bg-rose-100 text-rose-800',
  ];

  return (
    <div className="space-y-5">
      {/* Top Title & + Tambah Karyawan Button (matching Screenshot 5) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-stone-900 tracking-tight">
            {t.hr.title}
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            {t.hr.subtitle}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="self-start sm:self-auto px-4 py-2 bg-[#991B1B] hover:bg-[#881337] active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t.hr.addEmployee}</span>
        </button>
      </div>

      {/* 4 Stat Cards Row (matching Screenshot 5) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {/* Card 1: Total Karyawan */}
        <div className="bg-white p-4 rounded-2xl border border-[#F0E6E5] shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-stone-500 uppercase tracking-wider block">
              {t.hr.totalEmployees}
            </span>
            <div className="text-2xl font-black text-stone-900 mt-1">
              {employees.length || 24}
            </div>
            <div className="text-[11px] text-stone-500 font-medium mt-0.5">
              {t.hr.activeAndLeave}
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-[#FAF2F0] text-[#991B1B] flex items-center justify-center font-bold">
            <Users className="w-4 h-4" />
          </div>
        </div>

        {/* Card 2: Hadir Hari Ini */}
        <div className="bg-white p-4 rounded-2xl border border-[#F0E6E5] shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-stone-500 uppercase tracking-wider block">
              {t.hr.presentToday}
            </span>
            <div className="text-2xl font-black text-stone-900 mt-1">
              21 <span className="text-xs font-normal text-stone-400">/ 24</span>
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
              {t.hr.attendanceRate}
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        {/* Card 3: Terlambat */}
        <div className="bg-white p-4 rounded-2xl border border-[#F0E6E5] shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-stone-500 uppercase tracking-wider block">
              {t.hr.late}
            </span>
            <div className="text-2xl font-black text-amber-600 mt-1">2</div>
            <div className="text-[11px] text-amber-700 font-semibold mt-0.5">
              {t.hr.needsReview}
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        {/* Card 4: Estimasi Payroll */}
        <div className="bg-white p-4 rounded-2xl border border-[#F0E6E5] shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-stone-500 uppercase tracking-wider block">
              {t.hr.estimatedPayroll}
            </span>
            <div className="text-xl font-black text-stone-900 mt-1">Rp 45.2M</div>
            <div className="text-[11px] text-stone-400 font-medium mt-0.5">
              {t.hr.thisMonth}
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-[#FAF2F0] text-[#991B1B] flex items-center justify-center font-bold">
            <Wallet className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Two-Column Layout: Table (Left 7 cols) + Right Attendance Panel (5 cols) (matching Screenshot 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Tabs & Employees Table (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#F0E6E5] overflow-hidden shadow-2xs">
          {/* Sub Navigation Tabs [Daftar Karyawan] [Riwayat Absensi] */}
          <div className="flex border-b border-[#F0E6E5] px-4 pt-2">
            <button
              onClick={() => setActiveTabSub('employees')}
              className={`py-2.5 px-4 text-xs font-bold transition border-b-2 ${
                activeTabSub === 'employees'
                  ? 'border-[#991B1B] text-[#991B1B]'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              {t.hr.employeeListTab}
            </button>
            <button
              onClick={() => setActiveTabSub('attendance')}
              className={`py-2.5 px-4 text-xs font-bold transition border-b-2 ${
                activeTabSub === 'attendance'
                  ? 'border-[#991B1B] text-[#991B1B]'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              {t.hr.attendanceHistoryTab}
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="p-3 border-b border-[#F0E6E5] flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t.hr.searchEmployee}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-[#FAF7F5] border border-[#F0E6E5] rounded-xl text-xs outline-none focus:bg-white focus:border-[#991B1B] transition font-medium"
              />
            </div>
            <button className="p-2 border border-[#F0E6E5] rounded-xl text-stone-500 hover:bg-stone-50">
              <Filter className="w-4 h-4" />
            </button>
          </div>

          {activeTabSub === 'employees' ? (
            /* Table of Employees */
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F5] border-b border-[#F0E6E5] text-stone-500 uppercase tracking-wider text-[10px] font-extrabold">
                  <tr>
                    <th className="py-3 px-4">{t.hr.employeeName}</th>
                    <th className="py-3 px-4">{t.hr.position}</th>
                    <th className="py-3 px-4">{t.distribution.status}</th>
                    <th className="py-3 px-4 text-right">{t.hr.action}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0E6E5]">
                  {filteredEmployees.map((emp, idx) => {
                    const initials = getInitials(emp.name);
                    const colorClass = avatarColors[idx % avatarColors.length];

                    return (
                      <tr key={emp.id} className="hover:bg-[#FAF7F5] transition">
                        {/* Name with circular avatar initials */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${colorClass}`}
                            >
                              {initials}
                            </div>
                            <div className="min-w-0">
                              <span className="font-bold text-stone-900 truncate block">
                                {emp.name}
                              </span>
                              {emp.bankAccountNumber && (
                                <span className="text-[10px] text-stone-500 font-mono flex items-center gap-1">
                                  <CreditCard className="w-2.5 h-2.5 text-[#991B1B]" />
                                  <span>{emp.bankName || 'BCA'} {emp.bankAccountNumber}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Position */}
                        <td className="py-3 px-4 text-stone-600">
                          {emp.position.split('&')[0]}
                        </td>

                        {/* Status badge */}
                        <td className="py-3 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              emp.status === 'AKTIF'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {emp.status === 'AKTIF' ? t.hr.activeStatus : t.hr.leaveStatus}
                          </span>
                        </td>

                        {/* Action edit icon */}
                        <td className="py-3 px-4 text-right">
                          <button className="p-1 text-[#991B1B] hover:bg-[#FAF2F0] rounded-lg transition">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            /* Attendance History Subtab */
            <div className="p-4 space-y-2">
              {attendances.slice(0, 5).map((att) => (
                <div
                  key={att.id}
                  className="flex items-center justify-between p-2.5 bg-[#FAF7F5] rounded-xl text-xs"
                >
                  <div>
                    <span className="font-bold text-stone-900 block truncate">
                      {att.employeeName}
                    </span>
                    <span className="text-[10px] text-stone-400">
                      {att.date} • {att.clockInTime}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                    {att.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Footer */}
          <div className="p-3 bg-[#FAF7F5] border-t border-[#F0E6E5] text-[11px] text-stone-500 flex items-center justify-between">
            <span>
              {t.inventory.showing} 1-{Math.min(4, filteredEmployees.length)} {t.inventory.of} 24
            </span>
            <div className="flex gap-1.5">
              <button className="px-2.5 py-1 bg-white border border-[#F0E6E5] rounded-lg text-stone-700 font-medium hover:bg-stone-50">
                &lt; Prev
              </button>
              <button className="px-2.5 py-1 bg-white border border-[#F0E6E5] rounded-lg text-stone-700 font-medium hover:bg-stone-50">
                Next &gt;
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Absensi Hari Ini Panel (5 cols, matching Screenshot 5) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#F0E6E5] p-5 shadow-xs space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#F0E6E5] pb-3">
            <h3 className="font-extrabold text-sm text-stone-900">
              {t.hr.todayAttendance}
            </h3>
            <Calendar className="w-4 h-4 text-stone-400" />
          </div>

          {/* Clock In Live List */}
          <div className="space-y-3.5">
            {/* Employee 1 */}
            <div className="flex items-start gap-2.5 text-xs">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900">
                    Budi Santoso <span className="text-stone-400 font-normal">(Produksi)</span>
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[11px] text-stone-500">
                    {t.hr.clockInAt} 07:45
                  </span>
                  <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[9px] font-bold rounded">
                    {t.hr.onTime}
                  </span>
                </div>
              </div>
            </div>

            {/* Employee 2 */}
            <div className="flex items-start gap-2.5 text-xs">
              <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900">
                    Siti Aminah <span className="text-stone-400 font-normal">(Kasir)</span>
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[11px] text-stone-500">
                    {t.hr.clockInAt} 08:15
                  </span>
                  <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 text-[9px] font-bold rounded">
                    {t.hr.lateBadge} 15m
                  </span>
                </div>
              </div>
            </div>

            {/* Employee 3 */}
            <div className="flex items-start gap-2.5 text-xs">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900">
                    Ahmad Santoso <span className="text-stone-400 font-normal">(Produksi)</span>
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[11px] text-stone-500">
                    {t.hr.clockInAt} 07:50
                  </span>
                  <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[9px] font-bold rounded">
                    {t.hr.onTime}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Button: Rekap Bulanan (matching Screenshot 5) */}
          <div className="pt-2">
            <button
              onClick={() => setActiveTab('payroll')}
              className="w-full py-2.5 border border-[#991B1B] text-[#991B1B] hover:bg-[#FAF2F0] text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition active:scale-[0.98]"
            >
              <FileText className="w-4 h-4" />
              <span>{t.hr.monthlyRecap}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-extrabold text-base text-stone-900">
                {t.hr.addEmployee}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Nama Lengkap Karyawan</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Jabatan</label>
                  <select
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                  >
                    <option value="Operator Goreng & Bumbu">Produksi & Goreng</option>
                    <option value="Kasir & Pelayanan">Kasir</option>
                    <option value="Driver Logistik">Kurir & Logistik</option>
                    <option value="Admin Gudang">Admin Gudang</option>
                    <option value="HR & Keuangan">HR & Keuangan</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Penempatan Cabang</label>
                  <select
                    value={formData.branchId}
                    onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                  >
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Nomor Handphone / WhatsApp</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Gaji Pokok Bulanan (Rp)</label>
                  <input
                    type="number"
                    value={formData.baseSalary}
                    onChange={(e) =>
                      setFormData({ ...formData, baseSalary: Number(e.target.value) || 0 })
                    }
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-900"
                  />
                </div>
              </div>

              {/* Data Rekening Bank & E-Wallet untuk Transfer Gaji (Payroll) */}
              <div className="p-3 bg-[#FAF7F5] border border-[#F0E6E5] rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="block font-bold text-stone-800 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-[#991B1B]" />
                    <span>Rekening Bank / E-Wallet Transfer Gaji</span>
                  </span>
                  <span className="text-[10px] font-bold text-[#991B1B] bg-[#FAF2F0] px-2 py-0.5 rounded">
                    Bank & E-Wallet
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1">
                    <label className="block text-[11px] font-bold text-stone-600 mb-1">Metode / Provider</label>
                    <select
                      value={formData.bankName}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs font-bold text-stone-900"
                    >
                      <optgroup label="🏦 Bank Konvensional">
                        <option value="BCA">BCA</option>
                        <option value="Mandiri">Mandiri</option>
                        <option value="BRI">BRI</option>
                        <option value="BNI">BNI</option>
                        <option value="BSI">BSI</option>
                        <option value="CIMB">CIMB Niaga</option>
                      </optgroup>
                      <optgroup label="📱 Dompet Digital (E-Wallet)">
                        <option value="GoPay">GoPay</option>
                        <option value="DANA">DANA</option>
                        <option value="OVO">OVO</option>
                        <option value="ShopeePay">ShopeePay</option>
                        <option value="LinkAja">LinkAja</option>
                      </optgroup>
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-[11px] font-bold text-stone-600 mb-1">
                      {['GoPay', 'DANA', 'OVO', 'ShopeePay', 'LinkAja'].includes(formData.bankName)
                        ? 'Nomor HP E-Wallet'
                        : 'Nomor Rekening (No. Rek)'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.bankAccountNumber}
                      onChange={(e) => setFormData({ ...formData, bankAccountNumber: e.target.value })}
                      placeholder={
                        ['GoPay', 'DANA', 'OVO', 'ShopeePay', 'LinkAja'].includes(formData.bankName)
                          ? 'Contoh: 081234567890'
                          : 'Contoh: 8899231001'
                      }
                      className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs font-mono font-bold text-stone-900"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-stone-500">
                  💳 Mendukung transfer via Rekening Bank (BCA, Mandiri, BRI, BNI, dll) maupun E-Wallet (GoPay, DANA, OVO, ShopeePay).
                </p>
              </div>

              {/* Password Login Karyawan */}
              <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-stone-800">
                    Kata Sandi (Password) Login Karyawan
                  </label>
                  <span className="text-[10px] font-bold text-[#991B1B] bg-[#FAF2F0] px-2 py-0.5 rounded">
                    Untuk Portal Presensi
                  </span>
                </div>
                <input
                  type="text"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="lashira123"
                  className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs font-mono font-bold text-stone-900"
                />
                <p className="text-[10px] text-stone-500">
                  💡 Karyawan dapat langsung login ke portal presensi mandiri dengan memasukkan <strong>Nama Lengkap</strong> dan kata sandi ini.
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-stone-200 text-stone-600 rounded-xl font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#991B1B] hover:bg-[#881337] text-white rounded-xl font-bold"
                >
                  Simpan Karyawan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
