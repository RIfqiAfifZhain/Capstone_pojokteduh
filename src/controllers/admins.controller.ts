import { Request, Response, NextFunction } from "express";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { users } from "../db/schemas/index.js";

export const getAdminProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const adminId = req.user?.id;
    
    if (!adminId) {
      return res.status(401).json({ 
        status: "error", 
        message: "Anda belum login (Unauthorized)" 
      });
    }

    const adminProfile = await db.select({
      id: users.id,
      username: users.username,
      email: users.email
    }).from(users).where(eq(users.id, adminId));
    if (adminProfile.length === 0) {
      return res.status(404).json({ 
        status: "error", 
        message: "Data admin tidak ditemukan" 
      });
    }
    return res.status(200).json({ 
      status: "success", 
      data: adminProfile[0] 
    });

  } catch (error) {
    next(error);
  }
};
