import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Store,
  DollarSign,
  Package,
  Layers,
  Send,
  Truck,
  AlertTriangle,
  CheckCircle2,
  Plus,
  ArrowRight,
  TrendingUp,
  ShoppingBag,
  Sparkles,
  Clock,
  GitPullRequest,
} from 'lucide-react';

export const BranchStoreAdminDashboard: React.FC = () => {
  const {
    sales,
    branchStocks,
    stockRequests,
    distributions,
    currentUser,
    branches,
    setActiveTab,
    createStockRequest,
    receiveStockTransfer,
    products,
    language,
  } = useApp();

  const currentBranchId = currentUser.branchId || 'BR-01';
  const currentBranch = branches.find((b) => b.id === currentBranchId) || branches[1];
  const todayStr = new Date().toISOString().split('T')[0];

  // Strictly filter data to CURRENT BRANCH only
  const branchSalesToday = sales.filter(
    (s) => s.branchId === currentBranchId && s.date === todayStr
  );
  const branchSalesMonth = sales.filter(
    (s) => s.branchId === currentBranchId && s.date.startsWith('2026-09')
  );

  const totalOmzetToday = branchSalesToday.reduce(
    (sum, s) => sum + (s.grandTotal || 0),
    0
  );
  const totalOmzetMonth =
    branchSalesMonth.reduce((sum, s) => sum + (s.grandTotal || 0), 0) +
    (currentBranchId === 'BR-01' ? 14500000 : 9600000);

  const myStocks = branchStocks.filter((b) => b.branchId === currentBranchId);
  const lowStocks = myStocks.filter((b) => b.stockQty <= b.minimumStock);
  const incomingShipments = distributions.filter(
    (d) => d.toBranchId === currentBranchId && d.status === 'DALAM_PENGIRIMAN'
  );

  // Quick state for restock request
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestItem, setRequestItem] = useState({
    productId: products[0]?.id || 'p-01',
    qty: 50,
  });

  const handleQuickRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find((p) => p.id === requestItem.productId);
    createStockRequest({
      branchId: currentBranchId,
      branchName: currentBranch.name,
      requestDate: todayStr,
      requiredDate: todayStr,
      items: [
        {
          productId: requestItem.productId,
          productName: prod ? prod.name : 'Basreng Pedas 250gr',
          currentStock: 10,
          requestedQty: requestItem.qty,
        },
      ],
      urgency: 'TINGGI',
      requestedBy: currentUser.name,
      notes: 'Permintaan restock cepat dari dashboard toko cabang',
    });
    setShowRequestModal(false);
    alert(
      language === 'id'
        ? 'Permintaan restock berhasil dikirim ke Gudang Pusat!'
        : 'Restock request sent to Central Warehouse!'
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-[#F0E6E5] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF2F0] text-[#991B1B] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {language === 'id'
                ? `Operasional Outlet Retail • ${currentBranch.name}`
                : `Retail Outlet Operations • ${currentBranch.name}`}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
            {language === 'id'
              ? `Dashboard Toko ${currentBranch.name}`
              : `${currentBranch.name} Store Dashboard`}
          </h2>
          <p className="text-xs text-stone-500 max-w-xl">
            {language === 'id'
              ? 'Kelola ketersediaan snack di rak toko, pantau omset kasir cabang, dan ajukan permintaan restock ke gudang pusat.'
              : 'Manage store snack inventory on shelves, monitor branch cashier revenue, and request restock from central warehouse.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRequestModal(true)}
            className="px-4 py-2.5 bg-[#991B1B] hover:bg-[#881337] active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition"
          >
            <GitPullRequest className="w-4 h-4" />
            <span>
              {language === 'id' ? '+ Request Restock Pusat' : '+ Restock Request'}
            </span>
          </button>
        </div>
      </div>

      {/* 4 Branch KPI Cards (Strictly Branch Store Focus) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Omset Toko Hari Ini */}
        <div className="bg-white p-4 rounded-2xl border border-[#F0E6E5] shadow-2xs">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">
              {language === 'id' ? 'Omset Toko Hari Ini' : 'Today Store Sales'}
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
              +{branchSalesToday.length} {language === 'id' ? 'Pelanggan Walk-in' : 'Customers'}
            </p>
          </div>
        </div>

        {/* Omset Toko Bulan Ini */}
        <div className="bg-white p-4 rounded-2xl border border-[#F0E6E5] shadow-2xs">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">
              {language === 'id' ? 'Omset Toko Bulan Ini' : 'Monthly Store Sales'}
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-black text-stone-900">
              Rp {totalOmzetMonth.toLocaleString('id-ID')}
            </div>
            <p className="text-[11px] text-emerald-600 font-bold mt-0.5">
              100% {language === 'id' ? 'Target Cabang' : 'Branch Target'}
            </p>
          </div>
        </div>

        {/* Kiriman Masuk dari Pusat */}
        <div className="bg-white p-4 rounded-2xl border border-[#F0E6E5] shadow-2xs">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">
              {language === 'id' ? 'Kiriman Menuju Toko' : 'Incoming Shipments'}
            </span>
            <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-black text-stone-900">
              {incomingShipments.length}
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">
              {language === 'id' ? 'Mobil Box Dalam Perjalanan' : 'Vehicles in Transit'}
            </p>
          </div>
        </div>

        {/* Stok Snack Menipis */}
        <div className="bg-[#FDF2F2] p-4 rounded-2xl border border-red-100 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#991B1B]">
              {language === 'id' ? 'Stok Snack Menipis' : 'Low Stock Snacks'}
            </span>
            <div className="p-2 bg-[#991B1B] text-white rounded-lg">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-black text-[#991B1B]">
              {lowStocks.length}
            </div>
            <p className="text-[11px] text-[#991B1B] font-semibold mt-0.5">
              {language === 'id' ? 'Butuh Permintaan Restock' : 'Needs Restock'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Kiriman Masuk & Stok Toko */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Kiriman Distribusi dari Pusat (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-[#F0E6E5] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F0E6E5] pb-3">
            <div>
              <h3 className="font-extrabold text-sm text-stone-900">
                {language === 'id' ? 'Kiriman Stok Masuk dari Gudang Pusat' : 'Incoming Shipments from Central Warehouse'}
              </h3>
              <p className="text-[11px] text-stone-500">
                {language === 'id' ? 'Konfirmasi terima barang saat mobil armada tiba' : 'Confirm reception when truck arrives'}
              </p>
            </div>
            <button
              onClick={() => setActiveTab('distribusi')}
              className="text-xs text-[#991B1B] font-bold hover:underline flex items-center gap-1"
            >
              <span>{language === 'id' ? 'Semua Kiriman' : 'All Shipments'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {incomingShipments.length === 0 ? (
              <div className="text-center py-10 text-stone-400 space-y-1 bg-[#FAF7F5] rounded-xl border border-dashed border-[#F0E6E5]">
                <Truck className="w-7 h-7 mx-auto text-stone-400 mb-1" />
                <p className="text-xs font-bold text-stone-700">
                  {language === 'id' ? 'Tidak Ada Kiriman Dalam Perjalanan' : 'No Inbound Shipments Currently in Transit'}
                </p>
                <p className="text-[11px] text-stone-400">
                  {language === 'id' ? 'Semua pesanan cabang telah diterima.' : 'All branch orders have arrived.'}
                </p>
              </div>
            ) : (
              incomingShipments.map((d) => (
                <div
                  key={d.id}
                  className="p-3.5 rounded-xl bg-[#FAF7F5] border border-[#F0E6E5] flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#991B1B]">
                        {d.transferNumber}
                      </span>
                      <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        {language === 'id' ? 'Dalam Perjalanan' : 'In Transit'}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 mt-1">
                      Kurir: <strong>{d.driverName}</strong> • {d.vehiclePlate}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      receiveStockTransfer(d.id, d.items);
                      alert(language === 'id' ? 'Stok berhasil diterima dan masuk ke toko!' : 'Stock received successfully!');
                    }}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition"
                  >
                    {language === 'id' ? 'Konfirmasi Terima' : 'Confirm Receipt'}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Snack Menipis di Rak Toko (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-[#F0E6E5] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F0E6E5] pb-3">
            <div>
              <h3 className="font-extrabold text-sm text-stone-900">
                {language === 'id' ? 'Stok Snack Cabang Menipis' : 'Low Stock on Shelf'}
              </h3>
              <p className="text-[11px] text-stone-500">
                {language === 'id' ? 'Segera request agar rak toko tidak kosong' : 'Restock before shelf runs empty'}
              </p>
            </div>
            <button
              onClick={() => setActiveTab('stok-produk')}
              className="text-xs text-[#991B1B] font-bold hover:underline"
            >
              {language === 'id' ? 'Cek Rak' : 'Check Shelf'}
            </button>
          </div>

          <div className="space-y-2.5">
            {lowStocks.slice(0, 4).map((stk) => (
              <div
                key={stk.id}
                className="p-3 bg-[#FAF7F5] rounded-xl border border-[#F0E6E5] flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-stone-900 block truncate">
                    {stk.productName}
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono">
                    SKU: {stk.sku}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-xs text-[#991B1B] block">
                    {stk.stockQty} Pcs
                  </span>
                  <span className="text-[10px] text-stone-400">
                    Min: {stk.minimumStock}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowRequestModal(true)}
            className="w-full py-2.5 bg-[#991B1B] hover:bg-[#881337] text-white text-xs font-bold rounded-xl shadow-xs transition"
          >
            {language === 'id' ? '+ Buat Permintaan Restock Cepat' : '+ Quick Restock Request'}
          </button>
        </div>
      </div>

      {/* Quick Restock Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-extrabold text-base text-stone-900">
                {language === 'id' ? 'Request Restock ke Gudang Pusat' : 'Restock Request to Central Warehouse'}
              </h3>
              <button
                onClick={() => setShowRequestModal(false)}
                className="text-stone-400 hover:text-stone-600 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleQuickRequest} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  {language === 'id' ? 'Pilih Produk Snack' : 'Select Snack Product'}
                </label>
                <select
                  value={requestItem.productId}
                  onChange={(e) =>
                    setRequestItem({ ...requestItem, productId: e.target.value })
                  }
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.sku})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  {language === 'id' ? 'Jumlah Permintaan (Pcs)' : 'Requested Quantity (Pcs)'}
                </label>
                <input
                  type="number"
                  min="10"
                  value={requestItem.qty}
                  onChange={(e) =>
                    setRequestItem({ ...requestItem, qty: Number(e.target.value) || 10 })
                  }
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl font-bold"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="px-4 py-2 border border-stone-200 text-stone-600 rounded-xl font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#991B1B] hover:bg-[#881337] text-white rounded-xl font-bold"
                >
                  Kirim Permintaan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
