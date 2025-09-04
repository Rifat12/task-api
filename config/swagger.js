import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task Management API",
      version: "1.0.0",
      description:
        "A comprehensive Node.js Express API for task management with file-based JSON storage",
      contact: {
        name: "API Support",
        email: "support@taskmanagement.com",
      },
      license: {
        name: "ISC",
        url: "https://opensource.org/licenses/ISC",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
      {
        url: "https://tasks-52lu.onrender.com/",
        description: "Production server",
      },
    ],
    components: {
      schemas: {
        Task: {
          type: "object",
          required: ["id", "title", "priority", "status", "createdAt"],
          properties: {
            id: {
              type: "string",
              description: "Auto-generated unique task identifier",
              example: "task_1703123456789_abc123def",
            },
            title: {
              type: "string",
              description: "Task title",
              maxLength: 200,
              example: "Complete project documentation",
            },
            description: {
              type: "string",
              description: "Task description",
              maxLength: 1000,
              example: "Write comprehensive API documentation with examples",
            },
            priority: {
              type: "string",
              enum: ["low", "medium", "high"],
              description: "Task priority level",
              example: "high",
            },
            status: {
              type: "string",
              enum: ["pending", "completed"],
              description: "Task completion status",
              example: "pending",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Task creation timestamp",
              example: "2023-12-20T10:30:45.123Z",
            },
          },
        },
        TaskInput: {
          type: "object",
          required: ["title"],
          properties: {
            title: {
              type: "string",
              description: "Task title",
              maxLength: 200,
              example: "Complete project documentation",
            },
            description: {
              type: "string",
              description: "Task description",
              maxLength: 1000,
              example: "Write comprehensive API documentation with examples",
            },
            priority: {
              type: "string",
              enum: ["low", "medium", "high"],
              description: "Task priority level",
              default: "medium",
              example: "high",
            },
          },
        },
        TaskStatusUpdate: {
          type: "object",
          required: ["status"],
          properties: {
            status: {
              type: "boolean",
              description:
                "Task completion status (true for completed, false for pending)",
              example: true,
            },
          },
        },
        SuccessResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            data: {
              type: "object",
              description: "Response data",
            },
            message: {
              type: "string",
              description: "Success message",
              example: "Operation completed successfully",
            },
            count: {
              type: "integer",
              description: "Number of items (for list responses)",
              example: 5,
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            error: {
              type: "string",
              description: "Error type",
              example: "Validation Error",
            },
            message: {
              type: "string",
              description: "Error message",
              example: "Invalid input data",
            },
            details: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Detailed error information",
              example: ["Title is required and must be a non-empty string"],
            },
          },
        },
        HealthResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Task Management API is running",
            },
            timestamp: {
              type: "string",
              format: "date-time",
              example: "2023-12-20T10:30:45.123Z",
            },
            version: {
              type: "string",
              example: "1.0.0",
            },
          },
        },
      },
      parameters: {
        TaskId: {
          name: "id",
          in: "path",
          required: true,
          description: "Task ID",
          schema: {
            type: "string",
            pattern: "^task_\\d+_[a-z0-9]+$",
            example: "task_1703123456789_abc123def",
          },
        },
        StatusFilter: {
          name: "status",
          in: "query",
          required: false,
          description: "Filter tasks by status",
          schema: {
            type: "string",
            enum: ["pending", "completed"],
            example: "pending",
          },
        },
        PriorityFilter: {
          name: "priority",
          in: "query",
          required: false,
          description: "Filter tasks by priority",
          schema: {
            type: "string",
            enum: ["low", "medium", "high"],
            example: "high",
          },
        },
        SortBy: {
          name: "sortBy",
          in: "query",
          required: false,
          description: "Sort tasks by field",
          schema: {
            type: "string",
            enum: ["title", "priority", "status", "createdAt"],
            example: "createdAt",
          },
        },
      },
      responses: {
        BadRequest: {
          description: "Bad Request - Invalid input data",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
              example: {
                success: false,
                error: "Validation Error",
                message: "Invalid input data",
                details: ["Title is required and must be a non-empty string"],
              },
            },
          },
        },
        NotFound: {
          description: "Not Found - Task not found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
              example: {
                success: false,
                error: "Not Found",
                message: "Task not found",
                details: [
                  "Task with ID task_1703123456789_abc123def does not exist",
                ],
              },
            },
          },
        },
        InternalServerError: {
          description: "Internal Server Error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
              example: {
                success: false,
                error: "Internal Server Error",
                message: "Something went wrong on the server",
                details: [],
              },
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Tasks",
        description: "Task management operations",
      },
      {
        name: "Health",
        description: "API health and status",
      },
    ],
  },
  apis: ["./routes/*.js", "./app.js"], // Path to the API files
};

const specs = swaggerJSDoc(options);

export { specs, swaggerUi };
