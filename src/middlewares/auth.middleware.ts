import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey123";
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "error",
        message: "Akses ditolak: Anda belum login (Token tidak ditemukan)"
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
    
  } catch (error) {
    return res.status(401).json({
      status: "error",
      message: "Akses ditolak: Token tidak valid atau sudah kadaluarsa"
    });
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
  const user = (req as any).user; 

  if (!user) {
    res.status(401).json({ 
      status: "error", 
      message: "Unauthorized: Token tidak ditemukan" 
    });
    return;
  }

  if (user.role !== "ADMIN") {
    res.status(403).json({ 
      status: "error", 
      message: "Forbidden: Akses ditolak! Hanya Admin yang diizinkan." 
    });
    return;
  }

  next(); 
};
