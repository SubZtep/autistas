import { getRequestListener, serve } from "@hono/node-server"
import https from "https"
import { readFileSync } from "node:fs"
import app from "./app.js"
import { env } from "./config/env.js"
import { runMigrations } from "./db/migrate.js"

// Run migrations before starting the server
await runMigrations()

const port = Number(env.PORT)
const httpsPort = Number(process.env.HTTPS_PORT ?? 3443)

console.log(`🚀 Server starting (HTTP:${port} / HTTPS:${httpsPort})`)
console.log(`📝 Environment: ${env.NODE_ENV}`)

// Prefer HTTPS when certs are available; otherwise fall back to HTTP
try {
  const tlsOptions = {
    cert: readFileSync("./certs/origin.crt"),
    key: readFileSync("./certs/origin.key"),
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
