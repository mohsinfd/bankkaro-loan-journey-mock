import React, { useState, useEffect } from 'react';
import { ArrowRight, RefreshCw, TrendingUp, Info, Star, CheckCircle } from 'lucide-react';
import OfferCard from '../components/OfferCard';
import Banner from '../components/Banner';
import Loader from '../components/Loader';
import FeedbackWidget from '../components/FeedbackWidget';
import BREDebugPanel from '../components/BREDebugPanel';
import APICallTracker from '../components/APICallTracker';
import DataFlowVisualizer from '../components/DataFlowVisualizer';

const OfferList = ({ onNavigate, scrubData, fallbackData, isFallback = false, selectedUser, isStaleData = false, staleDays = 0 }) => {
  const [offers, setOffers] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiCalls, setApiCalls] = useState([]);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const requestBody = scrubData ? { scrub_data: scrubData } : { fallback_data: fallbackData };
        
        // Track API call
        const startTime = Date.now();
        const apiCall = {
          endpoint: '/api/offers/prequal',
          method: 'POST',
          request: requestBody,
          timestamp: new Date().toISOString(),
          status: 'pending'
        };
        setApiCalls(prev => [...prev, apiCall]);
        
        const response = await fetch('/api/offers/prequal', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        const duration = Date.now() - startTime;
        
        // Update API call with response
        const updatedApiCall = {
          ...apiCall,
          status: 'success',
          statusCode: response.status,
          response: data,
          duration: duration
        };
        setApiCalls(prev => prev.map(call => call.timestamp === apiCall.timestamp ? updatedApiCall : call));
        
        if (data.success) {
          setOffers(data.data);
          
          console.log('offers_generated', {
            total_offers: data.data.offers.length,
            eligible_offers: data.data.summary.total_eligible,
            preapproved_offers: data.data.summary.total_preapproved,
            is_fallback: isFallback,
            scenario: selectedUser?.scenario,
            timestamp: new Date().toISOString()
          });
          
          setIsLoading(false);
        } else {
          setError(data.error);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Failed to fetch offers:', error);
        setError('Failed to fetch offers');
        setIsLoading(false);
        
        // Update API call with error
        setApiCalls(prev => prev.map(call => 
          call.status === 'pending' 
            ? { ...call, status: 'error', statusCode: 500, duration: Date.now() - new Date(call.timestamp).getTime() }
            : call
        ));
      }
    };

    fetchOffers();
  }, [scrubData, fallbackData, isFallback, selectedUser]);

  const handleOfferClick = (offer) => {
    const exitId = `EX${Date.now()}`;
    const redirectUrl = `/redirect?exit_id=${exitId}&lender=${offer.lender_id}`;
    
    console.log('offer_redirect', {
      lender_id: offer.lender_id,
      lender_name: offer.lender_name,
      exit_id: exitId,
      redirect_url: redirectUrl,
      timestamp: new Date().toISOString()
    });
    
    onNavigate('offer_redirect', { 
      offer, 
      exitId, 
      redirectUrl 
    });
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setError(null);
    // Trigger re-evaluation
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader message="Generating your personalized loan offers..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-red-600" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Unable to Generate Offers
            </h1>
            
            <p className="text-gray-600 mb-8">
              We encountered an error while generating your loan offers. Please try again.
            </p>

            <button
              onClick={handleRefresh}
              className="bg-bankkaro-blue text-white font-semibold py-3 px-6 rounded-lg hover:bg-bankkaro-blue-dark transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const paOffers = offers?.offers?.filter(offer => offer.preapproved) || [];
  const pqOffers = offers?.offers?.filter(offer => offer.eligible && !offer.preapproved) || [];
  const ineligibleOffers = offers?.offers?.filter(offer => !offer.eligible && !offer.preapproved) || [];

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
            <button
              onClick={handleRefresh}
              className="flex items-center space-x-2 text-bankkaro-blue hover:text-bankkaro-blue-dark transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Banner */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Your Loan Offers
              </h1>
              <p className="text-gray-600">
                {isFallback 
                  ? 'Based on basic information provided' 
                  : 'Based on your credit profile analysis'
                }
              </p>
            </div>
            
            {offers?.summary && (
              <div className="text-right">
                <div className="text-3xl font-bold text-bankkaro-blue">
                  {offers.summary.total_eligible + offers.summary.total_preapproved}
                </div>
                <div className="text-sm text-gray-500">
                  Available Offers
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {offers.summary.total_preapproved} PA + {offers.summary.total_eligible} PQ
                </div>
              </div>
            )}
          </div>

          {/* Best Offer Highlight */}
          {offers?.summary?.best_offer && (
            <div className="mt-4 bg-green-50 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">Best Offer:</span>
                <span className="text-green-700">
                  {offers.summary.best_offer.lender} - {offers.summary.best_offer.roi}% interest rate
                </span>
              </div>
            </div>
          )}

          {/* Validity Notice */}
          <div className="mt-4 flex items-center space-x-2 text-sm text-gray-600">
            <Info className="w-4 h-4" />
            <span>Offers valid for {offers?.summary?.validity_days || 90} days</span>
          </div>
        </div>

        {/* Fallback Notice */}
        {isFallback && (
          <Banner
            type="warning"
            message="Limited offers available based on basic information. For more accurate offers, ensure your credit bureau data is up to date."
          />
        )}

        {/* Stale Data Notice */}
        {isStaleData && (
          <Banner
            type="warning"
            message={`Credit bureau data is ${staleDays} days old (last updated: ${scrubData?.process_date}). Offers are displayed but may not be current.`}
            action="Request Fresh Data"
            onAction={() => {
              console.log('refresh_requested', {
                phone: selectedUser?.phone,
                stale_days: staleDays,
                timestamp: new Date().toISOString()
              });
              // In a real implementation, this would trigger a fresh scrub
              alert('Fresh data request submitted. This would trigger a new bureau pull in production.');
            }}
          />
        )}

        {/* Pre-Approved Offers */}
        {paOffers.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-600" />
              Pre-Approved Offers ({paOffers.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paOffers.map((offer, index) => (
                <OfferCard
                  key={offer.lender_id}
                  offer={offer}
                  onClick={handleOfferClick}
                  showTooltip={true}
                  isStale={isStaleData}
                />
              ))}
            </div>
          </div>
        )}

        {/* Pre-Qualified Offers */}
        {pqOffers.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
              Pre-Qualified Offers ({pqOffers.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pqOffers.map((offer, index) => (
                <OfferCard
                  key={offer.lender_id}
                  offer={offer}
                  onClick={handleOfferClick}
                  showTooltip={true}
                  isStale={isStaleData}
                />
              ))}
            </div>
          </div>
        )}

        {/* No Eligible Offers */}
        {(paOffers.length + pqOffers.length) === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              No Offers Available Right Now
            </h2>
            
            <p className="text-gray-600 mb-6">
              Based on your current profile, we couldn't find any eligible loan offers. 
              Don't worry, you can improve your eligibility and try again later.
            </p>

            <div className="space-y-3">
              <button
                onClick={handleRefresh}
                className="bg-bankkaro-blue text-white font-semibold py-3 px-6 rounded-lg hover:bg-bankkaro-blue-dark transition-colors"
              >
                Try Again
              </button>
              
              <button
                onClick={() => onNavigate('fallback_form')}
                className="block w-full bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Update Information
              </button>
            </div>
          </div>
        )}

        {/* Ineligible Offers (for reference) */}
        {ineligibleOffers.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Other Lenders ({ineligibleOffers.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ineligibleOffers.map((offer, index) => (
                <OfferCard
                  key={offer.lender_id}
                  offer={offer}
                  showTooltip={false}
                />
              ))}
            </div>
          </div>
        )}

        {/* EMI Calculator */}
        {offers?.summary?.estimated_emi_50k_36m && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              EMI Calculator
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-500">Loan Amount</p>
                <p className="text-xl font-bold text-gray-900">₹50,000</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tenure</p>
                <p className="text-xl font-bold text-gray-900">36 Months</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Estimated EMI</p>
                <p className="text-xl font-bold text-bankkaro-blue">
                  ₹{offers.summary.estimated_emi_50k_36m.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Debug Panels */}
      {offers && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          {/* BRE Debug Panel */}
          <BREDebugPanel 
            breEvaluation={offers} 
            scrubData={scrubData}
            selectedUser={selectedUser}
          />

          {/* Data Flow Visualizer */}
          <DataFlowVisualizer 
            currentStep="offer_display"
            selectedUser={selectedUser}
            dataFlow={{
              'cashkaro_entry': ['User selection', 'Scenario chosen'],
              'bankkaro_login': ['SSO token exchange', 'User authenticated'],
              'scrub_loading': ['Bureau data fetched', 'Derived fields calculated'],
              'bre_evaluation': ['BRE gates evaluated', 'PA checks performed'],
              'offer_display': ['Offers sorted and displayed', 'PA/PQ separation applied']
            }}
          />
        </div>
      )}

      {/* API Call Tracker */}
      <APICallTracker apiCalls={apiCalls} />

      <FeedbackWidget elementId="offer_list" elementType="page" />
    </div>
  );
};

export default OfferList;
