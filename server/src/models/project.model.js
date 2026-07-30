import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 100,
    },
    description: { type: String, trim: true, maxLength: 500 },
    color: { type: String, trim: true },
    icon: {
      type: String,
      trim: true,
    },
    isArchived: { type: Boolean, default: false },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

projectSchema.index(
  {
    workspace: 1,
    name: 1,
  },
  {
    unique: true,
  },
);

const Project = mongoose.model("project", projectSchema);

export default Project;
