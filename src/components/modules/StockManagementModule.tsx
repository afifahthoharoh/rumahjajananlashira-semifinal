import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Layers,
  Search,
  Store,
  AlertTriangle,
  RefreshCw,
  Edit2,
  CheckCircle2,
  Package,
  ArrowRight,
  TrendingDown,
  Building,
  X,
} from 'lucide-react';

export const StockManagementModule: React.FC = () => {
  const {
    branchStocks,
    branches,
    products,
    updateBranchStock,
    currentUser,
    setActiveTab,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranchId, setSelectedBranchId] = useState('ALL');
  const [showOpnameModal, setShowOpnameModal] = useState(false);
  const [opnameItem, setOpnameItem] = useState<{
    branchId: string;
    productId: string;
    productName: string;
    currentQty: number;
    realQty: number;
    notes: string;
  } | null>(null);

  const handleOpenOpname = (bs: (typeof branchStocks)[0]) => {
    setOpnameItem({
      branchId: bs.branchId,
      productId: bs.productId,
      productName: bs.productName,
      currentQty: bs.stockQty,
      realQty: bs.stockQty,
      notes: 'Penyesuaian stok opname fisik akhir shift.',
    });
    setShowOpnameModal(true);
  };

  const handleSaveOpname = (e: React.FormEvent) => {
    e.preventDefault();
    if (!opnameItem) return;

    updateBranchStock(
      opnameItem.branchId,
      opnameItem.productId,
      opnameItem.realQty,
      `Stok Opname Fisik: ${opnameItem.notes}`
    );

    setShowOpnameModal(false);
  };

  const filteredStocks = branchStocks.filter((bs) => {
    const matchSearch =
      bs.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bs.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bs.branchName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchBranch = selectedBranchId === 'ALL' || bs.branchId === selectedBranchId;
    return matchSearch && matchBranch;
  });

  return (
    <div className="space-y-6">
      {/* Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-red-600" />
            <h2 className="font-extrabold text-lg text-stone-900">MODUL 8: Manajemen Stok Multi-Cabang & Opname</h2>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Monitor posisi persediaan snack di Gudang Pusat dan seluruh outlet cabang secara realtime tanpa delay.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('permintaan-stok')}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow flex items-center gap-2 transition"
          >
            <RefreshCw className="w-4 h-4" />
            Minta Restock Barang
          </button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama produk snack, SKU, atau cabang..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs outline-none focus:border-red-500 transition font-medium"
          />
        </div>

        <select
          value={selectedBranchId}
          onChange={(e) => setSelectedBranchId(e.target.value)}
          className="bg-white border border-stone-200 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:border-red-500"
        >
          <option value="ALL">Semua Cabang & Gudang</option>
          {branches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name} ({b.city})
            </option>
          ))}
        </select>
      </div>

      {/* Multi Branch Stock Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-stone-50 text-stone-700 font-bold border-b border-stone-200 uppercase text-[10px]">
              <tr>
                <th className="p-3.5">Nama Cabang / Unit</th>
                <th className="p-3.5">SKU & Produk Snack</th>
                <th className="p-3.5 text-center">Stok Tersedia</th>
                <th className="p-3.5 text-center">Batas Minimum</th>
                <th className="p-3.5 text-center">Status Stok</th>
                <th className="p-3.5 text-right">Aksi Opname</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredStocks.map((bs) => {
                const isLow = bs.stockQty <= bs.minimumStock;
                const isWarehouse = bs.branchId === 'BR-PUSAT';

                return (
                  <tr
                    key={bs.id}
                    className={`hover:bg-stone-50/80 transition ${isLow ? 'bg-rose-50/20' : ''}`}
                  >
                    <td className="p-3.5 font-medium">
                      <div className="flex items-center gap-2">
                        {isWarehouse ? (
                          <Building className="w-4 h-4 text-stone-600" />
                        ) : (
                          <Store className="w-4 h-4 text-red-600" />
                        )}
                        <div>
                          <span className="font-bold text-stone-900 block">{bs.branchName}</span>
                          <span className="text-[10px] text-stone-500">
                            {isWarehouse ? 'Gudang Pusat' : 'Outlet Penjualan'}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <span className="font-mono text-[10px] font-bold text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded">
                        {bs.sku}
                      </span>
                      <span className="font-bold text-stone-900 block mt-0.5">{bs.productName}</span>
                    </td>

                    <td className="p-3.5 text-center">
                      <span className="text-base font-black text-stone-900">
                        {bs.stockQty} <span className="text-xs font-semibold text-stone-500">pcs</span>
                      </span>
                    </td>

                    <td className="p-3.5 text-center font-semibold text-stone-600">
                      {bs.minimumStock} pcs
                    </td>

                    <td className="p-3.5 text-center">
                      {isLow ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 animate-pulse">
                          <AlertTriangle className="w-3 h-3" />
                          MENIPIS (Restock!)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3" />
                          AMAN
                        </span>
                      )}
                    </td>

                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleOpenOpname(bs)}
                        className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-bold transition inline-flex items-center gap-1.5"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-stone-600" />
                        Stok Opname
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Opname Modal */}
      {showOpnameModal && opnameItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-stone-200">
            <div className="p-4 bg-red-700 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Penyesuaian Stok Opname Fisik</h3>
              <button
                onClick={() => setShowOpnameModal(false)}
                className="p-1 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveOpname} className="p-5 space-y-3.5 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-500 font-bold uppercase">PRODUK:</span>
                <h4 className="font-extrabold text-stone-900 text-sm mt-0.5">{opnameItem.productName}</h4>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-500 block mb-1">Stok di Sistem</label>
                  <input
                    type="number"
                    disabled
                    value={opnameItem.currentQty}
                    className="w-full p-2.5 bg-stone-100 border border-stone-200 rounded-xl font-black text-center text-stone-600"
                  />
                </div>
                <div>
                  <label className="font-bold text-red-700 block mb-1">Stok Riil Fisik (Dihitung)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={opnameItem.realQty}
                    onChange={(e) =>
                      setOpnameItem({ ...opnameItem, realQty: Number(e.target.value) || 0 })
                    }
                    className="w-full p-2.5 border-2 border-red-500 rounded-xl font-black text-center text-stone-900 text-base focus:ring-2 focus:ring-red-200"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Alasan Penyesuaian / Catatan</label>
                <textarea
                  rows={2}
                  required
                  value={opnameItem.notes}
                  onChange={(e) => setOpnameItem({ ...opnameItem, notes: e.target.value })}
                  className="w-full p-2.5 border border-stone-200 rounded-xl"
                  placeholder="Contoh: Selisih 2 bungkus rusak kemasan sobek..."
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowOpnameModal(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow"
                >
                  Simpan Hasil Opname
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
