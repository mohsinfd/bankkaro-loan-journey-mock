import React from 'react';
import { AlertTriangle, RefreshCw, Info, X } from 'lucide-react';

const Banner = ({ type = 'info', message, action, onClose, onAction }) => {
  const typeStyles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    success: 'bg-green-50 border-green-200 text-green-800'
  };

  const icons = {
    info: Info,
    warning: AlertTriangle,
    error: AlertTriangle,
    success: RefreshCw
  };

  const Icon = icons[type];

  return (
    <div className={`border rounded-lg p-4 mb-6 ${typeStyles[type]}`}>
      <div className="flex items-start">
        <Icon className={`w-5 h-5 mt-0.5 mr-3 flex-shrink-0 ${
          type === 'warning' ? 'text-yellow-600' : 
          type === 'error' ? 'text-red-600' : 
          type === 'success' ? 'text-green-600' : 'text-blue-600'
        }`} />
        
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
          {action && (
            <button
              onClick={onAction}
              className="mt-2 text-sm font-medium underline hover:no-underline"
            >
              {action}
            </button>
          )}
        </div>
        
        {onClose && (
          <button
            onClick={onClose}
            className="ml-3 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Banner;
