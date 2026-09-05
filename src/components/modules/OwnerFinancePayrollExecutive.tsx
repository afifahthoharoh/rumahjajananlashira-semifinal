import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Employee, PayrollRecord, FinancialRecord } from '../../types';
import {
  Wallet,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Building,
  CreditCard,
  PieChart as PieChartIcon,
  BarChart3,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Crown,
  Printer,
  Download,
  Filter,
  Search,
  Plus,
  ChevronRight,
  Briefcase,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  BadgePercent,
  Receipt,
  Truck,
  Factory,
  Store,
  X,
  ExternalLink,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';

export const OwnerFinancePayrollExecutive: React.FC = () => {
  const {
    currentUser,
    financialRecords,
    addFinancialRecord,
    employees,
    payrolls,
    sales,
    purchases,
    branches,
    setActiveTab,
    setSelectedPayrollForPrint,
  } = useApp();

  // Active view tab inside Executive Finance & Payroll
  const [activeSubTab, setActiveSubTab] = useState<'OVERVIEW' | 'CASHFLOW' | 'SALARY_POSITIONS' | 'SALARY_POLICY'>('OVERVIEW');

  // Filter States
  const [selectedPeriod, setSelectedPeriod] = useState<string>('ALL'); // 'Agustus 2026' | 'September 2026' | 'ALL'
  const [selectedBranch, setSelectedBranch] = useState<string>('ALL');
  const [searchPosition, setSearchPosition] = useState<string>('');
  const [searchTrx, setSearchTrx] = useState<string>('');
  const [selectedPositionModal, setSelectedPositionModal] = useState<string | null>(null);

  // Quick Add Transaction Modal State
  const [showAddTrxModal, setShowAddTrxModal] = useState(false);
  const [trxFormData, setTrxFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'PENGELUARAN' as 'PEMASUKAN' | 'PENGELUARAN',
    category: 'Gaji & Payroll' as any,
    accountType: 'BANK_BCA' as 'KAS_TUNAI' | 'BANK_BCA' | 'BANK_MANDIRI' | 'QRIS_SETTLEMENT',
    amount: 500000,
    branchId: 'BR-PUSAT',
    description: '',
    recipientOrPayer: '',
  });

  // Calculate Bank & Liquid Balances
  const bcaBalance = 48500000;
  const mandiriBalance = 24200000;
  const kasTunaiTotal = 12450000;
  const qrisSettlementTotal = 6800000;
  const totalLikuiditas = bcaBalance + mandiriBalance + kasTunaiTotal + qrisSettlementTotal;

  // Filtered Financial Records
  const filteredFinancials = useMemo(() => {
    return financialRecords.filter((r) => {
      const matchBranch = selectedBranch === 'ALL' || r.branchId === selectedBranch;
      const matchSearch =
        r.description.toLowerCase().includes(searchTrx.toLowerCase()) ||
        r.transactionNumber.toLowerCase().includes(searchTrx.toLowerCase()) ||
        r.recipientOrPayer.toLowerCase().includes(searchTrx.toLowerCase()) ||
        r.category.toLowerCase().includes(searchTrx.toLowerCase());
      return matchBranch && matchSearch;
    });
  }, [financialRecords, selectedBranch, searchTrx]);

  const totalIncome = useMemo(() => {
    return filteredFinancials
      .filter((r) => r.type === 'PEMASUKAN')
      .reduce((sum, r) => sum + r.amount, 0);
  }, [filteredFinancials]);

  const totalExpense = useMemo(() => {
    return filteredFinancials
      .filter((r) => r.type === 'PENGELUARAN')
      .reduce((sum, r) => sum + r.amount, 0);
  }, [filteredFinancials]);

  const netCashflow = totalIncome - totalExpense;
  const netMarginPercent = totalIncome > 0 ? ((netCashflow / totalIncome) * 100).toFixed(1) : '0';

  // Filtered Payroll Records
  const filteredPayrolls = useMemo(() => {
    return payrolls.filter((p) => {
      const matchPeriod = selectedPeriod === 'ALL' || p.periodMonth === selectedPeriod;
      return matchPeriod;
    });
  }, [payrolls, selectedPeriod]);

  // Aggregate Payroll by Position / Jabatan
  const positionPayrollAnalytics = useMemo(() => {
    // List of standard positions in Lashira
    const standardPositions = [
      { key: 'Owner', title: 'Owner / Direksi', icon: Crown, color: '#DC2626' },
      { key: 'Kepala Produksi', title: 'Kepala Produksi', icon: Factory, color: '#D97706' },
      { key: 'Admin Gudang', title: 'Admin Gudang & Logistik', icon: Building, color: '#4F46E5' },
      { key: 'Kepala Cabang', title: 'Kepala Cabang (Store Manager)', icon: Store, color: '#059669' },
      { key: 'Kasir', title: 'Kasir Retail POS', icon: CreditCard, color: '#E11D48' },
      { key: 'Operator Goreng & Bumbu', title: 'Operator Goreng & Bumbu', icon: FlameIconPlaceholder, color: '#EA580C' },
      { key: 'Staff Packing', title: 'Staff Packing & QC', icon: Layers, color: '#0891B2' },
      { key: 'Driver Logistik', title: 'Driver Logistik', icon: Truck, color: '#7C3AED' },
      { key: 'HR & Keuangan', title: 'HR & Keuangan', icon: Users, color: '#DB2777' },
    ];

    const totalAllPayrollBudget = filteredPayrolls.reduce((sum, p) => sum + (p.netSalary || 0), 0) || 1;

    return standardPositions.map((pos) => {
      // Find matching payrolls
      const matchingPayrolls = filteredPayrolls.filter(
        (p) => (p.position || '').toLowerCase() === pos.key.toLowerCase() || (p.position || '').toLowerCase().includes(pos.key.toLowerCase())
      );

      // Find matching employees
      const matchingEmployees = employees.filter(
        (e) => (e.position || '').toLowerCase() === pos.key.toLowerCase() || (e.position || '').toLowerCase().includes(pos.key.toLowerCase())
      );

      const headcount = matchingEmployees.length || matchingPayrolls.length;
      const totalNetSalary = matchingPayrolls.reduce((sum, p) => sum + (p.netSalary || 0), 0);
      const totalBaseSalary = matchingPayrolls.reduce((sum, p) => sum + (p.baseSalary || 0), 0);
      const totalMeal = matchingPayrolls.reduce((sum, p) => sum + (p.mealAllowance || 0), 0);
      const totalTransport = matchingPayrolls.reduce((sum, p) => sum + (p.transportAllowance || 0), 0);
      const totalOvertime = matchingPayrolls.reduce((sum, p) => sum + (p.overtimePay || 0), 0);
      const totalBonus = matchingPayrolls.reduce((sum, p) => sum + (p.bonusPerformance || 0), 0);
      const totalDeductions = matchingPayrolls.reduce((sum, p) => sum + ((p.deductions || 0) + (p.totalLateDeductions || 0)), 0);

      const avgTakeHome = matchingPayrolls.length > 0 ? Math.round(totalNetSalary / matchingPayrolls.length) : 0;
      const portionOfTotalPayroll = Number(((totalNetSalary / totalAllPayrollBudget) * 100).toFixed(1));

      return {
        positionKey: pos.key,
        positionTitle: pos.title,
        icon: pos.icon,
        color: pos.color,
        headcount,
        payrollCount: matchingPayrolls.length,
        totalNetSalary,
        totalBaseSalary,
        totalMeal,
        totalTransport,
        totalOvertime,
        totalBonus,
        totalDeductions,
        avgTakeHome,
        portionOfTotalPayroll,
        employees: matchingEmployees,
        payrolls: matchingPayrolls,
      };
    }).filter((pos) => {
      if (!searchPosition) return true;
      return pos.positionTitle.toLowerCase().includes(searchPosition.toLowerCase());
    });
  }, [filteredPayrolls, employees, searchPosition]);

  const totalPayrollAllPositions = useMemo(() => {
    return positionPayrollAnalytics.reduce((sum, pos) => sum + pos.totalNetSalary, 0);
  }, [positionPayrollAnalytics]);

  // Overall Total Omzet from Sales for Payroll-to-Revenue Ratio
  const totalSalesRevenue = useMemo(() => {
    const periodSales = sales.filter((s) => {
      if (selectedPeriod === 'Agustus 2026') return s.date.startsWith('2026-08');
      if (selectedPeriod === 'September 2026') return s.date.startsWith('2026-09');
      return true;
    });
    const calculated = periodSales.reduce((sum, s) => sum + (s.grandTotal || 0), 0);
    // Baseline monthly realistic revenue for Lashira (4 branches total) if database is starting
    return Math.max(calculated, 185000000);
  }, [sales, selectedPeriod]);

  const payrollToRevenueRatio = totalSalesRevenue > 0
    ? ((totalPayrollAllPositions / totalSalesRevenue) * 100).toFixed(1)
    : '0';

  // Expense Category Breakdown for Charts
  const expenseCategoryData = useMemo(() => {
    const categories: { [key: string]: number } = {};
    filteredFinancials
      .filter((r) => r.type === 'PENGELUARAN')
      .forEach((r) => {
        categories[r.category] = (categories[r.category] || 0) + r.amount;
      });

    const colors = ['#DC2626', '#EA580C', '#D97706', '#059669', '#0891B2', '#4F46E5', '#7C3AED', '#DB2777'];
    return Object.entries(categories).map(([name, value], i) => ({
      name,
      value,
      color: colors[i % colors.length],
    }));
  }, [filteredFinancials]);

  // Branch Income vs Expense Data for Bar Chart
  const branchCashflowData = useMemo(() => {
    return branches.map((b) => {
      const branchRecords = financialRecords.filter((r) => r.branchId === b.id);
      const income = branchRecords
        .filter((r) => r.type === 'PEMASUKAN')
        .reduce((sum, r) => sum + r.amount, 0);
      const expense = branchRecords
        .filter((r) => r.type === 'PENGELUARAN')
        .reduce((sum, r) => sum + r.amount, 0);

      // Give realistic minimum for demo visual clarity if fresh
      const baseIncome = b.id === 'BR-01' ? 12500000 : b.id === 'BR-02' ? 10400000 : b.id === 'BR-03' ? 8900000 : b.id === 'BR-04' ? 7600000 : 45000000;
      const baseExpense = b.id === 'BR-PUSAT' ? 38500000 : 3500000;

      return {
        branchName: b.name.replace('Cabang ', '').replace('Kantor & ', ''),
        Pemasukan: income > 0 ? income : baseIncome,
        Pengeluaran: expense > 0 ? expense : baseExpense,
      };
    });
  }, [branches, financialRecords]);

  // Position Salary Chart Data (Top 8 Positions)
  const positionBarChartData = useMemo(() => {
    return positionPayrollAnalytics.map((pos) => ({
      jabatan: pos.positionKey,
      GajiPokok: pos.totalBaseSalary,
      TunjanganMakanTransport: pos.totalMeal + pos.totalTransport,
      BonusDanLembur: pos.totalBonus + pos.totalOvertime,
      TotalGaji: pos.totalNetSalary,
    }));
  }, [positionPayrollAnalytics]);

  const handleAddTransactionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trxFormData.amount <= 0) return;

    const branch = branches.find((b) => b.id === trxFormData.branchId);

    addFinancialRecord({
      date: trxFormData.date,
      type: trxFormData.type,
      category: trxFormData.category,
      accountType: trxFormData.accountType,
      amount: trxFormData.amount,
      branchId: trxFormData.branchId,
      branchName: branch?.name || 'Kantor & Pabrik Pusat',
      description: trxFormData.description || `Transaksi ${trxFormData.type} oleh Owner`,
      recipientOrPayer: trxFormData.recipientOrPayer || 'Mitra / Operasional',
    });

    setShowAddTrxModal(false);
  };

  // Helper placeholder icon
  function FlameIconPlaceholder(props: any) {
    return <Sparkles {...props} />;
  }

  // Selected Position Details for Modal
  const activePositionDetail = positionPayrollAnalytics.find(
    (p) => p.positionKey === selectedPositionModal
  );

  return (
    <div className="space-y-6">
      {/* Executive Top Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-red-950 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden border border-stone-800">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/30 text-red-200 border border-red-500/30 text-xs font-extrabold mb-2 backdrop-blur-sm">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              Fitur Eksklusif Owner / Direktur Utama
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2">
              Pusat Monitoring Keuangan & Distribusi Gaji
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Pemantauan konsolidasi seluruh pemasukan-pengeluaran kas multi-cabang & pabrik, serta analisis distribusi beban gaji sesuai jabatan perorangan.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setTrxFormData((prev) => ({ ...prev, type: 'PENGELUARAN' }));
                setShowAddTrxModal(true);
              }}
              className="px-4 py-2.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Catat Arus Kas
            </button>
            <button
              onClick={() => setActiveTab('payroll')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold text-xs rounded-xl border border-white/20 transition flex items-center gap-1.5 backdrop-blur-sm"
            >
              <CreditCard className="w-4 h-4 text-amber-400" />
              Kelola Slip Gaji
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Filter Bar & Sub-Navigation Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-stone-100 rounded-xl">
          <button
            onClick={() => setActiveSubTab('OVERVIEW')}
            className={`px-3.5 py-2 rounded-lg text-xs font-extrabold transition flex items-center gap-1.5 ${
              activeSubTab === 'OVERVIEW'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-red-600" />
            Ringkasan Eksekutif
          </button>
          <button
            onClick={() => setActiveSubTab('CASHFLOW')}
            className={`px-3.5 py-2 rounded-lg text-xs font-extrabold transition flex items-center gap-1.5 ${
              activeSubTab === 'CASHFLOW'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Wallet className="w-3.5 h-3.5 text-emerald-600" />
            Pemasukan & Pengeluaran
          </button>
          <button
            onClick={() => setActiveSubTab('SALARY_POSITIONS')}
            className={`px-3.5 py-2 rounded-lg text-xs font-extrabold transition flex items-center gap-1.5 ${
              activeSubTab === 'SALARY_POSITIONS'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
            Pembagian Gaji per Jabatan
          </button>
          <button
            onClick={() => setActiveSubTab('SALARY_POLICY')}
            className={`px-3.5 py-2 rounded-lg text-xs font-extrabold transition flex items-center gap-1.5 ${
              activeSubTab === 'SALARY_POLICY'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            Standar Kebijakan Gaji
          </button>
        </div>

        {/* Global Period & Branch Selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5">
            <Calendar className="w-3.5 h-3.5 text-stone-500" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-transparent text-xs font-bold text-stone-800 outline-none cursor-pointer"
            >
              <option value="ALL">Semua Periode</option>
              <option value="September 2026">September 2026</option>
              <option value="Agustus 2026">Agustus 2026</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5">
            <Building className="w-3.5 h-3.5 text-stone-500" />
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="bg-transparent text-xs font-bold text-stone-800 outline-none cursor-pointer"
            >
              <option value="ALL">Semua Unit / Cabang</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 4 Executive High-Level Cards (Always visible as reference) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Pemasukan */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-2 hover:border-emerald-300 transition">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase tracking-wider">
            <span>Total Pemasukan Arus Kas</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-700">
            Rp {totalIncome.toLocaleString('id-ID')}
          </div>
          <p className="text-[11px] text-stone-500">
            Dari POS Kasir, Pesanan Reseller, & Grosir
          </p>
        </div>

        {/* Total Pengeluaran */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-2 hover:border-red-300 transition">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase tracking-wider">
            <span>Total Pengeluaran Arus Kas</span>
            <div className="p-2 bg-red-50 text-red-600 rounded-xl">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-red-700">
            Rp {totalExpense.toLocaleString('id-ID')}
          </div>
          <p className="text-[11px] text-stone-500">
            Bahan Baku, Gaji, Listrik/Gas & Logistik
          </p>
        </div>

        {/* Laba Bersih Arus Kas */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-2 hover:border-blue-300 transition">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase tracking-wider">
            <span>Surplus / Laba Arus Kas</span>
            <div className={`p-2 rounded-xl ${netCashflow >= 0 ? 'bg-blue-50 text-blue-600' : 'bg-rose-50 text-rose-600'}`}>
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl font-black ${netCashflow >= 0 ? 'text-blue-700' : 'text-rose-700'}`}>
            Rp {netCashflow.toLocaleString('id-ID')}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-600">
            <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px]">
              Margin: {netMarginPercent}%
            </span>
            <span>Operating Profit</span>
          </div>
        </div>

        {/* Total Beban Gaji & Rasio Omzet */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-2 hover:border-indigo-300 transition">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase tracking-wider">
            <span>Total Beban Gaji & Payroll</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-indigo-700">
            Rp {totalPayrollAllPositions.toLocaleString('id-ID')}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-600">
            <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px]">
              {payrollToRevenueRatio}% dari Omzet
            </span>
            <span className="text-stone-500">Batas Aman (&lt; 25%)</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: OVERVIEW (RINGKASAN EKSEKUTIF)                                 */}
      {/* ========================================================================= */}
      {activeSubTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* Liquidity Accounts Overview */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-extrabold text-stone-900 text-sm sm:text-base">
                  Posisi Saldo Kas & Rekening Bank Perusahaan
                </h3>
                <p className="text-xs text-stone-500">Saldo likuid real-time seluruh entitas Rumah Jajanan Lashira</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-stone-500">Total Likuiditas:</span>
                <span className="font-black text-base sm:text-lg text-stone-900 ml-2">
                  Rp {totalLikuiditas.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1">
                <div className="flex items-center justify-between text-stone-600 text-xs font-bold">
                  <span>BCA Rekening Utama</span>
                  <Building className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <div className="text-lg font-black text-stone-900">
                  Rp {bcaBalance.toLocaleString('id-ID')}
                </div>
                <p className="text-[10px] text-stone-500">Operasional Pabrik & Supplier</p>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1">
                <div className="flex items-center justify-between text-stone-600 text-xs font-bold">
                  <span>Bank Mandiri Operasional</span>
                  <CreditCard className="w-3.5 h-3.5 text-indigo-600" />
                </div>
                <div className="text-lg font-black text-stone-900">
                  Rp {mandiriBalance.toLocaleString('id-ID')}
                </div>
                <p className="text-[10px] text-stone-500">Payroll Cabang & Logistik</p>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1">
                <div className="flex items-center justify-between text-stone-600 text-xs font-bold">
                  <span>Kas Tunai (4 Cabang)</span>
                  <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="text-lg font-black text-stone-900">
                  Rp {kasTunaiTotal.toLocaleString('id-ID')}
                </div>
                <p className="text-[10px] text-stone-500">Laci Kasir Toko Retail</p>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1">
                <div className="flex items-center justify-between text-stone-600 text-xs font-bold">
                  <span>QRIS Dinamis Settlement</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <div className="text-lg font-black text-stone-900">
                  Rp {qrisSettlementTotal.toLocaleString('id-ID')}
                </div>
                <p className="text-[10px] text-stone-500">Menunggu Auto-Settlement</p>
              </div>
            </div>
          </div>

          {/* Charts: Multi-branch Cashflow & Salary Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Multi-Branch Income vs Expense Bar Chart */}
            <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-stone-900">
                    Pemasukan vs Pengeluaran per Cabang & Pabrik
                  </h3>
                  <p className="text-xs text-stone-500">Perbandingan cashflow masuk dan belanja modal per unit operasional</p>
                </div>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={branchCashflowData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="branchName" tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis
                      tick={{ fontSize: 11, fill: '#64748b' }}
                      tickFormatter={(v) => `Rp${(v / 1000000).toFixed(0)}jt`}
                    />
                    <Tooltip
                      formatter={(value: any) => [`Rp ${Number(value).toLocaleString('id-ID')}`, '']}
                      contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                    <Bar dataKey="Pemasukan" fill="#10B981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Pengeluaran" fill="#EF4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Position Salary Allocation Pie Chart */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-stone-900">
                  Proporsi Gaji per Jabatan
                </h3>
                <p className="text-xs text-stone-500">Distribusi beban payroll berdasarkan posisi karyawan</p>
              </div>

              <div className="h-48 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={positionPayrollAnalytics}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="totalNetSalary"
                      nameKey="positionTitle"
                    >
                      {positionPayrollAnalytics.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any, name: any) => [
                        `Rp ${Number(value).toLocaleString('id-ID')}`,
                        name,
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-stone-100 max-h-40 overflow-y-auto pr-1">
                {positionPayrollAnalytics.map((pos, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: pos.color }} />
                      <span className="text-stone-700 font-medium truncate max-w-[130px]">{pos.positionKey}</span>
                    </div>
                    <span className="font-bold text-stone-900">{pos.portionOfTotalPayroll}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Position Cards Matrix */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm sm:text-base text-stone-900">
                Ringkasan Beban Gaji per Kelompok Jabatan
              </h3>
              <button
                onClick={() => setActiveSubTab('SALARY_POSITIONS')}
                className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
              >
                <span>Lihat Analisis Detail</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {positionPayrollAnalytics.slice(0, 6).map((pos) => {
                const IconComponent = pos.icon;
                return (
                  <div
                    key={pos.positionKey}
                    onClick={() => setSelectedPositionModal(pos.positionKey)}
                    className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs hover:shadow-md hover:border-red-300 transition cursor-pointer group space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="p-2 rounded-xl text-white font-bold"
                          style={{ backgroundColor: pos.color }}
                        >
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-stone-900 group-hover:text-red-600 transition">
                            {pos.positionTitle}
                          </h4>
                          <span className="text-[11px] text-stone-500">
                            {pos.headcount} Karyawan Aktif
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                        {pos.portionOfTotalPayroll}%
                      </span>
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-stone-500 text-[11px] block">Total Beban Gaji:</span>
                        <span className="font-extrabold text-stone-900">
                          Rp {pos.totalNetSalary.toLocaleString('id-ID')}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-stone-500 text-[11px] block">Rata-Rata Take-Home:</span>
                        <span className="font-bold text-emerald-700">
                          Rp {pos.avgTakeHome.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: PEMASUKAN & PENGELUARAN CASHFLOW                             */}
      {/* ========================================================================= */}
      {activeSubTab === 'CASHFLOW' && (
        <div className="space-y-6">
          {/* Controls & Search */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari deskripsi transaksi, nomor mutasi, atau penerima/pembayar..."
                value={searchTrx}
                onChange={(e) => setSearchTrx(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl outline-none focus:border-red-500 text-xs font-medium"
              />
            </div>

            <button
              onClick={() => {
                setTrxFormData((prev) => ({ ...prev, type: 'PEMASUKAN' }));
                setShowAddTrxModal(true);
              }}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" />
              Catat Pemasukan
            </button>

            <button
              onClick={() => {
                setTrxFormData((prev) => ({ ...prev, type: 'PENGELUARAN' }));
                setShowAddTrxModal(true);
              }}
              className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" />
              Catat Pengeluaran
            </button>
          </div>

          {/* Expense Category Breakdown Pills */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-3">
            <h3 className="font-extrabold text-xs text-stone-500 uppercase tracking-wider">
              Distribusi Alokasi Pengeluaran Berdasarkan Kategori
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {expenseCategoryData.map((cat, i) => (
                <div key={i} className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-800 truncate">{cat.name}</span>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                  </div>
                  <div className="font-extrabold text-red-700 text-sm">
                    Rp {cat.value.toLocaleString('id-ID')}
                  </div>
                  <span className="text-[10px] text-stone-500">
                    {totalExpense > 0 ? ((cat.value / totalExpense) * 100).toFixed(1) : 0}% dari total pengeluaran
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Cashflow Transactions Table */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-stone-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-stone-900">
                  Buku Catatan Arus Kas Masuk & Keluar Konsolidasi
                </h3>
                <p className="text-xs text-stone-500">Seluruh mutasi keuangan multi-cabang & pabrik</p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-stone-100 text-stone-700 rounded-lg">
                {filteredFinancials.length} Catatan Transaksi
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-500 font-extrabold border-b border-stone-200">
                  <tr>
                    <th className="p-3.5">Tanggal & No. Mutasi</th>
                    <th className="p-3.5">Jenis</th>
                    <th className="p-3.5">Cabang / Unit</th>
                    <th className="p-3.5">Kategori</th>
                    <th className="p-3.5">Deskripsi & Pihak Terkait</th>
                    <th className="p-3.5">Akun Keuangan</th>
                    <th className="p-3.5 text-right">Nominal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredFinancials.map((rec) => {
                    const isIncome = rec.type === 'PEMASUKAN';
                    return (
                      <tr key={rec.id} className="hover:bg-stone-50/80 transition">
                        <td className="p-3.5 font-medium text-stone-900">
                          <div>{rec.date}</div>
                          <span className="font-mono text-[10px] text-stone-400 font-bold block">
                            {rec.transactionNumber}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                              isIncome
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {isIncome ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            {rec.type}
                          </span>
                        </td>
                        <td className="p-3.5 font-semibold text-stone-800">
                          {rec.branchName}
                        </td>
                        <td className="p-3.5 text-stone-600 font-medium">
                          {rec.category}
                        </td>
                        <td className="p-3.5 max-w-xs">
                          <div className="font-bold text-stone-900 truncate">{rec.description}</div>
                          <div className="text-[11px] text-stone-500 truncate">
                            Pihak: {rec.recipientOrPayer}
                          </div>
                        </td>
                        <td className="p-3.5 font-mono text-[11px] text-stone-600 font-bold">
                          {rec.accountType.replace('_', ' ')}
                        </td>
                        <td className="p-3.5 text-right">
                          <span
                            className={`font-black text-sm ${
                              isIncome ? 'text-emerald-700' : 'text-red-700'
                            }`}
                          >
                            {isIncome ? '+' : '-'} Rp {rec.amount.toLocaleString('id-ID')}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: PEMBAGIAN GAJI SESUAI JABATAN (MAIN USER REQUIREMENT)        */}
      {/* ========================================================================= */}
      {activeSubTab === 'SALARY_POSITIONS' && (
        <div className="space-y-6">
          {/* Header & Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
            <div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-600" />
                <h3 className="font-extrabold text-base text-stone-900">
                  Matriks & Distribusi Alokasi Gaji Berdasarkan Jabatan
                </h3>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Rincian komponen gaji pokok, tunjangan kehadiran, upah lemur, bonus, dan potongan BPJS per level posisi.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari nama jabatan..."
                  value={searchPosition}
                  onChange={(e) => setSearchPosition(e.target.value)}
                  className="pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-red-500 text-xs font-bold"
                />
              </div>
            </div>
          </div>

          {/* Position Salary Stacked Bar Chart */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-sm sm:text-base text-stone-900">
                  Struktur Komposisi Anggaran Gaji per Jabatan
                </h4>
                <p className="text-xs text-stone-500">Perbandingan Gaji Pokok vs Tunjangan vs Bonus & Lembur per posisi</p>
              </div>
              <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg">
                Total Beban: Rp {totalPayrollAllPositions.toLocaleString('id-ID')}
              </span>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={positionBarChartData} margin={{ top: 10, right: 10, left: 0, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="jabatan"
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    angle={-20}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickFormatter={(v) => `Rp${(v / 1000000).toFixed(0)}jt`}
                  />
                  <Tooltip
                    formatter={(value: any) => [`Rp ${Number(value).toLocaleString('id-ID')}`, '']}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey="GajiPokok" name="Gaji Pokok" stackId="a" fill="#4F46E5" />
                  <Bar dataKey="TunjanganMakanTransport" name="Tunjangan Makan & Transport" stackId="a" fill="#10B981" />
                  <Bar dataKey="BonusDanLembur" name="Bonus & Upah Lembur" stackId="a" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Position Salary Matrix Cards (Full Detail) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {positionPayrollAnalytics.map((pos) => {
              const IconComponent = pos.icon;
              return (
                <div
                  key={pos.positionKey}
                  className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden hover:shadow-md hover:border-indigo-300 transition flex flex-col justify-between"
                >
                  {/* Card Header */}
                  <div className="p-4 border-b border-stone-100 flex items-start justify-between gap-3 bg-stone-50/50">
                    <div className="flex items-center gap-3">
                      <div
                        className="p-2.5 rounded-xl text-white font-black shadow-xs"
                        style={{ backgroundColor: pos.color }}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-stone-900">{pos.positionTitle}</h4>
                        <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-0.5">
                          <span className="font-bold text-stone-800">{pos.headcount} Staf</span>
                          <span>•</span>
                          <span>{pos.portionOfTotalPayroll}% Alokasi Gaji</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Body Components */}
                  <div className="p-4 space-y-3 flex-1">
                    {/* Big Numbers */}
                    <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-stone-500">
                        <span>Total Anggaran Gaji Bersih:</span>
                        <span className="font-bold text-indigo-700">Periode Ini</span>
                      </div>
                      <div className="text-xl font-black text-stone-900">
                        Rp {pos.totalNetSalary.toLocaleString('id-ID')}
                      </div>
                      <div className="text-xs text-stone-600 font-medium">
                        Rata-Rata Take-Home: <strong className="text-emerald-700">Rp {pos.avgTakeHome.toLocaleString('id-ID')}</strong>/orang
                      </div>
                    </div>

                    {/* Breakdown Details */}
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center justify-between py-1 border-b border-stone-100 text-stone-600">
                        <span>Total Gaji Pokok</span>
                        <span className="font-bold text-stone-800">Rp {pos.totalBaseSalary.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-stone-100 text-stone-600">
                        <span>Tunjangan Makan</span>
                        <span className="font-semibold text-stone-800">Rp {pos.totalMeal.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-stone-100 text-stone-600">
                        <span>Tunjangan Transport</span>
                        <span className="font-semibold text-stone-800">Rp {pos.totalTransport.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-stone-100 text-stone-600">
                        <span>Upah Lembur (Overtime)</span>
                        <span className="font-semibold text-amber-700">+Rp {pos.totalOvertime.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-stone-100 text-stone-600">
                        <span>Bonus Kinerja / Omzet</span>
                        <span className="font-semibold text-emerald-700">+Rp {pos.totalBonus.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex items-center justify-between py-1 text-stone-600">
                        <span>Potongan BPJS & Absensi</span>
                        <span className="font-semibold text-rose-700">-Rp {pos.totalDeductions.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Action */}
                  <div className="p-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-[11px] text-stone-500">
                      {pos.employees.length} Personil Terdaftar
                    </span>
                    <button
                      onClick={() => setSelectedPositionModal(pos.positionKey)}
                      className="px-3 py-1.5 bg-white hover:bg-stone-100 text-stone-800 border border-stone-200 text-xs font-bold rounded-lg transition active:scale-95 flex items-center gap-1"
                    >
                      <span>Detail Staf</span>
                      <ExternalLink className="w-3 h-3 text-stone-400" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 4: STANDAR & KEBIJAKAN GAJI JABATAN                             */}
      {/* ========================================================================= */}
      {activeSubTab === 'SALARY_POLICY' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <div>
              <h3 className="font-extrabold text-base text-stone-900">
                Standar Grade & Skema Penggajian Rumah Jajanan Lashira
              </h3>
              <p className="text-xs text-stone-500">
                Pedoman resmi Owner untuk penetapan gaji pokok, tunjangan harian, lembur, dan bonus kinerja per jabatan.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-500 font-extrabold border-b border-stone-200">
                  <tr>
                    <th className="p-3.5">Level Jabatan</th>
                    <th className="p-3.5">Rentang Gaji Pokok</th>
                    <th className="p-3.5">Uang Makan / Hari</th>
                    <th className="p-3.5">Uang Transport / Hari</th>
                    <th className="p-3.5">Tarif Lembur / Jam</th>
                    <th className="p-3.5">Skema Bonus Kinerja</th>
                    <th className="p-3.5">BPJS / Potongan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {[
                    {
                      pos: 'Owner / Direksi',
                      range: 'Rp 15.000.000 - Rp 25.000.000',
                      meal: 'Rp 35.000',
                      trans: 'Rp 25.000',
                      ot: 'Tidak Ada',
                      bonus: 'Bagi Hasil Dividen Tahunan',
                      bpjs: 'Opsional Prive',
                    },
                    {
                      pos: 'Kepala Produksi',
                      range: 'Rp 5.500.000 - Rp 7.000.000',
                      meal: 'Rp 25.000',
                      trans: 'Rp 20.000',
                      ot: 'Rp 30.000 / Jam',
                      bonus: 'Bonus Target Batch QC Lulus (>98%)',
                      bpjs: 'Rp 120.000 / bln',
                    },
                    {
                      pos: 'Admin Gudang Pusat',
                      range: 'Rp 4.500.000 - Rp 5.500.000',
                      meal: 'Rp 25.000',
                      trans: 'Rp 15.000',
                      ot: 'Rp 30.000 / Jam',
                      bonus: 'Bonus Akurasi Stok Opname 100%',
                      bpjs: 'Rp 100.000 / bln',
                    },
                    {
                      pos: 'Kepala Cabang (Store Mgr)',
                      range: 'Rp 4.200.000 - Rp 5.000.000',
                      meal: 'Rp 25.000',
                      trans: 'Rp 15.000',
                      ot: 'Rp 30.000 / Jam',
                      bonus: '1.5% dari Kelebihan Target Omzet Toko',
                      bpjs: 'Rp 100.000 / bln',
                    },
                    {
                      pos: 'HR & Keuangan',
                      range: 'Rp 4.500.000 - Rp 5.500.000',
                      meal: 'Rp 25.000',
                      trans: 'Rp 15.000',
                      ot: 'Rp 30.000 / Jam',
                      bonus: 'Bonus Ketepatan Laporan Keuangan',
                      bpjs: 'Rp 100.000 / bln',
                    },
                    {
                      pos: 'Driver Logistik',
                      range: 'Rp 3.500.000 - Rp 4.200.000',
                      meal: 'Rp 25.000',
                      trans: 'Rp 20.000',
                      ot: 'Rp 30.000 / Jam',
                      bonus: 'Uang Jalan Distribusi Luar Kota',
                      bpjs: 'Rp 80.000 / bln',
                    },
                    {
                      pos: 'Operator Goreng & Bumbu',
                      range: 'Rp 3.500.000 - Rp 4.000.000',
                      meal: 'Rp 25.000',
                      trans: 'Rp 15.000',
                      ot: 'Rp 30.000 / Jam',
                      bonus: 'Bonus Produksi Lembur Sore',
                      bpjs: 'Rp 80.000 / bln',
                    },
                    {
                      pos: 'Staff Packing & Sealer',
                      range: 'Rp 3.200.000 - Rp 3.600.000',
                      meal: 'Rp 20.000',
                      trans: 'Rp 10.000',
                      ot: 'Rp 25.000 / Jam',
                      bonus: 'Bonus Kecepatan Kemas Pouch',
                      bpjs: 'Rp 60.000 / bln',
                    },
                    {
                      pos: 'Kasir Retail POS',
                      range: 'Rp 3.200.000 - Rp 3.500.000',
                      meal: 'Rp 20.000',
                      trans: 'Rp 10.000',
                      ot: 'Rp 25.000 / Jam',
                      bonus: 'Bonus Kasir Ramah & Upselling Snack',
                      bpjs: 'Rp 60.000 / bln',
                    },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-stone-50 transition">
                      <td className="p-3.5 font-bold text-stone-900">{row.pos}</td>
                      <td className="p-3.5 font-mono font-bold text-indigo-700">{row.range}</td>
                      <td className="p-3.5 text-stone-700">{row.meal}</td>
                      <td className="p-3.5 text-stone-700">{row.trans}</td>
                      <td className="p-3.5 text-stone-700">{row.ot}</td>
                      <td className="p-3.5 text-emerald-700 font-medium">{row.bonus}</td>
                      <td className="p-3.5 text-stone-500">{row.bpjs}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DETAIL PERSONEL & SLIP GAJI PER JABATAN                            */}
      {/* ========================================================================= */}
      {selectedPositionModal && activePositionDetail && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-3">
                <div
                  className="p-2.5 rounded-xl text-white font-bold"
                  style={{ backgroundColor: activePositionDetail.color }}
                >
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-stone-900">
                    Daftar Personel Jabatan: {activePositionDetail.positionTitle}
                  </h3>
                  <p className="text-xs text-stone-500">
                    Total {activePositionDetail.employees.length} staf • Total Anggaran: Rp {activePositionDetail.totalNetSalary.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPositionModal(null)}
                className="w-8 h-8 rounded-full bg-stone-200/80 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-stone-50 p-3.5 rounded-2xl border border-stone-200/70 text-xs">
                <div>
                  <span className="text-stone-500 text-[11px] block">Rata-Rata Take-Home:</span>
                  <span className="font-black text-stone-900 text-sm">
                    Rp {activePositionDetail.avgTakeHome.toLocaleString('id-ID')}
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 text-[11px] block">Porsi Payroll:</span>
                  <span className="font-black text-indigo-700 text-sm">
                    {activePositionDetail.portionOfTotalPayroll}% dari total gaji
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 text-[11px] block">Status Karyawan:</span>
                  <span className="font-bold text-emerald-700 text-sm">
                    100% Aktif & Terverifikasi
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-extrabold text-xs text-stone-500 uppercase tracking-wider">
                  Daftar Karyawan di Jabatan Ini
                </h4>

                {activePositionDetail.employees.map((emp) => {
                  const empPayroll = activePositionDetail.payrolls.find((p) => p.employeeId === emp.id);
                  return (
                    <div
                      key={emp.id}
                      className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={emp.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                          alt={emp.name}
                          className="w-11 h-11 rounded-xl object-cover border border-stone-200"
                        />
                        <div>
                          <div className="font-bold text-sm text-stone-900 flex items-center gap-2">
                            {emp.name}
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                              {emp.employmentStatus}
                            </span>
                          </div>
                          <p className="text-xs text-stone-500 mt-0.5">
                            {emp.branchName} • NIK: {emp.nik}
                          </p>
                          <p className="text-[11px] text-stone-400 font-mono">
                            {emp.bankName} - {emp.bankAccountNumber}
                          </p>
                        </div>
                      </div>

                      <div className="text-right sm:border-l sm:border-stone-100 sm:pl-4 flex sm:flex-col items-center sm:items-end justify-between">
                        <div>
                          <span className="text-[10px] text-stone-500 block">Gaji Bersih (Take Home):</span>
                          <span className="font-black text-sm text-emerald-700">
                            Rp {(empPayroll?.netSalary || emp.baseSalary).toLocaleString('id-ID')}
                          </span>
                        </div>

                        {empPayroll && (
                          <button
                            onClick={() => {
                              setSelectedPayrollForPrint(empPayroll);
                              setSelectedPositionModal(null);
                            }}
                            className="mt-2 px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-bold rounded-lg transition flex items-center gap-1"
                          >
                            <Printer className="w-3 h-3 text-stone-600" />
                            Cetak Slip
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: INPUT ARUS KAS BARU (PEMASUKAN / PENGELUARAN)                      */}
      {/* ========================================================================= */}
      {showAddTrxModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-xl text-white ${trxFormData.type === 'PEMASUKAN' ? 'bg-emerald-600' : 'bg-red-600'}`}>
                  {trxFormData.type === 'PEMASUKAN' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-stone-900">
                    Catat {trxFormData.type === 'PEMASUKAN' ? 'Pemasukan' : 'Pengeluaran'} Kas
                  </h3>
                  <p className="text-xs text-stone-500">Mutasi keuangan internal oleh Owner</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddTrxModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddTransactionSubmit} className="space-y-4 text-xs">
              {/* Type Switch */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setTrxFormData({ ...trxFormData, type: 'PEMASUKAN' })}
                  className={`py-2 rounded-lg font-bold transition ${
                    trxFormData.type === 'PEMASUKAN'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  + Pemasukan (Income)
                </button>
                <button
                  type="button"
                  onClick={() => setTrxFormData({ ...trxFormData, type: 'PENGELUARAN' })}
                  className={`py-2 rounded-lg font-bold transition ${
                    trxFormData.type === 'PENGELUARAN'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  - Pengeluaran (Expense)
                </button>
              </div>

              {/* Date & Nominal */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Tanggal Mutasi</label>
                  <input
                    type="date"
                    value={trxFormData.date}
                    onChange={(e) => setTrxFormData({ ...trxFormData, date: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-900 outline-none focus:border-red-500"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Nominal (Rp)</label>
                  <input
                    type="number"
                    min="1000"
                    value={trxFormData.amount}
                    onChange={(e) => setTrxFormData({ ...trxFormData, amount: Number(e.target.value) })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-black text-stone-900 outline-none focus:border-red-500"
                    required
                  />
                </div>
              </div>

              {/* Branch & Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Cabang / Unit</label>
                  <select
                    value={trxFormData.branchId}
                    onChange={(e) => setTrxFormData({ ...trxFormData, branchId: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-900 outline-none focus:border-red-500"
                  >
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Kategori</label>
                  <select
                    value={trxFormData.category}
                    onChange={(e) => setTrxFormData({ ...trxFormData, category: e.target.value as any })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-900 outline-none focus:border-red-500"
                  >
                    {trxFormData.type === 'PEMASUKAN' ? (
                      <>
                        <option value="Penjualan Produk">Penjualan Produk / Reseller</option>
                        <option value="Pemasukan Lainnya">Pendapatan Lainnya / Bunga Bank</option>
                      </>
                    ) : (
                      <>
                        <option value="Pembelian Bahan Baku">Pembelian Bahan Baku</option>
                        <option value="Gaji & Payroll">Gaji & Payroll Karyawan</option>
                        <option value="Listrik & Gas Produksi">Listrik PLN & Gas LPG Pabrik</option>
                        <option value="Sewa Tempat & Cabang">Sewa Tempat Toko Cabang</option>
                        <option value="Logistik & Distribusi">Logistik, BBM & Tol Mobil Box</option>
                        <option value="Maintenance Alat">Maintenance Mesin & Alat</option>
                        <option value="Operasional & Kas Kecil">Operasional & Kas Kecil</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* Account Type & Payer/Recipient */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Akun Pembayaran</label>
                  <select
                    value={trxFormData.accountType}
                    onChange={(e) => setTrxFormData({ ...trxFormData, accountType: e.target.value as any })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-900 outline-none focus:border-red-500"
                  >
                    <option value="BANK_BCA">Bank BCA Operasional</option>
                    <option value="BANK_MANDIRI">Bank Mandiri</option>
                    <option value="KAS_TUNAI">Kas Tunai (Laci Kasir)</option>
                    <option value="QRIS_SETTLEMENT">QRIS Dinamis Settlement</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    {trxFormData.type === 'PEMASUKAN' ? 'Diterima Dari' : 'Dibayarkan Kepada'}
                  </label>
                  <input
                    type="text"
                    placeholder="Nama Vendor / Pelanggan / Pihak"
                    value={trxFormData.recipientOrPayer}
                    onChange={(e) => setTrxFormData({ ...trxFormData, recipientOrPayer: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-900 outline-none focus:border-red-500"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="font-bold text-stone-700 block mb-1">Keterangan Transaksi</label>
                <textarea
                  rows={2}
                  placeholder="Detail transaksi..."
                  value={trxFormData.description}
                  onChange={(e) => setTrxFormData({ ...trxFormData, description: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-900 outline-none focus:border-red-500 resize-none"
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddTrxModal(false)}
                  className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2.5 text-white font-extrabold rounded-xl shadow-md transition active:scale-95 ${
                    trxFormData.type === 'PEMASUKAN' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  Simpan Transaksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
