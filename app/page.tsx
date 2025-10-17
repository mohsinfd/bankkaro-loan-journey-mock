'use client';

import React, { useState } from 'react';
import CashKaroEntry from '@/ui/pages/cashkaro_entry';
import BankKaroLogin from '@/ui/pages/bankkaro_login';
import ScrubLoading from '@/ui/pages/scrub_loading';
import OfferList from '@/ui/pages/offer_list';
import FallbackForm from '@/ui/pages/fallback_form';
import OfferRedirect from '@/ui/pages/offer_redirect';

type PageState = 
  | 'cashkaro_entry'
  | 'bankkaro_login'
  | 'scrub_loading'
  | 'offer_list'
  | 'fallback_form'
  | 'offer_redirect';

type PageData = {
  scrubData?: any;
  fallbackData?: any;
  isFallback?: boolean;
  errorType?: string;
  offer?: any;
  exitId?: string;
  redirectUrl?: string;
  selectedUser?: any;
  isStaleData?: boolean;
  staleDays?: number;
};

export default function Home() {
  const [currentPage, setCurrentPage] = useState<PageState>('cashkaro_entry');
  const [pageData, setPageData] = useState<PageData>({});

  const navigate = (page: PageState, data: PageData = {}) => {
    console.log('navigation', {
      from: currentPage,
      to: page,
      data: data,
      timestamp: new Date().toISOString()
    });
    
    setCurrentPage(page);
    setPageData(data);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'cashkaro_entry':
        return <CashKaroEntry onNavigate={navigate} />;
      
      case 'bankkaro_login':
        return <BankKaroLogin onNavigate={navigate} selectedUser={pageData.selectedUser} />;
      
      case 'scrub_loading':
        return <ScrubLoading onNavigate={navigate} selectedUser={pageData.selectedUser} />;
      
      case 'offer_list':
        return (
          <OfferList
            onNavigate={navigate}
            scrubData={pageData.scrubData}
            fallbackData={pageData.fallbackData}
            isFallback={pageData.isFallback}
            selectedUser={pageData.selectedUser}
            isStaleData={pageData.isStaleData}
            staleDays={pageData.staleDays}
          />
        );
      
      case 'fallback_form':
        return (
          <FallbackForm
            onNavigate={navigate}
            errorType={pageData.errorType}
            selectedUser={pageData.selectedUser}
          />
        );
      
      case 'offer_redirect':
        return (
          <OfferRedirect
            onNavigate={navigate}
            offer={pageData.offer}
            exitId={pageData.exitId}
            redirectUrl={pageData.redirectUrl}
          />
        );
      
      default:
        return <CashKaroEntry onNavigate={navigate} />;
    }
  };

  return (
    <main className="min-h-screen">
      {renderCurrentPage()}
      
      {/* Debug Panel (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 bg-black bg-opacity-80 text-white p-3 rounded-lg text-xs max-w-xs">
          <div className="font-bold mb-2">Debug Info:</div>
          <div>Current Page: {currentPage}</div>
          <div>Data Keys: {Object.keys(pageData).join(', ') || 'none'}</div>
          <div className="mt-2 space-y-1">
            <button
              onClick={() => navigate('cashkaro_entry')}
              className="block w-full text-left hover:bg-white hover:bg-opacity-20 p-1 rounded"
            >
              Reset to Start
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
