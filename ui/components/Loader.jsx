import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ message = "Loading...", size = "default" }) => {
  const sizeClasses = {
    small: "w-4 h-4",
    default: "w-8 h-8",
    large: "w-12 h-12"
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-bankkaro-blue`} />
      <p className="text-gray-600 text-center font-medium">{message}</p>
      {message.includes('eligibility') && (
        <div className="text-sm text-gray-500 text-center max-w-sm">
          We're analyzing your credit profile to find the best loan offers for you
        </div>
      )}
    </div>
  );
};

export default Loader;
