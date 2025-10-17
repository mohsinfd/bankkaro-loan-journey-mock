import React, { useState } from 'react';
import { ArrowRight, CreditCard, Shield, Clock, Star } from 'lucide-react';
import FeedbackWidget from '../components/FeedbackWidget';
import usersMock from '../data/users_mock.json';

const CashKaroEntry = ({ onNavigate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(usersMock[0]);

  const handleCheckOffers = async () => {
    setIsLoading(true);
    
    // Simulate navigation delay
    setTimeout(() => {
      console.log('cashkaro_cta_clicked', {
        timestamp: new Date().toISOString(),
        source: 'cashkaro_store_page',
        selected_user: selectedUser
      });
      onNavigate('bankkaro_login', { selectedUser });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-cashkaro-orange rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CK</span>
              </div>
              <span className="text-xl font-bold text-gray-900">CashKaro</span>
            </div>
            <div className="text-sm text-gray-500">
              Powered by BankKaro
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Get Instant Loan Offers
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Check your pre-qualified loan offers from top lenders in just 2 minutes. 
            No impact on your credit score.
          </p>
        </div>

        {/* Store Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[
            { name: 'Amazon', discount: '5% Cashback', icon: '🛒' },
            { name: 'Flipkart', discount: '3% Cashback', icon: '📱' },
            { name: 'Myntra', discount: '4% Cashback', icon: '👕' }
          ].map((store, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="text-3xl mb-3">{store.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{store.name}</h3>
                <p className="text-cashkaro-orange font-medium">{store.discount}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-bankkaro-blue rounded-full flex items-center justify-center">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Check Your Loan Offers
            </h2>
            
            <p className="text-gray-600 mb-8">
              See personalized loan offers from multiple lenders based on your credit profile. 
              Completely free and takes less than 2 minutes.
            </p>

            {/* User Scenario Selector */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Select User Scenario (PRD Demo)
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-center">
                  <select
                    value={selectedUser.id}
                    onChange={(e) => {
                      const user = usersMock.find(u => u.id === e.target.value);
                      setSelectedUser(user);
                    }}
                    className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bankkaro-blue focus:border-transparent"
                  >
                    {usersMock.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.scenario} - {user.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Selected User Preview */}
                <div className="bg-white rounded-lg p-3 border">
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
                      <span className="text-gray-500">Score:</span>
                      <span className="ml-2 font-medium">{selectedUser.preview.score}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Income:</span>
                      <span className="ml-2 font-medium">₹{selectedUser.preview.income?.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-600">
                    {selectedUser.description}
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <Shield className="w-4 h-4 text-green-500" />
                <span>No Credit Score Impact</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4 text-blue-500" />
                <span>2 Minute Process</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>Top Lenders</span>
              </div>
            </div>

            <button
              onClick={handleCheckOffers}
              disabled={isLoading}
              className="inline-flex items-center px-8 py-4 bg-bankkaro-blue text-white font-semibold rounded-lg hover:bg-bankkaro-blue-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Checking Offers...
                </>
              ) : (
                <>
                  Check Your Loan Offers
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 mt-4">
              By clicking above, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 mb-4">Trusted by 1M+ users</p>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            <div className="text-sm font-medium text-gray-600">Fibe</div>
            <div className="text-sm font-medium text-gray-600">L&T Finance</div>
            <div className="text-sm font-medium text-gray-600">HDFC Bank</div>
            <div className="text-sm font-medium text-gray-600">Bajaj Finserv</div>
          </div>
        </div>
      </div>

      <FeedbackWidget elementId="cashkaro_entry" elementType="page" />
    </div>
  );
};

export default CashKaroEntry;
