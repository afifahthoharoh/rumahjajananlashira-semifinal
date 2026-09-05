import React from 'react';
import { useApp } from '../../context/AppContext';
import { Printer, X, Banknote } from 'lucide-react';
import { PayrollRecord } from '../../types';

interface PrintSlipGajiModalProps {
  payroll?: PayrollRecord | null;
  onClose?: () => void;
}

export const PrintSlipGajiModal: React.FC<PrintSlipGajiModalProps> = ({
  payroll: propPayroll,
  onClose: propOnClose,
}) => {
  const { selectedPayrollForPrint, setSelectedPayrollForPrint } = useApp();

  const payroll = propPayroll !== undefined ? propPayroll : selectedPayrollForPrint;

  if (!payroll) return null;

  const handleClose = () => {
    if (propOnClose) {
      propOnClose();
    } else {
      setSelectedPayrollForPrint(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const baseSalary = payroll.baseSalary || 0;
  const mealAllowance = payroll.mealAllowance || 0;
  const transportAllowance = payroll.transportAllowance || 0;
  const overtimePay = payroll.overtimePay || 0;
  const bonusPerformance = payroll.bonusPerformance || 0;
  const totalLateDeductions = payroll.totalLateDeductions || 0;
  const deductions = payroll.deductions || 0;
  const netSalary = payroll.netSalary || 0;

  const totalEarnings =
    baseSalary +
    mealAllowance +
    transportAllowance +
    overtimePay +
    bonusPerformance;

  const totalDeductions =
    totalLateDeductions + deductions;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-stone-200 flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="p-4 bg-red-700 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Banknote className="w-5 h-5 text-white" />
            <h3 className="font-bold text-sm">Slip Gaji Karyawan (Resmi & Rahasia)</h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-red-800 rounded-lg text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Slip Gaji Canvas */}
        <div className="p-6 overflow-y-auto bg-stone-50 text-stone-900">
          <div className="bg-white p-6 rounded-xl shadow border border-stone-300 font-sans space-y-4">
            {/* Header Title */}
            <div className="text-center border-b-2 border-red-600 pb-3">
              <h2 className="text-lg font-black text-red-700 uppercase tracking-wide">
                RUMAH JAJANAN LASHIRA
              </h2>
              <p className="text-xs text-stone-600 font-semibold">
                SLIP GAJI & TUNJANGAN KARYAWAN
              </p>
              <p className="text-[11px] text-stone-500">
                Periode: <span className="font-bold text-stone-800">{payroll.periodMonth || '-'}</span> | No: {payroll.payrollNumber || '-'}
              </p>
            </div>

            {/* Employee Meta */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-stone-50 rounded-lg text-xs border border-stone-200">
              <div>
                <span className="text-stone-500">Nama Karyawan:</span>
                <p className="font-bold text-stone-900">{payroll.employeeName || '-'}</p>
                <span className="text-stone-500">Jabatan:</span>
                <p className="font-bold text-stone-800">{payroll.position || '-'}</p>
              </div>
              <div>
                <span className="text-stone-500">Unit / Cabang:</span>
                <p className="font-bold text-stone-900">{payroll.branchName || '-'}</p>
                <span className="text-stone-500">Hari Hadir:</span>
                <p className="font-bold text-stone-800">{payroll.workingDaysPresent || 0} Hari (Lembur: {payroll.overtimeHours || 0} Jam)</p>
              </div>
            </div>

            {/* Income & Deduction Table */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              {/* Earnings */}
              <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-100 space-y-1.5">
                <div className="font-bold text-emerald-800 border-b border-emerald-200 pb-1 uppercase text-[10px]">
                  A. PENERIMAAN (EARNINGS)
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Gaji Pokok:</span>
                  <span className="font-semibold">Rp {baseSalary.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Uang Makan:</span>
                  <span>Rp {mealAllowance.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Uang Transport:</span>
                  <span>Rp {transportAllowance.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Upah Lembur:</span>
                  <span>Rp {overtimePay.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Bonus Prestasi:</span>
                  <span>Rp {bonusPerformance.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-900 pt-1 border-t border-emerald-200">
                  <span>Total Penerimaan:</span>
                  <span>Rp {totalEarnings.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Deductions */}
              <div className="p-3 bg-rose-50/50 rounded-lg border border-rose-100 space-y-1.5">
                <div className="font-bold text-rose-800 border-b border-rose-200 pb-1 uppercase text-[10px]">
                  B. POTONGAN (DEDUCTIONS)
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Potongan Keterlambatan:</span>
                  <span className="text-rose-600 font-semibold">
                    -Rp {totalLateDeductions.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">BPJS Ketenagakerjaan:</span>
                  <span className="text-rose-600">
                    -Rp {deductions.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-rose-900 pt-1 border-t border-rose-200">
                  <span>Total Potongan:</span>
                  <span className="text-rose-700">-Rp {totalDeductions.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>

            {/* Net Take Home Pay */}
            <div className="p-4 bg-stone-900 text-white rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
                  TOTAL GAJI BERSIH (TAKE HOME PAY)
                </span>
                <span className="text-xl font-black text-emerald-400">
                  Rp {netSalary.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="text-right">
                <span className="inline-block px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-extrabold text-[11px] uppercase border border-emerald-400/30">
                  {payroll.paymentStatus || 'DRAFT'}
                </span>
              </div>
            </div>

            {/* Signatures */}
            <div className="pt-4 grid grid-cols-2 gap-4 text-center text-xs">
              <div>
                <p className="text-stone-500">Penerima,</p>
                <div className="h-12 flex items-end justify-center">
                  <span className="border-b border-stone-400 pb-0.5 font-bold text-stone-800">
                    {payroll.employeeName}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-stone-500">HRD & Finance Lashira,</p>
                <div className="h-12 flex items-end justify-center">
                  <span className="border-b border-stone-400 pb-0.5 font-bold text-stone-800">
                    Maya Kusuma, S.E.
                  </span>
                </div>
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
            Cetak Slip Gaji
          </button>
        </div>
      </div>
    </div>
  );
};
