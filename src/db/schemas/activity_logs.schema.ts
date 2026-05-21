import { pgTable, serial, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.schema.js";
import { spots } from "./spots.schema.js";

export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  
  adminId: integer("admin_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  actionType: varchar("action_type", { length: 50 }).notNull(), 
  
  targetSpot: integer("target_spot").references(() => spots.id, { onDelete: "set null" }),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});