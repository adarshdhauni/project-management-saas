import {
  Activity,
  CheckSquare,
  CircleUserRound,
  FolderKanban,
  MessageSquare,
  Settings,
  UserPlus,
  Users,
} from "lucide-react";

export const getActivityContent = (activity) => {
  const metadata = activity.metadata ?? {};

  switch (activity.action) {
    case "workspace.created":
      return {
        action: "created the workspace",
        target: metadata.name,
        to: metadata.workspaceId
          ? `/dashboard/workspaces/${metadata.workspaceId}`
          : null,
        icon: Settings,
      };

    case "workspace.updated": {
      const changes = metadata.changes ?? {};

      const changeText = Object.entries(changes)
        .map(([field, { from, to }]) => {
          return `${field} from "${from ?? "none"}" to "${to ?? "none"}"`;
        })
        .join(", ");

      return {
        action: "updated the workspace",
        target: changeText,
        to: metadata.workspaceId
          ? `/dashboard/workspaces/${metadata.workspaceId}`
          : null,
        icon: Settings,
      };
    }

    case "workspace.deleted":
      return {
        action: "deleted the workspace",
        target: metadata.name,
        to: null,
        icon: Settings,
      };

    case "project.created":
      return {
        action: "created the project",
        target: metadata.name,
        to: metadata.projectId
          ? `/dashboard/workspaces/${activity.workspace}/projects/${metadata.projectId}`
          : null,
        icon: FolderKanban,
      };

    case "project.updated": {
      const changes = metadata.changes ?? {};

      const changeText = Object.entries(changes)
        .map(([field, { from, to }]) => {
          return `${field} from "${from ?? "none"}" to "${to ?? "none"}"`;
        })
        .join(", ");

      return {
        action: "updated the project",
        target: changeText,
        to: metadata.projectId
          ? `/dashboard/workspaces/${activity.workspace}/projects/${metadata.projectId}`
          : null,
        icon: FolderKanban,
      };
    }

    case "project.deleted":
      return {
        action: "deleted the project",
        target: metadata.name,
        to: null,
        icon: FolderKanban,
      };

    case "task.created":
      return {
        action: "created the task",
        target: metadata.title,
        to:
          metadata.projectId && metadata.taskId
            ? `/dashboard/workspaces/${activity.workspace}/projects/${metadata.projectId}/tasks/${metadata.taskId}`
            : null,
        icon: CheckSquare,
      };

    case "task.updated": {
      const changes = metadata.changes ?? {};

      const changeText = Object.entries(changes)
        .map(([field, { from, to }]) => {
          return `${field} from "${from ?? "none"}" to "${to ?? "none"}"`;
        })
        .join(", ");

      return {
        action: "updated the task",
        target: changeText,
        to:
          metadata.projectId && metadata.taskId
            ? `/dashboard/workspaces/${activity.workspace}/projects/${metadata.projectId}/tasks/${metadata.taskId}`
            : null,
        icon: CheckSquare,
      };
    }

    case "task.deleted":
      return {
        action: "deleted the task",
        target: metadata.title,
        to: null,
        icon: CheckSquare,
      };

    case "task.assigned":
      return {
        action: "assigned the task",
        target: `from "${metadata.from ?? "Unassigned"}" to "${metadata.to ?? "Unassigned"}"`,
        to:
          metadata.projectId && metadata.taskId
            ? `/dashboard/workspaces/${activity.workspace}/projects/${metadata.projectId}/tasks/${metadata.taskId}`
            : null,
        icon: CircleUserRound,
      };

    case "task.status_changed":
      return {
        action: "changed the task status",
        target: `"${metadata.from ?? "none"}" → "${metadata.to ?? "none"}"`,
        to:
          metadata.projectId && metadata.taskId
            ? `/dashboard/workspaces/${activity.workspace}/projects/${metadata.projectId}/tasks/${metadata.taskId}`
            : null,
        icon: CheckSquare,
      };

    case "task.reordered":
      return {
        action: "reordered the task",
        target: `from position ${metadata.fromPosition} to ${metadata.toPosition}`,
        to:
          metadata.projectId && metadata.taskId
            ? `/dashboard/workspaces/${activity.workspace}/projects/${metadata.projectId}/tasks/${metadata.taskId}`
            : null,
        icon: CheckSquare,
      };

    case "comment.created":
      return {
        action: "commented on",
        target: `${metadata.taskTitle}: "${metadata.preview}"`,
        to:
          metadata.projectId && metadata.taskId
            ? `/dashboard/workspaces/${activity.workspace}/projects/${metadata.projectId}/tasks/${metadata.taskId}`
            : null,
        icon: MessageSquare,
      };

    case "comment.updated":
      return {
        action: "updated a comment on",
        target: `${metadata.taskTitle}: "${metadata.from}" → "${metadata.to}"`,
        to:
          metadata.projectId && metadata.taskId
            ? `/dashboard/workspaces/${activity.workspace}/projects/${metadata.projectId}/tasks/${metadata.taskId}`
            : null,
        icon: MessageSquare,
      };

    case "comment.deleted":
      return {
        action: "deleted a comment on",
        target: `${metadata.taskTitle}: "${metadata.preview}"`,
        to:
          metadata.projectId && metadata.taskId
            ? `/dashboard/workspaces/${activity.workspace}/projects/${metadata.projectId}/tasks/${metadata.taskId}`
            : null,
        icon: MessageSquare,
      };

    case "member.invited":
      return {
        action: "invited a member",
        target: metadata.email,
        to: metadata.workspaceId
          ? `/dashboard/workspaces/${metadata.workspaceId}/members`
          : null,
        icon: UserPlus,
      };

    case "member.joined":
      return {
        action: "joined the workspace",
        target: metadata.memberName,
        to: metadata.workspaceId
          ? `/dashboard/workspaces/${metadata.workspaceId}/members`
          : null,
        icon: Users,
      };

    case "member.invitation_rejected":
      return {
        action: "rejected an invitation",
        target: metadata.email,
        to: metadata.workspaceId
          ? `/dashboard/workspaces/${metadata.workspaceId}/members`
          : null,
        icon: Users,
      };

    case "member.role_changed":
      return {
        action: "changed a member's role",
        target: metadata.memberName,
        to: metadata.workspaceId
          ? `/dashboard/workspaces/${metadata.workspaceId}/members`
          : null,
        icon: Users,
      };

    case "member.removed":
      return {
        action: "removed a member",
        target: metadata.memberName,
        to: metadata.workspaceId
          ? `/dashboard/workspaces/${metadata.workspaceId}/members`
          : null,
        icon: Users,
      };

    case "member.left":
      return {
        action: "left the workspace",
        target: metadata.memberName,
        to: metadata.workspaceId
          ? `/dashboard/workspaces/${metadata.workspaceId}/members`
          : null,
        icon: Users,
      };

    default:
      return {
        action: "performed an activity",
        target: null,
        to: null,
        icon: Activity,
      };
  }
};
