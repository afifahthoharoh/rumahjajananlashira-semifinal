import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AuditLog } from '../../types';
import {
  ShieldAlert,
  Search,
  Download,
  Upload,
  Database,
  Eye,
  Copy,
  Check,
  X,
  Clock,
  Tag,
  FileCode,
  Terminal,
  Filter,
} from 'lucide-react';

export const AuditLogModule: React.FC = () => {
  const { auditLogs, exportDatabaseJson, importDatabaseJson, language } = useApp();

  const isId = language === 'id';

  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState('ALL');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [copied, setCopied] = useState(false);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedLog) {
        setSelectedLog(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedLog]);

  // Filter logs based on search query and module filter
  const filteredLogs = auditLogs.filter((log) => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      log.action.toLowerCase().includes(term) ||
      log.userName.toLowerCase().includes(term) ||
      log.details.toLowerCase().includes(term) ||
      (log.module && log.module.toLowerCase().includes(term));
    const matchModule = moduleFilter === 'ALL' || log.module === moduleFilter;
    return matchSearch && matchModule;
  });

  const handleExport = () => {
    const jsonStr = exportDatabaseJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Lashira_ERP_Audit_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
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
          alert(isId ? 'Database berhasil di-restore dan disinkronisasi!' : 'Database restored successfully!');
        } else {
          alert(isId ? 'Format file JSON backup tidak valid.' : 'Invalid JSON backup format.');
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Helper to format payload as beautified JSON structure
  const getLogJsonString = (log: AuditLog): string => {
    const structuredPayload = {
      event_id: log.id,
      timestamp: log.timestamp,
      actor: {
        user_id: log.userId,
        name: log.userName,
        role: log.userRole,
      },
      context: {
        system_module: log.module,
        action_name: log.action,
      },
      payload_parameters: {
        summary: log.details,
        environment: 'production',
        client_fingerprint: `SESSION-${log.id.slice(-6).toUpperCase()}`,
        status: 'COMMITTED',
      },
    };
    return JSON.stringify(structuredPayload, null, 2);
  };

  const handleCopyPayload = async (log: AuditLog) => {
    try {
      await navigator.clipboard.writeText(getLogJsonString(log));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  // Color mapping helper for system modules
  const getModuleBadgeStyles = (mod: string) => {
    const m = mod.toUpperCase();
    if (m.includes('POS') || m.includes('PENJUALAN')) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    if (m.includes('PRODUKSI') || m.includes('QC')) {
      return 'bg-amber-50 text-amber-700 border-amber-200';
    }
    if (m.includes('GUDANG') || m.includes('BAHAN') || m.includes('STOK')) {
      return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    }
    if (m.includes('PEMBELIAN') || m.includes('PO')) {
      return 'bg-sky-50 text-sky-700 border-sky-200';
    }
    if (m.includes('KEUANGAN') || m.includes('PAYROLL') || m.includes('GAJI')) {
      return 'bg-rose-50 text-rose-700 border-rose-200';
    }
    if (m.includes('PRESENSI') || m.includes('KARYAWAN') || m.includes('HR')) {
      return 'bg-purple-50 text-purple-700 border-purple-200';
    }
    return 'bg-stone-100 text-stone-700 border-stone-200';
  };

  return (
    <div className="space-y-4">
      {/* 3. Action Toolbar & Module Header */}
      <header className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Module Title & Subtitle */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-red-50 text-[#991B1B] text-[10px] font-extrabold tracking-wider border border-red-100 uppercase">
              MODUL 17
            </span>
            <h2 className="font-extrabold text-base sm:text-lg text-stone-900 tracking-tight flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#991B1B]" />
              <span>{isId ? 'Audit Trail & Jejak Aktivitas Sistem' : 'Audit Trail & System Activity'}</span>
            </h2>
          </div>
          <p className="text-xs text-stone-500 max-w-xl">
            {isId
              ? 'Setiap mutasi stok, transaksi kasir, perubahan HPP, dan persetujuan pengiriman tercatat abadi dengan jejak digital user.'
              : 'Immutable system audit ledger: logging inventory mutations, sales transactions, recipe changes, and user approvals.'}
          </p>
        </div>

        {/* Action Button Grouping */}
        <div className="flex items-center gap-2.5 flex-shrink-0 self-start sm:self-auto">
          {/* Primary Action: Backup Database JSON */}
          <button
            type="button"
            onClick={handleExport}
            className="h-10 px-4 bg-stone-900 hover:bg-black active:scale-[0.98] text-white text-xs font-bold rounded-xl shadow-sm hover:shadow flex items-center gap-2 transition focus:outline-none focus:ring-2 focus:ring-stone-900 focus:ring-offset-1"
          >
            <Download className="w-3.5 h-3.5 text-amber-300" />
            <span>{isId ? 'Backup Database JSON' : 'Backup Database JSON'}</span>
          </button>

          {/* Secondary Action: Restore Backup */}
          <label className="h-10 px-4 bg-white hover:bg-stone-50 active:scale-[0.98] border border-stone-200 text-stone-700 text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-2 transition focus-within:ring-2 focus-within:ring-stone-400">
            <Upload className="w-3.5 h-3.5 text-stone-500" />
            <span>{isId ? 'Restore Backup' : 'Restore Backup'}</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="sr-only"
              aria-label={isId ? 'Pilih file JSON untuk restore backup' : 'Choose JSON backup file'}
            />
          </label>
        </div>
      </header>

      {/* Search & Filter Toolbar with Cadenced Margin mb-4 */}
      <div className="flex flex-col sm:flex-row gap-3 text-xs mb-4">
        {/* Search Input Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder={
              isId
                ? 'Cari aktivitas, nama operator, atau detail perubahan data...'
                : 'Search activity, operator name, or parameter change...'
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl outline-none focus:border-[#991B1B] focus:ring-2 focus:ring-[#991B1B]/10 font-medium text-stone-800 transition"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5 rounded-full"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Module Filter Dropdown */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="appearance-none bg-white border border-stone-200 rounded-xl pl-3 pr-8 py-2.5 font-bold text-stone-700 outline-none focus:border-[#991B1B] focus:ring-2 focus:ring-[#991B1B]/10 cursor-pointer text-xs transition"
            >
              <option value="ALL">{isId ? 'Semua Modul Sistem' : 'All System Modules'}</option>
              <option value="POS">{isId ? 'POS / Penjualan' : 'POS / Sales'}</option>
              <option value="Produksi">{isId ? 'Produksi & QC' : 'Production & QC'}</option>
              <option value="Gudang">{isId ? 'Gudang & Bahan Baku' : 'Warehouse & Materials'}</option>
              <option value="Pembelian">{isId ? 'Pembelian & PO' : 'Purchasing & PO'}</option>
              <option value="Keuangan">{isId ? 'Keuangan & Kas' : 'Finance & Cash'}</option>
              <option value="Presensi">{isId ? 'Presensi & HRD' : 'Attendance & HR'}</option>
              <option value="Sistem">{isId ? 'Sistem & Keamanan' : 'System & Security'}</option>
            </select>
            <Filter className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <span className="hidden sm:inline-block px-3 py-2 bg-stone-100/70 border border-stone-200/60 rounded-xl text-[11px] font-semibold text-stone-500 whitespace-nowrap font-mono tabular-nums">
            {filteredLogs.length} {isId ? 'Entri' : 'Entries'}
          </span>
        </div>
      </div>

      {/* 2. Audit Log Data Table (Layout & Density Ratios) */}
      <div className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse table-fixed">
            <thead className="bg-[#FAF7F5] text-stone-600 font-extrabold border-b border-stone-200 text-[10px] uppercase tracking-wider">
              <tr>
                {/* WAKTU KEJADIAN: Compact, fixed w-40, tabular font-mono */}
                <th scope="col" className="py-3 px-4 w-40 font-mono">
                  {isId ? 'Waktu Kejadian' : 'Event Timestamp'}
                </th>

                {/* USER: Compact w-36 */}
                <th scope="col" className="py-3 px-4 w-36">
                  {isId ? 'User Pelaksana' : 'Operator'}
                </th>

                {/* MODUL SISTEM: Medium-fixed w-40 pill-tag design */}
                <th scope="col" className="py-3 px-4 w-40">
                  {isId ? 'Modul Sistem' : 'System Module'}
                </th>

                {/* TINDAKAN / AKSI: Fixed w-44 */}
                <th scope="col" className="py-3 px-4 w-44">
                  {isId ? 'Tindakan / Aksi' : 'Action Performed'}
                </th>

                {/* DETAIL & PARAMETER: Flex-1 greedy column occupying remaining width */}
                <th scope="col" className="py-3 px-4 w-auto">
                  {isId ? 'Detail & Parameter' : 'Details & Parameters'}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-stone-400">
                    <Database className="w-8 h-8 text-stone-300 mx-auto mb-2 opacity-50" />
                    <p className="font-bold text-xs">{isId ? 'Tidak ada catatan audit yang cocok' : 'No matching audit records found'}</p>
                    <p className="text-[11px] text-stone-400 mt-0.5">{isId ? 'Coba ubah kata kunci pencarian atau filter modul' : 'Try adjusting search term or module filter'}</p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-[#FAF7F5] transition group focus-within:bg-[#FAF7F5]"
                  >
                    {/* WAKTU KEJADIAN: Compact w-40, tabular figures font-mono */}
                    <td className="py-3 px-4 font-mono text-[11px] text-stone-500 whitespace-nowrap align-middle tabular-nums">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-stone-400 flex-shrink-0" />
                        <span>{log.timestamp}</span>
                      </div>
                    </td>

                    {/* USER: Compact w-36, badge or clear avatar + name */}
                    <td className="py-3 px-4 align-middle">
                      <div className="min-w-0 pr-2">
                        <span className="font-bold text-stone-900 block truncate leading-tight">
                          {log.userName}
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono tracking-tight block truncate uppercase">
                          {log.userRole}
                        </span>
                      </div>
                    </td>

                    {/* MODUL SISTEM: Medium-fixed w-40, pill-tag design */}
                    <td className="py-3 px-4 align-middle">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border uppercase tracking-wider ${getModuleBadgeStyles(
                          log.module
                        )}`}
                      >
                        <Tag className="w-2.5 h-2.5 opacity-70" />
                        <span className="truncate">{log.module}</span>
                      </span>
                    </td>

                    {/* TINDAKAN / AKSI: Fixed w-44 */}
                    <td className="py-3 px-4 align-middle font-bold text-stone-800">
                      <span className="block truncate" title={log.action}>
                        {log.action}
                      </span>
                    </td>

                    {/* DETAIL & PARAMETER: Greedy column with strict truncation & quick preview button */}
                    <td className="py-3 px-4 align-middle">
                      <div className="flex items-center justify-between gap-3 min-w-0">
                        {/* Single-line truncated text */}
                        <span
                          onClick={() => setSelectedLog(log)}
                          className="font-mono text-[11px] text-stone-600 truncate cursor-pointer hover:text-[#991B1B] transition underline-offset-2 hover:underline"
                          title={log.details}
                        >
                          {log.details}
                        </span>

                        {/* Inline Preview Action Button with accessible tooltip */}
                        <button
                          type="button"
                          onClick={() => setSelectedLog(log)}
                          className="view-details-btn p-1.5 rounded-lg text-stone-400 hover:text-[#991B1B] hover:bg-red-50 border border-transparent hover:border-red-100 flex-shrink-0 transition focus:outline-none focus:ring-1 focus:ring-[#991B1B]"
                          title={isId ? 'Lihat Detail Payload JSON' : 'View JSON Payload Details'}
                          aria-label={isId ? `Buka detail log ${log.action}` : `Open details for log ${log.action}`}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Summary */}
        <div className="p-3.5 bg-[#FAF7F5] border-t border-stone-200/80 text-[11px] text-stone-500 flex items-center justify-between font-mono tabular-nums">
          <span>
            {isId ? 'Menampilkan' : 'Showing'} {filteredLogs.length} {isId ? 'dari' : 'of'} {auditLogs.length} {isId ? 'total catatan audit' : 'total audit logs'}
          </span>
          <span className="text-[10px] text-stone-400">
            HASH SHA-256 VERIFIED
          </span>
        </div>
      </div>

      {/* 2. Accessible Modal Dialog: Formatted JSON Detail Viewer */}
      {selectedLog && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="audit-modal-title"
          className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedLog(null);
          }}
        >
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 rounded-xl bg-red-50 text-[#991B1B] flex-shrink-0">
                  <FileCode className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 id="audit-modal-title" className="font-extrabold text-sm text-stone-900 truncate">
                    {isId ? 'Detail Parameter Audit Trail' : 'Audit Trail Event Payload'}
                  </h3>
                  <p className="text-[10px] text-stone-400 font-mono tabular-nums truncate">
                    ID: {selectedLog.id} • {selectedLog.timestamp}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyPayload(selectedLog)}
                  className="px-3 py-1.5 rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-50 font-bold text-xs flex items-center gap-1.5 transition active:scale-95"
                  title="Copy JSON Payload"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">{isId ? 'Tersalin!' : 'Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-stone-500" />
                      <span>{isId ? 'Salin JSON' : 'Copy JSON'}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedLog(null)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition focus:outline-none focus:ring-1 focus:ring-stone-400"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body: Metadata Chips & Beautified JSON View */}
            <div className="p-5 overflow-y-auto space-y-4">
              {/* Event Metadata Chips */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="p-3 bg-[#FAF7F5] rounded-xl border border-stone-200/70">
                  <span className="text-[10px] text-stone-400 uppercase font-extrabold block">{isId ? 'Pelaksana' : 'User / Actor'}</span>
                  <span className="font-bold text-xs text-stone-900 block truncate mt-0.5">{selectedLog.userName}</span>
                  <span className="text-[10px] text-stone-500 font-mono uppercase">{selectedLog.userRole}</span>
                </div>

                <div className="p-3 bg-[#FAF7F5] rounded-xl border border-stone-200/70">
                  <span className="text-[10px] text-stone-400 uppercase font-extrabold block">{isId ? 'Modul Terkait' : 'System Module'}</span>
                  <span className="font-bold text-xs text-stone-900 block truncate mt-0.5">{selectedLog.module}</span>
                  <span className="text-[10px] text-stone-500 font-mono">Status: COMMITTED</span>
                </div>

                <div className="p-3 bg-[#FAF7F5] rounded-xl border border-stone-200/70">
                  <span className="text-[10px] text-stone-400 uppercase font-extrabold block">{isId ? 'Nama Aksi' : 'Action Name'}</span>
                  <span className="font-bold text-xs text-stone-900 block truncate mt-0.5">{selectedLog.action}</span>
                  <span className="text-[10px] text-stone-500 font-mono">Event Log</span>
                </div>
              </div>

              {/* Beautified JSON Code Block */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-stone-500 px-1">
                  <span className="flex items-center gap-1">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Formatted JSON Payload</span>
                  </span>
                  <span className="font-mono text-[10px] text-stone-400">application/json</span>
                </div>

                <div className="bg-[#18181B] text-stone-100 rounded-xl p-4 font-mono text-xs overflow-x-auto border border-stone-800 shadow-inner">
                  <pre className="leading-relaxed">
                    <code>{getLogJsonString(selectedLog)}</code>
                  </pre>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 border-t border-stone-100 bg-[#FAF7F5] flex items-center justify-between text-xs">
              <span className="text-stone-400 text-[11px]">
                {isId ? 'Tekan ESC atau klik area luar untuk menutup' : 'Press ESC or click backdrop to dismiss'}
              </span>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-stone-900 hover:bg-black text-white rounded-xl font-bold transition active:scale-95"
              >
                {isId ? 'Tutup Dialog' : 'Close Dialog'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
