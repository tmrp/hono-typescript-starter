import { describe, it, expect, beforeEach } from "vitest";
import { users } from "../src/routes/users";

describe("Users Routes", () => {
  // Reset the user store before each test by importing and clearing it
  // Since userStore is not exported, we'll need to test through the API
  beforeEach(async () => {
    // Clear all users by deleting them one by one
    // First, get all users
    const getRes = await users.request("/");
    const getBody = await getRes.json();
    const existingUsers = getBody.users || [];

    // Delete each user
    for (const user of existingUsers) {
      await users.request(`/${user.id}`, { method: "DELETE" });
    }
  });

  describe("GET /api/users", () => {
    it("should return empty array when no users exist", async () => {
      const res = await users.request("/");
      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body).toHaveProperty("users");
      expect(Array.isArray(body.users)).toBe(true);
      expect(body.users).toHaveLength(0);
    });

    it("should return all users", async () => {
      // Create a user first
      const createRes = await users.request("/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "John Doe",
          email: "john@example.com",
        }),
      });

      expect(createRes.status).toBe(201);

      // Get all users
      const res = await users.request("/");
      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body.users).toHaveLength(1);
      expect(body.users[0]).toHaveProperty("id");
      expect(body.users[0]).toHaveProperty("name", "John Doe");
      expect(body.users[0]).toHaveProperty("email", "john@example.com");
    });
  });

  describe("GET /api/users/:id", () => {
    it("should return 404 when user does not exist", async () => {
      const res = await users.request("/non-existent-id");
      expect(res.status).toBe(404);

      const body = await res.json();
      expect(body).toHaveProperty("error", "User not found");
    });

    it("should return user by id", async () => {
      // Create a user first
      const createRes = await users.request("/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Jane Doe",
          email: "jane@example.com",
        }),
      });

      const createBody = await createRes.json();
      const userId = createBody.user.id;

      // Get user by id
      const res = await users.request(`/${userId}`);
      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body).toHaveProperty("user");
      expect(body.user).toHaveProperty("id", userId);
      expect(body.user).toHaveProperty("name", "Jane Doe");
      expect(body.user).toHaveProperty("email", "jane@example.com");
    });
  });

  describe("POST /api/users", () => {
    it("should create a new user with valid data", async () => {
      const res = await users.request("/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Alice Smith",
          email: "alice@example.com",
        }),
      });

      expect(res.status).toBe(201);

      const body = await res.json();
      expect(body).toHaveProperty("user");
      expect(body.user).toHaveProperty("id");
      expect(typeof body.user.id).toBe("string");
      expect(body.user).toHaveProperty("name", "Alice Smith");
      expect(body.user).toHaveProperty("email", "alice@example.com");
    });

    it("should return 400 when name is too short", async () => {
      const res = await users.request("/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "A",
          email: "alice@example.com",
        }),
      });

      expect(res.status).toBe(400);
    });

    it("should return 400 when name is too long", async () => {
      const longName = "A".repeat(101);
      const res = await users.request("/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: longName,
          email: "alice@example.com",
        }),
      });

      expect(res.status).toBe(400);
    });

    it("should return 400 when email is invalid", async () => {
      const res = await users.request("/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Alice Smith",
          email: "invalid-email",
        }),
      });

      expect(res.status).toBe(400);
    });

    it("should return 400 when name is missing", async () => {
      const res = await users.request("/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "alice@example.com",
        }),
      });

      expect(res.status).toBe(400);
    });

    it("should return 400 when email is missing", async () => {
      const res = await users.request("/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Alice Smith",
        }),
      });

      expect(res.status).toBe(400);
    });
  });

  describe("PUT /api/users/:id", () => {
    it("should update user with valid data", async () => {
      // Create a user first
      const createRes = await users.request("/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Bob Johnson",
          email: "bob@example.com",
        }),
      });

      const createBody = await createRes.json();
      const userId = createBody.user.id;

      // Update user
      const res = await users.request(`/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Bob Updated",
          email: "bob.updated@example.com",
        }),
      });

      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body).toHaveProperty("user");
      expect(body.user).toHaveProperty("id", userId);
      expect(body.user).toHaveProperty("name", "Bob Updated");
      expect(body.user).toHaveProperty("email", "bob.updated@example.com");
    });

    it("should update only name when only name is provided", async () => {
      // Create a user first
      const createRes = await users.request("/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Charlie Brown",
          email: "charlie@example.com",
        }),
      });

      const createBody = await createRes.json();
      const userId = createBody.user.id;
      const originalEmail = createBody.user.email;

      // Update only name
      const res = await users.request(`/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Charlie Updated",
        }),
      });

      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body.user).toHaveProperty("name", "Charlie Updated");
      expect(body.user).toHaveProperty("email", originalEmail);
    });

    it("should update only email when only email is provided", async () => {
      // Create a user first
      const createRes = await users.request("/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "David Wilson",
          email: "david@example.com",
        }),
      });

      const createBody = await createRes.json();
      const userId = createBody.user.id;
      const originalName = createBody.user.name;

      // Update only email
      const res = await users.request(`/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "david.updated@example.com",
        }),
      });

      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body.user).toHaveProperty("name", originalName);
      expect(body.user).toHaveProperty("email", "david.updated@example.com");
    });

    it("should return 404 when user does not exist", async () => {
      const res = await users.request("/non-existent-id", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Updated Name",
        }),
      });

      expect(res.status).toBe(404);

      const body = await res.json();
      expect(body).toHaveProperty("error", "User not found");
    });

    it("should return 400 when name is too short", async () => {
      // Create a user first
      const createRes = await users.request("/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Eve Adams",
          email: "eve@example.com",
        }),
      });

      const createBody = await createRes.json();
      const userId = createBody.user.id;

      // Try to update with invalid name
      const res = await users.request(`/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "E",
        }),
      });

      expect(res.status).toBe(400);
    });

    it("should return 400 when email is invalid", async () => {
      // Create a user first
      const createRes = await users.request("/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Frank Miller",
          email: "frank@example.com",
        }),
      });

      const createBody = await createRes.json();
      const userId = createBody.user.id;

      // Try to update with invalid email
      const res = await users.request(`/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "invalid-email",
        }),
      });

      expect(res.status).toBe(400);
    });
  });

  describe("DELETE /api/users/:id", () => {
    it("should delete user by id", async () => {
      // Create a user first
      const createRes = await users.request("/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Grace Lee",
          email: "grace@example.com",
        }),
      });

      const createBody = await createRes.json();
      const userId = createBody.user.id;

      // Delete user
      const res = await users.request(`/${userId}`, {
        method: "DELETE",
      });

      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body).toHaveProperty("message", "User deleted");

      // Verify user is deleted
      const getRes = await users.request(`/${userId}`);
      expect(getRes.status).toBe(404);
    });

    it("should return 404 when user does not exist", async () => {
      const res = await users.request("/non-existent-id", {
        method: "DELETE",
      });

      expect(res.status).toBe(404);

      const body = await res.json();
      expect(body).toHaveProperty("error", "User not found");
    });
  });
});

