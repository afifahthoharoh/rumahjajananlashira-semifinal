import React from 'react';
import { useApp } from '../../context/AppContext';
import { Printer, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Sale } from '../../types';

interface PrintReceiptModalProps {
  sale?: Sale | null;
  onClose?: () => void;
}

export const PrintReceiptModal: React.FC<PrintReceiptModalProps> = ({
  sale: propSale,
  onClose: propOnClose,
}) => {
  const { selectedSaleForPrint, setSelectedSaleForPrint } = useApp();

  const sale = propSale !== undefined ? propSale : selectedSaleForPrint;

  if (!sale) return null;

  const handleClose = () => {
    if (propOnClose) {
      propOnClose();
    } else {
      setSelectedSaleForPrint(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-stone-200 flex flex-col max-h-[90vh]">
        {/* Header Action Bar */}
        <div className="p-4 bg-stone-900 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-red-400" />
            <h3 className="font-bold text-sm">Cetak Struk Kasir (Thermal 58/80mm)</h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-stone-800 rounded-lg text-stone-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Thermal Receipt Canvas */}
        <div className="p-6 overflow-y-auto bg-stone-100 flex items-center justify-center">
          <div
            id="printable-receipt"
            className="bg-white p-6 rounded shadow-sm border border-stone-200 w-full max-w-[340px] text-stone-900 font-mono text-xs leading-relaxed"
          >
            {/* Store Branding */}
            <div className="text-center pb-3 border-b border-dashed border-stone-400">
              <h2 className="font-black text-base uppercase tracking-wider text-stone-900">
                RUMAH JAJANAN LASHIRA
              </h2>
              <p className="text-[11px] font-bold text-stone-600 mt-0.5">{sale.branchName}</p>
              <p className="text-[10px] text-stone-500">Pusat Oleh-Oleh & Snack Gurih Pedas</p>
              <p className="text-[10px] text-stone-500">Hotline/WA: 0812-3456-7890</p>
            </div>

            {/* Meta Details */}
            <div className="py-2.5 border-b border-dashed border-stone-400 space-y-0.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-stone-500">No. Nota :</span>
                <span className="font-bold">{sale.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Tanggal  :</span>
                <span>{sale.date} {sale.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Kasir    :</span>
                <span>{sale.cashierName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Pelanggan:</span>
                <span className="font-semibold">{sale.customerName || 'Umum / Walk-in'}</span>
              </div>
              {sale.customerMemberType && sale.customerMemberType !== 'REGULER' && (
                <div className="flex justify-between text-red-600 font-bold">
                  <span>Tipe Member:</span>
                  <span>{sale.customerMemberType}</span>
                </div>
              )}
            </div>

            {/* Items Purchased */}
            <div className="py-3 border-b border-dashed border-stone-400 space-y-2">
              <div className="flex justify-between font-bold text-[10px] text-stone-500 border-b border-stone-200 pb-1">
                <span>PRODUK</span>
                <span>TOTAL</span>
              </div>
              {sale.items?.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="font-semibold text-stone-800">{item.productName}</div>
                  <div className="flex justify-between text-stone-600 pl-2">
                    <span>
                      {item.quantity} x Rp {(item.price || 0).toLocaleString('id-ID')}
                    </span>
                    <span className="font-bold">Rp {(item.subtotal || 0).toLocaleString('id-ID')}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="py-2.5 border-b border-dashed border-stone-400 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rp {(sale.subtotal || 0).toLocaleString('id-ID')}</span>
              </div>
              {(sale.discountTotal || 0) > 0 && (
                <div className="flex justify-between text-red-600 font-semibold">
                  <span>Diskon {sale.voucherCode ? `(${sale.voucherCode})` : ''}</span>
                  <span>-Rp {(sale.discountTotal || 0).toLocaleString('id-ID')}</span>
                </div>
              )}
              {(sale.taxPpn || 0) > 0 && (
                <div className="flex justify-between text-stone-500">
                  <span>PPN (11%)</span>
                  <span>Rp {(sale.taxPpn || 0).toLocaleString('id-ID')}</span>
                </div>
              )}
              <div className="flex justify-between font-black text-sm pt-1 border-t border-stone-300">
                <span>TOTAL BAYAR</span>
                <span className="text-red-700 font-black">
                  Rp {(sale.grandTotal || 0).toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between pt-1 text-stone-600">
                <span>Metode Bayar:</span>
                <span className="font-bold text-stone-800">{sale.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Uang Diterima:</span>
                <span>Rp {(sale.amountPaid || 0).toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between font-bold text-stone-800">
                <span>Kembalian:</span>
                <span>Rp {(sale.changeAmount || 0).toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* QR Code & Footer */}
            <div className="pt-4 text-center space-y-2">
              <div className="flex justify-center">
                <QRCodeSVG
                  value={`https://lashira.com/verify?inv=${sale.invoiceNumber}`}
                  size={72}
                  level="M"
                />
              </div>
              <p className="text-[10px] text-stone-500">Scan QR untuk cek keaslian struk & garansi renyah</p>
              <div className="text-[10px] text-stone-600 font-medium">
                *** TERIMA KASIH ATAS KUNJUNGANNYA ***
                <br />
                Makanan Ringan Gurih, Renyah, & Nagih!
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
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
            Cetak Struk (Ctrl + P)
          </button>
        </div>
      </div>
    </div>
  );
};
