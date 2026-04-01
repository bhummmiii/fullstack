import { useState } from 'react';
import { User, Mail, Phone, Save, Key, Bell, Shield, Camera, Building2, CheckCircle } from 'lucide-react';
import { authApi, setStoredUser } from '../services/api';
import { toast } from 'sonner';

export function UserProfile({ currentUser, onProfileUpdate }) {
  const [activeTab, setActiveTab] = useState('profile');

  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    flatNumber: currentUser?.flatNumber || '',
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    weeklyDigest: true,
    issueUpdates: true,
    paymentReminders: true,
  });

  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const [passwords, setPasswords] = useState({
    current: '', newPwd: '', confirm: '',
  });

  const handleSave = async () => {
    setIsSavingProfile(true);
    try {
      const res = await authApi.updateProfile({ name: profileData.name, phone: profileData.phone });
      setStoredUser(res.data);
      onProfileUpdate?.(res.data);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to save profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!passwords.current || !passwords.newPwd || !passwords.confirm) {
      toast.error('Please fill in all password fields');
      return;
    }
    if (passwords.newPwd !== passwords.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwords.newPwd.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    setIsSavingPassword(true);
    try {
      await authApi.changePassword(passwords.current, passwords.newPwd);
      setPasswords({ current: '', newPwd: '', confirm: '' });
      toast.success('Password changed successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to change password');
    } finally {
      setIsSavingPassword(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile Info', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  const inputStyle = {
    border: '1.5px solid rgba(186,192,149,0.5)',
    background: '#f8f9f4',
    color: '#1a1e0f',
    borderRadius: '0.75rem',
    padding: '0.625rem 0.875rem',
    width: '100%',
    outline: 'none',
    fontSize: '0.875rem',
    transition: 'border-color 0.2s',
  };

  const getInitials = (name) =>
    name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header Banner */}
      <div
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #3D4127 0%, #636B2F 60%, #7a8338 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, #D4DE95 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="relative flex items-center gap-5">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-xl shadow-xl border-2"
              style={{ background: 'rgba(212,222,149,0.2)', borderColor: 'rgba(212,222,149,0.4)', color: '#D4DE95' }}
            >
              {getInitials(currentUser.name)}
            </div>
            <button
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl flex items-center justify-center shadow-md"
              style={{ background: '#D4DE95' }}
            >
              <Camera className="size-3.5" style={{ color: '#3D4127' }} />
            </button>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="mb-1" style={{ color: '#D4DE95' }}>{currentUser.name}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm" style={{ color: 'rgba(212,222,149,0.7)' }}>
              <span className="flex items-center gap-1.5">
                <Building2 className="size-4" />
                Flat {currentUser.flatNumber}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Mail className="size-4" />
                {currentUser.email}
              </span>
            </div>
          </div>
          <div
            className="px-4 py-2 rounded-xl text-sm capitalize hidden sm:block"
            style={{ background: 'rgba(212,222,149,0.15)', color: '#D4DE95', border: '1px solid rgba(212,222,149,0.25)' }}
          >
            {currentUser.role} Access
          </div>
        </div>
      </div>

      {/* Tabs + Content */}
      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{ border: '1px solid rgba(99,107,47,0.12)', boxShadow: '0 2px 12px rgba(61,65,39,0.05)' }}
      >
        {/* Tab Bar */}
        <div
          className="flex"
          style={{ borderBottom: '1px solid rgba(186,192,149,0.3)' }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-6 py-4 text-sm transition-all relative"
                style={
                  isActive
                    ? { color: '#636B2F', borderBottom: '2px solid #636B2F' }
                    : { color: '#6b7155' }
                }
              >
                <Icon className="size-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-6 lg:p-8">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="max-w-2xl space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm mb-1.5" style={{ color: '#3D4127' }}>Full Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1.5" style={{ color: '#3D4127' }}>Flat Number</label>
                  <input
                    type="text"
                    value={profileData.flatNumber}
                    disabled
                    style={{ ...inputStyle, opacity: 0.6, cursor: 'not-allowed' }}
                  />
                  <p className="text-xs mt-1" style={{ color: '#9aA278' }}>Cannot be changed. Contact admin.</p>
                </div>
                <div>
                  <label className="block text-sm mb-1.5" style={{ color: '#3D4127' }}>Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4" style={{ color: '#BAC095' }} />
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      style={{ ...inputStyle, paddingLeft: '2.5rem' }}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-1.5" style={{ color: '#3D4127' }}>Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4" style={{ color: '#BAC095' }} />
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      style={{ ...inputStyle, paddingLeft: '2.5rem' }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(186,192,149,0.25)' }}>
                <div className="ml-auto">
                  <button
                    onClick={handleSave}
                    disabled={isSavingProfile}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm transition-all hover:shadow-lg disabled:opacity-60"
                    style={{ background: 'linear-gradient(135deg, #636B2F, #7a8338)' }}
                  >
                    <Save className="size-4" />
                    {isSavingProfile ? 'Saving…' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="max-w-2xl space-y-6">
              <div>
                <h3 className="text-sm mb-1" style={{ color: '#3D4127' }}>Notification Preferences</h3>
                <p className="text-xs mb-4" style={{ color: '#9aA278' }}>Choose how you'd like to receive updates</p>
                <div className="space-y-3">
                  {[
                    { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive updates via email' },
                    { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Receive updates via SMS' },
                    { key: 'pushNotifications', label: 'Push Notifications', desc: 'Browser push notifications' },
                    { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Summary of weekly activities' },
                    { key: 'issueUpdates', label: 'Issue Status Updates', desc: 'Notifications on issue changes' },
                    { key: 'paymentReminders', label: 'Payment Reminders', desc: 'Reminders for maintenance dues' },
                  ].map((pref) => (
                    <div
                      key={pref.key}
                      className="flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all"
                      style={{ border: '1px solid rgba(186,192,149,0.3)', background: '#f8f9f4' }}
                      onClick={() => setPreferences({ ...preferences, [pref.key]: !preferences[pref.key] })}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(99,107,47,0.3)')}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(186,192,149,0.3)')}
                    >
                      <div>
                        <p className="text-sm" style={{ color: '#3D4127' }}>{pref.label}</p>
                        <p className="text-xs mt-0.5" style={{ color: '#9aA278' }}>{pref.desc}</p>
                      </div>
                      {/* Toggle */}
                      <div
                        className="relative w-11 h-6 rounded-full transition-all duration-200 flex-shrink-0"
                        style={{ background: preferences[pref.key] ? '#636B2F' : '#BAC095' }}
                      >
                        <div
                          className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-200"
                          style={{ left: preferences[pref.key] ? '1.375rem' : '0.125rem' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end pt-4" style={{ borderTop: '1px solid rgba(186,192,149,0.25)' }}>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm transition-all hover:shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #636B2F, #7a8338)' }}
                >
                  <Save className="size-4" />
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="max-w-2xl space-y-6">
              <div>
                <h3 className="text-sm mb-1 flex items-center gap-2" style={{ color: '#3D4127' }}>
                  <Key className="size-4" style={{ color: '#636B2F' }} />
                  Change Password
                </h3>
                <p className="text-xs mb-4" style={{ color: '#9aA278' }}>Ensure your account is using a strong password</p>
                <div className="space-y-4">
                  {[
                    { id: 'current', label: 'Current Password', placeholder: 'Enter current password', key: 'current' },
                    { id: 'newPwd', label: 'New Password', placeholder: 'Enter new password', key: 'newPwd' },
                    { id: 'confirm', label: 'Confirm New Password', placeholder: 'Confirm new password', key: 'confirm' },
                  ].map((field) => (
                    <div key={field.id}>
                      <label className="block text-sm mb-1.5" style={{ color: '#3D4127' }}>{field.label}</label>
                      <input
                        type="password"
                        placeholder={field.placeholder}
                        value={passwords[field.key]}
                        onChange={(e) => setPasswords({ ...passwords, [field.key]: e.target.value })}
                        style={inputStyle}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Password requirements */}
              <div
                className="p-4 rounded-xl"
                style={{ background: 'rgba(212,222,149,0.15)', border: '1px solid rgba(186,192,149,0.35)' }}
              >
                <p className="text-xs mb-2" style={{ color: '#3D4127' }}>Password Requirements</p>
                <ul className="space-y-1">
                  {['Minimum 8 characters', 'At least one uppercase letter', 'One number & one special character'].map((r, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs" style={{ color: '#6b7155' }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#636B2F' }} />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end pt-4" style={{ borderTop: '1px solid rgba(186,192,149,0.25)' }}>
                <button
                  onClick={handlePasswordChange}
                  disabled={isSavingPassword}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm transition-all hover:shadow-lg disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, #636B2F, #7a8338)' }}
                >
                  <Save className="size-4" />
                  {isSavingPassword ? 'Updating…' : 'Update Password'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
