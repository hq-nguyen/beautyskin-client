import { createSlice } from '@reduxjs/toolkit';
import { message } from 'antd';

const initialState = {
  items: [],
};

const compareSlice = createSlice({
  name: 'compare',
  initialState,
  reducers: {
    addToCompare: (state, action) => {
      if (!state.items) {
        state.items = [];
      }
      
      const productToAdd = action.payload;
      
      const isProductInCompare = state.items.find(item => item.id === productToAdd.id);
      
      if (isProductInCompare) {
        message.success('Sản phẩm đã có trong danh sách so sánh');
        return;
      }
      
      // Check if compare list is at max capacity (3 products)
      if (state.items.length >= 3) {
        message.warning('Danh sách so sánh chỉ có thể chứa tối đa 3 sản phẩm');
        return;
      }
      
      // Add product to compare list
      state.items.push(productToAdd);
      message.success('Đã thêm sản phẩm vào danh sách so sánh');
    },
    removeFromCompare: (state, action) => {
      if (!state.items) {
        state.items = [];
        return;
      }
      
      const productId = action.payload;
      state.items = state.items.filter(item => item.id !== productId);
      message.success('Đã xóa sản phẩm khỏi danh sách so sánh');
    },
    clearCompare: (state) => {
      state.items = [];
      message.success('Đã xóa tất cả sản phẩm khỏi danh sách so sánh');
    }
  }
});

export const { addToCompare, removeFromCompare, clearCompare } = compareSlice.actions;
export default compareSlice.reducer;