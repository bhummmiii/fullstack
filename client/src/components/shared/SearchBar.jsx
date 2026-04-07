import { Search, X, FileText, Megaphone, Users, AlertCircle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

// ─── Static searchable data (mirrors the app's content) ────────────────────
const SEARCHABLE_ITEMS = [
  // Complaints / Issues
  { id: 's1', type: 'complaint', title: 'Water Leakage – Flat 204', desc: 'Reported 12 Mar 2026 · Status: In Progress', icon: AlertCircle, color: '#636B2F', bg: 'rgba(99,107,47,0.1)' },
  { id: 's2', type: 'complaint', title: 'Lift Malfunction – Block B', desc: 'Reported 10 Mar 2026 · Status: Resolved', icon: AlertCircle, color: '#16a34a', bg: 'rgba(22,163,74,0.1)' },
  { id: 's3', type: 'complaint', title: 'Parking Area Light Issue', desc: 'Reported 5 Mar 2026 · Status: Pending', icon: AlertCircle, color: '#ea580c', bg: 'rgba(234,88,12,0.1)' },
  { id: 's4', type: 'complaint', title: 'Garbage Collection Delay', desc: 'Reported 2 Mar 2026 · Status: Pending', icon: AlertCircle, color: '#ea580c', bg: 'rgba(234,88,12,0.1)' },
  { id: 's5', type: 'complaint', title: 'Broken Staircase Railing – Block A', desc: 'Reported 28 Feb 2026 · Status: In Progress', icon: AlertCircle, color: '#636B2F', bg: 'rgba(99,107,47,0.1)' },

  // Notices / Announcements
  { id: 's6', type: 'notice', title: 'AGM Meeting – 20 Apr 2026', desc: 'All residents are requested to attend the Annual General Meeting', icon: Megaphone, color: '#9333ea', bg: 'rgba(147,51,234,0.1)' },
  { id: 's7', type: 'notice', title: 'Water Supply Interruption', desc: 'Water supply will be off on 15 Apr 2026 from 10 AM to 2 PM', icon: Megaphone, color: '#9333ea', bg: 'rgba(147,51,234,0.1)' },
  { id: 's8', type: 'notice', title: 'Maintenance Fee Reminder', desc: 'March 2026 maintenance due by 31 Mar 2026', icon: Megaphone, color: '#9333ea', bg: 'rgba(147,51,234,0.1)' },
  { id: 's9', type: 'notice', title: 'Society Rules Update', desc: 'Revised society bylaws now in effect. Please read carefully.', icon: Megaphone, color: '#9333ea', bg: 'rgba(147,51,234,0.1)' },

  // Residents
  { id: 's10', type: 'resident', title: 'Jayawant Gore – Flat 101', desc: 'Admin · +91 98765 43210', icon: Users, color: '#2563eb', bg: 'rgba(37,99,235,0.1)' },
  { id: 's11', type: 'resident', title: 'Priya Sharma – Flat 204', desc: 'Resident · +91 99001 22334', icon: Users, color: '#2563eb', bg: 'rgba(37,99,235,0.1)' },
  { id: 's12', type: 'resident', title: 'Ravi Kulkarni – Flat 305', desc: 'Resident · +91 88991 55667', icon: Users, color: '#2563eb', bg: 'rgba(37,99,235,0.1)' },
  { id: 's13', type: 'resident', title: 'Sunita Patel – Flat 102', desc: 'Resident · +91 77882 44556', icon: Users, color: '#2563eb', bg: 'rgba(37,99,235,0.1)' },

  // Documents
  { id: 's14', type: 'document', title: 'Society Registration Certificate', desc: 'PDF · Uploaded Jan 2026', icon: FileText, color: '#ea580c', bg: 'rgba(234,88,12,0.1)' },
  { id: 's15', type: 'document', title: 'NOC from Municipal Corporation', desc: 'PDF · Uploaded Dec 2025', icon: FileText, color: '#ea580c', bg: 'rgba(234,88,12,0.1)' },
];

const TYPE_LABELS = {
  complaint: 'Complaint',
  notice: 'Notice',
  resident: 'Resident',
  document: 'Document',
};

export function SearchBar({ placeholder = 'Search...' }) {
  const [query, setQuery]         = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [results, setResults]     = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const wrapperRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const doSearch = (q) => {
    const term = q.trim().toLowerCase();
    if (!term) { setResults([]); setHasSearched(false); return; }
    const matched = SEARCHABLE_ITEMS.filter(
      (item) =>
        item.title.toLowerCase().includes(term) ||
        item.desc.toLowerCase().includes(term) ||
        TYPE_LABELS[item.type].toLowerCase().includes(term)
    );
    setResults(matched);
    setHasSearched(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      doSearch(query);
      setIsFocused(true);
    }
    if (e.key === 'Escape') {
      setIsFocused(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setHasSearched(false);
  };

  const showDropdown = isFocused && hasSearched;

  return (
    <div
      ref={wrapperRef}
      className={`relative transition-all duration-200 ${isFocused ? 'w-full md:w-96' : 'w-full md:w-56'}`}
    >
      {/* Input */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: isFocused ? '#636B2F' : '#BAC095' }}>
        <Search className="size-4" />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => { setIsFocused(true); if (query.trim()) doSearch(query); }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full h-10 pl-9 pr-8 text-sm rounded-xl transition-all outline-none"
        style={{
          background: isFocused ? '#fff' : '#f8f9f4',
          border: isFocused ? '1.5px solid #636B2F' : '1.5px solid rgba(186,192,149,0.4)',
          color: '#1a1e0f',
          boxShadow: isFocused ? '0 0 0 3px rgba(99,107,47,0.08)' : 'none',
        }}
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
          style={{ color: '#BAC095' }}
        >
          <X className="size-4" />
        </button>
      )}

      {/* Results Dropdown */}
      {showDropdown && (
        <div
          className="absolute top-12 left-0 right-0 bg-white rounded-2xl z-50 shadow-2xl overflow-hidden"
          style={{
            border: '1px solid rgba(99,107,47,0.15)',
            boxShadow: '0 20px 40px rgba(61,65,39,0.15)',
            minWidth: '320px',
          }}
        >
          {/* Header */}
          <div className="px-4 py-2.5 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(186,192,149,0.2)', background: 'rgba(212,222,149,0.06)' }}>
            <p className="text-xs" style={{ color: '#9aA278' }}>
              {results.length} result{results.length !== 1 ? 's' : ''} for &quot;{query.trim()}&quot;
            </p>
            <p className="text-xs" style={{ color: '#BAC095' }}>Press Esc to close</p>
          </div>

          {results.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <Search className="size-10 mx-auto mb-3" style={{ color: '#BAC095' }} />
              <p className="text-sm" style={{ color: '#6b7155' }}>No results found</p>
              <p className="text-xs mt-1" style={{ color: '#9aA278' }}>Try a different keyword</p>
            </div>
          ) : (
            <div className="max-h-72 overflow-y-auto">
              {results.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors"
                    style={{ borderBottom: '1px solid rgba(186,192,149,0.1)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(212,222,149,0.08)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: item.bg }}
                    >
                      <Icon className="size-4" style={{ color: item.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm truncate" style={{ color: '#1a1e0f' }}>{item.title}</p>
                        <span
                          className="text-xs px-1.5 py-0.5 rounded-full flex-shrink-0"
                          style={{ background: item.bg, color: item.color, fontSize: '10px' }}
                        >
                          {TYPE_LABELS[item.type]}
                        </span>
                      </div>
                      <p className="text-xs mt-0.5 truncate" style={{ color: '#9aA278' }}>{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
