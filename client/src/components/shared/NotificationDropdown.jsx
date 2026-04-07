import { Bell, MessageSquare, CreditCard, Megaphone, AlertCircle, UserCheck } from 'lucide-react';
import { useState, useEffect } from 'react';

// ─── Notification pool keyed by current date ────────────────────────────────
// Each "pool" is selected based on the day-of-month so notifications rotate daily.
const NOTIFICATION_POOLS = [
  // Pool 0
  [
    { id: 1, type: 'complaint', title: 'New Complaint Filed', message: 'Flat 204: Water leakage reported in bathroom', time: '8m ago', read: false },
    { id: 2, type: 'payment', title: 'Maintenance Due Soon', message: 'April 2026 maintenance due in 5 days', time: '1h ago', read: false },
    { id: 3, type: 'announcement', title: 'Society Meeting', message: 'AGM scheduled for 20 Apr 2026 at 6 PM in the clubhouse', time: '3h ago', read: true },
    { id: 4, type: 'visitor', title: 'Visitor Pre-Approved', message: 'Flat 101 approved a visitor: Ramesh Nair for today', time: '5h ago', read: true },
  ],
  // Pool 1
  [
    { id: 1, type: 'complaint', title: 'Complaint Resolved', message: 'Lift malfunction in Block B has been fixed', time: '12m ago', read: false },
    { id: 2, type: 'announcement', title: 'Water Shutdown Notice', message: 'Water supply off on 15 Apr from 10 AM to 2 PM', time: '2h ago', read: false },
    { id: 3, type: 'payment', title: 'Payment Received', message: 'Flat 305: March 2026 maintenance payment confirmed', time: '4h ago', read: true },
  ],
  // Pool 2
  [
    { id: 1, type: 'payment', title: 'Overdue Payment Alert', message: 'Flat 202: Maintenance overdue by 8 days · ₹3,500 pending', time: '30m ago', read: false },
    { id: 2, type: 'complaint', title: 'Complaint Status Update', message: 'Parking light complaint marked as In Progress', time: '2h ago', read: false },
    { id: 3, type: 'announcement', title: 'New Document Uploaded', message: 'Revised society bylaws uploaded to Documents section', time: '1d ago', read: true },
    { id: 4, type: 'visitor', title: 'Visitor Checked In', message: 'Guest of Flat 204 (Priya Sharma) has checked in', time: '6h ago', read: true },
  ],
  // Pool 3
  [
    { id: 1, type: 'complaint', title: 'Urgent Complaint Raised', message: 'Electrical short-circuit reported in Block A – Floor 3', time: '5m ago', read: false },
    { id: 2, type: 'announcement', title: 'Amenity Booking Confirmed', message: 'Clubhouse booked for Flat 102 on 18 Apr 2026', time: '1h ago', read: false },
    { id: 3, type: 'payment', title: 'Monthly Bills Generated', message: 'April 2026 maintenance bills sent to all residents', time: '3h ago', read: true },
  ],
  // Pool 4
  [
    { id: 1, type: 'visitor', title: 'New Visitor Request', message: 'Flat 305 has a pending visitor approval request', time: '20m ago', read: false },
    { id: 2, type: 'complaint', title: 'Multiple Complaints Pending', message: '3 complaints awaiting admin action this week', time: '2h ago', read: false },
    { id: 3, type: 'announcement', title: 'Reminder: Rules Update', message: 'Society noise policy updated – quiet hours 10 PM–6 AM', time: '2d ago', read: true },
    { id: 4, type: 'payment', title: 'Late Fee Applied', message: 'Flat 108: ₹100 late fee added to pending dues', time: '1d ago', read: true },
  ],
];

// Deterministically pick a pool based on today's date so it changes daily
function getPoolForToday() {
  const dayOfMonth = new Date().getDate();
  return NOTIFICATION_POOLS[dayOfMonth % NOTIFICATION_POOLS.length];
}

const iconConfig = {
  complaint:    { Icon: MessageSquare, bg: 'rgba(99,107,47,0.1)',   color: '#636B2F' },
  payment:      { Icon: CreditCard,    bg: 'rgba(22,163,74,0.1)',   color: '#16a34a' },
  announcement: { Icon: Megaphone,     bg: 'rgba(168,85,247,0.1)', color: '#9333ea' },
  visitor:      { Icon: UserCheck,     bg: 'rgba(37,99,235,0.1)',  color: '#2563eb' },
  system:       { Icon: AlertCircle,   bg: 'rgba(107,114,128,0.1)', color: '#6b7280' },
};

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(() => getPoolForToday());

  // Re-pick pool every time the component mounts (handles day change on long sessions)
  useEffect(() => {
    setNotifications(getPoolForToday());
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) =>
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const markAllAsRead = () =>
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl transition-all"
        style={{ color: '#6b7155' }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(186,192,149,0.15)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
      >
        <Bell className="size-5" />
        {unreadCount > 0 && (
          <span
            className="absolute top-1.5 right-1.5 w-4 h-4 text-white text-xs rounded-full flex items-center justify-center"
            style={{ background: '#dc2626', fontSize: '10px' }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl z-50 shadow-2xl"
            style={{ border: '1px solid rgba(99,107,47,0.15)', boxShadow: '0 20px 40px rgba(61,65,39,0.15)' }}
          >
            <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(186,192,149,0.25)' }}>
              <div>
                <h3 style={{ color: '#3D4127' }}>Notifications</h3>
                <p className="text-xs mt-0.5" style={{ color: '#9aA278' }}>{unreadCount} unread</p>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs transition-colors hover:opacity-70"
                  style={{ color: '#636B2F' }}
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-10 text-center">
                  <Bell className="size-10 mx-auto mb-3" style={{ color: '#BAC095' }} />
                  <p className="text-sm" style={{ color: '#9aA278' }}>No notifications</p>
                </div>
              ) : (
                <div>
                  {notifications.map((n) => {
                    const cfg = iconConfig[n.type] || iconConfig.system;
                    return (
                      <div
                        key={n.id}
                        className="p-4 cursor-pointer transition-colors"
                        style={{
                          background: !n.read ? 'rgba(212,222,149,0.08)' : 'transparent',
                          borderBottom: '1px solid rgba(186,192,149,0.12)',
                        }}
                        onClick={() => markAsRead(n.id)}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(212,222,149,0.12)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = !n.read ? 'rgba(212,222,149,0.08)' : 'transparent')}
                      >
                        <div className="flex gap-3">
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                            style={{ background: cfg.bg }}
                          >
                            <cfg.Icon className="size-4" style={{ color: cfg.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm" style={{ color: '#1a1e0f' }}>{n.title}</p>
                              {!n.read && (
                                <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ background: '#636B2F' }} />
                              )}
                            </div>
                            <p className="text-xs mt-1" style={{ color: '#6b7155' }}>{n.message}</p>
                            <p className="text-xs mt-1.5" style={{ color: '#9aA278' }}>{n.time}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-3" style={{ borderTop: '1px solid rgba(186,192,149,0.25)' }}>
              <button
                className="w-full text-center text-sm py-2 rounded-xl transition-all hover:opacity-80"
                style={{ color: '#636B2F', background: 'rgba(99,107,47,0.06)' }}
                onClick={() => setIsOpen(false)}
              >
                View All Notifications
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
