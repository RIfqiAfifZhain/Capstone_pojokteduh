import { Request, Response } from "express";
import { db } from "../db/index.js";
import { reviews } from "../db/schemas/reviews.schema.js";
import { spots } from "../db/schemas/spots.schema.js";
import { users } from "../db/schemas/users.schema.js";
import { eq, and, avg } from "drizzle-orm";

// ─── Helper: Recalculate satisfaction score ───────────────────────────────────
const recalculateSatisfactionScore = async (spotId: number) => {
  const result = await db
    .select({ avgRating: avg(reviews.rating) })
    .from(reviews)
    .where(eq(reviews.spotId, spotId));

  const avgRating = result[0]?.avgRating ?? null;

  await db
    .update(spots)
    .set({ satisfactionScore: avgRating, updatedAt: new Date() })
    .where(eq(spots.id, spotId));
};

// ─── POST /reviews (Upsert: insert jika baru, update jika sudah ada) ─────────
export const addOrUpdateReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId: number = req.user?.id;
    const { spot_id, rating, comment } = req.body;

    // 1. Validasi spot ada
    const spot = await db.select().from(spots).where(eq(spots.id, spot_id));
    if (spot.length === 0) {
      res.status(404).json({
        status: "error",
        message: "Spot tidak ditemukan",
      });
      return;
    }

    // 2. Cek apakah review dari user ini untuk spot ini sudah ada
    const existingReview = await db
      .select()
      .from(reviews)
      .where(and(eq(reviews.userId, userId), eq(reviews.spotId, spot_id)));

    let savedReview;
    let isNewReview: boolean;

    if (existingReview.length === 0) {
      // 3a. Belum ada → INSERT baru
      const inserted = await db.insert(reviews).values({
        userId,
        spotId: spot_id,
        rating,
        comment: comment ?? null,
      }).returning();
      savedReview = inserted[0];
      isNewReview = true;
    } else {
      // 3b. Sudah ada → UPDATE
      const updated = await db
        .update(reviews)
        .set({
          rating,
          comment: comment ?? null,
          updatedAt: new Date(),
        })
        .where(and(eq(reviews.userId, userId), eq(reviews.spotId, spot_id)))
        .returning();
      savedReview = updated[0];
      isNewReview = false;
    }

    // 4. Hitung ulang satisfaction score otomatis
    await recalculateSatisfactionScore(spot_id);

    res.status(200).json({
      status: "success",
      message: isNewReview ? "Review berhasil ditambahkan" : "Review berhasil diperbarui",
      data: savedReview,
    });
  } catch (error) {
    console.error("Error addOrUpdateReview:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

// ─── GET /spots/:id/reviews ───────────────────────────────────────────────────
export const getSpotReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const spotId = Number(req.params.id);

    if (isNaN(spotId)) {
      res.status(400).json({ status: "error", message: "ID spot tidak valid" });
      return;
    }

    // 1. Validasi spot ada
    const spot = await db.select().from(spots).where(eq(spots.id, spotId));
    if (spot.length === 0) {
      res.status(404).json({ status: "error", message: "Spot tidak ditemukan" });
      return;
    }

    // 2. Fetch semua review untuk spot ini + username dari tabel users
    const spotReviews = await db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
        updatedAt: reviews.updatedAt,
        user: {
          id: users.id,
          username: users.username,
        },
      })
      .from(reviews)
      .leftJoin(users, eq(reviews.userId, users.id))
      .where(eq(reviews.spotId, spotId))
      .orderBy(reviews.createdAt);

    res.status(200).json({
      status: "success",
      message: "Review berhasil diambil",
      data: {
        spotId,
        spotName: spot[0].name,
        satisfactionScore: spot[0].satisfactionScore,
        totalReviews: spotReviews.length,
        reviews: spotReviews,
      },
    });
  } catch (error) {
    console.error("Error getSpotReviews:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
