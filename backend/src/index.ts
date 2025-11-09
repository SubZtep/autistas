import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { env } from './config/env.js';
import healthRoute from './routes/health.js';
import chatRoute from './routes/chat.js';

const app = new Hono();

// Middleware
app.use('*', logger());
app.use(
  '*',
  cors({
    origin: env.ALLOWED_ORIGINS === '*' ? '*' : env.ALLOWED_ORIGINS.split(','),
    credentials: true,
  })
);

// Routes
app.route('/health', healthRoute);
app.route('/api/chat', chatRoute);

// Root route
app.get('/', (c) => {
  return c.json({
    name: 'Autistas API',
    version: '0.1.0',
    endpoints: {
      health: '/health',
      chat: '/api/chat',
    },
  });
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not found' }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('Server error:', err);
  return c.json({ error: 'Internal server error' }, 500);
});

const port = Number(env.PORT);

console.log(`🚀 Server starting on port ${port}`);
console.log(`📝 Environment: ${env.NODE_ENV}`);

serve({
  fetch: app.fetch,
  port,
});

console.log(`✅ Server is running on http://localhost:${port}`);
