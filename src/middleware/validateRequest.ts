import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error } = schema.validate(req.body);
      if (error) {
        return res
          .status(400)
          .json({
            status: false,
            error: error.details[0].message,
            result: null,
          });
      }
      next();
    } catch (err) {
      return res
        .status(500)
        .json({ status: false, error: "Internal server error", result: null });
    }
  };
};
