import React, { useState } from 'react';
import { CheckCircle, XCircle, Info, ExternalLink, Star } from 'lucide-react';

const OfferCard = ({ offer, onClick, showTooltip = true, isStale = false }) => {
  const [showFeedback, setShowFeedback] = useState(false);

  const handleClick = () => {
    if (offer.eligible) {
      console.log('offer_click', {
        lender_id: offer.lender_id,
        lender_name: offer.lender_name,
        roi: offer.roi,
        max_amount: offer.max_amount,
        timestamp: new Date().toISOString()
      });
      onClick?.(offer);
    }
  };

  const handleFeedbackClick = (e) => {
    e.stopPropagation();
    setShowFeedback(!showFeedback);
  };

  return (
    <div 
      className={`relative bg-white rounded-lg border-2 p-6 shadow-sm transition-all duration-200 ${
        isStale 
          ? 'border-gray-300 opacity-60 cursor-not-allowed bg-gray-50'
          : offer.eligible 
            ? 'border-bankkaro-blue hover:border-bankkaro-blue-dark hover:shadow-md cursor-pointer' 
            : 'border-gray-200 opacity-75 cursor-not-allowed'
      }`}
      onClick={handleClick}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
            style={{ backgroundColor: offer.color }}
          >
            {offer.lender_name.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{offer.lender_name}</h3>
            <div className="flex items-center space-x-2">
              {offer.preapproved ? (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  <Star className="w-3 h-3 mr-1" />
                  {offer.badge}
                </span>
              ) : offer.eligible ? (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {offer.badge}
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  <XCircle className="w-3 h-3 mr-1" />
                  {offer.badge}
                </span>
              )}
              {offer.approval_probability && offer.eligible && (
                <span className="text-xs text-gray-500">
                  {offer.approval_probability}% approval chance
                </span>
              )}
            </div>
          </div>
        </div>
        
        <button
          onClick={handleFeedbackClick}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          title="Provide feedback"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>

      {(offer.eligible || offer.preapproved) ? (
        <>
          {/* Offer Details */}
          <div className="grid grid-cols-2 gap-4 mb-4">
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

          {/* Features */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {offer.features?.slice(0, 3).map((feature, index) => (
                <span 
                  key={index}
                  className={`inline-flex items-center px-2 py-1 rounded-md text-xs ${
                    offer.preapproved 
                      ? 'bg-yellow-50 text-yellow-700' 
                      : 'bg-blue-50 text-blue-700'
                  }`}
                >
                  <Star className="w-3 h-3 mr-1" />
                  {feature}
                </span>
              ))}
            </div>
          </div>

          {/* PA Override Notice */}
          {offer.preapproved && (
            <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">Pre-Approved Offer</span>
              </div>
              <p className="text-xs text-yellow-700 mt-1">
                This offer bypasses standard BRE evaluation and is guaranteed approval
              </p>
            </div>
          )}

          {/* Processing Fee */}
          {offer.processing_fee && (
            <div className="text-sm text-gray-600 mb-4">
              Processing Fee: ₹{offer.processing_fee.toLocaleString()}
            </div>
          )}

          {/* CTA */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {offer.tenure_available?.length} tenure options
            </span>
            <div className="flex items-center text-bankkaro-blue font-medium">
              Apply Now
              <ExternalLink className="w-4 h-4 ml-1" />
            </div>
          </div>
        </>
      ) : (
        /* Ineligible State */
        <div className="text-center py-4">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-2" />
          <p className="text-gray-600 font-medium">{offer.reason}</p>
          <p className="text-sm text-gray-500 mt-1">
            Try other lenders or improve your credit profile
          </p>
        </div>
      )}

      {/* Tooltip */}
      {showTooltip && offer.eligible && !isStale && (
        <div className="absolute -top-2 -right-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
          Valid for 90 days
        </div>
      )}

      {/* Stale Data Indicator */}
      {isStale && (
        <div className="absolute -top-2 -right-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
          Stale Data
        </div>
      )}

      {/* Feedback Widget */}
      {showFeedback && (
        <div className="absolute top-2 right-2 bg-white border border-gray-200 rounded-lg p-3 shadow-lg z-10 w-64">
          <h4 className="font-medium text-sm mb-2">Feedback on this offer</h4>
          <textarea
            className="w-full p-2 border border-gray-300 rounded text-sm resize-none"
            rows="3"
            placeholder="What do you think about this offer?"
          />
          <div className="flex justify-end space-x-2 mt-2">
            <button 
              className="text-sm text-gray-500 hover:text-gray-700"
              onClick={(e) => {
                e.stopPropagation();
                setShowFeedback(false);
              }}
            >
              Cancel
            </button>
            <button 
              className="text-sm bg-bankkaro-blue text-white px-3 py-1 rounded hover:bg-bankkaro-blue-dark"
              onClick={(e) => {
                e.stopPropagation();
                console.log('feedback_submitted', {
                  lender_id: offer.lender_id,
                  feedback: 'User feedback submitted',
                  timestamp: new Date().toISOString()
                });
                setShowFeedback(false);
              }}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfferCard;
