import { CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react';

export function StatusBadge({ status, label, icon = true, size = 'md', color }) {
  const defaultColors = {
    success: 'bg-green-50 text-green-700',
    pending: 'bg-orange-50 text-orange-700',
    warning: 'bg-yellow-50 text-yellow-700',
    error: 'bg-red-50 text-red-700',
    info: 'bg-blue-50 text-blue-700',
  };

  const defaultIcons = {
    success: CheckCircle,
    pending: Clock,
    warning: AlertCircle,
    error: XCircle,
    info: Clock,
  };

  const sizes = {
    sm: 'text-[0.6875rem] px-2.5 py-1',
    md: 'text-xs px-3 py-1.5',
    lg: 'text-[0.8125rem] px-4 py-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  // Use custom color if provided, otherwise use status-based color
  const colorClass = color || (status ? defaultColors[status] : 'bg-gray-50 text-gray-700');

  // Determine icon to render
  let iconElement = null;
  if (icon === true && status) {
    const IconComponent = defaultIcons[status];
    iconElement = <IconComponent className={iconSizes[size]} />;
  } else if (icon && typeof icon !== 'boolean') {
    iconElement = icon;
  }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${colorClass} ${sizes[size]}`}
      style={{ letterSpacing: '0.01em' }}
    >
      {iconElement}
      {label}
    </span>
  );
}
