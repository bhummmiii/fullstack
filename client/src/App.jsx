import React, { useState, useEffect, useCallback } from 'react';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { IssueManagement } from './components/IssueManagement';
import { RaiseComplaint } from './components/RaiseComplaint';
import { Announcements } from './components/Announcements';
import { ResidentDirectory } from './components/ResidentDirectory';
import { MaintenancePayments } from './components/MaintenancePayments';
import { VisitorManagement } from './components/VisitorManagement';
import { AmenityBooking } from './components/AmenityBooking';
import { EmergencyContacts } from './components/EmergencyContacts';
import { Documents } from './components/Documents';
import { UserProfile } from './components/UserProfile';
import { Analytics } from './components/Analytics';
import { Settings } from './components/Settings';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Toaster } from './components/ui/sonner';
import { authApi, getStoredUser, getToken, removeToken, removeStoredUser } from './services/api';

// ─── Global error boundary ────────────────────────────────────────────────────
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('App error caught by boundary:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9f4', padding: '2rem' }}>
          <div style={{ background: '#fff', borderRadius: '1rem', padding: '2.5rem', maxWidth: '500px', width: '100%', border: '1px solid rgba(220,38,38,0.2)', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '1rem', background: 'rgba(220,38,38,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', fontSize: '1.75rem' }}>⚠️</div>
            <h2 style={{ color: '#1a1e0f', marginBottom: '0.5rem' }}>Something went wrong</h2>
            <p style={{ color: '#6b7155', fontSize: '0.875rem', marginBottom: '1.5rem' }}>{this.state.error?.message || 'An unexpected error occurred.'}</p>
            <button onClick={() => this.setState({ hasError: false, error: null })} style={{ background: 'linear-gradient(135deg, #636B2F, #7a8338)', color: '#fff', border: 'none', borderRadius: '0.75rem', padding: '0.625rem 1.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
              Try Again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Main App ─────────────────────────────────────────────────────────────────
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeView, setActiveView]           = useState('dashboard');
  const [currentUser, setCurrentUser]         = useState(null);
  const [isInitialising, setIsInitialising]   = useState(true);

  // On mount: restore session from localStorage
  useEffect(() => {
    const token = getToken();
    const user  = getStoredUser();
    if (token && user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      // Silently validate token with the server
      authApi.getProfile()
        .then(res => { setCurrentUser(res.data); })
        .catch(() => {
          // Token invalid — clear session
          removeToken();
          removeStoredUser();
          setIsAuthenticated(false);
          setCurrentUser(null);
        })
        .finally(() => setIsInitialising(false));
    } else {
      setIsInitialising(false);
    }
  }, []);

  const handleLogin = useCallback(async (email, password) => {
    const data = await authApi.login(email, password); // throws ApiError on failure
    setCurrentUser(data.user);
    setIsAuthenticated(true);
    setActiveView('dashboard');
  }, []);

  const handleLogout = useCallback(() => {
    authApi.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setActiveView('dashboard');
  }, []);

  const handleProfileUpdate = useCallback((updatedUser) => {
    setCurrentUser(prev => ({ ...prev, ...updatedUser }));
  }, []);

  // Show a minimal loading screen while restoring session
  if (isInitialising) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #3D4127 0%, #636B2F 100%)' }}>
        <div style={{ textAlign: 'center', color: '#D4DE95' }}>
          <div style={{ width: '48px', height: '48px', border: '3px solid rgba(212,222,149,0.3)', borderTopColor: '#D4DE95', borderRadius: '50%', margin: '0 auto 1rem', animation: 'spin 1s linear infinite' }} />
          <p style={{ fontSize: '0.875rem', opacity: 0.8 }}>Loading…</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex" style={{ background: '#f8f9f4' }}>
        <Toaster position="top-right" />
        <Sidebar
          activeView={activeView}
          setActiveView={setActiveView}
          userRole={currentUser?.role}
          onLogout={handleLogout}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <Header
            currentUser={currentUser}
            onLogout={handleLogout}
            onProfileClick={() => setActiveView('profile')}
          />

          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
            {activeView === 'dashboard'       && <Dashboard userRole={currentUser?.role} onNavigate={setActiveView} currentUser={currentUser} />}
            {activeView === 'issues'          && <IssueManagement userRole={currentUser?.role} currentUser={currentUser} />}
            {activeView === 'raise-complaint' && <RaiseComplaint currentUser={currentUser} />}
            {activeView === 'announcements'   && <Announcements userRole={currentUser?.role} currentUser={currentUser} />}
            {activeView === 'residents'       && <ResidentDirectory userRole={currentUser?.role} currentUser={currentUser} />}
            {activeView === 'maintenance'     && <MaintenancePayments userRole={currentUser?.role} currentUser={currentUser} />}
            {activeView === 'visitors'        && <VisitorManagement userRole={currentUser?.role} currentUser={currentUser} />}
            {activeView === 'amenities'       && <AmenityBooking userRole={currentUser?.role} currentFlatNumber={currentUser?.flatNumber} />}
            {activeView === 'emergency'       && <EmergencyContacts />}
            {activeView === 'documents'       && <Documents userRole={currentUser?.role} />}
            {activeView === 'profile'         && <UserProfile currentUser={currentUser} onProfileUpdate={handleProfileUpdate} />}
            {activeView === 'analytics'       && <Analytics />}
            {activeView === 'settings'        && <Settings currentUser={currentUser} />}
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
