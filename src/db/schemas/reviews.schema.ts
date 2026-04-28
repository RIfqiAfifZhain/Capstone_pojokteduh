import { pgTable, serial, integer, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { users } from "./users.schema.js";
import { spots } from "./spots.schema.js";

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  spotId: integer("spot_id").notNull().references(() => spots.id),
  rating: integer("rating").notNull(), // 1-5
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  // Satu user hanya boleh punya 1 review per spot (bisa diupdate)
  uniqueIndex("unique_user_spot_review").on(table.userId, table.spotId),
]);
