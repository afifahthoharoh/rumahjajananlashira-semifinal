import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  Search,
  Download,
  Upload,
  Database,
  History,
  CheckCircle2,
  AlertTriangle,
  FileCode2,
} from 'lucide-react';

export const AuditLogModule: React.FC = () => {
  const { auditLogs, exportDatabaseJson, importDatabaseJson } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState('ALL');

  const filteredLogs = auditLogs.filter((log) => {
    const matchSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchModule = moduleFilter === 'ALL' || log.module === moduleFilter;
    return matchSearch && matchModule;
  });

  const handleExport = () => {
    const jsonStr = exportDatabaseJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Lashira_ERP_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importDatabaseJson(content);
        if (success) {
          alert('Database berhasil di-restore dan disinkronisasi!');
        } else {
          alert('Format file JSON backup tidak valid.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-600" />
            <h2 className="font-extrabold text-lg text-stone-900">MODUL 17: Audit Trail & Backup Database Realtime</h2>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Setiap mutasi stok, transaksi kasir, perubahan HPP, dan persetujuan pengiriman tercatat abadi dengan jejak digital user.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="px-3.5 py-2.5 bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5 transition active:scale-95"
          >
            <Download className="w-4 h-4 text-amber-300" />
            Backup Database JSON
          </button>
          <label className="px-3.5 py-2.5 bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 text-xs font-bold rounded-xl shadow-sm cursor-pointer flex items-center gap-1.5 transition">
            <Upload className="w-4 h-4 text-stone-600" />
            <span>Restore Backup</span>
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3 text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari aktivitas, nama operator, atau detail perubahan data..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl outline-none focus:border-red-500 font-medium"
          />
        </div>

        <select
          value={moduleFilter}
          onChange={(e) => setModuleFilter(e.target.value)}
          className="bg-white border border-stone-200 rounded-xl px-3 py-2.5 font-bold"
        >
          <option value="ALL">Semua Modul Sistem</option>
          <option value="POS">POS / Penjualan</option>
          <option value="PRODUKSI">Produksi & QC</option>
          <option value="STOK">Stok & Distribusi</option>
          <option value="PEMBELIAN">Pembelian & PO</option>
          <option value="KEUANGAN">Keuangan & Kas</option>
          <option value="PRESENSI">Presensi & Karyawan</option>
        </select>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-stone-50 text-stone-700 font-bold border-b border-stone-200 uppercase text-[10px]">
              <tr>
                <th className="p-3.5">Waktu Kejadian</th>
                <th className="p-3.5">User Pelaksana</th>
                <th className="p-3.5">Modul Sistem</th>
                <th className="p-3.5">Tindakan / Aksi</th>
                <th className="p-3.5">Detail & Parameter</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-mono">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-stone-50 transition">
                  <td className="p-3.5 text-stone-500 whitespace-nowrap">
                    {log.timestamp}
                  </td>

                  <td className="p-3.5 font-sans font-bold text-stone-900">
                    <span className="block">{log.userName}</span>
                    <span className="text-[10px] text-stone-400 font-mono">{log.role}</span>
                  </td>

                  <td className="p-3.5">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-extrabold bg-stone-100 text-stone-800 font-sans">
                      {log.module}
                    </span>
                  </td>

                  <td className="p-3.5 font-sans font-bold text-stone-800">
                    {log.action}
                  </td>

                  <td className="p-3.5 font-sans text-stone-600 max-w-md break-words">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
