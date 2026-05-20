import { pgTable, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.schema.js";
import { spots } from "./spots.schema.js";

export const bookmarks = pgTable("bookmarks", {
  id: serial("id").primaryKey(),
  
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
    
  spotId: integer("spot_id")
    .notNull()
    .references(() => spots.id, { onDelete: "cascade" }),
    
  createdAt: timestamp("created_at").defaultNow().notNull(),
});