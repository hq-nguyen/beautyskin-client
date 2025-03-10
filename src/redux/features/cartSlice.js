import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listItem: [],
  totalQuantity: 0,
  totalPrice: 0,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existingProductIndex = state.listItem.findIndex(
        (item) => item.id === product.id
      );

      const quantity = product.quantity || 1;

      if (existingProductIndex !== -1) {
        // Sản phẩm đã tồn tại thì add thêm

        const oldQuantity = state.listItem[existingProductIndex].quantity;
        state.totalQuantity = state.totalQuantity - oldQuantity + quantity;
        state.totalPrice = state.totalPrice - 
          (state.listItem[existingProductIndex].price * oldQuantity) + 
          (product.price * quantity);
        
        state.listItem[existingProductIndex] = {...product};
      } else {
        // Add new product
        state.listItem.push({...product});
        state.totalQuantity += quantity;
        state.totalPrice += product.price * quantity;
      }
    },

    removeFromCart: (state, action) => {
      const productId = action.payload;
      const productIndex = state.listItem.findIndex(
        (item) => item.id === productId
      );

      if (productIndex !== -1) {
        const product = state.listItem[productIndex];
        state.totalQuantity -= product.quantity;
        state.totalPrice -= product.price * product.quantity;

        state.listItem.splice(productIndex, 1);
      }
    },

    updateCartQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const productIndex = state.listItem.findIndex(item => item.id === id);
      
      if (productIndex !== -1) {
        const product = state.listItem[productIndex];
        const quantityDiff = quantity - product.quantity;
        
        // Update quantity
        state.listItem[productIndex].quantity = quantity;
        
        // Update totals
        state.totalQuantity += quantityDiff;
        state.totalPrice += product.price * quantityDiff;
      }
    },

    clearCart: (state) => {
      state.listItem = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateCartQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;