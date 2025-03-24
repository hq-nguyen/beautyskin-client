import { message } from "antd";
import api from "../config/axios";

export const createFeedback = async (feedbackData) => {
  try {
    const response = await api.post(`/feedback/create`, feedbackData);
    return response.data;
  } catch (error) {
    message.error(error.response.data);
  }
};

export const fetchFeedbacks = async () => {
  try {
    const response = await api.get(`/feedback/getDeleteIsFalse`);
    return response.data;
  } catch (error) {
    message.error(error.response.data);
  }
};

export const fetchProductFeedbacks = async (productId) => {
  try {
    const response = await api.get(`/feedback/getFeedbackById/${productId}`);
    return response.data;
  } catch (error) {
    message.error(error.response.data);
  }
}