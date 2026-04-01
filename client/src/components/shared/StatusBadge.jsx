import { CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react';



export function StatusBadge({ status, label, icon = true, size = 'md', color }) {
  const defaultColors = {
    success: 'bg-green-100 text-green-700',
    pending: 'bg-orange-100 text-orange-700',
    warning: 'bg-yellow-100 text-yellow-700',
    error: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
  };

  const defaultIcons= {
    success: CheckCircle,
    pending: Clock,
    warning: AlertCircle,
    error: XCircle,
    info: Clock,
  };

  const sizes = {
    sm: 'text-xs px-2 py-1',
    md: 'text-xs px-3 py-1',
    lg: 'text-sm px-4 py-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  // Use custom color if provided, otherwise use status-based color
  const colorClass = color || (status ? defaultColors[status] : 'bg-gray-100 text-gray-700');

  // Determine icon to render
  let iconElement= null;
  if (icon === true && status) {
    const IconComponent = defaultIcons[status];
    iconElement = <IconComponent className={iconSizes[size]} />;
  } else if (icon && typeof icon !== 'boolean') {
    iconElement = icon;
  }

  return (
    <span className={`inline-flex items-center gap-1 rounded-full ${colorClass} ${sizes[size]}`}>
      {iconElement}
      {label}
    </span>
  );
}
