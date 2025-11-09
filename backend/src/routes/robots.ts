import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi"

const robots = new OpenAPIHono()

// Robots.txt route definition
const robotsRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["System"],
  summary: "Robots.txt",
  description: "Returns robots.txt file to control web crawler access (deny all)",
  responses: {
    200: {
      description: "Robots.txt content",
      content: {
        "text/plain": {
          schema: z.string().openapi({
            example: "User-agent: *\nDisallow: /",
          }),
        },
      },
    },
  },
})

// Register route
robots.openapi(robotsRoute, c => {
  const body = `User-agent: *\nDisallow: /`
  return c.text(body, 200, { "Content-Type": "text/plain; charset=utf-8" })
})

export default robots
