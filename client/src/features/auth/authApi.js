import { apiSlice } from "@/redux/api/apiSlice";

const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (userData) => ({
        url: "/api/v1/auth/register",
        method: "POST",
        body: userData,
      }),
    }),
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/api/v1/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    refreshToken: builder.mutation({
      query: () => ({
        url: "/api/v1/auth/refresh-token",
        method: "POST",
      }),
    }),
    getMe: builder.query({
      query: () => ({
        url: "/api/v1/auth/me",
        method: "GET",
      }),

      providesTags: ["User"],
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/api/v1/auth/logout",
        method: "POST",
      }),

      invalidatesTags: ["User"],
    }),
    forgotPassword: builder.mutation({
      query: (userData) => ({
        url: "/api/v1/auth/forgot-password",
        method: "POST",
        body: userData,
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ token, password }) => ({
        url: "/api/v1/auth/reset-password",
        method: "POST",
        body: {
          token,
          password,
        },
      }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useRefreshTokenMutation,
  useGetMeQuery,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
