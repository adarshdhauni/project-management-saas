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
        target: metadata.workspaceName,
        icon: Settings,
      };

    case "workspace.updated":
      return {
        action: "updated the workspace",
        target: metadata.workspaceName,
        icon: Settings,
      };

    case "workspace.deleted":
      return {
        action: "deleted the workspace",
        target: metadata.workspaceName,
        icon: Settings,
      };

    case "project.created":
      return {
        action: "created the project",
        target: metadata.projectName,
        icon: FolderKanban,
      };

    case "project.updated":
      return {
        action: "updated the project",
        target: metadata.projectName,
        icon: FolderKanban,
      };

    case "project.deleted":
      return {
        action: "deleted the project",
        target: metadata.projectName,
        icon: FolderKanban,
      };

    case "task.created":
      return {
        action: "created the task",
        target: metadata.taskTitle,
        icon: CheckSquare,
      };

    case "task.updated":
      return {
        action: "updated the task",
        target: metadata.taskTitle,
        icon: CheckSquare,
      };

    case "task.deleted":
      return {
        action: "deleted the task",
        target: metadata.taskTitle,
        icon: CheckSquare,
      };

    case "task.assigned":
      return {
        action: "assigned a task",
        target: metadata.taskTitle,
        icon: CircleUserRound,
      };

    case "task.status_changed":
      return {
        action: "changed the status of",
        target: metadata.taskTitle,
        icon: CheckSquare,
      };

    case "task.reordered":
      return {
        action: "reordered the task",
        target: metadata.taskTitle,
        icon: CheckSquare,
      };

    case "comment.created":
      return {
        action: "commented on",
        target: metadata.taskTitle || metadata.projectName,
        icon: MessageSquare,
      };

    case "comment.updated":
      return {
        action: "updated a comment on",
        target: metadata.taskTitle || metadata.projectName,
        icon: MessageSquare,
      };

    case "comment.deleted":
      return {
        action: "deleted a comment on",
        target: metadata.taskTitle || metadata.projectName,
        icon: MessageSquare,
      };

    case "member.invited":
      return {
        action: "invited a member",
        target: metadata.memberName || metadata.email,
        icon: UserPlus,
      };

    case "member.joined":
      return {
        action: "joined the workspace",
        target: null,
        icon: UserPlus,
      };

    case "member.invitation_rejected":
      return {
        action: "rejected an invitation",
        target: null,
        icon: Users,
      };

    case "member.role_changed":
      return {
        action: "changed a member's role",
        target: metadata.memberName,
        icon: Users,
      };

    case "member.removed":
      return {
        action: "removed a member",
        target: metadata.memberName,
        icon: Users,
      };

    case "member.left":
      return {
        action: "left the workspace",
        target: null,
        icon: Users,
      };

    default:
      return {
        action: "performed an activity",
        target: null,
        icon: Activity,
      };
  }
};