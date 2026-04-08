import { useState } from 'react';
import {
  Building2, Mail, Lock, AlertCircle, Eye, EyeOff,
  Leaf, ArrowLeft, CheckCircle, Home,
} from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { authApi } from '../services/api';

// Import background image
import loginBgImage from '/login-bg.png';

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

// ─── Login Page (AppSociety Design) ───────────────────────────────────────────
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
    setEmail(type === 'admin' ? 'nabonathchoudhary@gmail.com' : 'rohan.deshmukh@gmail.com');
    setPassword(type === 'admin' ? 'Nabonath@123' : 'Rohan@A101');
    setError('');
  };

  return (
    <>
      {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}

      <div className="min-h-screen flex">
        {/* LEFT PANEL - Brand Section (Hidden on mobile) */}
        <div 
          className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
          style={{ background: '#636B2F' }}
        >
          {/* Background Image - Full Opacity */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${loginBgImage})`
            }}
          />
          {/* Subtle Overlay for Text Readability */}
          <div 
            className="absolute inset-0"
            style={{ 
              background: 'linear-gradient(135deg, rgba(99, 107, 47, 0.3) 0%, rgba(61, 65, 39, 0.4) 100%)'
            }}
          />

          {/* Content (relative to overlay) */}
          <div className="relative z-10">
            {/* Logo and Tagline */}
            <div className="flex items-center gap-3 mb-8">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(212, 222, 149, 0.2)' }}
              >
                <Building2 className="w-7 h-7" style={{ color: '#D4DE95' }} />
              </div>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: '#FFFFFF' }}>
                  Om Sai Apartment
                </h1>
              </div>
            </div>

            <div className="mt-16">
              <h2 className="text-4xl font-bold mb-4" style={{ color: '#FFFFFF', lineHeight: 1.2 }}>
                Welcome to<br />Om Sai Apartment
              </h2>
              <p className="text-lg mb-12" style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
                Your complete housing society management solution
              </p>

              {/* Feature Bullets */}
              <div className="space-y-4">
                {[
                  'Digital maintenance tracking',
                  'Instant complaint resolution',
                  'Secure payment management',
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(212, 222, 149, 0.2)' }}
                    >
                      <CheckCircle className="w-4 h-4" style={{ color: '#D4DE95' }} />
                    </div>
                    <span style={{ color: 'rgba(255,255,255,0.8)' }}>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Text */}
          <div className="relative z-10">
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
              © 2026 Om Sai Apartment. All rights reserved.
            </p>
          </div>
        </div>

        {/* RIGHT PANEL - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12" style={{ background: '#FFFFFF' }}>
          <div className="w-full max-w-sm">
            {/* Mobile Logo (Visible only on mobile) */}
            <div className="lg:hidden text-center mb-8">
              <div 
                className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-3"
                style={{ background: 'rgba(99, 107, 47, 0.1)' }}
              >
                <Building2 className="w-7 h-7" style={{ color: '#636B2F' }} />
              </div>
              <h1 className="text-xl font-bold" style={{ color: '#1A1F0D' }}>
                Om Sai Apartment
              </h1>
            </div>

            {/* Form Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2" style={{ color: '#1A1F0D' }}>
                Sign In to Your Account
              </h2>
              <p style={{ color: '#8A9160', fontSize: '15px' }}>
                Enter your credentials to access the dashboard
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <Label 
                  htmlFor="email" 
                  className="block mb-1.5"
                  style={{ color: '#1A1F0D', fontSize: '13px', fontWeight: 500 }}
                >
                  Email Address
                </Label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#8A9160' }}>
                    <Mail className="w-4 h-4" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="yourname@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-11 h-12 rounded-lg transition-all duration-200"
                    style={{ 
                      border: '1px solid #E4E8D0',
                      fontSize: '15px',
                      color: '#1A1F0D'
                    }}
                    autoComplete="email"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <Label 
                  htmlFor="password" 
                  className="block mb-1.5"
                  style={{ color: '#1A1F0D', fontSize: '13px', fontWeight: 500 }}
                >
                  Password
                </Label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#8A9160' }}>
                    <Lock className="w-4 h-4" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-11 pr-11 h-12 rounded-lg transition-all duration-200"
                    style={{ 
                      border: '1px solid #E4E8D0',
                      fontSize: '15px',
                      color: '#1A1F0D'
                    }}
                    autoComplete="current-password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-200"
                    style={{ color: '#8A9160' }}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="text-sm hover:underline transition-all duration-200"
                  style={{ color: '#636B2F', fontSize: '13px' }}
                >
                  Forgot Password?
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div 
                  className="flex items-start gap-2 p-3 rounded-lg"
                  style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}
                >
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#EF4444' }} />
                  <p style={{ color: '#B91C1C', fontSize: '14px' }}>{error}</p>
                </div>
              )}

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full h-11 rounded-lg font-semibold transition-all duration-200 active:scale-95"
                style={{ 
                  background: '#636B2F',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  letterSpacing: '0.025em'
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-8 pt-6" style={{ borderTop: '1px solid #E4E8D0' }}>
              <p className="text-center mb-3" style={{ color: '#8A9160', fontSize: '13px' }}>
                Quick Demo Access
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => fillCredentials('resident')}
                  className="px-4 py-2.5 rounded-lg transition-all duration-200 hover:shadow-sm"
                  style={{
                    border: '2px solid #636B2F',
                    color: '#636B2F',
                    fontSize: '14px',
                    fontWeight: 600
                  }}
                >
                  Resident
                </button>
                <button
                  type="button"
                  onClick={() => fillCredentials('admin')}
                  className="px-4 py-2.5 rounded-lg transition-all duration-200"
                  style={{
                    background: '#636B2F',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    fontWeight: 600
                  }}
                >
                  Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
