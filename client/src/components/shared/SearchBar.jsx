import { Search, X } from 'lucide-react';
import { useState } from 'react';



export function SearchBar({ placeholder = 'Search...', onSearch }) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (value) => {
    setQuery(value);
    onSearch?.(value);
  };

  const handleClear = () => {
    setQuery('');
    onSearch?.('');
  };

  return (
    <div className={`relative transition-all duration-200 ${isFocused ? 'w-full md:w-80' : 'w-full md:w-56'}`}>
      <div className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: isFocused ? '#636B2F' : '#BAC095' }}>
        <Search className="size-4" />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
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
    </div>
  );
}
