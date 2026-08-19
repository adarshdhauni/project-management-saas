import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import taskService from "../services/task.service.js";

const createTask = asyncHandler(async (req, res) => {
  const task = await taskService.createTask(
    req.user._id,
    req.params.projectId,
    req.body,
  );

  return res
    .status(201)
    .json(new ApiResponse(201, task, "Task created successfully."));
});

const taskController = {
    createTask
}

export default taskController
