/**
 * Validation middleware for task management API
 */

const VALID_PRIORITIES = ["low", "medium", "high"];
const VALID_STATUSES = ["pending", "completed"];

// Utility function to sanitize string input
const sanitizeString = (str) => {
  if (typeof str !== "string") return str;
  return str.trim().replace(/[<>]/g, ""); // Basic XSS prevention
};

// Utility function to validate ID format
const isValidId = (id) => {
  return (
    typeof id === "string" && id.length > 0 && /^task_\d+_[a-z0-9]+$/.test(id)
  );
};

export const validateCreateTask = (req, res, next) => {
  const { title, description, priority } = req.body;
  const errors = [];

  // Validate title (required)
  if (!title || typeof title !== "string" || title.trim().length === 0) {
    errors.push("Title is required and must be a non-empty string");
  } else if (title.trim().length > 200) {
    errors.push("Title must not exceed 200 characters");
  }

  // Validate description (optional)
  if (description !== undefined) {
    if (typeof description !== "string") {
      errors.push("Description must be a string");
    } else if (description.length > 1000) {
      errors.push("Description must not exceed 1000 characters");
    }
  }

  // Validate priority (optional, with enum validation)
  if (priority !== undefined) {
    if (!VALID_PRIORITIES.includes(priority)) {
      errors.push(`Priority must be one of: ${VALID_PRIORITIES.join(", ")}`);
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: "Validation Error",
      message: "Invalid input data",
      details: errors,
    });
  }

  // Sanitize input
  req.body.title = sanitizeString(title);
  if (description) {
    req.body.description = sanitizeString(description);
  }

  next();
};

export const validateUpdateTaskStatus = (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;
  const errors = [];

  // Validate ID format
  if (!isValidId(id)) {
    errors.push("Invalid task ID format");
  }

  // Validate status (required boolean or valid status string)
  if (status === undefined || status === null) {
    errors.push("Status is required");
  } else if (typeof status === "boolean") {
    // Convert boolean to status string
    req.body.status = status;
  } else if (typeof status === "string" && VALID_STATUSES.includes(status)) {
    // Convert status string to boolean for consistency
    req.body.status = status === "completed";
  } else {
    errors.push("Status must be a boolean or one of: pending, completed");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: "Validation Error",
      message: "Invalid input data",
      details: errors,
    });
  }

  next();
};

export const validateTaskId = (req, res, next) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    return res.status(400).json({
      success: false,
      error: "Validation Error",
      message: "Invalid task ID format",
      details: ["Task ID must be in the correct format"],
    });
  }

  next();
};

export const validateQueryParams = (req, res, next) => {
  const { status, priority, sortBy } = req.query;
  const errors = [];

  // Validate status filter
  if (status && !VALID_STATUSES.includes(status)) {
    errors.push(`Status filter must be one of: ${VALID_STATUSES.join(", ")}`);
  }

  // Validate priority filter
  if (priority && !VALID_PRIORITIES.includes(priority)) {
    errors.push(
      `Priority filter must be one of: ${VALID_PRIORITIES.join(", ")}`
    );
  }

  // Validate sortBy parameter
  const validSortFields = ["title", "priority", "status", "createdAt"];
  if (sortBy && !validSortFields.includes(sortBy)) {
    errors.push(`Sort field must be one of: ${validSortFields.join(", ")}`);
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: "Validation Error",
      message: "Invalid query parameters",
      details: errors,
    });
  }

  next();
};
