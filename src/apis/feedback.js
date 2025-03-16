import api from "../config/axios";

export const createFeedback = async (feedbackData) => {
    try {
      const response = await api.post(`/feedback/create`, feedbackData);
      return response.data;
    } catch (error) {
      console.error('Error creating feedback:', error);
      throw error;
    }
  };