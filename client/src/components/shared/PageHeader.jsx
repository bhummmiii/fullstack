


export function PageHeader({ title, description, actions }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 style={{ color: '#2c3018', fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-0.025em' }} className="mb-1">{title}</h1>
        {description && <p style={{ color: '#8a9268', fontSize: '0.8125rem' }}>{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}
