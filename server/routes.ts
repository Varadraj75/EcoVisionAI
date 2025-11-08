import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { userSchema, predictionRequestSchema, routeRequestSchema } from "@shared/schema";
import { predictEnergyUsage, getRouteOptions } from "./data/kaggleData";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/upsert", async (req, res) => {
    try {
      const userData = userSchema.parse(req.body);
      const user = await storage.upsertUser(userData);
      res.json(user);
    } catch (error) {
      console.error("Error upserting user:", error);
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  app.get("/api/auth/user/:uid", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.uid);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error getting user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Usage history routes
  app.get("/api/usage/history/:uid", async (req, res) => {
    try {
      const records = await storage.getUsageRecords(req.params.uid);
      res.json(records);
    } catch (error) {
      console.error("Error getting usage records:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Predictions route (ML service proxy)
  app.post("/api/predictions/energy", async (req, res) => {
    try {
      const { temperature, day, usage_prev } = predictionRequestSchema.parse(req.body);
      
      // Use the heuristic prediction function
      const predicted_usage = predictEnergyUsage(temperature, day, usage_prev);
      
      const response = {
        predicted_usage,
        confidence: 0.92,
        timestamp: new Date().toISOString(),
      };
      
      res.json(response);
    } catch (error) {
      console.error("Error making prediction:", error);
      res.status(400).json({ error: "Invalid prediction request" });
    }
  });

  // Eco-route optimization
  app.post("/api/eco/route", async (req, res) => {
    try {
      const { origin, destination } = routeRequestSchema.parse(req.body);
      
      const routes = getRouteOptions(origin, destination);
      
      res.json({
        origin,
        destination,
        routes,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error finding routes:", error);
      res.status(400).json({ error: "Invalid route request" });
    }
  });

  // Route logs
  app.get("/api/routes/history/:uid", async (req, res) => {
    try {
      const logs = await storage.getRouteLogs(req.params.uid);
      res.json(logs);
    } catch (error) {
      console.error("Error getting route logs:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/routes/log", async (req, res) => {
    try {
      const log = await storage.addRouteLog(req.body);
      res.json(log);
    } catch (error) {
      console.error("Error logging route:", error);
      res.status(400).json({ error: "Invalid route log" });
    }
  });

  // Sustainability tips
  app.get("/api/tips/daily", async (req, res) => {
    try {
      const tips = await storage.getSustainabilityTips();
      res.json(tips);
    } catch (error) {
      console.error("Error getting tips:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
