import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Arc table for organizing sessions into three arcs
 */
export const arcs = mysqlTable("arcs", {
  id: int("id").autoincrement().primaryKey(),
  arcNumber: int("arcNumber").notNull(),
  arcTitle: varchar("arcTitle", { length: 255 }).notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Arc = typeof arcs.$inferSelect;
export type InsertArc = typeof arcs.$inferInsert;

/**
 * Session table for the 30-session curriculum
 */
export const sessions = mysqlTable("sessions", {
  id: int("id").autoincrement().primaryKey(),
  sessionNumber: int("sessionNumber").notNull().unique(),
  sessionTitle: varchar("sessionTitle", { length: 255 }).notNull(),
  arcId: int("arcId").notNull().references(() => arcs.id),
  sessionGoal: text("sessionGoal"),
  anchor: text("anchor"),
  hookEpisode: text("hookEpisode"),
  mechanism: text("mechanism"),
  mirror: text("mirror"),
  shiftCliffhanger: text("shiftCliffhanger"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Session = typeof sessions.$inferSelect;
export type InsertSession = typeof sessions.$inferInsert;

/**
 * Facilitator Resources table
 */
export const resources = mysqlTable("resources", {
  id: int("id").autoincrement().primaryKey(),
  resourceType: varchar("resourceType", { length: 100 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Resource = typeof resources.$inferSelect;
export type InsertResource = typeof resources.$inferInsert;

/**
 * Grant Opportunities table
 */
export const grants = mysqlTable("grants", {
  id: int("id").autoincrement().primaryKey(),
  grantName: varchar("grantName", { length: 255 }).notNull(),
  funder: varchar("funder", { length: 255 }).notNull(),
  deadline: varchar("deadline", { length: 100 }),
  fundingAmount: varchar("fundingAmount", { length: 100 }),
  alignment: text("alignment"),
  description: text("description"),
  url: varchar("url", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Grant = typeof grants.$inferSelect;
export type InsertGrant = typeof grants.$inferInsert;