import { useState, useEffect, useCallback } from 'react';
import { Plus, Megaphone, Calendar, AlertTriangle, X, Pin, PartyPopper, CreditCard, ChevronDown, ChevronUp, RefreshCw, AlertCircle } from 'lucide-react';
import { noticesApi } from '../services/api';
import { toast } from 'sonner';

export function Announcements({ userRole, currentUser }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expandedId, setExpandedId]           = useState(null);
  const [announcements, setAnnouncements]     = useState([]);
  const [isLoading, setIsLoading]             = useState(true);
  const [error, setError]                     = useState('');

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '', description: '',
    type: 'general',
    priority: 'normal',
  });
  const [isCreating, setIsCreating] = useState(false);

  const fetchNotices = useCallback(async () => {
    setIsLoading(true); setError('');
    try {
      const res = await noticesApi.getAll();
      setAnnouncements(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load announcements');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchNotices(); }, [fetchNotices]);

  const handleCreate = async () => {
    if (!newAnnouncement.title.trim() || !newAnnouncement.description.trim()) {
      toast.error('Please fill in title and content');
      return;
    }
    setIsCreating(true);
    try {
      const res = await noticesApi.create(newAnnouncement);
      setAnnouncements(prev => [res.data, ...prev]);
      setShowCreateModal(false);
      setNewAnnouncement({ title: '', description: '', type: 'general', priority: 'normal' });
      toast.success('Announcement posted successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to post announcement');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      await noticesApi.delete(id);
      setAnnouncements(prev => prev.filter(a => a._id !== id));
      toast.success('Announcement deleted');
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  const typeConfig = {
    meeting: {
      icon: Calendar, label: 'Meeting',
      bg: 'rgba(168,85,247,0.1)', color: '#9333ea', iconBg: 'rgba(168,85,247,0.15)',
    },
    payment: {
      icon: CreditCard, label: 'Payment',
      bg: 'rgba(22,163,74,0.08)', color: '#16a34a', iconBg: 'rgba(22,163,74,0.12)',
    },
    alert: {
      icon: AlertTriangle, label: 'Alert',
      bg: 'rgba(220,38,38,0.08)', color: '#dc2626', iconBg: 'rgba(220,38,38,0.12)',
    },
    event: {
      icon: PartyPopper, label: 'Event',
      bg: 'rgba(59,130,246,0.08)', color: '#2563eb', iconBg: 'rgba(59,130,246,0.12)',
    },
    general: {
      icon: Megaphone, label: 'General',
      bg: 'rgba(99,107,47,0.08)', color: '#636B2F', iconBg: 'rgba(99,107,47,0.12)',
    },
  };

  const sorted = [...announcements].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt || b.postedDate).getTime() - new Date(a.createdAt || a.postedDate).getTime();
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
          <h1 style={{ color: '#3D4127' }} className="mb-1">Announcements</h1>
          <p className="text-sm" style={{ color: '#6b7155' }}>Stay updated with society news and notifications</p>
        </div>
        {userRole === 'admin' && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm transition-all hover:shadow-lg hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #636B2F, #7a8338)', boxShadow: '0 2px 12px rgba(99,107,47,0.3)' }}
          >
            <Plus className="w-4 h-4" />
            New Announcement
          </button>
        )}
        <button onClick={fetchNotices} className="p-2 rounded-xl transition-all" style={{ background: 'rgba(99,107,47,0.08)', color: '#636B2F' }}>
          <RefreshCw className="size-4" />
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)' }}>
          <AlertCircle className="size-5 text-red-600 shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
          <button onClick={fetchNotices} className="ml-auto text-sm text-red-600 underline">Retry</button>
        </div>
      )}

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: announcements.length, color: '#636B2F', bg: 'rgba(99,107,47,0.1)' },
          { label: 'Pinned', value: announcements.filter(a => a.isPinned).length, color: '#9333ea', bg: 'rgba(168,85,247,0.08)' },
          { label: 'Important', value: announcements.filter(a => a.priority === 'important').length, color: '#ea580c', bg: 'rgba(234,88,12,0.08)' },
          { label: 'This Week', value: announcements.filter(a => { const d = new Date(a.createdAt || a.postedDate); const now = new Date(); return (now - d) < 7 * 24 * 3600 * 1000; }).length, color: '#16a34a', bg: 'rgba(22,163,74,0.08)' },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white rounded-xl px-4 py-3 flex items-center gap-3"
            style={{ border: '1px solid rgba(99,107,47,0.1)' }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium"
              style={{ background: stat.bg, color: stat.color }}
            >
              {stat.value}
            </div>
            <span className="text-xs" style={{ color: '#6b7155' }}>{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-10">
          <div className="w-7 h-7 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(99,107,47,0.2)', borderTopColor: '#636B2F' }} />
        </div>
      )}

      {/* Announcements List */}
      {!isLoading && (
        <div className="space-y-3">
        {sorted.map((ann) => {
          const cfg = typeConfig[ann.type] || typeConfig.general;
          const Icon = cfg.icon;
          const isExpanded = expandedId === (ann._id || ann.id);
          const annId = ann._id || ann.id;

          return (
            <div
              key={annId}
              className="bg-white rounded-xl overflow-hidden transition-all"
              style={{
                border: ann.isPinned ? '1.5px solid rgba(99,107,47,0.3)' : '1px solid rgba(99,107,47,0.1)',
                boxShadow: ann.isPinned ? '0 2px 12px rgba(99,107,47,0.1)' : '0 1px 4px rgba(61,65,39,0.04)',
              }}
            >
              {/* Pinned indicator bar */}
              {ann.isPinned && (
                <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #636B2F, #BAC095)' }} />
              )}

              <div className="p-5 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : annId)}>
                <div className="flex items-start gap-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: cfg.iconBg }}
                  >
                    <Icon className="w-5 h-5" style={{ color: cfg.color }} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {ann.isPinned && (
                          <Pin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#636B2F' }} />
                        )}
                        <h3 className="text-sm" style={{ color: '#1a1e0f' }}>{ann.title}</h3>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Badges */}
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: cfg.bg, color: cfg.color }}
                        >
                          {cfg.label}
                        </span>
                        {ann.priority === 'important' && (
                          <span
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{ background: 'rgba(212,222,149,0.4)', color: '#3D4127' }}
                          >
                            Important
                          </span>
                        )}
                      {isExpanded
                          ? <ChevronUp className="w-4 h-4" style={{ color: '#9aA278' }} />
                          : <ChevronDown className="w-4 h-4" style={{ color: '#9aA278' }} />
                        }
                        {userRole === 'admin' && (
                          <button
                            className="p-1 rounded-lg hover:bg-red-50"
                            onClick={(e) => { e.stopPropagation(); handleDelete(annId); }}
                            title="Delete"
                          >
                            <X className="w-4 h-4 text-red-400" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Preview / collapsed */}
                    {!isExpanded && (
                      <p className="text-xs line-clamp-1" style={{ color: '#6b7155' }}>{ann.description || ann.content}</p>
                    )}

                    {/* Expanded content */}
                    {isExpanded && (
                      <div className="mt-2">
                        <p className="text-sm leading-relaxed mb-4" style={{ color: '#3D4127' }}>{ann.description || ann.content}</p>
                        <div className="flex items-center gap-3 text-xs" style={{ color: '#9aA278' }}>
                          <span>Posted by <span style={{ color: '#3D4127' }}>{ann.postedBy?.name || ann.postedBy || 'Admin'}</span></span>
                          <span>·</span>
                          <span>{new Date(ann.createdAt || ann.postedDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {!isLoading && sorted.length === 0 && (
          <div className="bg-white rounded-xl p-16 text-center" style={{ border: '1px solid rgba(186,192,149,0.3)' }}>
            <p style={{ color: '#6b7155' }}>No announcements yet</p>
          </div>
        )}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div
            className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            style={{ border: '1px solid rgba(99,107,47,0.2)' }}
          >
            {/* Modal Header */}
            <div
              className="p-6 flex items-center justify-between sticky top-0 bg-white"
              style={{ borderBottom: '1px solid rgba(186,192,149,0.3)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(99,107,47,0.1)' }}
                >
                  <Megaphone className="w-5 h-5" style={{ color: '#636B2F' }} />
                </div>
                <div>
                  <h2 style={{ color: '#3D4127' }}>Create Announcement</h2>
                  <p className="text-xs" style={{ color: '#9aA278' }}>Broadcast to all residents</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 rounded-xl transition-colors hover:bg-gray-100"
                style={{ color: '#9aA278' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm mb-1.5" style={{ color: '#3D4127' }}>Title *</label>
                <input
                  type="text"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  placeholder="Brief title for the announcement"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block text-sm mb-1.5" style={{ color: '#3D4127' }}>Content *</label>
                <textarea
                  value={newAnnouncement.description}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, description: e.target.value })}
                  placeholder="Detailed announcement message"
                  rows={5}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1.5" style={{ color: '#3D4127' }}>Type *</label>
                  <select
                    value={newAnnouncement.type}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, type: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="general">General</option>
                    <option value="meeting">Meeting</option>
                    <option value="payment">Payment</option>
                    <option value="alert">Alert</option>
                    <option value="event">Event</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1.5" style={{ color: '#3D4127' }}>Priority *</label>
                  <select
                    value={newAnnouncement.priority}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, priority: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="normal">Normal</option>
                    <option value="important">Important</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              className="p-6 flex justify-end gap-3"
              style={{ borderTop: '1px solid rgba(186,192,149,0.3)' }}
            >
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2.5 rounded-xl text-sm transition-all"
                style={{ border: '1.5px solid rgba(186,192,149,0.5)', color: '#3D4127', background: '#f8f9f4' }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!newAnnouncement.title || !newAnnouncement.description || isCreating}
                className="px-5 py-2.5 rounded-xl text-white text-sm transition-all disabled:opacity-50 hover:shadow-lg"
                style={{ background: 'linear-gradient(135deg, #636B2F, #7a8338)' }}
              >
                {isCreating ? 'Posting…' : 'Post Announcement'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
