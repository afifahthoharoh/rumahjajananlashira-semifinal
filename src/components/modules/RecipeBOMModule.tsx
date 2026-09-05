import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Recipe, RecipeIngredient } from '../../types';
import {
  ScrollText,
  Plus,
  Edit2,
  Trash2,
  X,
  ChefHat,
  Calculator,
  Layers,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  MoreVertical,
  History,
} from 'lucide-react';

export const RecipeBOMModule: React.FC = () => {
  const { recipes, products, rawMaterials, saveRecipe, setActiveTab, t, language } = useApp();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe>(recipes[0] || null);
  const [activeTabSub, setActiveTabSub] = useState<'bom' | 'history'>('bom');
  const [searchTerm, setSearchTerm] = useState('');

  // Editing ingredients inside the right side drawer (matching Screenshot 3)
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>(
    selectedRecipe?.ingredients || [
      {
        materialId: rawMaterials[0]?.id || '',
        materialName: 'Singkong Mentah',
        quantity: 1000,
        unit: 'Gram',
        costPerUnit: 2,
        subtotalCost: 2000,
      },
      {
        materialId: rawMaterials[1]?.id || '',
        materialName: 'Bumbu Balado Bubuk',
        quantity: 50,
        unit: 'Gram',
        costPerUnit: 30,
        subtotalCost: 1500,
      },
      {
        materialId: rawMaterials[2]?.id || '',
        materialName: 'Minyak Goreng',
        quantity: 200,
        unit: 'ml',
        costPerUnit: 5,
        subtotalCost: 1000,
      },
    ]
  );

  // Sync selected recipe ingredients when user selects another recipe
  const handleSelectRecipe = (rec: Recipe) => {
    setSelectedRecipe(rec);
    if (rec.ingredients && rec.ingredients.length > 0) {
      setIngredients(rec.ingredients);
    }
  };

  const handleIngredientChange = (index: number, field: string, value: any) => {
    const updated = [...ingredients];
    if (field === 'quantity') {
      const q = Math.max(0.001, Number(value) || 0);
      updated[index].quantity = q;
      updated[index].subtotalCost = q * updated[index].costPerUnit;
    } else if (field === 'unit') {
      updated[index].unit = value;
    }
    setIngredients(updated);
  };

  const handleAddIngredient = () => {
    const defaultRm = rawMaterials[0];
    if (!defaultRm) return;
    setIngredients([
      ...ingredients,
      {
        materialId: defaultRm.id,
        materialName: defaultRm.name,
        quantity: 100,
        unit: 'Gram',
        costPerUnit: 15,
        subtotalCost: 1500,
      },
    ]);
  };

  const handleRemoveIngredient = (index: number) => {
    if (ingredients.length <= 1) return;
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const rawMaterialsTotalCost = ingredients.reduce(
    (sum, ing) => sum + ing.subtotalCost,
    0
  );

  const handleSaveRecipe = () => {
    if (!selectedRecipe) return;
    const updatedRec: Recipe = {
      ...selectedRecipe,
      ingredients,
      hppPerUnit: rawMaterialsTotalCost,
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    saveRecipe(updatedRec);
    alert(language === 'id' ? 'Resep (BOM) berhasil disimpan!' : 'Recipe (BOM) saved successfully!');
  };

  const filteredRecipes = recipes.filter((r) =>
    r.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Top Header: Title & Subtitle on Left, Toggle Tabs on Right (matching Screenshot 3) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-stone-900 tracking-tight">
            {t.production.title}
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            {t.production.subtitle}
          </p>
        </div>

        {/* Top Toggle Tabs [Resep (BOM)] [Riwayat Produksi] */}
        <div className="flex items-center p-1 bg-[#FAF2F0] border border-[#F0E6E5] rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTabSub('bom')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTabSub === 'bom'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <ScrollText className="w-3.5 h-3.5 text-[#991B1B]" />
            <span>{t.production.recipeTab}</span>
          </button>
          <button
            onClick={() => setActiveTabSub('history')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTabSub === 'history'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <History className="w-3.5 h-3.5 text-stone-500" />
            <span>{t.production.historyTab}</span>
          </button>
        </div>
      </div>

      {/* Action Bar: Search, Filter, + Produk Baru (matching Screenshot 3) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 w-full sm:w-auto flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t.production.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-[#F0E6E5] rounded-xl text-xs outline-none focus:border-[#991B1B] transition font-medium"
            />
          </div>

          <button className="px-3.5 py-2 bg-white border border-[#F0E6E5] text-stone-700 hover:bg-stone-50 rounded-xl text-xs font-bold flex items-center gap-1.5 transition">
            <Filter className="w-3.5 h-3.5 text-stone-500" />
            <span>{t.production.filter}</span>
          </button>
        </div>

        <button
          onClick={() => setActiveTab('master-produk')}
          className="w-full sm:w-auto px-4 py-2 bg-[#991B1B] hover:bg-[#881337] active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t.production.newProduct}</span>
        </button>
      </div>

      {activeTabSub === 'bom' ? (
        /* Two Column Layout: Recipe Cards Grid (Left) + BOM Drawer (Right) (matching Screenshot 3) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left: Recipe Cards Grid (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredRecipes.map((rec) => {
              const isSelected = selectedRecipe?.id === rec.id;
              const prod = products.find((p) => p.id === rec.productId);

              return (
                <div
                  key={rec.id}
                  onClick={() => handleSelectRecipe(rec)}
                  className={`bg-white rounded-2xl p-4 cursor-pointer transition relative flex flex-col justify-between shadow-2xs ${
                    isSelected
                      ? 'border-2 border-[#991B1B]'
                      : 'border border-[#F0E6E5] hover:border-stone-300'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="relative h-28 rounded-xl bg-[#FAF7F5] overflow-hidden flex items-center justify-center">
                      <img
                        src={prod?.imageUrl || 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=300&auto=format&fit=crop&q=80'}
                        alt={rec.productName}
                        className="w-full h-full object-contain p-2"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-black bg-teal-50 text-teal-700 border border-teal-200 uppercase tracking-wider">
                        {t.production.active}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-xs text-stone-900 line-clamp-1">
                        {rec.productName}
                      </h4>
                      <span className="text-[10px] text-stone-400 font-medium">
                        SKU: {prod?.sku || 'KSB-001'} • {rec.ingredients?.length || 6} {t.production.materialsCount}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 mt-2 border-t border-[#F0E6E5] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-400 block font-medium">
                        {t.production.hppPerPortion}
                      </span>
                      <span className="font-black text-xs text-stone-900">
                        Rp {rec.hppPerUnit.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectRecipe(rec);
                      }}
                      className="p-1.5 text-[#991B1B] hover:bg-[#FAF2F0] rounded-lg transition"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: BOM Composition Editor Panel (5 cols, matching Screenshot 3) */}
          {selectedRecipe && (
            <div className="lg:col-span-5 bg-white rounded-2xl border border-[#F0E6E5] p-5 shadow-xs space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-[#F0E6E5] pb-3">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-extrabold text-sm text-stone-900">
                      {selectedRecipe.productName}
                    </h3>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  </div>
                  <span className="text-[11px] text-stone-500 font-medium">
                    {t.production.editComposition}
                  </span>
                </div>
                <button className="text-stone-400 hover:text-stone-700 p-1">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>

              {/* Ingredients List */}
              <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                {ingredients.map((ing, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#FAF7F5] rounded-xl border border-[#F0E6E5] space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900">{ing.materialName}</span>
                      <button
                        onClick={() => handleRemoveIngredient(idx)}
                        className="text-stone-400 hover:text-[#991B1B] transition p-0.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-stone-400 font-bold block mb-1">
                          {t.production.quantity}
                        </label>
                        <input
                          type="number"
                          value={ing.quantity}
                          onChange={(e) =>
                            handleIngredientChange(idx, 'quantity', e.target.value)
                          }
                          className="w-full px-2.5 py-1.5 bg-white border border-[#F0E6E5] rounded-lg text-xs font-bold text-stone-900 outline-none focus:border-[#991B1B]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-stone-400 font-bold block mb-1">
                          {t.production.unit}
                        </label>
                        <select
                          value={ing.unit}
                          onChange={(e) =>
                            handleIngredientChange(idx, 'unit', e.target.value)
                          }
                          className="w-full px-2 py-1.5 bg-white border border-[#F0E6E5] rounded-lg text-xs font-bold text-stone-900 outline-none"
                        >
                          <option value="Gram">Gram</option>
                          <option value="kg">kg</option>
                          <option value="ml">ml</option>
                          <option value="liter">liter</option>
                          <option value="pcs">pcs</option>
                        </select>
                      </div>
                    </div>

                    <div className="text-right text-[10px] text-stone-500 font-medium">
                      {t.production.estCost}:{' '}
                      <strong className="text-stone-800">
                        Rp {ing.subtotalCost.toLocaleString('id-ID')}
                      </strong>
                    </div>
                  </div>
                ))}

                {/* + Tambah Bahan (Dashed Button) */}
                <button
                  onClick={handleAddIngredient}
                  className="w-full py-2.5 border-2 border-dashed border-[#F0E6E5] hover:border-[#991B1B] text-[#991B1B] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-98"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t.production.addIngredient}</span>
                </button>
              </div>

              {/* Total HPP (Estimasi) */}
              <div className="pt-2 border-t border-[#F0E6E5]">
                <span className="text-[10px] text-stone-400 font-bold block uppercase">
                  {t.production.estimatedTotalHpp}
                </span>
                <div className="text-xl font-black text-[#991B1B] mt-0.5">
                  Rp {rawMaterialsTotalCost.toLocaleString('id-ID')}
                </div>
              </div>

              {/* Action Buttons: [Batal] [Simpan Resep] */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => setIngredients(selectedRecipe.ingredients)}
                  className="py-2.5 px-3 border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-bold rounded-xl transition"
                >
                  {t.production.cancel}
                </button>
                <button
                  onClick={handleSaveRecipe}
                  className="py-2.5 px-3 bg-[#991B1B] hover:bg-[#881337] active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition"
                >
                  {t.production.saveRecipe}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Riwayat Produksi Subtab */
        <div className="bg-white p-6 rounded-2xl border border-[#F0E6E5] text-center py-12 space-y-2">
          <History className="w-8 h-8 text-stone-300 mx-auto" />
          <h4 className="font-extrabold text-sm text-stone-800">
            {language === 'id' ? 'Riwayat SPK & Produksi Harian' : 'Daily Production & Work Order History'}
          </h4>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            {language === 'id'
              ? 'Seluruh SPK produksi, QC check, dan hasil batch tersimpan otomatis di modul Produksi & QC.'
              : 'All production orders, QC checks, and batch yields are safely logged in Production & QC.'}
          </p>
          <button
            onClick={() => setActiveTab('produksi-qc')}
            className="mt-3 px-4 py-2 bg-[#991B1B] text-white text-xs font-bold rounded-xl"
          >
            {language === 'id' ? 'Buka Modul Produksi & QC Lengkap' : 'Open Full Production & QC Module'}
          </button>
        </div>
      )}
    </div>
  );
};
