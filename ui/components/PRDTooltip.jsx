import React, { useState } from 'react';
import { Info, ExternalLink } from 'lucide-react';

const PRDTooltip = ({ section, description, expectedBehavior, dataSource, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  const prdSections = {
    '3A': 'Section 3A: Fresh Scrub → PQ Passed',
    '3B': 'Section 3B: Fresh Scrub → PQ Failed',
    '3C': 'Section 3C: No Scrub Found',
    '3D': 'Section 3D: Stale Scrub (>90d)',
    '3E': 'Section 3E: PA Match Found',
    '3F': 'Section 3F: Mixed PA + PQ',
    '4.1': 'Section 4.1: /bureau/scrub/intake',
    '4.2': 'Section 4.2: /offers/prequal',
    '5.1': 'Section 5.1: BRE Inputs',
    '5.2': 'Section 5.2: BRE Evaluation Flow',
    '5.3': 'Section 5.3: BRE Output Schema',
    '6.1': 'Section 6.1: User has ≥1 Eligible Lender',
    '6.2': 'Section 6.2: User has 0 Eligible Lenders',
    '6.3': 'Section 6.3: Pre-Approved Flag',
    '7.0': 'Section 7.0: Scrubbed Base Table',
    '7.1': 'Section 7.1: scrub_cache',
    '7.2': 'Section 7.2: prequal_offer_cache',
    '8': 'Section 8: Edge Cases & System Behavior',
    '9': 'Section 9: Analytics & Events',
    '10': 'Section 10: Compliance'
  };

  return (
    <div className="relative inline-block">
      {children}
      <button
        className="ml-1 inline-flex items-center justify-center w-4 h-4 text-blue-600 hover:text-blue-800 transition-colors"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
      >
        <Info className="w-3 h-3" />
      </button>

      {isVisible && (
        <div className="absolute z-50 w-80 p-3 bg-white border border-gray-200 rounded-lg shadow-lg top-6 left-0">
          <div className="space-y-2">
            {/* PRD Section */}
            <div className="flex items-center space-x-2">
              <ExternalLink className="w-3 h-3 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                {prdSections[section] || `Section ${section}`}
              </span>
            </div>

            {/* Description */}
            {description && (
              <div>
                <span className="text-xs font-medium text-gray-700">Description:</span>
                <p className="text-xs text-gray-600 mt-1">{description}</p>
              </div>
            )}

            {/* Expected Behavior */}
            {expectedBehavior && (
              <div>
                <span className="text-xs font-medium text-gray-700">Expected Behavior:</span>
                <p className="text-xs text-gray-600 mt-1">{expectedBehavior}</p>
              </div>
            )}

            {/* Data Source */}
            {dataSource && (
              <div>
                <span className="text-xs font-medium text-gray-700">Data Source:</span>
                <p className="text-xs text-gray-600 mt-1">{dataSource}</p>
              </div>
            )}

            {/* System State */}
            <div>
              <span className="text-xs font-medium text-gray-700">System State:</span>
              <div className="text-xs text-gray-600 mt-1">
                {section?.startsWith('3') && 'User Journey State'}
                {section?.startsWith('4') && 'API Endpoint'}
                {section?.startsWith('5') && 'BRE Logic'}
                {section?.startsWith('6') && 'Post-BRE Scenario'}
                {section?.startsWith('7') && 'Data Table'}
                {section === '8' && 'Edge Case Handling'}
                {section === '9' && 'Analytics Event'}
                {section === '10' && 'Compliance Rule'}
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="absolute -top-1 left-4 w-2 h-2 bg-white border-l border-t border-gray-200 transform rotate-45"></div>
        </div>
      )}
    </div>
  );
};

export default PRDTooltip;
