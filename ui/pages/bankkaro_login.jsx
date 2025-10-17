import React, { useState, useEffect } from 'react';
import { CheckCircle, ArrowRight, Shield, Lock } from 'lucide-react';
import Loader from '../components/Loader';
import FeedbackWidget from '../components/FeedbackWidget';

const BankKaroLogin = ({ onNavigate, selectedUser }) => {
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Simulate SSO authentication
    const authenticateUser = async () => {
      try {
        // Simulate SSO token exchange
        const response = await fetch('/api/ck/sso/exchange', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ck_token: 'mock_ck_token_123'
          })
        });

        const data = await response.json();
        
        if (data.success) {
          setUser(data.user);
          setAuthSuccess(true);
          
          console.log('sso_success', {
            bk_user_id: data.bk_user_id,
            ck_user_id: data.user.ck_user_id,
            timestamp: new Date().toISOString()
          });
          
          // Auto-proceed after showing success state
          setTimeout(() => {
            onNavigate('scrub_loading', { selectedUser });
          }, 2000);
        } else {
          console.log('sso_failed', { error: data.error });
          // Handle SSO failure - redirect back or show error
          setTimeout(() => {
            onNavigate('cashkaro_entry');
          }, 2000);
        }
      } catch (error) {
        console.error('SSO authentication failed:', error);
        setTimeout(() => {
          onNavigate('cashkaro_entry');
        }, 2000);
      }
    };

    authenticateUser();
  }, [onNavigate]);

  if (isAuthenticating && !authSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader message="Authenticating with BankKaro..." />
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
            <div className="text-sm text-gray-500">
              Secure Login
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          {authSuccess ? (
            <>
              {/* Success State */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome to BankKaro!
              </h1>
              
              {user && (
                <div className="mb-6">
                  <p className="text-gray-600 mb-2">
                    Hello, <span className="font-semibold">{user.name}</span>
                  </p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              )}

              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center space-x-2 text-blue-800">
                  <Shield className="w-5 h-5" />
                  <span className="font-medium">Secure Authentication Complete</span>
                </div>
                <p className="text-sm text-blue-600 mt-1">
                  Your CashKaro account has been securely linked to BankKaro
                </p>
              </div>

              <p className="text-gray-600 mb-8">
                We're now fetching your personalized loan offers...
              </p>

              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-bankkaro-blue"></div>
              </div>
            </>
          ) : (
            <>
              {/* Authentication State */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-bankkaro-blue rounded-full flex items-center justify-center">
                  <Lock className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Authenticating...
              </h1>
              
              <p className="text-gray-600 mb-8">
                Please wait while we securely authenticate your CashKaro account
              </p>

              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-2 h-2 bg-bankkaro-blue rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">Verifying credentials</span>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <span className="text-sm text-gray-500">Establishing secure connection</span>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <span className="text-sm text-gray-500">Loading your profile</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Security Notice */}
        <div className="mt-8 bg-gray-100 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-gray-600 mt-0.5" />
            <div className="text-sm text-gray-600">
              <p className="font-medium mb-1">Your data is secure</p>
              <p>
                We use bank-grade encryption to protect your information. 
                Your credit score is not impacted by this process.
              </p>
            </div>
          </div>
        </div>
      </div>

      <FeedbackWidget elementId="bankkaro_login" elementType="page" />
    </div>
  );
};

export default BankKaroLogin;
