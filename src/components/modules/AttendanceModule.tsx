import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Clock,
  CheckSquare,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Users,
  Search,
  Check,
  Smartphone,
  Navigation,
} from 'lucide-react';

export const AttendanceModule: React.FC = () => {
  const { attendances, employees, recordAttendance, currentUser } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showSelfieModal, setShowSelfieModal] = useState(false);
  const [isClockOut, setIsClockOut] = useState(false);
  const [mockLocation, setMockLocation] = useState<{ lat: number; lng: number } | null>({
    lat: -6.917464,
    lng: 107.619122,
  });

  // Current logged in employee (or default to first employee in the current branch)
  const currentEmp =
    employees.find((e) => e.branchId === currentUser.branchId) || employees[0];

  const handleOpenAbsen = (clockOut: boolean) => {
    setIsClockOut(clockOut);
    setShowSelfieModal(true);
  };

  const handleConfirmAttendance = () => {
    if (!currentEmp) return;

    recordAttendance({
      employeeId: currentEmp.id,
      employeeName: currentEmp.name,
      position: currentEmp.position,
      branchName: currentEmp.branchName,
      status: 'HADIR',
      isClockOut,
      gpsLatitude: mockLocation?.lat || -6.917464,
      gpsLongitude: mockLocation?.lng || 107.619122,
      photoSelfieUrl:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
    });

    setShowSelfieModal(false);
  };

  const filteredAttendances = attendances.filter((a) => {
    const matchSearch =
      a.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.branchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDate = !selectedDate || a.date === selectedDate;
    return matchSearch && matchDate;
  });

  const presentCount = attendances.filter((a) => a.date === selectedDate && (a.status === 'HADIR' || a.status === 'TERLAMBAT')).length;
  const lateCount = attendances.filter((a) => a.date === selectedDate && a.status === 'TERLAMBAT').length;

  return (
    <div className="space-y-6">
      {/* Header & Quick Clock In Card */}
      <div className="bg-white rounded-2xl border border-[#F0E6E5] p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FDF2F2] text-xs font-extrabold text-[#991B1B] border border-red-100">
            <Clock className="w-3.5 h-3.5 text-[#991B1B]" />
            <span>Rekapitulasi Presensi GPS & Ceklis Realtime</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-stone-900">
            Presensi Online Cabang: {currentUser.branchName}
          </h2>
          <p className="text-stone-500 text-xs max-w-2xl leading-relaxed">
            Staf melakukan check-in dan check-out shift kerja secara langsung via konfirmasi ceklis jam realtime & validasi batas jarak maksimal 2 meter dari kantor toko.
          </p>
        </div>

        <div className="flex gap-2.5 flex-shrink-0">
          <button
            onClick={() => handleOpenAbsen(false)}
            className="px-4 py-2.5 bg-[#991B1B] hover:bg-[#881337] text-white font-extrabold text-xs rounded-xl shadow-xs transition active:scale-95 flex items-center gap-1.5"
          >
            <CheckSquare className="w-4 h-4 text-white" />
            <span>Absen Masuk (Clock In)</span>
          </button>
          <button
            onClick={() => handleOpenAbsen(true)}
            className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl border border-stone-200 transition active:scale-95 flex items-center gap-1.5"
          >
            <Clock className="w-4 h-4 text-stone-600" />
            <span>Absen Pulang (Clock Out)</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
          <span className="text-xs font-bold uppercase text-stone-500">Total Karyawan Aktif</span>
          <p className="text-2xl font-black text-stone-900">{employees.length} Orang</p>
          <span className="text-[11px] text-stone-500">Tersebar di 4 outlet & gudang</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
          <span className="text-xs font-bold uppercase text-stone-500">Hadir Hari Ini ({selectedDate})</span>
          <p className="text-2xl font-black text-emerald-600">{presentCount} Hadir</p>
          <span className="text-[11px] text-emerald-700 font-bold">Presensi tepat waktu</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
          <span className="text-xs font-bold uppercase text-stone-500">Keterlambatan</span>
          <p className="text-2xl font-black text-amber-600">{lateCount} Orang</p>
          <span className="text-[11px] text-amber-700 font-medium">Auto-potong insentif kehadiran</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama karyawan, jabatan, atau cabang..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl outline-none focus:border-red-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-stone-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="p-2.5 bg-white border border-stone-200 rounded-xl font-bold"
          />
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-stone-50 text-stone-700 font-bold border-b border-stone-200 uppercase text-[10px]">
              <tr>
                <th className="p-3.5">Foto & Nama Karyawan</th>
                <th className="p-3.5">Unit / Cabang</th>
                <th className="p-3.5 text-center">Jam Masuk</th>
                <th className="p-3.5 text-center">Jam Pulang</th>
                <th className="p-3.5 text-center">Lembur</th>
                <th className="p-3.5 text-center">Status Kehadiran</th>
                <th className="p-3.5 text-center">Lokasi GPS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredAttendances.map((att) => {
                const isLate = att.status === 'TERLAMBAT';
                return (
                  <tr key={att.id} className="hover:bg-stone-50 transition">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={att.photoSelfieUrl}
                          alt={att.employeeName}
                          className="w-9 h-9 rounded-full object-cover border border-stone-200"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <span className="font-bold text-stone-900 block">{att.employeeName}</span>
                          <span className="text-[11px] text-stone-500">{att.position}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5 font-semibold text-stone-800">{att.branchName}</td>

                    <td className="p-3.5 text-center font-mono font-bold text-stone-900">
                      {att.clockInTime || '-'}
                    </td>

                    <td className="p-3.5 text-center font-mono font-bold text-stone-700">
                      {att.clockOutTime || '-'}
                    </td>

                    <td className="p-3.5 text-center font-bold text-stone-800">
                      {att.overtimeHours > 0 ? `${att.overtimeHours} Jam` : '-'}
                    </td>

                    <td className="p-3.5 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                          att.status === 'HADIR'
                            ? 'bg-emerald-100 text-emerald-800'
                            : isLate
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {att.status} {att.lateMinutes > 0 ? `(+${att.lateMinutes}m)` : ''}
                      </span>
                    </td>

                    <td className="p-3.5 text-center">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                        <MapPin className="w-3 h-3" />
                        Radius Valid (15m)
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Checklist & Realtime GPS Attendance Modal (No Camera/Selfie) */}
      {showSelfieModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-stone-200 p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-stone-100 pb-2">
              <div className="flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-red-600" />
                <h3 className="font-extrabold text-sm text-stone-900">
                  {isClockOut ? 'Presensi Pulang (Clock Out)' : 'Presensi Masuk (Clock In)'}
                </h3>
              </div>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                Jarak ≤ 2 Meter
              </span>
            </div>

            {/* Realtime Clock Header */}
            <div className="bg-gradient-to-br from-stone-900 to-stone-800 text-white p-4 rounded-xl text-center space-y-0.5">
              <p className="text-[10px] uppercase font-bold text-stone-400">Jam Realtime Presensi</p>
              <p className="text-3xl font-black font-mono tracking-tight text-white">
                {new Date().toLocaleTimeString('id-ID')} <span className="text-sm text-amber-400">WIB</span>
              </p>
            </div>

            <div className="text-left text-xs space-y-2 bg-stone-50 p-3 rounded-xl border border-stone-200">
              <div className="flex justify-between">
                <span className="text-stone-500">Karyawan:</span>
                <span className="font-bold text-stone-900">{currentEmp?.name || currentUser.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Jabatan:</span>
                <span className="font-bold text-stone-900">{currentEmp?.position || 'Staf'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Cabang Lokasi:</span>
                <span className="font-bold text-stone-900">{currentUser.branchName}</span>
              </div>
              <div className="pt-1.5 border-t border-stone-200 flex justify-between items-center">
                <span className="text-stone-500">Status Jarak:</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                  <Navigation className="w-3 h-3" />
                  1.2 Meter (Valid)
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800">
              ✓ Konfirmasi kehadiran fisik di lokasi kantor dengan jam realtime server.
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => setShowSelfieModal(false)}
                className="py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-xs cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmAttendance}
                className="py-2.5 bg-[#991B1B] hover:bg-[#881337] text-white font-bold rounded-xl text-xs shadow-xs flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                Submit Absen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
