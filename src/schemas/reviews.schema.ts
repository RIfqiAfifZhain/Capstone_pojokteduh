import { z } from "zod";

export const addReviewSchema = z.object({
  body: z.object({
    spot_id: z.number({ message: "spot_id harus berupa angka" }).int().positive("spot_id harus bilangan positif"),
    rating: z.number({ message: "rating harus berupa angka" }).int().min(1, "Rating minimal 1").max(5, "Rating maksimal 5"),
    comment: z.string().optional(),
  }),
});
