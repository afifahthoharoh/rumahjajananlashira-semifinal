import React from 'react';
import { useApp } from '../../context/AppContext';
import { OwnerExecutiveDashboard } from './dashboards/OwnerExecutiveDashboard';
import { WarehouseAdminDashboard } from './dashboards/WarehouseAdminDashboard';
import { BranchStoreAdminDashboard } from './dashboards/BranchStoreAdminDashboard';
import { CashierShiftDashboard } from './dashboards/CashierShiftDashboard';
import { HRPayrollDashboard } from './dashboards/HRPayrollDashboard';
import { EmployeeSelfServiceDashboard } from './dashboards/EmployeeSelfServiceDashboard';

class DashboardErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Dashboard render error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-white rounded-3xl border border-[#F0E6E5] text-center space-y-4 max-w-md mx-auto my-12 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-[#FAF2F0] text-[#991B1B] flex items-center justify-center mx-auto text-2xl font-black">
            ⚠️
          </div>
          <div>
            <h3 className="font-extrabold text-base text-stone-900">Memuat Dashboard</h3>
            <p className="text-xs text-stone-500 mt-1">
              Data sedang disinkronkan ({this.state.error?.message || 'Error'}).
            </p>
          </div>
          <div className="flex gap-2 justify-center pt-2">
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-4 py-2 bg-[#991B1B] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#881337]"
            >
              Muat Ulang Dashboard
            </button>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="px-4 py-2 bg-stone-100 text-stone-700 text-xs font-bold rounded-xl hover:bg-stone-200"
            >
              Reset Data Demo
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export const OwnerDashboard: React.FC = () => {
  const { currentUser } = useApp();

  const renderDashboardByRole = () => {
    switch (currentUser?.role) {
      case 'OWNER':
        return <OwnerExecutiveDashboard />;
      case 'ADMIN_GUDANG':
        return <WarehouseAdminDashboard />;
      case 'ADMIN_CABANG':
        return <BranchStoreAdminDashboard />;
      case 'KASIR':
        return <CashierShiftDashboard />;
      case 'HR_ADMIN':
        return <HRPayrollDashboard />;
      case 'KARYAWAN':
        return <EmployeeSelfServiceDashboard />;
      default:
        return <OwnerExecutiveDashboard />;
    }
  };

  return (
    <DashboardErrorBoundary>
      {renderDashboardByRole()}
    </DashboardErrorBoundary>
  );
};
