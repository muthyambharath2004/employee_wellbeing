import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertWellbeingMetricSchema, insertProductivityMetricSchema, insertRecommendationSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Wellbeing metrics routes
  app.get('/api/wellbeing/metrics', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { startDate, endDate } = req.query;
      
      const start = startDate ? new Date(startDate as string) : undefined;
      const end = endDate ? new Date(endDate as string) : undefined;
      
      const metrics = await storage.getWellbeingMetrics(userId, start, end);
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching wellbeing metrics:", error);
      res.status(500).json({ message: "Failed to fetch wellbeing metrics" });
    }
  });

  app.get('/api/wellbeing/latest', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const metric = await storage.getLatestWellbeingMetric(userId);
      res.json(metric || null);
    } catch (error) {
      console.error("Error fetching latest wellbeing metric:", error);
      res.status(500).json({ message: "Failed to fetch latest wellbeing metric" });
    }
  });

  app.post('/api/wellbeing/metrics', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validated = insertWellbeingMetricSchema.parse({ ...req.body, userId });
      const metric = await storage.createWellbeingMetric(validated);
      res.json(metric);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
        return;
      }
      console.error("Error creating wellbeing metric:", error);
      res.status(500).json({ message: "Failed to create wellbeing metric" });
    }
  });

  // Productivity metrics routes
  app.get('/api/productivity/metrics', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { startDate, endDate } = req.query;
      
      const start = startDate ? new Date(startDate as string) : undefined;
      const end = endDate ? new Date(endDate as string) : undefined;
      
      const metrics = await storage.getProductivityMetrics(userId, start, end);
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching productivity metrics:", error);
      res.status(500).json({ message: "Failed to fetch productivity metrics" });
    }
  });

  app.get('/api/productivity/latest', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const metric = await storage.getLatestProductivityMetric(userId);
      res.json(metric || null);
    } catch (error) {
      console.error("Error fetching latest productivity metric:", error);
      res.status(500).json({ message: "Failed to fetch latest productivity metric" });
    }
  });

  app.post('/api/productivity/metrics', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validated = insertProductivityMetricSchema.parse({ ...req.body, userId });
      const metric = await storage.createProductivityMetric(validated);
      res.json(metric);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
        return;
      }
      console.error("Error creating productivity metric:", error);
      res.status(500).json({ message: "Failed to create productivity metric" });
    }
  });

  // Recommendations routes
  app.get('/api/recommendations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const recommendations = await storage.getRecommendations(userId);
      res.json(recommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      res.status(500).json({ message: "Failed to fetch recommendations" });
    }
  });

  app.post('/api/recommendations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validated = insertRecommendationSchema.parse({ ...req.body, userId });
      const recommendation = await storage.createRecommendation(validated);
      res.json(recommendation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
        return;
      }
      console.error("Error creating recommendation:", error);
      res.status(500).json({ message: "Failed to create recommendation" });
    }
  });

  app.patch('/api/recommendations/:id/read', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      await storage.markRecommendationAsRead(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking recommendation as read:", error);
      res.status(500).json({ message: "Failed to mark recommendation as read" });
    }
  });

  app.patch('/api/recommendations/:id/action', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      await storage.markRecommendationAsActioned(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking recommendation as actioned:", error);
      res.status(500).json({ message: "Failed to mark recommendation as actioned" });
    }
  });

  // Team analytics routes (for managers/HR)
  app.get('/api/team/wellbeing-average', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || (user.role !== 'manager' && user.role !== 'hr_admin')) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const average = await storage.getTeamAverageWellbeing(userId);
      res.json({ average });
    } catch (error) {
      console.error("Error fetching team wellbeing average:", error);
      res.status(500).json({ message: "Failed to fetch team wellbeing average" });
    }
  });

  app.get('/api/team/summary', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || (user.role !== 'manager' && user.role !== 'hr_admin')) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const summary = await storage.getTeamProductivitySummary(userId);
      res.json(summary);
    } catch (error) {
      console.error("Error fetching team summary:", error);
      res.status(500).json({ message: "Failed to fetch team summary" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
