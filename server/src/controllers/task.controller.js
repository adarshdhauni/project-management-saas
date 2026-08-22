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
  const result = await taskService.getTasks(
    req.user._id,
    req.params.projectId,
    req.query,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Tasks retrieved successfully."));
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

const deleteTask = asyncHandler(async (req, res) => {
  await taskService.deleteTask(req.user._id, req.params.taskId);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Task deleted successfully."));
});

const moveTask = asyncHandler(async (req, res) => {
  const task = await taskService.moveTask(
    req.user._id,
    req.params.taskId,
    req.body.beforeTaskId,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task position updated successfully."));
});

const taskController = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  moveTask
};

export default taskController;
