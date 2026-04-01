import { TrendingUp, TrendingDown } from 'lucide-react';

export function StatCard({ label, value, icon: Icon, color, subtitle, trend }) {
  const colorClasses = {
    olive: {
      bg: 'rgba(99, 107, 47, 0.1)',
      iconBg: 'rgba(99, 107, 47, 0.15)',
      iconColor: '#636B2F',
      border: 'rgba(99, 107, 47, 0.2)',
      glow: 'rgba(99, 107, 47, 0.08)',
    },
    sage: {
      bg: 'rgba(186, 192, 149, 0.15)',
      iconBg: 'rgba(186, 192, 149, 0.25)',
      iconColor: '#5a6235',
      border: 'rgba(186, 192, 149, 0.35)',
      glow: 'rgba(186, 192, 149, 0.1)',
    },
    lime: {
      bg: 'rgba(212, 222, 149, 0.2)',
      iconBg: 'rgba(212, 222, 149, 0.35)',
      iconColor: '#636B2F',
      border: 'rgba(212, 222, 149, 0.4)',
      glow: 'rgba(212, 222, 149, 0.12)',
    },
    orange: {
      bg: 'rgba(251, 146, 60, 0.08)',
      iconBg: 'rgba(251, 146, 60, 0.12)',
      iconColor: '#ea580c',
      border: 'rgba(251, 146, 60, 0.2)',
      glow: 'rgba(251, 146, 60, 0.05)',
    },
    red: {
      bg: 'rgba(239, 68, 68, 0.07)',
      iconBg: 'rgba(239, 68, 68, 0.12)',
      iconColor: '#dc2626',
      border: 'rgba(239, 68, 68, 0.18)',
      glow: 'rgba(239, 68, 68, 0.05)',
    },
    blue: {
      bg: 'rgba(59, 130, 246, 0.07)',
      iconBg: 'rgba(59, 130, 246, 0.12)',
      iconColor: '#2563eb',
      border: 'rgba(59, 130, 246, 0.18)',
      glow: 'rgba(59, 130, 246, 0.05)',
    },
    green: {
      bg: 'rgba(34, 197, 94, 0.07)',
      iconBg: 'rgba(34, 197, 94, 0.12)',
      iconColor: '#16a34a',
      border: 'rgba(34, 197, 94, 0.18)',
      glow: 'rgba(34, 197, 94, 0.05)',
    },
    purple: {
      bg: 'rgba(168, 85, 247, 0.07)',
      iconBg: 'rgba(168, 85, 247, 0.12)',
      iconColor: '#9333ea',
      border: 'rgba(168, 85, 247, 0.18)',
      glow: 'rgba(168, 85, 247, 0.05)',
    },
  };

  const styles = colorClasses[color];

  return (
    <div
      className="bg-white rounded-xl p-6 transition-all duration-300 hover:-translate-y-0.5 group cursor-default"
      style={{
        border: `1px solid ${styles.border}`,
        boxShadow: `0 1px 3px rgba(0,0,0,0.04), 0 0 0 1px ${styles.border}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 8px 25px ${styles.glow}, 0 0 0 1px ${styles.border}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = `0 1px 3px rgba(0,0,0,0.04), 0 0 0 1px ${styles.border}`;
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
          style={{ background: styles.iconBg }}
        >
          <Icon className="w-6 h-6" style={{ color: styles.iconColor }} />
        </div>
        {trend && (
          <div
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs"
            style={
              trend.isPositive
                ? { background: 'rgba(22,163,74,0.1)', color: '#16a34a' }
                : { background: 'rgba(220,38,38,0.08)', color: '#dc2626' }
            }
          >
            {trend.isPositive ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
            <span>{trend.value}</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-3xl mb-1" style={{ color: '#1a1e0f' }}>{value}</p>
        <p className="text-sm mb-1" style={{ color: '#6b7155' }}>{label}</p>
        {subtitle && <p className="text-xs" style={{ color: '#9aA278' }}>{subtitle}</p>}
      </div>
    </div>
  );
}
