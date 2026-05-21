import { pgTable, serial, varchar, text, timestamp, pgEnum, numeric } from "drizzle-orm/pg-core";

export const spotTypeEnum = pgEnum('spot_type', ['indoor', 'outdoor']);
export const crowdednessEnum = pgEnum('crowdedness', ['low', 'high']);
export const atmosphereEnum = pgEnum('atmosphere', ['busy', 'quiet']);
export const visitTypeEnum = pgEnum('visit_type', ['group', 'alone']);
export const moodEnum = pgEnum('mood', ['relaxed', 'focused']);

export const spots = pgTable("spots", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }),
  address: text("address"),
  operationalHours: text("operational_hours"), 
  latitude: numeric("latitude", { precision: 10, scale: 8 }),
  longitude: numeric("longitude", { precision: 11, scale: 8 }),
  photoUrl: text("photo_url"), // untuk URL Cloudinary
  description: text("description"),
  facilities: text("facilities"), 
  spotType: spotTypeEnum("spot_type").notNull(),
  crowdedness: crowdednessEnum("crowdedness").notNull(),
  atmosphere: atmosphereEnum("atmosphere").notNull(),
  visitType: visitTypeEnum("visit_type").notNull(),
  mood: moodEnum("mood").notNull(),
  satisfactionScore: numeric("satisfaction_score", { precision: 3, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});