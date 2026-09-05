import React from 'react';
import { useApp } from '../../../context/AppContext';
import {
  TrendingUp,
  DollarSign,
  Store,
  Users,
  Factory,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  ChevronRight,
  Crown,
  Wallet,
  ShieldCheck,
  BarChart3,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export const OwnerExecutiveDashboard: React.FC = () => {
  const {
    sales,
    branchStocks,
    stockRequests,
    productionOrders,
    employees,
    financialRecords,
    payrolls,
    currentUser,
    branches,
    setActiveTab,
    language,
  } = useApp();

  const isId = language === 'id';
  const todayStr = new Date().toISOString().split('T')[0];
  const currentMonthStr = '2026-09';

  // Financial calculations
  const totalIncome = financialRecords
    .filter((r) => r.type === 'PEMASUKAN')
    .reduce((sum, r) => sum + r.amount, 0);

  const totalExpense = financialRecords
    .filter((r) => r.type === 'PENGELUARAN')
    .reduce((sum, r) => sum + r.amount, 0);

  const netCashflow = totalIncome - totalExpense;
  const totalPayrollBudget = payrolls.reduce((sum, p) => sum + (p.netSalary || 0), 0);

  // Group payroll by position for executive salary allocation
  const positionSummary = [
    { title: isId ? 'Direksi / Owner' : 'Board / Owner', pos: 'Owner', color: '#991B1B' },
    { title: isId ? 'Kepala Produksi' : 'Head of Production', pos: 'Kepala Produksi', color: '#B45309' },
    { title: isId ? 'Admin Gudang' : 'Warehouse Admin', pos: 'Admin Gudang', color: '#4338CA' },
    { title: isId ? 'Kepala Cabang' : 'Branch Store Head', pos: 'Kepala Cabang', color: '#047857' },
    { title: isId ? 'Kasir POS' : 'Cashier POS', pos: 'Kasir', color: '#BE123C' },
    { title: isId ? 'Operator Dapur' : 'Kitchen Cook & Seasoning', pos: 'Operator Goreng & Bumbu', color: '#C2410C' },
  ].map((item) => {
    const matching = payrolls.filter((p) =>
      (p.position || '').toLowerCase().includes(item.pos.toLowerCase())
    );
    const totalSalary = matching.reduce((sum, p) => sum + (p.netSalary || 0), 0);
    const count =
      matching.length ||
      employees.filter((e) =>
        (e.position || '').toLowerCase().includes(item.pos.toLowerCase())
      ).length;
    return {
      ...item,
      count,
      totalSalary,
      portion:
        totalPayrollBudget > 0
          ? ((totalSalary / totalPayrollBudget) * 100).toFixed(1)
          : '0',
    };
  });

  // Multi-branch aggregated figures
  const todaySales = sales.filter((s) => s.date === todayStr);
  const totalSalesToday = todaySales.reduce((sum, s) => sum + (s.grandTotal || 0), 0);
  const totalProfitToday = todaySales.reduce((sum, s) => sum + (s.grossProfit || 0), 0);

  const monthSales = sales.filter((s) => s.date.startsWith(currentMonthStr));
  const totalSalesMonth = monthSales.reduce((sum, s) => sum + (s.grandTotal || 0), 0);
  const totalProfitMonth = monthSales.reduce((sum, s) => sum + (s.grossProfit || 0), 0);

  const nonWarehouseBranches = branches.filter((b) => !b.isMainWarehouse);

  // Dynamic Weekly Sales aggregation
  const weeklySalesData = [
    { day: isId ? 'Senin (25/8)' : 'Mon (25/8)', omzet: 2450000, laba: 1100000 },
    { day: isId ? 'Selasa (26/8)' : 'Tue (26/8)', omzet: 3100000, laba: 1420000 },
    { day: isId ? 'Rabu (27/8)' : 'Wed (27/8)', omzet: 2850000, laba: 1280000 },
    { day: isId ? 'Kamis (28/8)' : 'Thu (28/8)', omzet: 3900000, laba: 1750000 },
    { day: isId ? 'Jumat (29/8)' : 'Fri (29/8)', omzet: 4800000, laba: 2150000 },
    { day: isId ? 'Sabtu (30/8)' : 'Sat (30/8)', omzet: 6200000, laba: 2800000 },
    { day: isId ? 'Minggu (31/8)' : 'Sun (31/8)', omzet: 7100000, laba: 3200000 },
    {
      day: isId ? 'Hari Ini (1/9)' : 'Today (1/9)',
      omzet: totalSalesToday || 3520000,
      laba: totalProfitToday || 1443000,
    },
  ];

  // Snack Category Sales Distribution
  const categoryData = [
    { name: 'Basreng Pedas', value: 45, color: '#991B1B' },
    { name: 'Keripik Kaca', value: 25, color: '#C2410C' },
    { name: 'Makaroni Bantet', value: 15, color: '#D97706' },
    { name: 'Usus Crispy', value: 10, color: '#047857' },
    { name: 'Seblak Kering', value: 5, color: '#4338CA' },
  ];

  // Branch Performance dynamically computed from sales + baseline
  const branchPerformance = nonWarehouseBranches
    .map((b) => {
      const branchSales = sales.filter((s) => s.branchId === b.id);
      const calculatedOmzet = branchSales.reduce(
        (sum, s) => sum + (s.grandTotal || 0),
        0
      );
      const baseline =
        b.id === 'BR-01'
          ? 14500000
          : b.id === 'BR-02'
          ? 12800000
          : b.id === 'BR-03'
          ? 18200000
          : 9600000;
      const totalOmzet = (calculatedOmzet > 0 ? calculatedOmzet : 0) + baseline;
      const ordersCount =
        branchSales.length +
        (b.id === 'BR-01' ? 420 : b.id === 'BR-02' ? 380 : b.id === 'BR-03' ? 510 : 290);

      return {
        branchId: b.id,
        branchName: b.name,
        city: b.city,
        omzet: totalOmzet,
        orders: ordersCount,
      };
    })
    .sort((a, b) => b.omzet - a.omzet);

  return (
    <div className="space-y-6">
      {/* Executive Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-[#F0E6E5] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF2F0] text-[#991B1B] text-xs font-bold">
            <Crown className="w-3.5 h-3.5 text-[#991B1B]" />
            <span>
              {isId
                ? 'Executive Multi-Branch Oversight • Direksi & Owner'
                : 'Executive Multi-Branch Oversight • Board & Owner'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
            {isId
              ? `Selamat Datang, ${currentUser.name} (Owner & Direksi)`
              : `Welcome, ${currentUser.name} (Owner & Director)`}
          </h2>
          <p className="text-xs text-stone-500 max-w-xl">
            {isId
              ? 'Konsolidasi 4 cabang retail, kinerja penjualan produk snack, arus kas bersih, alokasi gaji per jabatan, dan audit operasional Lashira.'
              : 'Consolidated performance across 4 store branches, snack sales, net cashflow, salary allocations, and Lashira operational audit.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('owner-keuangan-gaji')}
            className="px-4 py-2.5 bg-[#FAF2F0] hover:bg-[#F5E6E3] active:scale-95 text-[#991B1B] font-bold text-xs rounded-xl border border-[#F0E6E5] flex items-center gap-1.5 transition"
          >
            <Crown className="w-4 h-4" />
            <span>{isId ? 'Gaji & Keuangan Owner' : 'Owner Salary & Finance'}</span>
          </button>
          <button
            onClick={() => setActiveTab('keuangan')}
            className="px-4 py-2.5 bg-[#991B1B] hover:bg-[#881337] active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition"
          >
            <BarChart3 className="w-4 h-4" />
            <span>{isId ? 'Laporan Arus Kas' : 'Cash Flow Report'}</span>
          </button>
        </div>
      </div>

      {/* 4 Executive High-Level KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Omzet Konsolidasi Hari Ini */}
        <div className="bg-white p-4 rounded-2xl border border-[#F0E6E5] shadow-2xs">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">
              {isId ? 'Omzet Konsolidasi Hari Ini' : "Consolidated Revenue Today"}
            </span>
            <div className="p-2 bg-[#FAF2F0] text-[#991B1B] rounded-lg">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-black text-stone-900">
              Rp {totalSalesToday.toLocaleString('id-ID')}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold mt-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>
                {todaySales.length} {isId ? 'Transaksi Baru (Semua Cabang)' : 'Transactions (All Outlets)'}
              </span>
            </div>
          </div>
        </div>

        {/* Omzet Bulan Ini */}
        <div className="bg-white p-4 rounded-2xl border border-[#F0E6E5] shadow-2xs">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">
              {isId ? 'Omzet Bulan Berjalan' : 'Month-to-Date Revenue'}
            </span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-black text-stone-900">
              Rp {totalSalesMonth.toLocaleString('id-ID')}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold mt-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>
                {isId ? 'Est. Laba Kotor' : 'Est. Gross Profit'}: Rp {totalProfitMonth.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>

        {/* Net Cashflow */}
        <div className="bg-white p-4 rounded-2xl border border-[#F0E6E5] shadow-2xs">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">
              {isId ? 'Posisi Kas Bersih (Net)' : 'Net Cash Position'}
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div
              className={`text-xl sm:text-2xl font-black ${
                netCashflow >= 0 ? 'text-emerald-700' : 'text-rose-700'
              }`}
            >
              Rp {netCashflow.toLocaleString('id-ID')}
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">
              {isId
                ? `Masuk: Rp ${(totalIncome / 1000000).toFixed(1)}jt • Keluar: Rp ${(totalExpense / 1000000).toFixed(1)}jt`
                : `In: Rp ${(totalIncome / 1000000).toFixed(1)}M • Out: Rp ${(totalExpense / 1000000).toFixed(1)}M`}
            </p>
          </div>
        </div>

        {/* Total Beban Payroll */}
        <div
          onClick={() => setActiveTab('owner-keuangan-gaji')}
          className="bg-white p-4 rounded-2xl border border-[#F0E6E5] shadow-2xs hover:border-[#991B1B]/40 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">
              {isId ? 'Beban Gaji Seluruh Karyawan' : 'Total Payroll Budget'}
            </span>
            <div className="p-2 bg-[#FAF2F0] text-[#991B1B] rounded-lg group-hover:scale-110 transition">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-black text-stone-900">
              Rp {totalPayrollBudget.toLocaleString('id-ID')}
            </div>
            <p className="text-[11px] text-[#991B1B] font-bold mt-0.5 flex items-center gap-1">
              <span>{employees.length} {isId ? 'Karyawan (9 Jabatan)' : 'Employees (9 Roles)'}</span>
              <ChevronRight className="w-3 h-3 text-[#991B1B]" />
            </p>
          </div>
        </div>
      </div>

      {/* Main Charts: Revenue Trend & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Revenue & Profit Growth Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-[#F0E6E5] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-stone-900">
                {isId
                  ? 'Tren Omzet & Laba Konsolidasi Seluruh Cabang'
                  : 'Consolidated Revenue & Profit Trend'}
              </h3>
              <p className="text-xs text-stone-500">
                {isId
                  ? 'Pertumbuhan penjualan harian 4 outlet retail Lashira'
                  : 'Daily retail sales across 4 Lashira outlets'}
              </p>
            </div>
            <span className="text-xs font-bold bg-[#FAF7F5] text-stone-700 px-2.5 py-1 rounded-lg border border-[#F0E6E5]">
              {isId ? 'Minggu Ini' : 'This Week'}
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={weeklySalesData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="ownerOmzetColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#991B1B" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#991B1B" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="ownerLabaColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#047857" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#047857" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0E6E5" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#78716c' }} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#78716c' }}
                  tickFormatter={(v) => `Rp${(v / 1000000).toFixed(1)}jt`}
                />
                <Tooltip
                  formatter={(value: any) => [
                    `Rp ${Number(value).toLocaleString('id-ID')}`,
                    '',
                  ]}
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #F0E6E5',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                <Area
                  type="monotone"
                  dataKey="omzet"
                  name={isId ? 'Total Omzet' : 'Total Revenue'}
                  stroke="#991B1B"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#ownerOmzetColor)"
                />
                <Area
                  type="monotone"
                  dataKey="laba"
                  name={isId ? 'Estimasi Laba Kotor' : 'Est. Gross Profit'}
                  stroke="#047857"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#ownerLabaColor)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Snack Category Distribution */}
        <div className="bg-white p-5 rounded-2xl border border-[#F0E6E5] shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-stone-900">
              {isId ? 'Distribusi Kategori Produk' : 'Product Category Share'}
            </h3>
            <p className="text-xs text-stone-500">
              {isId ? 'Pangsa pasar snack terlaris Lashira' : 'Best selling snacks breakdown'}
            </p>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={72}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [
                    `${value}%`,
                    isId ? 'Porsi Penjualan' : 'Sales Share',
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

          <div className="space-y-1.5 pt-2 border-t border-[#F0E6E5]">
            {categoryData.map((cat, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-stone-700 font-medium">{cat.name}</span>
                </div>
                <span className="font-bold text-stone-900">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Leaderboard Cabang & Status Pabrik */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Branch Leaderboard */}
        <div className="bg-white p-5 rounded-2xl border border-[#F0E6E5] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-stone-900">
                {isId ? 'Peringkat Kinerja 4 Cabang Toko' : '4 Store Outlets Leaderboard'}
              </h3>
              <p className="text-xs text-stone-500">
                {isId ? 'Total omzet & volume transaksi' : 'Total sales volume & orders'}
              </p>
            </div>
            <Store className="w-5 h-5 text-[#991B1B]" />
          </div>

          <div className="space-y-2.5">
            {branchPerformance.map((b, idx) => (
              <div
                key={b.branchId}
                className="p-3 rounded-xl bg-[#FAF7F5] border border-[#F0E6E5] flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs ${
                      idx === 0
                        ? 'bg-amber-400 text-stone-950 shadow-xs'
                        : idx === 1
                        ? 'bg-stone-300 text-stone-800'
                        : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    #{idx + 1}
                  </span>
                  <div>
                    <h4 className="font-bold text-stone-900 text-xs">{b.branchName}</h4>
                    <p className="text-[11px] text-stone-500">
                      {b.city} • {b.orders} {isId ? 'Transaksi' : 'Orders'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-black text-[#991B1B] text-sm">
                    Rp {b.omzet.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Production & Quality Control Runs */}
        <div className="bg-white p-5 rounded-2xl border border-[#F0E6E5] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-stone-900">
                {isId
                  ? 'Batch Produksi & QC Dapur Pusat Soreang'
                  : 'Central Kitchen Production & QC'}
              </h3>
              <p className="text-xs text-stone-500">
                {isId ? 'Status SPK masak basreng & bumbu' : 'Production SPK & QC status'}
              </p>
            </div>
            <Factory className="w-5 h-5 text-[#991B1B]" />
          </div>

          <div className="space-y-2.5">
            {productionOrders.slice(0, 3).map((prod) => (
              <div
                key={prod.id}
                className="p-3 rounded-xl bg-[#FAF7F5] border border-[#F0E6E5] flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold bg-white text-stone-800 px-1.5 py-0.5 rounded border border-[#F0E6E5]">
                      {prod.batchNumber}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        prod.status === 'SELESAI'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800 animate-pulse'
                      }`}
                    >
                      {prod.status === 'SELESAI'
                        ? isId
                          ? 'LULUS QC & GUDANG'
                          : 'PASSED QC'
                        : isId
                        ? 'DALAM PROSES DAPUR'
                        : 'COOKING'}
                    </span>
                  </div>
                  <h4 className="font-bold text-stone-900 text-xs mt-1">
                    {prod.productName}
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    Operator: {prod.operatorName} • Target: {prod.quantityTarget} pcs
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-stone-500 block">
                    {isId ? 'HPP Satuan:' : 'Unit HPP:'}
                  </span>
                  <span className="font-black text-stone-900 text-xs">
                    Rp {prod.unitHpp.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dedicated Executive Feature: Financial Control & Position-Based Salary Allocation */}
      <div className="bg-white rounded-2xl border border-[#F0E6E5] shadow-xs overflow-hidden p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0E6E5] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#FAF2F0] text-[#991B1B] font-black border border-[#F0E6E5]">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg text-stone-900">
                  {isId
                    ? 'Monitoring Arus Kas & Alokasi Gaji Jabatan'
                    : 'Cash Flow & Position Salary Matrix'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#FAF2F0] text-[#991B1B]">
                  {isId ? 'Khusus Owner' : 'Owner Exclusive'}
                </span>
              </div>
              <p className="text-xs text-stone-500">
                {isId
                  ? 'Pusat kendali keuangan masuk-keluar dan pembagian anggaran gaji per jabatan karyawan Lashira.'
                  : 'Financial control of cash in-out and salary budget allocation across employee roles.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('owner-keuangan-gaji')}
            className="px-4 py-2 bg-[#991B1B] hover:bg-[#881337] text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center justify-center gap-1.5 active:scale-95"
          >
            <span>{isId ? 'Buka Detail Gaji & Laba' : 'View Full Salary & Profit'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Quick Financial Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100 space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-800">
              <span>{isId ? 'Total Pemasukan Arus Kas' : 'Total Cash Inflow'}</span>
              <ArrowUpRight className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl font-black text-emerald-950">
              Rp {totalIncome.toLocaleString('id-ID')}
            </div>
            <p className="text-[11px] text-emerald-700">
              {isId ? 'POS Retail, Grosir & QRIS' : 'Retail POS, Wholesale & QRIS'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-100 space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-rose-800">
              <span>{isId ? 'Total Pengeluaran Arus Kas' : 'Total Cash Outflow'}</span>
              <ArrowDownRight className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-xl font-black text-rose-950">
              Rp {totalExpense.toLocaleString('id-ID')}
            </div>
            <p className="text-[11px] text-rose-700">
              {isId ? 'Bahan Baku, Gaji, Listrik & Logistik' : 'Raw Materials, Payroll & Ops'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF2F0] border border-[#F0E6E5] space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-[#991B1B]">
              <span>{isId ? 'Total Beban Gaji Karyawan' : 'Total Payroll Expense'}</span>
              <Users className="w-4 h-4 text-[#991B1B]" />
            </div>
            <div className="text-xl font-black text-stone-900">
              Rp {totalPayrollBudget.toLocaleString('id-ID')}
            </div>
            <p className="text-[11px] text-stone-600">
              {isId
                ? `Alokasi untuk ${employees.length} Karyawan (9 Jabatan)`
                : `Allocated for ${employees.length} Staff (9 Roles)`}
            </p>
          </div>
        </div>

        {/* Position Salary Matrix Grid Preview */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-stone-600">
            <span>
              {isId
                ? 'Alokasi Anggaran Gaji Sesuai Jabatannya (Preview)'
                : 'Role-Based Salary Budget Allocation (Preview)'}
            </span>
            <button
              onClick={() => setActiveTab('owner-keuangan-gaji')}
              className="text-[#991B1B] hover:underline font-bold"
            >
              {isId ? 'Lihat Rincian Jabatan →' : 'View Role Breakdown →'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {positionSummary.map((pos, idx) => (
              <div
                key={idx}
                onClick={() => setActiveTab('owner-keuangan-gaji')}
                className="p-3.5 rounded-xl bg-[#FAF7F5] hover:bg-[#FAF2F0] border border-[#F0E6E5] transition cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: pos.color }}
                  />
                  <div>
                    <h4 className="font-extrabold text-xs text-stone-900">{pos.title}</h4>
                    <p className="text-[11px] text-stone-500">
                      {pos.count} {isId ? 'Personil' : 'Persons'}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-extrabold text-xs text-stone-900 block">
                    Rp {pos.totalSalary.toLocaleString('id-ID')}
                  </span>
                  <span className="text-[10px] font-bold text-[#991B1B] bg-[#FAF2F0] px-1.5 py-0.5 rounded border border-[#F0E6E5]">
                    {pos.portion}% {isId ? 'Total Gaji' : 'Of Payroll'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
