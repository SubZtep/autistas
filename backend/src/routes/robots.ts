import { Hono } from "hono"

const robots = new Hono()

// Respond to GET / with a deny-all robots.txt
robots.get("/", c => {
  const body = `User-agent: *\nDisallow: /`
  return c.text(body, 200, { "Content-Type": "text/plain; charset=utf-8" })
})

export default robots
