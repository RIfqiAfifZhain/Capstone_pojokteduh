import { pgTable, serial, varchar, text, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum('role', ['USER', 'ADMIN']);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  username: varchar("username", { length: 255 }).notNull(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  role: roleEnum("role").default('USER').notNull(),
  photoUrl: text("photo_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
