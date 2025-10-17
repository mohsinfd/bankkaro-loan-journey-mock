import React, { useState, useEffect } from 'react';
import { ExternalLink, ArrowRight, CheckCircle, Clock } from 'lucide-react';
import FeedbackWidget from '../components/FeedbackWidget';

const OfferRedirect = ({ onNavigate, offer, exitId, redirectUrl }) => {
  const [countdown, setCountdown] = useState(5);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setIsRedirecting(true);
          clearInterval(timer);
          
          // Simulate redirect to lender
          setTimeout(() => {
            console.log('redirect_completed', {
              lender_id: offer.lender_id,
              lender_name: offer.lender_name,
              exit_id: exitId,
              redirect_url: redirectUrl,
              timestamp: new Date().toISOString()
            });
            
            // In a real implementation, this would redirect to the actual lender URL
            alert(`Redirecting to ${offer.lender_name}...\n\nIn a real implementation, you would be redirected to:\n${redirectUrl}`);
          }, 1000);
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [offer, exitId, redirectUrl]);

  const handleManualRedirect = () => {
    setIsRedirecting(true);
    console.log('manual_redirect', {
      lender_id: offer.lender_id,
      lender_name: offer.lender_name,
      exit_id: exitId,
      redirect_url: redirectUrl,
      timestamp: new Date().toISOString()
    });
    
    // In a real implementation, this would redirect to the actual lender URL
    alert(`Redirecting to ${offer.lender_name}...\n\nIn a real implementation, you would be redirected to:\n${redirectUrl}`);
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
            <div className="text-sm text-gray-500">
              Redirecting to {offer?.lender_name}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          {isRedirecting ? (
            <>
              {/* Redirecting State */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <ExternalLink className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Redirecting to {offer?.lender_name}
              </h1>
              
              <p className="text-gray-600 mb-8">
                Please wait while we redirect you to complete your loan application
              </p>

              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bankkaro-blue"></div>
              </div>
            </>
          ) : (
            <>
              {/* Pre-redirect State */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Apply with {offer?.lender_name}
              </h1>
              
              <p className="text-gray-600 mb-8">
                You're about to be redirected to {offer?.lender_name} to complete your loan application
              </p>

              {/* Offer Summary */}
              {offer && (
                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  <h3 className="font-semibold text-gray-900 mb-4">Your Selected Offer</h3>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-sm text-gray-500">Interest Rate</p>
                      <p className="text-2xl font-bold text-bankkaro-blue">{offer.roi}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Max Amount</p>
                      <p className="text-xl font-semibold text-gray-900">
                        ₹{offer.max_amount?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {offer.processing_fee && (
                    <div className="mt-4 text-sm text-gray-600">
                      Processing Fee: ₹{offer.processing_fee.toLocaleString()}
                    </div>
                  )}
                </div>
              )}

              {/* Countdown */}
              <div className="mb-8">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Clock className="w-5 h-5 text-bankkaro-blue" />
                  <span className="text-lg font-medium text-gray-900">
                    Redirecting in {countdown} seconds
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-bankkaro-blue h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${((5 - countdown) / 5) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Manual Redirect Button */}
              <button
                onClick={handleManualRedirect}
                className="inline-flex items-center px-6 py-3 bg-bankkaro-blue text-white font-semibold rounded-lg hover:bg-bankkaro-blue-dark transition-colors"
              >
                Continue to {offer?.lender_name}
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>

              {/* Exit ID */}
              <div className="mt-6 text-xs text-gray-500">
                Exit ID: {exitId}
              </div>
            </>
          )}
        </div>

        {/* Important Notice */}
        <div className="mt-8 bg-blue-50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <ExternalLink className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Important Notice</p>
              <p>
                You are now leaving BankKaro and will be redirected to {offer?.lender_name}'s website. 
                Please review their terms and conditions before proceeding with your loan application.
              </p>
            </div>
          </div>
        </div>
      </div>

      <FeedbackWidget elementId="offer_redirect" elementType="page" />
    </div>
  );
};

export default OfferRedirect;
