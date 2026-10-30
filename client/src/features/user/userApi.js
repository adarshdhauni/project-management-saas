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

    uploadAvatar: builder.mutation({
      query: (formData) => ({
        url: "/api/v1/users/avatar",
        method: "PATCH",
        body: formData,
      }),

      invalidatesTags: ["User"],
    }),

    removeAvatar: builder.mutation({
      query: () => ({
        url: "/api/v1/users/avatar",
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useUpdateUserMutation,
  useUploadAvatarMutation,
  useRemoveAvatarMutation,
} = userApi;
