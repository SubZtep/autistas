import { OpenAPIHono } from "@hono/zod-openapi"
import { swaggerUI } from "@hono/swagger-ui"
import { cors } from "hono/cors"
import { logger } from "hono/logger"
import { env } from "./config/env.js"
import chatRoute from "./routes/chat.js"
import healthRoute from "./routes/health.js"
import robotsRoute from "./routes/robots.js"

const app = new OpenAPIHono({
  defaultHook: (result, c) => {
    if (!result.success) {
      return c.json(
        {
          error: "Validation failed",
          details: result.error.flatten(),
        },
        400,
      )
    }
  },
})

// Middleware
app.use("*", logger())
app.use(
  "*",
  cors({
    origin: env.ALLOWED_ORIGINS === "*" ? "*" : env.ALLOWED_ORIGINS.split(","),
    credentials: true,
  }),
)

// Routes
app.route("/health", healthRoute)
app.route("/api/chat", chatRoute)
app.route("/robots.txt", robotsRoute)

// Root route
app.get("/", c => {
  return c.json({
    name: "Autistas API",
    version: process.env.npm_package_version,
  })
})

// Favicon - no icon served, avoid 404 noise
app.get("/favicon.ico", c => c.body(null, 204))

// OpenAPI documentation endpoint
app.doc("/doc", {
  openapi: "3.1.0",
  info: {
    title: "Autistas API",
    version: "0.1.0",
    description: "API for Autistas - A mobile app to help parents and caregivers of kids with autism",
  },
  servers: [
    {
      url: "https://localhost:3000",
      description: "Local HTTPS server",
    },
    {
      url: "http://localhost:3000",
      description: "Local HTTP server",
    },
  ],
})

// Swagger UI endpoint
app.get("/ui", swaggerUI({ url: "/doc" }))

// 404 handler
app.notFound(c => {
  return c.json({ error: "Not found" }, 404)
})

// Error handler
app.onError((err, c) => {
  console.error("Server error:", err)
  return c.json({ error: "Internal server error" }, 500)
})

export default app
