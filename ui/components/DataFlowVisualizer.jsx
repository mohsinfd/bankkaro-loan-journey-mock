import React from 'react';
import { ArrowRight, Database, Users, CreditCard, CheckCircle, Clock } from 'lucide-react';

const DataFlowVisualizer = ({ currentStep, dataFlow, selectedUser }) => {
  const steps = [
    {
      id: 'cashkaro_entry',
      name: 'CashKaro Entry',
      icon: Users,
      description: 'User selects loan offers CTA'
    },
    {
      id: 'bankkaro_login',
      name: 'BankKaro SSO',
      icon: Database,
      description: 'SSO token exchange'
    },
    {
      id: 'scrub_loading',
      name: 'Scrub Intake',
      icon: Database,
      description: 'Fetch bureau data'
    },
    {
      id: 'bre_evaluation',
      name: 'BRE Evaluation',
      icon: CreditCard,
      description: 'Apply business rules'
    },
    {
      id: 'offer_display',
      name: 'Offer Display',
      icon: CheckCircle,
      description: 'Show eligible offers'
    }
  ];

  const getStepIcon = (step, index) => {
    const Icon = step.icon;
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    
    if (index < currentIndex) {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    } else if (index === currentIndex) {
      return <Clock className="w-5 h-5 text-blue-600 animate-pulse" />;
    } else {
      return <Icon className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStepColor = (step, index) => {
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    
    if (index < currentIndex) {
      return 'text-green-700 bg-green-50 border-green-200';
    } else if (index === currentIndex) {
      return 'text-blue-700 bg-blue-50 border-blue-200';
    } else {
      return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Data Flow Visualization
        <span className="ml-2 text-sm font-normal text-gray-600">
          (Section 4: Data Flow)
        </span>
      </h3>

      {/* Current User Context */}
      {selectedUser && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="text-sm">
            <span className="font-medium text-blue-900">Current User:</span>
            <span className="ml-2 text-blue-700">{selectedUser.name}</span>
            <span className="ml-2 text-blue-600">({selectedUser.scenario})</span>
          </div>
        </div>
      )}

      {/* Flow Steps */}
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center space-x-3">
            {/* Step Icon */}
            <div className="flex-shrink-0">
              {getStepIcon(step, index)}
            </div>

            {/* Step Content */}
            <div className={`flex-1 p-3 rounded-lg border ${getStepColor(step, index)}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{step.name}</h4>
                  <p className="text-sm opacity-75">{step.description}</p>
                </div>
                {index === steps.findIndex(s => s.id === currentStep) && (
                  <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                    Current
                  </span>
                )}
              </div>

              {/* Data Flow Info */}
              {dataFlow && dataFlow[step.id] && (
                <div className="mt-2 pt-2 border-t border-current opacity-50">
                  <div className="text-xs space-y-1">
                    {dataFlow[step.id].map((info, infoIndex) => (
                      <div key={infoIndex} className="flex items-center space-x-2">
                        <Database className="w-3 h-3" />
                        <span>{info}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Arrow */}
            {index < steps.length - 1 && (
              <div className="flex-shrink-0">
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Data Sources */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-2">Data Sources</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
            <Database className="w-3 h-3 text-gray-600" />
            <span>Scrub Base</span>
          </div>
          <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
            <Database className="w-3 h-3 text-gray-600" />
            <span>BRE Config</span>
          </div>
          <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
            <Database className="w-3 h-3 text-gray-600" />
            <span>PA Dataset</span>
          </div>
          <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
            <Database className="w-3 h-3 text-gray-600" />
            <span>User Cache</span>
          </div>
        </div>
      </div>

      {/* Next Expected API */}
      {currentStep && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="font-medium text-gray-900 mb-2">Next Expected API Call</h4>
          <div className="text-sm text-gray-600">
            {currentStep === 'cashkaro_entry' && 'POST /api/ck/sso/exchange'}
            {currentStep === 'bankkaro_login' && 'POST /api/bureau/scrub/intake'}
            {currentStep === 'scrub_loading' && 'POST /api/offers/prequal'}
            {currentStep === 'bre_evaluation' && 'User interaction - offer selection'}
            {currentStep === 'offer_display' && 'POST /api/offers/redirect (on click)'}
          </div>
        </div>
      )}
    </div>
  );
};

export default DataFlowVisualizer;
