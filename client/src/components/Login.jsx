import { useState } from 'react';
import {
  Building2, Mail, Lock, AlertCircle, Eye, EyeOff,
  Leaf, ArrowLeft, CheckCircle, Home,
} from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { authApi } from '../services/api';

// ─── Forgot Password Modal ─────────────────────────────────────────────────────
function ForgotPasswordModal({ onClose }) {
  // step: 'verify' | 'reset' | 'done'
  const [step, setStep] = useState('verify');

  // step 1
  const [fpEmail, setFpEmail]       = useState('');
  const [fpFlat, setFpFlat]         = useState('');
  const [fpLoading, setFpLoading]   = useState(false);
  const [fpError, setFpError]       = useState('');
  const [resetToken, setResetToken] = useState('');
  const [userName, setUserName]     = useState('');

  // step 2
  const [newPw, setNewPw]           = useState('');
  const [confirmPw, setConfirmPw]   = useState('');
  const [showNewPw, setShowNewPw]   = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [resetLoading, setResetLoading]   = useState(false);
  const [resetError, setResetError]       = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    setFpError('');
    if (!fpEmail || !fpFlat) {
      setFpError('Please enter both email and flat number.');
      return;
    }
    setFpLoading(true);
    try {
      const res = await authApi.verifyIdentityForReset(fpEmail.trim(), fpFlat.trim());
      setResetToken(res.resetToken);
      setUserName(res.userName);
      setStep('reset');
    } catch (err) {
      setFpError(err.message || 'Verification failed. Please check your details.');
    } finally {
      setFpLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setResetError('');
    if (!newPw || !confirmPw) {
      setResetError('Please fill in both password fields.');
      return;
    }
    if (newPw.length < 6) {
      setResetError('Password must be at least 6 characters.');
      return;
    }
    if (newPw !== confirmPw) {
      setResetError('Passwords do not match.');
      return;
    }
    setResetLoading(true);
    try {
      await authApi.resetPasswordWithToken(resetToken, newPw);
      setStep('done');
    } catch (err) {
      setResetError(err.message || 'Reset failed. Please try again from the beginning.');
    } finally {
      setResetLoading(false);
    }
  };

  const overlayStyle = {
    position: 'fixed', inset: 0, zIndex: 50,
    background: 'rgba(30,35,15,0.65)', backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
  };

  const cardStyle = {
    background: '#fff', borderRadius: '1.25rem', padding: '2rem',
    width: '100%', maxWidth: '420px', boxShadow: '0 24px 64px rgba(0,0,0,0.22)',
    position: 'relative',
  };

  const inputStyle = {
    borderColor: '#BAC095', height: '2.75rem',
    paddingLeft: '2.5rem',
  };

  return (
    <div style={overlayStyle} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={cardStyle}>
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '1rem', right: '1rem',
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#9aA278', fontSize: '1.25rem', lineHeight: 1,
          }}
          aria-label="Close"
        >
          ✕
        </button>

        {/* ── Step 1: Verify identity ──────────────────────────────────── */}
        {step === 'verify' && (
          <>
            <div style={{ marginBottom: '1.5rem' }}>
              <div
                style={{
                  width: 48, height: 48, borderRadius: '0.75rem', marginBottom: '0.75rem',
                  background: 'rgba(99,107,47,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Lock size={22} style={{ color: '#636B2F' }} />
              </div>
              <h2 style={{ color: '#3D4127', marginBottom: '0.25rem', fontSize: '1.25rem' }}>
                Forgot Password?
              </h2>
              <p style={{ color: '#6b7155', fontSize: '0.875rem' }}>
                Enter your registered email and flat number to verify your identity.
              </p>
            </div>

            <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <Label htmlFor="fp-email" style={{ color: '#3D4127', marginBottom: '0.375rem', display: 'block' }}>
                  Email Address
                </Label>
                <div style={{ position: 'relative' }}>
                  <Mail
                    size={16}
                    style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#BAC095' }}
                  />
                  <Input
                    id="fp-email"
                    type="email"
                    placeholder="yourname@example.com"
                    value={fpEmail}
                    onChange={(e) => setFpEmail(e.target.value)}
                    style={inputStyle}
                    disabled={fpLoading}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="fp-flat" style={{ color: '#3D4127', marginBottom: '0.375rem', display: 'block' }}>
                  Flat Number
                </Label>
                <div style={{ position: 'relative' }}>
                  <Home
                    size={16}
                    style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#BAC095' }}
                  />
                  <Input
                    id="fp-flat"
                    type="text"
                    placeholder="e.g. A-101, B-202"
                    value={fpFlat}
                    onChange={(e) => setFpFlat(e.target.value)}
                    style={inputStyle}
                    disabled={fpLoading}
                    autoComplete="off"
                  />
                </div>
              </div>

              {fpError && (
                <div style={{
                  display: 'flex', alignItems: 'flex-start', gap: '0.5rem',
                  padding: '0.75rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.75rem',
                }}>
                  <AlertCircle size={16} style={{ color: '#dc2626', marginTop: '0.125rem', flexShrink: 0 }} />
                  <p style={{ color: '#b91c1c', fontSize: '0.875rem', margin: 0 }}>{fpError}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={fpLoading}
                style={{
                  width: '100%', height: '2.75rem', color: '#fff',
                  background: 'linear-gradient(135deg, #636B2F, #7a8338)',
                  boxShadow: '0 4px 15px rgba(99,107,47,0.3)',
                }}
              >
                {fpLoading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    Verifying...
                  </span>
                ) : 'Verify Identity'}
              </Button>

              <button
                type="button"
                onClick={onClose}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#6b7155', fontSize: '0.875rem', padding: '0.25rem',
                }}
              >
                <ArrowLeft size={14} /> Back to Login
              </button>
            </form>
          </>
        )}

        {/* ── Step 2: Set New Password ─────────────────────────────────── */}
        {step === 'reset' && (
          <>
            <div style={{ marginBottom: '1.5rem' }}>
              <div
                style={{
                  width: 48, height: 48, borderRadius: '0.75rem', marginBottom: '0.75rem',
                  background: 'rgba(99,107,47,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Lock size={22} style={{ color: '#636B2F' }} />
              </div>
              <h2 style={{ color: '#3D4127', marginBottom: '0.25rem', fontSize: '1.25rem' }}>
                Set New Password
              </h2>
              <p style={{ color: '#6b7155', fontSize: '0.875rem' }}>
                Hi <strong>{userName}</strong>! Choose a strong new password.
              </p>
            </div>

            <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <Label htmlFor="fp-new-pw" style={{ color: '#3D4127', marginBottom: '0.375rem', display: 'block' }}>
                  New Password
                </Label>
                <div style={{ position: 'relative' }}>
                  <Lock
                    size={16}
                    style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#BAC095' }}
                  />
                  <Input
                    id="fp-new-pw"
                    type={showNewPw ? 'text' : 'password'}
                    placeholder="At least 6 characters"
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    style={{ ...inputStyle, paddingRight: '2.5rem' }}
                    disabled={resetLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPw(!showNewPw)}
                    style={{
                      position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', color: '#BAC095',
                    }}
                  >
                    {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="fp-confirm-pw" style={{ color: '#3D4127', marginBottom: '0.375rem', display: 'block' }}>
                  Confirm Password
                </Label>
                <div style={{ position: 'relative' }}>
                  <Lock
                    size={16}
                    style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#BAC095' }}
                  />
                  <Input
                    id="fp-confirm-pw"
                    type={showConfirmPw ? 'text' : 'password'}
                    placeholder="Repeat new password"
                    value={confirmPw}
                    onChange={(e) => setConfirmPw(e.target.value)}
                    style={{ ...inputStyle, paddingRight: '2.5rem' }}
                    disabled={resetLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPw(!showConfirmPw)}
                    style={{
                      position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', color: '#BAC095',
                    }}
                  >
                    {showConfirmPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {resetError && (
                <div style={{
                  display: 'flex', alignItems: 'flex-start', gap: '0.5rem',
                  padding: '0.75rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.75rem',
                }}>
                  <AlertCircle size={16} style={{ color: '#dc2626', marginTop: '0.125rem', flexShrink: 0 }} />
                  <p style={{ color: '#b91c1c', fontSize: '0.875rem', margin: 0 }}>{resetError}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={resetLoading}
                style={{
                  width: '100%', height: '2.75rem', color: '#fff',
                  background: 'linear-gradient(135deg, #636B2F, #7a8338)',
                  boxShadow: '0 4px 15px rgba(99,107,47,0.3)',
                }}
              >
                {resetLoading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    Resetting...
                  </span>
                ) : 'Reset Password'}
              </Button>

              <button
                type="button"
                onClick={() => { setStep('verify'); setResetError(''); }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#6b7155', fontSize: '0.875rem', padding: '0.25rem',
                }}
              >
                <ArrowLeft size={14} /> Back
              </button>
            </form>
          </>
        )}

        {/* ── Step 3: Success ──────────────────────────────────────────── */}
        {step === 'done' && (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div
              style={{
                width: 64, height: 64, borderRadius: '50%', margin: '0 auto 1.25rem',
                background: 'rgba(22,163,74,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <CheckCircle size={32} style={{ color: '#16a34a' }} />
            </div>
            <h2 style={{ color: '#3D4127', marginBottom: '0.5rem', fontSize: '1.25rem' }}>
              Password Reset!
            </h2>
            <p style={{ color: '#6b7155', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Your password has been updated successfully. You can now log in with your new password.
            </p>
            <Button
              onClick={onClose}
              style={{
                width: '100%', height: '2.75rem', color: '#fff',
                background: 'linear-gradient(135deg, #636B2F, #7a8338)',
              }}
            >
              Back to Login
            </Button>
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── Login Page ────────────────────────────────────────────────────────────────
export function Login({ onLogin }) {
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [error, setError]           = useState('');
  const [isLoading, setIsLoading]   = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      await onLogin(email, password);
    } catch (err) {
      if (err.status === 0) {
        setError('Cannot reach the server. Make sure the backend is running on port 5000.');
      } else {
        setError(err.message || 'Invalid email or password');
      }
      setIsLoading(false);
    }
  };

  const fillCredentials = (type) => {
    setEmail(type === 'admin' ? 'admin@society.com' : 'rohan.deshmukh@gmail.com');
    setPassword(type === 'admin' ? 'Admin@1234' : 'Rohan@A101');
    setError('');
  };

  return (
    <>
      {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}

      <div
        className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #3D4127 0%, #4a5220 40%, #636B2F 100%)' }}
      >
        {/* Decorative background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20 blur-3xl"
            style={{ background: '#D4DE95' }}
          />
          <div
            className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-15 blur-3xl"
            style={{ background: '#BAC095' }}
          />
          <div
            className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full opacity-10 blur-3xl"
            style={{ background: '#D4DE95' }}
          />
          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'radial-gradient(circle, #D4DE95 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-xl"
              style={{ background: 'rgba(212, 222, 149, 0.2)', border: '1.5px solid rgba(212, 222, 149, 0.35)' }}
            >
              <Building2 className="size-8" style={{ color: '#D4DE95' }} />
            </div>
            <h1 className="mb-2" style={{ color: '#D4DE95' }}>Om Sai Apartment</h1>
            <p style={{ color: 'rgba(186, 192, 149, 0.8)' }}>Issue &amp; Operations Management System</p>
          </div>

          {/* Login Card */}
          <div
            className="rounded-2xl p-8 shadow-2xl"
            style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)' }}
          >
            <div className="mb-6">
              <h2 style={{ color: '#3D4127' }}>Welcome Back</h2>
              <p className="text-sm" style={{ color: '#6b7155' }}>Sign in to access your society dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" style={{ color: '#3D4127' }}>Email Address</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#BAC095' }}>
                    <Mail className="size-4" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="yourname@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11"
                    style={{ borderColor: '#BAC095', outline: 'none' }}
                    autoComplete="email"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" style={{ color: '#3D4127' }}>Password</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#BAC095' }}>
                    <Lock className="size-4" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-11"
                    style={{ borderColor: '#BAC095' }}
                    autoComplete="current-password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: '#BAC095' }}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle className="size-4 text-red-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full h-11 text-white shadow-lg transition-all hover:opacity-90 hover:shadow-xl"
                style={{ background: 'linear-gradient(135deg, #636B2F, #7a8338)', boxShadow: '0 4px 15px rgba(99,107,47,0.3)' }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </Button>

              {/* Forgot Password */}
              <div className="text-center">
                <button
                  type="button"
                  id="forgot-password-btn"
                  className="text-sm hover:underline transition-colors"
                  style={{ color: '#636B2F' }}
                  onClick={() => setShowForgot(true)}
                >
                  Forgot Password?
                </button>
              </div>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 pt-6 border-t" style={{ borderColor: '#eef0e6' }}>
              <p className="text-xs text-center mb-3" style={{ color: '#6b7155' }}>
                Quick Demo Access
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => fillCredentials('resident')}
                  className="px-3 py-2.5 rounded-xl text-xs transition-all hover:shadow-md"
                  style={{
                    background: 'rgba(186, 192, 149, 0.15)',
                    border: '1px solid rgba(186, 192, 149, 0.4)',
                    color: '#3D4127',
                  }}
                >
                  <Leaf className="size-3 inline mr-1" style={{ color: '#636B2F' }} />
                  Resident Login
                </button>
                <button
                  type="button"
                  onClick={() => fillCredentials('admin')}
                  className="px-3 py-2.5 rounded-xl text-xs transition-all hover:shadow-md"
                  style={{
                    background: 'rgba(99, 107, 47, 0.1)',
                    border: '1px solid rgba(99, 107, 47, 0.3)',
                    color: '#3D4127',
                  }}
                >
                  ⚙️ Admin Login
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs" style={{ color: 'rgba(186, 192, 149, 0.6)' }}>
              © 2026 Housing Society Management System
              <br />
              <span className="inline-flex items-center gap-1.5 mt-2">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                Secure &nbsp;·&nbsp; Simple &nbsp;·&nbsp; Efficient
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
