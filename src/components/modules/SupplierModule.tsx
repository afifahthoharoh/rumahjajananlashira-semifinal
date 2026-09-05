import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Supplier } from '../../types';
import {
  Truck,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Edit2,
  Trash2,
  CheckCircle2,
  Building2,
  X,
  FileText,
} from 'lucide-react';

export const SupplierModule: React.FC = () => {
  const { suppliers, addSupplier, updateSupplier, deleteSupplier, purchases } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    category: 'Tepung & Bumbu',
    paymentTerms: 'Tempo 14 Hari',
    bankAccount: '',
    notes: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
  });

  const handleOpenAdd = () => {
    setFormData({
      code: `SPL-${String(suppliers.length + 1).padStart(2, '0')}`,
      name: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      category: 'Tepung & Bumbu',
      paymentTerms: 'Tempo 14 Hari',
      bankAccount: '',
      notes: '',
      status: 'ACTIVE',
    });
    setEditingSupplier(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (sup: Supplier) => {
    setEditingSupplier(sup);
    setFormData({
      code: sup.code,
      name: sup.name,
      contactPerson: sup.contactPerson,
      phone: sup.phone,
      email: sup.email,
      address: sup.address,
      category: sup.category,
      paymentTerms: sup.paymentTerms,
      bankAccount: sup.bankAccount || '',
      notes: sup.notes || '',
      status: sup.status,
    });
    setShowAddModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    if (editingSupplier) {
      updateSupplier(editingSupplier.id, formData);
    } else {
      addSupplier(formData);
    }
    setShowAddModal(false);
  };

  const filteredSuppliers = suppliers.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = categoryFilter === 'ALL' || s.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-red-600" />
            <h2 className="font-extrabold text-lg text-stone-900">MODUL 1: Manajemen Data Supplier</h2>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Kelola data vendor tepung, minyak goreng, rempah, kemasan pouch & perlengkapan produksi.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4" />
          Tambah Supplier Baru
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama supplier, kontak person, atau kode vendor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition font-medium"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-white border border-stone-200 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:border-red-500"
        >
          <option value="ALL">Semua Kategori Bahan</option>
          <option value="Tepung & Bumbu">Tepung & Bumbu</option>
          <option value="Minyak & Gas">Minyak & Gas</option>
          <option value="Kemasan & Plastik">Kemasan & Plastik</option>
          <option value="Lainnya">Lainnya</option>
        </select>
      </div>

      {/* Supplier Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSuppliers.map((sup) => {
          const supplierPoCount = purchases.filter((p) => p.supplierId === sup.id).length;

          return (
            <div
              key={sup.id}
              className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm hover:shadow-md transition space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-[10px] font-bold bg-red-50 text-red-700 px-2 py-0.5 rounded border border-red-100">
                      {sup.code}
                    </span>
                    <h3 className="font-extrabold text-sm text-stone-900 mt-1 leading-snug">
                      {sup.name}
                    </h3>
                  </div>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      sup.status === 'ACTIVE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {sup.status === 'ACTIVE' ? 'AKTIF' : 'NON-AKTIF'}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-stone-600">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                    <span className="text-stone-700 font-semibold">{sup.contactPerson}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                    <span>{sup.phone}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-2 text-stone-500 text-[11px]">{sup.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                    <span className="text-[11px] font-semibold text-stone-700">Term: {sup.paymentTerms}</span>
                  </div>
                </div>

                {sup.bankAccount && (
                  <div className="p-2 bg-stone-50 rounded-lg text-[11px] font-mono text-stone-600 border border-stone-100 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                    <span>{sup.bankAccount}</span>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-stone-500">
                  {supplierPoCount} Total PO Pembelian
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(sup)}
                    className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition"
                    title="Edit Supplier"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Yakin ingin menghapus supplier ${sup.name}?`)) {
                        deleteSupplier(sup.id);
                      }
                    }}
                    className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                    title="Hapus Supplier"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Supplier Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-stone-200">
            <div className="p-4 bg-red-700 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {editingSupplier ? 'Edit Data Supplier' : 'Tambah Supplier Bahan Baku Baru'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Kode Supplier</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full p-2.5 border border-stone-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Kategori Bahan</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 border border-stone-200 rounded-xl"
                  >
                    <option value="Tepung & Bumbu">Tepung & Bumbu</option>
                    <option value="Minyak & Gas">Minyak & Gas</option>
                    <option value="Kemasan & Plastik">Kemasan & Plastik</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Nama Perusahaan / Supplier</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: PT Tani Makmur Sejahtera"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Nama Kontak Person (PIC)</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Pak Hendra"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full p-2.5 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">No. WhatsApp / Telp</label>
                  <input
                    type="text"
                    required
                    placeholder="0812-xxxx-xxxx"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2.5 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Alamat Gudang / Pabrik Supplier</label>
                <textarea
                  rows={2}
                  placeholder="Alamat lengkap supplier..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-2.5 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Syarat Pembayaran (Terms)</label>
                  <select
                    value={formData.paymentTerms}
                    onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                    className="w-full p-2.5 border border-stone-200 rounded-xl"
                  >
                    <option value="COD">COD (Bayar saat kirim)</option>
                    <option value="Tempo 14 Hari">Tempo 14 Hari</option>
                    <option value="Tempo 30 Hari">Tempo 30 Hari</option>
                    <option value="Transfer Dimuka">Transfer Dimuka</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Rekening Bank Supplier</label>
                  <input
                    type="text"
                    placeholder="BCA 123-456 an PT Tani"
                    value={formData.bankAccount}
                    onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                    className="w-full p-2.5 border border-stone-200 rounded-xl"
                  />
                </div>
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
                  {editingSupplier ? 'Simpan Perubahan' : 'Tambah Supplier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
