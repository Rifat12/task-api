# Task Management API

A Node.js Express API for task management with file-based JSON storage, built with modern ES6+ syntax and comprehensive error handling.

## Features

- ✅ RESTful API design
- ✅ File-based JSON storage
- ✅ Input validation and sanitization
- ✅ Comprehensive error handling
- ✅ CORS support
- ✅ Query filtering and sorting
- ✅ Auto-generated unique IDs
- ✅ Graceful error responses
- ✅ **Interactive Swagger/OpenAPI Documentation**
- ✅ **Comprehensive API testing interface**

## Project Structure

```
task-management-api/
├── app.js                     # Main server file
├── swagger.js                 # Swagger/OpenAPI configuration
├── package.json              # Dependencies and scripts
├── README.md                 # This file
├── test-api.js               # API testing script
├── routes/
│   └── tasks.js              # Task API endpoints (with Swagger docs)
├── controllers/
│   └── taskController.js     # Business logic
├── data/
│   ├── taskStorage.js        # SQLite database persistence layer
│   └── tasks.json           # Task data storage
└── middleware/
    ├── validation.js         # Input validation
    └── errorHandler.js       # Error handling
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

The server will start on `http://localhost:3000` by default.

## 📚 API Documentation

### Interactive Swagger UI

Access the comprehensive interactive API documentation at:
**http://localhost:3000/api-docs**

The Swagger UI provides:

- 📖 Complete API documentation
- 🧪 Interactive endpoint testing
- 📝 Request/response examples
- 🔍 Schema definitions
- ✅ Input validation details

### Quick Testing

Run the included test script to verify all endpoints:

```bash
node test-api.js
```

## API Endpoints

### Base URL: `/api/tasks`

#### 1. Get All Tasks

```http
GET /api/tasks
```

**Query Parameters:**

- `status` (optional): Filter by status (`pending`, `completed`)
- `priority` (optional): Filter by priority (`low`, `medium`, `high`)
- `sortBy` (optional): Sort by field (`title`, `priority`, `status`, `createdAt`)

**Example:**

```http
GET /api/tasks?status=pending&priority=high&sortBy=createdAt
```

#### 2. Get Task by ID

```http
GET /api/tasks/:id
```

#### 3. Create New Task

```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "priority": "high"
}
```

**Required Fields:**

- `title` (string): Task title (max 200 characters)

**Optional Fields:**

- `description` (string): Task description (max 1000 characters)
- `priority` (enum): Task priority (`low`, `medium`, `high`) - defaults to `medium`

#### 4. Update Task Status

```http
PUT /api/tasks/:id/status
Content-Type: application/json

{
  "status": true
}
```

**Body:**

- `status` (boolean): `true` for completed, `false` for pending

#### 5. Delete Task

```http
DELETE /api/tasks/:id
```

## Response Format

All API responses follow a consistent format:

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error Type",
  "message": "Human-readable error message",
  "details": ["Specific error details"]
}
```

## Task Model

```json
{
  "id": "task_1703123456789_abc123def",
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "priority": "high",
  "status": "pending",
  "createdAt": "2023-12-20T10:30:45.123Z"
}
```

**Fields:**

- `id` (string): Auto-generated unique identifier
- `title` (string): Task title
- `description` (string): Task description
- `priority` (enum): `low`, `medium`, `high`
- `status` (enum): `pending`, `completed`
- `createdAt` (string): ISO timestamp of creation

## Error Handling

The API includes comprehensive error handling for:

- **400 Bad Request**: Invalid input data, malformed JSON
- **404 Not Found**: Task not found, invalid endpoints
- **500 Internal Server Error**: Server errors, storage failures

## Input Validation

- Title: Required, non-empty string, max 200 characters
- Description: Optional string, max 1000 characters
- Priority: Must be `low`, `medium`, or `high`
- Task ID: Must follow the generated format pattern
- Basic XSS protection through input sanitization

## Health Check

```http
GET /health
```

Returns server status and basic information.

## Environment Variables

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment mode (`development`, `production`)
- `CORS_ORIGIN`: CORS origin configuration (default: `*`)

## Error Logging

- All errors are logged to console with timestamps
- Development mode includes stack traces in responses
- Graceful handling of unhandled promise rejections and uncaught exceptions

## Example Usage

### Create a new task

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Review code changes",
    "description": "Review and approve pull request #123",
    "priority": "high"
  }'
```

### Get all high-priority tasks

```bash
curl "http://localhost:3000/api/tasks?priority=high&sortBy=createdAt"
```

### Mark task as completed

```bash
curl -X PUT http://localhost:3000/api/tasks/task_1703123456789_abc123def/status \
  -H "Content-Type: application/json" \
  -d '{"status": true}'
```

## 🔧 Development Tools

### Swagger/OpenAPI Documentation

- **URL**: http://localhost:3000/api-docs
- **Features**: Interactive testing, schema validation, examples
- **Configuration**: `swagger.js` - OpenAPI 3.0 specification
- **Auto-generated**: From JSDoc comments in route files

### Testing

- **Manual Testing**: Use Swagger UI for interactive testing
- **Automated Testing**: Run `node test-api.js` for comprehensive endpoint testing
- **Health Check**: http://localhost:3000/health

### API Documentation Features

- 📊 Complete OpenAPI 3.0 specification
- 🎯 Interactive "Try it out" functionality
- 📋 Request/response examples for all endpoints
- 🔍 Detailed schema definitions with validation rules
- 🏷️ Organized by tags (Tasks, Health)
- ⚡ Real-time testing against running server

## License

ISC
