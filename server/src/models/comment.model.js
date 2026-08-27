import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      minLength: 1,
      maxLength: 2000,
    },
  },
  {
    timestamps: true,
  },
);

const Comment = mongoose.model("comment", commentSchema);

export default Comment;
