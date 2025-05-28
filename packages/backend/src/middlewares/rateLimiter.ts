import rateLimit from 'express-rate-limit';

/**
 * Rate limiter middleware (default: 5 requests per minute per IP)
 * Use for login, register, or any sensitive route
 */
export const rateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 requests per windowMs
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
