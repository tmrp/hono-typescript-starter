import { Hono } from "hono";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { users } from "./routes/users";

const app = new Hono();

// Middleware
app.use("*", logger());
app.use("*", prettyJSON());

// Routes
app.get("/", c => {
  return c.json({
    message: "Welcome to Hono API",
    endpoints: {
      health: "/health",
      users: "/api/users",
    },
  });
});

app.get("/health", c => {
  return c.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// API routes
app.route("/api/users", users);

export default app;
