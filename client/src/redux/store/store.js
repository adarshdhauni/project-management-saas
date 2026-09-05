import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice.js";
import authReducer from "@/features/auth/authSlice.js";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(apiSlice.middleware);
  },
});
