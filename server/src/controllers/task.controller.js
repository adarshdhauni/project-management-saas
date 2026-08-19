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

const getTasks = asyncHandler(async (req, res) => {
  const tasks = await taskService.getTasks(req.user._id, req.params.projectId);

  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "Tasks retrieved successfully."));
});

const taskController = {
  createTask,
  getTasks
};

export default taskController;
