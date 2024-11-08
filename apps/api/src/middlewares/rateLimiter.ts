import { rateLimiter } from 'hono-rate-limiter';

const limiter = rateLimiter({
  windowMs: process.env.RATE_WINDOW,
  limit: process.env.RATE_LIMITS,
  standardHeaders: 'draft-6',
  keyGenerator: (c) => c.req.header('Authorization') || '',
});

export default limiter;
