import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import {
  Package,
  Plus,
  Search,
  QrCode,
  Barcode,
  Edit2,
  Trash2,
  X,
  Sparkles,
  Calculator,
  Tag,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export const FinishedProductsModule: React.FC = () => {
  const { products, addProduct, updateProductHppAndPrice, setActiveTab } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProductForQr, setSelectedProductForQr] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    sku: '',
    barcode: '',
    name: '',
    category: 'Basreng',
    weightGrams: 150,
    packageType: 'Standing Pouch Zipper',
    hpp: 8400,
    sellingPrice: 16000,
    minimumStockWarning: 20,
    imageUrl: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=300&q=80',
  });

  const handleOpenAdd = () => {
    const randomBarcode = `899${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    setFormData({
      sku: `SKU-${String(products.length + 1).padStart(3, '0')}`,
      barcode: randomBarcode,
      name: '',
      category: 'Basreng',
      weightGrams: 150,
      packageType: 'Standing Pouch Zipper',
      hpp: 8500,
      sellingPrice: 16000,
      minimumStockWarning: 20,
      imageUrl: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=300&q=80',
    });
    setShowAddModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    addProduct({
      ...formData,
      status: 'ACTIVE',
    });

    setShowAddModal(false);
  };

  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.barcode.includes(searchTerm);
    const matchCat = categoryFilter === 'ALL' || p.category === categoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      {/* Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-red-600" />
            <h2 className="font-extrabold text-lg text-stone-900">MODUL 7: Master Produk Jadi (Snack Lashira)</h2>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Katalog produk snack matang siap jual ke konsumen dengan SKU barcode, HPP, berat gramasi, dan harga eceran.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('hitung-hpp')}
            className="px-3.5 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
          >
            <Calculator className="w-4 h-4 text-amber-600" />
            Kalkulator Margin
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" />
            Tambah Produk Baru
          </button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari SKU, Barcode, atau nama produk snack..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs outline-none focus:border-red-500 transition font-medium"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-white border border-stone-200 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:border-red-500"
        >
          <option value="ALL">Semua Kategori Produk</option>
          <option value="Basreng">Basreng (Bakso Goreng)</option>
          <option value="Keripik Kaca">Keripik Kaca / Beledug</option>
          <option value="Makaroni">Makaroni Bantet</option>
          <option value="Usus Crispy">Usus Crispy</option>
          <option value="Seblak">Seblak Kering</option>
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredProducts.map((p) => {
          const grossProfit = p.sellingPrice - p.hpp;
          const marginPercent = ((grossProfit / p.sellingPrice) * 100).toFixed(0);

          return (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              {/* Product Image & Badges */}
              <div className="relative h-40 bg-stone-100 overflow-hidden">
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2.5 left-2.5">
                  <span className="font-mono text-[10px] font-bold bg-black/70 text-white px-2 py-0.5 rounded backdrop-blur-sm">
                    {p.sku}
                  </span>
                </div>
                <div className="absolute top-2.5 right-2.5">
                  <span className="text-[10px] font-extrabold bg-red-600 text-white px-2 py-0.5 rounded-full shadow">
                    {p.weightGrams}g
                  </span>
                </div>
              </div>

              {/* Product Details */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-stone-400">{p.category}</span>
                  <h3 className="font-extrabold text-sm text-stone-900 line-clamp-1">{p.name}</h3>
                  <p className="text-[11px] text-stone-500">{p.packageType}</p>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl space-y-1 border border-stone-100 text-xs">
                  <div className="flex justify-between text-stone-500">
                    <span>HPP:</span>
                    <span className="font-semibold text-stone-800">
                      Rp {p.hpp.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-stone-900 border-t border-stone-200 pt-1">
                    <span>Harga Jual:</span>
                    <span className="text-red-700 text-sm font-black">
                      Rp {p.sellingPrice.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] text-emerald-600 font-bold">
                    <span>Profit: Rp {grossProfit.toLocaleString('id-ID')}</span>
                    <span>Margin {marginPercent}%</span>
                  </div>
                </div>

                {/* Footer Barcode & QR Action */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-stone-500 truncate max-w-[120px]">
                    {p.barcode}
                  </span>
                  <button
                    onClick={() => setSelectedProductForQr(p)}
                    className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-lg text-xs flex items-center gap-1 transition"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    QR Code
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* QR Code / Barcode Modal */}
      {selectedProductForQr && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center space-y-4">
            <h3 className="font-extrabold text-sm text-stone-900">
              Label QR Code Produk Snack
            </h3>
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex justify-center">
              <QRCodeSVG
                value={`LASHIRA-SKU:${selectedProductForQr.sku}:${selectedProductForQr.barcode}`}
                size={160}
                level="H"
              />
            </div>
            <div>
              <p className="font-bold text-sm text-stone-900">{selectedProductForQr.name}</p>
              <p className="font-mono text-xs text-stone-500">
                SKU: {selectedProductForQr.sku} • Barcode: {selectedProductForQr.barcode}
              </p>
              <p className="font-black text-red-700 text-base mt-1">
                Rp {selectedProductForQr.sellingPrice.toLocaleString('id-ID')}
              </p>
            </div>
            <button
              onClick={() => setSelectedProductForQr(null)}
              className="w-full py-2.5 bg-stone-800 text-white font-bold rounded-xl text-xs"
            >
              Tutup Label
            </button>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-stone-200">
            <div className="p-4 bg-red-700 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Tambah Produk Snack Baru</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Kode SKU</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full p-2.5 border border-stone-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Kategori</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 border border-stone-200 rounded-xl font-semibold"
                  >
                    <option value="Basreng">Basreng (Bakso Goreng)</option>
                    <option value="Keripik Kaca">Keripik Kaca</option>
                    <option value="Makaroni">Makaroni</option>
                    <option value="Usus Crispy">Usus Crispy</option>
                    <option value="Seblak">Seblak</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Nama Produk Snack</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Basreng Pedas Daun Jeruk 150g"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Gramasi Bersih (Gram)</label>
                  <input
                    type="number"
                    value={formData.weightGrams}
                    onChange={(e) => setFormData({ ...formData, weightGrams: Number(e.target.value) || 0 })}
                    className="w-full p-2.5 border border-stone-200 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Jenis Kemasan</label>
                  <input
                    type="text"
                    value={formData.packageType}
                    onChange={(e) => setFormData({ ...formData, packageType: e.target.value })}
                    className="w-full p-2.5 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">HPP Pokok (Rp)</label>
                  <input
                    type="number"
                    value={formData.hpp}
                    onChange={(e) => setFormData({ ...formData, hpp: Number(e.target.value) || 0 })}
                    className="w-full p-2.5 border border-stone-200 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Harga Jual POS (Rp)</label>
                  <input
                    type="number"
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: Number(e.target.value) || 0 })}
                    className="w-full p-2.5 border border-stone-200 rounded-xl font-bold text-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">URL Foto Produk</label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full p-2.5 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
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
                  Simpan Produk Snack
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
