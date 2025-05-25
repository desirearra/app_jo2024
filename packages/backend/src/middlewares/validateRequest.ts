import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodTypeAny } from 'zod';

/**
 * Middleware to validate request body (default) with Zod schema
 * @param schema ZodTypeAny schema to validate against
 * Attaches parsed data to req.validated
 */
export function validateRequest(schema: ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction): Response | void => {
    try {
      const parsed = schema.parse(req.body);
      // Attach parsed data for downstream use
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (req as any).validated = parsed;
      return next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({ error: 'Validation error', details: err.errors });
      }
      return res.status(400).json({ error: 'Invalid request' });
    }
  };
}
