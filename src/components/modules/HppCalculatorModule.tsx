import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calculator,
  Percent,
  Sliders,
  DollarSign,
  TrendingUp,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Layers,
} from 'lucide-react';

export const HppCalculatorModule: React.FC = () => {
  const { products, recipes, updateProductHppAndPrice, setActiveTab } = useApp();
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');

  // Calculator inputs
  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];
  const matchedRecipe = recipes.find((r) => r.productId === selectedProductId);

  const [rawCost, setRawCost] = useState<number>(matchedRecipe?.ingredients.reduce((s, i) => s + i.subtotalCost, 0) || 750000);
  const [batchOutput, setBatchOutput] = useState<number>(matchedRecipe?.batchYield || 100);
  const [laborCost, setLaborCost] = useState<number>(matchedRecipe?.laborCostPerBatch || 60000);
  const [overheadCost, setOverheadCost] = useState<number>(matchedRecipe?.overheadCostPerBatch || 40000);
  const [packagingCost, setPackagingCost] = useState<number>(50000);
  const [desiredMargin, setDesiredMargin] = useState<number>(45); // Margin in %

  // Synchronize when product changes
  const handleProductSelect = (pId: string) => {
    setSelectedProductId(pId);
    const rec = recipes.find((r) => r.productId === pId);
    if (rec) {
      const ingCost = rec.ingredients.reduce((s, i) => s + i.subtotalCost, 0);
      setRawCost(ingCost);
      setBatchOutput(rec.batchYield);
      setLaborCost(rec.laborCostPerBatch);
      setOverheadCost(rec.overheadCostPerBatch);
    }
  };

  // Calculations
  const totalProductionCost = rawCost + laborCost + overheadCost + packagingCost;
  const hppPerUnit = batchOutput > 0 ? Math.round(totalProductionCost / batchOutput) : 0;
  const rawSellingPrice = hppPerUnit * (1 + desiredMargin / 100);
  // Auto round to nearest 500 or 1000 for friendly cash payment
  const roundedSellingPrice = Math.ceil(rawSellingPrice / 500) * 500;
  const grossProfitPerUnit = roundedSellingPrice - hppPerUnit;
  const effectiveMargin = roundedSellingPrice > 0 ? ((grossProfitPerUnit / roundedSellingPrice) * 100).toFixed(1) : '0';

  const handleApplyToProduct = () => {
    if (!selectedProduct) return;
    updateProductHppAndPrice(selectedProduct.id, hppPerUnit, roundedSellingPrice);
    alert(`Sukses! Harga Jual ${selectedProduct.name} diupdate menjadi Rp ${roundedSellingPrice.toLocaleString('id-ID')} (HPP: Rp ${hppPerUnit.toLocaleString('id-ID')})`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-red-600" />
            <h2 className="font-extrabold text-lg text-stone-900">MODUL 6: Kalkulator HPP & Simulasi Margin Keuntungan</h2>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Hitung HPP otomatis dari bahan baku, tenaga kerja, gas, dan kemasan dengan simulasi margin 20% - 60%.
          </p>
        </div>

        <select
          value={selectedProductId}
          onChange={(e) => handleProductSelect(e.target.value)}
          className="bg-red-50 text-red-900 border border-red-200 rounded-xl px-3 py-2 text-xs font-bold outline-none"
        >
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.weightGrams}g)
            </option>
          ))}
        </select>
      </div>

      {/* Main Interactive Calculator Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Cost Parameter Controls */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="font-extrabold text-sm text-stone-900">
              1. Parameter Biaya 1 Batch Masak
            </h3>
            <span className="text-xs font-semibold text-stone-500">
              Produk: <strong className="text-red-700">{selectedProduct.name}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-stone-700 block mb-1">
                Target Hasil Batch (Jumlah Bungkus)
              </label>
              <input
                type="number"
                min="1"
                value={batchOutput}
                onChange={(e) => setBatchOutput(Math.max(1, Number(e.target.value) || 1))}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-black text-stone-900 text-sm"
              />
              <span className="text-[10px] text-stone-500 mt-0.5 block">Contoh: 100 pcs pouch 150g</span>
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">
                Biaya Total Bahan Mentah (Rp)
              </label>
              <input
                type="number"
                value={rawCost}
                onChange={(e) => setRawCost(Number(e.target.value) || 0)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-900 text-sm"
              />
              <span className="text-[10px] text-stone-500 mt-0.5 block">Tepung, cabai, minyak, bumbu</span>
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">
                Upah Tenaga Kerja / Batch (Rp)
              </label>
              <input
                type="number"
                value={laborCost}
                onChange={(e) => setLaborCost(Number(e.target.value) || 0)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-900"
              />
              <span className="text-[10px] text-stone-500 mt-0.5 block">Tukang goreng & bumbu</span>
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">
                Gas LPG & Listrik / Batch (Rp)
              </label>
              <input
                type="number"
                value={overheadCost}
                onChange={(e) => setOverheadCost(Number(e.target.value) || 0)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-900"
              />
              <span className="text-[10px] text-stone-500 mt-0.5 block">Overhead produksi</span>
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-stone-700 block mb-1">
                Biaya Kemasan Pouch & Stiker / Batch (Rp)
              </label>
              <input
                type="number"
                value={packagingCost}
                onChange={(e) => setPackagingCost(Number(e.target.value) || 0)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-900"
              />
              <span className="text-[10px] text-stone-500 mt-0.5 block">Standing pouch klip + stiker label merk</span>
            </div>
          </div>

          {/* Margin Slider */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-extrabold text-xs text-stone-800 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-red-600" />
                Target Margin Keuntungan Usaha
              </label>
              <span className="px-3 py-1 bg-red-600 text-white rounded-full font-black text-sm">
                {desiredMargin}%
              </span>
            </div>

            <input
              type="range"
              min="10"
              max="80"
              step="5"
              value={desiredMargin}
              onChange={(e) => setDesiredMargin(Number(e.target.value))}
              className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-red-600"
            />

            <div className="flex justify-between text-[10px] font-bold text-stone-500">
              <span>Grosir Rendah (15%)</span>
              <span>Standar UMKM (40%-50%)</span>
              <span>Retail Premium (70%+)</span>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Realtime Result & Action Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-gradient-to-br from-stone-900 to-stone-800 text-white rounded-2xl p-6 shadow-xl space-y-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                HASIL ANALISIS HARGA JUAL
              </span>
              <h3 className="text-base font-extrabold text-white mt-0.5">
                {selectedProduct.name}
              </h3>
            </div>

            {/* Main Result Numbers */}
            <div className="space-y-4 border-y border-stone-700 py-4">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-stone-400">Total Biaya 1 Batch:</span>
                <span className="font-bold text-stone-200">
                  Rp {totalProductionCost.toLocaleString('id-ID')}
                </span>
              </div>

              <div className="flex justify-between items-baseline">
                <span className="text-xs text-stone-300 font-semibold">HPP Satuan (Cost):</span>
                <span className="font-black text-xl text-amber-400">
                  Rp {hppPerUnit.toLocaleString('id-ID')}
                </span>
              </div>

              <div className="flex justify-between items-baseline">
                <span className="text-xs text-stone-300 font-semibold">Laba Kotor per Pcs:</span>
                <span className="font-black text-lg text-emerald-400">
                  Rp {grossProfitPerUnit.toLocaleString('id-ID')}
                </span>
              </div>

              <div className="pt-2 border-t border-stone-700 flex justify-between items-center">
                <div>
                  <span className="text-[11px] font-bold text-stone-400 block">
                    REKOMENDASI HARGA JUAL KONSUMEN:
                  </span>
                  <span className="text-2xl font-black text-white">
                    Rp {roundedSellingPrice.toLocaleString('id-ID')}
                  </span>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Margin {effectiveMargin}%
                </span>
              </div>
            </div>

            {/* Apply Button */}
            <button
              onClick={handleApplyToProduct}
              className="w-full py-3 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              Terapkan ke Master Produk & Kasir POS
            </button>
          </div>

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1">
            <p className="font-bold">Tips Penetapan Harga Snack:</p>
            <p className="text-stone-600 text-[11px]">
              Harga jual otomatis dibulatkan ke kelipatan Rp 500 terdekat agar kasir tidak kesulitan uang kembalian saat transaksi tunai.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
