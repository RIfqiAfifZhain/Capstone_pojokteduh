import { Request, Response } from "express";
import { db } from "../db/index.js";
import { spots } from "../db/schemas/spots.schema.js";
import { eq, or, and, ilike } from "drizzle-orm";

export const searchSpots = async (req: Request, res: Response): Promise<void> => {
  try {
    const { keyword, spot_type, crowdedness, atmosphere, visit_type, mood } = req.query;

    const conditions = [];

    // 1. Keyword filter (search in name or description)
    if (keyword && typeof keyword === 'string') {
      conditions.push(
        or(
          ilike(spots.name, `%${keyword}%`),
          ilike(spots.description, `%${keyword}%`)
        )
      );
    }

    // 2. spot_type filter
    if (spot_type && typeof spot_type === 'string') {
      conditions.push(eq(spots.spotType, spot_type as 'indoor' | 'outdoor'));
    }

    // 3. crowdedness filter
    if (crowdedness && typeof crowdedness === 'string') {
      conditions.push(eq(spots.crowdedness, crowdedness as 'low' | 'high'));
    }

    // 4. atmosphere filter
    if (atmosphere && typeof atmosphere === 'string') {
      conditions.push(eq(spots.atmosphere, atmosphere as 'busy' | 'quiet'));
    }

    // 5. visit_type filter
    if (visit_type && typeof visit_type === 'string') {
      conditions.push(eq(spots.visitType, visit_type as 'group' | 'alone'));
    }

    // 6. mood filter
    if (mood && typeof mood === 'string') {
      conditions.push(eq(spots.mood, mood as 'relaxed' | 'focused'));
    }

    // Fetch matching spots
    const query = conditions.length > 0
      ? db.select().from(spots).where(and(...conditions))
      : db.select().from(spots);

    const result = await query;

    // 🌟 STRATEGI OTOMATIS: Tambahkan mapLink dan slug dinamis di sini
    const transformedResult = result.map((spot) => {
      // Konstruksi URL Google Maps Search berbasis nama tempat + wilayah Jakarta
      const googleMapsQuery = encodeURIComponent(`${spot.name} Jakarta`);
      const generatedMapLink = `https://www.google.com/maps/search/?api=1&query=${googleMapsQuery}`;

      // Buat slug otomatis dari nama tempat (misal: "GoWork Fatmawati" -> "gowork-fatmawati")
      // Ini sebagai backup aman jika kolom slug belum kamu push ke PostgreSQL
      const generatedSlug = spot.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "") // Hapus karakter aneh
        .replace(/\s+/g, "-")         // Ganti spasi dengan tanda minus (-)
        .replace(/-+/g, "-");         // Bersihkan jika minusnya ganda

      return {
        ...spot,
        slug: generatedSlug,       // Frontend butuh ini untuk pindah halaman detail
        mapLink: generatedMapLink, // Frontend butuh ini untuk tombol "Go There"
      };
    });

    res.status(200).json({
      status: "success",
      message: "Spots retrieved successfully",
      data: transformedResult, // Kirim data yang sudah di-transform
    });
  } catch (error) {
    console.error("Error searching spots:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const getSpotBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    // 1. Ambil semua spots untuk dicocokkan (karena slug dihitung dinamis dari nama)
    const allSpots = await db.select().from(spots);

    // 2. Cari spot yang hasil kalkulasi slug-nya cocok dengan parameter
    const matchedSpot = allSpots.find((spot) => {
      const generatedSlug = spot.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      
      return generatedSlug === slug;
    });

    if (!matchedSpot) {
      res.status(404).json({
        status: "error",
        message: "Spot tidak ditemukan",
      });
      return;
    }

    // 3. Gabungkan mapLink dan slug dinamis untuk response detailnya
    const googleMapsQuery = encodeURIComponent(`${matchedSpot.name} Jakarta`);
    const transformedSpot = {
      ...matchedSpot,
      slug: slug,
      mapLink: `https://www.google.com/maps/search/?api=1&query=${googleMapsQuery}`,
    };

    res.status(200).json({
      status: "success",
      message: "Spot detail retrieved successfully",
      data: transformedSpot,
    });
  } catch (error) {
    console.error("Error getting spot detail:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

