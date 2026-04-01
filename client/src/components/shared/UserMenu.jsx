import { User as UserIcon, Settings, HelpCircle, LogOut, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export function UserMenu({ currentUser, onLogout, onProfileClick }) {
  const [isOpen, setIsOpen] = useState(false);

  const getInitials = (name) =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const menuItems = [
    { Icon: UserIcon, label: 'My Profile', action: () => { onProfileClick?.(); setIsOpen(false); } },
    { Icon: Settings, label: 'Settings', action: () => setIsOpen(false) },
    { Icon: HelpCircle, label: 'Help & Support', action: () => setIsOpen(false) },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl transition-all"
        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(186,192,149,0.15)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #636B2F, #7a8338)', color: '#D4DE95' }}
        >
          <span className="text-xs">{getInitials(currentUser.name)}</span>
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm" style={{ color: '#3D4127' }}>{currentUser.name.split(' ')[0]}</p>
          <p className="text-xs capitalize" style={{ color: '#9aA278' }}>{currentUser.role}</p>
        </div>
        <ChevronDown className={`size-4 hidden sm:block transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} style={{ color: '#BAC095' }} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div
            className="absolute right-0 mt-2 w-64 bg-white rounded-2xl z-50"
            style={{ border: '1px solid rgba(99,107,47,0.15)', boxShadow: '0 20px 40px rgba(61,65,39,0.15)' }}
          >
            {/* User Info */}
            <div className="p-4" style={{ borderBottom: '1px solid rgba(186,192,149,0.25)' }}>
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #636B2F, #7a8338)', color: '#D4DE95' }}
                >
                  {getInitials(currentUser.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate" style={{ color: '#1a1e0f' }}>{currentUser.name}</p>
                  <p className="text-xs" style={{ color: '#9aA278' }}>Flat {currentUser.flatNumber}</p>
                </div>
              </div>
              <div
                className="px-3 py-1.5 rounded-lg text-xs capitalize"
                style={{ background: 'rgba(212,222,149,0.2)', color: '#636B2F', border: '1px solid rgba(212,222,149,0.4)' }}
              >
                {currentUser.role === 'admin' ? '⚙️' : '🏠'} {currentUser.role} Access
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left text-sm"
                  style={{ color: '#3D4127' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(186,192,149,0.15)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <item.Icon className="size-4" style={{ color: '#636B2F' }} />
                  {item.label}
                </button>
              ))}
            </div>

            {/* Logout */}
            <div className="p-2" style={{ borderTop: '1px solid rgba(186,192,149,0.2)' }}>
              <button
                onClick={() => { onLogout?.(); setIsOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left text-sm text-red-600"
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(220,38,38,0.06)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <LogOut className="size-4" />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
