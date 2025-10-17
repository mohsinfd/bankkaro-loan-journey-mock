import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Clock, CheckCircle, XCircle, Copy } from 'lucide-react';

const APICallTracker = ({ apiCalls }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCall, setSelectedCall] = useState(null);

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getStatusIcon = (status) => {
    if (status === 'pending') return <Clock className="w-4 h-4 text-yellow-600" />;
    if (status === 'success') return <CheckCircle className="w-4 h-4 text-green-600" />;
    return <XCircle className="w-4 h-4 text-red-600" />;
  };

  const getStatusColor = (status) => {
    if (status === 'pending') return 'text-yellow-700';
    if (status === 'success') return 'text-green-700';
    return 'text-red-700';
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div className="fixed bottom-4 left-4 bg-white border border-gray-200 rounded-lg shadow-lg max-w-md z-50">
      <div 
        className="flex items-center justify-between p-3 cursor-pointer border-b"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="font-medium text-gray-900">API Calls</span>
          <span className="text-sm text-gray-500">({apiCalls?.length || 0})</span>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        )}
      </div>

      {isExpanded && (
        <div className="max-h-96 overflow-y-auto">
          {apiCalls && apiCalls.length > 0 ? (
            <div className="p-3 space-y-3">
              {apiCalls.map((call, index) => (
                <div key={index} className="border rounded-lg p-3 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(call.status)}
                      <span className={`font-medium text-sm ${getStatusColor(call.status)}`}>
                        {call.method} {call.endpoint}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">
                        {formatTimestamp(call.timestamp)}
                      </span>
                      <button
                        onClick={() => setSelectedCall(selectedCall === index ? null : index)}
                        className="text-blue-600 hover:text-blue-800 text-xs"
                      >
                        {selectedCall === index ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-gray-600 mb-2">
                    Duration: {call.duration}ms | Status: {call.statusCode || 'Pending'}
                  </div>

                  {selectedCall === index && (
                    <div className="space-y-3 pt-3 border-t">
                      {/* Request */}
                      {call.request && (
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-xs text-gray-700">Request:</span>
                            <button
                              onClick={() => copyToClipboard(JSON.stringify(call.request, null, 2))}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                          <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                            {JSON.stringify(call.request, null, 2)}
                          </pre>
                        </div>
                      )}

                      {/* Response */}
                      {call.response && (
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-xs text-gray-700">Response:</span>
                            <button
                              onClick={() => copyToClipboard(JSON.stringify(call.response, null, 2))}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                          <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                            {JSON.stringify(call.response, null, 2)}
                          </pre>
                        </div>
                      )}

                      {/* Scenario Context */}
                      {call.scenario && (
                        <div>
                          <span className="font-medium text-xs text-gray-700">Scenario Context:</span>
                          <div className="text-xs text-gray-600 mt-1">
                            {call.scenario}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 text-center text-gray-500 text-sm">
              No API calls yet
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default APICallTracker;
