import React, { useState } from 'react';
import { MessageSquare, Send, X } from 'lucide-react';

const FeedbackWidget = ({ elementId, elementType = 'page', onFeedback }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(null);

  const handleSubmit = () => {
    if (feedback.trim() || rating) {
      const feedbackData = {
        element_id: elementId,
        element_type: elementType,
        feedback: feedback.trim(),
        rating: rating,
        timestamp: new Date().toISOString(),
        url: window.location.href
      };

      console.log('feedback_submitted', feedbackData);
      onFeedback?.(feedbackData);
      
      // Reset form
      setFeedback('');
      setRating(null);
      setIsOpen(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-bankkaro-blue text-white p-3 rounded-full shadow-lg hover:bg-bankkaro-blue-dark transition-colors z-50"
        title="Provide feedback"
      >
        <MessageSquare className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-80 z-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-900">Quick Feedback</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Rating */}
      <div className="mb-3">
        <p className="text-sm text-gray-600 mb-2">How was your experience?</p>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className={`w-6 h-6 ${
                rating >= star ? 'text-yellow-400' : 'text-gray-300'
              } hover:text-yellow-400 transition-colors`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      {/* Feedback Text */}
      <div className="mb-3">
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Tell us what you think..."
          className="w-full p-2 border border-gray-300 rounded text-sm resize-none"
          rows="3"
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={!feedback.trim() && !rating}
          className="inline-flex items-center px-3 py-2 bg-bankkaro-blue text-white text-sm rounded hover:bg-bankkaro-blue-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-4 h-4 mr-1" />
          Send
        </button>
      </div>
    </div>
  );
};

export default FeedbackWidget;
