export const getNotificationContent = (notification) => {
  const workspaceName = notification.metadata?.workspaceName ?? "a workspace";

  const actorName = notification.actor?.name ?? "Someone";
  const role = notification.metadata?.role ?? "a member";

  switch (notification.type) {
    case "workspace.invited": {
      switch (notification.invitationStatus) {
        case "pending":
          return {
            title: `You were invited to ${workspaceName}`,
            description: `${actorName} invited you as ${role}.`,
          };

        case "accepted":
          return {
            title: "Invitation accepted",
            description: `You accepted the invitation to ${workspaceName} as ${role}.`,
          };

        case "rejected":
          return {
            title: "Invitation declined",
            description: `You declined the invitation to ${workspaceName}.`,
          };

        case "expired":
          return {
            title: "Invitation expired",
            description: `Your invitation to ${workspaceName} has expired.`,
          };

        default:
          return {
            title: "Invitation unavailable",
            description: `The invitation to ${workspaceName} is no longer available.`,
          };
      }
    }

    case "task.assigned":
      return {
        title: "You were assigned a task",
        description: `${actorName} assigned you "${
          notification.metadata?.taskTitle ?? "a task"
        }".`,
      };

    case "member.role_changed": {
      const previousRole = notification.metadata?.previousRole;
      const newRole = notification.metadata?.newRole;

      const isOwnershipTransfer =
        previousRole === "owner" && newRole === "admin";

      return {
        title: isOwnershipTransfer
          ? "Your workspace ownership was transferred"
          : "Your workspace role was changed",

        description: isOwnershipTransfer
          ? `${actorName} transferred workspace ownership to another member. You are now an admin.`
          : `${actorName} changed your role from ${
              previousRole ?? "unknown"
            } to ${newRole ?? "unknown"}.`,
      };
    }

    case "member.removed":
      return {
        title: `You were removed from ${workspaceName}`,
        description: `${actorName} removed you from the workspace.`,
      };

    default:
      return {
        title: "New notification",
        description: "",
      };
  }
};

const getWorkspaceId = (notification) => {
  const workspace = notification.workspace;

  if (!workspace) return null;

  const id =
    typeof workspace === "object" && workspace?._id ? workspace._id : workspace;

  return id?.toString() ?? null;
};

export const getNotificationPath = (notification) => {
  const workspaceId = getWorkspaceId(notification);

  switch (notification.type) {
    case "workspace.invited":
      return notification.invitationStatus === "accepted" && workspaceId
        ? `/dashboard/workspaces/${workspaceId}`
        : null;

    case "task.assigned": {
      const projectId = notification.metadata?.projectId;
      const taskId = notification.entityId?.toString();

      return workspaceId && projectId && taskId
        ? `/dashboard/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`
        : null;
    }

    case "member.role_changed":
      return workspaceId
        ? `/dashboard/workspaces/${workspaceId}/members`
        : null;

    case "member.removed":
      return "/dashboard";

    default:
      return null;
  }
};
