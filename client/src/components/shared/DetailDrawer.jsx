import { X } from 'lucide-react';



export function DetailDrawer({ isOpen, onClose, title, children, actions }) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="fixed inset-y-0 right-0 w-full sm:w-[500px] lg:w-[600px] bg-white shadow-2xl z-50 flex flex-col"
        style={{ borderLeft: '1px solid rgba(99,107,47,0.12)' }}
      >
        {/* Header */}
        <div
          className="px-6 py-5 flex items-center justify-between flex-shrink-0"
          style={{
            borderBottom: '1px solid rgba(186,192,149,0.3)',
            background: 'linear-gradient(135deg, #f8f9f4, #fff)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-1 h-6 rounded-full"
              style={{ background: 'linear-gradient(to bottom, #636B2F, #BAC095)' }}
            />
            <h2 style={{ color: '#3D4127' }}>{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl transition-all"
            style={{ color: '#9aA278' }}
            onMouseEnter={(e) => {
              (e.currentTarget).style.background = 'rgba(186,192,149,0.2)';
              (e.currentTarget).style.color = '#3D4127';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget).style.background = 'transparent';
              (e.currentTarget).style.color = '#9aA278';
            }}
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>

        {/* Actions */}
        {actions && (
          <div
            className="px-6 py-4 flex gap-3 flex-shrink-0"
            style={{ borderTop: '1px solid rgba(186,192,149,0.25)', background: '#f8f9f4' }}
          >
            {actions}
          </div>
        )}
      </div>
    </>
  );
}
