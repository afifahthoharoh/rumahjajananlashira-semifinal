import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PurchaseOrderItem } from '../../types';
import {
  ShoppingCart,
  Plus,
  Search,
  Calendar,
  DollarSign,
  FileCheck,
  PackagePlus,
  X,
  Upload,
  Receipt,
  CheckCircle2,
} from 'lucide-react';

export const PurchasingModule: React.FC = () => {
  const { purchases, suppliers, rawMaterials, createPurchase } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || '');
  const [poDate, setPoDate] = useState(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState<PurchaseOrderItem[]>([
    {
      materialId: rawMaterials[0]?.id || '',
      materialName: rawMaterials[0]?.name || '',
      unit: rawMaterials[0]?.unit || 'kg',
      quantity: 100,
      unitPrice: rawMaterials[0]?.lastPurchasedPrice || 11500,
      subtotal: (rawMaterials[0]?.lastPurchasedPrice || 11500) * 100,
    },
  ]);
  const [shippingFee, setShippingFee] = useState<number>(50000);
  const [discount, setDiscount] = useState<number>(0);
  const [taxPpn, setTaxPpn] = useState<number>(0);
  const [paymentStatus, setPaymentStatus] = useState<'LUNAS' | 'BELUM_LUNAS' | 'TEMPO'>('LUNAS');
  const [notes, setNotes] = useState('');

  const handleAddItem = () => {
    if (rawMaterials.length === 0) return;
    const defaultRm = rawMaterials[0];
    setItems([
      ...items,
      {
        materialId: defaultRm.id,
        materialName: defaultRm.name,
        unit: defaultRm.unit,
        quantity: 50,
        unitPrice: defaultRm.lastPurchasedPrice,
        subtotal: defaultRm.lastPurchasedPrice * 50,
      },
    ]);
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const updated = [...items];
    if (field === 'materialId') {
      const selected = rawMaterials.find((r) => r.id === value);
      if (selected) {
        updated[index].materialId = selected.id;
        updated[index].materialName = selected.name;
        updated[index].unit = selected.unit;
        updated[index].unitPrice = selected.lastPurchasedPrice;
        updated[index].subtotal = selected.lastPurchasedPrice * updated[index].quantity;
      }
    } else if (field === 'quantity') {
      const q = Math.max(1, Number(value) || 0);
      updated[index].quantity = q;
      updated[index].subtotal = q * updated[index].unitPrice;
    } else if (field === 'unitPrice') {
      const p = Math.max(0, Number(value) || 0);
      updated[index].unitPrice = p;
      updated[index].subtotal = updated[index].quantity * p;
    }
    setItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((sum, it) => sum + it.subtotal, 0);
  const grandTotal = Math.max(0, subtotal + shippingFee - discount + taxPpn);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sup = suppliers.find((s) => s.id === supplierId);
    if (!sup || items.length === 0) return;

    createPurchase({
      date: poDate,
      supplierId: sup.id,
      supplierName: sup.name,
      items,
      subtotal,
      shippingFee,
      discount,
      taxPpn,
      grandTotal,
      paymentStatus,
      receivedStatus: 'DITERIMA_LENGKAP',
      notes,
    });

    setShowAddModal(false);
  };

  const filteredPurchases = purchases.filter(
    (p) =>
      p.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-red-600" />
            <h2 className="font-extrabold text-lg text-stone-900">MODUL 2: Pembelian Bahan Baku (Purchasing)</h2>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Setiap pembelian yang disimpan otomatis menambah stok bahan baku di Gudang Pusat & mencatat jurnal pengeluaran.
          </p>
        </div>

        <button
          onClick={() => {
            if (suppliers.length > 0) setSupplierId(suppliers[0].id);
            setShowAddModal(true);
          }}
          className="px-4 py-2.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4" />
          Input Pembelian Baru (PO)
        </button>
      </div>

      {/* Search Filter */}
      <div className="relative">
        <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Cari nomor PO atau nama supplier..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs outline-none focus:border-red-500 transition font-medium"
        />
      </div>

      {/* PO List Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-stone-50 text-stone-700 font-bold border-b border-stone-200 uppercase text-[10px]">
              <tr>
                <th className="p-3.5">No. PO & Tanggal</th>
                <th className="p-3.5">Supplier Vendor</th>
                <th className="p-3.5">Item Bahan Baku</th>
                <th className="p-3.5 text-right">Grand Total</th>
                <th className="p-3.5 text-center">Status Bayar</th>
                <th className="p-3.5 text-center">Stok Bahan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredPurchases.map((po) => (
                <tr key={po.id} className="hover:bg-stone-50/80 transition">
                  <td className="p-3.5 font-medium">
                    <span className="font-mono font-bold text-red-700 block">{po.poNumber}</span>
                    <span className="text-stone-500 text-[11px] flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3 text-stone-400" />
                      {po.date}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className="font-bold text-stone-900 block">{po.supplierName}</span>
                    <span className="text-stone-500 text-[11px]">Dibuat oleh: {po.createdBy}</span>
                  </td>
                  <td className="p-3.5">
                    <div className="space-y-1">
                      {po.items.map((it, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[11px]">
                          <span className="font-semibold text-stone-800">{it.materialName}:</span>
                          <span className="bg-stone-100 px-1.5 py-0.5 rounded font-mono font-bold text-stone-700">
                            {it.quantity} {it.unit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="p-3.5 text-right font-black text-stone-900 text-sm">
                    Rp {po.grandTotal.toLocaleString('id-ID')}
                  </td>
                  <td className="p-3.5 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        po.paymentStatus === 'LUNAS'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {po.paymentStatus}
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Stok Bertambah
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Input PO Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-stone-200 flex flex-col max-h-[90vh]">
            <div className="p-4 bg-[#18181B] text-white flex items-center justify-between border-b border-stone-800">
              <div className="flex items-center gap-2">
                <PackagePlus className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm">Input Pembelian Bahan Baku Baru (PO)</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-stone-400 hover:text-white rounded-lg transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Pilih Supplier</label>
                  <select
                    value={supplierId}
                    onChange={(e) => setSupplierId(e.target.value)}
                    className="w-full p-2.5 border border-stone-200 rounded-xl font-semibold"
                  >
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.category})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Tanggal Pembelian</label>
                  <input
                    type="date"
                    required
                    value={poDate}
                    onChange={(e) => setPoDate(e.target.value)}
                    className="w-full p-2.5 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Items Table in PO */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-stone-700 uppercase tracking-wider text-[10px]">
                    Daftar Bahan Baku yang Dibeli
                  </label>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Tambah Bahan
                  </button>
                </div>

                <div className="space-y-2 border border-stone-200 p-3 rounded-xl bg-stone-50">
                  {items.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-white p-2.5 rounded-lg border border-stone-200">
                      <div className="col-span-5">
                        <label className="text-[10px] text-stone-500 block">Bahan Baku</label>
                        <select
                          value={item.materialId}
                          onChange={(e) => handleItemChange(idx, 'materialId', e.target.value)}
                          className="w-full p-1.5 border border-stone-200 rounded-lg text-xs font-semibold"
                        >
                          {rawMaterials.map((rm) => (
                            <option key={rm.id} value={rm.id}>
                              {rm.name} ({rm.unit})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-span-2">
                        <label className="text-[10px] text-stone-500 block">Jumlah ({item.unit})</label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                          className="w-full p-1.5 border border-stone-200 rounded-lg font-bold text-center"
                        />
                      </div>

                      <div className="col-span-3">
                        <label className="text-[10px] text-stone-500 block">Harga Satuan (Rp)</label>
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                          className="w-full p-1.5 border border-stone-200 rounded-lg font-bold"
                        />
                      </div>

                      <div className="col-span-2 flex items-center justify-between">
                        <div>
                          <label className="text-[10px] text-stone-500 block">Subtotal</label>
                          <span className="font-bold text-[11px] text-stone-800">
                            Rp {(item.subtotal / 1000).toFixed(0)}rb
                          </span>
                        </div>
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Calculation breakdown */}
              <div className="grid grid-cols-3 gap-3 p-3 bg-stone-100 rounded-xl">
                <div>
                  <label className="font-semibold text-stone-600 block mb-1">Ongkos Kirim (Rp)</label>
                  <input
                    type="number"
                    value={shippingFee}
                    onChange={(e) => setShippingFee(Number(e.target.value) || 0)}
                    className="w-full p-2 bg-white border border-stone-200 rounded-lg font-semibold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-600 block mb-1">Diskon Vendor (Rp)</label>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                    className="w-full p-2 bg-white border border-stone-200 rounded-lg font-semibold text-red-600"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-600 block mb-1">Status Pembayaran</label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value as any)}
                    className="w-full p-2 bg-white border border-stone-200 rounded-lg font-bold"
                  >
                    <option value="LUNAS">LUNAS (Transfer/Cash)</option>
                    <option value="TEMPO">TEMPO (Hutang Dagang)</option>
                    <option value="BELUM_LUNAS">BELUM LUNAS</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-red-50 rounded-xl flex items-center justify-between border border-red-100">
                <span className="font-black text-red-900 text-sm">TOTAL PEMBAYARAN:</span>
                <span className="font-black text-red-700 text-base">
                  Rp {grandTotal.toLocaleString('id-ID')}
                </span>
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
                  className="px-5 py-2 bg-[#991B1B] hover:bg-[#881337] text-white font-bold rounded-xl shadow-xs transition active:scale-95"
                >
                  Simpan & Tambah Stok Bahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
