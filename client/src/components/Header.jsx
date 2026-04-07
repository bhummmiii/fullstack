import { useState, useEffect } from 'react';
import { SearchBar } from './shared/SearchBar';
import { NotificationDropdown } from './shared/NotificationDropdown';
import { UserMenu } from './shared/UserMenu';

export function Header({ currentUser, onLogout, onProfileClick, onNavigate }) {
  // ── Live clock: updates every minute so date/time is always accurate ──
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    // Align tick to the start of the next minute for precision
    const msToNextMinute = (60 - new Date().getSeconds()) * 1000;
    const timeoutId = setTimeout(() => {
      setNow(new Date());
      // After first alignment, tick every 60 seconds
      const intervalId = setInterval(() => setNow(new Date()), 60_000);
      // Store intervalId so we can clear it on unmount
      return () => clearInterval(intervalId);
    }, msToNextMinute);

    return () => clearTimeout(timeoutId);
  }, []);

  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <header
      className="bg-white px-4 lg:px-8 py-4 sticky top-0 z-30"
      style={{ borderBottom: '1px solid rgba(99, 107, 47, 0.12)', boxShadow: '0 1px 12px rgba(61, 65, 39, 0.06)' }}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left: Welcome Message */}
        <div className="hidden lg:block">
          <h2 style={{ color: '#3D4127' }}>
            {greeting}, {currentUser.name.split(' ')[0]}! 👋
          </h2>
          <p className="text-sm" style={{ color: '#6b7155' }}>
            Flat {currentUser.flatNumber} &nbsp;·&nbsp;
            {now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Mobile: Just greeting */}
        <div className="lg:hidden ml-12">
          <h2 className="text-sm" style={{ color: '#3D4127' }}>Hi, {currentUser.name.split(' ')[0]}! 👋</h2>
        </div>

        {/* Right: Search + Notifications + Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Global Search - Hidden on mobile */}
          <div className="hidden md:block">
            <SearchBar placeholder="Search complaints, notices..." />
          </div>

          {/* Notifications */}
          <NotificationDropdown />

          {/* User Menu */}
          <UserMenu
            currentUser={currentUser}
            onLogout={onLogout}
            onProfileClick={onProfileClick}
            onNavigate={onNavigate}
          />
        </div>
      </div>
    </header>
  );
}
