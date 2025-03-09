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
    // them product vao cart
    addToCart: (state, action) => {
      // state.cart = state.cart || []; // Đảm bảo cart không bị null

      const product = action.payload;
      const existingProduct = state.listItem.find(
        (item) => item.id === product.id
      );

      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        state.listItem.push({ ...product, quantity: 1 });
      }

      state.totalQuantity += 1;
      state.totalPrice += product.price;
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

        // xoa product splice(index, so luong xoa)
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

// Action creators are generated for each case reducer function
export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer
