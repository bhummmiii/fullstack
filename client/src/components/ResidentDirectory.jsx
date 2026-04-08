import { useState, useEffect, useCallback } from 'react';
import { Search, Mail, Phone, Home, Users, Building2, RefreshCw, AlertCircle } from 'lucide-react';
import { residentsApi } from '../services/api';





export function ResidentDirectory({ userRole, currentUser }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterBlock, setFilterBlock] = useState('all');
  const [residents, setResidents]     = useState([]);
  const [isLoading, setIsLoading]     = useState(true);
  const [error, setError]             = useState('');

  // 200 ms debounce so filtering doesn't run on every keystroke
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 200);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const fetchResidents = useCallback(async () => {
    setIsLoading(true); setError('');
    try {
      const res = await residentsApi.getAll();
      setResidents(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load residents');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchResidents(); }, [fetchResidents]);

  // Client-side filter using the debounced search value
  const filteredResidents = residents.filter(r => {
    const q = debouncedSearch.toLowerCase();
    const matchesSearch =
      !q ||
      r.name.toLowerCase().includes(q) ||
      r.flatNumber.toLowerCase().includes(q) ||
      (r.email || '').toLowerCase().includes(q);
    const block = r.flatNumber ? r.flatNumber.charAt(0) : '';
    const matchesBlock = filterBlock === 'all' || block === filterBlock;
    return matchesSearch && matchesBlock;
  });

  const getInitials = (name) =>
    name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

  // Deterministic avatar color per resident
  const avatarColors = [
    { bg: 'rgba(99,107,47,0.15)', color: '#636B2F' },
    { bg: 'rgba(168,85,247,0.1)', color: '#9333ea' },
    { bg: 'rgba(22,163,74,0.1)', color: '#16a34a' },
    { bg: 'rgba(59,130,246,0.1)', color: '#2563eb' },
    { bg: 'rgba(234,88,12,0.1)', color: '#ea580c' },
    { bg: 'rgba(220,38,38,0.1)', color: '#dc2626' },
  ];

  const blockFilters = [
    { key: 'all', label: 'All Blocks' },
    { key: 'A', label: 'Block A' },
    { key: 'B', label: 'Block B' },
    { key: 'C', label: 'Block C' },
    { key: 'D', label: 'Block D' },
    { key: 'E', label: 'Block E' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ color: '#2c3018' }} className="mb-1">Resident Directory</h1>
          <p style={{ color: '#8a9268', fontSize: '0.8125rem' }}>Contact information for all society residents</p>
        </div>
        <button onClick={fetchResidents} className="p-2 rounded-xl" style={{ background: 'rgba(99,107,47,0.08)', color: '#636B2F' }}>
          <RefreshCw className="size-4" />
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)' }}>
          <AlertCircle className="size-5 text-red-600 shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
          <button onClick={fetchResidents} className="ml-auto text-sm text-red-600 underline">Retry</button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Residents', value: residents.length, icon: Home,     bg: 'rgba(99,107,47,0.1)',  color: '#636B2F', iconBg: 'rgba(99,107,47,0.15)'  },
          { label: 'Showing',         value: filteredResidents.length, icon: Users, bg: 'rgba(22,163,74,0.08)', color: '#16a34a', iconBg: 'rgba(22,163,74,0.12)' },
          { label: 'Admins',          value: residents.filter(r => r.role === 'admin').length, icon: Building2, bg: 'rgba(168,85,247,0.08)', color: '#9333ea', iconBg: 'rgba(168,85,247,0.12)' },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-5 flex items-center gap-4 transition-all hover:shadow-md hover:-translate-y-0.5"
            style={{ border: '1px solid rgba(99,107,47,0.08)', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: stat.iconBg }}
            >
              <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
            </div>
            <div>
              <p className="text-2xl" style={{ color: '#1a1e0f' }}>{stat.value}</p>
              <p className="text-sm" style={{ color: '#6b7155' }}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filter */}
      <div
        className="bg-white rounded-2xl p-4"
        style={{ border: '1px solid rgba(99,107,47,0.08)', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#BAC095' }} />
            <input
              type="text"
              placeholder="Search by name, flat number, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{
                border: '1.5px solid rgba(186,192,149,0.4)',
                background: '#f8f9f4',
                color: '#1a1e0f',
              }}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {blockFilters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilterBlock(f.key)}
                className="px-4 py-2.5 rounded-xl text-sm transition-all"
                style={
                  filterBlock === f.key
                    ? { background: '#636B2F', color: '#fff', boxShadow: '0 2px 8px rgba(99,107,47,0.3)' }
                    : { background: 'rgba(186,192,149,0.15)', color: '#3D4127' }
                }
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Residents Grid */}
      {filteredResidents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResidents.map((resident, idx) => {
            const aCfg = avatarColors[idx % avatarColors.length];
            return (
              <div
                key={resident.id}
                className="bg-white rounded-2xl p-5 transition-all hover:-translate-y-0.5 cursor-pointer"
                style={{ border: '1px solid rgba(99,107,47,0.08)', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(99,107,47,0.1)';
                  e.currentTarget.style.borderColor = 'rgba(99,107,47,0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '';
                  e.currentTarget.style.borderColor = 'rgba(99,107,47,0.12)';
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
                    style={{ background: aCfg.bg, color: aCfg.color }}
                  >
                    {getInitials(resident.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm truncate" style={{ color: '#1a1e0f' }}>{resident.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(99,107,47,0.1)', color: '#636B2F' }}
                      >
                        Flat {resident.flatNumber}
                      </span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={
                          resident.role === 'owner'
                            ? { background: 'rgba(22,163,74,0.1)', color: '#16a34a' }
                            : { background: 'rgba(59,130,246,0.1)', color: '#2563eb' }
                        }
                      >
                        {resident.role.charAt(0).toUpperCase() + resident.role.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5 text-sm" style={{ color: '#6b7155' }}>
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(186,192,149,0.2)' }}
                    >
                      <Mail className="w-3.5 h-3.5" style={{ color: '#636B2F' }} />
                    </div>
                    <span className="truncate text-xs">{resident.email}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm" style={{ color: '#6b7155' }}>
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(186,192,149,0.2)' }}
                    >
                      <Phone className="w-3.5 h-3.5" style={{ color: '#636B2F' }} />
                    </div>
                    <span className="text-xs">{resident.phone}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          className="bg-white rounded-xl p-16 text-center"
          style={{ border: '1px solid rgba(186,192,149,0.3)' }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'rgba(186,192,149,0.2)' }}
          >
            <Users className="size-8" style={{ color: '#BAC095' }} />
          </div>
          {debouncedSearch ? (
            <>
              <p className="mb-1" style={{ color: '#3D4127' }}>No results for "{debouncedSearch}"</p>
              <p className="text-sm" style={{ color: '#6b7155' }}>Try a different name, flat number, or email</p>
            </>
          ) : (
            <p style={{ color: '#6b7155' }}>No residents found matching your search criteria.</p>
          )}
        </div>
      )}

      {filteredResidents.length > 0 && (
        <div className="text-center">
          <p className="text-sm" style={{ color: '#9aA278' }}>
            Showing {filteredResidents.length} of {residents.length} residents
          </p>
        </div>
      )}
    </div>
  );
}
