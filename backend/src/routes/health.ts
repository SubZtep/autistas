import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi"

const health = new OpenAPIHono()

// Health response schema
const HealthResponseSchema = z
  .object({
    status: z.string().openapi({ example: "ok" }),
    timestamp: z.string().openapi({ example: "2025-11-09T17:00:00.000Z" }),
    service: z.string().openapi({ example: "autistas-backend" }),
    version: z.string().openapi({ example: "0.1.0" }),
  })
  .openapi("HealthResponse")

// Health check route definition
const healthRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["System"],
  summary: "Health check",
  description: "Check if the API is running and healthy",
  responses: {
    200: {
      description: "Service is healthy",
      content: {
        "application/json": {
          schema: HealthResponseSchema,
        },
      },
    },
  },
})

// Register route
health.openapi(healthRoute, c => {
  return c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "autistas-backend",
    version: "0.1.0",
  })
})

export default health
