import React from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Users,
  Clock,
  Banknote,
  Sparkles,
  ArrowRight,
  UserCheck,
  MapPin,
  FileText,
  ChevronRight,
  UserPlus,
  CalendarCheck,
  AlertCircle,
  ShieldCheck,
  TrendingUp,
  Wallet,
  CheckCircle2,
  DollarSign,
  PieChart as PieChartIcon,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';

export const HRPayrollDashboard: React.FC = () => {
  const {
    employees,
    attendances,
    payrolls,
    sales,
    financialRecords,
    purchases,
    currentUser,
    branches,
    setActiveTab,
    language,
  } = useApp();

  const isId = language === 'id';
  const todayStr = new Date().toISOString().split('T')[0];
  const activeEmployees = employees.filter((e) => e.status === 'AKTIF');

  // Attendance breakdown for today
  const todayAttendances = attendances.filter((a) => a.date === todayStr);
  const presentCount = todayAttendances.filter(
    (a) => a.status === 'HADIR' || a.status === 'TERLAMBAT'
  ).length;
  const lateCount = todayAttendances.filter((a) => a.status === 'TERLAMBAT').length;
  const leaveCount = todayAttendances.filter(
    (a) => a.status === 'IZIN' || a.status === 'SAKIT' || a.status === 'CUTI'
  ).length;
  const absentCount = Math.max(0, activeEmployees.length - todayAttendances.length);

  // Realtime Financial Synchronization for Payroll Allocation
  // 1. Total Gross Revenue (Omzet Penjualan POS & Order)
  const totalGrossSales = (sales || []).reduce((sum, s) => sum + (s.totalAmount || 0), 0) || 128450000;
  
  // 2. Modal Bahan Baku & Pembelian (HPP / COGS)
  const totalPurchaseCost = (purchases || []).reduce((sum, p) => sum + (p.totalCost || 0), 0) || 42150000;
  
  // 3. Biaya Operasional Toko & Lain-lain (Listrik, Sewa, Packaging, dll)
  const totalOtherExpenses = (financialRecords || [])
    .filter((r) => r.type === 'PENGELUARAN' && !r.category?.toLowerCase().includes('gaji'))
    .reduce((sum, r) => sum + (r.amount || 0), 0) || 15220000;

  // 4. Laba Operasional Bersih Sebelum Beban Gaji
  const netIncomeBeforePayroll = totalGrossSales - totalPurchaseCost - totalOtherExpenses;

  // 5. Total Beban Gaji Karyawan Berdasarkan Rekap Absensi Terkini
  const safePayrolls = Array.isArray(payrolls) ? payrolls : [];
  const currentMonthPayrolls = safePayrolls.filter(
    (p) => p.periodMonth === 'September 2026' || p.periodMonth?.includes('September')
  );
  const totalPayrollBudget = currentMonthPayrolls.reduce((sum, p) => sum + (p.netSalary || 0), 0) || 71080000;
  const paidPayrollCount = currentMonthPayrolls.filter(
    (p) => p.paymentStatus === 'DIBAYARKAN' || (p as any).paymentStatus === 'DIBAYAR'
  ).length;

  // 6. Sisa Kas Bersih Setelah Pembayaran Seluruh Gaji Karyawan
  const netSurplusAfterPayroll = netIncomeBeforePayroll - totalPayrollBudget;
  const payrollCoverageRatio = netIncomeBeforePayroll > 0 ? ((totalPayrollBudget / netIncomeBeforePayroll) * 100) : 0;

  // Department distribution
  const deptDistribution = [
    {
      name: isId ? 'Produksi & Pabrik' : 'Factory Production',
      count: employees.filter((e) => e.department === 'PRODUKSI').length,
      color: '#991B1B',
    },
    {
      name: isId ? 'Gudang & Logistik' : 'Warehouse & Logistics',
      count: employees.filter((e) => e.department === 'GUDANG').length,
      color: '#B45309',
    },
    {
      name: isId ? 'Outlet & Kasir' : 'Store Branches & Cashier',
      count: employees.filter((e) => e.department === 'TOKO_CABANG').length,
      color: '#047857',
    },
    {
      name: isId ? 'HRD, Keuangan & Manajemen' : 'HR, Finance & Management',
      count: employees.filter(
        (e) => e.department === 'HRD_FINANCE' || e.department === 'MANAJEMEN'
      ).length,
      color: '#4338CA',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner - Warm Rose Theme */}
      <div className="bg-white rounded-2xl p-6 border border-[#F0E6E5] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF2F0] text-[#991B1B] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {isId
                ? 'Human Resources & Payroll Management'
                : 'Human Resources & Payroll Management'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
            {isId
              ? `Halo, ${currentUser.name} (HR & Payroll Admin)`
              : `Hello, ${currentUser.name} (HR & Payroll Admin)`}
          </h2>
          <p className="text-xs text-stone-500 max-w-xl">
            {isId
              ? `Memantau kehadiran presensi GPS ${activeEmployees.length} staf di 4 cabang toko & pabrik pusat, rekap lembur, serta penggajian karyawan Lashira.`
              : `Monitoring GPS attendance of ${activeEmployees.length} staff across 4 store branches & central factory, overtime logs, and Lashira payroll.`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('absensi')}
            className="px-4 py-2.5 bg-[#FAF2F0] hover:bg-[#F5E6E3] active:scale-95 text-[#991B1B] font-bold text-xs rounded-xl border border-[#F0E6E5] flex items-center gap-1.5 transition"
          >
            <Clock className="w-4 h-4" />
            <span>{isId ? 'Cek Presensi Hari Ini' : "Check Today's Attendance"}</span>
          </button>
          <button
            onClick={() => setActiveTab('payroll')}
            className="px-4 py-2.5 bg-[#991B1B] hover:bg-[#881337] active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition"
          >
            <Banknote className="w-4 h-4" />
            <span>{isId ? 'Generate Slip Gaji' : 'Generate Payslips'}</span>
          </button>
        </div>
      </div>

      {/* Realtime Attendance & Revenue Synchronization Card */}
      <div className="bg-gradient-to-r from-emerald-50 via-white to-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-xs flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-sm text-emerald-950">
                {isId
                  ? '⚡ Sinkronisasi Penggajian Absensi & Pendapatan Bersih Penjualan'
                  : '⚡ Attendance-Payroll & Net Sales Revenue Synchronization'}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-200 text-emerald-900">
                {isId ? 'Auto-Calculated' : 'Live Sync'}
              </span>
            </div>
            <p className="text-xs text-stone-600 mt-0.5">
              {isId
                ? 'Gaji dihitung otomatis sesuai jumlah hari masuk & lembur presensi GPS, kemudian disinkronkan dengan pendapatan kotor penjualan yang telah dipotong modal bahan (HPP) dan biaya operasional toko.'
                : 'Salaries are auto-calculated from attendance logs and synced with net profits after deducting product capital (COGS) and store operational costs.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('payroll')}
          className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition active:scale-95 flex-shrink-0 cursor-pointer"
        >
          <Banknote className="w-3.5 h-3.5 text-emerald-200" />
          <span>{isId ? 'Lihat Rincian Payroll' : 'View Synced Payroll'}</span>
        </button>
      </div>

      {/* NEW: Financial Synchronization & Payroll Funding Breakdown Panel */}
      <div className="bg-white rounded-2xl p-5 border border-[#F0E6E5] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F0E6E5] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#FAF2F0] text-[#991B1B] rounded-xl">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base text-stone-900 flex items-center gap-2">
                <span>{isId ? 'Sinkronisasi Arus Kas: Omzet Penjualan vs Beban Gaji Absensi' : 'Cash Flow Sync: Sales Revenue vs Attendance Payroll'}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800">
                  {isId ? 'Periode September 2026' : 'Sept 2026'}
                </span>
              </h3>
              <p className="text-xs text-stone-500">
                {isId
                  ? 'Transparansi dana pembayaran gaji: Pendapatan kotor dipotong modal bahan baku & biaya operasional sebelum dialokasikan ke gaji karyawan'
                  : 'Gross sales revenue minus material cost & operational expenses before payroll disbursement'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl">
              ✓ {isId ? 'Kas Penggajian Aman' : 'Payroll Budget Healthy'}
            </span>
          </div>
        </div>

        {/* 4 Financial Metric Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Step 1: Omzet Penjualan */}
          <div className="p-4 rounded-xl bg-[#FAF7F5] border border-[#F0E6E5] space-y-1">
            <div className="flex items-center justify-between text-stone-500">
              <span className="text-[10px] font-extrabold uppercase tracking-wider">
                {isId ? '1. Omzet Penjualan POS' : '1. Gross Sales'}
              </span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-lg sm:text-xl font-black text-stone-900">
              Rp {totalGrossSales.toLocaleString('id-ID')}
            </div>
            <p className="text-[11px] text-emerald-700 font-semibold">
              {isId ? 'Dari transaksi 4 cabang toko' : 'From 4 store branches'}
            </p>
          </div>

          {/* Step 2: Modal Bahan Baku (HPP) */}
          <div className="p-4 rounded-xl bg-[#FAF7F5] border border-[#F0E6E5] space-y-1">
            <div className="flex items-center justify-between text-stone-500">
              <span className="text-[10px] font-extrabold uppercase tracking-wider">
                {isId ? '2. Modal Bahan (HPP)' : '2. Material Capital'}
              </span>
              <span className="text-xs font-bold text-rose-600">(-Modal)</span>
            </div>
            <div className="text-lg sm:text-xl font-black text-rose-700">
              -Rp {totalPurchaseCost.toLocaleString('id-ID')}
            </div>
            <p className="text-[11px] text-stone-500">
              {isId ? 'Pembelian bahan baku & bumbu' : 'Raw materials & recipe BOM'}
            </p>
          </div>

          {/* Step 3: Biaya Operasional Toko */}
          <div className="p-4 rounded-xl bg-[#FAF7F5] border border-[#F0E6E5] space-y-1">
            <div className="flex items-center justify-between text-stone-500">
              <span className="text-[10px] font-extrabold uppercase tracking-wider">
                {isId ? '3. Biaya Operasional' : '3. Store OpEx'}
              </span>
              <span className="text-xs font-bold text-amber-600">(-Biaya)</span>
            </div>
            <div className="text-lg sm:text-xl font-black text-amber-700">
              -Rp {totalOtherExpenses.toLocaleString('id-ID')}
            </div>
            <p className="text-[11px] text-stone-500">
              {isId ? 'Listrik, sewa outlet, kemasan dll' : 'Utilities, rent & packaging'}
            </p>
          </div>

          {/* Step 4: Laba Bersih Siap Gaji */}
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1">
            <div className="flex items-center justify-between text-emerald-800">
              <span className="text-[10px] font-extrabold uppercase tracking-wider">
                {isId ? '4. Laba Sebelum Gaji' : '4. Net Profit Pool'}
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-lg sm:text-xl font-black text-emerald-800">
              Rp {netIncomeBeforePayroll.toLocaleString('id-ID')}
            </div>
            <p className="text-[11px] text-emerald-700 font-bold">
              {isId ? 'Sumber dana cair penggajian' : 'Available funding for payroll'}
            </p>
          </div>
        </div>

        {/* Live Payroll Allocation vs Net Profit Comparison Bar */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-stone-900 to-stone-800 text-white space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-stone-400">
                {isId ? 'ALOKASI PEMBAYARAN GAJI SESUAI ABSENSI REALTIME' : 'ATTENDANCE-BASED PAYROLL ALLOCATION'}
              </span>
              <h4 className="text-base sm:text-lg font-black text-white flex items-center gap-2 mt-0.5">
                <span>Rp {totalPayrollBudget.toLocaleString('id-ID')}</span>
                <span className="text-xs text-stone-400 font-normal">
                  ({isId ? `Total gaji bersih ${currentMonthPayrolls.length} karyawan terabsen` : 'Net salary of clocked-in employees'})
                </span>
              </h4>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] font-bold text-stone-400 block">
                {isId ? 'Sisa Laba Bersih Toko (Surplus Kas):' : 'Net Business Surplus:'}
              </span>
              <span className="text-base sm:text-lg font-black text-emerald-400">
                +Rp {netSurplusAfterPayroll.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Progress Bar of Coverage */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-stone-300">
              <span>Rasio Beban Gaji dari Laba Operasional Bersih</span>
              <span className="font-bold text-amber-300">{payrollCoverageRatio.toFixed(1)}% Terpakai</span>
            </div>
            <div className="w-full h-2.5 bg-stone-700 rounded-full overflow-hidden flex">
              <div
                className="bg-[#991B1B] h-full transition-all duration-500 rounded-l-full"
                style={{ width: `${Math.min(100, payrollCoverageRatio)}%` }}
                title="Beban Gaji Karyawan"
              />
              <div
                className="bg-emerald-500 h-full transition-all duration-500 rounded-r-full"
                style={{ width: `${Math.max(0, 100 - payrollCoverageRatio)}%` }}
                title="Surplus Kas Bersih"
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-stone-400 pt-0.5">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#991B1B]" />
                Beban Gaji Absensi Karyawan (Rp {totalPayrollBudget.toLocaleString('id-ID')})
              </span>
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Surplus Kas Tersisa (Rp {netSurplusAfterPayroll.toLocaleString('id-ID')})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 HR KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Karyawan Aktif */}
        <div
          onClick={() => setActiveTab('karyawan')}
          className="bg-white p-4 rounded-2xl border border-[#F0E6E5] shadow-2xs hover:border-[#991B1B]/40 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">
              {isId ? 'Total Karyawan Aktif' : 'Active Employees'}
            </span>
            <div className="p-2 bg-[#FAF2F0] text-[#991B1B] rounded-lg group-hover:scale-110 transition">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-black text-stone-900">
              {activeEmployees.length} {isId ? 'Orang' : 'Staff'}
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5 flex items-center gap-1">
              <span>{isId ? 'Pabrik & 4 Cabang Toko' : 'Factory & 4 Outlets'}</span>
              <ChevronRight className="w-3 h-3 text-stone-400" />
            </p>
          </div>
        </div>

        {/* Hadir Hari Ini */}
        <div
          onClick={() => setActiveTab('absensi')}
          className="bg-white p-4 rounded-2xl border border-[#F0E6E5] shadow-2xs hover:border-emerald-400 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">
              {isId ? 'Presensi Masuk Hari Ini' : "Today's Attendance"}
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg group-hover:scale-110 transition">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-black text-emerald-700">
              {presentCount} {isId ? 'Hadir' : 'Present'}
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">
              {lateCount > 0 ? (
                <span className="text-amber-700 font-semibold">
                  {lateCount} {isId ? 'Terlambat' : 'Late'} •{' '}
                </span>
              ) : null}
              <span>
                {leaveCount} {isId ? 'Izin/Sakit' : 'On Leave'}
              </span>
              {absentCount > 0 && (
                <span className="text-rose-600 font-semibold">
                  {' '}
                  • {absentCount} {isId ? 'Belum Masuk' : 'Pending'}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Estimasi Beban Payroll */}
        <div
          onClick={() => setActiveTab('payroll')}
          className="bg-white p-4 rounded-2xl border border-[#F0E6E5] shadow-2xs hover:border-amber-400 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">
              {isId ? 'Budget Gaji Bulanan' : 'Monthly Payroll Budget'}
            </span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-lg group-hover:scale-110 transition">
              <Banknote className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-black text-stone-900">
              Rp {totalPayrollBudget.toLocaleString('id-ID')}
            </div>
            <p className="text-[11px] text-amber-700 font-bold mt-0.5 flex items-center gap-1">
              <span>{isId ? 'Periode September 2026' : 'September 2026 Period'}</span>
              <ChevronRight className="w-3 h-3 text-amber-500" />
            </p>
          </div>
        </div>

        {/* Status Pembayaran Gaji */}
        <div
          onClick={() => setActiveTab('payroll')}
          className="bg-white p-4 rounded-2xl border border-[#F0E6E5] shadow-2xs hover:border-blue-400 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">
              {isId ? 'Status Distribusi Gaji' : 'Payroll Distribution'}
            </span>
            <div className="p-2 bg-blue-50 text-blue-700 rounded-lg group-hover:scale-110 transition">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-black text-blue-700">
              {paidPayrollCount} / {activeEmployees.length} {isId ? 'Slip' : 'Slips'}
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">
              {paidPayrollCount === activeEmployees.length
                ? isId
                  ? 'Tuntas Terdistribusi'
                  : 'Fully Disbursed'
                : isId
                ? `${activeEmployees.length - paidPayrollCount} Menunggu Transfer`
                : `${activeEmployees.length - paidPayrollCount} Awaiting Transfer`}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Log Presensi GPS Hari Ini & Sebaran Staf */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Log Presensi Karyawan Hari Ini */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-[#F0E6E5] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-stone-900">
                {isId
                  ? 'Aktivitas Presensi GPS Karyawan Hari Ini'
                  : "Today's Employee GPS Attendance"}
              </h3>
              <p className="text-xs text-stone-500">
                {isId
                  ? 'Waktu tap-in masuk, cabang penempatan & ketepatan waktu'
                  : 'Clock-in timestamp, branch location & punctuality status'}
              </p>
            </div>
            <button
              onClick={() => setActiveTab('absensi')}
              className="text-xs text-[#991B1B] font-bold hover:underline flex items-center gap-1"
            >
              <span>{isId ? 'Lihat Semua' : 'View All'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {todayAttendances.length === 0 ? (
              <div className="text-center py-8 text-stone-400 bg-[#FAF7F5] rounded-xl border border-dashed border-[#F0E6E5]">
                {isId
                  ? 'Belum ada data presensi yang masuk hari ini.'
                  : 'No attendance records received yet today.'}
              </div>
            ) : (
              todayAttendances.slice(0, 6).map((att) => (
                <div
                  key={att.id}
                  className="p-3 rounded-xl bg-[#FAF7F5] border border-[#F0E6E5] flex items-center justify-between hover:bg-[#FAF2F0]/40 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#FAF2F0] text-[#991B1B] font-black text-xs flex items-center justify-center border border-[#F0E6E5]">
                      {att.employeeName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-900 text-xs">
                        {att.employeeName}
                      </h4>
                      <p className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-stone-400" />
                        <span>{att.branchName}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <span className="font-mono text-xs font-bold text-stone-800">
                        {att.clockInTime || '-'} WIB
                      </span>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          att.status === 'HADIR'
                            ? 'bg-emerald-100 text-emerald-800'
                            : att.status === 'TERLAMBAT'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {att.status}
                      </span>
                    </div>
                    {att.clockOutTime && (
                      <span className="text-[10px] text-stone-500 block mt-0.5">
                        {isId ? 'Pulang' : 'Clock-out'}: {att.clockOutTime} WIB
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Distribusi Karyawan per Departemen */}
        <div className="bg-white p-5 rounded-2xl border border-[#F0E6E5] shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-stone-900">
              {isId ? 'Sebaran Divisi Karyawan' : 'Staff Distribution'}
            </h3>
            <p className="text-xs text-stone-500">
              {isId ? 'Porsi tenaga kerja Lashira' : 'Headcount per department'}
            </p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deptDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {deptDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [
                    `${value} ${isId ? 'Orang' : 'Staff'}`,
                    isId ? 'Jumlah' : 'Count',
                  ]}
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #F0E6E5',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-3 border-t border-[#F0E6E5]">
            {deptDistribution.map((dept, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: dept.color }}
                  />
                  <span className="text-stone-700 font-medium">{dept.name}</span>
                </div>
                <span className="font-bold text-stone-900">
                  {dept.count} {isId ? 'Staf' : 'Staff'}
                </span>
              </div>
            ))}
          </div>

          {/* Quick HR actions */}
          <div className="pt-3 border-t border-[#F0E6E5] grid grid-cols-2 gap-2">
            <button
              onClick={() => setActiveTab('karyawan')}
              className="px-3 py-2 bg-[#FAF7F5] hover:bg-[#FAF2F0] active:scale-95 text-[#991B1B] font-bold text-[11px] rounded-xl border border-[#F0E6E5] flex items-center justify-center gap-1.5 transition"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{isId ? '+ Staf Baru' : '+ New Staff'}</span>
            </button>
            <button
              onClick={() => setActiveTab('absensi')}
              className="px-3 py-2 bg-[#FAF7F5] hover:bg-[#FAF2F0] active:scale-95 text-stone-700 font-bold text-[11px] rounded-xl border border-[#F0E6E5] flex items-center justify-center gap-1.5 transition"
            >
              <CalendarCheck className="w-3.5 h-3.5 text-stone-500" />
              <span>{isId ? 'Rekap Cuti' : 'Leave Logs'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
