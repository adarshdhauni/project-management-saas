import { apiSlice } from "@/redux/api/apiSlice";

const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateUser: builder.mutation({
      query: (userData) => ({
        url: "/api/v1/users/me",
        method: "PATCH",
        body: userData,
      }),

      invalidatesTags: ["User"],
    }),
  }),
});

export const { useUpdateUserMutation } = userApi;
