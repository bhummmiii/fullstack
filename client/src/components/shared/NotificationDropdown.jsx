import { Bell, MessageSquare, CreditCard, Megaphone, AlertCircle } from 'lucide-react';
import { useState } from 'react';



export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'complaint', title: 'Complaint Updated', message: 'Your water leakage complaint has been marked', time: '5m ago', read: false },
    { id: 2, type: 'payment', title: 'Payment Reminder', message: 'Maintenance payment due in 3 days', time: '2h ago', read: false },
    { id: 3, type: 'announcement', title: 'New Announcement', message: 'Society meeting scheduled for this Sunday', time: '1d ago', read: true },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) =>
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));

  const markAllAsRead = () =>
    setNotifications(notifications.map(n => ({ ...n, read: true })));

  const iconConfig = {
    complaint: { Icon: MessageSquare, bg: 'rgba(99,107,47,0.1)', color: '#636B2F' },
    payment: { Icon: CreditCard, bg: 'rgba(22,163,74,0.1)', color: '#16a34a' },
    announcement: { Icon: Megaphone, bg: 'rgba(168,85,247,0.1)', color: '#9333ea' },
    system: { Icon: AlertCircle, bg: 'rgba(107,114,128,0.1)', color: '#6b7280' },
  };

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
                    const cfg = iconConfig[n.type];
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
