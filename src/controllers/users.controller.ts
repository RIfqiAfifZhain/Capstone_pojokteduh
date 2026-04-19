import { Request, Response, NextFunction } from "express";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { users } from "../db/schemas/index.js";

export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ 
        status: "error", 
        message: "Anda belum login (Unauthorized)" 
      });
    }

    const userProfile = await db.select({
      id: users.id,
      username: users.username,
      email: users.email
    }).from(users).where(eq(users.id, userId));

    if (userProfile.length === 0) {
      return res.status(404).json({ 
        status: "error", 
        message: "Data user tidak ditemukan" 
      });
    }

    return res.status(200).json({ 
      status: "success", 
      data: userProfile[0] 
    });

  } catch (error) {
    next(error);
  }
};
