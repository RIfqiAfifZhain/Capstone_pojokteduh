import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

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
