import { combineReducers } from "@reduxjs/toolkit";
import  userReducer from "./features/useSlice";
import cartReducer  from "./features/cartSlice";
import compareReducer  from "./features/compareSlice";

const rootReducer = combineReducers({
    user: userReducer,
    cart: cartReducer,
    compare: compareReducer,
})

export default rootReducer;