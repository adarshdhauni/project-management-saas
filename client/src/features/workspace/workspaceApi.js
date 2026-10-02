import { apiSlice } from "@/redux/api/apiSlice";

const workspaceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createWorkspace: builder.mutation({
      query: (data) => ({
        url: "/api/v1/workspaces",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Workspace", "Activity"],
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
      invalidatesTags: ["Workspace", "Activity"],
    }),
    deleteWorkspace: builder.mutation({
      query: (id) => ({
        url: `/api/v1/workspaces/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Workspace", "Activity"],
    }),
    acceptInvitation: builder.mutation({
      query: (invitationId) => ({
        url: `/api/v1/workspaces/invitations/${invitationId}/accept`,
        method: "POST",
      }),
      invalidatesTags: ["Workspace", "Notification", "Activity"],
    }),

    declineInvitation: builder.mutation({
      query: (invitationId) => ({
        url: `/api/v1/workspaces/invitations/${invitationId}/reject`,
        method: "POST",
      }),
      invalidatesTags: ["Workspace", "Notification", "Activity"],
    }),

    getWorkspaceOverview: builder.query({
      query: (id) => ({
        url: `/api/v1/workspaces/${id}/overview`,
        method: "GET",
      }),
      providesTags: [
        "Workspace",
        "Project",
        "Task",
        "WorkspaceMember",
        "Activity",
      ],
    }),

    getActivities: builder.query({
      query: ({ workspaceId, page = 1, limit = 20 }) => ({
        url: `/api/v1/workspaces/${workspaceId}/activities`,
        method: "GET",
        params: {
          page,
          limit,
        },
      }),
      providesTags: ["Activity"],
    }),

    getWorkspaceMembers: builder.query({
      query: ({ workspaceId, page = 1, limit = 20, search = "" }) => ({
        url: `/api/v1/workspaces/${workspaceId}/members`,
        method: "GET",
        params: {
          page,
          limit,
          search,
        },
      }),
      providesTags: ["WorkspaceMember"],
    }),

    inviteWorkspaceMember: builder.mutation({
      query: ({ workspaceId, data }) => ({
        url: `/api/v1/workspaces/${workspaceId}/invite`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["WorkspaceMember"],
    }),

    updateMemberRole: builder.mutation({
      query: ({ workspaceId, memberId, role }) => ({
        url: `/api/v1/workspaces/${workspaceId}/members/${memberId}`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: ["WorkspaceMember"],
    }),

    removeWorkspaceMember: builder.mutation({
      query: ({ workspaceId, memberId }) => ({
        url: `/api/v1/workspaces/${workspaceId}/members/${memberId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["WorkspaceMember"],
    }),

    getMyWorkspaceMembership: builder.query({
      query: (workspaceId) => ({
        url: `/api/v1/workspaces/${workspaceId}/membership`,
        method: "GET",
      }),
      providesTags: ["WorkspaceMember"],
    }),

    leaveWorkspace: builder.mutation({
      query: (workspaceId) => ({
        url: `/api/v1/workspaces/${workspaceId}/leave`,
        method: "DELETE",
      }),
      invalidatesTags: ["Workspace", "WorkspaceMember"],
    }),

    transferOwnership: builder.mutation({
      query: ({ workspaceId, data }) => ({
        url: `/api/v1/workspaces/${workspaceId}/transfer-ownership`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Workspace", "WorkspaceMember"],
    }),
  }),
});

export const {
  useCreateWorkspaceMutation,
  useGetWorkspacesQuery,
  useGetWorkspaceByIdQuery,
  useUpdateWorkspaceMutation,
  useDeleteWorkspaceMutation,
  useAcceptInvitationMutation,
  useDeclineInvitationMutation,
  useGetWorkspaceOverviewQuery,
  useGetActivitiesQuery,
  useGetWorkspaceMembersQuery,
  useInviteWorkspaceMemberMutation,
  useUpdateMemberRoleMutation,
  useRemoveWorkspaceMemberMutation,
  useGetMyWorkspaceMembershipQuery,
  useLeaveWorkspaceMutation,
  useTransferOwnershipMutation,
} = workspaceApi;
