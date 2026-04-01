import {
  Home, AlertCircle, Megaphone, Users, CreditCard, Building2,
  UserCheck, Calendar, Phone, FileText, User as UserIcon,
  Menu, X, ChevronRight, BarChart2, Settings as SettingsIcon, LogOut,
  MessageSquare,
} from 'lucide-react';

import { useState } from 'react';

const residentMenuGroups = [
  {
    key: 'overview',
    label: 'Overview',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
    ],
  },
  {
    key: 'issues',
    label: 'Issues',
    items: [
      { id: 'issues', label: 'My Complaints', icon: AlertCircle },
      { id: 'raise-complaint', label: 'Raise Complaint', icon: MessageSquare },
    ],
  },
  {
    key: 'community',
    label: 'Community',
    items: [
      { id: 'announcements', label: 'Notices', icon: Megaphone },
      { id: 'residents', label: 'Resident Directory', icon: Users },
    ],
  },
  {
    key: 'services',
    label: 'Services',
    items: [
      { id: 'visitors', label: 'Visitor Log', icon: UserCheck },
      { id: 'amenities', label: 'Amenity Booking', icon: Calendar },
    ],
  },
  {
    key: 'finance',
    label: 'Finance',
    items: [
      { id: 'maintenance', label: 'Maintenance / Payments', icon: CreditCard },
    ],
  },
  {
    key: 'more',
    label: 'More',
    items: [
      { id: 'documents', label: 'Documents', icon: FileText },
      { id: 'emergency', label: 'Emergency Contacts', icon: Phone },
      { id: 'profile', label: 'Profile & Settings', icon: UserIcon },
    ],
  },
];

const adminMenuGroups = [
  {
    key: 'overview',
    label: 'Overview',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
    ],
  },
  {
    key: 'management',
    label: 'Management',
    items: [
      { id: 'issues', label: 'Manage Complaints', icon: AlertCircle },
      { id: 'announcements', label: 'Notices Management', icon: Megaphone },
      { id: 'residents', label: 'Residents', icon: Users },
      { id: 'maintenance', label: 'Maintenance', icon: CreditCard },
      { id: 'visitors', label: 'Visitor Management', icon: UserCheck },
      { id: 'amenities', label: 'Amenity Bookings', icon: Calendar },
    ],
  },
  {
    key: 'insights',
    label: 'Insights',
    items: [
      { id: 'analytics', label: 'Reports & Analytics', icon: BarChart2 },
    ],
  },
  {
    key: 'more',
    label: 'More',
    items: [
      { id: 'documents', label: 'Documents', icon: FileText },
      { id: 'emergency', label: 'Emergency Contacts', icon: Phone },
      { id: 'settings', label: 'Settings', icon: SettingsIcon },
    ],
  },
];

export function Sidebar({ activeView, setActiveView, userRole, onLogout }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuGroups = userRole === 'admin' ? adminMenuGroups : residentMenuGroups;

  const handleNavigation = (view) => {
    setActiveView(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl shadow-lg border transition-colors"
        style={{ background: '#3D4127', borderColor: 'rgba(255,255,255,0.1)', color: '#D4DE95' }}
      >
        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-72 flex flex-col overflow-hidden
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{ background: '#3D4127', boxShadow: '4px 0 24px rgba(0,0,0,0.15)' }}
      >
        {/* Logo/Brand Section */}
        <div className="p-6 border-b flex-shrink-0" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: 'linear-gradient(135deg, #636B2F, #8a9445)' }}
            >
              <Building2 className="w-6 h-6" style={{ color: '#D4DE95' }} />
            </div>
            <div>
              <h1 className="text-sm" style={{ color: '#D4DE95', fontWeight: 600 }}>Society Hub</h1>
              <p className="text-xs" style={{ color: 'rgba(212, 222, 149, 0.6)' }}>Om Sai Apartment</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-5 overflow-y-auto">
          {menuGroups.map((group) => (
            <div key={group.key}>
              <p
                className="text-xs uppercase tracking-widest mb-2 px-3"
                style={{ color: 'rgba(186, 192, 149, 0.5)', letterSpacing: '0.1em' }}
              >
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigation(item.id)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative"
                      style={
                        isActive
                          ? {
                            background: 'linear-gradient(135deg, #636B2F, #7a8338)',
                            color: '#D4DE95',
                            boxShadow: '0 4px 12px rgba(99, 107, 47, 0.4)',
                          }
                          : { color: 'rgba(240, 242, 228, 0.7)' }
                      }
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'rgba(186, 192, 149, 0.1)';
                          e.currentTarget.style.color = '#f0f2e4';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = 'rgba(240, 242, 228, 0.7)';
                        }
                      }}
                    >
                      {isActive && (
                        <span
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
                          style={{ background: '#D4DE95' }}
                        />
                      )}
                      <Icon className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${!isActive ? 'group-hover:scale-110' : ''}`} />
                      <span className="text-sm flex-1 text-left">{item.label}</span>
                      {isActive && <ChevronRight className="w-3 h-3 opacity-60" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer: Role Badge + Logout */}
        <div className="p-4 border-t flex-shrink-0 space-y-2" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          {/* Role Badge */}
          <div
            className="px-4 py-3 rounded-xl"
            style={{ background: 'rgba(212, 222, 149, 0.12)', border: '1px solid rgba(212, 222, 149, 0.2)' }}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#D4DE95' }} />
              <span className="text-xs capitalize" style={{ color: '#D4DE95' }}>
                {userRole === 'admin' ? '⚙️ Admin Access' : '🏠 Resident Access'}
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => { onLogout(); setIsMobileMenuOpen(false); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group"
            style={{ color: 'rgba(240, 242, 228, 0.6)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(220, 38, 38, 0.15)';
              e.currentTarget.style.color = '#fca5a5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'rgba(240, 242, 228, 0.6)';
            }}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}