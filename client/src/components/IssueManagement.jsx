import { useState, useEffect, useCallback } from 'react';
import { AlertCircle, Eye, Search, RefreshCw, Plus } from 'lucide-react';

import { StatusBadge } from './shared/StatusBadge';
import { DetailDrawer } from './shared/DetailDrawer';
import { ConfirmModal } from './shared/ConfirmModal';
import { Button } from './ui/button';
import { complaintsApi } from '../services/api';

export function IssueManagement({ userRole, currentUser }) {
  const [searchQuery, setSearchQuery]       = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(''); // debounced value sent to API
  const [filterStatus, setFilterStatus]     = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [selectedIssue, setSelectedIssue]   = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [newStatus, setNewStatus]           = useState('In Progress');
  const [assignedTo, setAssignedTo]         = useState('');

  // API state
  const [issues, setIssues]     = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]       = useState('');
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });

  // ── Debounce search input (400 ms) so we don't fire an API call per keystroke ─
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // ── Fetch complaints ────────────────────────────────────────────────────────
  const fetchIssues = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const filters = {};
      if (filterStatus !== 'all')   filters.status   = filterStatus;
      if (filterPriority !== 'all') filters.priority = filterPriority;
      if (debouncedSearch)          filters.search   = debouncedSearch;

      const res = await complaintsApi.getAll(filters);
      setIssues(res.data || []);
      setPagination(res.pagination || { total: 0, pages: 1 });
    } catch (err) {
      setError(err.message || 'Failed to load complaints');
    } finally {
      setIsLoading(false);
    }
  }, [filterStatus, filterPriority, debouncedSearch]);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  // ── Update complaint status (admin) ─────────────────────────────────────────
  const handleStatusUpdate = async () => {
    if (!selectedIssue) return;
    try {
      const payload = { status: newStatus };
      if (assignedTo.trim()) payload.assignedTo = assignedTo.trim();
      const res = await complaintsApi.update(selectedIssue._id, payload);
      setIssues(prev => prev.map(i => i._id === selectedIssue._id ? res.data : i));
      setSelectedIssue(null);
      setShowUpdateModal(false);
    } catch (err) {
      alert(err.message || 'Failed to update complaint');
    }
  };

  // ── Delete complaint ────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this complaint?')) return;
    try {
      await complaintsApi.delete(id);
      setIssues(prev => prev.filter(i => i._id !== id));
      if (selectedIssue?._id === id) setSelectedIssue(null);
    } catch (err) {
      alert(err.message || 'Failed to delete complaint');
    }
  };

  const priorityConfig = {
    urgent: { bg: 'rgba(220,38,38,0.1)', text: '#dc2626', label: 'Urgent' },
    high:   { bg: 'rgba(234,88,12,0.1)', text: '#ea580c', label: 'High'   },
    medium: { bg: 'rgba(202,138,4,0.1)', text: '#ca8a04', label: 'Medium' },
    low:    { bg: 'rgba(107,114,128,0.1)', text: '#6b7280', label: 'Low'  },
  };

  const statusFilters = [
    { key: 'all', label: 'All' },
    { key: 'Open', label: 'Open' },
    { key: 'In Progress', label: 'In Progress' },
    { key: 'Resolved', label: 'Resolved' },
  ];

  const priorityFilters = [
    { key: 'all', label: 'All Priority' },
    { key: 'urgent', label: 'Urgent' },
    { key: 'high',   label: 'High'   },
    { key: 'medium', label: 'Medium' },
    { key: 'low',    label: 'Low'    },
  ];

  const statCards = [
    { label: 'Total',       value: issues.length,                               bg: 'rgba(99,107,47,0.1)',   color: '#636B2F' },
    { label: 'Open',        value: issues.filter(i => i.status === 'Open').length,        bg: 'rgba(234,88,12,0.1)',   color: '#ea580c' },
    { label: 'In Progress', value: issues.filter(i => i.status === 'In Progress').length, bg: 'rgba(99,107,47,0.12)',  color: '#636B2F' },
    { label: 'Resolved',    value: issues.filter(i => i.status === 'Resolved').length,    bg: 'rgba(22,163,74,0.1)',   color: '#16a34a' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 style={{ color: '#2c3018' }} className="mb-1">Issues &amp; Complaints</h1>
          <p style={{ color: '#8a9268', fontSize: '0.8125rem' }}>
            {pagination.total > 0 ? `${pagination.total} complaint${pagination.total !== 1 ? 's' : ''} total` : 'Track and manage all society issues'}
          </p>
        </div>
        <button
          onClick={fetchIssues}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all hover:opacity-80"
          style={{ background: 'rgba(99,107,47,0.06)', color: '#636B2F', fontSize: '0.8125rem' }}
        >
          <RefreshCw className="size-4" />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)' }}>
          <AlertCircle className="size-5 text-red-600 shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
          <button onClick={fetchIssues} className="ml-auto text-sm text-red-600 underline">Retry</button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 transition-all hover:shadow-md hover:-translate-y-0.5" style={{ border: '1px solid rgba(99,107,47,0.08)', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3" style={{ background: stat.bg }}>
              <span style={{ color: stat.color, fontSize: '1.125rem', fontWeight: 600 }}>{stat.value}</span>
            </div>
            <p style={{ color: '#6b7155', fontSize: '0.8125rem' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-5" style={{ border: '1px solid rgba(99,107,47,0.08)', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4" style={{ color: '#BAC095' }} />
            <input
              type="text"
              placeholder="Search by title, description, or flat number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{ border: '1.5px solid rgba(186,192,149,0.4)', background: '#f8f9f4', color: '#1a1e0f' }}
            />
            {/* Debounce-pending spinner: visible while typing, hidden once API fires */}
            {searchQuery !== debouncedSearch && searchQuery.length > 0 && (
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 rounded-full animate-spin"
                style={{ borderColor: 'rgba(99,107,47,0.2)', borderTopColor: '#636B2F' }}
              />
            )}
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {statusFilters.map((s) => (
              <button key={s.key} onClick={() => setFilterStatus(s.key)} className="px-3 py-2 rounded-lg text-xs transition-all"
                style={filterStatus === s.key ? { background: '#636B2F', color: '#fff' } : { background: 'rgba(186,192,149,0.15)', color: '#3D4127' }}>
                {s.label}
              </button>
            ))}
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {priorityFilters.map((p) => (
              <button key={p.key} onClick={() => setFilterPriority(p.key)} className="px-3 py-2 rounded-lg text-xs transition-all"
                style={filterPriority === p.key ? { background: '#3D4127', color: '#D4DE95' } : { background: 'rgba(186,192,149,0.15)', color: '#3D4127' }}>
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(99,107,47,0.2)', borderTopColor: '#636B2F' }} />
        </div>
      )}

      {/* Issues List */}
      {!isLoading && (
        <div className="space-y-3">
          {issues.map((issue) => {
            const pCfg = priorityConfig[issue.priority] || priorityConfig.medium;
            const reportedBy = issue.residentId?.name || 'Unknown';
            return (
              <div
                key={issue._id}
                className="bg-white rounded-2xl p-6 cursor-pointer group transition-all hover:-translate-y-0.5"
                style={{ border: '1px solid rgba(99,107,47,0.08)', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}
                onClick={() => setSelectedIssue(issue)}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(99,107,47,0.12)'; e.currentTarget.style.borderColor = 'rgba(99,107,47,0.25)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(61,65,39,0.04)'; e.currentTarget.style.borderColor = 'rgba(99,107,47,0.12)'; }}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="mb-3">
                      <h3 className="text-sm mb-2" style={{ color: '#1a1e0f' }}>{issue.title}</h3>
                      <p className="text-xs mb-3 line-clamp-2" style={{ color: '#6b7155' }}>{issue.description}</p>
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge
                          status={issue.status === 'Resolved' ? 'success' : issue.status === 'In Progress' ? 'info' : 'warning'}
                          label={issue.status}
                        />
                        <span className="text-xs px-2.5 py-1 rounded-lg" style={{ background: pCfg.bg, color: pCfg.text }}>{pCfg.label}</span>
                        <span className="text-xs px-2.5 py-1 rounded-lg" style={{ background: 'rgba(186,192,149,0.2)', color: '#3D4127' }}>{issue.category}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs" style={{ color: '#9aA278' }}>
                      <span>Flat: <span style={{ color: '#3D4127' }}>{issue.flatNumber}</span></span>
                      <span>·</span>
                      <span>By: <span style={{ color: '#3D4127' }}>{reportedBy}</span></span>
                      <span>·</span>
                      <span>{new Date(issue.createdAt).toLocaleDateString('en-IN')}</span>
                      {issue.assignedTo && (<><span>·</span><span>Assigned: <span style={{ color: '#3D4127' }}>{issue.assignedTo}</span></span></>)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg transition-all"
                      style={{ background: 'rgba(99,107,47,0.08)', color: '#636B2F' }}
                      onClick={(e) => { e.stopPropagation(); setSelectedIssue(issue); }}
                    >
                      <Eye className="size-3.5" /> View
                    </button>
                    {(userRole === 'admin' || issue.residentId?._id === currentUser?._id) && issue.status !== 'Resolved' && (
                      <button
                        className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg transition-all text-red-600"
                        style={{ background: 'rgba(220,38,38,0.06)' }}
                        onClick={(e) => { e.stopPropagation(); handleDelete(issue._id); }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {issues.length === 0 && (
            <div className="bg-white rounded-xl p-16 text-center" style={{ border: '1px solid rgba(186,192,149,0.3)' }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(186,192,149,0.2)' }}>
                <AlertCircle className="size-8" style={{ color: '#BAC095' }} />
              </div>
              {debouncedSearch ? (
                <>
                  <p className="mb-1" style={{ color: '#3D4127' }}>No results for "{debouncedSearch}"</p>
                  <p className="text-sm" style={{ color: '#6b7155' }}>Try a different keyword or clear the search</p>
                </>
              ) : (
                <p style={{ color: '#6b7155' }}>No issues found matching your filters</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Detail Drawer */}
      <DetailDrawer
        isOpen={!!selectedIssue}
        onClose={() => setSelectedIssue(null)}
        title="Issue Details"
        actions={
          userRole === 'admin' && selectedIssue?.status !== 'Resolved' ? (
            <>
              <Button variant="outline" onClick={() => setSelectedIssue(null)}>Close</Button>
              <button
                onClick={() => { setNewStatus(selectedIssue.status || 'In Progress'); setAssignedTo(selectedIssue.assignedTo || ''); setShowUpdateModal(true); }}
                className="px-4 py-2 rounded-lg text-white text-sm transition-all"
                style={{ background: 'linear-gradient(135deg, #636B2F, #7a8338)' }}
              >
                Update Status
              </button>
            </>
          ) : (
            <Button variant="outline" onClick={() => setSelectedIssue(null)}>Close</Button>
          )
        }
      >
        {selectedIssue && (
          <div className="space-y-6">
            <div><p className="text-xs mb-1.5" style={{ color: '#9aA278' }}>Title</p><p style={{ color: '#1a1e0f' }}>{selectedIssue.title}</p></div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs mb-1.5" style={{ color: '#9aA278' }}>Status</p>
                <StatusBadge
                  status={selectedIssue.status === 'Resolved' ? 'success' : selectedIssue.status === 'In Progress' ? 'info' : 'warning'}
                  label={selectedIssue.status}
                />
              </div>
              <div>
                <p className="text-xs mb-1.5" style={{ color: '#9aA278' }}>Priority</p>
                <span className="text-xs px-2.5 py-1 rounded-lg" style={{ background: (priorityConfig[selectedIssue.priority] || priorityConfig.medium).bg, color: (priorityConfig[selectedIssue.priority] || priorityConfig.medium).text }}>
                  {(priorityConfig[selectedIssue.priority] || priorityConfig.medium).label}
                </span>
              </div>
            </div>
            <div>
              <p className="text-xs mb-1.5" style={{ color: '#9aA278' }}>Description</p>
              <p className="text-sm leading-relaxed p-4 rounded-xl" style={{ background: '#f8f9f4', color: '#3D4127', border: '1px solid rgba(186,192,149,0.3)' }}>{selectedIssue.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs mb-1.5" style={{ color: '#9aA278' }}>Category</p><p style={{ color: '#1a1e0f', textTransform: 'capitalize' }}>{selectedIssue.category}</p></div>
              <div><p className="text-xs mb-1.5" style={{ color: '#9aA278' }}>Flat Number</p><p style={{ color: '#1a1e0f' }}>{selectedIssue.flatNumber}</p></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs mb-1.5" style={{ color: '#9aA278' }}>Reported By</p><p style={{ color: '#1a1e0f' }}>{selectedIssue.residentId?.name || '—'}</p></div>
              <div><p className="text-xs mb-1.5" style={{ color: '#9aA278' }}>Reported Date</p><p style={{ color: '#1a1e0f' }}>{new Date(selectedIssue.createdAt).toLocaleDateString('en-IN')}</p></div>
            </div>
            {selectedIssue.assignedTo && (
              <div><p className="text-xs mb-1.5" style={{ color: '#9aA278' }}>Assigned To</p><p style={{ color: '#1a1e0f' }}>{selectedIssue.assignedTo}</p></div>
            )}
            {selectedIssue.resolvedDate && (
              <div className="p-4 rounded-xl" style={{ background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.2)' }}>
                <p className="text-sm mb-1" style={{ color: '#16a34a' }}>✓ Resolved</p>
                <p className="text-xs" style={{ color: '#15803d' }}>Resolved on {new Date(selectedIssue.resolvedDate).toLocaleDateString('en-IN')}</p>
              </div>
            )}
            {userRole === 'admin' && selectedIssue.status !== 'Resolved' && (
              <div>
                <p className="text-xs mb-2" style={{ color: '#9aA278' }}>Assign To</p>
                <input
                  placeholder="e.g. Ravi (Plumber)"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none mb-3"
                  style={{ border: '1.5px solid rgba(186,192,149,0.4)', background: '#f8f9f4', color: '#1a1e0f' }}
                />
                <p className="text-xs mb-2" style={{ color: '#9aA278' }}>Update Status</p>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ border: '1.5px solid rgba(186,192,149,0.4)', background: '#f8f9f4', color: '#1a1e0f' }}
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
            )}
          </div>
        )}
      </DetailDrawer>

      {selectedIssue && (
        <ConfirmModal
          isOpen={showUpdateModal}
          onClose={() => setShowUpdateModal(false)}
          onConfirm={handleStatusUpdate}
          title="Update Issue Status"
          message={`Change status to: "${newStatus}"${assignedTo ? ` and assign to ${assignedTo}` : ''}`}
          confirmText="Update"
          variant="info"
        />
      )}
    </div>
  );
}
