import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { eq, and } from "drizzle-orm";
import { db } from "../db/index.js";
import { users } from "../db/schemas/index.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey123";

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const existingUser = await db.select().from(users).where(eq(users.email, email));
    if (existingUser.length > 0) {
      return res.status(400).json({ 
        status: "error", 
        message: "Email sudah terdaftar di sistem" 
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await db.insert(users).values({
      username: username,
      email: email,
      passwordHash: hashedPassword,
      role: 'USER',
    }).returning({
    
      id: users.id, 
      username: users.username, 
      email: users.email, 
      role: users.role,
    });

    return res.status(201).json({ 
      status: "success", 
      data: newUser[0] 
    });

  } catch (error) {
    next(error); 
  }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await db.select().from(users).where(and(eq(users.email, email), eq(users.role, 'USER')));
    if (user.length === 0) {
      return res.status(401).json({ 
        status: "error", 
        message: "Email atau password salah" 
      });
    }

    const isMatch = await bcrypt.compare(password, user[0].passwordHash);    
    if (isMatch === false) {
      return res.status(401).json({ 
        status: "error", 
        message: "Email atau password salah" 
      });
    }

    const payload = { 
      id: user[0].id, 
      email: user[0].email, 
      role: 'user' 
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
    return res.status(200).json({ 
      status: "success", 
      data: { 
        token: token,
        user: {
          id: user[0].id,
          username: user[0].username,
          email: user[0].email,
          role: user[0].role
        }
      } 
    });

  } catch (error) {
    next(error); 
  }
};

export const registerAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    const existingUser = await db.select().from(users).where(eq(users.email, email));
    
    if (existingUser.length > 0) {
      return res.status(400).json({ 
        status: "error", 
        message: "Email sudah terdaftar di sistem" 
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = await db.insert(users).values({
      username: username,
      email: email,
      passwordHash: hashedPassword,
      role: 'ADMIN',

    }).returning({
      id: users.id, 
      username: users.username, 
      email: users.email,
      role: users.role,
    });

    return res.status(201).json({ 
      status: "success", 
      data: newAdmin[0] 
    });

  } catch (error) {
    next(error); 
  }
};

export const loginAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const admin = await db.select().from(users).where(and(eq(users.email, email), eq(users.role, 'ADMIN')));
    
    if (admin.length === 0) {
      return res.status(401).json({ 
        status: "error", 
        message: "Email atau password salah" 
      });
    }

    const isMatch = await bcrypt.compare(password, admin[0].passwordHash);
    
    if (isMatch === false) {
      return res.status(401).json({ 
        status: "error", 
        message: "Email atau password salah" 
      });
    }

    const payload = { 
      id: admin[0].id, 
      email: admin[0].email, 
      role: admin[0].role 
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });

    return res.status(200).json({ 
      status: "success", 
      data: { 
        token: token,
        admin: {
          id: admin[0].id,
          username: admin[0].username,
          email: admin[0].email,
          role: admin[0].role
        }
      } 
    });

  } catch (error) {
    next(error); 
  }
};
