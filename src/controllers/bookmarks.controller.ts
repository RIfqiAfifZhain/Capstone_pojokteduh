import { Request, Response } from "express";
import { db } from "../db/index.js";
import { bookmarks } from "../db/schemas/bookmarks.schema.js";
import { spots } from "../db/schemas/spots.schema.js";
import { eq, and } from "drizzle-orm";

// 1. Tembah Bookmark (POST /bookmarks)
export const addBookmark = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const { spot_id } = req.body;

    if (!userId) {
      res.status(401).json({ status: "error", message: "Unauthorized" });
      return;
    }

    if (!spot_id) {
      res.status(400).json({ status: "error", message: "spot_id is required" });
      return;
    }

    // Validasi agar tidak ada double-bookmarka
    const existingBookmark = await db.select().from(bookmarks).where(
      and(eq(bookmarks.userId, userId), eq(bookmarks.spotId, spot_id))
    );

    if (existingBookmark.length > 0) {
      res.status(400).json({ status: "error", message: "Spot sudah ada di daftar bookmark Anda" });
      return;
    }

    // Insert ke tabel bookmarks
    const newBookmark = await db.insert(bookmarks).values({
      userId,
      spotId: spot_id,
    }).returning();

    res.status(201).json({
      status: "success",
      message: "Bookmark berhasil ditambahkan",
      data: newBookmark[0],
    });
  } catch (error) {
    console.error("Error adding bookmark:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

// 2. Hapus Bookmark /bookmarks/:id
export const removeBookmark = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const bookmarkId = parseInt(req.params.id as string);

    if (!userId) {
      res.status(401).json({ status: "error", message: "Unauthorized" });
      return;
    }

    // Eksekusi delete
    const deleted = await db.delete(bookmarks).where(
      and(eq(bookmarks.id, bookmarkId), eq(bookmarks.userId, userId))
    ).returning();

    if (deleted.length === 0) {
      res.status(404).json({ status: "error", message: "Bookmark tidak ditemukan atau bukan milik Anda" });
      return;
    }

    res.status(200).json({
      status: "success",
      message: "Bookmark berhasil dihapus",
    });
  } catch (error) {
    console.error("Error removing bookmark:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

// 3. Ambil Daftar Bookmark 
export const getUserBookmarks = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      res.status(401).json({ status: "error", message: "Unauthorized" });
      return;
    }

    const userBookmarks = await db
      .select({
        bookmarkId: bookmarks.id,
        createdAt: bookmarks.createdAt,
        spot: spots, 
      })
      .from(bookmarks)
      .innerJoin(spots, eq(bookmarks.spotId, spots.id))
      .where(eq(bookmarks.userId, userId));

    const transformedBookmarks = userBookmarks.map((item) => {
      const spot = item.spot;
      const googleMapsQuery = encodeURIComponent(`${spot.name} Jakarta`);
      const generatedSlug = spot.name.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

      return {
        bookmarkId: item.bookmarkId,
        createdAt: item.createdAt,
        spot: {
          ...spot,
          slug: generatedSlug,
          mapLink: `https://www.google.com/maps/search/?api=1&query=${googleMapsQuery}`,
        }
      };
    });

    res.status(200).json({
      status: "success",
      message: "Daftar bookmark berhasil diambil",
      data: transformedBookmarks,
    });
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};