import axios from 'axios';

const BASE_URL = 'https://67bc0cf4ed4861e07b38fca1.mockapi.io/promotion';

export const getAllPromotions = async () => {
  try {
    const response = await axios.get(`${BASE_URL}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching promotions:', error);
    throw error;
  }
};

export const getPromotionById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching promotion with id ${id}:`, error);
    throw error;
  }
};

export const createPromotion = async (promotionData) => {
  try {
    const response = await axios.post(`${BASE_URL}`, promotionData);
    return response.data;
  } catch (error) {
    console.error('Error creating promotion:', error);
    throw error;
  }
};

export const updatePromotion = async (id, promotionData) => {
  try {
    const response = await axios.put(`${BASE_URL}/${id}`, promotionData);
    return response.data;
  } catch (error) {
    console.error(`Error updating promotion with id ${id}:`, error);
    throw error;
  }
};

export const deletePromotion = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting promotion with id ${id}:`, error);
    throw error;
  }
};

export const getActivePromotions = async () => {
  try {
    const allPromotions = await getAllPromotions();
    const currentDate = new Date();
    
    return allPromotions.filter(promotion => 
      !promotion.deleted && 
      new Date(promotion.startDate) <= currentDate &&
      new Date(promotion.endDate) >= currentDate
    );
  } catch (error) {
    console.error('Error fetching active promotions:', error);
    throw error;
  }
};

export const getPromotionsByType = async (type) => {
  try {
    const response = await axios.get(`${BASE_URL}?type=${type}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching promotions of type ${type}:`, error);
    throw error;
  }
};
