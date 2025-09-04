import express from "express";
import cors from "cors";
import taskRoutes from "./routes/tasks.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { specs, swaggerUi } from "./swagger.js";
import taskStorage from "./data/taskStorage.js";

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * Middleware Configuration
 */

// CORS middleware - allow cross-origin requests
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (development)
if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });
}

/**
 * Routes
 */

// Swagger Documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Task Management API Documentation",
  })
);

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     description: Check if the API is running and responsive
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy and running
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 *             example:
 *               success: true
 *               message: "Task Management API is running"
 *               timestamp: "2023-12-20T10:30:45.123Z"
 *               version: "1.0.0"
 */
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Task Management API is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// API routes
app.use("/api/tasks", taskRoutes);

/**
 * @swagger
 * /:
 *   get:
 *     summary: API Information
 *     description: Get basic information about the API and available endpoints
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Welcome to Task Management API"
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 *                 endpoints:
 *                   type: object
 *                   description: Available API endpoints
 *             example:
 *               success: true
 *               message: "Welcome to Task Management API"
 *               version: "1.0.0"
 *               endpoints:
 *                 "GET /health": "Health check"
 *                 "GET /api/tasks": "Get all tasks (with optional filters: status, priority, sortBy)"
 *                 "GET /api/tasks/:id": "Get task by ID"
 *                 "POST /api/tasks": "Create new task"
 *                 "PUT /api/tasks/:id/status": "Update task status"
 *                 "DELETE /api/tasks/:id": "Delete task"
 *                 "GET /api-docs": "API Documentation"
 */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Task Management API",
    version: "1.0.0",
    endpoints: {
      "GET /health": "Health check",
      "GET /api/tasks":
        "Get all tasks (with optional filters: status, priority, sortBy)",
      "GET /api/tasks/:id": "Get task by ID",
      "POST /api/tasks": "Create new task",
      "PUT /api/tasks/:id/status": "Update task status",
      "DELETE /api/tasks/:id": "Delete task",
      "GET /api-docs": "API Documentation",
    },
  });
});

/**
 * Error Handling Middleware
 */

// 404 handler for undefined routes
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

/**
 * Server Startup
 */

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`🚀 Task Management API is running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`📋 API endpoints: http://localhost:${PORT}/api/tasks`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err.message);
  console.error("Shutting down server...");
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.message);
  console.error("Shutting down server...");
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  await taskStorage.close();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT received. Shutting down gracefully...");
  await taskStorage.close();
  process.exit(0);
});

startServer();

export default app;
