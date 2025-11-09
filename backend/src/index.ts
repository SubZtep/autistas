import { getRequestListener, serve } from "@hono/node-server"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"
import https from "https"
import { readFileSync } from "node:fs"
import { env } from "./config/env.js"
import { runMigrations } from "./db/migrate.js"
import chatRoute from "./routes/chat.js"
import healthRoute from "./routes/health.js"
import robotsRoute from "./routes/robots.js"

// Run migrations before starting the server
await runMigrations()

const app = new Hono()

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

// 404 handler
app.notFound(c => {
  return c.json({ error: "Not found" }, 404)
})

// Error handler
app.onError((err, c) => {
  console.error("Server error:", err)
  return c.json({ error: "Internal server error" }, 500)
})

const port = Number(env.PORT)
const httpsPort = Number(process.env.HTTPS_PORT ?? 3443)

console.log(`🚀 Server starting (HTTP:${port} / HTTPS:${httpsPort})`)
console.log(`📝 Environment: ${env.NODE_ENV}`)

// Prefer HTTPS when certs are available; otherwise fall back to HTTP
try {
  const tlsOptions = {
    key: readFileSync("./certs/key.pem"),
    cert: readFileSync("./certs/cert.pem"),
  }

  const listener = getRequestListener(app.fetch)
  https.createServer(tlsOptions, listener).listen(httpsPort, () => {
    console.log(`✅ HTTPS server running at https://localhost:${httpsPort}/`)
  })
} catch {
  console.warn("⚠️  HTTPS disabled (missing or invalid certs). Falling back to HTTP.")
  serve({
    fetch: app.fetch,
    port,
  })
  console.log(`✅ HTTP server running at http://localhost:${port}`)
}
