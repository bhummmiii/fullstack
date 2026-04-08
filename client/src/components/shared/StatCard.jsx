import { TrendingUp, TrendingDown } from 'lucide-react';

export function StatCard({ label, value, icon: Icon, color, subtitle, trend }) {
  const colorClasses = {
    olive: {
      bg: 'rgba(99, 107, 47, 0.06)',
      iconBg: 'rgba(99, 107, 47, 0.1)',
      iconColor: '#636B2F',
      border: 'rgba(99, 107, 47, 0.1)',
      glow: 'rgba(99, 107, 47, 0.06)',
    },
    sage: {
      bg: 'rgba(186, 192, 149, 0.08)',
      iconBg: 'rgba(186, 192, 149, 0.15)',
      iconColor: '#5a6235',
      border: 'rgba(186, 192, 149, 0.2)',
      glow: 'rgba(186, 192, 149, 0.08)',
    },
    lime: {
      bg: 'rgba(212, 222, 149, 0.1)',
      iconBg: 'rgba(212, 222, 149, 0.2)',
      iconColor: '#636B2F',
      border: 'rgba(212, 222, 149, 0.25)',
      glow: 'rgba(212, 222, 149, 0.1)',
    },
    orange: {
      bg: 'rgba(251, 146, 60, 0.05)',
      iconBg: 'rgba(251, 146, 60, 0.08)',
      iconColor: '#ea580c',
      border: 'rgba(251, 146, 60, 0.12)',
      glow: 'rgba(251, 146, 60, 0.04)',
    },
    red: {
      bg: 'rgba(239, 68, 68, 0.04)',
      iconBg: 'rgba(239, 68, 68, 0.08)',
      iconColor: '#dc2626',
      border: 'rgba(239, 68, 68, 0.1)',
      glow: 'rgba(239, 68, 68, 0.04)',
    },
    blue: {
      bg: 'rgba(59, 130, 246, 0.04)',
      iconBg: 'rgba(59, 130, 246, 0.08)',
      iconColor: '#2563eb',
      border: 'rgba(59, 130, 246, 0.1)',
      glow: 'rgba(59, 130, 246, 0.04)',
    },
    green: {
      bg: 'rgba(34, 197, 94, 0.04)',
      iconBg: 'rgba(34, 197, 94, 0.08)',
      iconColor: '#16a34a',
      border: 'rgba(34, 197, 94, 0.1)',
      glow: 'rgba(34, 197, 94, 0.04)',
    },
    purple: {
      bg: 'rgba(168, 85, 247, 0.04)',
      iconBg: 'rgba(168, 85, 247, 0.08)',
      iconColor: '#9333ea',
      border: 'rgba(168, 85, 247, 0.1)',
      glow: 'rgba(168, 85, 247, 0.04)',
    },
  };

  const styles = colorClasses[color];

  return (
    <div
      className="bg-white rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 group cursor-default"
      style={{
        border: `1px solid ${styles.border}`,
        boxShadow: '0 1px 3px rgba(0,0,0,0.03), 0 1px 2px rgba(0,0,0,0.02)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 8px 24px ${styles.glow}, 0 2px 6px rgba(0,0,0,0.03)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.03), 0 1px 2px rgba(0,0,0,0.02)';
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
          style={{ background: styles.iconBg }}
        >
          <Icon className="w-5 h-5" style={{ color: styles.iconColor }} />
        </div>
        {trend && (
          <div
            className="flex items-center gap-1 px-2 py-1 rounded-full text-xs"
            style={
              trend.isPositive
                ? { background: 'rgba(22,163,74,0.08)', color: '#16a34a' }
                : { background: 'rgba(220,38,38,0.06)', color: '#dc2626' }
            }
          >
            {trend.isPositive ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
            <span style={{ fontSize: '0.6875rem', fontWeight: 500 }}>{trend.value}</span>
          </div>
        )}
      </div>
      <div>
        <p className="mb-1" style={{ color: '#1a1e0f', fontSize: '1.625rem', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.2 }}>{value}</p>
        <p className="mb-0.5" style={{ color: '#6b7155', fontSize: '0.8125rem', fontWeight: 400 }}>{label}</p>
        {subtitle && <p style={{ color: '#9aA278', fontSize: '0.6875rem' }}>{subtitle}</p>}
      </div>
    </div>
  );
}
