import taskStorage from "../data/taskStorage.js";

/**
 * Task Controller - Business logic for task management
 */

export const getAllTasks = async (req, res, next) => {
  try {
    const { status, priority, sortBy } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (priority) filters.priority = priority;
    if (sortBy) filters.sortBy = sortBy;

    const tasks = await taskStorage.getAllTasks(filters);

    res.status(200).json({
      success: true,
      data: tasks,
      message: `Retrieved ${tasks.length} task(s)`,
      count: tasks.length,
    });
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const { title, description, priority } = req.body;

    const taskData = {
      title,
      description,
      priority,
    };

    const newTask = await taskStorage.createTask(taskData);

    res.status(201).json({
      success: true,
      data: newTask,
      message: "Task created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateTaskStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedTask = await taskStorage.updateTaskStatus(id, status);

    res.status(200).json({
      success: true,
      data: updatedTask,
      message: "Task status updated successfully",
    });
  } catch (error) {
    if (error.message === "Task not found") {
      return res.status(404).json({
        success: false,
        error: "Not Found",
        message: "Task not found",
        details: [`Task with ID ${req.params.id} does not exist`],
      });
    }
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedTask = await taskStorage.deleteTask(id);

    res.status(200).json({
      success: true,
      data: deletedTask,
      message: "Task deleted successfully",
    });
  } catch (error) {
    if (error.message === "Task not found") {
      return res.status(404).json({
        success: false,
        error: "Not Found",
        message: "Task not found",
        details: [`Task with ID ${req.params.id} does not exist`],
      });
    }
    next(error);
  }
};

export const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const task = await taskStorage.getTaskById(id);

    res.status(200).json({
      success: true,
      data: task,
      message: "Task retrieved successfully",
    });
  } catch (error) {
    if (error.message === "Task not found") {
      return res.status(404).json({
        success: false,
        error: "Not Found",
        message: "Task not found",
        details: [`Task with ID ${req.params.id} does not exist`],
      });
    }
    next(error);
  }
};
