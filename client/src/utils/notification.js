export const getNotificationContent = (notification) => {
  switch (notification.type) {
    case "workspace.invited":
      return {
        title: `You were invited to ${
          notification.metadata?.workspaceName ?? "a workspace"
        }`,
        description: `${notification.actor?.name ?? "Someone"} invited you as ${
          notification.metadata?.role ?? "a member"
        }.`,
      };

    case "task.assigned":
      return {
        title: "You were assigned a task",
        description: `${
          notification.actor?.name ?? "Someone"
        } assigned you "${notification.metadata?.taskTitle ?? "a task"}".`,
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
          ? `${notification.actor?.name ?? "Someone"} transferred workspace ownership to another member. You are now an admin.`
          : `${notification.actor?.name ?? "Someone"} changed your role from ${
              previousRole ?? "unknown"
            } to ${newRole ?? "unknown"}.`,
      };
    }

    case "member.removed":
      return {
        title: `You were removed from ${
          notification.metadata?.workspaceName ?? "a workspace"
        }`,
        description: `${
          notification.actor?.name ?? "Someone"
        } removed you from the workspace.`,
      };

    default:
      return {
        title: "New notification",
        description: "",
      };
  }
};

export const getNotificationPath = (notification) => {
  switch (notification.type) {
    case "workspace.invited":
      return null;

    case "task.assigned":
      return notification.metadata?.projectId
        ? `/dashboard/workspaces/${notification.workspace}/projects/${notification.metadata.projectId}/tasks/${notification.entityId}`
        : null;

    case "member.role_changed":
      return `/dashboard/workspaces/${notification.workspace}/members`;

    case "member.removed":
      return "/dashboard";

    default:
      return null;
  }
};
