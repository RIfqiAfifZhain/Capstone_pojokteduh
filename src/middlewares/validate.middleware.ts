import { Request, Response, NextFunction } from "express";
import z, { ZodSchema, ZodError } from "zod";

export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();

    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((e: any) => {
          return {
            field: e.path.join('.'), 
            message: e.message,     
          };
        });

        return res.status(400).json({
          status: "error",
          message: "Data yang Anda masukkan tidak valid",
          errors: formattedErrors, 
        });
      }
      return next(error);
    }
  };
};

// Untuk validasi path params, contoh: /spots/:id
export const validateParams = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.params = (await schema.parseAsync(req.params)) as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return res.status(400).json({
          status: "error",
          message: "Parameter tidak valid",
          errors: formattedErrors,
        });
      }
      next(error);
    }
  };
};

// Untuk validasi query string, contoh: /spots/search?mood=focused&spot_type=indoor
// Catatan: req.query bersifat read-only di Express 5, jadi kita hanya validasi tanpa reassign.
export const validateQuery = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return res.status(400).json({
          status: "error",
          message: "Query parameter tidak valid",
          errors: formattedErrors,
        });
      }
      next(error);
    }
  };
};