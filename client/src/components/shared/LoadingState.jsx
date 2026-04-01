import { Loader2 } from 'lucide-react';



export function LoadingState({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-12">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
      <p className="text-gray-600">{message}</p>
    </div>
  );
}

export function LoadingOverlay({ message = 'Loading...' }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 flex flex-col items-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-900">{message}</p>
      </div>
    </div>
  );
}
