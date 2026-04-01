import { AlertTriangle, X } from 'lucide-react';
import { Button } from '../ui/button';



export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'info',
}) {
  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: 'text-red-600',
          bg: 'bg-red-50',
          button: 'bg-red-600 hover:bg-red-700',
        };
      case 'warning':
        return {
          icon: 'text-orange-600',
          bg: 'bg-orange-50',
          button: 'bg-orange-600 hover:bg-orange-700',
        };
      default:
        return {
          icon: 'text-blue-600',
          bg: 'bg-blue-50',
          button: 'bg-blue-600 hover:bg-blue-700',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="p-6 pb-4">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="size-5" />
          </button>
          <div className={`w-12 h-12 ${styles.bg} rounded-xl flex items-center justify-center mb-4`}>
            <AlertTriangle className={`size-6 ${styles.icon}`} />
          </div>
          <h3 className="text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600">{message}</p>
        </div>

        {/* Actions */}
        <div className="p-6 pt-4 flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            {cancelText}
          </Button>
          <Button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 text-white ${styles.button}`}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
