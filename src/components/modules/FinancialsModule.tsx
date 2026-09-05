import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FinancialRecord } from '../../types';
import {
  Wallet,
  Plus,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  TrendingUp,
  CreditCard,
  Building,
  CheckCircle2,
  X,
  PieChart,
} from 'lucide-react';

export const FinancialsModule: React.FC = () => {
  const { financialRecords, addFinancialRecord, branches } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [accountFilter, setAccountFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'PENGELUARAN' as 'PEMASUKAN' | 'PENGELUARAN',
    category: 'Bahan Baku & Bumbu',
    accountType: 'BANK_BCA' as 'KAS_TUNAI' | 'BANK_BCA' | 'BANK_MANDIRI' | 'QRIS_SETTLEMENT',
    amount: 150000,
    branchId: 'BR-PUSAT',
    description: '',
    recipientOrPayer: 'Vendor Minyak',
  });

  const handleOpenAdd = (type: 'PEMASUKAN' | 'PENGELUARAN') => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      type,
      category: type === 'PEMASUKAN' ? 'Penjualan POS Harian' : 'Bahan Baku & Bumbu',
      accountType: 'BANK_BCA',
      amount: 100000,
      branchId: 'BR-PUSAT',
      description: '',
      recipientOrPayer: '',
    });
    setShowAddModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.amount <= 0) return;

    addFinancialRecord(formData);
    setShowAddModal(false);
  };

  const filteredRecords = financialRecords.filter((r) => {
    const matchSearch =
      r.transactionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = typeFilter === 'ALL' || r.type === typeFilter;
    const matchAccount = accountFilter === 'ALL' || r.accountType === accountFilter;
    return matchSearch && matchType && matchAccount;
  });

  const totalIncome = financialRecords
    .filter((r) => r.type === 'PEMASUKAN')
    .reduce((sum, r) => sum + r.amount, 0);

  const totalExpense = financialRecords
    .filter((r) => r.type === 'PENGELUARAN')
    .reduce((sum, r) => sum + r.amount, 0);

  const netCashflow = totalIncome - totalExpense;

  // Account balances derived dynamically from transaction history
  const bcaIncome = financialRecords.filter((r) => r.type === 'PEMASUKAN' && (r.accountType === 'BANK_BCA' || r.accountType === 'BANK_MANDIRI')).reduce((sum, r) => sum + r.amount, 0);
  const bcaExpense = financialRecords.filter((r) => r.type === 'PENGELUARAN' && (r.accountType === 'BANK_BCA' || r.accountType === 'BANK_MANDIRI')).reduce((sum, r) => sum + r.amount, 0);
  const bcaBalance = 48500000 + bcaIncome - bcaExpense;

  const kasIncome = financialRecords.filter((r) => r.type === 'PEMASUKAN' && r.accountType === 'KAS_TUNAI').reduce((sum, r) => sum + r.amount, 0);
  const kasExpense = financialRecords.filter((r) => r.type === 'PENGELUARAN' && r.accountType === 'KAS_TUNAI').reduce((sum, r) => sum + r.amount, 0);
  const kasTunaiBalance = 12450000 + kasIncome - kasExpense;

  const qrisIncome = financialRecords.filter((r) => r.type === 'PEMASUKAN' && r.accountType === 'QRIS_SETTLEMENT').reduce((sum, r) => sum + r.amount, 0);
  const qrisExpense = financialRecords.filter((r) => r.type === 'PENGELUARAN' && r.accountType === 'QRIS_SETTLEMENT').reduce((sum, r) => sum + r.amount, 0);
  const qrisBalance = 6200000 + qrisIncome - qrisExpense;

  return (
    <div className="space-y-6">
      {/* Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-red-600" />
            <h2 className="font-extrabold text-lg text-stone-900">MODUL 13: Keuangan & Arus Kas (Cash Flow)</h2>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Buku kas tunai cabang, rekening bank operasional, settlement QRIS, dan pencatatan laba rugi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenAdd('PEMASUKAN')}
            className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            Catat Pemasukan
          </button>
          <button
            onClick={() => handleOpenAdd('PENGELUARAN')}
            className="px-3.5 py-2.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            Catat Pengeluaran
          </button>
        </div>
      </div>

      {/* Account Balances Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-900 to-indigo-900 text-white p-5 rounded-2xl shadow-sm space-y-2">
          <div className="flex items-center justify-between text-blue-200 text-xs font-bold uppercase">
            <span>Rekening Bank BCA Operasional</span>
            <Building className="w-4 h-4 text-blue-300" />
          </div>
          <div className="text-2xl font-black">
            Rp {bcaBalance.toLocaleString('id-ID')}
          </div>
          <span className="text-[11px] text-blue-300">BCA 7788-990-123 a.n Rumah Jajanan Lashira</span>
        </div>

        <div className="bg-gradient-to-br from-emerald-900 to-teal-900 text-white p-5 rounded-2xl shadow-sm space-y-2">
          <div className="flex items-center justify-between text-emerald-200 text-xs font-bold uppercase">
            <span>Total Kas Tunai (Semua Cabang)</span>
            <DollarSign className="w-4 h-4 text-emerald-300" />
          </div>
          <div className="text-2xl font-black">
            Rp {kasTunaiBalance.toLocaleString('id-ID')}
          </div>
          <span className="text-[11px] text-emerald-300">Kas laci kasir 4 cabang</span>
        </div>

        <div className="bg-gradient-to-br from-stone-900 to-stone-800 text-white p-5 rounded-2xl shadow-sm space-y-2">
          <div className="flex items-center justify-between text-stone-300 text-xs font-bold uppercase">
            <span>Saldo QRIS & E-Wallet Settlement</span>
            <CreditCard className="w-4 h-4 text-stone-300" />
          </div>
          <div className="text-2xl font-black text-amber-400">
            Rp {qrisBalance.toLocaleString('id-ID')}
          </div>
          <span className="text-[11px] text-stone-400">Siap ditarik ke rekening bank</span>
        </div>
      </div>

      {/* Cash Flow Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-950 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
              TOTAL PEMASUKAN
            </span>
            <span className="text-xl font-black text-emerald-700">
              Rp {totalIncome.toLocaleString('id-ID')}
            </span>
          </div>
          <div className="p-2 bg-emerald-100 rounded-xl text-emerald-700">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 text-rose-950 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block">
              TOTAL PENGELUARAN
            </span>
            <span className="text-xl font-black text-rose-700">
              Rp {totalExpense.toLocaleString('id-ID')}
            </span>
          </div>
          <div className="p-2 bg-rose-100 rounded-xl text-rose-700">
            <ArrowDownRight className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-stone-900 rounded-2xl text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
              SURPLUS ARUS KAS BERSIH
            </span>
            <span className="text-xl font-black text-emerald-400">
              Rp {netCashflow.toLocaleString('id-ID')}
            </span>
          </div>
          <div className="p-2 bg-stone-800 rounded-xl text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3 text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari transaksi, deskripsi atau kategori..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl outline-none focus:border-red-500 font-medium"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-white border border-stone-200 rounded-xl px-3 py-2.5 font-bold"
        >
          <option value="ALL">Semua Jenis (Masuk/Keluar)</option>
          <option value="PEMASUKAN">Pemasukan (+)</option>
          <option value="PENGELUARAN">Pengeluaran (-)</option>
        </select>

        <select
          value={accountFilter}
          onChange={(e) => setAccountFilter(e.target.value)}
          className="bg-white border border-stone-200 rounded-xl px-3 py-2.5 font-bold"
        >
          <option value="ALL">Semua Akun Rekening</option>
          <option value="KAS_TUNAI">Kas Tunai</option>
          <option value="BANK_BCA">Bank BCA</option>
          <option value="QRIS_SETTLEMENT">QRIS Settlement</option>
        </select>
      </div>

      {/* Financial Records Ledger Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-stone-50 text-stone-700 font-bold border-b border-stone-200 uppercase text-[10px]">
              <tr>
                <th className="p-3.5">No. Bukti & Tanggal</th>
                <th className="p-3.5">Kategori & Keterangan</th>
                <th className="p-3.5">Akun Kas / Bank</th>
                <th className="p-3.5">Pihak Terkait</th>
                <th className="p-3.5 text-right">Nominal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredRecords.map((r) => {
                const isIncome = r.type === 'PEMASUKAN';
                return (
                  <tr key={r.id} className="hover:bg-stone-50 transition">
                    <td className="p-3.5 font-medium">
                      <span className="font-mono font-bold text-stone-800 block">{r.transactionNumber}</span>
                      <span className="text-stone-500 text-[11px]">{r.date}</span>
                    </td>
                    <td className="p-3.5">
                      <span className="font-bold text-stone-900 block">{r.category}</span>
                      <span className="text-stone-500 text-[11px]">{r.description}</span>
                    </td>
                    <td className="p-3.5">
                      <span className="inline-block px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-stone-100 text-stone-700">
                        {r.accountType}
                      </span>
                    </td>
                    <td className="p-3.5 font-semibold text-stone-700">
                      {r.recipientOrPayer || '-'}
                    </td>
                    <td className="p-3.5 text-right">
                      <span
                        className={`text-sm font-black ${
                          isIncome ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {isIncome ? '+' : '-'}Rp {r.amount.toLocaleString('id-ID')}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-stone-200">
            <div className={`p-4 text-white flex items-center justify-between ${
              formData.type === 'PEMASUKAN' ? 'bg-emerald-700' : 'bg-red-700'
            }`}>
              <h3 className="font-bold text-sm">
                {formData.type === 'PEMASUKAN' ? 'Catat Pemasukan Kas / Bank' : 'Catat Pengeluaran Operasional'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Tanggal</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full p-2.5 border border-stone-200 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Akun Pembayaran</label>
                  <select
                    value={formData.accountType}
                    onChange={(e) => setFormData({ ...formData, accountType: e.target.value as any })}
                    className="w-full p-2.5 border border-stone-200 rounded-xl font-bold"
                  >
                    <option value="BANK_BCA">Bank BCA</option>
                    <option value="KAS_TUNAI">Kas Tunai Cabang</option>
                    <option value="QRIS_SETTLEMENT">QRIS Settlement</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Kategori Transaksi</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2.5 border border-stone-200 rounded-xl font-semibold"
                >
                  {formData.type === 'PEMASUKAN' ? (
                    <>
                      <option value="Penjualan POS Harian">Penjualan POS Harian</option>
                      <option value="Penjualan Reseller / Grosir">Penjualan Reseller / Grosir</option>
                      <option value="Pendapatan Bunga Bank">Pendapatan Bunga Bank</option>
                      <option value="Lain-lain">Lain-lain</option>
                    </>
                  ) : (
                    <>
                      <option value="Bahan Baku & Bumbu">Bahan Baku & Bumbu</option>
                      <option value="Kemasan & Plastik Pouch">Kemasan & Plastik Pouch</option>
                      <option value="Gas LPG & Listrik">Gas LPG & Listrik</option>
                      <option value="Gaji & Uang Makan Staf">Gaji & Uang Makan Staf</option>
                      <option value="Sewa Tempat & Kebersihan">Sewa Tempat & Kebersihan</option>
                      <option value="Transport & Pengiriman">Transport & Pengiriman</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Nominal (Rp)</label>
                <input
                  type="number"
                  required
                  min="1000"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) || 0 })}
                  className="w-full p-2.5 border border-stone-200 rounded-xl font-black text-stone-900 text-sm"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Penerima / Pembayar</label>
                <input
                  type="text"
                  placeholder="Contoh: Toko Plastik Jaya / Driver"
                  value={formData.recipientOrPayer}
                  onChange={(e) => setFormData({ ...formData, recipientOrPayer: e.target.value })}
                  className="w-full p-2.5 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Keterangan Tambahan</label>
                <textarea
                  rows={2}
                  placeholder="Catatan rincian keperluan..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 border border-stone-200 rounded-xl"
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
                  className={`px-5 py-2 text-white font-bold rounded-xl shadow ${
                    formData.type === 'PEMASUKAN' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  Simpan Transaksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
