import React, { useState, useEffect } from 'react';
import { FileText, TrendingUp, Shield, Clock } from 'lucide-react';
import Loader from '../components/Loader';
import Banner from '../components/Banner';
import FeedbackWidget from '../components/FeedbackWidget';

const ScrubLoading = ({ onNavigate, selectedUser }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [scrubResult, setScrubResult] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [errorType, setErrorType] = useState(null);

  const steps = [
    { icon: FileText, text: "Accessing credit bureau", duration: 2000 },
    { icon: TrendingUp, text: "Analyzing credit profile", duration: 2500 },
    { icon: Shield, text: "Evaluating eligibility", duration: 2000 },
    { icon: Clock, text: "Generating offers", duration: 1500 }
  ];

  useEffect(() => {
    const runScrubProcess = async () => {
      // Simulate step-by-step progress
      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(i);
        await new Promise(resolve => setTimeout(resolve, steps[i].duration));
      }

      // Call scrub intake API
      try {
        const response = await fetch('/api/bureau/scrub/intake', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone_number: selectedUser?.phone || '+919876543210'
          })
        });

        const data = await response.json();
        
        if (data.success) {
          setScrubResult(data.data);
          console.log('scrub_success', {
            memberreference: data.data.memberreference,
            score: data.data.score,
            timestamp: new Date().toISOString()
          });
          
          // Navigate to offers
          setTimeout(() => {
            onNavigate('offer_list', { scrubData: data.data, selectedUser });
          }, 1000);
        } else {
          setHasError(true);
          setErrorType(data.error);
          
          console.log('scrub_failed', {
            error: data.error,
            message: data.message,
            timestamp: new Date().toISOString()
          });
          
          if (data.error === 'stale_data') {
            // For stale data, show offers but with stale flag
            setTimeout(() => {
              onNavigate('offer_list', { 
                scrubData: data.data, 
                selectedUser, 
                isStaleData: true,
                staleDays: data.days_old
              });
            }, 3000);
          } else if (data.error === 'no_data') {
            // Show no data banner and proceed to fallback
            setTimeout(() => {
              onNavigate('fallback_form', { errorType: 'no_data', selectedUser });
            }, 3000);
          }
        }
      } catch (error) {
        console.error('Scrub process failed:', error);
        setHasError(true);
        setErrorType('api_error');
        
        setTimeout(() => {
          onNavigate('fallback_form', { errorType: 'api_error', selectedUser });
        }, 3000);
      }
    };

    runScrubProcess();
  }, [onNavigate]);

  const handleRetry = () => {
    setCurrentStep(0);
    setHasError(false);
    setErrorType(null);
    setScrubResult(null);
  };

  if (hasError) {
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

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <FileText className="w-8 h-8 text-red-600" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Unable to Fetch Credit Data
            </h1>
            
            {errorType === 'stale_data' && (
              <Banner
                type="warning"
                message="Your credit bureau data is older than 90 days and needs to be refreshed."
                action="Continue with basic information"
                onAction={() => onNavigate('fallback_form', { errorType: 'stale_data' })}
              />
            )}
            
            {errorType === 'no_data' && (
              <Banner
                type="info"
                message="No credit bureau data found for your phone number. Don't worry, you can still check loan offers using basic information."
                action="Continue with basic information"
                onAction={() => onNavigate('fallback_form', { errorType: 'no_data' })}
              />
            )}
            
            {errorType === 'api_error' && (
              <Banner
                type="error"
                message="We're experiencing technical difficulties. Please try again or continue with basic information."
                action="Try Again"
                onAction={handleRetry}
              />
            )}

            <div className="mt-6 space-y-3">
              <button
                onClick={() => onNavigate('fallback_form', { errorType })}
                className="w-full bg-bankkaro-blue text-white font-semibold py-3 px-6 rounded-lg hover:bg-bankkaro-blue-dark transition-colors"
              >
                Continue with Basic Information
              </button>
              
              <button
                onClick={handleRetry}
                className="w-full bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>

        <FeedbackWidget elementId="scrub_loading_error" elementType="page" />
      </div>
    );
  }

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
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-bankkaro-blue rounded-full flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Fetching Your Eligibility
            </h1>
            
            <p className="text-gray-600">
              We're analyzing your credit profile to find the best loan offers
            </p>
          </div>

          {/* Progress Steps */}
          <div className="space-y-4 mb-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <div
                  key={index}
                  className={`flex items-center space-x-4 p-4 rounded-lg transition-all duration-300 ${
                    isActive ? 'bg-blue-50 border border-blue-200' : 
                    isCompleted ? 'bg-green-50' : 'bg-gray-50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isCompleted ? 'bg-green-500 text-white' :
                    isActive ? 'bg-bankkaro-blue text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1">
                    <p className={`font-medium ${
                      isActive ? 'text-bankkaro-blue' : 
                      isCompleted ? 'text-green-700' : 'text-gray-600'
                    }`}>
                      {step.text}
                    </p>
                    {isActive && (
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div className="bg-bankkaro-blue h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Info */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Secure & Confidential</p>
                <p>
                  Your credit information is accessed securely and will not impact your credit score. 
                  This process typically takes 30-60 seconds.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FeedbackWidget elementId="scrub_loading" elementType="page" />
    </div>
  );
};

export default ScrubLoading;
