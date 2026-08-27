import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        "workspace.created",
        "workspace.updated",
        "workspace.deleted",

        "project.created",
        "project.updated",
        "project.deleted",

        "task.created",
        "task.updated",
        "task.deleted",
        "task.assigned",
        "task.status_changed",
        "task.reordered",

        "comment.created",
        "comment.updated",
        "comment.deleted",

        "member.invited",
        "member.joined",
        "member.invitation_rejected",
        "member.role_changed",
        "member.removed",
        "member.left",
      ],
    },
    entityType: {
      type: String,
      required: true,
      enum: ["Workspace", "Project", "Task", "Comment", "WorkspaceMember"],
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

activitySchema.index({
  workspace: 1,
  createdAt: -1,
});

activitySchema.index({
  entityType: 1,
  entityId: 1,
});

const Activity = mongoose.model("activity", activitySchema);

export default Activity;
