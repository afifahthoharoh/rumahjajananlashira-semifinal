import React from 'react';
import { useApp } from '../../context/AppContext';
import { Printer, X, FileText } from 'lucide-react';
import { StockDistribution } from '../../types';

interface PrintSuratJalanModalProps {
  distribution?: StockDistribution | null;
  onClose?: () => void;
}

export const PrintSuratJalanModal: React.FC<PrintSuratJalanModalProps> = ({
  distribution: propDistribution,
  onClose: propOnClose,
}) => {
  const { selectedDistributionForPrint, setSelectedDistributionForPrint } = useApp();

  const distribution = propDistribution !== undefined ? propDistribution : selectedDistributionForPrint;

  if (!distribution) return null;

  const handleClose = () => {
    if (propOnClose) {
      propOnClose();
    } else {
      setSelectedDistributionForPrint(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-stone-200 flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="p-4 bg-red-700 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-white" />
            <h3 className="font-bold text-sm">Surat Jalan Distribusi Barang (Dokumen Resmi)</h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-red-800 rounded-lg text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Official Printable Surat Jalan Document */}
        <div className="p-8 overflow-y-auto bg-stone-50 text-stone-900">
          <div className="bg-white p-8 rounded-xl shadow border border-stone-300 font-sans space-y-6">
            {/* Header Document */}
            <div className="flex justify-between items-start border-b-2 border-red-600 pb-4">
              <div>
                <h1 className="text-xl font-extrabold text-red-700 uppercase tracking-wide">
                  RUMAH JAJANAN LASHIRA
                </h1>
                <p className="text-xs text-stone-600 font-medium">
                  Produsen Snack Makanan Ringan Berkualitas Tinggi
                </p>
                <p className="text-xs text-stone-500">
                  Gudang Pusat: Jl. Raya Soreang KM 14 No. 88, Bandung • Telp: 022-5891234
                </p>
              </div>
              <div className="text-right">
                <span className="inline-block bg-red-100 text-red-800 text-xs font-black px-3 py-1 rounded-md uppercase tracking-wider">
                  SURAT JALAN
                </span>
                <p className="text-xs font-bold text-stone-700 mt-1">
                  No: {distribution.suratJalanNumber}
                </p>
                <p className="text-xs text-stone-500">
                  Tgl: {distribution.sentDate}
                </p>
              </div>
            </div>

            {/* Distribution Meta */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-stone-50 rounded-lg text-xs border border-stone-200">
              <div>
                <span className="font-bold text-stone-500 uppercase text-[10px] block">PENGIRIM:</span>
                <p className="font-extrabold text-stone-800 text-sm">{distribution.fromBranchName}</p>
                <p className="text-stone-600">Driver / Kurir: <span className="font-semibold">{distribution.driverName}</span></p>
                <p className="text-stone-600">No. Kendaraan: <span className="font-semibold">{distribution.vehiclePlate}</span></p>
              </div>
              <div>
                <span className="font-bold text-stone-500 uppercase text-[10px] block">TUJUAN PENERIMA:</span>
                <p className="font-extrabold text-stone-800 text-sm">{distribution.toBranchName}</p>
                <p className="text-stone-600">Status Pengiriman: <span className="font-semibold text-red-700">{distribution.status}</span></p>
                {distribution.notes && (
                  <p className="text-stone-500 italic mt-0.5">Catatan: {distribution.notes}</p>
                )}
              </div>
            </div>

            {/* Table of Items */}
            <div>
              <table className="w-full text-xs text-left border-collapse border border-stone-300">
                <thead>
                  <tr className="bg-stone-100 text-stone-800 font-bold border-b border-stone-300">
                    <th className="p-2.5 border-r border-stone-300 text-center w-10">No</th>
                    <th className="p-2.5 border-r border-stone-300">Kode SKU</th>
                    <th className="p-2.5 border-r border-stone-300">Nama Produk Jadi</th>
                    <th className="p-2.5 border-r border-stone-300 text-center w-24">Jumlah Kirim</th>
                    <th className="p-2.5 border-r border-stone-300 text-center w-24">Jumlah Terima</th>
                    <th className="p-2.5 text-center">Kondisi / Ket.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {distribution.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-stone-50">
                      <td className="p-2.5 text-center border-r border-stone-300 font-bold text-stone-500">{idx + 1}</td>
                      <td className="p-2.5 border-r border-stone-300 font-mono font-semibold text-stone-700">{item.sku}</td>
                      <td className="p-2.5 border-r border-stone-300 font-bold text-stone-900">{item.productName}</td>
                      <td className="p-2.5 border-r border-stone-300 text-center font-bold text-stone-900 bg-red-50/50">
                        {item.quantitySent} pcs
                      </td>
                      <td className="p-2.5 border-r border-stone-300 text-center font-bold text-stone-700">
                        {item.quantityReceived !== undefined ? `${item.quantityReceived} pcs` : '-'}
                      </td>
                      <td className="p-2.5 text-center text-stone-500">Baik / Segel Utuh</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Signature Columns */}
            <div className="pt-8 grid grid-cols-3 gap-4 text-center text-xs">
              <div>
                <p className="text-stone-500 font-medium">Dibuat Oleh (Admin Gudang),</p>
                <div className="h-16 flex items-end justify-center">
                  <span className="border-b border-stone-400 pb-1 font-bold text-stone-800">
                    Budi Santoso
                  </span>
                </div>
              </div>
              <div>
                <p className="text-stone-500 font-medium">Dibawa Oleh (Driver),</p>
                <div className="h-16 flex items-end justify-center">
                  <span className="border-b border-stone-400 pb-1 font-bold text-stone-800">
                    {distribution.driverName}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-stone-500 font-medium">Diterima Oleh (Admin Cabang),</p>
                <div className="h-16 flex items-end justify-center">
                  <span className="border-b border-stone-400 pb-1 font-bold text-stone-800">
                    {distribution.receivedBy || '( .............................. )'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-end gap-3 no-print">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-xs font-bold text-stone-600 hover:bg-stone-200 rounded-xl transition"
          >
            Tutup
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow flex items-center gap-2 transition"
          >
            <Printer className="w-4 h-4" />
            Cetak Surat Jalan (A4 / PDF)
          </button>
        </div>
      </div>
    </div>
  );
};
