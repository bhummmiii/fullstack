import { useState } from 'react';
import {
  HelpCircle, ChevronDown, ChevronUp, Mail, Phone, MessageSquare,
  Book, AlertCircle, CreditCard, UserCheck, Calendar, FileText, Bell,
  Search, ExternalLink, CheckCircle, Send,
} from 'lucide-react';

// ─── FAQ Data ─────────────────────────────────────────────────────────────────
const FAQ_DATA = [
  {
    category: 'Complaints & Issues',
    icon: AlertCircle,
    color: '#636B2F',
    iconBg: 'rgba(99,107,47,0.1)',
    items: [
      {
        q: 'How do I raise a new complaint?',
        a: 'Go to Sidebar → Issues → Raise Complaint. Fill in the title, category, description, and priority. You can also attach up to 5 images as evidence. Click "Submit Complaint" to file it.',
      },
      {
        q: 'How can I track the status of my complaint?',
        a: 'Navigate to Issues → My Complaints. Each complaint shows its current status: Pending, In Progress, or Resolved. You will also receive a notification when the status changes.',
      },
      {
        q: 'Can I edit or delete a complaint after submission?',
        a: 'Residents can edit or delete their own complaints as long as the status is still Pending. Once the admin picks it up (In Progress), editing is disabled to preserve audit integrity.',
      },
      {
        q: 'What priority levels are available?',
        a: 'Three priority levels are available: Low (routine issues, addressed within 7 days), Medium (standard turnaround of 3 days), and High/Urgent (safety-critical issues, addressed within 24 hours).',
      },
    ],
  },
  {
    category: 'Maintenance & Payments',
    icon: CreditCard,
    color: '#16a34a',
    iconBg: 'rgba(22,163,74,0.1)',
    items: [
      {
        q: 'When is the monthly maintenance due?',
        a: 'Monthly maintenance is due on the 31st of each month (or as configured by your admin). A grace period of 5 days applies, after which a late fee of ₹100 is added automatically.',
      },
      {
        q: 'How do I pay my maintenance fees?',
        a: 'You can pay via UPI (society@upi), or bank transfer to HDFC Bank Account No. 1234567890 (IFSC: HDFC0001234). After payment, inform the admin so they can mark your bill as paid.',
      },
      {
        q: 'Where can I see my payment history?',
        a: 'Go to Finance → Maintenance / Payments. You will see all your bills, their statuses (Paid, Pending, Overdue), and the payment dates.',
      },
      {
        q: 'I paid but the status still shows Pending. What do I do?',
        a: 'Payment statuses are updated manually by the admin after verification. Please share the payment screenshot with the admin or contact them directly. Updates typically happen within 24 hours.',
      },
    ],
  },
  {
    category: 'Visitor Management',
    icon: UserCheck,
    color: '#2563eb',
    iconBg: 'rgba(37,99,235,0.1)',
    items: [
      {
        q: 'How do I pre-approve a visitor?',
        a: 'Go to Services → Visitor Log → Add Visitor. Enter the visitor\'s name, purpose of visit, and expected date/time. The entry will be pre-approved and the security gate will be informed.',
      },
      {
        q: 'Can I see all visitors to my flat?',
        a: 'Yes. Go to Services → Visitor Log and your visitor history will show all approved, pending, and past visitors associated with your flat.',
      },
    ],
  },
  {
    category: 'Amenity Bookings',
    icon: Calendar,
    color: '#ea580c',
    iconBg: 'rgba(234,88,12,0.1)',
    items: [
      {
        q: 'Which amenities can I book?',
        a: 'Available amenities include: Clubhouse, Swimming Pool, Gym, Sports Court, and Party Hall. Availability and pricing are shown on the booking page.',
      },
      {
        q: 'How far in advance can I book an amenity?',
        a: 'You can book amenities up to 30 days in advance. Bookings are confirmed upon admin approval (if approval is enabled) or instantly.',
      },
      {
        q: 'How do I cancel a booking?',
        a: 'Go to Services → Amenity Booking, find your booking, and click Cancel. Cancellations are free if done more than 24 hours before the booking time.',
      },
    ],
  },
  {
    category: 'Documents & Notices',
    icon: FileText,
    color: '#9333ea',
    iconBg: 'rgba(147,51,234,0.1)',
    items: [
      {
        q: 'Where can I find society documents?',
        a: 'Go to More → Documents. You will find all official documents including the Registration Certificate, NOC, Bylaws, AGM Minutes, and Maintenance Agreements.',
      },
      {
        q: 'How do I stay updated with society announcements?',
        a: 'Notices are posted in the Community → Notices section. You also receive push notifications and email alerts for new announcements (configurable in Settings).',
      },
    ],
  },
  {
    category: 'Account & Profile',
    icon: Bell,
    color: '#6b7155',
    iconBg: 'rgba(107,113,85,0.1)',
    items: [
      {
        q: 'How do I update my profile information?',
        a: 'Click your name/avatar in the top-right corner → My Profile. You can update your name, phone number, and flat number. Changes are saved instantly.',
      },
      {
        q: 'How do I change my password?',
        a: 'Go to Profile → Change Password section. Enter your current password and then your new password (minimum 6 characters). Click Save to confirm.',
      },
      {
        q: 'I forgot my password. How do I reset it?',
        a: 'On the login page, click "Forgot Password?". Enter your registered email and flat number to verify your identity, then set a new password.',
      },
    ],
  },
];

// ─── FAQ Item (accordion) ─────────────────────────────────────────────────────
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid rgba(186,192,149,0.2)' }}>
      <button
        className="w-full flex items-start gap-3 py-4 text-left transition-all"
        onClick={() => setOpen(!open)}
      >
        <span
          className="flex-shrink-0 mt-0.5"
          style={{ color: open ? '#636B2F' : '#BAC095' }}
        >
          {open ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </span>
        <span className="text-sm flex-1" style={{ color: '#1a1e0f', fontWeight: open ? 500 : 400 }}>{q}</span>
      </button>
      {open && (
        <div className="pb-4 pl-7 pr-2">
          <p className="text-sm leading-relaxed" style={{ color: '#6b7155' }}>{a}</p>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function HelpSupport() {
  const [searchQuery, setSearchQuery]     = useState('');
  const [activeSection, setActiveSection] = useState('faq');
  const [ticketForm, setTicketForm]       = useState({ subject: '', message: '', priority: 'medium' });
  const [submitted, setSubmitted]         = useState(false);

  // Filter FAQs by search
  const filteredFaqs = searchQuery.trim()
    ? FAQ_DATA.map((cat) => ({
        ...cat,
        items: cat.items.filter(
          (item) =>
            item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.a.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      })).filter((cat) => cat.items.length > 0)
    : FAQ_DATA;

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    if (!ticketForm.subject.trim() || !ticketForm.message.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setTicketForm({ subject: '', message: '', priority: 'medium' });
    }, 3000);
  };

  const inputStyle = {
    border: '1.5px solid rgba(186,192,149,0.5)',
    background: '#f8f9f4',
    color: '#1a1e0f',
    borderRadius: '0.75rem',
    padding: '0.625rem 0.875rem',
    width: '100%',
    outline: 'none',
    fontSize: '0.875rem',
  };

  const tabs = [
    { id: 'faq', label: 'FAQs', icon: HelpCircle },
    { id: 'guides', label: 'Quick Guides', icon: Book },
    { id: 'contact', label: 'Contact Support', icon: MessageSquare },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Page Header */}
      <div>
        <h1 style={{ color: '#2c3018' }} className="mb-1">Help &amp; Support</h1>
        <p className="text-sm" style={{ color: '#6b7155' }}>
          Find answers, step-by-step guides, and contact our support team
        </p>
      </div>

      {/* Hero Search */}
      <div
        className="p-8 rounded-2xl text-center"
        style={{
          background: 'linear-gradient(135deg, #3D4127 0%, #636B2F 100%)',
          boxShadow: '0 4px 24px rgba(61,65,39,0.2)',
        }}
      >
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(212,222,149,0.15)' }}>
          <HelpCircle className="size-7" style={{ color: '#D4DE95' }} />
        </div>
        <h2 className="mb-2" style={{ color: '#D4DE95' }}>How can we help you?</h2>
        <p className="text-sm mb-6" style={{ color: 'rgba(212,222,149,0.7)' }}>
          Search through our knowledge base or browse guides below
        </p>
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4" style={{ color: '#BAC095' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setActiveSection('faq'); }}
            placeholder="Search FAQs..."
            className="w-full h-12 pl-11 pr-4 text-sm rounded-xl outline-none"
            style={{ background: 'rgba(255,255,255,0.95)', color: '#1a1e0f', border: 'none' }}
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Articles', value: '25+', icon: Book, color: '#636B2F', bg: 'rgba(99,107,47,0.08)' },
          { label: 'FAQ Topics', value: '6', icon: HelpCircle, color: '#2563eb', bg: 'rgba(37,99,235,0.08)' },
          { label: 'Avg Response', value: '< 4h', icon: MessageSquare, color: '#16a34a', bg: 'rgba(22,163,74,0.08)' },
          { label: 'Support Email', value: 'Active', icon: Mail, color: '#9333ea', bg: 'rgba(147,51,234,0.08)' },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-4 flex items-center gap-3"
            style={{ border: '1px solid rgba(99,107,47,0.12)' }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: stat.bg }}>
              <stat.icon className="size-5" style={{ color: stat.color }} />
            </div>
            <div>
              <p className="text-lg" style={{ color: '#1a1e0f', fontWeight: 600 }}>{stat.value}</p>
              <p className="text-xs" style={{ color: '#9aA278' }}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{ border: '1px solid rgba(99,107,47,0.12)', boxShadow: '0 2px 12px rgba(61,65,39,0.05)' }}
      >
        {/* Tabs */}
        <div className="flex" style={{ borderBottom: '1px solid rgba(186,192,149,0.3)' }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className="flex items-center gap-2 px-5 py-4 text-sm transition-all relative"
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
          {/* ─── FAQs ──────────────────────────────────────────────────── */}
          {activeSection === 'faq' && (
            <div>
              {filteredFaqs.length === 0 ? (
                <div className="py-12 text-center">
                  <Search className="size-12 mx-auto mb-3" style={{ color: '#BAC095' }} />
                  <p className="text-sm" style={{ color: '#6b7155' }}>No FAQs match your search</p>
                  <p className="text-xs mt-1" style={{ color: '#9aA278' }}>Try different keywords or browse all sections</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {filteredFaqs.map((cat) => {
                    const CatIcon = cat.icon;
                    return (
                      <div key={cat.category}>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: cat.iconBg }}>
                            <CatIcon className="size-5" style={{ color: cat.color }} />
                          </div>
                          <h3 className="text-sm" style={{ color: '#3D4127' }}>{cat.category}</h3>
                        </div>
                        <div
                          className="rounded-xl overflow-hidden"
                          style={{ border: '1px solid rgba(186,192,149,0.25)', background: '#fafbf7' }}
                        >
                          <div className="px-5">
                            {cat.items.map((item, i) => (
                              <FaqItem key={i} q={item.q} a={item.a} />
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ─── Quick Guides ──────────────────────────────────────────── */}
          {activeSection === 'guides' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm mb-1" style={{ color: '#3D4127' }}>Step-by-Step Guides</h3>
                <p className="text-xs" style={{ color: '#9aA278' }}>Follow these walkthroughs to get things done quickly</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Raising a Complaint',
                    steps: ['Click "Raise Complaint" in the sidebar', 'Fill in title, category & description', 'Set priority (Low / Medium / High)', 'Attach photos (optional)', 'Click Submit'],
                    icon: AlertCircle, color: '#636B2F', bg: 'rgba(99,107,47,0.08)',
                  },
                  {
                    title: 'Paying Maintenance Fees',
                    steps: ['Go to Finance → Maintenance / Payments', 'Note the due amount & UPI ID', 'Transfer via UPI or bank', 'Share screenshot with admin', 'Status updates within 24h'],
                    icon: CreditCard, color: '#16a34a', bg: 'rgba(22,163,74,0.08)',
                  },
                  {
                    title: 'Booking an Amenity',
                    steps: ['Go to Services → Amenity Booking', 'Choose the amenity (Gym, Pool, etc.)', 'Select date & time slot', 'Confirm your booking', 'Wait for admin approval (if required)'],
                    icon: Calendar, color: '#ea580c', bg: 'rgba(234,88,12,0.08)',
                  },
                  {
                    title: 'Adding a Visitor',
                    steps: ['Go to Services → Visitor Log', 'Click "Add Visitor"', 'Enter name, purpose & date', 'Submit the pre-approval', 'Security gate is automatically notified'],
                    icon: UserCheck, color: '#2563eb', bg: 'rgba(37,99,235,0.08)',
                  },
                  {
                    title: 'Updating Your Profile',
                    steps: ['Click your avatar / name (top-right)', 'Select "My Profile"', 'Edit name, phone, or flat number', 'Click "Save Changes"', 'Changes reflect immediately'],
                    icon: FileText, color: '#9333ea', bg: 'rgba(147,51,234,0.08)',
                  },
                  {
                    title: 'Reading Announcements',
                    steps: ['Go to Community → Notices', 'Browse pinned & recent notices', 'Click a notice to read details', 'Enable email/push alerts in Settings', 'New notices show as notifications'],
                    icon: Bell, color: '#6b7155', bg: 'rgba(107,113,85,0.08)',
                  },
                ].map((guide, i) => {
                  const GuideIcon = guide.icon;
                  return (
                    <div
                      key={i}
                      className="bg-white rounded-xl p-5"
                      style={{ border: '1px solid rgba(99,107,47,0.12)' }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: guide.bg }}>
                          <GuideIcon className="size-5" style={{ color: guide.color }} />
                        </div>
                        <h4 className="text-sm" style={{ color: '#1a1e0f', fontWeight: 500 }}>{guide.title}</h4>
                      </div>
                      <ol className="space-y-2">
                        {guide.steps.map((step, si) => (
                          <li key={si} className="flex items-start gap-2.5">
                            <span
                              className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5"
                              style={{ background: guide.bg, color: guide.color, fontWeight: 600, fontSize: '10px' }}
                            >
                              {si + 1}
                            </span>
                            <span className="text-xs leading-relaxed" style={{ color: '#6b7155' }}>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ─── Contact Support ───────────────────────────────────────── */}
          {activeSection === 'contact' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left: Contact Info */}
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm mb-1" style={{ color: '#3D4127' }}>Get in Touch</h3>
                  <p className="text-xs" style={{ color: '#9aA278' }}>
                    Our support team responds within 4 working hours
                  </p>
                </div>

                {[
                  {
                    icon: Mail, label: 'Email Support', value: 'support@societyhub.com',
                    desc: 'For billing, account, and general queries', color: '#636B2F', bg: 'rgba(99,107,47,0.1)', href: 'mailto:support@societyhub.com',
                  },
                  {
                    icon: Phone, label: 'Phone Support', value: '+91 98765 00001',
                    desc: 'Mon–Sat, 9 AM to 6 PM IST', color: '#2563eb', bg: 'rgba(37,99,235,0.1)', href: 'tel:+919876500001',
                  },
                  {
                    icon: MessageSquare, label: 'WhatsApp Business', value: '+91 98765 00002',
                    desc: 'Quick queries via WhatsApp chat', color: '#16a34a', bg: 'rgba(22,163,74,0.1)', href: 'https://wa.me/919876500002',
                  },
                ].map((contact, i) => (
                  <a
                    key={i}
                    href={contact.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-start gap-4 p-4 rounded-xl transition-all block"
                    style={{ border: '1px solid rgba(186,192,149,0.3)', background: '#f8f9f4', textDecoration: 'none' }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(99,107,47,0.3)')}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(186,192,149,0.3)')}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: contact.bg }}>
                      <contact.icon className="size-5" style={{ color: contact.color }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs mb-0.5" style={{ color: '#9aA278' }}>{contact.label}</p>
                      <p className="text-sm" style={{ color: '#1a1e0f', fontWeight: 500 }}>{contact.value}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#9aA278' }}>{contact.desc}</p>
                    </div>
                    <ExternalLink className="size-4 flex-shrink-0 mt-3" style={{ color: '#BAC095' }} />
                  </a>
                ))}

                {/* Society Admin Contact */}
                <div
                  className="p-4 rounded-xl"
                  style={{ background: 'rgba(212,222,149,0.12)', border: '1px solid rgba(186,192,149,0.35)' }}
                >
                  <p className="text-xs mb-3" style={{ color: '#3D4127', fontWeight: 500 }}>Society Admin Contact</p>
                  {[
                    { label: 'Admin', value: 'Jayawant Gore' },
                    { label: 'Phone', value: '+91 98765 43210' },
                    { label: 'Email', value: 'admin@omsaiapartment.com' },
                    { label: 'Office Hours', value: 'Mon–Fri, 10 AM – 5 PM' },
                  ].map((info, i) => (
                    <div key={i} className="flex items-center justify-between py-1.5" style={{ borderBottom: i < 3 ? '1px solid rgba(186,192,149,0.2)' : 'none' }}>
                      <span className="text-xs" style={{ color: '#6b7155' }}>{info.label}</span>
                      <span className="text-xs" style={{ color: '#3D4127' }}>{info.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Support Ticket Form */}
              <div>
                <div className="mb-4">
                  <h3 className="text-sm mb-1" style={{ color: '#3D4127' }}>Submit a Support Ticket</h3>
                  <p className="text-xs" style={{ color: '#9aA278' }}>We'll get back to you within 4 working hours</p>
                </div>

                {submitted ? (
                  <div
                    className="flex flex-col items-center justify-center py-12 rounded-xl"
                    style={{ background: 'rgba(22,163,74,0.06)', border: '1px solid rgba(22,163,74,0.2)' }}
                  >
                    <CheckCircle className="size-12 mb-3" style={{ color: '#16a34a' }} />
                    <p className="text-sm" style={{ color: '#16a34a', fontWeight: 500 }}>Ticket Submitted!</p>
                    <p className="text-xs mt-1" style={{ color: '#6b7155' }}>We'll respond to your query within 4 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleTicketSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm mb-1.5" style={{ color: '#3D4127' }}>Subject</label>
                      <input
                        type="text"
                        value={ticketForm.subject}
                        onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                        placeholder="e.g. Unable to submit complaint"
                        style={inputStyle}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1.5" style={{ color: '#3D4127' }}>Priority</label>
                      <select
                        value={ticketForm.priority}
                        onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                        style={inputStyle}
                      >
                        <option value="low">Low – General enquiry</option>
                        <option value="medium">Medium – Feature or bug</option>
                        <option value="high">High – Urgent / Blocking issue</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm mb-1.5" style={{ color: '#3D4127' }}>Message</label>
                      <textarea
                        value={ticketForm.message}
                        onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
                        placeholder="Describe your issue in detail..."
                        rows={5}
                        style={{ ...inputStyle, resize: 'vertical' }}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm transition-all hover:shadow-lg hover:opacity-90"
                      style={{ background: 'linear-gradient(135deg, #636B2F, #7a8338)' }}
                    >
                      <Send className="size-4" />
                      Submit Ticket
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
