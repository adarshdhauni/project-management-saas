import { apiSlice } from "@/redux/api/apiSlice";

const commentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createComment: builder.mutation({
      query: ({ taskId, data }) => ({
        url: `/api/v1/tasks/${taskId}/comments`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Comment", "Activity"],
    }),

    getTaskComments: builder.query({
      query: ({ taskId, page = 1, limit = 20 }) => ({
        url: `/api/v1/tasks/${taskId}/comments`,
        params: {
          page,
          limit,
        },
      }),
      providesTags: ["Comment"],
    }),

    updateComment: builder.mutation({
      query: ({ commentId, data }) => ({
        url: `/api/v1/comments/${commentId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Comment", "Activity"],
    }),

    deleteComment: builder.mutation({
      query: (commentId) => ({
        url: `/api/v1/comments/${commentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Comment", "Activity"],
    }),
  }),
});

export const {
  useCreateCommentMutation,
  useGetTaskCommentsQuery,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = commentApi;
