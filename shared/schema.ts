import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  integer,
  decimal,
  text,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User roles enum
export const userRoleEnum = pgEnum("user_role", ["employee", "manager", "hr_admin"]);

// User storage table.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: userRoleEnum("role").default("employee"),
  department: varchar("department"),
  managerId: varchar("manager_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Wellbeing metrics table
export const wellbeingMetrics = pgTable("wellbeing_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  date: timestamp("date").defaultNow(),
  wellbeingScore: decimal("wellbeing_score", { precision: 3, scale: 1 }),
  stressLevel: varchar("stress_level"), // low, medium, high
  workLifeBalance: decimal("work_life_balance", { precision: 3, scale: 1 }),
  moodRating: integer("mood_rating"), // 1-10
  sleepHours: decimal("sleep_hours", { precision: 3, scale: 1 }),
  exerciseMinutes: integer("exercise_minutes"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Productivity metrics table
export const productivityMetrics = pgTable("productivity_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  date: timestamp("date").defaultNow(),
  productivityScore: decimal("productivity_score", { precision: 3, scale: 1 }),
  focusHours: decimal("focus_hours", { precision: 3, scale: 1 }),
  tasksCompleted: integer("tasks_completed"),
  meetingHours: decimal("meeting_hours", { precision: 3, scale: 1 }),
  breaksTaken: integer("breaks_taken"),
  overtimeHours: decimal("overtime_hours", { precision: 3, scale: 1 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// AI recommendations table
export const recommendations = pgTable("recommendations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: varchar("type"), // break, mindfulness, workload, meeting
  title: varchar("title"),
  description: text("description"),
  priority: varchar("priority"), // low, medium, high
  isRead: integer("is_read").default(0), // 0 = false, 1 = true
  isActioned: integer("is_actioned").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertWellbeingMetricSchema = createInsertSchema(wellbeingMetrics).omit({
  id: true,
  createdAt: true,
});

export const insertProductivityMetricSchema = createInsertSchema(productivityMetrics).omit({
  id: true,
  createdAt: true,
});

export const insertRecommendationSchema = createInsertSchema(recommendations).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type WellbeingMetric = typeof wellbeingMetrics.$inferSelect;
export type InsertWellbeingMetric = z.infer<typeof insertWellbeingMetricSchema>;
export type ProductivityMetric = typeof productivityMetrics.$inferSelect;
export type InsertProductivityMetric = z.infer<typeof insertProductivityMetricSchema>;
export type Recommendation = typeof recommendations.$inferSelect;
export type InsertRecommendation = z.infer<typeof insertRecommendationSchema>;
