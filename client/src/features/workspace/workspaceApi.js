import { apiSlice } from "@/redux/api/apiSlice";

const workspaceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createWorkspace: builder.mutation({
      query: (data) => ({
        url: "/api/v1/workspaces",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Workspace"],
    }),
    getWorkspaces: builder.query({
      query: () => ({
        url: "/api/v1/workspaces",
        method: "GET",
      }),
      providesTags: ["Workspace"],
    }),
    getWorkspaceById: builder.query({
      query: (id) => ({
        url: `/api/v1/workspaces/${id}`,
        method: "GET",
      }),
      providesTags: ["Workspace"],
    }),
    updateWorkspace: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/v1/workspaces/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Workspace"],
    }),
    deleteWorkspace: builder.mutation({
      query: (id) => ({
        url: `/api/v1/workspaces/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Workspace"],
    }),
  }),
});

export const {
  useCreateWorkspaceMutation,
  useGetWorkspacesQuery,
  useGetWorkspaceByIdQuery,
  useUpdateWorkspaceMutation,
  useDeleteWorkspaceMutation,
} = workspaceApi;
