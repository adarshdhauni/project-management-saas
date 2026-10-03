import { apiSlice } from "@/redux/api/apiSlice";

const taskApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createTask: builder.mutation({
      query: ({ projectId, data }) => ({
        url: `/api/v1/projects/${projectId}/tasks`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Task", "Activity"],
    }),

    getProjectTasks: builder.query({
      query: ({
        projectId,
        page = 1,
        limit = 20,
        status,
        priority,
        assignee,
        search = "",
        sortBy = "position",
        sortOrder = "asc",
      }) => ({
        url: `/api/v1/projects/${projectId}/tasks`,
        params: {
          page,
          limit,
          ...(status && { status }),
          ...(priority && { priority }),
          ...(assignee && { assignee }),
          ...(search.trim() && { search: search.trim() }),
          sortBy,
          sortOrder,
        },
      }),
      providesTags: ["Task"],
    }),

    getTaskById: builder.query({
      query: (taskId) => ({
        url: `/api/v1/tasks/${taskId}`,
        method: "GET",
      }),
      providesTags: ["Task"],
    }),

    updateTask: builder.mutation({
      query: ({ taskId, data }) => ({
        url: `/api/v1/tasks/${taskId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Task", "Activity"],
    }),

    deleteTask: builder.mutation({
      query: (taskId) => ({
        url: `/api/v1/tasks/${taskId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Task", "Activity"],
    }),

    moveTask: builder.mutation({
      query: ({ taskId, beforeTaskId = null }) => ({
        url: `/api/v1/tasks/${taskId}/position`,
        method: "PATCH",
        body: {
          beforeTaskId,
        },
      }),
      invalidatesTags: ["Task", "Activity"],
    }),
  }),
});

export const {
  useCreateTaskMutation,
  useGetProjectTasksQuery,
  useGetTaskByIdQuery,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useMoveTaskMutation,
} = taskApi;
