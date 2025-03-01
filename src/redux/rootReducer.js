import { combineReducers } from "@reduxjs/toolkit";
import  userReducer from "./features/useSlice";

const rootReducer = combineReducers({
    user: userReducer
})

export default rootReducer;