import React from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Store,
  DollarSign,
  QrCode,
  CreditCard,
  Banknote,
  ShoppingBag,
  Sparkles,
  Printer,
  Clock,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Receipt,
  User,
} from 'lucide-react';

export const CashierShiftDashboard: React.FC = () => {
  const {
    sales,
    currentUser,
    branches,
    setActiveTab,
    products,
    setSelectedSaleForPrint,
    language,
  } = useApp();

  const currentBranchId = currentUser.branchId || 'BR-01';
  const currentBranch = branches.find((b) => b.id === currentBranchId) || branches[1];
  const todayStr = new Date().toISOString().split('T')[0];

  // Strictly filter to current cashier's branch sales today
  const todaySales = sales.filter(
    (s) => s.branchId === currentBranchId && s.date === todayStr
  );

  const totalOmzetToday = todaySales.reduce((sum, s) => sum + (s.grandTotal || 0), 0);
  const totalCash = todaySales
    .filter((s) => s.paymentMethod === 'TUNAI')
    .reduce((sum, s) => sum + s.grandTotal, 0);
  const totalQris = todaySales
    .filter((s) => s.paymentMethod === 'QRIS')
    .reduce((sum, s) => sum + s.grandTotal, 0);
  const totalTransfer = todaySales
    .filter((s) => s.paymentMethod === 'TRANSFER_BANK')
    .reduce((sum, s) => sum + s.grandTotal, 0);

  const averageBasket =
    todaySales.length > 0 ? Math.round(totalOmzetToday / todaySales.length) : 0;

  return (
    <div className="space-y-6">
      {/* Kasir Top Welcome Banner */}
      <div className="bg-white rounded-2xl p-6 border border-[#F0E6E5] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF2F0] text-[#991B1B] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {language === 'id'
                ? `Shift Kasir Aktif • ${currentBranch.name}`
                : `Active Cashier Shift • ${currentBranch.name}`}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
            {language === 'id'
              ? `Semangat Bertugas, ${currentUser.name}!`
              : `Good luck on your shift, ${currentUser.name}!`}
          </h2>
          <p className="text-xs text-stone-500 max-w-xl">
            {language === 'id'
              ? 'Fokus pada kecepatan transaksi checkout, keramahan melayani pelanggan snack Lashira, dan pencatatan kas tunai laci kasir yang akurat.'
              : 'Focus on fast checkout transactions, friendly customer service, and accurate cash drawer recording.'}
          </p>
        </div>

        <button
          onClick={() => setActiveTab('pos')}
          className="px-5 py-3 bg-[#991B1B] hover:bg-[#881337] active:scale-95 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-xs flex items-center justify-center gap-2 transition"
        >
          <Store className="w-4 h-4" />
          <span>
            {language === 'id' ? 'BUKA MESIN KASIR POS' : 'OPEN POS REGISTER'}
          </span>
        </button>
      </div>

      {/* 4 Shift KPI Cards (Strictly Cashier Focus) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Kas Masuk Hari Ini */}
        <div className="bg-white p-4 rounded-2xl border border-[#F0E6E5] shadow-2xs">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">
              {language === 'id' ? 'Total Kas Masuk Shift' : 'Total Shift Revenue'}
            </span>
            <div className="p-2 bg-[#FAF2F0] text-[#991B1B] rounded-lg">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-black text-stone-900">
              Rp {totalOmzetToday.toLocaleString('id-ID')}
            </div>
            <p className="text-[11px] text-[#991B1B] font-bold mt-0.5">
              +{todaySales.length} {language === 'id' ? 'Struk Terbit' : 'Receipts Issued'}
            </p>
          </div>
        </div>

        {/* Uang Tunai di Laci (Cash Drawer) */}
        <div className="bg-white p-4 rounded-2xl border border-[#F0E6E5] shadow-2xs">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">
              {language === 'id' ? 'Uang Tunai di Laci' : 'Cash in Drawer'}
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
              <Banknote className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-black text-emerald-700">
              Rp {totalCash.toLocaleString('id-ID')}
            </div>
            <p className="text-[11px] text-stone-400 mt-0.5">
              {language === 'id' ? 'Setoran saat tutup shift' : 'Deposit at shift close'}
            </p>
          </div>
        </div>

        {/* Pembayaran QRIS & Non-Tunai */}
        <div className="bg-white p-4 rounded-2xl border border-[#F0E6E5] shadow-2xs">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">
              {language === 'id' ? 'QRIS & Transfer' : 'QRIS & Bank Transfer'}
            </span>
            <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
              <QrCode className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-black text-blue-800">
              Rp {(totalQris + totalTransfer).toLocaleString('id-ID')}
            </div>
            <p className="text-[11px] text-stone-400 mt-0.5">
              QRIS: Rp {totalQris.toLocaleString('id-ID')}
            </p>
          </div>
        </div>

        {/* Presensi Shift Kasir */}
        <div className="bg-white p-4 rounded-2xl border border-[#F0E6E5] shadow-2xs">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">
              {language === 'id' ? 'Status Jam Masuk' : 'Clock-in Status'}
            </span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-lg">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-black text-stone-900">07:45 WIB</div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{language === 'id' ? 'Hadir Tepat Waktu' : 'On Time'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Riwayat Struk Penjualan Shift & Cek Stok Toko */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Riwayat Struk Terakhir Kasir Ini (8 cols) */}
        <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-[#F0E6E5] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F0E6E5] pb-3">
            <div>
              <h3 className="font-extrabold text-sm text-stone-900">
                {language === 'id' ? 'Riwayat Struk Shift Hari Ini' : 'Shift Receipts Today'}
              </h3>
              <p className="text-[11px] text-stone-500">
                {language === 'id'
                  ? `Transaksi langsung kasir ${currentUser.name} di ${currentBranch.name}`
                  : `Direct transactions at ${currentBranch.name}`}
              </p>
            </div>
            <button
              onClick={() => setActiveTab('laporan-penjualan')}
              className="text-xs text-[#991B1B] font-bold hover:underline flex items-center gap-1"
            >
              <span>{language === 'id' ? 'Lihat Semua' : 'View All'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {todaySales.length === 0 ? (
              <div className="text-center py-10 text-stone-400 space-y-2 bg-[#FAF7F5] rounded-xl border border-dashed border-[#F0E6E5]">
                <Receipt className="w-7 h-7 mx-auto text-stone-400" />
                <p className="text-xs font-bold text-stone-700">
                  {language === 'id' ? 'Belum Ada Transaksi Shift Ini' : 'No Transactions Yet on This Shift'}
                </p>
                <button
                  onClick={() => setActiveTab('pos')}
                  className="px-4 py-2 bg-[#991B1B] text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  {language === 'id' ? 'Buka POS Sekarang' : 'Open POS Now'}
                </button>
              </div>
            ) : (
              todaySales.slice(0, 5).map((sale) => (
                <div
                  key={sale.id}
                  className="p-3 rounded-xl bg-[#FAF7F5] border border-[#F0E6E5] flex items-center justify-between text-xs hover:border-[#991B1B]/40 transition"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#991B1B]">
                        {sale.invoiceNumber}
                      </span>
                      <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-stone-200 text-stone-700">
                        {sale.paymentMethod}
                      </span>
                    </div>
                    <span className="text-[11px] text-stone-500 block">
                      {sale.customerName || 'Pelanggan Umum'} • {sale.items.length} item
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="font-black text-stone-900 block">
                        Rp {sale.grandTotal.toLocaleString('id-ID')}
                      </span>
                      <span className="text-[10px] text-stone-400">{sale.time}</span>
                    </div>
                    <button
                      onClick={() => setSelectedSaleForPrint(sale)}
                      className="p-2 bg-white border border-[#F0E6E5] hover:bg-stone-50 rounded-lg text-stone-700 transition"
                      title="Cetak Ulang Struk"
                    >
                      <Printer className="w-3.5 h-3.5 text-stone-600" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Cek Cepat Stok Toko (4 cols) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-[#F0E6E5] shadow-xs space-y-4">
          <div className="border-b border-[#F0E6E5] pb-3">
            <h3 className="font-extrabold text-sm text-stone-900">
              {language === 'id' ? 'Cek Stok Snack Toko' : 'Store Snack Stock'}
            </h3>
            <p className="text-[11px] text-stone-500">
              {language === 'id' ? 'Pantau sisa stok saat melayani antrean' : 'Monitor stock availability during rush'}
            </p>
          </div>

          <div className="space-y-2.5">
            {products.slice(0, 5).map((prod) => (
              <div
                key={prod.id}
                className="p-2.5 bg-[#FAF7F5] rounded-xl border border-[#F0E6E5] flex items-center justify-between text-xs"
              >
                <div className="truncate pr-2">
                  <span className="font-bold text-stone-900 block truncate">
                    {prod.name}
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono">
                    Rp {prod.sellingPrice.toLocaleString('id-ID')}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white border border-[#F0E6E5] text-stone-800 flex-shrink-0">
                  {language === 'id' ? 'Tersedia' : 'In Stock'}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setActiveTab('pos')}
            className="w-full py-2.5 bg-[#FAF2F0] hover:bg-[#FCE7E7] text-[#991B1B] text-xs font-bold rounded-xl transition"
          >
            {language === 'id' ? '+ Transaksi POS Baru' : '+ New POS Transaction'}
          </button>
        </div>
      </div>
    </div>
  );
};
