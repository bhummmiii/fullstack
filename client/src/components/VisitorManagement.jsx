import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, UserCheck, Clock, CheckCircle, X, Car, Users, AlertCircle, RefreshCw } from 'lucide-react';
import { StatusBadge } from './shared/StatusBadge';
import { visitorsApi } from '../services/api';
import { toast } from 'sonner';

export function VisitorManagement({ userRole, currentUser }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery,  setSearchQuery]  = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [visitors, setVisitors]         = useState([]);
  const [isLoading, setIsLoading]       = useState(true);
  const [error, setError]               = useState('');
  const [isSaving, setIsSaving]         = useState(false);

  const [newVisitor, setNewVisitor] = useState({
    visitorName: '', phone: '', purpose: '',
    expectedDate: '', vehicleNumber: '', guestCount: 1,
  });

  // ── Fetch visitors ───────────────────────────────────────────────────────────
  const fetchVisitors = useCallback(async () => {
    setIsLoading(true); setError('');
    try {
      const res = await visitorsApi.getAll();
      setVisitors(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load visitors');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchVisitors(); }, [fetchVisitors]);

  // ── Add visitor ──────────────────────────────────────────────────────────────
  const handleAddVisitor = async () => {
    if (!newVisitor.visitorName || !newVisitor.phone || !newVisitor.purpose || !newVisitor.expectedDate) {
      toast.error('Please fill in all required fields');
      return;
    }
    setIsSaving(true);
    try {
      const res = await visitorsApi.create({
        visitorName: newVisitor.visitorName,
        phone: newVisitor.phone,
        purpose: newVisitor.purpose,
        expectedDate: new Date(newVisitor.expectedDate).toISOString(),
        guestCount: newVisitor.guestCount,
        vehicleNumber: newVisitor.vehicleNumber || undefined,
      });
      setVisitors(prev => [res.data, ...prev]);
      setShowAddModal(false);
      setNewVisitor({ visitorName: '', phone: '', purpose: '', expectedDate: '', vehicleNumber: '', guestCount: 1 });
      toast.success('Visitor pre-approved successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to add visitor');
    } finally {
      setIsSaving(false);
    }
  };

  // ── Update status (admin) ────────────────────────────────────────────────────
  const handleStatusUpdate = async (id, status) => {
    try {
      const res = await visitorsApi.update(id, { status });
      setVisitors(prev => prev.map(v => v._id === id ? res.data : v));
      toast.success(`Status updated to: ${status}`);
    } catch (err) {
      toast.error(err.message || 'Update failed');
    }
  };

  const statusConfig = {
    'checked-in':  { status: 'info',    label: 'Checked In'  },
    'checked-out': { status: 'success', label: 'Checked Out' },
    'Pending':     { status: 'warning', label: 'Pending'     },
    'Approved':    { status: 'info',    label: 'Approved'    },
    'Rejected':    { status: 'error',   label: 'Rejected'    },
    'expected':    { status: 'warning', label: 'Expected'    },
  };

  const filteredVisitors = visitors.filter(v => {
    const name = v.visitorName || v.name || '';
    const matchesSearch =
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.flatNumber || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || v.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const inputStyle = {
    border: '1.5px solid rgba(186,192,149,0.5)',
    background: '#f8f9f4',
    color: '#1a1e0f',
    borderRadius: '0.75rem',
    padding: '0.625rem 0.875rem',
    width: '100%',
    outline: 'none',
    fontSize: '0.875rem',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 style={{ color: '#2c3018' }} className="mb-1">Visitor Management</h1>
          <p style={{ color: '#8a9268', fontSize: '0.8125rem' }}>Track and manage visitor entries</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchVisitors}
            className="p-2.5 rounded-xl transition-all"
            style={{ background: 'rgba(99,107,47,0.08)', color: '#636B2F' }}
          >
            <RefreshCw className="size-4" />
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm transition-all hover:shadow-lg hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #636B2F, #7a8338)', boxShadow: '0 2px 12px rgba(99,107,47,0.3)' }}
          >
            <Plus className="w-4 h-4" />
            Pre-Approve Visitor
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)' }}>
          <AlertCircle className="size-5 text-red-600 shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
          <button onClick={fetchVisitors} className="ml-auto text-sm text-red-600 underline">Retry</button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Checked In',  value: visitors.filter(v => v.status === 'checked-in').length,  icon: UserCheck,   iconBg: 'rgba(59,130,246,0.15)',  color: '#2563eb' },
          { label: 'Approved',    value: visitors.filter(v => v.status === 'Approved').length,     icon: CheckCircle, iconBg: 'rgba(22,163,74,0.12)',   color: '#16a34a' },
          { label: 'Pending',     value: visitors.filter(v => v.status === 'Pending').length,      icon: Clock,       iconBg: 'rgba(234,88,12,0.12)',  color: '#ea580c' },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-5 flex items-center gap-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
            style={{ border: '1px solid rgba(99,107,47,0.12)' }}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: stat.iconBg }}>
              <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
            </div>
            <div>
              <p className="text-2xl" style={{ color: '#1a1e0f' }}>{stat.value}</p>
              <p className="text-sm" style={{ color: '#6b7155' }}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl p-4" style={{ border: '1px solid rgba(99,107,47,0.12)' }}>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#BAC095' }} />
            <input
              type="text"
              placeholder="Search visitors by name or flat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none"
              style={{ border: '1.5px solid rgba(186,192,149,0.4)', background: '#f8f9f4', color: '#1a1e0f' }}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              { key: 'all',          label: 'All'         },
              { key: 'Approved',     label: 'Approved'    },
              { key: 'Pending',      label: 'Pending'     },
              { key: 'checked-in',   label: 'Checked In'  },
              { key: 'checked-out',  label: 'Checked Out' },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilterStatus(f.key)}
                className="px-4 py-2.5 rounded-xl text-sm transition-all"
                style={filterStatus === f.key
                  ? { background: '#636B2F', color: '#fff' }
                  : { background: 'rgba(186,192,149,0.15)', color: '#3D4127' }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-10">
          <div className="w-7 h-7 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(99,107,47,0.2)', borderTopColor: '#636B2F' }} />
        </div>
      )}

      {/* Visitors Table */}
      {!isLoading && (filteredVisitors.length > 0 ? (
        <div className="bg-white rounded-xl overflow-hidden" style={{ border: '1px solid rgba(99,107,47,0.12)' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ background: 'rgba(212,222,149,0.1)', borderBottom: '1px solid rgba(186,192,149,0.25)' }}>
                <tr>
                  {['Visitor', 'Flat', 'Purpose', 'Expected', 'Guests', 'Status', ...(userRole === 'admin' ? ['Actions'] : [])].map((h) => (
                    <th key={h} className="px-6 py-3.5 text-left text-xs uppercase tracking-wider" style={{ color: '#6b7155' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredVisitors.map((visitor, idx) => {
                  const sCfg = statusConfig[visitor.status] || { status: 'warning', label: visitor.status };
                  const name = visitor.visitorName || visitor.name || '—';
                  return (
                    <tr
                      key={visitor._id || visitor.id}
                      className="transition-colors"
                      style={{ borderBottom: idx < filteredVisitors.length - 1 ? '1px solid rgba(186,192,149,0.15)' : 'none' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(212,222,149,0.06)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs flex-shrink-0" style={{ background: 'rgba(99,107,47,0.1)', color: '#636B2F' }}>
                            {name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm" style={{ color: '#1a1e0f' }}>{name}</div>
                            <div className="text-xs" style={{ color: '#9aA278' }}>{visitor.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs px-2.5 py-1 rounded-lg" style={{ background: 'rgba(99,107,47,0.1)', color: '#3D4127' }}>
                          {visitor.flatNumber || '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: '#6b7155' }}>{visitor.purpose}</td>
                      <td className="px-6 py-4 text-sm" style={{ color: '#6b7155' }}>
                        {visitor.expectedDate ? new Date(visitor.expectedDate).toLocaleDateString('en-IN') : '—'}
                        {visitor.checkInTime && (
                          <div className="text-xs mt-0.5" style={{ color: '#9aA278' }}>
                            In: {new Date(visitor.checkInTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: '#6b7155' }}>
                        <div className="flex items-center gap-1">
                          <Users className="size-3.5" style={{ color: '#BAC095' }} />
                          {visitor.guestCount || 1}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={sCfg.status} label={sCfg.label} size="sm" />
                      </td>
                      {userRole === 'admin' && (
                        <td className="px-6 py-4">
                          <select
                            value={visitor.status}
                            onChange={(e) => handleStatusUpdate(visitor._id, e.target.value)}
                            className="text-xs rounded-lg outline-none px-2 py-1"
                            style={{ border: '1px solid rgba(186,192,149,0.4)', background: '#f8f9f4', color: '#3D4127' }}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                            <option value="checked-in">Checked In</option>
                            <option value="checked-out">Checked Out</option>
                          </select>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl p-16 text-center" style={{ border: '1px solid rgba(186,192,149,0.3)' }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(186,192,149,0.2)' }}>
            <UserCheck className="size-8" style={{ color: '#BAC095' }} />
          </div>
          <p style={{ color: '#6b7155' }}>No visitors match your search criteria.</p>
        </div>
      ))}

      {/* Add Visitor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl" style={{ border: '1px solid rgba(99,107,47,0.2)' }}>
            <div className="p-6 flex items-center justify-between sticky top-0 bg-white" style={{ borderBottom: '1px solid rgba(186,192,149,0.3)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99,107,47,0.1)' }}>
                  <UserCheck className="w-5 h-5" style={{ color: '#636B2F' }} />
                </div>
                <div>
                  <h2 style={{ color: '#3D4127' }}>Pre-Approve Visitor</h2>
                  <p className="text-xs" style={{ color: '#9aA278' }}>For Flat {currentUser?.flatNumber}</p>
                </div>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors" style={{ color: '#9aA278' }}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: 'Visitor Name *',    type: 'text', placeholder: "Enter visitor's full name", key: 'visitorName' },
                { label: 'Phone Number *',    type: 'tel',  placeholder: '+91 XXXXX XXXXX',           key: 'phone'       },
                { label: 'Purpose of Visit *',type: 'text', placeholder: 'e.g., Family Visit, Delivery, Service', key: 'purpose' },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-sm mb-1.5" style={{ color: '#3D4127' }}>{field.label}</label>
                  <input
                    type={field.type}
                    value={newVisitor[field.key]}
                    onChange={(e) => setNewVisitor({ ...newVisitor, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    style={inputStyle}
                  />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1.5" style={{ color: '#3D4127' }}>Expected Date & Time *</label>
                  <input
                    type="datetime-local"
                    value={newVisitor.expectedDate}
                    onChange={(e) => setNewVisitor({ ...newVisitor, expectedDate: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1.5" style={{ color: '#3D4127' }}>No. of Guests</label>
                  <input
                    type="number" min="1" max="20"
                    value={newVisitor.guestCount}
                    onChange={(e) => setNewVisitor({ ...newVisitor, guestCount: parseInt(e.target.value) })}
                    style={inputStyle}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1.5" style={{ color: '#3D4127' }}>Vehicle Number (Optional)</label>
                <input
                  type="text"
                  value={newVisitor.vehicleNumber}
                  onChange={(e) => setNewVisitor({ ...newVisitor, vehicleNumber: e.target.value })}
                  placeholder="e.g., MH01AB1234"
                  style={inputStyle}
                />
              </div>
            </div>
            <div className="p-6 flex justify-end gap-3" style={{ borderTop: '1px solid rgba(186,192,149,0.3)' }}>
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2.5 rounded-xl text-sm transition-all"
                style={{ border: '1.5px solid rgba(186,192,149,0.5)', color: '#3D4127', background: '#f8f9f4' }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddVisitor}
                disabled={isSaving || !newVisitor.visitorName || !newVisitor.phone || !newVisitor.purpose || !newVisitor.expectedDate}
                className="px-5 py-2.5 rounded-xl text-white text-sm transition-all disabled:opacity-50 hover:shadow-lg"
                style={{ background: 'linear-gradient(135deg, #636B2F, #7a8338)' }}
              >
                {isSaving ? 'Saving…' : 'Pre-Approve'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
