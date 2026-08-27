import taskRepository from "../repositories/task.repository.js";
import projectRepository from "../repositories/project.repository.js";
import workspaceMemberRepository from "../repositories/workspace-member.repository.js";
import ApiError from "../utils/ApiError.js";
import activityService from "./activity.service.js";

const createTask = async (userId, projectId, taskData) => {
  const project = await projectRepository.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  const membership = await workspaceMemberRepository.findByWorkspaceAndUser(
    project.workspace,
    userId,
  );

  if (!membership) {
    throw new ApiError(403, "You do not have access to this workspace.");
  }

  if (taskData.assignee) {
    const assigneeMembership =
      await workspaceMemberRepository.findByWorkspaceAndUser(
        project.workspace,
        taskData.assignee,
      );

    if (!assigneeMembership) {
      throw new ApiError(400, "Assignee must be a member of the workspace.");
    }
  }

  const lastTask = await taskRepository.findLastByProject(projectId);

  const position = lastTask ? lastTask.position + 1000 : 1000;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const task = await taskRepository.create(
      {
        ...taskData,
        project: projectId,
        createdBy: userId,
        position,
      },
      { session },
    );

    await activityService.createActivity(
      {
        workspaceId: project.workspace,
        userId,
        action: "task.created",
        entityType: "Task",
        entityId: task._id,
        metadata: {
          title: task.title,
        },
      },
      { session },
    );

    await session.commitTransaction();

    return task;
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    await session.endSession();
  }
};

const getTasks = async (userId, projectId, filters = {}) => {
  const project = await projectRepository.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  const membership = await workspaceMemberRepository.findByWorkspaceAndUser(
    project.workspace,
    userId,
  );

  if (!membership) {
    throw new ApiError(403, "You do not have access to this workspace.");
  }

  const result = await taskRepository.findAllByProject(projectId, filters);

  return result;
};

const getTaskById = async (userId, taskId) => {
  const task = await taskRepository.findById(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found.");
  }

  const project = await projectRepository.findById(task.project);

  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  const membership = await workspaceMemberRepository.findByWorkspaceAndUser(
    project.workspace,
    userId,
  );

  if (!membership) {
    throw new ApiError(403, "You do not have access to this workspace.");
  }

  return task;
};

const updateTask = async (userId, taskId, taskData) => {
  const task = await taskRepository.findById(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found.");
  }

  const project = await projectRepository.findById(task.project);

  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  const membership = await workspaceMemberRepository.findByWorkspaceAndUser(
    project.workspace,
    userId,
  );

  if (!membership) {
    throw new ApiError(403, "You do not have access to this workspace.");
  }

  if (taskData.assignee !== undefined && taskData.assignee !== null) {
    const assigneeMembership =
      await workspaceMemberRepository.findByWorkspaceAndUser(
        project.workspace,
        taskData.assignee,
      );

    if (!assigneeMembership) {
      throw new ApiError(400, "Assignee must be a member of the workspace.");
    }
  }

  const changes = {};

  for (const [key, value] of Object.entries(taskData)) {
    if (task[key]?.toString() !== value?.toString()) {
      changes[key] = {
        from: task[key],
        to: value,
      };
    }
  }

  if (Object.keys(changes).length === 0) {
    throw new ApiError(400, "No changes provided.");
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const updatedTask = await taskRepository.updateById(taskId, taskData, {
      session,
    });

    if (changes.status) {
      await activityService.createActivity(
        {
          workspaceId: project.workspace,
          userId,
          action: "task.status_changed",
          entityType: "Task",
          entityId: task._id,
          metadata: {
            from: changes.status.from,
            to: changes.status.to,
          },
        },
        { session },
      );
    }

    if (changes.assignee) {
      await activityService.createActivity(
        {
          workspaceId: project.workspace,
          userId,
          action: "task.assigned",
          entityType: "Task",
          entityId: task._id,
          metadata: {
            from: changes.assignee.from,
            to: changes.assignee.to,
          },
        },
        { session },
      );
    }

    const otherChanges = { ...changes };

    delete otherChanges.status;
    delete otherChanges.assignee;

    if (Object.keys(otherChanges).length > 0) {
      await activityService.createActivity(
        {
          workspaceId: project.workspace,
          userId,
          action: "task.updated",
          entityType: "Task",
          entityId: task._id,
          metadata: {
            changes: otherChanges,
          },
        },
        { session },
      );
    }

    await session.commitTransaction();

    return updatedTask;
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    await session.endSession();
  }
};

const deleteTask = async (userId, taskId) => {
  const task = await taskRepository.findById(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found.");
  }

  const project = await projectRepository.findById(task.project);

  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  const membership = await workspaceMemberRepository.findByWorkspaceAndUser(
    project.workspace,
    userId,
  );

  if (!membership) {
    throw new ApiError(403, "You do not have access to this workspace.");
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    await taskRepository.deleteById(taskId, { session });

    await activityService.createActivity(
      {
        workspaceId: project.workspace,
        userId,
        action: "task.deleted",
        entityType: "Task",
        entityId: task._id,
        metadata: {
          title: task.title,
        },
      },
      { session },
    );

    await session.commitTransaction();

    return;
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    await session.endSession();
  }
};

const moveTask = async (userId, taskId, beforeTaskId = null) => {
  const task = await taskRepository.findById(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found.");
  }

  const project = await projectRepository.findById(task.project);

  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  const membership = await workspaceMemberRepository.findByWorkspaceAndUser(
    project.workspace,
    userId,
  );

  if (!membership) {
    throw new ApiError(403, "You do not have access to this workspace.");
  }

  if (beforeTaskId === taskId) {
    throw new ApiError(400, "A task cannot be moved before itself.");
  }

  let newPosition;

  if (beforeTaskId) {
    const beforeTask = await taskRepository.findById(beforeTaskId);

    if (!beforeTask) {
      throw new ApiError(404, "Target task not found.");
    }

    if (!beforeTask.project.equals(task.project)) {
      throw new ApiError(
        400,
        "Target task does not belong to the same project.",
      );
    }

    const previousTask = await taskRepository.findPreviousByProjectAndPosition(
      task.project,
      beforeTask.position,
      taskId,
    );

    if (!previousTask) {
      newPosition = beforeTask.position / 2;
    } else {
      newPosition = (previousTask.position + beforeTask.position) / 2;
    }
  } else {
    const lastTask = await taskRepository.findLastByProject(
      task.project,
      taskId,
    );

    newPosition = lastTask ? lastTask.position + 1000 : 1000;
  }

  if (newPosition === task.position) {
    throw new ApiError(400, "Task is already in this position.");
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const updatedTask = await taskRepository.updateById(
      taskId,
      {
        position: newPosition,
      },
      { session },
    );

    await activityService.createActivity(
      {
        workspaceId: project.workspace,
        userId,
        action: "task.reordered",
        entityType: "Task",
        entityId: task._id,
        metadata: {
          fromPosition: task.position,
          toPosition: newPosition,
          beforeTaskId,
        },
      },
      { session },
    );

    await session.commitTransaction();

    return updatedTask;
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    await session.endSession();
  }
};

const taskService = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  moveTask,
};

export default taskService;
