import api from '../config/axios';

export const getAllPromotions = async () => {
  try {
    const response = await api.get('/promotion/getValid');
    return response.data;
  } catch (error) {
    console.error('Error fetching promotions:', error);
    throw error;
  }
};

export const createPromotion = async (promotionData) => {
  try {
    const response = await api.post('promotion/create', promotionData);
    return response.data;
  } catch (error) {
    console.error('Error creating promotion:', error);
    throw error;
  }
};

export const updatePromotion = async (id, promotionData) => {
  try {
    const response = await api.put(`promotion/update/${id}`, promotionData);
    return response.data;
  } catch (error) {
    console.error(`Error updating promotion with id ${id}:`, error);
    throw error;
  }
};

export const deletePromotion = async (id) => {
  try {
    const response = await api.delete(`promotion/delete/${id}`);
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

// export const getPromotionsByType = async (type) => {
//   try {
//     const response = await api.get(`${BASE_URL}?type=${type}`);
//     return response.data;
//   } catch (error) {
//     console.error(`Error fetching promotions of type ${type}:`, error);
//     throw error;
//   }
// };

export const fetchRanking = async () => {
  try {
    const response = await api.get('user-rank/gets');
    return response.data;
  } catch (error) {
    console.error('Error fetching ranking:', error);
    throw error;
  }
}
