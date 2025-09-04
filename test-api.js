/**
 * API Testing Script
 * This script demonstrates all the API endpoints and their functionality
 * Run this after starting the server to test all endpoints
 */

const API_BASE = "http://localhost:3000";

async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();
    console.log(`${options.method || "GET"} ${url}`);
    console.log(`Status: ${response.status}`);
    console.log("Response:", JSON.stringify(data, null, 2));
    console.log("---");

    return { response, data };
  } catch (error) {
    console.error(
      `Error with ${options.method || "GET"} ${url}:`,
      error.message
    );
    console.log("---");
    return null;
  }
}

async function testAPI() {
  console.log("🧪 Testing Task Management API with Swagger Documentation\n");

  // Test 1: Health Check
  console.log("1️⃣ Testing Health Check");
  await makeRequest(`${API_BASE}/health`);

  // Test 2: Root endpoint
  console.log("2️⃣ Testing Root Endpoint");
  await makeRequest(`${API_BASE}/`);

  // Test 3: Get all tasks (empty initially)
  console.log("3️⃣ Testing Get All Tasks (Empty)");
  await makeRequest(`${API_BASE}/api/tasks`);

  // Test 4: Create a new task
  console.log("4️⃣ Testing Create Task");
  const createResult = await makeRequest(`${API_BASE}/api/tasks`, {
    method: "POST",
    body: JSON.stringify({
      title: "Test Swagger Documentation",
      description: "Verify that Swagger docs are working correctly",
      priority: "high",
    }),
  });

  const taskId = createResult?.data?.data?.id;

  // Test 5: Create another task
  console.log("5️⃣ Testing Create Another Task");
  await makeRequest(`${API_BASE}/api/tasks`, {
    method: "POST",
    body: JSON.stringify({
      title: "Review API Implementation",
      description: "Check all endpoints and error handling",
      priority: "medium",
    }),
  });

  // Test 6: Get all tasks (should have 2 now)
  console.log("6️⃣ Testing Get All Tasks (With Data)");
  await makeRequest(`${API_BASE}/api/tasks`);

  // Test 7: Get task by ID
  if (taskId) {
    console.log("7️⃣ Testing Get Task by ID");
    await makeRequest(`${API_BASE}/api/tasks/${taskId}`);
  }

  // Test 8: Update task status
  if (taskId) {
    console.log("8️⃣ Testing Update Task Status");
    await makeRequest(`${API_BASE}/api/tasks/${taskId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status: true }),
    });
  }

  // Test 9: Filter by status
  console.log("9️⃣ Testing Filter by Status");
  await makeRequest(`${API_BASE}/api/tasks?status=completed`);

  // Test 10: Filter by priority
  console.log("🔟 Testing Filter by Priority");
  await makeRequest(`${API_BASE}/api/tasks?priority=high`);

  // Test 11: Sort by creation date
  console.log("1️⃣1️⃣ Testing Sort by Created Date");
  await makeRequest(`${API_BASE}/api/tasks?sortBy=createdAt`);

  // Test 12: Error handling - Invalid task ID
  console.log("1️⃣2️⃣ Testing Error Handling - Invalid Task ID");
  await makeRequest(`${API_BASE}/api/tasks/invalid-id`);

  // Test 13: Error handling - Missing required field
  console.log("1️⃣3️⃣ Testing Error Handling - Missing Title");
  await makeRequest(`${API_BASE}/api/tasks`, {
    method: "POST",
    body: JSON.stringify({
      description: "Task without title",
      priority: "low",
    }),
  });

  // Test 14: Delete task
  if (taskId) {
    console.log("1️⃣4️⃣ Testing Delete Task");
    await makeRequest(`${API_BASE}/api/tasks/${taskId}`, {
      method: "DELETE",
    });
  }

  // Test 15: 404 endpoint
  console.log("1️⃣5️⃣ Testing 404 Error");
  await makeRequest(`${API_BASE}/nonexistent-endpoint`);

  console.log("✅ API Testing Complete!");
  console.log(
    "\n📚 Swagger Documentation available at: http://localhost:3000/api-docs"
  );
  console.log("🔍 Interactive API testing available in Swagger UI");
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === "undefined") {
  console.log("❌ This script requires Node.js 18+ for fetch API support");
  console.log(
    "Alternative: Use curl, Postman, or access Swagger UI at http://localhost:3000/api-docs"
  );
} else {
  testAPI().catch(console.error);
}

export default testAPI;
