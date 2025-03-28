import React, { createContext, useState, useContext, useCallback, useMemo } from 'react';
import api from '../config/axios';

// Singleton Feedback Manager
class FeedbackManager {
  constructor() {
    this.feedbackCache = {};
    this.fetchPromises = {};
  }

  async getFeedbackForProduct(productId) {
    // If cached data exists and is fresh, return it
    if (this.feedbackCache[productId]) {
      const { data, timestamp } = this.feedbackCache[productId];
      if (Date.now() - timestamp < 5 * 60 * 1000) { // 5 minutes cache
        return data;
      }
    }

    // Prevent multiple simultaneous requests for same product
    if (this.fetchPromises[productId]) {
      return this.fetchPromises[productId];
    }

    // Create a new fetch promise
    this.fetchPromises[productId] = this.fetchProductFeedback(productId);

    return this.fetchPromises[productId];
  }

  async fetchProductFeedback(productId) {
    try {
      const response = await api.get(`/feedback/getFeedbackById/${productId}`);
      const feedbacks = response.data || [];

      const summaryData = feedbacks.length > 0 
        ? {
            count: feedbacks.length,
            averageRating: feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length,
            feedbacks: feedbacks
          }
        : { count: 0, averageRating: 0, feedbacks: [] };

      // Cache the result
      this.feedbackCache[productId] = {
        data: summaryData,
        timestamp: Date.now()
      };

      // Clear the fetch promise
      delete this.fetchPromises[productId];

      return summaryData;
    } catch (error) {
      console.error("Error fetching product feedbacks:", error);
      delete this.fetchPromises[productId];
      return { count: 0, averageRating: 0, feedbacks: [] };
    }
  }
}

// Create a singleton instance
const feedbackManager = new FeedbackManager();

// Create a context for sharing the feedback manager
const FeedbackContext = createContext(null);

export const FeedbackProvider = ({ children }) => {
  return (
    <FeedbackContext.Provider value={feedbackManager}>
      {children}
    </FeedbackContext.Provider>
  );
};

// Custom hook for using feedback manager
export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
};

// Hook for components to use feedback data
export const useProductFeedback = (productId) => {
  const feedbackManager = useFeedback();
  const [feedbackData, setFeedbackData] = useState({
    count: 0, 
    averageRating: 0,
    feedbacks: []
  });

  const fetchFeedback = useCallback(async () => {
    const data = await feedbackManager.getFeedbackForProduct(productId);
    setFeedbackData(data);
  }, [productId]);

  // Memoized to prevent unnecessary re-renders
  const memoizedFeedbackData = useMemo(() => ({
    count: feedbackData.count,
    averageRating: feedbackData.averageRating
  }), [feedbackData.count, feedbackData.averageRating]);

  return {
    feedbackData: memoizedFeedbackData,
    fetchFeedback
  };
};