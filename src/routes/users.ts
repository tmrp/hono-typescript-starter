import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const users = new Hono();

// In-memory storage (replace with database)
const userStore: Array<{ id: string; name: string; email: string }> = [];

// Validation schemas
const createUserSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
});

const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
});

// GET all users
users.get("/", c => {
  return c.json({ users: userStore });
});

// GET user by ID
users.get("/:id", c => {
  const id = c.req.param("id");
  const user = userStore.find(u => u.id === id);

  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  return c.json({ user });
});

// POST create user
users.post("/", zValidator("json", createUserSchema), c => {
  const data = c.req.valid("json");
  const newUser = {
    id: crypto.randomUUID(),
    ...data,
  };

  userStore.push(newUser);
  return c.json({ user: newUser }, 201);
});

// PUT update user
users.put("/:id", zValidator("json", updateUserSchema), c => {
  const id = c.req.param("id");
  const data = c.req.valid("json");
  const userIndex = userStore.findIndex(u => u.id === id);

  if (userIndex === -1) {
    return c.json({ error: "User not found" }, 404);
  }

  userStore[userIndex] = { ...userStore[userIndex], ...data };
  return c.json({ user: userStore[userIndex] });
});

// DELETE user
users.delete("/:id", c => {
  const id = c.req.param("id");
  const userIndex = userStore.findIndex(u => u.id === id);

  if (userIndex === -1) {
    return c.json({ error: "User not found" }, 404);
  }

  userStore.splice(userIndex, 1);
  return c.json({ message: "User deleted" });
});

export { users };
