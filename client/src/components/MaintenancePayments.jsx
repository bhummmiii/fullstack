import { useState, useEffect, useCallback } from 'react';
import { IndianRupee, Calendar, CheckCircle, Clock, AlertCircle, Download, TrendingUp, CreditCard, ArrowUpRight, RefreshCw } from 'lucide-react';
import { maintenanceApi } from '../services/api';
import { toast } from 'sonner';




export function MaintenancePayments({ userRole, currentUser }) {
  // Generate the last 12 months dynamically so the selector always shows current dates
  const monthOptions = (() => {
    const opts = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      opts.push(d.toLocaleString('en-IN', { month: 'long', year: 'numeric' }));
    }
    return opts;
  })();

  const [selectedMonth, setSelectedMonth] = useState('');
  const [payments, setPayments]           = useState([]);
  const [isLoading, setIsLoading]         = useState(true);
  const [error, setError]                 = useState('');

  const fetchPayments = useCallback(async () => {
    setIsLoading(true); setError('');
    try {
      const filters = {};
      if (selectedMonth) filters.month = selectedMonth;
      const res = await maintenanceApi.getAll(filters);
      setPayments(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load maintenance records');
    } finally {
      setIsLoading(false);
    }
  }, [selectedMonth]);

  useEffect(() => { fetchPayments(); }, [fetchPayments]);

  const handleMarkPaid = async (id) => {
    try {
      const res = await maintenanceApi.update(id, { status: 'Paid', paymentMethod: 'UPI' });
      setPayments(prev => prev.map(p => p._id === id ? res.data : p));
      toast.success('Marked as Paid');
    } catch (err) {
      toast.error(err.message || 'Update failed');
    }
  };

  const statusConfig = {
    Paid:    { bg: 'rgba(22,163,74,0.1)',  color: '#16a34a', icon: CheckCircle, label: 'Paid'    },
    Unpaid:  { bg: 'rgba(234,88,12,0.1)',  color: '#ea580c', icon: Clock,       label: 'Unpaid'  },
    Overdue: { bg: 'rgba(220,38,38,0.1)',  color: '#dc2626', icon: AlertCircle, label: 'Overdue' },
    paid:    { bg: 'rgba(22,163,74,0.1)',  color: '#16a34a', icon: CheckCircle, label: 'Paid'    },
    pending: { bg: 'rgba(234,88,12,0.1)',  color: '#ea580c', icon: Clock,       label: 'Pending' },
    overdue: { bg: 'rgba(220,38,38,0.1)',  color: '#dc2626', icon: AlertCircle, label: 'Overdue' },
  };

  const userPayments = payments;
  const totalAmount   = payments.reduce((s, p) => s + (p.amount || 0), 0);
  const collected     = payments.filter(p => p.status === 'Paid').reduce((s, p) => s + (p.amount || 0), 0);
  const pendingAmount = payments.filter(p => p.status === 'Unpaid').reduce((s, p) => s + (p.amount || 0), 0);
  const overdueAmount = payments.filter(p => p.status === 'Overdue').reduce((s, p) => s + (p.amount || 0), 0);
  const collectionRate = totalAmount > 0 ? Math.round((collected / totalAmount) * 100) : 0;
  const stats = { total: totalAmount, collected, pending: pendingAmount, overdue: overdueAmount };


  const inputStyle = {
    border: '1.5px solid rgba(186,192,149,0.5)',
    background: '#f8f9f4',
    color: '#1a1e0f',
    borderRadius: '0.75rem',
    padding: '0.5rem 0.875rem',
    outline: 'none',
    fontSize: '0.875rem',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 style={{ color: '#3D4127' }} className="mb-1">Maintenance &amp; Payments</h1>
          <p className="text-sm" style={{ color: '#6b7155' }}>Track monthly maintenance payments and financial records</p>
        </div>
        {userRole === 'admin' && (
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm transition-all hover:shadow-lg hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #636B2F, #7a8338)', boxShadow: '0 2px 12px rgba(99,107,47,0.3)' }}
          >
            <Download className="w-4 h-4" />
            Export Report
          </button>
        )}
        <button onClick={fetchPayments} className="p-2 rounded-xl" style={{ background: 'rgba(99,107,47,0.08)', color: '#636B2F' }}>
          <RefreshCw className="size-4" />
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)' }}>
          <AlertCircle className="size-5 text-red-600 shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
          <button onClick={fetchPayments} className="ml-auto text-sm text-red-600 underline">Retry</button>
        </div>
      )}

      {/* Admin Stats Grid */}
      {userRole === 'admin' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { label: 'Total Expected', value: `₹${stats.total.toLocaleString('en-IN')}`, icon: IndianRupee, bg: 'rgba(99,107,47,0.1)', color: '#636B2F', iconBg: 'rgba(99,107,47,0.15)' },
              { label: 'Collected', value: `₹${stats.collected.toLocaleString('en-IN')}`, icon: CheckCircle, bg: 'rgba(22,163,74,0.08)', color: '#16a34a', iconBg: 'rgba(22,163,74,0.12)' },
              { label: 'Pending', value: `₹${stats.pending.toLocaleString('en-IN')}`, icon: Clock, bg: 'rgba(234,88,12,0.08)', color: '#ea580c', iconBg: 'rgba(234,88,12,0.12)' },
              { label: 'Overdue', value: `₹${stats.overdue.toLocaleString('en-IN')}`, icon: AlertCircle, bg: 'rgba(220,38,38,0.08)', color: '#dc2626', iconBg: 'rgba(220,38,38,0.12)' },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 transition-all hover:-translate-y-0.5 hover:shadow-md"
                style={{ border: '1px solid rgba(99,107,47,0.12)' }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: stat.iconBg }}
                  >
                    <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                  </div>
                  {i === 1 && (
                    <div
                      className="text-xs px-2 py-1 rounded-lg flex items-center gap-1"
                      style={{ background: 'rgba(22,163,74,0.1)', color: '#16a34a' }}
                    >
                      <TrendingUp className="size-3" />
                      {collectionRate}%
                    </div>
                  )}
                </div>
                <p className="text-2xl mb-1" style={{ color: '#1a1e0f' }}>{stat.value}</p>
                <p className="text-sm" style={{ color: '#6b7155' }}>{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Collection Progress */}
          <div
            className="bg-white rounded-xl p-6"
            style={{ border: '1px solid rgba(99,107,47,0.12)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm" style={{ color: '#3D4127' }}>Collection Rate</h3>
                <p className="text-xs mt-0.5" style={{ color: '#9aA278' }}>{collectionRate}% collected</p>
              </div>
              <span className="text-sm" style={{ color: '#636B2F' }}>
                ₹{stats.collected.toLocaleString('en-IN')} / ₹{stats.total.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(186,192,149,0.3)' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${collectionRate}%`,
                  background: 'linear-gradient(90deg, #636B2F, #BAC095)',
                }}
              />
            </div>
          </div>
        </>
      )}

      {/* Resident View */}
      {userRole === 'resident' && (
        <div
          className="bg-white rounded-xl p-6"
          style={{ border: '1px solid rgba(99,107,47,0.12)', boxShadow: '0 2px 12px rgba(61,65,39,0.05)' }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 style={{ color: '#3D4127' }}>Your Payment Status</h2>
              <p className="text-xs mt-0.5" style={{ color: '#9aA278' }}>Flat {currentUser?.flatNumber}</p>
            </div>
            <div
              className="px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5"
              style={{ background: 'rgba(22,163,74,0.1)', color: '#16a34a' }}
            >
              <CheckCircle className="size-4" />
              All Paid
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Monthly Amount', value: '₹3,500', color: '#3D4127' },
              { label: 'Due Date', value: '31st', color: '#3D4127' },
              { label: 'Current Status', value: 'Paid ✓', color: '#16a34a' },
            ].map((item, i) => (
              <div
                key={i}
                className="text-center p-5 rounded-xl"
                style={{ background: 'rgba(212,222,149,0.12)', border: '1px solid rgba(186,192,149,0.3)' }}
              >
                <p className="text-xs mb-2" style={{ color: '#6b7155' }}>{item.label}</p>
                <p className="text-2xl" style={{ color: item.color }}>{item.value}</p>
              </div>
            ))}
          </div>

          {/* Payment Methods */}
          <div
            className="p-5 rounded-xl"
            style={{ background: 'rgba(212,222,149,0.12)', border: '1px solid rgba(186,192,149,0.3)' }}
          >
            <h3 className="text-sm mb-3 flex items-center gap-2" style={{ color: '#3D4127' }}>
              <CreditCard className="size-4" style={{ color: '#636B2F' }} />
              Payment Methods
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { method: 'UPI', detail: 'society@upi', icon: '📱' },
                { method: 'Bank Transfer', detail: 'HDFC – A/c: 1234567890', icon: '🏦' },
                { method: 'Cash', detail: 'Secretary Office (10AM–6PM)', icon: '💵' },
              ].map((pm, i) => (
                <div
                  key={i}
                  className="p-3 bg-white rounded-xl text-sm"
                  style={{ border: '1px solid rgba(186,192,149,0.3)' }}
                >
                  <span className="text-lg">{pm.icon}</span>
                  <p className="mt-1" style={{ color: '#3D4127' }}>{pm.method}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#6b7155' }}>{pm.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Payment Records Table */}
      <div
        className="bg-white rounded-xl overflow-hidden"
        style={{ border: '1px solid rgba(99,107,47,0.12)' }}
      >
        <div
          className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          style={{ borderBottom: '1px solid rgba(186,192,149,0.25)' }}
        >
          <div>
            <h2 style={{ color: '#3D4127' }} className="mb-0.5">Payment Records</h2>
            <p className="text-xs" style={{ color: '#9aA278' }}>Complete transaction history</p>
          </div>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={inputStyle}
          >
            <option value="">All Months</option>
            {monthOptions.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ background: 'rgba(212,222,149,0.1)', borderBottom: '1px solid rgba(186,192,149,0.25)' }}>
              <tr>
                {userRole === 'admin' && (
                  <>
                    <th className="px-6 py-3.5 text-left text-xs uppercase tracking-wider" style={{ color: '#6b7155' }}>Flat</th>
                    <th className="px-6 py-3.5 text-left text-xs uppercase tracking-wider" style={{ color: '#6b7155' }}>Resident</th>
                  </>
                )}
                <th className="px-6 py-3.5 text-left text-xs uppercase tracking-wider" style={{ color: '#6b7155' }}>Month</th>
                <th className="px-6 py-3.5 text-left text-xs uppercase tracking-wider" style={{ color: '#6b7155' }}>Amount</th>
                <th className="px-6 py-3.5 text-left text-xs uppercase tracking-wider" style={{ color: '#6b7155' }}>Due Date</th>
                <th className="px-6 py-3.5 text-left text-xs uppercase tracking-wider" style={{ color: '#6b7155' }}>Status</th>
                <th className="px-6 py-3.5 text-left text-xs uppercase tracking-wider" style={{ color: '#6b7155' }}>Details</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={userRole === 'admin' ? 7 : 5} className="px-6 py-12 text-center text-sm" style={{ color: '#9aA278' }}>Loading…</td></tr>
              ) : userPayments.length === 0 ? (
                <tr><td colSpan={userRole === 'admin' ? 7 : 5} className="px-6 py-12 text-center text-sm" style={{ color: '#9aA278' }}>No records found</td></tr>
              ) : userPayments.map((payment, idx) => {
                const sCfg = statusConfig[payment.status] || statusConfig.Unpaid;
                const StatusIcon = sCfg.icon;
                const residentName = payment.residentId?.name || payment.residentName || '—';
                return (
                  <tr
                    key={payment._id || payment.id}
                    className="transition-colors"
                    style={{ borderBottom: idx < userPayments.length - 1 ? '1px solid rgba(186,192,149,0.15)' : 'none' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(212,222,149,0.06)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    {userRole === 'admin' && (
                      <>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-lg text-xs" style={{ background: 'rgba(99,107,47,0.1)', color: '#3D4127' }}>
                            {payment.flatNumber}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm" style={{ color: '#1a1e0f' }}>{residentName}</td>
                      </>
                    )}
                    <td className="px-6 py-4 text-sm" style={{ color: '#6b7155' }}>{payment.month}</td>
                    <td className="px-6 py-4 text-sm" style={{ color: '#1a1e0f' }}>₹{(payment.amount || 0).toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4 text-sm" style={{ color: '#6b7155' }}>
                      {payment.dueDate ? new Date(payment.dueDate).toLocaleDateString('en-IN') : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full" style={{ background: sCfg.bg, color: sCfg.color }}>
                        <StatusIcon className="size-3" />
                        {sCfg.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: '#6b7155' }}>
                      {payment.paymentDate ? (
                        <div>
                          <div>Paid: {new Date(payment.paymentDate).toLocaleDateString('en-IN')}</div>
                          <div className="text-xs mt-0.5" style={{ color: '#9aA278' }}>{payment.paymentMethod}</div>
                        </div>
                      ) : userRole === 'admin' && payment.status !== 'Paid' ? (
                        <button
                          onClick={() => handleMarkPaid(payment._id)}
                          className="text-xs px-2 py-1 rounded-lg"
                          style={{ background: 'rgba(22,163,74,0.1)', color: '#16a34a' }}
                        >
                          Mark Paid
                        </button>
                      ) : (
                        <span style={{ color: '#9aA278' }}>—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ background: 'rgba(212,222,149,0.06)', borderTop: '1px solid rgba(186,192,149,0.2)' }}
        >
          <p className="text-xs" style={{ color: '#9aA278' }}>
            Showing {userPayments.length} records
          </p>
          {userRole === 'admin' && (
            <button
              className="flex items-center gap-1.5 text-xs transition-colors"
              style={{ color: '#636B2F' }}
            >
              <ArrowUpRight className="size-3.5" />
              View Full History
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
