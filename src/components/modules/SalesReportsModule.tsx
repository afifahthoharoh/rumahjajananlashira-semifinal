import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  Search,
  Calendar,
  Download,
  Printer,
  TrendingUp,
  DollarSign,
  Store,
  Users,
  CreditCard,
  FileSpreadsheet,
  Package,
  Layers,
  CheckCircle2,
  ChevronRight,
  Eye,
  X,
  Filter,
  ArrowUpDown,
  Coins,
  Receipt,
  Sparkles,
  PieChart as PieIcon,
  ShoppingBag,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { SaleTransaction } from '../../types';

export const SalesReportsModule: React.FC = () => {
  const { sales, branches, currentUser, setSelectedSaleForPrint } = useApp();

  // Active view tab
  const [activeTab, setActiveTab] = useState<'TRANSAKSI' | 'PRODUK_TERLARIS' | 'PERFORMA_CABANG' | 'METODE_BAYAR'>('TRANSAKSI');

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState<string>(
    currentUser.role === 'OWNER' || currentUser.role === 'ADMIN_GUDANG' || currentUser.role === 'HR_ADMIN'
      ? 'ALL'
      : currentUser.branchId || 'ALL'
  );
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [memberFilter, setMemberFilter] = useState('ALL');

  // Date range state (default to current month: August - September 2026)
  const now = new Date();
  const currentMonthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
  const [startDate, setStartDate] = useState('2026-08-01');
  const [endDate, setEndDate] = useState(now.toISOString().split('T')[0] || '2026-09-30');

  // Sorting
  const [sortBy, setSortBy] = useState<'DATE_DESC' | 'DATE_ASC' | 'TOTAL_DESC' | 'PROFIT_DESC'>('DATE_DESC');

  // Selected Transaction for Detail Modal
  const [selectedTxDetail, setSelectedTxDetail] = useState<SaleTransaction | null>(null);

  // Quick Date Range Presets
  const handleQuickDatePreset = (preset: 'TODAY' | '7DAYS' | '30DAYS' | 'THIS_MONTH' | 'ALL') => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    if (preset === 'TODAY') {
      setStartDate(todayStr);
      setEndDate(todayStr);
    } else if (preset === '7DAYS') {
      const d = new Date();
      d.setDate(d.getDate() - 7);
      setStartDate(d.toISOString().split('T')[0]);
      setEndDate(todayStr);
    } else if (preset === '30DAYS') {
      const d = new Date();
      d.setDate(d.getDate() - 30);
      setStartDate(d.toISOString().split('T')[0]);
      setEndDate(todayStr);
    } else if (preset === 'THIS_MONTH') {
      const firstDay = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;
      setStartDate(firstDay);
      setEndDate(todayStr);
    } else if (preset === 'ALL') {
      setStartDate('2026-01-01');
      setEndDate('2026-12-31');
    }
  };

  // Filtered Sales with safe checks
  const filteredSales = useMemo(() => {
    return sales.filter((s) => {
      if (!s) return false;

      // Safe search matching
      const sInv = (s.invoiceNumber || '').toLowerCase();
      const sCust = (s.customerName || '').toLowerCase();
      const sPhone = (s.customerPhone || '').toLowerCase();
      const sCashier = (s.cashierName || '').toLowerCase();
      const sBranch = (s.branchName || '').toLowerCase();
      const sItems = (s.items || []).some(
        (it) => (it.productName || '').toLowerCase().includes(searchTerm.toLowerCase()) || (it.sku || '').toLowerCase().includes(searchTerm.toLowerCase())
      );

      const matchSearch =
        !searchTerm.trim() ||
        sInv.includes(searchTerm.toLowerCase()) ||
        sCust.includes(searchTerm.toLowerCase()) ||
        sPhone.includes(searchTerm.toLowerCase()) ||
        sCashier.includes(searchTerm.toLowerCase()) ||
        sBranch.includes(searchTerm.toLowerCase()) ||
        sItems;

      const matchBranch = branchFilter === 'ALL' || s.branchId === branchFilter;
      const matchPayment = paymentFilter === 'ALL' || s.paymentMethod === paymentFilter;
      const matchMember = memberFilter === 'ALL' || s.customerMemberType === memberFilter;

      // Date matching with safe strings
      const sDate = s.date || '2026-09-01';
      const matchDate = (!startDate || sDate >= startDate) && (!endDate || sDate <= endDate);

      return matchSearch && matchBranch && matchPayment && matchMember && matchDate;
    });
  }, [sales, searchTerm, branchFilter, paymentFilter, memberFilter, startDate, endDate]);

  // Sorted Sales
  const sortedSales = useMemo(() => {
    return [...filteredSales].sort((a, b) => {
      if (sortBy === 'DATE_DESC') {
        const dateCompare = (b.date || '').localeCompare(a.date || '');
        return dateCompare !== 0 ? dateCompare : (b.time || '').localeCompare(a.time || '');
      }
      if (sortBy === 'DATE_ASC') {
        const dateCompare = (a.date || '').localeCompare(b.date || '');
        return dateCompare !== 0 ? dateCompare : (a.time || '').localeCompare(b.time || '');
      }
      if (sortBy === 'TOTAL_DESC') {
        return (b.grandTotal || 0) - (a.grandTotal || 0);
      }
      if (sortBy === 'PROFIT_DESC') {
        return (b.grossProfit || 0) - (a.grossProfit || 0);
      }
      return 0;
    });
  }, [filteredSales, sortBy]);

  // Financial aggregates with safe defaults
  const totalOmzet = useMemo(() => filteredSales.reduce((sum, s) => sum + (s.grandTotal || 0), 0), [filteredSales]);
  const totalDiskon = useMemo(() => filteredSales.reduce((sum, s) => sum + (s.discountTotal || 0), 0), [filteredSales]);
  const totalHpp = useMemo(
    () =>
      filteredSales.reduce((sum, s) => {
        const hppVal = s.totalHpp !== undefined ? s.totalHpp : (s.items || []).reduce((acc, it) => acc + (it.hpp || 0) * (it.quantity || 1), 0);
        return sum + hppVal;
      }, 0),
    [filteredSales]
  );
  const totalLabaKotor = useMemo(
    () =>
      filteredSales.reduce((sum, s) => {
        if (s.grossProfit !== undefined) return sum + s.grossProfit;
        const hppVal = s.totalHpp !== undefined ? s.totalHpp : (s.items || []).reduce((acc, it) => acc + (it.hpp || 0) * (it.quantity || 1), 0);
        return sum + Math.max(0, (s.grandTotal || 0) - hppVal);
      }, 0),
    [filteredSales]
  );
  const totalPcsSold = useMemo(
    () => filteredSales.reduce((sum, s) => sum + (s.items || []).reduce((acc, it) => acc + (it.quantity || 0), 0), 0),
    [filteredSales]
  );
  const avgTicket = filteredSales.length > 0 ? Math.round(totalOmzet / filteredSales.length) : 0;
  const marginPercent = totalOmzet > 0 ? ((totalLabaKotor / totalOmzet) * 100).toFixed(1) : '0';

  // Cash Drawer vs Non-Cash Settlement
  const cashTotal = useMemo(
    () => filteredSales.filter((s) => s.paymentMethod === 'TUNAI').reduce((sum, s) => sum + (s.grandTotal || 0), 0),
    [filteredSales]
  );
  const nonCashTotal = useMemo(
    () => filteredSales.filter((s) => s.paymentMethod !== 'TUNAI').reduce((sum, s) => sum + (s.grandTotal || 0), 0),
    [filteredSales]
  );

  // Top Selling Products Aggregation
  const topProducts = useMemo(() => {
    const productMap: Record<
      string,
      {
        productId: string;
        productName: string;
        sku: string;
        totalQty: number;
        totalRevenue: number;
        totalHpp: number;
        totalProfit: number;
      }
    > = {};

    filteredSales.forEach((sale) => {
      (sale.items || []).forEach((item) => {
        if (!productMap[item.productId]) {
          productMap[item.productId] = {
            productId: item.productId,
            productName: item.productName || 'Produk',
            sku: item.sku || 'SKU',
            totalQty: 0,
            totalRevenue: 0,
            totalHpp: 0,
            totalProfit: 0,
          };
        }
        const itemHpp = (item.hpp || 0) * (item.quantity || 1);
        const itemRev = item.subtotal || (item.price || 0) * (item.quantity || 1);

        productMap[item.productId].totalQty += item.quantity || 1;
        productMap[item.productId].totalRevenue += itemRev;
        productMap[item.productId].totalHpp += itemHpp;
        productMap[item.productId].totalProfit += itemRev - itemHpp;
      });
    });

    return Object.values(productMap).sort((a, b) => b.totalQty - a.totalQty);
  }, [filteredSales]);

  // Branch Performance Aggregation
  const branchPerformance = useMemo(() => {
    const map: Record<
      string,
      {
        branchId: string;
        branchName: string;
        txCount: number;
        omzet: number;
        profit: number;
        cash: number;
        nonCash: number;
      }
    > = {};

    filteredSales.forEach((s) => {
      const bId = s.branchId || 'BR-PUSAT';
      const bName = s.branchName || 'Cabang Lashira';
      if (!map[bId]) {
        map[bId] = {
          branchId: bId,
          branchName: bName,
          txCount: 0,
          omzet: 0,
          profit: 0,
          cash: 0,
          nonCash: 0,
        };
      }
      map[bId].txCount += 1;
      map[bId].omzet += s.grandTotal || 0;
      map[bId].profit += s.grossProfit || 0;
      if (s.paymentMethod === 'TUNAI') {
        map[bId].cash += s.grandTotal || 0;
      } else {
        map[bId].nonCash += s.grandTotal || 0;
      }
    });

    return Object.values(map).sort((a, b) => b.omzet - a.omzet);
  }, [filteredSales]);

  // Payment Breakdown Aggregation
  const paymentBreakdown = useMemo(() => {
    const map: Record<string, { method: string; count: number; total: number }> = {
      TUNAI: { method: 'Tunai (Cash)', count: 0, total: 0 },
      QRIS: { method: 'QRIS Dinamis', count: 0, total: 0 },
      TRANSFER_BANK: { method: 'Transfer Bank (BCA)', count: 0, total: 0 },
      'E-WALLET': { method: 'E-Wallet (GoPay/ShopeePay)', count: 0, total: 0 },
    };

    filteredSales.forEach((s) => {
      const m = s.paymentMethod || 'TUNAI';
      if (map[m]) {
        map[m].count += 1;
        map[m].total += s.grandTotal || 0;
      } else {
        map[m] = { method: m, count: 1, total: s.grandTotal || 0 };
      }
    });

    return Object.values(map);
  }, [filteredSales]);

  // Export to Excel with Multi-Sheet Data
  const exportToExcel = () => {
    // Sheet 1: Detail Transaksi
    const transactionsData = filteredSales.map((s, idx) => ({
      No: idx + 1,
      'No. Nota': s.invoiceNumber,
      Tanggal: s.date,
      Jam: s.time,
      Cabang: s.branchName,
      Kasir: s.cashierName,
      Pelanggan: s.customerName,
      'No. HP': s.customerPhone || '-',
      'Tipe Member': s.customerMemberType,
      'Jumlah Item': (s.items || []).reduce((sum, i) => sum + i.quantity, 0),
      Subtotal: s.subtotal || 0,
      'Diskon (Rp)': s.discountTotal || 0,
      'Kode Voucher': s.voucherCode || '-',
      'Grand Total (Rp)': s.grandTotal || 0,
      'Total HPP (Rp)': s.totalHpp || 0,
      'Laba Kotor (Rp)': s.grossProfit || 0,
      'Margin (%)': s.grandTotal ? (((s.grossProfit || 0) / s.grandTotal) * 100).toFixed(1) + '%' : '0%',
      'Metode Pembayaran': s.paymentMethod,
      'Nominal Diterima': s.amountPaid || 0,
      Kembalian: s.changeAmount || 0,
      Status: s.status || 'BERHASIL',
    }));

    // Sheet 2: Analisis Produk
    const topProductsData = topProducts.map((p, idx) => ({
      Peringkat: idx + 1,
      'Nama Produk': p.productName,
      SKU: p.sku,
      'Qty Terjual (pcs)': p.totalQty,
      'Total Omzet (Rp)': p.totalRevenue,
      'Total HPP (Rp)': p.totalHpp,
      'Laba Kotor (Rp)': p.totalProfit,
      'Margin (%)': p.totalRevenue ? ((p.totalProfit / p.totalRevenue) * 100).toFixed(1) + '%' : '0%',
      'Kontribusi Omzet (%)': totalOmzet > 0 ? ((p.totalRevenue / totalOmzet) * 100).toFixed(1) + '%' : '0%',
    }));

    const wb = XLSX.utils.book_new();

    const ws1 = XLSX.utils.json_to_sheet(transactionsData);
    XLSX.utils.book_append_sheet(wb, ws1, 'Riwayat Transaksi');

    const ws2 = XLSX.utils.json_to_sheet(topProductsData);
    XLSX.utils.book_append_sheet(wb, ws2, 'Ringkasan Produk Terlaris');

    XLSX.writeFile(wb, `Laporan_Penjualan_Lashira_${startDate}_sd_${endDate}.xlsx`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-red-600 text-white rounded-xl shadow-sm">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-stone-900 leading-tight">
                MODUL 12: Laporan Penjualan & Analisis Omzet
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Monitoring transaksi kasir real-time, profitabilitas per varian snack, setoran kas tunai & rekonsiliasi QRIS.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={exportToExcel}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-2 transition"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Unduh Excel (.xlsx)
          </button>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition active:scale-95"
          >
            <Printer className="w-4 h-4 text-stone-600" />
            Cetak Ringkasan
          </button>
        </div>
      </div>

      {/* KPI Cards Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Omzet */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm relative overflow-hidden group hover:border-red-400 transition">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase">
            <span>Total Omzet Penjualan</span>
            <div className="p-1.5 bg-red-50 text-red-600 rounded-lg">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-stone-900 mt-2">
            Rp {totalOmzet.toLocaleString('id-ID')}
          </div>
          <div className="flex items-center justify-between text-[11px] text-stone-500 font-medium pt-1">
            <span>{filteredSales.length} Struk Transaksi</span>
            <span className="text-stone-700 font-bold">{totalPcsSold.toLocaleString('id-ID')} pcs terjual</span>
          </div>
        </div>

        {/* Laba Kotor & Margin */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm relative overflow-hidden group hover:border-emerald-400 transition">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase">
            <span>Estimasi Laba Kotor</span>
            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2">
            Rp {totalLabaKotor.toLocaleString('id-ID')}
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1">
            <span className="text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
              Margin Kotor: {marginPercent}%
            </span>
            <span className="text-stone-500">HPP: Rp {totalHpp.toLocaleString('id-ID')}</span>
          </div>
        </div>

        {/* Rekonsiliasi Kas Tunai */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm relative overflow-hidden group hover:border-amber-400 transition">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase">
            <span>Setoran Kas Fisik (Tunai)</span>
            <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-700 mt-2">
            Rp {cashTotal.toLocaleString('id-ID')}
          </div>
          <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
            <span>Wajib ada di laci kasir</span>
            <span className="font-semibold text-stone-700">
              {totalOmzet > 0 ? ((cashTotal / totalOmzet) * 100).toFixed(0) : 0}% dari omzet
            </span>
          </div>
        </div>

        {/* Non-Tunai / QRIS & AOV */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm relative overflow-hidden group hover:border-blue-400 transition">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase">
            <span>Non-Tunai & Rata2 Keranjang</span>
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-blue-700 mt-2">
            Rp {nonCashTotal.toLocaleString('id-ID')}
          </div>
          <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
            <span>AOV (Rata-rata/Nota):</span>
            <span className="font-black text-stone-800">Rp {avgTicket.toLocaleString('id-ID')}</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar & Quick Date Presets */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-3">
        {/* Quick Date Presets */}
        <div className="flex items-center justify-between gap-2 flex-wrap border-b border-stone-100 pb-3">
          <div className="flex items-center gap-1.5 text-xs text-stone-600 font-bold">
            <Calendar className="w-3.5 h-3.5 text-red-600" />
            <span>Periode Cepat:</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: 'TODAY', label: 'Hari Ini' },
              { id: '7DAYS', label: '7 Hari Terakhir' },
              { id: '30DAYS', label: '30 Hari Terakhir' },
              { id: 'THIS_MONTH', label: 'Bulan Ini' },
              { id: 'ALL', label: 'Semua Periode' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => handleQuickDatePreset(p.id as any)}
                className="px-2.5 py-1 text-xs rounded-lg font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 transition"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 text-xs">
          {/* Search Box */}
          <div className="lg:col-span-4 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nota, pelanggan, kasir, atau nama snack..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-red-500 outline-none transition font-medium"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Branch Filter */}
          <div className="lg:col-span-3">
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-800 outline-none focus:border-red-500"
            >
              <option value="ALL">Semua Cabang / Unit</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Method Filter */}
          <div className="lg:col-span-2">
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-800 outline-none focus:border-red-500"
            >
              <option value="ALL">Semua Metode Bayar</option>
              <option value="TUNAI">Tunai (Cash)</option>
              <option value="QRIS">QRIS Dinamis</option>
              <option value="TRANSFER_BANK">Transfer Bank</option>
              <option value="E-WALLET">E-Wallet</option>
            </select>
          </div>

          {/* Date Pickers */}
          <div className="lg:col-span-3 flex items-center gap-1.5">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 border border-stone-200 bg-stone-50 rounded-xl text-xs font-semibold text-stone-700 outline-none"
            />
            <span className="text-stone-400 font-bold">-</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 border border-stone-200 bg-stone-50 rounded-xl text-xs font-semibold text-stone-700 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('TRANSAKSI')}
          className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition whitespace-nowrap ${
            activeTab === 'TRANSAKSI'
              ? 'bg-red-600 text-white shadow-sm'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <Receipt className="w-4 h-4" />
          Rincian Transaksi ({filteredSales.length})
        </button>

        <button
          onClick={() => setActiveTab('PRODUK_TERLARIS')}
          className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition whitespace-nowrap ${
            activeTab === 'PRODUK_TERLARIS'
              ? 'bg-red-600 text-white shadow-sm'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <Package className="w-4 h-4" />
          Analisis Produk Terlaris ({topProducts.length})
        </button>

        <button
          onClick={() => setActiveTab('PERFORMA_CABANG')}
          className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition whitespace-nowrap ${
            activeTab === 'PERFORMA_CABANG'
              ? 'bg-red-600 text-white shadow-sm'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <Store className="w-4 h-4" />
          Performa Cabang & Kasir
        </button>

        <button
          onClick={() => setActiveTab('METODE_BAYAR')}
          className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition whitespace-nowrap ${
            activeTab === 'METODE_BAYAR'
              ? 'bg-red-600 text-white shadow-sm'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <PieIcon className="w-4 h-4" />
          Komposisi Pembayaran
        </button>
      </div>

      {/* Tab 1: Detailed Transactions Table */}
      {activeTab === 'TRANSAKSI' && (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm space-y-4">
          <div className="p-4 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-50">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-stone-800">
                Daftar Struk Transaksi ({sortedSales.length} Data)
              </span>
              {filteredSales.length !== sales.length && (
                <span className="text-xs bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded-full">
                  Terfilter dari {sales.length} total
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-stone-500 font-semibold">Urutkan:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="p-1.5 bg-white border border-stone-200 rounded-lg font-bold text-stone-700"
              >
                <option value="DATE_DESC">Waktu Terbaru</option>
                <option value="DATE_ASC">Waktu Terlama</option>
                <option value="TOTAL_DESC">Nilai Belanja Tertinggi</option>
                <option value="PROFIT_DESC">Laba Kotor Tertinggi</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-100/80 text-stone-700 font-bold border-b border-stone-200 uppercase text-[10px]">
                <tr>
                  <th className="p-3.5">No. Nota & Waktu</th>
                  <th className="p-3.5">Cabang & Kasir</th>
                  <th className="p-3.5">Pelanggan</th>
                  <th className="p-3.5">Item Belanja</th>
                  <th className="p-3.5">Metode Bayar</th>
                  <th className="p-3.5 text-right">Subtotal</th>
                  <th className="p-3.5 text-right">Grand Total</th>
                  <th className="p-3.5 text-right">Laba Kotor</th>
                  <th className="p-3.5 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {sortedSales.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-stone-500">
                      <Receipt className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                      <p className="font-bold text-stone-700">Tidak ada data transaksi penjualan ditemukan</p>
                      <p className="text-xs text-stone-400 mt-1">Coba sesuaikan filter pencarian atau rentang tanggal.</p>
                    </td>
                  </tr>
                ) : (
                  sortedSales.map((s) => {
                    const totalQty = (s.items || []).reduce((sum, it) => sum + it.quantity, 0);
                    return (
                      <tr key={s.id} className="hover:bg-stone-50/80 transition">
                        {/* Nota & Waktu */}
                        <td className="p-3.5 font-medium">
                          <span className="font-mono font-bold text-red-700 block text-xs">{s.invoiceNumber}</span>
                          <span className="text-stone-500 text-[11px] flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3 h-3 text-stone-400" />
                            {s.date} {s.time}
                          </span>
                        </td>

                        {/* Cabang & Kasir */}
                        <td className="p-3.5">
                          <span className="font-bold text-stone-900 block">{s.branchName || 'Cabang Lashira'}</span>
                          <span className="text-stone-500 text-[11px]">Kasir: {s.cashierName || 'Kasir'}</span>
                        </td>

                        {/* Pelanggan */}
                        <td className="p-3.5">
                          <span className="font-bold text-stone-800 block">{s.customerName || 'Pelanggan Umum'}</span>
                          <div className="flex items-center gap-1 mt-0.5">
                            <span
                              className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded ${
                                s.customerMemberType === 'MEMBER_VIP'
                                  ? 'bg-amber-100 text-amber-800'
                                  : s.customerMemberType === 'MEMBER_GOLD'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : s.customerMemberType === 'RESELLER'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-stone-100 text-stone-600'
                              }`}
                            >
                              {s.customerMemberType || 'REGULER'}
                            </span>
                            {s.customerPhone && s.customerPhone !== '-' && (
                              <span className="text-[10px] text-stone-400">{s.customerPhone}</span>
                            )}
                          </div>
                        </td>

                        {/* Item Belanja Summary */}
                        <td className="p-3.5">
                          <button
                            onClick={() => setSelectedTxDetail(s)}
                            className="text-left group hover:text-red-700"
                          >
                            <span className="font-bold text-stone-800 group-hover:text-red-700">
                              {totalQty} pcs ({s.items?.length || 0} menu)
                            </span>
                            <span className="block text-[11px] text-stone-500 truncate max-w-[180px]">
                              {s.items?.map((it) => `${it.productName} (${it.quantity})`).join(', ')}
                            </span>
                          </button>
                        </td>

                        {/* Metode Bayar */}
                        <td className="p-3.5">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-extrabold ${
                              s.paymentMethod === 'TUNAI'
                                ? 'bg-emerald-100 text-emerald-800'
                                : s.paymentMethod === 'QRIS'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}
                          >
                            {s.paymentMethod || 'TUNAI'}
                          </span>
                        </td>

                        {/* Subtotal & Diskon */}
                        <td className="p-3.5 text-right font-medium text-stone-600">
                          <div>Rp {(s.subtotal || s.grandTotal || 0).toLocaleString('id-ID')}</div>
                          {(s.discountTotal || 0) > 0 && (
                            <span className="text-[10px] text-red-600 font-semibold block">
                              -Rp {(s.discountTotal || 0).toLocaleString('id-ID')}
                            </span>
                          )}
                        </td>

                        {/* Grand Total */}
                        <td className="p-3.5 text-right font-black text-stone-900 text-sm">
                          Rp {(s.grandTotal || 0).toLocaleString('id-ID')}
                        </td>

                        {/* Laba Kotor */}
                        <td className="p-3.5 text-right font-bold text-emerald-700">
                          +Rp {(s.grossProfit || 0).toLocaleString('id-ID')}
                          <span className="block text-[10px] text-stone-400 font-normal">
                            HPP: Rp {(s.totalHpp || 0).toLocaleString('id-ID')}
                          </span>
                        </td>

                        {/* Aksi */}
                        <td className="p-3.5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setSelectedTxDetail(s)}
                              className="p-1.5 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-bold transition"
                              title="Lihat Detail Transaksi"
                            >
                              <Eye className="w-4 h-4 text-stone-600" />
                            </button>
                            <button
                              onClick={() => setSelectedSaleForPrint(s)}
                              className="p-1.5 bg-stone-100 hover:bg-red-50 hover:text-red-700 text-stone-700 rounded-lg text-xs font-bold transition flex items-center gap-1"
                              title="Cetak Ulang Struk Thermal"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
              {sortedSales.length > 0 && (
                <tfoot className="bg-stone-100 font-extrabold text-stone-900 border-t-2 border-stone-300">
                  <tr>
                    <td colSpan={5} className="p-3.5 text-right uppercase text-[11px] text-stone-600">
                      TOTAL KESELURUHAN ({sortedSales.length} TRANSAKSI) :
                    </td>
                    <td className="p-3.5 text-right text-stone-700">
                      Rp {(totalOmzet + totalDiskon).toLocaleString('id-ID')}
                    </td>
                    <td className="p-3.5 text-right text-sm text-red-700">
                      Rp {totalOmzet.toLocaleString('id-ID')}
                    </td>
                    <td className="p-3.5 text-right text-sm text-emerald-700">
                      Rp {totalLabaKotor.toLocaleString('id-ID')}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Top Selling Products Analysis */}
      {activeTab === 'PRODUK_TERLARIS' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top 3 Snack Champions Podiums */}
            {topProducts.slice(0, 3).map((prod, idx) => (
              <div
                key={prod.productId}
                className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs ${
                      idx === 0
                        ? 'bg-amber-400 text-amber-950'
                        : idx === 1
                        ? 'bg-stone-300 text-stone-900'
                        : 'bg-amber-600 text-white'
                    }`}
                  >
                    #{idx + 1}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Margin {prod.totalRevenue > 0 ? ((prod.totalProfit / prod.totalRevenue) * 100).toFixed(0) : 0}%
                  </span>
                </div>

                <div className="mt-3 space-y-1">
                  <h4 className="font-black text-sm text-stone-900 line-clamp-1">{prod.productName}</h4>
                  <p className="text-xs text-stone-500 font-mono">SKU: {prod.sku}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-stone-100 text-xs">
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">Terjual</span>
                    <span className="font-black text-stone-800 text-base">{prod.totalQty} pcs</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">Total Omzet</span>
                    <span className="font-black text-red-700 text-base">Rp {prod.totalRevenue.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Products Table */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
            <div className="p-4 bg-stone-50 border-b border-stone-200 font-extrabold text-sm text-stone-800">
              Peringkat Penjualan Seluruh Produk Snack ({topProducts.length} Varian)
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-100 text-stone-700 font-bold border-b border-stone-200 uppercase text-[10px]">
                  <tr>
                    <th className="p-3.5 text-center">Rank</th>
                    <th className="p-3.5">Nama Produk & SKU</th>
                    <th className="p-3.5 text-right">Jumlah Terjual</th>
                    <th className="p-3.5 text-right">Total Omzet (Gross)</th>
                    <th className="p-3.5 text-right">Total Beban HPP</th>
                    <th className="p-3.5 text-right">Laba Kotor Bersih</th>
                    <th className="p-3.5 text-right">Margin Keuntungan</th>
                    <th className="p-3.5 text-right">Kontribusi Omzet</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {topProducts.map((p, idx) => {
                    const margin = p.totalRevenue > 0 ? ((p.totalProfit / p.totalRevenue) * 100).toFixed(1) : '0';
                    const contribution = totalOmzet > 0 ? ((p.totalRevenue / totalOmzet) * 100).toFixed(1) : '0';
                    return (
                      <tr key={p.productId} className="hover:bg-stone-50 transition">
                        <td className="p-3.5 text-center font-black text-stone-500">#{idx + 1}</td>
                        <td className="p-3.5">
                          <span className="font-extrabold text-stone-900 block">{p.productName}</span>
                          <span className="text-[11px] text-stone-500 font-mono">SKU: {p.sku}</span>
                        </td>
                        <td className="p-3.5 text-right font-black text-stone-900 text-sm">
                          {p.totalQty.toLocaleString('id-ID')} <span className="text-stone-500 text-xs font-normal">pcs</span>
                        </td>
                        <td className="p-3.5 text-right font-bold text-red-700">
                          Rp {p.totalRevenue.toLocaleString('id-ID')}
                        </td>
                        <td className="p-3.5 text-right text-stone-600">
                          Rp {p.totalHpp.toLocaleString('id-ID')}
                        </td>
                        <td className="p-3.5 text-right font-black text-emerald-700">
                          Rp {p.totalProfit.toLocaleString('id-ID')}
                        </td>
                        <td className="p-3.5 text-right font-bold text-stone-800">
                          <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded font-black">
                            {margin}%
                          </span>
                        </td>
                        <td className="p-3.5 text-right font-semibold text-stone-600">
                          {contribution}%
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

      {/* Tab 3: Performa Cabang & Kasir */}
      {activeTab === 'PERFORMA_CABANG' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cabang Overview */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm space-y-4">
            <div className="p-4 bg-stone-50 border-b border-stone-200 font-extrabold text-sm text-stone-800 flex items-center justify-between">
              <span>Performa Omzet Per Cabang</span>
              <Store className="w-4 h-4 text-stone-500" />
            </div>

            <div className="p-4 space-y-4">
              {branchPerformance.map((b) => {
                const sharePercent = totalOmzet > 0 ? ((b.omzet / totalOmzet) * 100).toFixed(1) : '0';
                return (
                  <div key={b.branchId} className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-extrabold text-sm text-stone-900">{b.branchName}</h4>
                        <p className="text-xs text-stone-500">{b.txCount} Transaksi Selesai</p>
                      </div>
                      <span className="text-xs font-black text-red-700 bg-red-50 px-2.5 py-1 rounded-lg border border-red-200">
                        {sharePercent}% Total Omzet
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t border-stone-200">
                      <div>
                        <span className="text-stone-400 text-[10px] block uppercase font-bold">Omzet</span>
                        <span className="font-black text-stone-900">Rp {b.omzet.toLocaleString('id-ID')}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 text-[10px] block uppercase font-bold">Laba Kotor</span>
                        <span className="font-bold text-emerald-700">Rp {b.profit.toLocaleString('id-ID')}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 text-[10px] block uppercase font-bold">Setoran Kas</span>
                        <span className="font-bold text-amber-700">Rp {b.cash.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Kasir / Staff Breakdown */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm space-y-4">
            <div className="p-4 bg-stone-50 border-b border-stone-200 font-extrabold text-sm text-stone-800 flex items-center justify-between">
              <span>Aktivitas Kasir & Operator POS</span>
              <Users className="w-4 h-4 text-stone-500" />
            </div>

            <div className="p-4">
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-100 text-stone-700 font-bold border-b border-stone-200 uppercase text-[10px]">
                  <tr>
                    <th className="p-2.5">Nama Kasir</th>
                    <th className="p-2.5 text-center">Struk Selesai</th>
                    <th className="p-2.5 text-right">Total Transaksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {Array.from(new Set(filteredSales.map((s) => s.cashierName || 'Kasir'))).map((cashierNameItem) => {
                    const cashier = String(cashierNameItem || 'Kasir');
                    const cashierSales = filteredSales.filter((s) => (s.cashierName || 'Kasir') === cashier);
                    const cashierOmzet = cashierSales.reduce((sum, s) => sum + (s.grandTotal || 0), 0);
                    return (
                      <tr key={cashier} className="hover:bg-stone-50">
                        <td className="p-3 font-bold text-stone-900 flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-red-100 text-red-700 font-black text-xs flex items-center justify-center">
                            {cashier.charAt(0)}
                          </div>
                          {cashier}
                        </td>
                        <td className="p-3 text-center font-semibold text-stone-700">
                          {cashierSales.length} struk
                        </td>
                        <td className="p-3 text-right font-black text-stone-900">
                          Rp {cashierOmzet.toLocaleString('id-ID')}
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

      {/* Tab 4: Komposisi Pembayaran & Rekonsiliasi */}
      {activeTab === 'METODE_BAYAR' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-stone-900">Rekap Metode Pembayaran</h3>
            <p className="text-xs text-stone-500">
              Gunakan rincian ini untuk mencocokkan fisik uang laci kasir (Tunai) dan saldo mutasi QRIS/Bank.
            </p>

            <div className="space-y-3">
              {paymentBreakdown.map((pm) => {
                const percent = totalOmzet > 0 ? ((pm.total / totalOmzet) * 100).toFixed(1) : '0';
                return (
                  <div key={pm.method} className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                    <div>
                      <span className="font-extrabold text-xs text-stone-900 block">{pm.method}</span>
                      <span className="text-[11px] text-stone-500">{pm.count} Transaksi</span>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-sm text-stone-900 block">Rp {pm.total.toLocaleString('id-ID')}</span>
                      <span className="text-[10px] font-bold text-red-700">{percent}% Omzet</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-stone-900">Pemberitahuan Audit & Keuangan</h3>
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-2">
              <div className="flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Pencatatan Keuangan Otomatis Terhubung</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Setiap transaksi POS yang tercatat di modul ini otomatis membuat jurnal kas masuk di <strong>Modul 14: Laporan Keuangan</strong> secara real-time.
              </p>
            </div>

            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1.5">
              <span className="font-bold">Tips Tutup Kasir Harian:</span>
              <p className="text-[11px] text-amber-800">
                Hitung uang fisik di laci kasir dan pastikan nominalnya tepat sama dengan nominal <strong>Setoran Kas Fisik (Tunai): Rp {cashTotal.toLocaleString('id-ID')}</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Detail Modal */}
      {selectedTxDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 bg-stone-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-red-400" />
                <div>
                  <h3 className="font-extrabold text-sm">Rincian Nota: {selectedTxDetail.invoiceNumber}</h3>
                  <p className="text-[11px] text-stone-400">
                    {selectedTxDetail.date} • {selectedTxDetail.time}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTxDetail(null)}
                className="p-1 hover:bg-stone-800 rounded-lg text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              {/* Header Info */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                <div>
                  <span className="text-stone-400 text-[10px] uppercase font-bold block">Cabang & Kasir</span>
                  <span className="font-bold text-stone-900">{selectedTxDetail.branchName}</span>
                  <span className="text-stone-500 block">Kasir: {selectedTxDetail.cashierName}</span>
                </div>
                <div>
                  <span className="text-stone-400 text-[10px] uppercase font-bold block">Pelanggan</span>
                  <span className="font-bold text-stone-900">{selectedTxDetail.customerName || 'Umum'}</span>
                  <span className="text-stone-500 block">Tipe: {selectedTxDetail.customerMemberType || 'REGULER'}</span>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <h4 className="font-bold text-stone-800 mb-2">Item Snack yang Dibeli:</h4>
                <div className="border border-stone-200 rounded-xl overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-stone-100 text-stone-700 font-bold border-b border-stone-200 text-[10px] uppercase">
                      <tr>
                        <th className="p-2.5">Produk</th>
                        <th className="p-2.5 text-center">Qty</th>
                        <th className="p-2.5 text-right">Harga</th>
                        <th className="p-2.5 text-right">HPP</th>
                        <th className="p-2.5 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {(selectedTxDetail.items || []).map((it, idx) => (
                        <tr key={idx}>
                          <td className="p-2.5">
                            <span className="font-bold text-stone-900 block">{it.productName}</span>
                            <span className="text-[10px] text-stone-400 font-mono">{it.sku}</span>
                          </td>
                          <td className="p-2.5 text-center font-bold text-stone-800">{it.quantity}</td>
                          <td className="p-2.5 text-right text-stone-600">Rp {(it.price || 0).toLocaleString('id-ID')}</td>
                          <td className="p-2.5 text-right text-stone-400">Rp {(it.hpp || 0).toLocaleString('id-ID')}</td>
                          <td className="p-2.5 text-right font-black text-stone-900">
                            Rp {(it.subtotal || (it.price || 0) * it.quantity).toLocaleString('id-ID')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Financial Calculation */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5 font-medium">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal Belanja:</span>
                  <span>Rp {(selectedTxDetail.subtotal || 0).toLocaleString('id-ID')}</span>
                </div>
                {(selectedTxDetail.discountTotal || 0) > 0 && (
                  <div className="flex justify-between text-red-600 font-bold">
                    <span>Diskon Voucher {selectedTxDetail.voucherCode ? `(${selectedTxDetail.voucherCode})` : ''}:</span>
                    <span>-Rp {(selectedTxDetail.discountTotal || 0).toLocaleString('id-ID')}</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-sm pt-1 border-t border-stone-300 text-stone-900">
                  <span>Grand Total:</span>
                  <span className="text-red-700">Rp {(selectedTxDetail.grandTotal || 0).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-stone-600 pt-1">
                  <span>Metode Pembayaran:</span>
                  <span className="font-bold text-stone-800">{selectedTxDetail.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Uang Diterima:</span>
                  <span>Rp {(selectedTxDetail.amountPaid || 0).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Kembalian:</span>
                  <span>Rp {(selectedTxDetail.changeAmount || 0).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-700 pt-1 border-t border-stone-200">
                  <span>Estimasi Laba Kotor Transaksi:</span>
                  <span>+Rp {(selectedTxDetail.grossProfit || 0).toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-stone-100 border-t border-stone-200 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setSelectedSaleForPrint(selectedTxDetail);
                  setSelectedTxDetail(null);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-sm text-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                Cetak Struk Thermal
              </button>
              <button
                onClick={() => setSelectedTxDetail(null)}
                className="px-4 py-2 bg-white hover:bg-stone-200 text-stone-700 font-bold rounded-xl border border-stone-200 text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
