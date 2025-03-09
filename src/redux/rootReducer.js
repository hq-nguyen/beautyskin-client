import { combineReducers } from "@reduxjs/toolkit";
import  userReducer from "./features/useSlice";
import cartReducer  from "./features/cartSlice";

const rootReducer = combineReducers({
    user: userReducer,
    cart: cartReducer
})

export default rootReducer;