import { z } from "zod";

export const searchSpotsQuerySchema = z.object({
  keyword: z.string().optional(),
  spot_type: z.enum(['indoor', 'outdoor'], {
    message: "spot_type harus berupa 'indoor' atau 'outdoor'",
  }).optional(),
  crowdedness: z.enum(['low', 'high'], {
    message: "crowdedness harus berupa 'low' atau 'high'",
  }).optional(),
  atmosphere: z.enum(['busy', 'quiet'], {
    message: "atmosphere harus berupa 'busy' atau 'quiet'",
  }).optional(),
  visit_type: z.enum(['group', 'alone'], {
    message: "visit_type harus berupa 'group' atau 'alone'",
  }).optional(),
  mood: z.enum(['relaxed', 'focused'], {
    message: "mood harus berupa 'relaxed' atau 'focused'",
  }).optional(),
});
