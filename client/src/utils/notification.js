export const getNotificationContent = (notification) => {
  switch (notification.type) {
    case "workspace.invited":
      return {
        title: `You were invited to ${notification.metadata?.workspaceName}`,
        description: `You've been invited as ${notification.metadata?.role}.`,
      };

    case "task.assigned":
      return {
        title: "You were assigned a task",
        description: notification.metadata?.taskTitle,
      };

    case "member.role_changed":
      return {
        title: "Your workspace role was changed",
        description: `Your role changed from ${notification.metadata?.previousRole} to ${notification.metadata?.newRole}.`,
      };

    case "member.removed":
      return {
        title: `You were removed from ${notification.metadata?.workspaceName}`,
        description: "You no longer have access to this workspace.",
      };

    default:
      return {
        title: "New notification",
        description: "",
      };
  }
};
