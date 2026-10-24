import { configureStore } from "@reduxjs/toolkit";

import authReducer from "@/features/auth/authSlice.js";

import { apiSlice } from "../api/apiSlice.js";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(apiSlice.middleware);
  },
});
