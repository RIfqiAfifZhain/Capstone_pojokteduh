import { Request, Response, NextFunction } from "express";
import { eq, desc, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import { users, spots, activityLogs } from "../db/schemas/index.js"; 

// --- 1. PROFIL ADMIN ---
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

// --- TUGAS 3: DASHBOARD SUMMARY ---
export const getDashboardSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalSpotsResult = await db.select({ count: sql<number>`cast(count(*) as int)` }).from(spots);
    const totalSpots = totalSpotsResult[0].count;

    const spotsByCategory = await db.select({
      category: spots.spotType,
      count: sql<number>`cast(count(*) as int)`
    })
    .from(spots)
    .groupBy(spots.spotType);

    const recentActivities = await db.select({
      id: activityLogs.id,
      action: activityLogs.actionType,
      adminName: users.username,
      spotName: spots.name,
      time: activityLogs.createdAt
    })
    .from(activityLogs)
    .leftJoin(users, eq(activityLogs.adminId, users.id))
    .leftJoin(spots, eq(activityLogs.targetSpot, spots.id))
    .orderBy(desc(activityLogs.createdAt))
    .limit(5);

    return res.status(200).json({
      status: "success",
      data: {
        total_spots: totalSpots,
        categories: spotsByCategory,
        latest_activities: recentActivities
      }
    });

  } catch (error) {
    next(error); 
  }
};

// --- TUGAS 4: MANAJEMEN SPOT (CRUD) ---
export const createSpot = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const adminId = req.user?.id; 

    if (!adminId) {
      return res.status(401).json({ status: "error", message: "Unauthorized: Silakan login sebagai Admin" });
    }

    const {
      name,
      category,
      address,
      description,
      facilities,
      operationalHours,
      latitude,
      longitude,
      spotType,      
      crowdedness,   
      atmosphere,    
      visitType,     
      mood           
    } = req.body;

    // 🌟 Tangkap URL foto dari Cloudinary jika ada file yang diupload
    let photoUrl = req.body.photoUrl || null; 
    if (req.file && req.file.path) {
      photoUrl = req.file.path;
    }

    if (!name || !spotType || !crowdedness || !atmosphere || !visitType || !mood) {
      return res.status(400).json({
        status: "error",
        message: "Kolom name, spotType, crowdedness, atmosphere, visitType, dan mood wajib diisi!"
      });
    }

    const newSpot = await db.insert(spots).values({
      name,
      category,
      address,
      description,
      facilities,
      operationalHours,
      latitude: latitude ? latitude.toString() : null, 
      longitude: longitude ? longitude.toString() : null,
      photoUrl, // 🌟 Gunakan URL yang sudah didapat dari Cloudinary
      spotType,
      crowdedness,
      atmosphere,
      visitType,
      mood,
      satisfactionScore: "0.00" 
    }).returning(); 

    await db.insert(activityLogs).values({
      adminId: adminId,
      actionType: "ADD_SPOT",
      targetSpot: newSpot[0].id
    });

    return res.status(201).json({
      status: "success",
      message: "Spot baru berhasil ditambahkan dan aktivitas telah dicatat!",
      data: newSpot[0]
    });

  } catch (error) {
    next(error);
  }
};

// --- GET: LIHAT SEMUA SPOT OLEH ADMIN ---
export const getAdminSpots = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const allSpots = await db.select().from(spots).orderBy(desc(spots.createdAt));
    
    return res.status(200).json({
      status: "success",
      data: allSpots
    });
  } catch (error) {
    next(error);
  }
};

// --- PUT: EDIT SPOT ---
export const updateSpot = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const adminId = req.user?.id;
    const spotId = parseInt(req.params.id as string);

    if (!adminId) return res.status(401).json({ status: "error", message: "Unauthorized" });

    const updateData = req.body;
    updateData.updatedAt = new Date(); 

    // 🌟 Tangkap URL foto dari Cloudinary jika Admin mengupload gambar baru saat Edit
    if (req.file && req.file.path) {
      updateData.photoUrl = req.file.path;
    }

    if (updateData.latitude) updateData.latitude = updateData.latitude.toString();
    if (updateData.longitude) updateData.longitude = updateData.longitude.toString();

    const updatedSpot = await db.update(spots)
      .set(updateData)
      .where(eq(spots.id, spotId))
      .returning();

    if (updatedSpot.length === 0) {
      return res.status(404).json({ status: "error", message: "Spot tidak ditemukan!" });
    }

    await db.insert(activityLogs).values({
      adminId: adminId,
      actionType: "EDIT_SPOT",
      targetSpot: spotId
    });

    return res.status(200).json({ 
      status: "success", 
      message: `Spot ID ${spotId} berhasil diperbarui!`,
      data: updatedSpot[0]
    });
  } catch (error) {
    next(error);
  }
};

// --- DELETE: HAPUS SPOT ---
export const deleteSpot = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const adminId = req.user?.id;
    const spotId = parseInt(req.params.id as string);

    if (!adminId) return res.status(401).json({ status: "error", message: "Unauthorized" });

    const deletedSpot = await db.delete(spots)
      .where(eq(spots.id, spotId))
      .returning();

    if (deletedSpot.length === 0) {
      return res.status(404).json({ status: "error", message: "Spot tidak ditemukan!" });
    }

    await db.insert(activityLogs).values({
      adminId: adminId,
      actionType: "DELETE_SPOT",
      targetSpot: null 
    });

    return res.status(200).json({ 
      status: "success", 
      message: `Spot ${deletedSpot[0].name} berhasil dihapus permanen!` 
    });
  } catch (error) {
    next(error);
  }
};