import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { CustomRequest } from "../interfaces/CustomRequest";
import { errorResponse } from "../utils/responseUtils";

const JWT_SECRET = process.env.JWT_SECRET!;

export const authMiddleware = (
  req: Request | CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json(errorResponse("Unauthorized"));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    (req as CustomRequest).user = { id: decoded.userId };
    next();
  } catch (error) {
    return res.status(401).json(errorResponse("Invalid token"));
  }
};
