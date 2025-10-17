import React, { useState } from 'react';
import { ArrowRight, Info, AlertTriangle } from 'lucide-react';
import Banner from '../components/Banner';
import FeedbackWidget from '../components/FeedbackWidget';

const FallbackForm = ({ onNavigate, errorType, selectedUser }) => {
  const [formData, setFormData] = useState({
    income: '',
    employment_type: 'Salaried',
    pincode: '',
    age: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const employmentTypes = [
    { value: 'Salaried', label: 'Salaried Employee' },
    { value: 'Self-Employed', label: 'Self-Employed' },
    { value: 'Business', label: 'Business Owner' },
    { value: 'Professional', label: 'Professional' }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.income || formData.income < 15000) {
      newErrors.income = 'Monthly income must be at least ₹15,000';
    }
    
    if (!formData.pincode || formData.pincode.length !== 6) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
    }
    
    if (!formData.age || formData.age < 18 || formData.age > 70) {
      newErrors.age = 'Age must be between 18 and 70 years';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Process fallback data
      const response = await fetch('/api/offers/fallback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('fallback_data_submitted', {
          income: formData.income,
          employment_type: formData.employment_type,
          pincode: formData.pincode,
          age: formData.age,
          timestamp: new Date().toISOString()
        });
        
        // Navigate to offers with fallback data
        onNavigate('offer_list', { 
          fallbackData: data.fallback_data,
          isFallback: true,
          selectedUser
        });
      } else {
        console.error('Fallback data submission failed:', data.error);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Fallback form submission failed:', error);
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-bankkaro-blue rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">BK</span>
              </div>
              <span className="text-xl font-bold text-gray-900">BankKaro</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Tell Us About Yourself
            </h1>
            
            <p className="text-gray-600">
              Help us find the best loan offers by providing some basic information
            </p>
          </div>

          {/* Error Banner */}
          {errorType && (
            <div className="mb-6">
              {errorType === 'stale_data' && (
                <Banner
                  type="warning"
                  message="Your credit bureau data is older than 90 days. Please provide updated information to get accurate loan offers."
                />
              )}
              
              {errorType === 'no_data' && (
                <Banner
                  type="info"
                  message="No credit bureau data found. Don't worry, we can still help you find loan offers based on basic information."
                />
              )}
              
              {errorType === 'api_error' && (
                <Banner
                  type="error"
                  message="We're experiencing technical difficulties. Please provide your information to continue."
                />
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Monthly Income */}
            <div>
              <label htmlFor="income" className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Income *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                <input
                  type="number"
                  id="income"
                  value={formData.income}
                  onChange={(e) => handleInputChange('income', e.target.value)}
                  className={`w-full pl-8 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-bankkaro-blue focus:border-transparent ${
                    errors.income ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="50000"
                  min="15000"
                />
              </div>
              {errors.income && (
                <p className="mt-1 text-sm text-red-600">{errors.income}</p>
              )}
            </div>

            {/* Employment Type */}
            <div>
              <label htmlFor="employment_type" className="block text-sm font-medium text-gray-700 mb-2">
                Employment Type *
              </label>
              <select
                id="employment_type"
                value={formData.employment_type}
                onChange={(e) => handleInputChange('employment_type', e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bankkaro-blue focus:border-transparent"
              >
                {employmentTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Pincode */}
            <div>
              <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-2">
                Pincode *
              </label>
              <input
                type="text"
                id="pincode"
                value={formData.pincode}
                onChange={(e) => handleInputChange('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-bankkaro-blue focus:border-transparent ${
                  errors.pincode ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="122002"
                maxLength="6"
              />
              {errors.pincode && (
                <p className="mt-1 text-sm text-red-600">{errors.pincode}</p>
              )}
            </div>

            {/* Age */}
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                Age *
              </label>
              <input
                type="number"
                id="age"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-bankkaro-blue focus:border-transparent ${
                  errors.age ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="28"
                min="18"
                max="70"
              />
              {errors.age && (
                <p className="mt-1 text-sm text-red-600">{errors.age}</p>
              )}
            </div>

            {/* Info Banner */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Limited Offers Available</p>
                  <p>
                    Based on basic information, you'll see fewer loan options. 
                    For more accurate offers, ensure your credit bureau data is up to date.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-bankkaro-blue text-white font-semibold py-3 px-6 rounded-lg hover:bg-bankkaro-blue-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Finding Offers...
                </>
              ) : (
                <>
                  Find My Loan Offers
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-4">
            By submitting this form, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>

      <FeedbackWidget elementId="fallback_form" elementType="page" />
    </div>
  );
};

export default FallbackForm;
