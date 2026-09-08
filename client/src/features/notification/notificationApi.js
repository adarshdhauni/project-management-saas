import { apiSlice } from "@/redux/api/apiSlice";

const notificationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: ({ page = 1, limit = 20, read } = {}) => ({
        url: "/api/v1/notifications",
        method: "GET",
        params: {
          page,
          limit,
          ...(read !== undefined && { read }),
        },
      }),
      providesTags: ["Notification"],
    }),

    markNotificationAsRead: builder.mutation({
      query: (id) => ({
        url: `/api/v1/notifications/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),

    markAllNotificationsAsRead: builder.mutation({
      query: () => ({
        url: "/api/v1/notifications/read-all",
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),
    getNotificationById: builder.query({
      query: (id) => ({
        url: `/api/v1/notifications/${id}`,
        method: "GET",
      }),
      providesTags: ["Notification"],
    }),
    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `/api/v1/notifications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useGetNotificationByIdQuery,
  useDeleteNotificationMutation,
} = notificationApi;
