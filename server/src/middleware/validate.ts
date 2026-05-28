import type { NextFunction, Request, Response } from "express";
import type { ZodTypeAny } from "zod";
import { ZodError } from "zod";

export function validate(schema: ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      return next();
    } catch (e) {
      if (e instanceof ZodError) {
        return res.status(400).json({
          message: "Validation error",
          details: e.flatten(),
        });
      }
      return next(e);
    }
  };
}

