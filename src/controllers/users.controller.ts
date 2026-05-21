import { Request, Response, NextFunction } from "express";
import { eq, desc } from "drizzle-orm";
import { db } from "../db/index.js";
import { users, reviews, spots } from "../db/schemas/index.js";
import bcrypt from "bcryptjs"; // Pastikan library ini sudah ter-install (npm i bcrypt)

// --- 1. MENGAMBIL DATA PROFIL (GET /profile) ---
export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ status: "error", message: "Anda belum login (Unauthorized)" });
    }

    // Tambahkan photoUrl ke dalam data yang diambil
    const userProfile = await db.select({
      id: users.id,
      username: users.username,
      email: users.email,
      photoUrl: users.photoUrl,
      role: users.role,
      createdAt: users.createdAt
    }).from(users).where(eq(users.id, userId));

    if (userProfile.length === 0) {
      return res.status(404).json({ status: "error", message: "Data user tidak ditemukan" });
    }

    return res.status(200).json({ 
      status: "success", 
      data: userProfile[0] 
    });

  } catch (error) {
    next(error);
  }
};

// --- 2. MENGUBAH DATA PROFIL (PUT /profile) ---
export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ status: "error", message: "Unauthorized" });

    const { username, email, photoUrl } = req.body;

    // Sesuai PRD: Validasi email harus unik dan tidak boleh dipakai user lain
    if (email) {
      const existingUser = await db.select().from(users).where(eq(users.email, email));
      if (existingUser.length > 0 && existingUser[0].id !== userId) {
        return res.status(400).json({ 
          status: "error", 
          message: "Email sudah digunakan oleh akun lain!" 
        });
      }
    }

    // Kumpulkan data yang mau di-update
    const updateData: any = { updatedAt: new Date() };
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (photoUrl) updateData.photoUrl = photoUrl;

    const updatedUser = await db.update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        username: users.username,
        email: users.email,
        photoUrl: users.photoUrl,
        updatedAt: users.updatedAt
      });

    return res.status(200).json({
      status: "success",
      message: "Profil berhasil diperbarui",
      data: updatedUser[0]
    });

  } catch (error) {
    next(error);
  }
};

// --- 3. MENGGANTI PASSWORD (PUT /profile/password) ---
export const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ status: "error", message: "Unauthorized" });

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ 
        status: "error", 
        message: "oldPassword dan newPassword wajib diisi!" 
      });
    }

    // Ambil password lama (hash) dari database untuk dicocokkan
    const userRecord = await db.select({ passwordHash: users.passwordHash })
      .from(users).where(eq(users.id, userId));

    if (userRecord.length === 0) {
      return res.status(404).json({ status: "error", message: "User tidak ditemukan" });
    }

    // Cocokkan password lama yang diinput dengan yang ada di database
    const isMatch = await bcrypt.compare(oldPassword, userRecord[0].passwordHash);
    if (!isMatch) {
      return res.status(400).json({ status: "error", message: "Password lama tidak sesuai!" });
    }

    // Jika cocok, Hash password baru
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Simpan password baru ke database
    await db.update(users)
      .set({ 
        passwordHash: hashedNewPassword, 
        updatedAt: new Date() 
      })
      .where(eq(users.id, userId));

    return res.status(200).json({
      status: "success",
      message: "Password berhasil diubah!"
    });

  } catch (error) {
    next(error);
  }
};

// --- 4. MELIHAT RIWAYAT REVIEW USER (GET /profile/reviews) ---
export const getUserReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ status: "error", message: "Unauthorized" });
    }

    // Ambil data review milik user ini, dan JOIN dengan tabel spots untuk mendapatkan nama tempatnya
    const userReviews = await db.select({
      id: reviews.id,
      spotId: reviews.spotId,
      spotName: spots.name,
      rating: reviews.rating,
      comment: reviews.comment,
      createdAt: reviews.createdAt
    })
    .from(reviews)
    .leftJoin(spots, eq(reviews.spotId, spots.id))
    .where(eq(reviews.userId, userId))
    .orderBy(desc(reviews.createdAt)); // Urutkan dari review terbaru

    return res.status(200).json({
      status: "success",
      message: "Berhasil mengambil riwayat review",
      data: userReviews
    });

  } catch (error) {
    next(error);
  }
};