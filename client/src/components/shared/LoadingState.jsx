import { Loader2 } from 'lucide-react';

export function LoadingState({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-12">
      <div
        className="w-7 h-7 border-2 rounded-full animate-spin mb-4"
        style={{ borderColor: 'rgba(99,107,47,0.15)', borderTopColor: '#636B2F' }}
      />
      <p style={{ color: '#6b7155', fontSize: '0.8125rem' }}>{message}</p>
    </div>
  );
}

export function LoadingOverlay({ message = 'Loading...' }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 flex flex-col items-center" style={{ boxShadow: '0 16px 40px rgba(0,0,0,0.12)' }}>
        <div
          className="w-8 h-8 border-2 rounded-full animate-spin mb-4"
          style={{ borderColor: 'rgba(99,107,47,0.15)', borderTopColor: '#636B2F' }}
        />
        <p style={{ color: '#2c3018', fontSize: '0.8125rem', fontWeight: 500 }}>{message}</p>
      </div>
    </div>
  );
}
