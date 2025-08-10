import {
  users,
  wellbeingMetrics,
  productivityMetrics,
  recommendations,
  type User,
  type UpsertUser,
  type WellbeingMetric,
  type InsertWellbeingMetric,
  type ProductivityMetric,
  type InsertProductivityMetric,
  type Recommendation,
  type InsertRecommendation,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUsersByRole(role: string): Promise<User[]>;
  getUsersByManager(managerId: string): Promise<User[]>;
  
  // Wellbeing metrics operations
  getWellbeingMetrics(userId: string, startDate?: Date, endDate?: Date): Promise<WellbeingMetric[]>;
  createWellbeingMetric(metric: InsertWellbeingMetric): Promise<WellbeingMetric>;
  getLatestWellbeingMetric(userId: string): Promise<WellbeingMetric | undefined>;
  
  // Productivity metrics operations
  getProductivityMetrics(userId: string, startDate?: Date, endDate?: Date): Promise<ProductivityMetric[]>;
  createProductivityMetric(metric: InsertProductivityMetric): Promise<ProductivityMetric>;
  getLatestProductivityMetric(userId: string): Promise<ProductivityMetric | undefined>;
  
  // Recommendations operations
  getRecommendations(userId: string): Promise<Recommendation[]>;
  createRecommendation(recommendation: InsertRecommendation): Promise<Recommendation>;
  markRecommendationAsRead(id: string): Promise<void>;
  markRecommendationAsActioned(id: string): Promise<void>;
  
  // Analytics operations
  getTeamAverageWellbeing(managerId: string): Promise<number>;
  getTeamProductivitySummary(managerId: string): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getUsersByRole(role: string): Promise<User[]> {
    return await db.select().from(users).where(eq(users.role, role as any));
  }

  async getUsersByManager(managerId: string): Promise<User[]> {
    return await db.select().from(users).where(eq(users.managerId, managerId));
  }

  // Wellbeing metrics operations
  async getWellbeingMetrics(userId: string, startDate?: Date, endDate?: Date): Promise<WellbeingMetric[]> {
    let query = db.select().from(wellbeingMetrics).where(eq(wellbeingMetrics.userId, userId));
    
    if (startDate && endDate) {
      query = query.where(
        and(
          eq(wellbeingMetrics.userId, userId),
          gte(wellbeingMetrics.date, startDate),
          lte(wellbeingMetrics.date, endDate)
        )
      );
    }
    
    return await query.orderBy(desc(wellbeingMetrics.date));
  }

  async createWellbeingMetric(metric: InsertWellbeingMetric): Promise<WellbeingMetric> {
    const [created] = await db.insert(wellbeingMetrics).values(metric).returning();
    return created;
  }

  async getLatestWellbeingMetric(userId: string): Promise<WellbeingMetric | undefined> {
    const [metric] = await db
      .select()
      .from(wellbeingMetrics)
      .where(eq(wellbeingMetrics.userId, userId))
      .orderBy(desc(wellbeingMetrics.date))
      .limit(1);
    return metric;
  }

  // Productivity metrics operations
  async getProductivityMetrics(userId: string, startDate?: Date, endDate?: Date): Promise<ProductivityMetric[]> {
    let query = db.select().from(productivityMetrics).where(eq(productivityMetrics.userId, userId));
    
    if (startDate && endDate) {
      query = query.where(
        and(
          eq(productivityMetrics.userId, userId),
          gte(productivityMetrics.date, startDate),
          lte(productivityMetrics.date, endDate)
        )
      );
    }
    
    return await query.orderBy(desc(productivityMetrics.date));
  }

  async createProductivityMetric(metric: InsertProductivityMetric): Promise<ProductivityMetric> {
    const [created] = await db.insert(productivityMetrics).values(metric).returning();
    return created;
  }

  async getLatestProductivityMetric(userId: string): Promise<ProductivityMetric | undefined> {
    const [metric] = await db
      .select()
      .from(productivityMetrics)
      .where(eq(productivityMetrics.userId, userId))
      .orderBy(desc(productivityMetrics.date))
      .limit(1);
    return metric;
  }

  // Recommendations operations
  async getRecommendations(userId: string): Promise<Recommendation[]> {
    return await db
      .select()
      .from(recommendations)
      .where(eq(recommendations.userId, userId))
      .orderBy(desc(recommendations.createdAt))
      .limit(10);
  }

  async createRecommendation(recommendation: InsertRecommendation): Promise<Recommendation> {
    const [created] = await db.insert(recommendations).values(recommendation).returning();
    return created;
  }

  async markRecommendationAsRead(id: string): Promise<void> {
    await db.update(recommendations).set({ isRead: 1 }).where(eq(recommendations.id, id));
  }

  async markRecommendationAsActioned(id: string): Promise<void> {
    await db.update(recommendations).set({ isActioned: 1 }).where(eq(recommendations.id, id));
  }

  // Analytics operations
  async getTeamAverageWellbeing(managerId: string): Promise<number> {
    // This would require more complex aggregation queries
    // For now, return a mock value - in real implementation would calculate from team members
    return 7.9;
  }

  async getTeamProductivitySummary(managerId: string): Promise<any> {
    // This would require complex aggregation across team members
    // For now, return mock structure - in real implementation would aggregate team data
    return {
      averageProductivity: 7.8,
      topPerformer: "Alex Chen",
      needsSupport: "Mike Johnson",
      teamMood: "Positive"
    };
  }
}

export const storage = new DatabaseStorage();
