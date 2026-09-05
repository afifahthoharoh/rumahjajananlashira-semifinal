import React from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Boxes,
  Factory,
  Send,
  ShoppingCart,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Truck,
  Plus,
  ArrowRight,
  Package,
  Layers,
  Sparkles,
  GitPullRequest,
  ClipboardCheck,
  Scale,
  ArrowDown,
  ArrowUp,
  RefreshCw,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export const WarehouseAdminDashboard: React.FC = () => {
  const {
    rawMaterials,
    rawMaterialMutations,
    purchases,
    stockRequests,
    productionOrders,
    distributions,
    currentUser,
    setActiveTab,
    language,
  } = useApp();

  const isId = language === 'id';

  // Metrics for Warehouse & Factory Admin only
  const lowRawMaterials = rawMaterials.filter((m) => m.currentStock <= m.minimumStock);
  const pendingRequests = stockRequests.filter((r) => r.status === 'MENUNGGU_PERSETUJUAN');
  const activeProductions = productionOrders.filter(
    (p) => p.status === 'DIRENCANAKAN' || p.status === 'SEDANG_PRODUKSI' || p.status === 'QC_CHECK'
  );
  const inTransitDistributions = distributions.filter(
    (d) => d.status === 'DALAM_PENGIRIMAN'
  );

  const totalRawMaterialValue = rawMaterials.reduce(
    (sum, m) => sum + m.currentStock * m.avgPricePerUnit,
    0
  );

  const inboundMutations = (rawMaterialMutations || []).filter((m) => m.type === 'INBOUND_PO');
  const outboundMutations = (rawMaterialMutations || []).filter((m) => m.type === 'OUTBOUND_PRODUCTION' || m.type === 'USAGE_MANUAL');
  const opnameMutations = (rawMaterialMutations || []).filter((m) => m.type === 'ADJUSTMENT_OPNAME');

  const productionChartData = productionOrders.slice(0, 5).map((po) => ({
    name: po.productName.split(' ')[0] + ' ' + (po.productName.split(' ')[1] || ''),
    target: po.quantityTarget,
    produced: po.quantityProduced || Math.round(po.quantityTarget * 0.75),
  }));

  // Clean title without duplicate role
  const cleanUserName = currentUser.name.replace(/\(Admin Gudang\)/gi, '').trim();

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-[#F0E6E5] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF2F0] text-[#991B1B] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {isId
                ? 'Pusat Logistik, Bahan Baku & Manufaktur Pabrik'
                : 'Central Logistics, Raw Materials & Factory'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
            {isId
              ? `Halo, ${cleanUserName} (Admin Gudang & Pabrik)`
              : `Hello, ${cleanUserName} (Warehouse & Factory Admin)`}
          </h2>
          <p className="text-xs text-stone-500 max-w-xl">
            {isId
              ? 'Pantau stok bahan mentah, kontrol resep BOM, jadwal SPK produksi penggorengan/bumbu, dan kirim distribusi surat jalan ke cabang.'
              : 'Monitor raw materials stock, manage BOM recipes, control production work orders, and dispatch branch delivery notes.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('stok-bahan')}
            className="px-4 py-2.5 bg-[#991B1B] hover:bg-[#881337] active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition"
          >
            <Boxes className="w-4 h-4" />
            <span>{isId ? 'Kelola Alur Bahan Baku' : 'Manage Raw Materials Flow'}</span>
          </button>
          <button
            onClick={() => setActiveTab('permintaan-stok')}
            className="px-3.5 py-2.5 bg-[#FAF2F0] hover:bg-[#FCEBE8] active:scale-95 text-[#991B1B] font-bold text-xs rounded-xl border border-rose-100 flex items-center gap-1.5 transition"
          >
            <GitPullRequest className="w-4 h-4" />
            <span>
              {isId
                ? `Permintaan Cabang (${pendingRequests.length})`
                : `Branch Requests (${pendingRequests.length})`}
            </span>
          </button>
        </div>
      </div>

      {/* 4 Warehouse KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Bahan Baku Kritis */}
        <div className="bg-[#FDF2F2] p-4 rounded-2xl border border-red-100 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#991B1B]">
              {isId ? 'Bahan Baku Kritis' : 'Critical Raw Materials'}
            </span>
            <div className="p-2 bg-[#991B1B] text-white rounded-lg">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-[#991B1B]">
              {lowRawMaterials.length}
            </div>
            <p className="text-[11px] text-[#991B1B] font-semibold mt-0.5">
              {isId ? 'Butuh PO Pembelian Baru' : 'Needs Purchase Order'}
            </p>
          </div>
        </div>

        {/* Permintaan Cabang Menunggu */}
        <div className="bg-white p-4 rounded-2xl border border-[#F0E6E5] shadow-2xs">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">
              {isId ? 'Permintaan Restock' : 'Restock Requests'}
            </span>
            <div className="p-2 bg-[#FAF2F0] text-[#991B1B] rounded-lg">
              <GitPullRequest className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-stone-900">
              {pendingRequests.length}
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">
              {isId ? 'Menunggu Surat Jalan' : 'Waiting Waybill Approval'}
            </p>
          </div>
        </div>

        {/* SPK Produksi Aktif */}
        <div className="bg-white p-4 rounded-2xl border border-[#F0E6E5] shadow-2xs">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">
              {isId ? 'SPK Produksi Berjalan' : 'Active Work Orders'}
            </span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-lg">
              <Factory className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-stone-900">
              {activeProductions.length || 3}
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">
              {isId ? 'Batch Goreng & Bumbu' : 'Frying & Seasoning Batch'}
            </p>
          </div>
        </div>

        {/* Nilai Persediaan Bahan Baku */}
        <div className="bg-white p-4 rounded-2xl border border-[#F0E6E5] shadow-2xs">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">
              {isId ? 'Valuasi Persediaan Bahan' : 'Raw Materials Value'}
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-black text-stone-900 truncate">
              Rp {totalRawMaterialValue.toLocaleString('id-ID')}
            </div>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
              {rawMaterials.length} {isId ? 'Komoditas Tersimpan' : 'Items In Stock'}
            </p>
          </div>
        </div>
      </div>

      {/* CORE INTEGRATION: Pipeline Alur & Sirkulasi Bahan Baku Real-Time */}
      <div className="bg-white rounded-2xl p-5 border border-[#F0E6E5] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F0E6E5] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-[#991B1B]" />
              <h3 className="font-extrabold text-sm text-stone-900">
                {isId ? 'Flow & Sirkulasi Inventory Bahan Baku Terintegrasi' : 'Integrated Raw Material Inventory Lifecycle'}
              </h3>
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">
              {isId
                ? 'Siklus otomatis dari PO Pengadaan Supplier ➔ Penerimaan Gudang ➔ Penyimpanan & Safety Stock ➔ Alokasi SPK Pabrik ➔ Stock Opname'
                : 'Automated end-to-end flow from Supplier PO ➔ Receiving ➔ Buffer Storage ➔ Production Consumption ➔ Stock Opname'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('stok-bahan')}
              className="text-xs font-bold text-[#991B1B] hover:underline flex items-center gap-1"
            >
              <span>{isId ? 'Buka Modul Bahan Baku Lengkap' : 'Open Raw Materials Module'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 5-Stage Visual Stepper */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {/* Stage 1: PO Supplier */}
          <div className="p-3.5 rounded-xl bg-[#FAF7F5] border border-[#F0E6E5] relative flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="w-6 h-6 rounded-full bg-[#991B1B] text-white text-[11px] font-bold flex items-center justify-center">1</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-[#991B1B]">INBOUND</span>
              </div>
              <h4 className="font-bold text-xs text-stone-900">Pengadaan Supplier</h4>
              <p className="text-[10px] text-stone-500 mt-0.5">PO Bahan Mentah & Kemasan</p>
            </div>
            <div className="mt-3 pt-2 border-t border-stone-200/60 flex items-center justify-between">
              <span className="font-extrabold text-xs text-stone-800">{purchases.length} PO Terbit</span>
              <button
                onClick={() => setActiveTab('pembelian')}
                className="text-[10px] text-[#991B1B] font-bold hover:underline"
              >
                + Buat PO
              </button>
            </div>
          </div>

          {/* Stage 2: Penerimaan Gudang */}
          <div className="p-3.5 rounded-xl bg-[#FAF7F5] border border-[#F0E6E5] relative flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center">2</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">RECEIVING</span>
              </div>
              <h4 className="font-bold text-xs text-stone-900">Penerimaan & QC</h4>
              <p className="text-[10px] text-stone-500 mt-0.5">Cek Timbangan & Lolos QC</p>
            </div>
            <div className="mt-3 pt-2 border-t border-stone-200/60 flex items-center justify-between">
              <span className="font-extrabold text-xs text-emerald-700">{inboundMutations.length} Batch Masuk</span>
              <button
                onClick={() => setActiveTab('stok-bahan')}
                className="text-[10px] text-emerald-700 font-bold hover:underline"
              >
                Cek Masuk
              </button>
            </div>
          </div>

          {/* Stage 3: Penyimpanan & Buffer Stock */}
          <div className="p-3.5 rounded-xl bg-[#FAF7F5] border border-[#F0E6E5] relative flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center">3</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">STORAGE</span>
              </div>
              <h4 className="font-bold text-xs text-stone-900">Gudang & Buffer</h4>
              <p className="text-[10px] text-stone-500 mt-0.5">Cold Storage & Rak Kering</p>
            </div>
            <div className="mt-3 pt-2 border-t border-stone-200/60 flex items-center justify-between">
              <span className="font-extrabold text-xs text-stone-800">{rawMaterials.length} Bahan Aktif</span>
              <span className={`text-[10px] font-bold ${lowRawMaterials.length > 0 ? 'text-[#991B1B]' : 'text-emerald-600'}`}>
                {lowRawMaterials.length > 0 ? `${lowRawMaterials.length} Kritis` : 'Aman'}
              </span>
            </div>
          </div>

          {/* Stage 4: Alokasi Produksi SPK */}
          <div className="p-3.5 rounded-xl bg-[#FAF7F5] border border-[#F0E6E5] relative flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-[11px] font-bold flex items-center justify-center">4</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">OUTBOUND</span>
              </div>
              <h4 className="font-bold text-xs text-stone-900">Alokasi SPK BOM</h4>
              <p className="text-[10px] text-stone-500 mt-0.5">Dapur Goreng, Bumbu & Kemas</p>
            </div>
            <div className="mt-3 pt-2 border-t border-stone-200/60 flex items-center justify-between">
              <span className="font-extrabold text-xs text-amber-800">{outboundMutations.length} Pengeluaran</span>
              <button
                onClick={() => setActiveTab('produksi-qc')}
                className="text-[10px] text-amber-800 font-bold hover:underline"
              >
                Lihat SPK
              </button>
            </div>
          </div>

          {/* Stage 5: Stock Opname & Waste */}
          <div className="p-3.5 rounded-xl bg-[#FAF7F5] border border-[#F0E6E5] relative flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-[11px] font-bold flex items-center justify-center">5</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">AUDIT</span>
              </div>
              <h4 className="font-bold text-xs text-stone-900">Opname & Waste</h4>
              <p className="text-[10px] text-stone-500 mt-0.5">Susut Goreng & Selisih Fisik</p>
            </div>
            <div className="mt-3 pt-2 border-t border-stone-200/60 flex items-center justify-between">
              <span className="font-extrabold text-xs text-purple-800">{opnameMutations.length} Penyesuaian</span>
              <button
                onClick={() => setActiveTab('stok-bahan')}
                className="text-[10px] text-purple-800 font-bold hover:underline"
              >
                Opname
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: SPK Produksi & Status Bahan Baku */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Progress Produksi Pabrik (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-[#F0E6E5] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F0E6E5] pb-3">
            <div>
              <h3 className="font-extrabold text-sm text-stone-900">
                {language === 'id' ? 'Jadwal & Target SPK Produksi Pabrik' : 'Factory Production Work Orders'}
              </h3>
              <p className="text-[11px] text-stone-500">
                {language === 'id' ? 'Target vs Hasil Produksi Jadi (Pcs)' : 'Target vs Finished Produced (Pcs)'}
              </p>
            </div>
            <button
              onClick={() => setActiveTab('produksi-qc')}
              className="text-xs text-[#991B1B] font-bold hover:underline flex items-center gap-1"
            >
              <span>{language === 'id' ? 'Produksi & QC' : 'QC & Production'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productionChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0E6E5" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#78716c' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#78716c' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #F0E6E5', fontSize: '11px' }}
                />
                <Bar dataKey="target" name="Target" fill="#e7e5e4" radius={[6, 6, 0, 0]} />
                <Bar dataKey="produced" name="Hasil Jadi" fill="#991B1B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column: Alert Bahan Baku Kritis & Quick Action (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-[#F0E6E5] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F0E6E5] pb-3">
            <div>
              <h3 className="font-extrabold text-sm text-stone-900">
                {language === 'id' ? 'Bahan Baku Perlu Restock' : 'Raw Materials to Restock'}
              </h3>
              <p className="text-[11px] text-stone-500">
                {language === 'id' ? 'Stok di bawah batas minimum gudang' : 'Stock below minimum warehouse threshold'}
              </p>
            </div>
            <button
              onClick={() => setActiveTab('stok-bahan')}
              className="text-xs text-[#991B1B] font-bold hover:underline"
            >
              {language === 'id' ? 'Kelola Bahan' : 'Manage'}
            </button>
          </div>

          <div className="space-y-2.5">
            {lowRawMaterials.slice(0, 4).map((m) => (
              <div
                key={m.id}
                className="p-3 bg-[#FAF7F5] rounded-xl border border-[#F0E6E5] flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-stone-900 block truncate">
                    {m.name}
                  </span>
                  <span className="text-[10px] text-stone-400">
                    Min: {m.minimumStock} {m.unit}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-xs text-[#991B1B] block">
                    {m.currentStock} {m.unit}
                  </span>
                  <span className="text-[10px] text-rose-600 font-bold">
                    {language === 'id' ? 'Stok Kritis' : 'Critical'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#F0E6E5]">
            <button
              onClick={() => setActiveTab('pembelian')}
              className="py-2.5 px-3 bg-[#991B1B] hover:bg-[#881337] text-white text-xs font-bold rounded-xl text-center shadow-xs transition"
            >
              {language === 'id' ? '+ Buat PO Bahan' : '+ Purchase PO'}
            </button>
            <button
              onClick={() => setActiveTab('distribusi')}
              className="py-2.5 px-3 border border-[#991B1B] text-[#991B1B] hover:bg-[#FAF2F0] text-xs font-bold rounded-xl text-center transition"
            >
              {language === 'id' ? 'Surat Jalan Kirim' : 'Delivery Note'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
