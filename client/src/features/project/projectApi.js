import { apiSlice } from "@/redux/api/apiSlice";

const projectApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createProject: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/v1/workspaces/${id}/projects`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Project", "Activity"],
    }),
    updateProject: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/v1/projects/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Project", "Activity"],
    }),
    deleteProject: builder.mutation({
      query: (id) => ({
        url: `/api/v1/projects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Project", "Activity"],
    }),
  }),
});

export const {
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectApi;
