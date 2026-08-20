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

const getTaskById = asyncHandler(async (req, res) => {
  const task = await taskService.getTaskById(req.user._id, req.params.taskId);

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task retrieved successfully."));
});

const updateTask = asyncHandler(async (req, res) => {
  const updatedTask = await taskService.updateTask(
    req.user._id,
    req.params.taskId,
    req.body,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedTask, "Task updated successfully."));
});

const taskController = {
  createTask,
  getTasks,
  getTaskById,
  updateTask
};

export default taskController;
