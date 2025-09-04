import express from "express";
import {
  getAllTasks,
  createTask,
  updateTaskStatus,
  deleteTask,
  getTaskById,
} from "../controllers/taskController.js";
import {
  validateCreateTask,
  validateUpdateTaskStatus,
  validateTaskId,
  validateQueryParams,
} from "../middleware/validation.js";

const router = express.Router();

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks
 *     description: Retrieve all tasks with optional filtering and sorting
 *     tags: [Tasks]
 *     parameters:
 *       - $ref: '#/components/parameters/StatusFilter'
 *       - $ref: '#/components/parameters/PriorityFilter'
 *       - $ref: '#/components/parameters/SortBy'
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Task'
 *             example:
 *               success: true
 *               data:
 *                 - id: "task_1703123456789_abc123def"
 *                   title: "Complete project documentation"
 *                   description: "Write comprehensive API documentation"
 *                   priority: "high"
 *                   status: "pending"
 *                   createdAt: "2023-12-20T10:30:45.123Z"
 *               message: "Retrieved 1 task(s)"
 *               count: 1
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/", validateQueryParams, getAllTasks);

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get task by ID
 *     description: Retrieve a specific task by its unique identifier
 *     tags: [Tasks]
 *     parameters:
 *       - $ref: '#/components/parameters/TaskId'
 *     responses:
 *       200:
 *         description: Task retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Task'
 *             example:
 *               success: true
 *               data:
 *                 id: "task_1703123456789_abc123def"
 *                 title: "Complete project documentation"
 *                 description: "Write comprehensive API documentation"
 *                 priority: "high"
 *                 status: "pending"
 *                 createdAt: "2023-12-20T10:30:45.123Z"
 *               message: "Task retrieved successfully"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/:id", validateTaskId, getTaskById);

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     description: Create a new task with title, description, and priority
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskInput'
 *           example:
 *             title: "Complete project documentation"
 *             description: "Write comprehensive API documentation with examples"
 *             priority: "high"
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Task'
 *             example:
 *               success: true
 *               data:
 *                 id: "task_1703123456789_abc123def"
 *                 title: "Complete project documentation"
 *                 description: "Write comprehensive API documentation with examples"
 *                 priority: "high"
 *                 status: "pending"
 *                 createdAt: "2023-12-20T10:30:45.123Z"
 *               message: "Task created successfully"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post("/", validateCreateTask, createTask);

/**
 * @swagger
 * /api/tasks/{id}/status:
 *   put:
 *     summary: Update task status
 *     description: Update the completion status of a task
 *     tags: [Tasks]
 *     parameters:
 *       - $ref: '#/components/parameters/TaskId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskStatusUpdate'
 *           example:
 *             status: true
 *     responses:
 *       200:
 *         description: Task status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Task'
 *             example:
 *               success: true
 *               data:
 *                 id: "task_1703123456789_abc123def"
 *                 title: "Complete project documentation"
 *                 description: "Write comprehensive API documentation"
 *                 priority: "high"
 *                 status: "completed"
 *                 createdAt: "2023-12-20T10:30:45.123Z"
 *               message: "Task status updated successfully"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.put("/:id/status", validateUpdateTaskStatus, updateTaskStatus);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     description: Delete a task by its unique identifier
 *     tags: [Tasks]
 *     parameters:
 *       - $ref: '#/components/parameters/TaskId'
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Task'
 *             example:
 *               success: true
 *               data:
 *                 id: "task_1703123456789_abc123def"
 *                 title: "Complete project documentation"
 *                 description: "Write comprehensive API documentation"
 *                 priority: "high"
 *                 status: "pending"
 *                 createdAt: "2023-12-20T10:30:45.123Z"
 *               message: "Task deleted successfully"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete("/:id", validateTaskId, deleteTask);

export default router;
