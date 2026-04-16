import { useState } from 'react';
import {
  Save, Building2, Bell, CreditCard, Settings as SettingsIcon,
  CheckCircle, Shield, Globe, Mail, Phone, AlertTriangle, Info,
} from 'lucide-react';

export function Settings() {
  const [activeTab, setActiveTab] = useState('society');
  const [saved, setSaved] = useState(false);

  const [societyInfo, setSocietyInfo] = useState({
    name: 'Om Sai Apartment',
    address: 'Om Sai Apartment, Shubham Park, GajananNagar, Mahajan Nagar, Nashik, Maharashtra ',
    adminName: 'Nabonath Choudhary',
    adminEmail: 'nabonath.choudhary@gmail.com',
    adminPhone: '+91 99605 37555',
    totalFlats: '25',
    totalBlocks: '5',
    established: '2018',
    registrationNo: 'MH-2018-12345',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNewComplaint: true,
    emailPaymentDue: true,
    emailVisitorEntry: false,
    emailAnnouncements: true,
    smsUrgentComplaints: true,
    smsPaymentOverdue: true,
    smsVisitorCheckIn: false,
    pushAnnouncements: true,
  });

  const [paymentSettings, setPaymentSettings] = useState({
    monthlyAmount: '3500',
    dueDay: '31',
    lateFee: '100',
    gracePeriod: '5',
    upiId: 'society@upi',
    bankAccount: '1234567890',
    bankIfsc: 'HDFC0001234',
    bankName: 'HDFC Bank, Andheri Branch',
  });

  const [systemSettings, setSystemSettings] = useState({
    timezone: 'Asia/Mumbai',
    language: 'en',
    dateFormat: 'DD/MM/YYYY',
    autoResolveAfterDays: '30',
    maxComplaintsPerResident: '5',
    visitorApprovalRequired: true,
    amenityBookingApproval: false,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const tabs = [
    { id: 'society', label: 'Society Info', icon: Building2 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'payments', label: 'Payment Config', icon: CreditCard },
    { id: 'system', label: 'System', icon: SettingsIcon },
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

  const ToggleSwitch = ({ checked, onChange }) => (
    <button
      type="button"
      onClick={onChange}
      className="relative flex-shrink-0 focus:outline-none"
      style={{ width: '44px', height: '24px' }}
    >
      <div
        className="absolute inset-0 rounded-full transition-all duration-200"
        style={{ background: checked ? '#636B2F' : 'rgba(186,192,149,0.5)' }}
      />
      <div
        className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-200"
        style={{ left: checked ? '1.375rem' : '0.125rem' }}
      />
    </button>
  );

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Page Header */}
      <div>
        <h1 style={{ color: '#2c3018' }} className="mb-1">Settings</h1>
        <p style={{ color: '#8a9268', fontSize: '0.8125rem' }}>
          Manage society configurations, preferences and system settings
        </p>
      </div>

      {/* Settings Card */}
      <div
        className="bg-white rounded-3xl overflow-hidden"
        style={{ border: '1px solid rgba(99,107,47,0.08)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
      >
        {/* Tab Bar */}
        <div
          className="flex overflow-x-auto"
          style={{ borderBottom: '1px solid rgba(186,192,149,0.3)' }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-5 py-4 text-sm transition-all relative whitespace-nowrap"
                style={
                  isActive
                    ? { color: '#636B2F', borderBottom: '2px solid #636B2F', marginBottom: '-1px' }
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
          {/* ─── Society Info Tab ─────────────────────────────────────── */}
          {activeTab === 'society' && (
            <div className="max-w-2xl space-y-8">
              {/* Basic Info */}
              <div>
                <h3
                  className="text-sm mb-1 flex items-center gap-2"
                  style={{ color: '#3D4127' }}
                >
                  <Building2 className="size-4" style={{ color: '#636B2F' }} />
                  Society Information
                </h3>
                <p className="text-xs mb-5" style={{ color: '#9aA278' }}>
                  Basic details about your housing society
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm mb-1.5" style={{ color: '#3D4127' }}>Society Name</label>
                    <input
                      type="text"
                      value={societyInfo.name}
                      onChange={(e) => setSocietyInfo({ ...societyInfo, name: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1.5" style={{ color: '#3D4127' }}>Established Year</label>
                    <input
                      type="text"
                      value={societyInfo.established}
                      onChange={(e) => setSocietyInfo({ ...societyInfo, established: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm mb-1.5" style={{ color: '#3D4127' }}>Address</label>
                    <textarea
                      value={societyInfo.address}
                      onChange={(e) => setSocietyInfo({ ...societyInfo, address: e.target.value })}
                      rows={2}
                      style={{ ...inputStyle, resize: 'vertical' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1.5" style={{ color: '#3D4127' }}>Total Flats</label>
                    <input
                      type="number"
                      value={societyInfo.totalFlats}
                      onChange={(e) => setSocietyInfo({ ...societyInfo, totalFlats: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1.5" style={{ color: '#3D4127' }}>Total Blocks</label>
                    <input
                      type="number"
                      value={societyInfo.totalBlocks}
                      onChange={(e) => setSocietyInfo({ ...societyInfo, totalBlocks: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm mb-1.5" style={{ color: '#3D4127' }}>
                      Registration Number
                    </label>
                    <input
                      type="text"
                      value={societyInfo.registrationNo}
                      onChange={(e) => setSocietyInfo({ ...societyInfo, registrationNo: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                </div>
              </div>

              {/* Admin Contact */}
              <div style={{ borderTop: '1px solid rgba(186,192,149,0.25)', paddingTop: '1.5rem' }}>
                <h3
                  className="text-sm mb-1 flex items-center gap-2"
                  style={{ color: '#3D4127' }}
                >
                  <Shield className="size-4" style={{ color: '#636B2F' }} />
                  Admin / Secretary Contact
                </h3>
                <p className="text-xs mb-5" style={{ color: '#9aA278' }}>
                  Primary contact details for the society management
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm mb-1.5" style={{ color: '#3D4127' }}>Admin Name</label>
                    <input
                      type="text"
                      value={societyInfo.adminName}
                      onChange={(e) => setSocietyInfo({ ...societyInfo, adminName: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1.5" style={{ color: '#3D4127' }}>Phone Number</label>
                    <div className="relative">
                      <Phone
                        className="absolute left-3 top-1/2 -translate-y-1/2 size-4"
                        style={{ color: '#BAC095' }}
                      />
                      <input
                        type="tel"
                        value={societyInfo.adminPhone}
                        onChange={(e) => setSocietyInfo({ ...societyInfo, adminPhone: e.target.value })}
                        style={{ ...inputStyle, paddingLeft: '2.5rem' }}
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm mb-1.5" style={{ color: '#3D4127' }}>Email Address</label>
                    <div className="relative">
                      <Mail
                        className="absolute left-3 top-1/2 -translate-y-1/2 size-4"
                        style={{ color: '#BAC095' }}
                      />
                      <input
                        type="email"
                        value={societyInfo.adminEmail}
                        onChange={(e) => setSocietyInfo({ ...societyInfo, adminEmail: e.target.value })}
                        style={{ ...inputStyle, paddingLeft: '2.5rem' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── Notifications Tab ────────────────────────────────────── */}
          {activeTab === 'notifications' && (
            <div className="max-w-2xl space-y-8">
              {/* Info Banner */}
              <div
                className="flex items-start gap-3 p-4 rounded-xl"
                style={{ background: 'rgba(212,222,149,0.15)', border: '1px solid rgba(186,192,149,0.4)' }}
              >
                <Info className="size-4 mt-0.5 flex-shrink-0" style={{ color: '#636B2F' }} />
                <p className="text-xs" style={{ color: '#3D4127' }}>
                  Configure when and how notifications are sent to admins and residents.
                  Email notifications require an SMTP setup; SMS requires an SMS gateway.
                </p>
              </div>

              {/* Email Notifications */}
              <div>
                <h3 className="text-sm mb-1" style={{ color: '#3D4127' }}>Email Notifications</h3>
                <p className="text-xs mb-4" style={{ color: '#9aA278' }}>
                  Configure email alerts sent to the admin
                </p>
                <div className="space-y-3">
                  {[
                    { key: 'emailNewComplaint', label: 'New Complaint Filed', desc: 'Notify when a resident files a new complaint' },
                    { key: 'emailPaymentDue', label: 'Payment Due Reminder', desc: 'Auto-send reminder before maintenance due date' },
                    { key: 'emailVisitorEntry', label: 'Visitor Entry Alerts', desc: 'Notify on every visitor check-in' },
                    { key: 'emailAnnouncements', label: 'Announcement Broadcast', desc: 'Email announcements to all residents' },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all"
                      style={{ border: '1px solid rgba(186,192,149,0.3)', background: '#f8f9f4' }}
                      onClick={() =>
                        setNotificationSettings({
                          ...notificationSettings,
                          [item.key]: !notificationSettings[item.key],
                        })
                      }
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.borderColor = 'rgba(99,107,47,0.3)')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.borderColor = 'rgba(186,192,149,0.3)')
                      }
                    >
                      <div>
                        <p className="text-sm" style={{ color: '#3D4127' }}>{item.label}</p>
                        <p className="text-xs mt-0.5" style={{ color: '#9aA278' }}>{item.desc}</p>
                      </div>
                      <ToggleSwitch
                        checked={notificationSettings[item.key]}
                        onChange={() =>
                          setNotificationSettings({
                            ...notificationSettings,
                            [item.key]: !notificationSettings[item.key],
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* SMS Notifications */}
              <div style={{ borderTop: '1px solid rgba(186,192,149,0.25)', paddingTop: '1.5rem' }}>
                <h3 className="text-sm mb-1" style={{ color: '#3D4127' }}>SMS &amp; Push Notifications</h3>
                <p className="text-xs mb-4" style={{ color: '#9aA278' }}>SMS and push alert configuration</p>
                <div className="space-y-3">
                  {[
                    { key: 'smsUrgentComplaints', label: 'Urgent Complaint SMS', desc: 'SMS alert for complaints marked urgent' },
                    { key: 'smsPaymentOverdue', label: 'Overdue Payment SMS', desc: 'SMS reminder for overdue maintenance' },
                    { key: 'smsVisitorCheckIn', label: 'Visitor Check-in SMS', desc: 'SMS to resident when visitor checks in' },
                    { key: 'pushAnnouncements', label: 'Push Announcements', desc: 'Browser push for new announcements' },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all"
                      style={{ border: '1px solid rgba(186,192,149,0.3)', background: '#f8f9f4' }}
                      onClick={() =>
                        setNotificationSettings({
                          ...notificationSettings,
                          [item.key]: !notificationSettings[item.key],
                        })
                      }
                    >
                      <div>
                        <p className="text-sm" style={{ color: '#3D4127' }}>{item.label}</p>
                        <p className="text-xs mt-0.5" style={{ color: '#9aA278' }}>{item.desc}</p>
                      </div>
                      <ToggleSwitch
                        checked={notificationSettings[item.key]}
                        onChange={() =>
                          setNotificationSettings({
                            ...notificationSettings,
                            [item.key]: !notificationSettings[item.key],
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── Payments Tab ─────────────────────────────────────────── */}
          {activeTab === 'payments' && (
            <div className="max-w-2xl space-y-8">
              {/* Maintenance Config */}
              <div>
                <h3
                  className="text-sm mb-1 flex items-center gap-2"
                  style={{ color: '#3D4127' }}
                >
                  <CreditCard className="size-4" style={{ color: '#636B2F' }} />
                  Maintenance Fee Configuration
                </h3>
                <p className="text-xs mb-5" style={{ color: '#9aA278' }}>
                  Set monthly maintenance parameters for all residents
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm mb-1.5" style={{ color: '#3D4127' }}>
                      Monthly Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={paymentSettings.monthlyAmount}
                      onChange={(e) => setPaymentSettings({ ...paymentSettings, monthlyAmount: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1.5" style={{ color: '#3D4127' }}>
                      Due Day of Month
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      value={paymentSettings.dueDay}
                      onChange={(e) => setPaymentSettings({ ...paymentSettings, dueDay: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1.5" style={{ color: '#3D4127' }}>
                      Late Fee (₹)
                    </label>
                    <input
                      type="number"
                      value={paymentSettings.lateFee}
                      onChange={(e) => setPaymentSettings({ ...paymentSettings, lateFee: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1.5" style={{ color: '#3D4127' }}>
                      Grace Period (days)
                    </label>
                    <input
                      type="number"
                      value={paymentSettings.gracePeriod}
                      onChange={(e) => setPaymentSettings({ ...paymentSettings, gracePeriod: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* Fee Summary Preview */}
                <div
                  className="mt-5 p-4 rounded-xl"
                  style={{ background: 'rgba(212,222,149,0.12)', border: '1px solid rgba(186,192,149,0.35)' }}
                >
                  <p className="text-xs mb-2" style={{ color: '#3D4127', fontWeight: 500 }}>
                    Fee Structure Preview
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Monthly Fee', value: `₹${Number(paymentSettings.monthlyAmount).toLocaleString('en-IN')}` },
                      { label: 'Due Date', value: `${paymentSettings.dueDay}th of month` },
                      { label: 'Late Fee after grace', value: `₹${paymentSettings.lateFee}` },
                    ].map((item, i) => (
                      <div key={i} className="text-center">
                        <p className="text-xs mb-0.5" style={{ color: '#9aA278' }}>{item.label}</p>
                        <p className="text-sm" style={{ color: '#636B2F' }}>{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div style={{ borderTop: '1px solid rgba(186,192,149,0.25)', paddingTop: '1.5rem' }}>
                <h3 className="text-sm mb-1" style={{ color: '#3D4127' }}>Accepted Payment Methods</h3>
                <p className="text-xs mb-5" style={{ color: '#9aA278' }}>
                  Configure payment details that residents will use
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm mb-1.5" style={{ color: '#3D4127' }}>UPI ID</label>
                    <input
                      type="text"
                      value={paymentSettings.upiId}
                      onChange={(e) => setPaymentSettings({ ...paymentSettings, upiId: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1.5" style={{ color: '#3D4127' }}>
                      Bank Account No.
                    </label>
                    <input
                      type="text"
                      value={paymentSettings.bankAccount}
                      onChange={(e) => setPaymentSettings({ ...paymentSettings, bankAccount: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1.5" style={{ color: '#3D4127' }}>IFSC Code</label>
                    <input
                      type="text"
                      value={paymentSettings.bankIfsc}
                      onChange={(e) => setPaymentSettings({ ...paymentSettings, bankIfsc: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1.5" style={{ color: '#3D4127' }}>Bank Name &amp; Branch</label>
                    <input
                      type="text"
                      value={paymentSettings.bankName}
                      onChange={(e) => setPaymentSettings({ ...paymentSettings, bankName: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── System Tab ───────────────────────────────────────────── */}
          {activeTab === 'system' && (
            <div className="max-w-2xl space-y-8">
              {/* Localisation */}
              <div>
                <h3
                  className="text-sm mb-1 flex items-center gap-2"
                  style={{ color: '#3D4127' }}
                >
                  <Globe className="size-4" style={{ color: '#636B2F' }} />
                  Localisation &amp; Preferences
                </h3>
                <p className="text-xs mb-5" style={{ color: '#9aA278' }}>
                  Timezone, language, and date preferences
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm mb-1.5" style={{ color: '#3D4127' }}>Timezone</label>
                    <select
                      value={systemSettings.timezone}
                      onChange={(e) => setSystemSettings({ ...systemSettings, timezone: e.target.value })}
                      style={inputStyle}
                    >
                      <option value="Asia/Kolkata">Asia/Kolkata (IST +5:30)</option>
                      <option value="Asia/Mumbai">Asia/Mumbai</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-1.5" style={{ color: '#3D4127' }}>Language</label>
                    <select
                      value={systemSettings.language}
                      onChange={(e) => setSystemSettings({ ...systemSettings, language: e.target.value })}
                      style={inputStyle}
                    >
                      <option value="en">English</option>
                      <option value="hi">Hindi (हिंदी)</option>
                      <option value="mr">Marathi (मराठी)</option>
                      <option value="gu">Gujarati (ગુજરાતી)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-1.5" style={{ color: '#3D4127' }}>Date Format</label>
                    <select
                      value={systemSettings.dateFormat}
                      onChange={(e) => setSystemSettings({ ...systemSettings, dateFormat: e.target.value })}
                      style={inputStyle}
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-1.5" style={{ color: '#3D4127' }}>
                      Auto-close Complaints (days)
                    </label>
                    <input
                      type="number"
                      value={systemSettings.autoResolveAfterDays}
                      onChange={(e) =>
                        setSystemSettings({ ...systemSettings, autoResolveAfterDays: e.target.value })
                      }
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1.5" style={{ color: '#3D4127' }}>
                      Max Active Complaints / Resident
                    </label>
                    <input
                      type="number"
                      value={systemSettings.maxComplaintsPerResident}
                      onChange={(e) =>
                        setSystemSettings({ ...systemSettings, maxComplaintsPerResident: e.target.value })
                      }
                      style={inputStyle}
                    />
                  </div>
                </div>
              </div>

              {/* Approval Toggles */}
              <div style={{ borderTop: '1px solid rgba(186,192,149,0.25)', paddingTop: '1.5rem' }}>
                <h3 className="text-sm mb-4" style={{ color: '#3D4127' }}>Approval Settings</h3>
                <div className="space-y-3">
                  {[
                    {
                      key: 'visitorApprovalRequired',
                      label: 'Visitor Pre-Approval Required',
                      desc: 'Residents must pre-approve visitors before entry',
                    },
                    {
                      key: 'amenityBookingApproval',
                      label: 'Amenity Booking Approval',
                      desc: 'Admin must approve amenity bookings before confirmation',
                    },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all"
                      style={{ border: '1px solid rgba(186,192,149,0.3)', background: '#f8f9f4' }}
                      onClick={() =>
                        setSystemSettings({
                          ...systemSettings,
                          [item.key]: !systemSettings[item.key],
                        })
                      }
                    >
                      <div>
                        <p className="text-sm" style={{ color: '#3D4127' }}>{item.label}</p>
                        <p className="text-xs mt-0.5" style={{ color: '#9aA278' }}>{item.desc}</p>
                      </div>
                      <ToggleSwitch
                        checked={systemSettings[item.key]}
                        onChange={() =>
                          setSystemSettings({
                            ...systemSettings,
                            [item.key]: !systemSettings[item.key],
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* System Info */}
              <div
                className="p-5 rounded-xl"
                style={{ background: 'rgba(212,222,149,0.12)', border: '1px solid rgba(186,192,149,0.35)' }}
              >
                <p className="text-xs mb-3" style={{ color: '#3D4127', fontWeight: 500 }}>
                  System Information
                </p>
                {[
                  { label: 'Application Version', value: 'v2.1.0' },
                  { label: 'Last Updated', value: '8 March 2026' },
                  { label: 'Database Status', value: '✓ Connected', color: '#16a34a' },
                  { label: 'Total Records', value: '2,847 entries' },
                  { label: 'Support', value: 'support@societyhub.com', color: '#636B2F' },
                ].map((info, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-1.5"
                    style={{ borderBottom: i < 4 ? '1px solid rgba(186,192,149,0.2)' : 'none' }}
                  >
                    <span className="text-xs" style={{ color: '#6b7155' }}>{info.label}</span>
                    <span className="text-xs" style={{ color: info.color || '#3D4127' }}>
                      {info.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Danger Zone */}
              <div
                className="p-5 rounded-xl"
                style={{ background: 'rgba(220,38,38,0.04)', border: '1px solid rgba(220,38,38,0.15)' }}
              >
                <div className="flex items-start gap-3 mb-4">
                  <AlertTriangle className="size-4 mt-0.5 flex-shrink-0" style={{ color: '#dc2626' }} />
                  <div>
                    <p className="text-sm" style={{ color: '#b91c1c' }}>Danger Zone</p>
                    <p className="text-xs mt-0.5" style={{ color: '#6b7155' }}>
                      These actions are irreversible. Proceed with caution.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    className="px-4 py-2 rounded-xl text-sm transition-all"
                    style={{ border: '1.5px solid rgba(220,38,38,0.3)', color: '#dc2626', background: '#fff' }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = 'rgba(220,38,38,0.06)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = '#fff')
                    }
                  >
                    Clear All Complaint Data
                  </button>
                  <button
                    className="px-4 py-2 rounded-xl text-sm transition-all"
                    style={{ border: '1.5px solid rgba(220,38,38,0.3)', color: '#dc2626', background: '#fff' }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = 'rgba(220,38,38,0.06)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = '#fff')
                    }
                  >
                    Reset System Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ─── Save Button Row ───────────────────────────────────────── */}
          <div
            className="mt-8 flex items-center justify-between pt-5"
            style={{ borderTop: '1px solid rgba(186,192,149,0.25)' }}
          >
            {saved ? (
              <div className="flex items-center gap-2 text-sm" style={{ color: '#16a34a' }}>
                <CheckCircle className="size-4" />
                Settings saved successfully!
              </div>
            ) : (
              <div />
            )}
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm transition-all hover:shadow-lg hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #636B2F, #7a8338)' }}
            >
              <Save className="size-4" />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
