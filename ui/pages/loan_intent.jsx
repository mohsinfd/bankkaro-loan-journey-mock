import React, { useState, useEffect } from 'react';
import { ArrowRight, Calculator, Info, TrendingUp } from 'lucide-react';
import FeedbackWidget from '../components/FeedbackWidget';

const LoanIntent = ({ onNavigate, scrubData, selectedUser }) => {
  const [desiredAmount, setDesiredAmount] = useState('');
  const [desiredTenure, setDesiredTenure] = useState('36');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Calculate default amount based on income (12 months * income, capped at ₹5L)
  const defaultAmount = Math.min(scrubData?.income_monthly * 12, 500000);
  
  // Available tenure options
  const tenureOptions = [
    { value: '12', label: '12 months' },
    { value: '24', label: '24 months' },
    { value: '36', label: '36 months' },
    { value: '48', label: '48 months' },
    { value: '60', label: '60 months' }
  ];

  useEffect(() => {
    // Pre-fill default amount
    if (desiredAmount === '' && defaultAmount) {
      setDesiredAmount(Math.round(defaultAmount).toString());
    }
  }, [defaultAmount, desiredAmount]);

  const validateInputs = () => {
    const newErrors = {};
    
    if (!desiredAmount || desiredAmount <= 0) {
      newErrors.amount = 'Please enter a valid loan amount';
    } else if (desiredAmount < 10000) {
      newErrors.amount = 'Minimum loan amount is ₹10,000';
    } else if (desiredAmount > 5000000) {
      newErrors.amount = 'Maximum loan amount is ₹50,00,000';
    }
    
    if (!desiredTenure) {
      newErrors.tenure = 'Please select a loan tenure';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateInputs()) return;
    
    setIsLoading(true);
    
    // Log user intent
    console.log('loan_intent_submitted', {
      user_id: selectedUser?.id,
      scenario: selectedUser?.scenario,
      desired_amount: parseInt(desiredAmount),
      desired_tenure: parseInt(desiredTenure),
      income_monthly: scrubData?.income_monthly,
      score: scrubData?.score,
      timestamp: new Date().toISOString()
    });

    // Simulate processing delay
    setTimeout(() => {
      onNavigate('offer_list', {
        scrubData: {
          ...scrubData,
          desired_amount: parseInt(desiredAmount),
          desired_tenure_months: parseInt(desiredTenure)
        },
        selectedUser
      });
      setIsLoading(false);
    }, 1000);
  };

  const calculateEMI = (amount, tenure, rate = 15) => {
    const monthlyRate = rate / (12 * 100);
    const emi = (amount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
                (Math.pow(1 + monthlyRate, tenure) - 1);
    return Math.round(emi);
  };

  const estimatedEMI = desiredAmount && desiredTenure ? 
    calculateEMI(parseInt(desiredAmount), parseInt(desiredTenure)) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Loan Requirements</h1>
              <p className="text-gray-600 mt-1">
                Tell us your loan preferences to get personalized offers
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Scenario</div>
              <div className="font-medium text-gray-900">{selectedUser?.scenario}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Profile Summary */}
        {scrubData && (
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Info className="w-5 h-5 mr-2 text-blue-600" />
              Your Profile Summary
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-gray-500">Monthly Income</div>
                <div className="font-medium text-gray-900">₹{scrubData.income_monthly?.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Credit Score</div>
                <div className="font-medium text-gray-900">{scrubData.score || 'NTC'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Risk Band</div>
                <div className="font-medium text-gray-900">{scrubData.risk_band}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Data Freshness</div>
                <div className="font-medium text-gray-900">
                  {scrubData.freshness_ok ? `${scrubData.days_since_process} days` : 'Stale'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loan Intent Form */}
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Calculator className="w-5 h-5 mr-2 text-green-600" />
            What loan do you need?
          </h2>

          <div className="space-y-6">
            {/* Loan Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Desired Loan Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                <input
                  type="number"
                  value={desiredAmount}
                  onChange={(e) => setDesiredAmount(e.target.value)}
                  className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-bankkaro-blue focus:border-transparent ${
                    errors.amount ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter loan amount"
                  min="10000"
                  max="5000000"
                  step="1000"
                />
              </div>
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Suggested: ₹{Math.round(defaultAmount).toLocaleString()} (12x your monthly income)
              </p>
            </div>

            {/* Loan Tenure */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loan Tenure
              </label>
              <select
                value={desiredTenure}
                onChange={(e) => setDesiredTenure(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-bankkaro-blue focus:border-transparent ${
                  errors.tenure ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                {tenureOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.tenure && (
                <p className="mt-1 text-sm text-red-600">{errors.tenure}</p>
              )}
            </div>

            {/* EMI Calculator */}
            {estimatedEMI > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-green-800">Estimated EMI</span>
                </div>
                <div className="text-2xl font-bold text-green-900">₹{estimatedEMI.toLocaleString()}</div>
                <p className="text-xs text-green-700 mt-1">
                  Based on ₹{desiredAmount} for {desiredTenure} months at ~15% interest rate
                </p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-bankkaro-blue hover:bg-bankkaro-blue-dark text-white px-8 py-3 rounded-lg font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Finding Offers...</span>
                </>
              ) : (
                <>
                  <span>Get Personalized Offers</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-sm font-medium text-blue-900 mb-2">How we use this information</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• We'll match your requirements with lender criteria</li>
            <li>• Amount and tenure preferences help us show relevant offers</li>
            <li>• You can modify these preferences later to see different options</li>
            <li>• All offers are subject to final lender approval and verification</li>
          </ul>
        </div>
      </div>

      <FeedbackWidget elementId="loan_intent" elementType="page" />
    </div>
  );
};

export default LoanIntent;
