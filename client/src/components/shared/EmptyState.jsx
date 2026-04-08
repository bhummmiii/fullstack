export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="bg-white rounded-2xl p-14 text-center" style={{ border: '1px solid rgba(186,192,149,0.2)', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
      <div className="flex justify-center mb-5">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ background: 'rgba(186,192,149,0.12)' }}
        >
          <Icon className="w-7 h-7" style={{ color: '#BAC095' }} />
        </div>
      </div>
      <h3 className="mb-2" style={{ color: '#2c3018', fontSize: '1rem', fontWeight: 600 }}>{title}</h3>
      <p className="mb-6 max-w-md mx-auto" style={{ color: '#8a9268', fontSize: '0.8125rem', lineHeight: 1.6 }}>{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-5 py-2.5 rounded-xl text-white transition-all hover:shadow-md hover:opacity-90"
          style={{
            background: 'linear-gradient(135deg, #636B2F, #7a8338)',
            fontSize: '0.8125rem',
            fontWeight: 500,
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
