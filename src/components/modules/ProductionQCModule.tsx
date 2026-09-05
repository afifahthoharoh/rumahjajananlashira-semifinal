import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductionOrder } from '../../types';
import {
  Factory,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  PackageCheck,
  X,
  Play,
  Check,
  Layers,
} from 'lucide-react';

export const ProductionQCModule: React.FC = () => {
  const {
    productionOrders,
    products,
    recipes,
    rawMaterials,
    createProductionOrder,
    updateProductionStatus,
    currentUser,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State for new production run
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [targetQty, setTargetQty] = useState(100);
  const [operatorName, setOperatorName] = useState(currentUser.name || 'Asep Sunandar');
  const [supervisorName, setSupervisorName] = useState('Budi Santoso');
  const [notes, setNotes] = useState('Goreng suhu 160°C minyak baru.');

  // Find recipe for selected product
  const matchedRecipe = recipes.find((r) => r.productId === selectedProductId);

  const handleOpenAdd = () => {
    setSelectedProductId(products[0]?.id || '');
    setTargetQty(100);
    setShowAddModal(true);
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find((p) => p.id === selectedProductId);
    if (!prod) return;

    createProductionOrder({
      productId: prod.id,
      productName: prod.name,
      quantityTarget: targetQty,
      operatorName,
      supervisorName,
      unitHpp: prod.hpp,
      notes,
    });

    setShowAddModal(false);
  };

  const filteredOrders = productionOrders.filter((po) => {
    const matchSearch =
      po.productionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.batchNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || po.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Factory className="w-5 h-5 text-red-600" />
            <h2 className="font-extrabold text-lg text-stone-900">MODUL 5: Perintah Produksi & Quality Control (QC)</h2>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Setiap batch produksi yang selesai otomatis memotong stok bahan baku dan menambah stok produk jadi di Gudang Pusat.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4" />
          Mulai Batch Produksi Baru
        </button>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nomor batch, kode SPK produksi, atau nama snack..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs outline-none focus:border-red-500 transition font-medium"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-stone-200 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:border-red-500"
        >
          <option value="ALL">Semua Status Batch</option>
          <option value="SEDANG_PRODUKSI">Sedang Dimasak / Digoreng</option>
          <option value="QC_CHECK">Proses Uji QC</option>
          <option value="SELESAI">Lulus QC & Selesai</option>
        </select>
      </div>

      {/* Production Orders Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOrders.map((order) => {
          const isDone = order.status === 'SELESAI';
          const isQC = order.status === 'QC_CHECK';

          return (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-[10px] font-bold bg-stone-100 text-stone-700 px-2 py-0.5 rounded border border-stone-200">
                      {order.batchNumber}
                    </span>
                    <h3 className="font-extrabold text-sm text-stone-900 mt-1">{order.productName}</h3>
                    <p className="text-[11px] text-stone-500">SPK: {order.productionNumber}</p>
                  </div>

                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                      isDone
                        ? 'bg-emerald-100 text-emerald-800'
                        : isQC
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800 animate-pulse'
                    }`}
                  >
                    {isDone ? 'SELESAI & MASUK GUDANG' : isQC ? 'QC TASTE & SEAL' : 'PROSES GORENG'}
                  </span>
                </div>

                {/* Progress Details */}
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Target Output:</span>
                    <span className="font-bold text-stone-900">{order.quantityTarget} pcs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Hasil Bagus (Lulus):</span>
                    <span className="font-bold text-emerald-700">{order.quantityProduced} pcs</span>
                  </div>
                  {order.quantityDefect > 0 && (
                    <div className="flex justify-between text-rose-600">
                      <span>Produk Rusak / Gosong:</span>
                      <span className="font-bold">{order.quantityDefect} pcs</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-1 border-t border-stone-200">
                    <span className="text-stone-500">HPP Satuan:</span>
                    <span className="font-bold text-stone-900">
                      Rp {order.unitHpp.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-stone-600 space-y-0.5">
                  <p>Operator: <span className="font-semibold text-stone-800">{order.operatorName}</span></p>
                  <p>Supervisor: <span className="font-semibold text-stone-800">{order.supervisorName}</span></p>
                  {order.qcNotes && (
                    <p className="text-stone-500 italic mt-1">QC: {order.qcNotes}</p>
                  )}
                </div>
              </div>

              {/* Action Buttons depending on status */}
              <div className="pt-3 border-t border-stone-100">
                {order.status === 'SEDANG_PRODUKSI' && (
                  <button
                    onClick={() => updateProductionStatus(order.id, 'QC_CHECK')}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow transition"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Selesai Masak & Ajukan QC
                  </button>
                )}

                {order.status === 'QC_CHECK' && (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() =>
                        updateProductionStatus(
                          order.id,
                          'SELESAI',
                          order.quantityTarget - 2,
                          2,
                          'PASSED',
                          'Renyah pas, bumbu gurih merata, kemasan seal rapat.'
                        )
                      }
                      className="py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 shadow transition"
                    >
                      <Check className="w-4 h-4" />
                      Lulus QC (100%)
                    </button>
                    <button
                      onClick={() =>
                        updateProductionStatus(
                          order.id,
                          'SELESAI',
                          order.quantityTarget,
                          0,
                          'PASSED',
                          'Sempurna tanpa reject.'
                        )
                      }
                      className="py-2 bg-stone-800 hover:bg-stone-900 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 shadow transition"
                    >
                      Lulus Penuh
                    </button>
                  </div>
                )}

                {order.status === 'SELESAI' && (
                  <div className="flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-xl border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4" />
                    Stok Gudang Pusat Ditambahkan (+{order.quantityProduced} pcs)
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Production Order Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-stone-200">
            <div className="p-4 bg-red-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Factory className="w-5 h-5" />
                <h3 className="font-bold text-sm">Buat Perintah Masak / SPK Produksi</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Pilih Produk Snack</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full p-2.5 border border-stone-200 rounded-xl font-bold"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.weightGrams}g) • HPP: Rp {p.hpp.toLocaleString('id-ID')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Target Output (Pcs)</label>
                  <input
                    type="number"
                    min="10"
                    step="10"
                    required
                    value={targetQty}
                    onChange={(e) => setTargetQty(Number(e.target.value) || 10)}
                    className="w-full p-2.5 border border-stone-200 rounded-xl font-bold text-center"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Estimasi Nomor Batch</label>
                  <input
                    type="text"
                    disabled
                    value={`BATCH-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-0${productionOrders.length + 1}`}
                    className="w-full p-2.5 bg-stone-100 border border-stone-200 rounded-xl font-mono text-stone-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Nama Operator Masak</label>
                  <input
                    type="text"
                    required
                    value={operatorName}
                    onChange={(e) => setOperatorName(e.target.value)}
                    className="w-full p-2.5 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Supervisor QC</label>
                  <input
                    type="text"
                    required
                    value={supervisorName}
                    onChange={(e) => setSupervisorName(e.target.value)}
                    className="w-full p-2.5 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Instruksi Khusus / Catatan</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 border border-stone-200 rounded-xl"
                />
              </div>

              {/* Automatic BOM usage warning */}
              <div className="p-3 bg-red-50 rounded-xl border border-red-100 text-stone-700 space-y-1">
                <div className="font-bold text-red-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-red-600" />
                  Sistem Otomatisasi Terintegrasi
                </div>
                <p className="text-[11px] text-stone-600">
                  Saat batch ini selesai diverifikasi QC, sistem otomatis memotong stok bahan baku dan menambah persediaan barang jadi di Gudang Pusat.
                </p>
              </div>

              <div className="pt-2 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow"
                >
                  Mulai Produksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
