import { describe, it, expect } from "vitest";
import { app } from "../src/app";

describe("App Routes", () => {
  describe("GET /", () => {
    it("should return welcome message with endpoints", async () => {
      const res = await app.request("/");
      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body).toHaveProperty("message", "Welcome to Hono API");
      expect(body).toHaveProperty("endpoints");
      expect(body.endpoints).toHaveProperty("health", "/health");
      expect(body.endpoints).toHaveProperty("users", "/api/users");
    });
  });

  describe("GET /health", () => {
    it("should return healthy status with timestamp", async () => {
      const res = await app.request("/health");
      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body).toHaveProperty("status", "healthy");
      expect(body).toHaveProperty("timestamp");
      expect(typeof body.timestamp).toBe("string");
      
      // Verify timestamp is valid ISO string
      const timestamp = new Date(body.timestamp);
      expect(timestamp.getTime()).toBeGreaterThan(0);
    });
  });
});

