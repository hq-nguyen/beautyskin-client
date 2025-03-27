import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listItem: [],
  totalQuantity: 0,
  totalPrice: 0,
  originalTotalPrice: 0,
  appliedPromotion: null,
  totalDiscount: 0
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existingProduct = state.listItem.find((item) => item.id === product.id);

      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        state.listItem.push({ ...product, quantity: 1 });
      }
      state.totalQuantity += 1;
      state.totalPrice += product.price;
      state.originalTotalPrice += product.price;
    },

    addToCartWithQuantity: (state, action) => {
      const product = action.payload;
      const existingProduct = state.listItem.find((item) => item.id === product.id);

      const quantityToAdd = product.quantity || 1;

      if (existingProduct) {
        existingProduct.quantity += quantityToAdd;
      } else {
        state.listItem.push({ ...product, quantity: quantityToAdd });
      }
      state.totalQuantity += quantityToAdd;
      state.totalPrice += product.price * quantityToAdd;
      state.originalTotalPrice += product.price * quantityToAdd;
    },

    reducerCart: (state, action) => {
      const product = action.payload;
      const existingProduct = state.listItem.find((item) => item.id === product.id);
      
      if (!existingProduct) return;
      
      if (existingProduct.quantity === 1) {
        state.listItem = state.listItem.filter((item) => item.id !== product.id);
      } else {
        existingProduct.quantity -= 1;
      }
      
      state.totalQuantity -= 1;
      state.totalPrice -= product.price;
      state.originalTotalPrice -= product.price;
    },

    removeFromCart: (state, action) => {
      if (!state.listItem || state.listItem.length === 0) {
        state.listItem = [];
        state.totalQuantity = 0;
        state.totalPrice = 0;
        state.originalTotalPrice = 0;
        state.totalDiscount = 0;
        return;
      }
      
      const productId = action.payload;
      const productIndex = state.listItem.findIndex((item) => item.id === productId);
      
      if (productIndex !== -1) {
        const product = state.listItem[productIndex];
        state.totalQuantity -= product.quantity || 1;
        state.totalPrice -= product.price * (product.quantity || 1);
        state.originalTotalPrice -= product.price * (product.quantity || 1);
        state.listItem.splice(productIndex, 1);
      }
    },

    clearCart: (state) => {
      state.listItem = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
      state.originalTotalPrice = 0;
      state.appliedPromotion = null;
      state.totalDiscount = 0;
    },

    applyPromotion: (state, action) => {
      if (action.payload) {
        state.appliedPromotion = action.payload;
        state.totalDiscount = action.payload.amount;
        state.totalPrice = state.originalTotalPrice - state.totalDiscount;
      } else {
        state.appliedPromotion = null;
        state.totalDiscount = 0;
        state.totalPrice = state.originalTotalPrice;
      }
    }
  },
});

export const { 
  addToCart, 
  addToCartWithQuantity, 
  removeFromCart, 
  reducerCart, 
  clearCart, 
  applyPromotion 
} = cartSlice.actions;

export default cartSlice.reducer;