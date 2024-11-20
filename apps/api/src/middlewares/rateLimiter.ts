import { env } from '@shared/env';
import { rateLimiter } from 'hono-rate-limiter';

const limiter = rateLimiter({
  windowMs: env.RATE_WINDOW,
  limit: env.RATE_LIMITS,
  standardHeaders: 'draft-6',
  keyGenerator: (c) => c.req.header('Authorization') || '',
});

export default limiter;
