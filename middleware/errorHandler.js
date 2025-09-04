/**
 * Global Error Handling Middleware
 */

export const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error("Error occurred:", {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  // Default error response
  let statusCode = 500;
  let errorType = "Internal Server Error";
  let message = "Something went wrong on the server";
  let details = [];

  // Handle specific error types
  if (err.message === "Task not found") {
    statusCode = 404;
    errorType = "Not Found";
    message = "The requested task could not be found";
    details = [err.message];
  } else if (
    err.message.includes("Failed to load tasks") ||
    err.message.includes("Failed to save tasks")
  ) {
    statusCode = 500;
    errorType = "Storage Error";
    message = "Database operation failed";
    details = ["Unable to access task storage"];
  } else if (err.name === "ValidationError") {
    statusCode = 400;
    errorType = "Validation Error";
    message = "Invalid input data";
    details = err.details || [err.message];
  } else if (err.name === "SyntaxError" && err.message.includes("JSON")) {
    statusCode = 400;
    errorType = "Bad Request";
    message = "Invalid JSON format";
    details = ["Request body contains invalid JSON"];
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: errorType,
    message: message,
    details: details,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: "Not Found",
    message: "The requested endpoint does not exist",
    details: [`${req.method} ${req.url} is not a valid endpoint`],
  });
};

export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
