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
      const existingProduct = state.listItem.find((item) => item.id === product.id);

      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        state.listItem.push({ ...product, quantity: 1 });
      }
      state.totalQuantity += 1;
      state.totalPrice += product.price;
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
    },

    removeFromCart: (state, action) => {
      if(!state.cart) {
        state.listItem = [];
        return;
      }
      const productId = action.payload;
      const productIndex = state.listItem.findIndex((item) => item.id === productId);
      
      if (productIndex !== -1) {
        const product = state.listItem[productIndex];
        state.totalQuantity -= product.quantity;
        state.totalPrice -= product.price * product.quantity;
        state.listItem.splice(productIndex, 1);
      }
    },

    clearCart: (state) => {
      state.listItem = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    },
  },
});

export const { addToCart, removeFromCart, reducerCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;