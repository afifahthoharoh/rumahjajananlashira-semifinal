import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  GitPullRequest,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  X,
  Package,
  Store,
} from 'lucide-react';

export const StockRequestsModule: React.FC = () => {
  const {
    stockRequests,
    products,
    branches,
    currentUser,
    createStockRequest,
    processStockRequest,
    setActiveTab,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [items, setItems] = useState([
    {
      productId: products[0]?.id || '',
      productName: products[0]?.name || '',
      sku: products[0]?.sku || '',
      requestedQty: 30,
    },
  ]);
  const [notes, setNotes] = useState('Stok di etalase toko tersisa sedikit, akhir pekan ramai.');

  const handleAddItem = () => {
    const p = products[0];
    if (!p) return;
    setItems([
      ...items,
      {
        productId: p.id,
        productName: p.name,
        sku: p.sku,
        requestedQty: 20,
      },
    ]);
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const updated = [...items];
    if (field === 'productId') {
      const p = products.find((prod) => prod.id === value);
      if (p) {
        updated[index].productId = p.id;
        updated[index].productName = p.name;
        updated[index].sku = p.sku;
      }
    } else if (field === 'requestedQty') {
      updated[index].requestedQty = Math.max(1, Number(value) || 1);
    }
    setItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    createStockRequest({
      branchId: currentUser.branchId === 'BR-PUSAT' ? 'BR-01' : currentUser.branchId,
      branchName:
        currentUser.branchId === 'BR-PUSAT' ? 'Cabang Dago Bandung' : currentUser.branchName,
      items,
      notes,
    });

    setShowAddModal(false);
  };

  const filteredRequests = stockRequests.filter(
    (r) =>
      r.requestNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.branchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.requestedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <GitPullRequest className="w-5 h-5 text-red-600" />
            <h2 className="font-extrabold text-lg text-stone-900">MODUL 10: Permintaan Restock dari Cabang</h2>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Outlet cabang mengajukan permintaan stok tambahan ke Gudang Pusat. Pusat dapat menyetujui dan langsung menerbitkan Surat Jalan.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4" />
          Ajukan Permintaan Restock
        </button>
      </div>

      {/* Filter */}
      <div className="relative">
        <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Cari nomor permintaan, nama cabang, atau staf pemohon..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs outline-none focus:border-red-500 transition font-medium"
        />
      </div>

      {/* Requests Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRequests.map((req) => {
          const isPending = req.status === 'MENUNGGU_PERSETUJUAN';
          const isApproved = req.status === 'DISETUJUI';
          const isShipped = req.status === 'SEDANG_DIKIRIM';
          const totalQty = req.items.reduce((s, i) => s + i.requestedQty, 0);

          return (
            <div
              key={req.id}
              className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-[10px] font-bold bg-stone-100 text-stone-700 px-2 py-0.5 rounded border border-stone-200">
                      {req.requestNumber}
                    </span>
                    <h3 className="font-extrabold text-sm text-stone-900 mt-1 flex items-center gap-1.5">
                      <Store className="w-4 h-4 text-red-600" />
                      {req.branchName}
                    </h3>
                    <p className="text-[11px] text-stone-500">
                      Diajukan oleh: <span className="font-semibold text-stone-700">{req.requestedBy}</span> ({req.requestDate})
                    </p>
                  </div>

                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                      isPending
                        ? 'bg-amber-100 text-amber-800 animate-pulse'
                        : isApproved || isShipped
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {isPending
                      ? 'MENUNGGU ACC PUSAT'
                      : isShipped
                      ? 'SEDANG DIKIRIM (OTW)'
                      : isApproved
                      ? 'DISETUJUI PUSAT'
                      : 'DITOLAK'}
                  </span>
                </div>

                {/* Items in this request */}
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 space-y-1.5 text-xs">
                  <div className="font-bold text-stone-700 flex justify-between">
                    <span>Permintaan Snack ({req.items.length} Macam):</span>
                    <span className="text-red-700 font-black">{totalQty} pcs</span>
                  </div>
                  <div className="divide-y divide-stone-200 pt-1">
                    {req.items.map((it, idx) => (
                      <div key={idx} className="py-1 flex justify-between text-[11px]">
                        <span className="font-medium text-stone-800">{it.productName}</span>
                        <span className="font-bold text-stone-900">{it.requestedQty} pcs</span>
                      </div>
                    ))}
                  </div>
                </div>

                {req.notes && (
                  <p className="text-[11px] text-stone-600 italic bg-amber-50/50 p-2 rounded-lg border border-amber-100">
                    Catatan Cabang: &quot;{req.notes}&quot;
                  </p>
                )}
              </div>

              {/* Action Buttons for Center Warehouse / Owner */}
              <div className="pt-3 border-t border-stone-100">
                {isPending ? (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => processStockRequest(req.id, 'DISETUJUI')}
                      className="py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 shadow transition"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Setujui & Kirim
                    </button>
                    <button
                      onClick={() => processStockRequest(req.id, 'DITOLAK')}
                      className="py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition"
                    >
                      <XCircle className="w-4 h-4 text-rose-500" />
                      Tolak
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span>Diproses oleh: Admin Gudang Pusat</span>
                    <button
                      onClick={() => setActiveTab('distribusi')}
                      className="text-red-600 font-bold hover:underline flex items-center gap-1"
                    >
                      Lihat Surat Jalan &rarr;
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Stock Request Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-stone-200 flex flex-col max-h-[90vh]">
            <div className="p-4 bg-red-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GitPullRequest className="w-5 h-5" />
                <h3 className="font-bold text-sm">Ajukan Restock Barang ke Pusat</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[10px] font-bold text-stone-500 block uppercase">CABANG PEMOHON:</span>
                <span className="font-extrabold text-sm text-stone-900">
                  {currentUser.branchId === 'BR-PUSAT' ? 'Cabang Dago Bandung' : currentUser.branchName}
                </span>
              </div>

              {/* Items Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-stone-700 uppercase tracking-wider text-[10px]">
                    Daftar Snack yang Diminta
                  </label>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Tambah Produk
                  </button>
                </div>

                <div className="space-y-2 border border-stone-200 p-3 rounded-xl bg-stone-50">
                  {items.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-white p-2.5 rounded-lg border border-stone-200">
                      <div className="col-span-8">
                        <select
                          value={item.productId}
                          onChange={(e) => handleItemChange(idx, 'productId', e.target.value)}
                          className="w-full p-1.5 border border-stone-200 rounded-lg text-xs font-semibold"
                        >
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} ({p.weightGrams}g)
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-span-3">
                        <input
                          type="number"
                          min="1"
                          value={item.requestedQty}
                          onChange={(e) => handleItemChange(idx, 'requestedQty', e.target.value)}
                          className="w-full p-1.5 border border-stone-200 rounded-lg font-bold text-center"
                        />
                      </div>

                      <div className="col-span-1 text-center">
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="text-rose-500 hover:bg-rose-50 p-1 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Catatan / Alasan Permintaan</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 border border-stone-200 rounded-xl"
                  placeholder="Contoh: Stok Basreng dan Makaroni habis terjual..."
                />
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
                  Kirim Pengajuan ke Pusat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
