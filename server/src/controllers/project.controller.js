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

const updateProject = asyncHandler(async (req, res) => {
  const updatedProject = await projectService.updateProject(
    req.user._id,
    req.params.projectId,
    req.body,
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedProject, "Project updated successfully."),
    );
});

const deleteProject = asyncHandler(async (req, res) => {
  await projectService.deleteProject(req.user._id, req.params.projectId);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Project deleted successfully."));
});

const projectController = {
  createProject,
  getWorkspaceProjects,
  getProjectById,
  updateProject,
  deleteProject
};

export default projectController;
