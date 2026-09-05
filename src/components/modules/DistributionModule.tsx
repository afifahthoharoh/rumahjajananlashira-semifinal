import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StockDistributionItem, StockDistribution } from '../../types';
import {
  Send,
  Plus,
  Search,
  FileText,
  Printer,
  Truck,
  CheckCircle2,
  AlertCircle,
  X,
  Package,
  ArrowRight,
  Filter,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Car,
} from 'lucide-react';

export const DistributionModule: React.FC = () => {
  const {
    distributions,
    branches,
    products,
    createDistribution,
    confirmDistributionReceived,
    setSelectedDistributionForPrint,
    currentUser,
    t,
    language,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Selected distribution for right side panel (matching Screenshot 4)
  const [selectedDist, setSelectedDist] = useState<StockDistribution>(
    distributions[0] || null
  );

  // Form State
  const [toBranchId, setToBranchId] = useState(
    branches.find((b) => !b.isMainWarehouse)?.id || 'BR-01'
  );
  const [driverName, setDriverName] = useState('Budi Santoso');
  const [vehiclePlate, setVehiclePlate] = useState('B 1234 CD');
  const [items, setItems] = useState<StockDistributionItem[]>([
    {
      productId: products[0]?.id || '',
      productName: 'Basreng Pedas 250gr',
      sku: 'BSR-P250',
      quantitySent: 120,
    },
    {
      productId: products[1]?.id || '',
      productName: 'Keripik Kaca Original',
      sku: 'KRK-O100',
      quantitySent: 85,
    },
    {
      productId: products[2]?.id || '',
      productName: 'Makaroni Bantet Pedas',
      sku: 'MKR-B150',
      quantitySent: 50,
    },
  ]);
  const [notes, setNotes] = useState('Pengiriman rutin stok cabang.');

  const handleAddItem = () => {
    const defaultProd = products[0];
    if (!defaultProd) return;
    setItems([
      ...items,
      {
        productId: defaultProd.id,
        productName: defaultProd.name,
        sku: defaultProd.sku,
        quantitySent: 20,
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
    } else if (field === 'quantitySent') {
      updated[index].quantitySent = Math.max(1, Number(value) || 1);
    }
    setItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dest = branches.find((b) => b.id === toBranchId);
    if (!dest || items.length === 0) return;

    const newDist = createDistribution({
      fromBranchId: 'BR-PUSAT',
      fromBranchName: 'Gudang Pusat Soreang Bandung',
      toBranchId: dest.id,
      toBranchName: dest.name,
      sentDate: new Date().toISOString().split('T')[0],
      items,
      driverName,
      vehiclePlate,
      notes,
    });

    setShowAddModal(false);
    if (newDist) setSelectedDist(newDist);
  };

  const filteredDistributions = distributions.filter(
    (d) =>
      d.transferNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.suratJalanNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.toBranchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.driverName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Top Title & + Buat Pengiriman Baru Button (matching Screenshot 4) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-stone-900 tracking-tight">
            {t.distribution.title}
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            {t.distribution.subtitle}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="self-start sm:self-auto px-4 py-2 bg-[#991B1B] hover:bg-[#881337] active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t.distribution.newShipment}</span>
        </button>
      </div>

      {/* 3 Stat Cards (matching Screenshot 4) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Total Pengiriman */}
        <div className="bg-white p-4 rounded-2xl border border-[#F0E6E5] shadow-2xs">
          <span className="text-[11px] font-bold text-stone-500 block">
            {t.distribution.totalShipments}
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-stone-900">142</span>
            <span className="text-[11px] font-bold text-emerald-600">↑ 12%</span>
          </div>
        </div>

        {/* Card 2: Dalam Perjalanan */}
        <div className="bg-white p-4 rounded-2xl border border-[#F0E6E5] shadow-2xs">
          <span className="text-[11px] font-bold text-stone-500 block">
            {t.distribution.inTransit}
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-black text-stone-900">18</span>
            <span className="text-xs text-stone-500 font-medium">
              {t.distribution.vehicles}
            </span>
          </div>
        </div>

        {/* Card 3: Permintaan Menunggu */}
        <div className="bg-white p-4 rounded-2xl border border-[#F0E6E5] shadow-2xs">
          <span className="text-[11px] font-bold text-stone-500 block">
            {t.distribution.pendingRequests}
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-black text-[#991B1B]">5</span>
            <span className="text-xs text-stone-500 font-medium">
              {t.distribution.branches}
            </span>
          </div>
        </div>
      </div>

      {/* Two-Column Layout: Table (Left 7 cols) + Right Detail Panel (5 cols) (matching Screenshot 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Table View (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#F0E6E5] overflow-hidden shadow-2xs">
          {/* Header of Table */}
          <div className="p-4 border-b border-[#F0E6E5] flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-stone-900">
              {t.distribution.shipmentList}
            </h3>
            <button className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg">
              <Filter className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F5] border-b border-[#F0E6E5] text-stone-500 uppercase tracking-wider text-[10px] font-extrabold">
                <tr>
                  <th className="py-3 px-4">{t.distribution.shipmentId}</th>
                  <th className="py-3 px-4">{t.distribution.date}</th>
                  <th className="py-3 px-4">{t.distribution.destinationBranch}</th>
                  <th className="py-3 px-4">{t.distribution.totalItems}</th>
                  <th className="py-3 px-4">{t.distribution.status}</th>
                  <th className="py-3 px-4 text-right">{t.distribution.action}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0E6E5]">
                {filteredDistributions.map((d) => {
                  const isSelected = selectedDist?.id === d.id;
                  const totalItemsQty = d.items.reduce(
                    (sum, it) => sum + it.quantitySent,
                    0
                  );

                  return (
                    <tr
                      key={d.id}
                      onClick={() => setSelectedDist(d)}
                      className={`cursor-pointer transition hover:bg-[#FAF7F5] ${
                        isSelected ? 'bg-[#FDF2F2]/60' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-bold text-[#991B1B] text-xs">
                        {d.transferNumber || 'DIST-202609-001'}
                      </td>
                      <td className="py-3 px-4 text-[11px] text-stone-600">
                        {d.sentDate}, 08:30
                      </td>
                      <td className="py-3 px-4 font-semibold text-stone-900">
                        {d.toBranchName}
                      </td>
                      <td className="py-3 px-4 text-stone-600">
                        {totalItemsQty} {t.distribution.boxes}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            d.status === 'DALAM_PENGIRIMAN'
                              ? 'bg-amber-100 text-amber-800'
                              : d.status === 'DITERIMA_LENGKAP'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              d.status === 'DALAM_PENGIRIMAN'
                                ? 'bg-amber-500'
                                : d.status === 'DITERIMA_LENGKAP'
                                ? 'bg-emerald-500'
                                : 'bg-rose-500'
                            }`}
                          />
                          {d.status === 'DALAM_PENGIRIMAN'
                            ? t.distribution.inTransitStatus
                            : d.status === 'DITERIMA_LENGKAP'
                            ? t.distribution.receivedStatus
                            : t.distribution.pendingStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDist(d);
                          }}
                          className="text-[#991B1B] font-bold hover:underline"
                        >
                          {t.distribution.detail}
                        </button>
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
              {t.inventory.showing} 1-{filteredDistributions.length} {t.inventory.of} 142 data
            </span>
            <div className="flex gap-1.5">
              <button className="px-2.5 py-1 bg-white border border-[#F0E6E5] rounded-lg text-stone-700 font-medium hover:bg-stone-50">
                {t.distribution.previous}
              </button>
              <button className="px-2.5 py-1 bg-white border border-[#F0E6E5] rounded-lg text-stone-700 font-medium hover:bg-stone-50">
                {t.distribution.next}
              </button>
            </div>
          </div>
        </div>

        {/* Right Detail Panel (5 cols, matching Screenshot 4) */}
        {selectedDist && (
          <div className="lg:col-span-5 bg-white rounded-2xl border border-[#F0E6E5] p-5 shadow-xs space-y-5">
            {/* Header */}
            <div className="border-b border-[#F0E6E5] pb-3">
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
                {t.distribution.shipmentDetail}
              </span>
              <h3 className="font-extrabold text-base text-stone-900 mt-0.5">
                {selectedDist.transferNumber || 'DIST-202609-001'}
              </h3>
            </div>

            {/* STATUS PENGIRIMAN Timeline (matching Screenshot 4) */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-[11px] text-stone-400 uppercase tracking-wider">
                {t.distribution.shipmentStatus}
              </h4>

              <div className="space-y-3 relative pl-4 border-l-2 border-stone-100">
                {/* Step 1 */}
                <div className="relative text-xs">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#991B1B] absolute -left-[21px] top-1 ring-4 ring-white" />
                  <span className="font-bold text-stone-900 block">
                    {t.distribution.processedAtWarehouse}
                  </span>
                  <span className="text-[10px] text-stone-400">
                    {selectedDist.sentDate}, 08:30
                  </span>
                </div>

                {/* Step 2 */}
                <div className="relative text-xs pt-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 absolute -left-[21px] top-2 ring-4 ring-white" />
                  <span className="font-bold text-amber-700 block">
                    {t.distribution.inTransitStatus}
                  </span>
                  <span className="text-[10px] text-stone-500">
                    {selectedDist.sentDate}, 10:15 - {t.distribution.departedCourier}
                  </span>
                </div>

                {/* Step 3 */}
                <div className="relative text-xs pt-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-stone-300 absolute -left-[21px] top-2 ring-4 ring-white" />
                  <span className="font-semibold text-stone-400 block">
                    {t.distribution.arrivedAtBranch}
                  </span>
                  <span className="text-[10px] text-stone-400">
                    {t.distribution.estimatedArrival}: {selectedDist.sentDate}, 14:00
                  </span>
                </div>
              </div>
            </div>

            {/* Informasi Pengantar Card (matching Screenshot 4) */}
            <div className="space-y-2">
              <h4 className="font-extrabold text-[11px] text-stone-400 uppercase tracking-wider">
                {t.distribution.courierInfo}
              </h4>
              <div className="p-3 bg-[#FAF7F5] rounded-xl border border-[#F0E6E5] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#F0E6E5] flex items-center justify-center text-stone-600">
                  <Truck className="w-5 h-5 text-stone-600" />
                </div>
                <div>
                  <h5 className="font-extrabold text-xs text-stone-900">
                    {selectedDist.driverName || 'Budi Santoso'}
                  </h5>
                  <p className="text-[11px] text-stone-500">
                    Mobil Box • {selectedDist.vehiclePlate || 'B 1234 CD'}
                  </p>
                </div>
              </div>
            </div>

            {/* DAFTAR ITEM (matching Screenshot 4) */}
            <div className="space-y-2">
              <h4 className="font-extrabold text-[11px] text-stone-400 uppercase tracking-wider">
                {t.distribution.itemList}
              </h4>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {selectedDist.items.map((it, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 bg-[#FAF7F5] rounded-lg text-xs"
                  >
                    <div>
                      <span className="font-bold text-stone-900 block truncate">
                        {it.productName}
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">
                        SKU: {it.sku}
                      </span>
                    </div>
                    <span className="font-black text-[#991B1B]">
                      {it.quantitySent} {t.distribution.boxes}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Button: Cetak Surat Jalan (matching Screenshot 4) */}
            <button
              onClick={() => setSelectedDistributionForPrint(selectedDist)}
              className="w-full py-2.5 border border-[#991B1B] text-[#991B1B] hover:bg-[#FAF2F0] text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition active:scale-[0.98]"
            >
              <Printer className="w-4 h-4" />
              <span>{t.distribution.printWaybill}</span>
            </button>
          </div>
        )}
      </div>

      {/* Add New Shipment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-extrabold text-base text-stone-900">
                {t.distribution.newShipment}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Cabang Tujuan Retail
                </label>
                <select
                  value={toBranchId}
                  onChange={(e) => setToBranchId(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                >
                  {branches
                    .filter((b) => !b.isMainWarehouse)
                    .map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.city})
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Nama Kurir / Driver</label>
                  <input
                    type="text"
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Plat Nomor Armada</label>
                  <input
                    type="text"
                    value={vehiclePlate}
                    onChange={(e) => setVehiclePlate(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Items */}
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-stone-700">Daftar Produk Jadi</label>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-[11px] text-[#991B1B] font-bold"
                  >
                    + Tambah Item
                  </button>
                </div>
                {items.map((it, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <select
                      value={it.productId}
                      onChange={(e) => handleItemChange(idx, 'productId', e.target.value)}
                      className="flex-1 p-2 bg-stone-50 border border-stone-200 rounded-xl"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.sku})
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={it.quantitySent}
                      onChange={(e) => handleItemChange(idx, 'quantitySent', e.target.value)}
                      className="w-20 p-2 bg-stone-50 border border-stone-200 rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="text-stone-400 hover:text-red-600 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-stone-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-stone-200 text-stone-600 rounded-xl font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#991B1B] hover:bg-[#881337] text-white rounded-xl font-bold"
                >
                  Buat Pengiriman & Cetak
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
