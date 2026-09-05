import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RawMaterial, RawMaterialMutation } from '../../types';
import {
  Boxes,
  Plus,
  Search,
  AlertTriangle,
  QrCode,
  Edit2,
  Trash2,
  X,
  History,
  Scale,
  DollarSign,
  Package,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  ChevronRight,
  ArrowDown,
  ArrowUp,
  RefreshCw,
  ShoppingCart,
  Factory,
  FileText,
  Filter,
  Layers,
  Sparkles,
  ClipboardList,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export const RawMaterialsModule: React.FC = () => {
  const {
    rawMaterials,
    rawMaterialMutations,
    addRawMaterial,
    updateRawMaterial,
    recordRawMaterialInbound,
    recordRawMaterialUsage,
    recordRawMaterialOpname,
    suppliers,
    purchases,
    productionOrders,
    setActiveTab,
    currentUser,
    t,
    language,
  } = useApp();

  const isId = language === 'id';

  // Navigation tab within module
  const [activeViewTab, setActiveViewTab] = useState<'katalog' | 'flow' | 'mutasi' | 'opname'>('katalog');

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [mutationTypeFilter, setMutationTypeFilter] = useState('ALL');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showInboundModal, setShowInboundModal] = useState(false);
  const [showUsageModal, setShowUsageModal] = useState(false);
  const [showOpnameModal, setShowOpnameModal] = useState(false);
  const [selectedRmForQr, setSelectedRmForQr] = useState<RawMaterial | null>(null);
  const [editingRm, setEditingRm] = useState<RawMaterial | null>(null);

  // Selected item for drawer
  const [selectedMaterial, setSelectedMaterial] = useState<RawMaterial>(
    rawMaterials[0] || null
  );

  // Form states
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    category: 'Tepung & Pati',
    unit: 'kg',
    currentStock: 50,
    minimumStock: 10,
    avgPricePerUnit: 12000,
    lastPurchasedPrice: 12000,
    warehouseLocation: 'Rak A-01 (Gudang Pusat)',
    barcode: '',
    supplierId: suppliers[0]?.id || '',
    batchNumber: 'BATCH-20260901',
  });

  // Inbound Form
  const [inboundData, setInboundData] = useState({
    materialId: rawMaterials[0]?.id || '',
    quantity: 50,
    unitPrice: rawMaterials[0]?.lastPurchasedPrice || 12000,
    supplierName: suppliers[0]?.name || 'Supplier Utama',
    poNumber: `PO-LSH-${new Date().getFullYear()}09-001`,
    notes: 'Penerimaan kiriman bahan lolos uji mutu & timbangan.',
  });

  // Usage Form
  const [usageData, setUsageData] = useState({
    materialId: rawMaterials[0]?.id || '',
    quantity: 10,
    usedFor: 'Produksi Basreng Pedas Daun Jeruk Batch 093',
    operatorName: currentUser.name || 'Cecep Hidayat',
    notes: 'Pengambilan bahan untuk proses penggorengan dapur.',
  });

  // Opname Form
  const [opnameData, setOpnameData] = useState({
    materialId: rawMaterials[0]?.id || '',
    physicalStock: rawMaterials[0]?.currentStock || 0,
    reason: 'Penyusutan normal saat penggorengan / kadar air',
    notes: 'Stock opname rutin berkala gudang.',
  });

  // Multi-item Opname Sheet state
  const [opnameSheet, setOpnameSheet] = useState<{ [materialId: string]: { physicalStock: number; reason: string } }>(() => {
    const init: { [materialId: string]: { physicalStock: number; reason: string } } = {};
    rawMaterials.forEach((m) => {
      init[m.id] = { physicalStock: m.currentStock, reason: 'Cocok / Sesuai Fisik' };
    });
    return init;
  });

  // Open Handlers
  const handleOpenAdd = () => {
    setFormData({
      code: `RM-${String(rawMaterials.length + 1).padStart(3, '0')}`,
      name: '',
      category: 'Tepung & Pati',
      unit: 'kg',
      currentStock: 50,
      minimumStock: 10,
      avgPricePerUnit: 12000,
      lastPurchasedPrice: 12000,
      warehouseLocation: 'Rak A-01 (Gudang Pusat)',
      barcode: `899${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      supplierId: suppliers[0]?.id || '',
      batchNumber: 'BATCH-20260901',
    });
    setEditingRm(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (rm: RawMaterial) => {
    setEditingRm(rm);
    setFormData({
      code: rm.code,
      name: rm.name,
      category: rm.category,
      unit: rm.unit,
      currentStock: rm.currentStock,
      minimumStock: rm.minimumStock,
      avgPricePerUnit: rm.avgPricePerUnit,
      lastPurchasedPrice: rm.lastPurchasedPrice,
      warehouseLocation: rm.warehouseLocation || '',
      barcode: rm.barcode || '',
      supplierId: rm.supplierId || '',
      batchNumber: rm.batchNumber || '',
    });
    setShowAddModal(true);
  };

  const handleOpenInbound = (rm?: RawMaterial) => {
    const target = rm || selectedMaterial || rawMaterials[0];
    if (target) {
      setInboundData({
        materialId: target.id,
        quantity: 50,
        unitPrice: target.lastPurchasedPrice || target.avgPricePerUnit || 12000,
        supplierName: target.supplierName || suppliers[0]?.name || 'Supplier Utama',
        poNumber: `PO-LSH-${new Date().getFullYear()}09-${String(purchases.length + 1).padStart(3, '0')}`,
        notes: 'Penerimaan kiriman bahan baku lolos uji mutu.',
      });
    }
    setShowInboundModal(true);
  };

  const handleOpenUsage = (rm?: RawMaterial) => {
    const target = rm || selectedMaterial || rawMaterials[0];
    if (target) {
      setUsageData({
        materialId: target.id,
        quantity: Math.min(10, target.currentStock),
        usedFor: 'Produksi Basreng Pedas Daun Jeruk Batch 093',
        operatorName: currentUser.name || 'Cecep Hidayat',
        notes: 'Alokasi bahan ke lantai produksi pabrik.',
      });
    }
    setShowUsageModal(true);
  };

  const handleOpenOpname = (rm?: RawMaterial) => {
    const target = rm || selectedMaterial || rawMaterials[0];
    if (target) {
      setOpnameData({
        materialId: target.id,
        physicalStock: target.currentStock,
        reason: 'Penyusutan normal saat proses goreng / kadar air',
        notes: 'Hasil penghitungan fisik timbangan gudang.',
      });
    }
    setShowOpnameModal(true);
  };

  // Submit Handlers
  const handleSubmitMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingRm) {
      updateRawMaterial(editingRm.id, formData);
    } else {
      addRawMaterial(formData as any);
    }
    setShowAddModal(false);
  };

  const handleSubmitInbound = (e: React.FormEvent) => {
    e.preventDefault();
    recordRawMaterialInbound({
      materialId: inboundData.materialId,
      quantity: Number(inboundData.quantity) || 1,
      unitPrice: Number(inboundData.unitPrice) || 0,
      supplierName: inboundData.supplierName,
      poNumber: inboundData.poNumber,
      notes: inboundData.notes,
    });
    setShowInboundModal(false);
  };

  const handleSubmitUsage = (e: React.FormEvent) => {
    e.preventDefault();
    const result = recordRawMaterialUsage({
      materialId: usageData.materialId,
      quantity: Number(usageData.quantity) || 1,
      usedFor: usageData.usedFor,
      operatorName: usageData.operatorName,
      notes: usageData.notes,
    });
    if (result.success) {
      setShowUsageModal(false);
    } else {
      alert(result.message);
    }
  };

  const handleSubmitOpnameSingle = (e: React.FormEvent) => {
    e.preventDefault();
    recordRawMaterialOpname({
      materialId: opnameData.materialId,
      physicalStock: Number(opnameData.physicalStock) || 0,
      reason: opnameData.reason,
      notes: opnameData.notes,
    });
    setShowOpnameModal(false);
  };

  const handleSaveOpnameSheetRow = (materialId: string) => {
    const row = opnameSheet[materialId];
    if (!row) return;
    recordRawMaterialOpname({
      materialId,
      physicalStock: Number(row.physicalStock) || 0,
      reason: row.reason || 'Penyusutan / penyesuaian fisik berkala',
    });
    alert(isId ? 'Penyesuaian stok bahan berhasil disimpan ke kartu stok!' : 'Stock adjustment successfully saved!');
  };

  // Filtered Materials
  const filteredMaterials = rawMaterials.filter((r) => {
    const matchSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.barcode && r.barcode.includes(searchTerm));
    const matchCategory =
      categoryFilter === 'ALL' ||
      r.category.toLowerCase().includes(categoryFilter.toLowerCase());
    return matchSearch && matchCategory;
  });

  // Filtered Mutations
  const filteredMutations = (rawMaterialMutations || []).filter((m) => {
    const matchSearch =
      m.materialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.materialCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.notes && m.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchType =
      mutationTypeFilter === 'ALL' || m.type === mutationTypeFilter;
    return matchSearch && matchType;
  });

  // Calculations
  const totalItemsCount = rawMaterials.length;
  const criticalStockMaterials = rawMaterials.filter(
    (r) => r.currentStock <= r.minimumStock
  );
  const totalInventoryValue = rawMaterials.reduce(
    (sum, r) => sum + r.currentStock * r.avgPricePerUnit,
    0
  );

  const categories = [
    { id: 'ALL', label: t.inventory.all },
    { id: 'Tepung', label: t.inventory.flour },
    { id: 'Bumbu', label: t.inventory.seasoning },
    { id: 'Kemasan', label: t.inventory.packaging },
    { id: 'Minyak', label: t.inventory.oil },
  ];

  // Helper images
  const getMaterialImage = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('singkong') || n.includes('tapioka') || n.includes('tepung')) {
      return 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=150&auto=format&fit=crop&q=80';
    }
    if (n.includes('ikan') || n.includes('tenggiri') || n.includes('daging')) {
      return 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=150&auto=format&fit=crop&q=80';
    }
    if (n.includes('minyak')) {
      return 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=150&auto=format&fit=crop&q=80';
    }
    if (n.includes('balado') || n.includes('cabai') || n.includes('bumbu')) {
      return 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=150&auto=format&fit=crop&q=80';
    }
    if (n.includes('pouch') || n.includes('kemasan') || n.includes('stiker')) {
      return 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=150&auto=format&fit=crop&q=80';
    }
    return 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=150&auto=format&fit=crop&q=80';
  };

  // Selected material mutations
  const selectedMutations = (rawMaterialMutations || []).filter(
    (m) => m.materialId === selectedMaterial?.id
  );

  return (
    <div className="space-y-5">
      {/* Top Banner & Module Header */}
      <div className="bg-white rounded-2xl p-5 border border-[#F0E6E5] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FAF2F0] text-[#991B1B] text-[11px] font-extrabold mb-1">
            <RefreshCw className="w-3 h-3" />
            <span>{isId ? 'Flow & Manajemen Bahan Baku' : 'Raw Materials Flow & Inventory'}</span>
          </div>
          <h2 className="text-xl font-black text-stone-900 tracking-tight">
            {isId ? 'Sirkulasi & Stok Bahan Baku Pabrik' : 'Factory Raw Materials Circulation'}
          </h2>
          <p className="text-xs text-stone-500 mt-0.5 max-w-2xl">
            {isId
              ? 'Kontrol alur bahan mentah dari PO Supplier ➔ Penerimaan Gudang ➔ Penyimpanan & Buffer Stock ➔ Alokasi Produksi SPK ➔ Stock Opname & Susut.'
              : 'End-to-end raw material flow from Supplier PO ➔ Receiving ➔ Storage Buffer ➔ SPK Production ➔ Stock Opname & Shrinkage.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleOpenInbound()}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition"
          >
            <ArrowDown className="w-3.5 h-3.5" />
            <span>{isId ? '+ Terima Bahan' : '+ Inbound'}</span>
          </button>
          <button
            onClick={() => handleOpenUsage()}
            className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>{isId ? '- Pakai Produksi' : '- Use in SPK'}</span>
          </button>
          <button
            onClick={() => handleOpenOpname()}
            className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition"
          >
            <Scale className="w-3.5 h-3.5" />
            <span>{isId ? '⚖️ Opname' : '⚖️ Opname'}</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-3.5 py-2 bg-[#991B1B] hover:bg-[#881337] active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isId ? 'Bahan Baru' : 'New Material'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-[#F0E6E5] pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveViewTab('katalog')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeViewTab === 'katalog'
              ? 'bg-[#991B1B] text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-[#FAF7F5] border border-[#F0E6E5]'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>{isId ? 'Katalog & Stok Bahan' : 'Materials Catalog & Stock'}</span>
        </button>

        <button
          onClick={() => setActiveViewTab('flow')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeViewTab === 'flow'
              ? 'bg-[#991B1B] text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-[#FAF7F5] border border-[#F0E6E5]'
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          <span>{isId ? 'Visual Alur & Siklus Bahan' : 'Visual Material Pipeline'}</span>
        </button>

        <button
          onClick={() => setActiveViewTab('mutasi')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeViewTab === 'mutasi'
              ? 'bg-[#991B1B] text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-[#FAF7F5] border border-[#F0E6E5]'
          }`}
        >
          <History className="w-4 h-4" />
          <span>
            {isId ? 'Kartu Stok & Buku Mutasi' : 'Stock Card & Ledger'} ({rawMaterialMutations?.length || 0})
          </span>
        </button>

        <button
          onClick={() => setActiveViewTab('opname')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeViewTab === 'opname'
              ? 'bg-[#991B1B] text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-[#FAF7F5] border border-[#F0E6E5]'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>{isId ? 'Pusat Stock Opname' : 'Stock Opname Center'}</span>
        </button>
      </div>

      {/* 3 Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Total Material Types */}
        <div className="bg-white p-4 rounded-2xl border border-[#F0E6E5] shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-stone-500 uppercase tracking-wider block">
              {t.inventory.totalMaterialTypes}
            </span>
            <div className="text-2xl font-black text-stone-900 mt-1">
              {totalItemsCount}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{t.inventory.activelyUsed}</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#FAF2F0] text-[#991B1B] flex items-center justify-center font-bold">
            <Boxes className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Critical Stock */}
        <div className="bg-[#FDF2F2] p-4 rounded-2xl border border-red-100 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-[#991B1B] uppercase tracking-wider block">
              {t.inventory.criticalStock}
            </span>
            <div className="text-2xl font-black text-[#991B1B] mt-1">
              {criticalStockMaterials.length}
            </div>
            <div className="text-[11px] text-[#991B1B] font-semibold mt-1">
              {criticalStockMaterials.length > 0
                ? (isId ? 'Perlu dibuatkan PO ke supplier' : 'Needs purchase order')
                : (isId ? 'Semua bahan di atas batas aman' : 'All materials safe')}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#991B1B] text-white flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Inventory Value */}
        <div className="bg-white p-4 rounded-2xl border border-[#F0E6E5] shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-stone-500 uppercase tracking-wider block">
              {t.inventory.inventoryValue}
            </span>
            <div className="text-xl font-black text-stone-900 mt-1 truncate">
              Rp {totalInventoryValue.toLocaleString('id-ID')}
            </div>
            <div className="text-[11px] text-stone-400 font-medium mt-1">
              {isId ? 'Total aset bahan tersimpan' : 'Total stored materials asset'}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#FAF2F0] text-[#991B1B] flex items-center justify-center font-bold">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* TAB CONTENT: 1. KATALOG & STOK */}
      {activeViewTab === 'katalog' && (
        <div className="space-y-4">
          {/* Search Input & Category Filter Pills */}
          <div className="space-y-3">
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t.inventory.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#F0E6E5] rounded-xl text-xs outline-none focus:border-[#991B1B] transition font-medium text-stone-800"
              />
            </div>

            {/* Category Pills */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {categories.map((c) => {
                const isActive = categoryFilter === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setCategoryFilter(c.id)}
                    className={`px-5 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap active:scale-95 ${
                      isActive
                        ? 'bg-[#A31D1D] text-white shadow-xs'
                        : 'bg-[#FAF2F0] text-stone-700 hover:bg-[#FCEBE8]'
                    }`}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Two Column Layout: Table (Left) + Detail Drawer (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Table View (7 Cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-[#F0E6E5] overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF7F5] border-b border-[#F0E6E5] text-stone-600 uppercase tracking-wider text-[10px] font-extrabold">
                    <tr>
                      <th className="py-3 px-4">{t.inventory.rawMaterial}</th>
                      <th className="py-3 px-4">{t.inventory.category}</th>
                      <th className="py-3 px-4 text-right">{t.inventory.currentStock}</th>
                      <th className="py-3 px-4 text-center">{isId ? 'Aksi Cepat Flow' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0E6E5]">
                    {filteredMaterials.map((rm) => {
                      const isSelected = selectedMaterial?.id === rm.id;
                      const isCritical = rm.currentStock <= rm.minimumStock;

                      return (
                        <tr
                          key={rm.id}
                          onClick={() => setSelectedMaterial(rm)}
                          className={`cursor-pointer transition hover:bg-[#FAF7F5] ${
                            isSelected ? 'bg-[#FDF2F2]/70 font-semibold' : ''
                          }`}
                        >
                          {/* Bahan Baku */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={getMaterialImage(rm.name)}
                                alt={rm.name}
                                className="w-10 h-10 rounded-lg object-cover bg-stone-100 flex-shrink-0"
                              />
                              <div className="min-w-0">
                                <span className="font-bold text-stone-900 block truncate">
                                  {rm.name}
                                </span>
                                <span className="text-[10px] text-stone-400 font-mono">
                                  {rm.code} • {rm.warehouseLocation || 'Gudang Pusat'}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Kategori */}
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded bg-[#FAF2F0] text-[#991B1B] text-[10px] font-bold inline-block">
                              {rm.category.split(' ')[0]}
                            </span>
                          </td>

                          {/* Stok Saat Ini */}
                          <td className="py-3 px-4 text-right">
                            <div>
                              <span
                                className={`font-extrabold text-xs block ${
                                  isCritical ? 'text-[#991B1B]' : 'text-stone-900'
                                }`}
                              >
                                {rm.currentStock.toLocaleString('id-ID')} {rm.unit}
                              </span>
                              <span
                                className={`text-[10px] block ${
                                  isCritical ? 'text-[#991B1B] font-bold' : 'text-stone-400'
                                }`}
                              >
                                {t.inventory.minStock}: {rm.minimumStock} {rm.unit}
                              </span>
                            </div>
                          </td>

                          {/* Quick Flow Actions */}
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => handleOpenInbound(rm)}
                                title="Terima Kiriman Supplier (+)"
                                className="p-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition text-[10px] font-bold px-1.5"
                              >
                                + Masuk
                              </button>
                              <button
                                onClick={() => handleOpenUsage(rm)}
                                title="Catat Pemakaian Produksi (-)"
                                className="p-1 rounded bg-amber-50 text-amber-700 hover:bg-amber-100 transition text-[10px] font-bold px-1.5"
                              >
                                - Pakai
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination Footer */}
              <div className="p-3 bg-[#FAF7F5] border-t border-[#F0E6E5] text-[11px] text-stone-500 flex items-center justify-between">
                <span>
                  {t.inventory.showing} 1-{filteredMaterials.length} {t.inventory.of} {rawMaterials.length} {t.inventory.materials}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={handleOpenAdd}
                    className="px-2 py-1 bg-white border border-[#F0E6E5] rounded text-stone-700 font-bold hover:bg-stone-50"
                  >
                    + {isId ? 'Tambah Bahan' : 'Add Material'}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side Panel: Detail Bahan & Real Mutasi Drawer (5 Cols) */}
            {selectedMaterial && (
              <div className="lg:col-span-5 bg-white rounded-2xl border border-[#F0E6E5] p-5 shadow-xs space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#F0E6E5] pb-3">
                  <h3 className="font-extrabold text-sm text-stone-900">
                    {t.inventory.materialDetail}
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenInbound(selectedMaterial)}
                      className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-[10px] font-bold transition"
                      title="Terima Barang"
                    >
                      + Masuk
                    </button>
                    <button
                      onClick={() => handleOpenUsage(selectedMaterial)}
                      className="px-2 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded text-[10px] font-bold transition"
                      title="Pakai Produksi"
                    >
                      - Pakai
                    </button>
                    <button
                      onClick={() => handleOpenEdit(selectedMaterial)}
                      className="p-1.5 text-stone-400 hover:text-stone-700 transition"
                      title="Edit Data"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setSelectedRmForQr(selectedMaterial)}
                      className="p-1.5 text-stone-400 hover:text-stone-700 transition"
                      title="QR Code"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Selected Material Card */}
                <div className="flex items-center gap-3.5">
                  <img
                    src={getMaterialImage(selectedMaterial.name)}
                    alt={selectedMaterial.name}
                    className="w-16 h-16 rounded-xl object-cover bg-stone-100 flex-shrink-0"
                  />
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-sm text-stone-900">
                      {selectedMaterial.name}
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-[#FAF2F0] text-[#991B1B] text-[10px] font-bold rounded">
                        {selectedMaterial.category}
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {selectedMaterial.code}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="font-extrabold text-stone-900">
                        {selectedMaterial.currentStock.toLocaleString('id-ID')}{' '}
                        {selectedMaterial.unit}
                      </span>
                      <span className="text-stone-300">•</span>
                      <span
                        className={`flex items-center gap-1 text-[11px] font-bold ${
                          selectedMaterial.currentStock <= selectedMaterial.minimumStock
                            ? 'text-[#991B1B]'
                            : 'text-emerald-600'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            selectedMaterial.currentStock <= selectedMaterial.minimumStock
                              ? 'bg-[#991B1B]'
                              : 'bg-emerald-500'
                          }`}
                        />
                        {selectedMaterial.currentStock <= selectedMaterial.minimumStock
                          ? t.inventory.critical
                          : t.inventory.safe}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Specifications Bar */}
                <div className="grid grid-cols-2 gap-2 bg-[#FAF7F5] p-3 rounded-xl border border-[#F0E6E5] text-[11px]">
                  <div>
                    <span className="text-stone-400 block text-[10px]">Lokasi Rak</span>
                    <span className="font-bold text-stone-800">{selectedMaterial.warehouseLocation || 'Gudang Utama'}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Harga Beli Terakhir</span>
                    <span className="font-bold text-stone-800">Rp {(selectedMaterial.lastPurchasedPrice || 0).toLocaleString('id-ID')} / {selectedMaterial.unit}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Supplier Terdaftar</span>
                    <span className="font-bold text-stone-800 truncate block">{selectedMaterial.supplierName || 'PT Pemasok Utama'}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Nilai Total Persediaan</span>
                    <span className="font-bold text-stone-900">Rp {(selectedMaterial.currentStock * (selectedMaterial.avgPricePerUnit || 10000)).toLocaleString('id-ID')}</span>
                  </div>
                </div>

                {/* Riwayat Mutasi Terakhir (Real Data from Context) */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h5 className="font-extrabold text-[11px] text-stone-500 uppercase tracking-wider">
                      {isId ? 'Kartu Mutasi Bahan Terkini' : 'Recent Stock Mutations'}
                    </h5>
                    <button
                      onClick={() => setActiveViewTab('mutasi')}
                      className="text-[10px] text-[#991B1B] font-bold hover:underline"
                    >
                      {isId ? 'Lihat Semua' : 'View All'}
                    </button>
                  </div>

                  {selectedMutations.length === 0 ? (
                    <div className="p-4 bg-stone-50 rounded-xl text-center text-xs text-stone-400">
                      {isId ? 'Belum ada catatan mutasi untuk bahan ini' : 'No mutation records for this material yet'}
                    </div>
                  ) : (
                    <div className="space-y-3 relative pl-4 border-l-2 border-stone-100 max-h-64 overflow-y-auto pr-1">
                      {selectedMutations.slice(0, 5).map((mut) => {
                        const isInbound = mut.type === 'INBOUND_PO';
                        const isOutbound = mut.type === 'OUTBOUND_PRODUCTION' || mut.type === 'USAGE_MANUAL';

                        return (
                          <div key={mut.id} className="relative text-xs">
                            <div
                              className={`w-2.5 h-2.5 rounded-full absolute -left-[21px] top-1 ring-4 ring-white ${
                                isInbound
                                  ? 'bg-emerald-500'
                                  : isOutbound
                                  ? 'bg-[#991B1B]'
                                  : 'bg-purple-500'
                              }`}
                            />
                            <div className="flex items-center justify-between">
                              <span
                                className={`font-bold flex items-center gap-0.5 ${
                                  isInbound
                                    ? 'text-emerald-600'
                                    : isOutbound
                                    ? 'text-[#991B1B]'
                                    : 'text-purple-600'
                                }`}
                              >
                                {isInbound ? (
                                  <ArrowDown className="w-3 h-3" />
                                ) : (
                                  <ArrowUp className="w-3 h-3" />
                                )}
                                <span>
                                  {mut.quantity > 0 ? `+${mut.quantity}` : mut.quantity} {mut.unit}
                                </span>
                              </span>
                              <span className="text-[10px] text-stone-400">
                                {mut.date}, {mut.time}
                              </span>
                            </div>
                            <p className="text-[11px] text-stone-600 mt-0.5">
                              {mut.notes || mut.referenceNumber}
                            </p>
                            <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono mt-0.5">
                              <span>Ref: {mut.referenceNumber}</span>
                              <span>Saldo: {mut.stockAfter} {mut.unit}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Bottom Quick Flow Button */}
                <button
                  onClick={() => handleOpenOpname(selectedMaterial)}
                  className="w-full py-2.5 bg-[#FAF2F0] hover:bg-[#FCE7E7] text-[#991B1B] text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>{isId ? `Stock Opname Fisik ${selectedMaterial.name}` : `Stock Opname for ${selectedMaterial.name}`}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 2. VISUAL ALUR & SIKLUS BAHAN */}
      {activeViewTab === 'flow' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-[#F0E6E5] shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-black text-stone-900">
                {isId ? 'Diagram Alur Sirkulasi Bahan Baku Terpadu' : 'Raw Materials Circulation Flow Diagram'}
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                {isId
                  ? 'Setiap pergerakan bahan tercatat otomatis dalam buku besar persediaan untuk mencegah selisih dan human error.'
                  : 'Every raw material movement is automated and linked directly into ledger to prevent errors.'}
              </p>
            </div>

            {/* 5 Stages Interactive Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Stage 1 */}
              <div className="bg-[#FAF7F5] rounded-2xl p-4 border border-[#F0E6E5] flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-rose-100 text-[#991B1B] flex items-center justify-center font-bold">
                    <ShoppingCart className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#991B1B] block">
                    Tahap 1: Pengadaan
                  </span>
                  <h4 className="font-bold text-sm text-stone-900">PO Supplier</h4>
                  <p className="text-[11px] text-stone-600">
                    Penerbitan pesanan pembelian bahan mentah ke supplier resmi (Tepung, Cabai, Minyak, Pouch).
                  </p>
                </div>
                <div className="pt-3 border-t border-stone-200">
                  <div className="text-xs font-bold text-stone-800">{purchases.length} PO Terbit</div>
                  <button
                    onClick={() => setActiveTab('pembelian')}
                    className="mt-2 w-full py-1.5 bg-[#991B1B] text-white rounded-lg text-xs font-bold hover:bg-[#881337] transition"
                  >
                    + Buat PO
                  </button>
                </div>
              </div>

              {/* Stage 2 */}
              <div className="bg-[#FAF7F5] rounded-2xl p-4 border border-[#F0E6E5] flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 block">
                    Tahap 2: Inbound
                  </span>
                  <h4 className="font-bold text-sm text-stone-900">Penerimaan & QC</h4>
                  <p className="text-[11px] text-stone-600">
                    Pengecekan fisik di dermaga bongkar: timbangan kg/liter, batch number, tanggal kadaluarsa, dan uji organoleptik.
                  </p>
                </div>
                <div className="pt-3 border-t border-stone-200">
                  <div className="text-xs font-bold text-emerald-700">Lolos QC Masuk Gudang</div>
                  <button
                    onClick={() => handleOpenInbound()}
                    className="mt-2 w-full py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition"
                  >
                    + Terima Kiriman
                  </button>
                </div>
              </div>

              {/* Stage 3 */}
              <div className="bg-[#FAF7F5] rounded-2xl p-4 border border-[#F0E6E5] flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                    <Boxes className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 block">
                    Tahap 3: Buffer
                  </span>
                  <h4 className="font-bold text-sm text-stone-900">Gudang & Rak</h4>
                  <p className="text-[11px] text-stone-600">
                    Penyimpanan terbagi: Cold Storage (-18°C ikan), Rak Bumbu Kering, Area Jerigen Minyak, dan Rak Kemasan.
                  </p>
                </div>
                <div className="pt-3 border-t border-stone-200">
                  <div className="text-xs font-bold text-stone-800">{rawMaterials.length} Komoditas Aktif</div>
                  <button
                    onClick={() => setActiveViewTab('katalog')}
                    className="mt-2 w-full py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition"
                  >
                    Cek Stok Rak
                  </button>
                </div>
              </div>

              {/* Stage 4 */}
              <div className="bg-[#FAF7F5] rounded-2xl p-4 border border-[#F0E6E5] flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                    <Factory className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 block">
                    Tahap 4: Outbound
                  </span>
                  <h4 className="font-bold text-sm text-stone-900">Alokasi SPK BOM</h4>
                  <p className="text-[11px] text-stone-600">
                    Penarikan bahan baku sesuai resep BOM ke tim penggorengan, peracikan bumbu cabai, dan pengemasan standing pouch.
                  </p>
                </div>
                <div className="pt-3 border-t border-stone-200">
                  <div className="text-xs font-bold text-amber-800">{productionOrders.length} Batch SPK</div>
                  <button
                    onClick={() => handleOpenUsage()}
                    className="mt-2 w-full py-1.5 bg-amber-600 text-white rounded-lg text-xs font-bold hover:bg-amber-700 transition"
                  >
                    - Catat Pemakaian
                  </button>
                </div>
              </div>

              {/* Stage 5 */}
              <div className="bg-[#FAF7F5] rounded-2xl p-4 border border-[#F0E6E5] flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                    <Scale className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 block">
                    Tahap 5: Rekonsiliasi
                  </span>
                  <h4 className="font-bold text-sm text-stone-900">Opname & Waste</h4>
                  <p className="text-[11px] text-stone-600">
                    Pencatatan susut minyak penggorengan, ceceran bumbu, dan penyesuaian timbangan fisik berkala.
                  </p>
                </div>
                <div className="pt-3 border-t border-stone-200">
                  <div className="text-xs font-bold text-purple-800">Audit Trail Terjaga</div>
                  <button
                    onClick={() => setActiveViewTab('opname')}
                    className="mt-2 w-full py-1.5 bg-purple-600 text-white rounded-lg text-xs font-bold hover:bg-purple-700 transition"
                  >
                    Mulai Opname
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 3. KARTU STOK & BUKU MUTASI */}
      {activeViewTab === 'mutasi' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#F0E6E5]">
            <div className="relative max-w-md w-full">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={isId ? 'Cari bahan, referensi PO/SPK, atau catatan...' : 'Search material or reference...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-[#F0E6E5] rounded-xl text-xs outline-none focus:border-[#991B1B] transition text-stone-800"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="text-[11px] text-stone-400 font-bold whitespace-nowrap">Filter:</span>
              <select
                value={mutationTypeFilter}
                onChange={(e) => setMutationTypeFilter(e.target.value)}
                className="px-3 py-2 bg-stone-50 border border-[#F0E6E5] rounded-xl text-xs font-bold text-stone-700"
              >
                <option value="ALL">{isId ? 'Semua Jenis Mutasi' : 'All Mutation Types'}</option>
                <option value="INBOUND_PO">{isId ? 'Barang Masuk (PO Supplier)' : 'Inbound PO'}</option>
                <option value="OUTBOUND_PRODUCTION">{isId ? 'Alokasi SPK Produksi' : 'Production SPK'}</option>
                <option value="USAGE_MANUAL">{isId ? 'Pemakaian Langsung' : 'Manual Usage'}</option>
                <option value="ADJUSTMENT_OPNAME">{isId ? 'Stock Opname / Susut' : 'Stock Opname'}</option>
              </select>
            </div>
          </div>

          {/* Mutations Table */}
          <div className="bg-white rounded-2xl border border-[#F0E6E5] overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F5] border-b border-[#F0E6E5] text-stone-600 uppercase tracking-wider text-[10px] font-extrabold">
                  <tr>
                    <th className="py-3 px-4">{isId ? 'Waktu & Tanggal' : 'Date & Time'}</th>
                    <th className="py-3 px-4">{isId ? 'Bahan Baku' : 'Raw Material'}</th>
                    <th className="py-3 px-4">{isId ? 'Tipe Mutasi' : 'Type'}</th>
                    <th className="py-3 px-4 text-right">{isId ? 'Perubahan Qty' : 'Qty Change'}</th>
                    <th className="py-3 px-4 text-right">{isId ? 'Saldo Stok' : 'Balance'}</th>
                    <th className="py-3 px-4">{isId ? 'No Referensi' : 'Reference'}</th>
                    <th className="py-3 px-4">{isId ? 'Keterangan & Petugas' : 'Notes & Actor'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0E6E5]">
                  {filteredMutations.map((mut) => {
                    const isInbound = mut.type === 'INBOUND_PO';
                    const isOutbound = mut.type === 'OUTBOUND_PRODUCTION' || mut.type === 'USAGE_MANUAL';

                    return (
                      <tr key={mut.id} className="hover:bg-[#FAF7F5] transition">
                        {/* Waktu */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="font-bold text-stone-900 block">{mut.date}</span>
                          <span className="text-[10px] text-stone-400">{mut.time}</span>
                        </td>

                        {/* Bahan Baku */}
                        <td className="py-3 px-4">
                          <span className="font-bold text-stone-900 block">{mut.materialName}</span>
                          <span className="text-[10px] text-stone-400 font-mono">{mut.materialCode}</span>
                        </td>

                        {/* Tipe Mutasi */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isInbound
                                ? 'bg-emerald-100 text-emerald-800'
                                : isOutbound
                                ? 'bg-rose-100 text-[#991B1B]'
                                : 'bg-purple-100 text-purple-800'
                            }`}
                          >
                            {mut.type === 'INBOUND_PO'
                              ? 'MASUK (PO)'
                              : mut.type === 'OUTBOUND_PRODUCTION'
                              ? 'KELUAR (SPK)'
                              : mut.type === 'USAGE_MANUAL'
                              ? 'PAKAI MANUAL'
                              : 'OPNAME / SUSUT'}
                          </span>
                        </td>

                        {/* Qty Change */}
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <span
                            className={`font-black text-xs ${
                              isInbound
                                ? 'text-emerald-600'
                                : isOutbound
                                ? 'text-[#991B1B]'
                                : 'text-purple-600'
                            }`}
                          >
                            {mut.quantity > 0 ? `+${mut.quantity}` : mut.quantity} {mut.unit}
                          </span>
                        </td>

                        {/* Balance */}
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <span className="text-stone-400 text-[11px]">{mut.stockBefore} ➔ </span>
                          <span className="font-bold text-stone-900 text-xs">{mut.stockAfter} {mut.unit}</span>
                        </td>

                        {/* Referensi */}
                        <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] text-stone-700">
                          {mut.referenceNumber}
                        </td>

                        {/* Keterangan & Petugas */}
                        <td className="py-3 px-4 max-w-xs">
                          <span className="text-[11px] text-stone-800 block truncate">
                            {mut.notes || '-'}
                          </span>
                          <span className="text-[10px] text-stone-400">
                            Oleh: {mut.actorName}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-[#FAF7F5] border-t border-[#F0E6E5] text-[11px] text-stone-500">
              Total {filteredMutations.length} catatan mutasi pergerakan bahan tersimpan di sistem.
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 4. PUSAT STOCK OPNAME */}
      {activeViewTab === 'opname' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-[#F0E6E5] shadow-xs space-y-4">
            <div>
              <h3 className="font-black text-sm text-stone-900">
                {isId ? 'Lembar Kerja Stock Opname Fisik Bahan Baku' : 'Physical Stock Opname Worksheet'}
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                {isId
                  ? 'Masukkan hasil timbangan fisik riil gudang. Sistem secara otomatis menghitung selisih dan mencatat mutasi audit.'
                  : 'Enter real physical weight counts. The system auto-calculates discrepancies and creates audit entries.'}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F5] border-b border-[#F0E6E5] text-stone-600 uppercase tracking-wider text-[10px] font-extrabold">
                  <tr>
                    <th className="py-3 px-4">Nama Bahan Baku</th>
                    <th className="py-3 px-4 text-right">Stok Sistem</th>
                    <th className="py-3 px-4 text-center w-36">Stok Fisik Gudang</th>
                    <th className="py-3 px-4 text-right">Selisih Hitung</th>
                    <th className="py-3 px-4">Alasan Selisih / Susut</th>
                    <th className="py-3 px-4 text-center">Aksi Simpan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0E6E5]">
                  {rawMaterials.map((rm) => {
                    const rowState = opnameSheet[rm.id] || { physicalStock: rm.currentStock, reason: 'Cocok / Sesuai Fisik' };
                    const diff = (rowState.physicalStock || 0) - rm.currentStock;

                    return (
                      <tr key={rm.id} className="hover:bg-[#FAF7F5] transition">
                        <td className="py-3 px-4">
                          <span className="font-bold text-stone-900 block">{rm.name}</span>
                          <span className="text-[10px] text-stone-400 font-mono">{rm.code} • {rm.unit}</span>
                        </td>

                        <td className="py-3 px-4 text-right font-extrabold text-stone-800">
                          {rm.currentStock} {rm.unit}
                        </td>

                        <td className="py-3 px-4 text-center">
                          <input
                            type="number"
                            value={rowState.physicalStock}
                            onChange={(e) => {
                              const val = Number(e.target.value) || 0;
                              setOpnameSheet((prev) => ({
                                ...prev,
                                [rm.id]: {
                                  ...prev[rm.id],
                                  physicalStock: val,
                                },
                              }));
                            }}
                            className="w-28 text-center py-1.5 px-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-bold outline-none focus:border-[#991B1B]"
                          />
                        </td>

                        <td className="py-3 px-4 text-right">
                          <span
                            className={`font-black text-xs ${
                              diff === 0
                                ? 'text-stone-400'
                                : diff > 0
                                ? 'text-emerald-600'
                                : 'text-[#991B1B]'
                            }`}
                          >
                            {diff === 0 ? '0 (Cocok)' : diff > 0 ? `+${diff} ${rm.unit}` : `${diff} ${rm.unit}`}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <select
                            value={rowState.reason}
                            onChange={(e) => {
                              const val = e.target.value;
                              setOpnameSheet((prev) => ({
                                ...prev,
                                [rm.id]: {
                                  ...prev[rm.id],
                                  reason: val,
                                },
                              }));
                            }}
                            className="w-full py-1.5 px-2 bg-stone-50 border border-stone-200 rounded-lg text-[11px]"
                          >
                            <option value="Cocok / Sesuai Fisik">Cocok / Sesuai Fisik</option>
                            <option value="Penyusutan saat penggorengan / kadar air">Penyusutan saat penggorengan / kadar air</option>
                            <option value="Ceceran bumbu tabur di area racik">Ceceran bumbu tabur di area racik</option>
                            <option value="Kemasan cacat / sobek seal">Kemasan cacat / sobek seal</option>
                            <option value="Selisih timbangan supplier">Selisih timbangan supplier</option>
                            <option value="Koreksi fisik berkala">Koreksi fisik berkala</option>
                          </select>
                        </td>

                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleSaveOpnameSheetRow(rm.id)}
                            className="px-3 py-1.5 bg-[#991B1B] hover:bg-[#881337] active:scale-95 text-white text-[10px] font-bold rounded-lg transition"
                          >
                            Simpan
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: TERIMA BAHAN MASUK (INBOUND GOODS RECEIPT) */}
      {showInboundModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2 text-emerald-700">
                <ArrowDown className="w-5 h-5" />
                <h3 className="font-black text-base text-stone-900">
                  {isId ? 'Penerimaan Bahan Baku Masuk' : 'Inbound Goods Receipt'}
                </h3>
              </div>
              <button
                onClick={() => setShowInboundModal(false)}
                className="text-stone-400 hover:text-stone-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitInbound} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Pilih Bahan Baku</label>
                <select
                  value={inboundData.materialId}
                  onChange={(e) => {
                    const sel = rawMaterials.find((r) => r.id === e.target.value);
                    setInboundData({
                      ...inboundData,
                      materialId: e.target.value,
                      unitPrice: sel?.lastPurchasedPrice || inboundData.unitPrice,
                    });
                  }}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                >
                  {rawMaterials.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.code}) - Stok: {r.currentStock} {r.unit}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Jumlah Diterima</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={inboundData.quantity}
                    onChange={(e) => setInboundData({ ...inboundData, quantity: Number(e.target.value) || 0 })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-emerald-700"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Harga Beli Satuan (Rp)</label>
                  <input
                    type="number"
                    value={inboundData.unitPrice}
                    onChange={(e) => setInboundData({ ...inboundData, unitPrice: Number(e.target.value) || 0 })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Nama Supplier</label>
                  <input
                    type="text"
                    value={inboundData.supplierName}
                    onChange={(e) => setInboundData({ ...inboundData, supplierName: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">No. Referensi PO / SJ</label>
                  <input
                    type="text"
                    value={inboundData.poNumber}
                    onChange={(e) => setInboundData({ ...inboundData, poNumber: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Catatan Penerimaan / Hasil QC</label>
                <input
                  type="text"
                  value={inboundData.notes}
                  onChange={(e) => setInboundData({ ...inboundData, notes: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowInboundModal(false)}
                  className="px-4 py-2 border border-stone-200 text-stone-600 rounded-xl font-bold hover:bg-stone-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1.5"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                  <span>Simpan Penerimaan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CATAT PEMAKAIAN PRODUKSI (OUTBOUND) */}
      {showUsageModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2 text-amber-700">
                <ArrowUp className="w-5 h-5" />
                <h3 className="font-black text-base text-stone-900">
                  {isId ? 'Catat Pemakaian Bahan Produksi' : 'Record Material Production Usage'}
                </h3>
              </div>
              <button
                onClick={() => setShowUsageModal(false)}
                className="text-stone-400 hover:text-stone-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitUsage} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Pilih Bahan Baku</label>
                <select
                  value={usageData.materialId}
                  onChange={(e) => setUsageData({ ...usageData, materialId: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                >
                  {rawMaterials.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} - Tersedia: {r.currentStock} {r.unit}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Jumlah Diambil</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={usageData.quantity}
                    onChange={(e) => setUsageData({ ...usageData, quantity: Number(e.target.value) || 0 })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-amber-700"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Operator Pengambil</label>
                  <input
                    type="text"
                    value={usageData.operatorName}
                    onChange={(e) => setUsageData({ ...usageData, operatorName: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Tujuan Pemakaian / Batch SPK</label>
                <input
                  type="text"
                  required
                  value={usageData.usedFor}
                  onChange={(e) => setUsageData({ ...usageData, usedFor: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Catatan Tambahan</label>
                <input
                  type="text"
                  value={usageData.notes}
                  onChange={(e) => setUsageData({ ...usageData, notes: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUsageModal(false)}
                  className="px-4 py-2 border border-stone-200 text-stone-600 rounded-xl font-bold hover:bg-stone-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold flex items-center gap-1.5"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                  <span>Keluarkan Bahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: STOCK OPNAME CEPAT */}
      {showOpnameModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2 text-purple-700">
                <Scale className="w-5 h-5" />
                <h3 className="font-black text-base text-stone-900">
                  {isId ? 'Penyesuaian Stock Opname Bahan' : 'Stock Opname Adjustment'}
                </h3>
              </div>
              <button
                onClick={() => setShowOpnameModal(false)}
                className="text-stone-400 hover:text-stone-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitOpnameSingle} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Pilih Bahan Baku</label>
                <select
                  value={opnameData.materialId}
                  onChange={(e) => {
                    const sel = rawMaterials.find((r) => r.id === e.target.value);
                    setOpnameData({
                      ...opnameData,
                      materialId: e.target.value,
                      physicalStock: sel?.currentStock || 0,
                    });
                  }}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                >
                  {rawMaterials.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} - Stok Sistem Saat Ini: {r.currentStock} {r.unit}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Stok Fisik Hasil Timbang Gudang</label>
                <input
                  type="number"
                  required
                  value={opnameData.physicalStock}
                  onChange={(e) => setOpnameData({ ...opnameData, physicalStock: Number(e.target.value) || 0 })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-black text-purple-800 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Alasan Penyesuaian / Susut</label>
                <select
                  value={opnameData.reason}
                  onChange={(e) => setOpnameData({ ...opnameData, reason: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                >
                  <option value="Penyusutan normal saat proses goreng / kadar air">Penyusutan normal saat proses goreng / kadar air</option>
                  <option value="Ceceran bumbu tabur di area racik">Ceceran bumbu tabur di area racik</option>
                  <option value="Kemasan cacat / sobek seal">Kemasan cacat / sobek seal</option>
                  <option value="Selisih timbangan supplier">Selisih timbangan supplier</option>
                  <option value="Koreksi fisik berkala">Koreksi fisik berkala</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Keterangan Tambahan</label>
                <input
                  type="text"
                  value={opnameData.notes}
                  onChange={(e) => setOpnameData({ ...opnameData, notes: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowOpnameModal(false)}
                  className="px-4 py-2 border border-stone-200 text-stone-600 rounded-xl font-bold hover:bg-stone-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold flex items-center gap-1.5"
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>Simpan Penyesuaian</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: TAMBAH / EDIT BAHAN BAKU */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-extrabold text-base text-stone-900">
                {editingRm ? 'Edit Bahan Baku' : 'Tambah Bahan Baku Baru'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitMaterial} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Kode Bahan</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Nama Bahan</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Kategori</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                  >
                    <option value="Tepung & Pati">Tepung & Pati</option>
                    <option value="Bumbu & Cabai">Bumbu & Cabai</option>
                    <option value="Minyak & Lemak">Minyak & Lemak</option>
                    <option value="Kemasan & Plastik">Kemasan & Plastik</option>
                    <option value="Bahan Penunjang">Bahan Penunjang</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Satuan</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value as any })}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                  >
                    <option value="kg">Kilogram (kg)</option>
                    <option value="gram">Gram (g)</option>
                    <option value="liter">Liter (L)</option>
                    <option value="pcs">Pieces (pcs)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Stok Saat Ini</label>
                  <input
                    type="number"
                    value={formData.currentStock}
                    onChange={(e) =>
                      setFormData({ ...formData, currentStock: Number(e.target.value) || 0 })
                    }
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Stok Minimum (Alert)</label>
                  <input
                    type="number"
                    value={formData.minimumStock}
                    onChange={(e) =>
                      setFormData({ ...formData, minimumStock: Number(e.target.value) || 0 })
                    }
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Harga Beli Rata-rata (Rp)</label>
                  <input
                    type="number"
                    value={formData.avgPricePerUnit}
                    onChange={(e) =>
                      setFormData({ ...formData, avgPricePerUnit: Number(e.target.value) || 0 })
                    }
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Lokasi Rak Gudang</label>
                  <input
                    type="text"
                    value={formData.warehouseLocation}
                    onChange={(e) =>
                      setFormData({ ...formData, warehouseLocation: e.target.value })
                    }
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-stone-200 text-stone-600 rounded-xl font-bold hover:bg-stone-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#991B1B] hover:bg-[#881337] text-white rounded-xl font-bold"
                >
                  Simpan Bahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: QR CODE MODAL */}
      {selectedRmForQr && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-xl">
            <h4 className="font-extrabold text-sm text-stone-900">QR Code Label Bahan</h4>
            <p className="text-xs text-stone-500">{selectedRmForQr.name}</p>
            <div className="p-4 bg-white border border-stone-200 rounded-xl inline-block">
              <QRCodeSVG value={selectedRmForQr.barcode || selectedRmForQr.code} size={160} />
            </div>
            <button
              onClick={() => setSelectedRmForQr(null)}
              className="w-full py-2 bg-stone-100 text-stone-700 rounded-xl font-bold text-xs"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
