import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 100,
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
    },
    description: { type: String, trim: true, maxLength: 500 },
    logo: { type: String, trim: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    visibility: {
      type: String,
      enum: ["private"],
      default: "private",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Workspace = mongoose.model("Workspace", workspaceSchema);

export default Workspace;
