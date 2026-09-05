import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings as SettingsIcon,
  Globe,
  Building2,
  Printer,
  Shield,
  Database,
  CheckCircle2,
  Save,
  Store,
  Sparkles,
  Smartphone,
  RotateCcw,
  Languages,
  Check,
} from 'lucide-react';

export const SettingsModule: React.FC = () => {
  const {
    language,
    setLanguage,
    t,
    currentUser,
    branches,
    activeBranchId,
    setActiveBranchId,
    resetToDemoData,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'language' | 'store' | 'printer' | 'system'>('language');
  const [storeName, setStoreName] = useState('Rumah Jajanan Lashira');
  const [storeTagline, setStoreTagline] = useState('Pusat Oleh-Oleh & Snack Gurih Pedas Khas Bandung');
  const [storePhone, setStorePhone] = useState('0812-3456-7890');
  const [storeAddress, setStoreAddress] = useState('Jl. Soreang Raya No. 45, Soreang, Kab. Bandung');
  const [printerPaper, setPrinterPaper] = useState<'58mm' | '80mm'>('80mm');
  const [autoPrintReceipt, setAutoPrintReceipt] = useState(true);
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FCE7E7] text-[#991B1B] flex items-center justify-center font-bold shadow-xs">
            <SettingsIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-lg text-stone-900 leading-tight">
              {t.settings.title}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              {t.settings.subtitle}
            </p>
          </div>
        </div>

        {/* Quick Language Toggle Pill in Header */}
        <div className="flex items-center gap-1.5 p-1 bg-[#FAF6F4] border border-[#F0E6E5] rounded-xl">
          <button
            onClick={() => setLanguage('id')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              language === 'id'
                ? 'bg-[#991B1B] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
            }`}
          >
            <span>🇮🇩</span>
            <span>Indonesia</span>
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              language === 'en'
                ? 'bg-[#991B1B] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
            }`}
          >
            <span>🇬🇧</span>
            <span>English</span>
          </button>
        </div>
      </div>

      {showSavedToast && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{t.settings.savedSuccess}</span>
        </div>
      )}

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Navigation Tabs (4 cols) */}
        <div className="md:col-span-4 space-y-2">
          <div className="bg-white p-3 rounded-2xl border border-stone-200/80 shadow-xs space-y-1">
            <button
              onClick={() => setActiveSubTab('language')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition text-left ${
                activeSubTab === 'language'
                  ? 'bg-[#FDF2F2] text-[#991B1B] border-l-4 border-[#991B1B]'
                  : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              <Languages className="w-4 h-4 text-[#991B1B]" />
              <div className="flex-1">
                <span className="block">{t.settings.languageTitle}</span>
                <span className="text-[10px] text-stone-400 font-normal">
                  {language === 'id' ? 'Bahasa Indonesia' : 'English Language'}
                </span>
              </div>
            </button>

            <button
              onClick={() => setActiveSubTab('store')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition text-left ${
                activeSubTab === 'store'
                  ? 'bg-[#FDF2F2] text-[#991B1B] border-l-4 border-[#991B1B]'
                  : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              <Store className="w-4 h-4 text-[#991B1B]" />
              <div className="flex-1">
                <span className="block">{t.settings.storeProfile}</span>
                <span className="text-[10px] text-stone-400 font-normal">Nama toko, kontak, alamat</span>
              </div>
            </button>

            <button
              onClick={() => setActiveSubTab('printer')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition text-left ${
                activeSubTab === 'printer'
                  ? 'bg-[#FDF2F2] text-[#991B1B] border-l-4 border-[#991B1B]'
                  : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              <Printer className="w-4 h-4 text-[#991B1B]" />
              <div className="flex-1">
                <span className="block">{t.settings.printerSettings}</span>
                <span className="text-[10px] text-stone-400 font-normal">Thermal 58mm / 80mm</span>
              </div>
            </button>

            <button
              onClick={() => setActiveSubTab('system')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition text-left ${
                activeSubTab === 'system'
                  ? 'bg-[#FDF2F2] text-[#991B1B] border-l-4 border-[#991B1B]'
                  : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              <Database className="w-4 h-4 text-[#991B1B]" />
              <div className="flex-1">
                <span className="block">{t.settings.systemInfo}</span>
                <span className="text-[10px] text-stone-400 font-normal">Data & Demo Reset</span>
              </div>
            </button>
          </div>

          {/* Quick Info Card */}
          <div className="p-4 bg-gradient-to-br from-[#FFF8F6] to-[#FAF4F2] rounded-2xl border border-[#F0E4E2] text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#991B1B]">
              <Sparkles className="w-4 h-4" />
              <span>Rumah Jajanan Lashira</span>
            </div>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              {t.brand.tagline}
            </p>
            <div className="pt-2 border-t border-[#F0E4E2] text-[10px] text-stone-500 flex justify-between">
              <span>{t.settings.version}</span>
              <span className="text-emerald-700 font-bold">Online Ready</span>
            </div>
          </div>
        </div>

        {/* Content Details Area (8 cols) */}
        <div className="md:col-span-8">
          {activeSubTab === 'language' && (
            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-6">
              <div>
                <h3 className="font-extrabold text-base text-stone-900 flex items-center gap-2">
                  <Languages className="w-5 h-5 text-[#991B1B]" />
                  {t.settings.languageTitle}
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  {t.settings.languageDesc}
                </p>
              </div>

              {/* Language Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Bahasa Indonesia Card */}
                <div
                  onClick={() => setLanguage('id')}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    language === 'id'
                      ? 'border-[#991B1B] bg-[#FDF2F2] shadow-sm'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">🇮🇩</span>
                      <div>
                        <h4 className="font-extrabold text-sm text-stone-900">
                          Bahasa Indonesia
                        </h4>
                        <span className="text-[11px] text-stone-500">Bahasa Baku Nasional</span>
                      </div>
                    </div>
                    {language === 'id' && (
                      <div className="w-6 h-6 rounded-full bg-[#991B1B] text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-stone-600 mt-3 pt-3 border-t border-stone-200/60 leading-relaxed">
                    Menampilkan seluruh menu kasir POS, stok bahan baku, resep BOM, surat jalan, dan absensi dalam Bahasa Indonesia.
                  </p>
                </div>

                {/* English Card */}
                <div
                  onClick={() => setLanguage('en')}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    language === 'en'
                      ? 'border-[#991B1B] bg-[#FDF2F2] shadow-sm'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">🇬🇧</span>
                      <div>
                        <h4 className="font-extrabold text-sm text-stone-900">
                          English
                        </h4>
                        <span className="text-[11px] text-stone-500">International English</span>
                      </div>
                    </div>
                    {language === 'en' && (
                      <div className="w-6 h-6 rounded-full bg-[#991B1B] text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-stone-600 mt-3 pt-3 border-t border-stone-200/60 leading-relaxed">
                    Display all POS cashier menus, inventory stock, BOM recipes, delivery notes, and HR attendance in English.
                  </p>
                </div>
              </div>

              {/* Status Note */}
              <div className="p-4 bg-[#FAF7F5] rounded-xl border border-[#F0E6E5] text-xs flex items-center gap-3 text-stone-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>
                  {t.settings.activeLanguage}{' '}
                  <strong className="text-[#991B1B]">
                    {language === 'id' ? 'Bahasa Indonesia (ID)' : 'English (EN)'}
                  </strong>
                  . {language === 'id' ? 'Perubahan disimpan secara otomatis.' : 'Changes are saved automatically.'}
                </span>
              </div>
            </div>
          )}

          {activeSubTab === 'store' && (
            <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-5">
              <div>
                <h3 className="font-extrabold text-base text-stone-900 flex items-center gap-2">
                  <Store className="w-5 h-5 text-[#991B1B]" />
                  {t.settings.storeProfile}
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Identitas usaha yang akan tercetak pada struk thermal POS dan Surat Jalan pengiriman cabang.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Nama Toko / Usaha</label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-[#991B1B] focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Slogan / Tagline</label>
                  <input
                    type="text"
                    value={storeTagline}
                    onChange={(e) => setStoreTagline(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-[#991B1B] focus:bg-white transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Nomor WhatsApp / Hotline</label>
                    <input
                      type="text"
                      value={storePhone}
                      onChange={(e) => setStorePhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-[#991B1B] focus:bg-white transition"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Pilih Cabang Aktif Anda</label>
                    <select
                      value={activeBranchId}
                      onChange={(e) => setActiveBranchId(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-[#991B1B] focus:bg-white transition font-medium"
                    >
                      {branches.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name} ({b.city})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Alamat Gudang / Outlet Pusat</label>
                  <textarea
                    rows={2}
                    value={storeAddress}
                    onChange={(e) => setStoreAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-[#991B1B] focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#991B1B] hover:bg-[#881337] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>{t.settings.saveChanges}</span>
                </button>
              </div>
            </form>
          )}

          {activeSubTab === 'printer' && (
            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-5">
              <div>
                <h3 className="font-extrabold text-base text-stone-900 flex items-center gap-2">
                  <Printer className="w-5 h-5 text-[#991B1B]" />
                  {t.settings.printerSettings}
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Format cetak struk thermal kasir POS 58mm atau 80mm dan integrasi printer Bluetooth.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-2">Lebar Kertas Struk Thermal</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPrinterPaper('58mm')}
                      className={`p-3.5 rounded-xl border text-center font-bold transition ${
                        printerPaper === '58mm'
                          ? 'border-[#991B1B] bg-[#FDF2F2] text-[#991B1B]'
                          : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <span className="block text-sm">58 mm</span>
                      <span className="text-[10px] text-stone-400 font-normal">Mini Bluetooth Printer</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrinterPaper('80mm')}
                      className={`p-3.5 rounded-xl border text-center font-bold transition ${
                        printerPaper === '80mm'
                          ? 'border-[#991B1B] bg-[#FDF2F2] text-[#991B1B]'
                          : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <span className="block text-sm">80 mm</span>
                      <span className="text-[10px] text-stone-400 font-normal">Standard Desktop Thermal</span>
                    </button>
                  </div>
                </div>

                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-stone-900 block">Auto-Print Struk Setelah Pembayaran</span>
                    <span className="text-[11px] text-stone-500">Munculkan dialog print otomatis setelah transaksi checkout sukses</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoPrintReceipt}
                    onChange={(e) => setAutoPrintReceipt(e.target.checked)}
                    className="w-4 h-4 text-[#991B1B] rounded focus:ring-0"
                  />
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'system' && (
            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-5">
              <div>
                <h3 className="font-extrabold text-base text-stone-900 flex items-center gap-2">
                  <Database className="w-5 h-5 text-[#991B1B]" />
                  {t.settings.systemInfo}
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Status penyimpanan lokal (Local Storage) dan reset data demo simulasi.
                </p>
              </div>

              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-2">
                <span className="font-bold block">Reset Data Simulasi</span>
                <p className="text-[11px] leading-relaxed">
                  Jika Anda ingin mengembalikan seluruh transaksi POS, stok bahan baku, resep BOM, dan absensi ke data awal standar pabrik:
                </p>
                <button
                  onClick={() => {
                    if (confirm('Apakah Anda yakin ingin me-reset seluruh data ke data awal demo?')) {
                      resetToDemoData();
                      alert('Data berhasil di-reset!');
                    }
                  }}
                  className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition active:scale-95 flex items-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset ke Data Demo Pabrik</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
