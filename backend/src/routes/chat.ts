import { Hono } from 'hono';
import { env } from '../config/env.js';

const chat = new Hono();

/**
 * POST /api/chat
 * Send a message and get AI response
 */
chat.post('/', async (c) => {
  try {
    const { message, conversationId } = await c.req.json();

    if (!message) {
      return c.json({ error: 'Message is required' }, 400);
    }

    // TODO: Implement LLM API call
    // For now, return a placeholder response
    const response = {
      message: 'AI response will be connected to your home LLM server soon!',
      conversationId: conversationId || crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };

    return c.json(response);
  } catch (error) {
    console.error('Chat error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default chat;
