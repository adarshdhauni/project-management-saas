import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import projectService from "../services/project.service.js";

const createProject = asyncHandler(async (req, res) => {
  const project = await projectService.createProject(
    req.user._id,
    req.params.workspaceId,
    req.body,
  );

  return res
    .status(201)
    .json(new ApiResponse(201, project, "Project created successfully."));
});

const getWorkspaceProjects = asyncHandler(async (req, res) => {
  const projects = await projectService.getWorkspaceProjects(
    req.user._id,
    req.params.workspaceId,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, projects, "Projects retrieved successfully."));
});

const getProjectById = asyncHandler(async (req, res) => {
  const project = await projectService.getProjectById(
    req.user._id,
    req.params.projectId,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project retrieved successfully."));
});

const projectController = {
  createProject,
  getWorkspaceProjects,
  getProjectById
};

export default projectController;
