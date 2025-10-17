import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle, XCircle, Info } from 'lucide-react';

const BREDebugPanel = ({ breEvaluation, scrubData, selectedUser }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedLender, setSelectedLender] = useState(null);

  if (!breEvaluation) return null;

  const calculateDerivedFields = (data) => {
    if (!data) return {};
    
    const processDate = new Date(data.process_date);
    const daysSinceProcess = Math.floor((Date.now() - processDate.getTime()) / (1000 * 60 * 60 * 24));
    const freshnessOk = daysSinceProcess <= 90;
    
    let riskBand = 'Below 600';
    if (data.score >= 750) riskBand = '750+';
    else if (data.score >= 700) riskBand = '700-749';
    else if (data.score >= 650) riskBand = '650-699';
    else if (data.score >= 600) riskBand = '600-649';
    
    const foirCurrent = data.loan_amount ? (data.loan_amount / (data.income * 12)) : 0;
    
    return {
      risk_band: riskBand,
      foir_current: foirCurrent,
      freshness_ok: freshnessOk,
      days_since_process: daysSinceProcess
    };
  };

  const derivedFields = calculateDerivedFields(scrubData);

  const getGateIcon = (passed) => {
    return passed ? (
      <CheckCircle className="w-4 h-4 text-green-600" />
    ) : (
      <XCircle className="w-4 h-4 text-red-600" />
    );
  };

  const getGateColor = (passed) => {
    return passed ? 'text-green-700' : 'text-red-700';
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-6">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Info className="w-5 h-5 mr-2 text-blue-600" />
          BRE Evaluation Debug Panel
          <span className="ml-2 text-sm font-normal text-gray-600">
            (Section 5.2: BRE Evaluation Flow)
          </span>
        </h3>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-6">
          {/* Selected User Info */}
          {selectedUser && (
            <div className="bg-white rounded-lg p-4 border">
              <h4 className="font-medium text-gray-900 mb-2">Selected User Profile</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Name:</span>
                  <span className="ml-2 font-medium">{selectedUser.name}</span>
                </div>
                <div>
                  <span className="text-gray-500">Phone:</span>
                  <span className="ml-2 font-medium">{selectedUser.phone}</span>
                </div>
                <div>
                  <span className="text-gray-500">Scenario:</span>
                  <span className="ml-2 font-medium">{selectedUser.scenario}</span>
                </div>
                <div>
                  <span className="text-gray-500">Cohort:</span>
                  <span className="ml-2 font-medium">{selectedUser.cohort}</span>
                </div>
              </div>
            </div>
          )}

          {/* Input Data */}
          {scrubData && (
            <div className="bg-white rounded-lg p-4 border">
              <h4 className="font-medium text-gray-900 mb-3">Input Data (Scrub Fields)</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Score:</span>
                  <span className="ml-2 font-medium">{scrubData.score}</span>
                </div>
                <div>
                  <span className="text-gray-500">Income:</span>
                  <span className="ml-2 font-medium">₹{scrubData.income?.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-500">DPD (12M):</span>
                  <span className="ml-2 font-medium">{scrubData.dpd_l12m}</span>
                </div>
                <div>
                  <span className="text-gray-500">Enquiries (3M):</span>
                  <span className="ml-2 font-medium">{scrubData.total_enquiries_3m}</span>
                </div>
                <div>
                  <span className="text-gray-500">Process Date:</span>
                  <span className="ml-2 font-medium">{scrubData.process_date}</span>
                </div>
                <div>
                  <span className="text-gray-500">Employment:</span>
                  <span className="ml-2 font-medium">{scrubData.employment_type}</span>
                </div>
                <div>
                  <span className="text-gray-500">City:</span>
                  <span className="ml-2 font-medium">{scrubData.city}</span>
                </div>
                <div>
                  <span className="text-gray-500">Age:</span>
                  <span className="ml-2 font-medium">{scrubData.age}</span>
                </div>
              </div>
            </div>
          )}

          {/* Derived Fields */}
          <div className="bg-white rounded-lg p-4 border">
            <h4 className="font-medium text-gray-900 mb-3">Derived Fields (System Calculated)</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Risk Band:</span>
                <span className="ml-2 font-medium">{derivedFields.risk_band}</span>
              </div>
              <div>
                <span className="text-gray-500">FOIR Current:</span>
                <span className="ml-2 font-medium">{(derivedFields.foir_current * 100).toFixed(1)}%</span>
              </div>
              <div>
                <span className="text-gray-500">Freshness OK:</span>
                <span className="ml-2 font-medium flex items-center">
                  {getGateIcon(derivedFields.freshness_ok)}
                  <span className="ml-1">{derivedFields.freshness_ok ? 'Yes' : 'No'}</span>
                </span>
              </div>
              <div>
                <span className="text-gray-500">Days Since Process:</span>
                <span className="ml-2 font-medium">{derivedFields.days_since_process}</span>
              </div>
            </div>
          </div>

          {/* Lender Evaluation Table */}
          <div className="bg-white rounded-lg p-4 border">
            <h4 className="font-medium text-gray-900 mb-3">Lender Evaluation Results</h4>
            <div className="space-y-3">
              {breEvaluation.lenders?.map((lender) => (
                <div key={lender.lender_id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900">{lender.lender_name}</h5>
                    <div className="flex items-center space-x-2">
                      {lender.preapproved && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Pre-Approved
                        </span>
                      )}
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        lender.eligible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {lender.eligible ? 'Eligible' : 'Not Eligible'}
                      </span>
                      <button
                        onClick={() => setSelectedLender(selectedLender === lender.lender_id ? null : lender.lender_id)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        {selectedLender === lender.lender_id ? 'Hide Details' : 'Show Details'}
                      </button>
                    </div>
                  </div>

                  {selectedLender === lender.lender_id && (
                    <div className="mt-3 pt-3 border-t">
                      <h6 className="font-medium text-gray-700 mb-2">BRE Gate Evaluation:</h6>
                      <div className="space-y-2">
                        {lender.gates?.map((gate, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2">
                              {getGateIcon(gate.passed)}
                              <span className={getGateColor(gate.passed)}>{gate.name}</span>
                            </div>
                            <div className="text-gray-600">
                              {gate.description}
                            </div>
                          </div>
                        ))}
                      </div>

                      {lender.reason_codes && lender.reason_codes.length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <h6 className="font-medium text-red-700 mb-2">Failure Reasons:</h6>
                          <div className="space-y-1">
                            {lender.reason_codes.map((reason, index) => (
                              <div key={index} className="text-sm text-red-600">
                                • {reason}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {lender.preapproved && (
                        <div className="mt-3 pt-3 border-t">
                          <h6 className="font-medium text-yellow-700 mb-2">PA Override Applied:</h6>
                          <div className="text-sm text-yellow-600">
                            Pre-approved offer bypasses BRE evaluation steps 2-7
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">Evaluation Summary</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <div>• Total Lenders Evaluated: {breEvaluation.lenders?.length || 0}</div>
              <div>• Eligible Lenders: {breEvaluation.lenders?.filter(l => l.eligible).length || 0}</div>
              <div>• Pre-Approved Offers: {breEvaluation.lenders?.filter(l => l.preapproved).length || 0}</div>
              <div>• Evaluation Method: {scrubData ? 'Full BRE' : 'Fallback Rules'}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BREDebugPanel;
