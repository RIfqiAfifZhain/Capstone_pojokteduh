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
    // If no conditions, it returns all spots
    const query = conditions.length > 0
      ? db.select().from(spots).where(and(...conditions))
      : db.select().from(spots);

    const result = await query;

    res.status(200).json({
      status: "success",
      message: "Spots retrieved successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error searching spots:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
