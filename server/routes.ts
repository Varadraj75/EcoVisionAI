import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { loginSchema, signupSchema, predictionRequestSchema, routeRequestSchema } from "@shared/schema";
import { predictEnergyUsage } from "./data/kaggleData";
import { getSustainabilityAdvice, type ChatMessage } from "./services/openai";
import { getEcoFriendlyRoutes, getDemoRoutes } from "./services/routing";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const userData = signupSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" });
      }
      
      const user = await storage.createUser(userData);
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const user = await storage.verifyPassword(email, password);
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(400).json({ error: "Invalid credentials" });
    }
  });

  // Usage history routes
  app.get("/api/usage/history/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const records = await storage.getUsageRecords(userId);
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
      
      const routes = await getEcoFriendlyRoutes(origin, destination);
      
      res.json({
        origin,
        destination,
        routes,
        isDemo: false,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error finding routes:", error);
      const errorMessage = error instanceof Error ? error.message : "Invalid route request";
      
      // Determine appropriate status code
      if (error instanceof Error) {
        if (error.message.includes("API key not configured")) {
          res.status(503).json({ error: errorMessage });
        } else if (error.message.includes("Unable to find")) {
          res.status(400).json({ error: errorMessage });
        } else {
          res.status(502).json({ error: errorMessage });
        }
      } else {
        res.status(400).json({ error: errorMessage });
      }
    }
  });

  // Route logs
  app.get("/api/routes/history/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const logs = await storage.getRouteLogs(userId);
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

  // AI Chatbot endpoint
  const chatRequestSchema = z.object({
    messages: z.array(z.object({
      role: z.enum(["user", "assistant", "system"]),
      content: z.string(),
    })),
    userId: z.number().optional(),
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, userId } = chatRequestSchema.parse(req.body);
      
      // Get user context if userId is provided
      let userContext;
      if (userId) {
        const records = await storage.getUsageRecords(userId);
        if (records.length > 0) {
          const latest = records[records.length - 1];
          userContext = {
            energyUsage: parseFloat(latest.energyKwh as string),
            waterUsage: latest.waterLiters ? parseFloat(latest.waterLiters as string) : undefined,
            co2Emissions: latest.co2Kg ? parseFloat(latest.co2Kg as string) : undefined,
          };
        }
      }

      const response = await getSustainabilityAdvice(messages as ChatMessage[], userContext);
      res.json({ message: response });
    } catch (error) {
      console.error("Error in chat endpoint:", error);
      if (error instanceof Error) {
        // Map specific error types to user-friendly messages
        if (error.message.includes("API key")) {
          res.status(401).json({ error: "OpenAI API key not configured. Please add your OPENAI_API_KEY to environment secrets." });
        } else if (error.message.includes("rate_limit")) {
          res.status(429).json({ error: "Rate limit exceeded. Please try again in a moment." });
        } else if (error.message.includes("timeout") || error.message.includes("ETIMEDOUT")) {
          res.status(504).json({ error: "Request timeout. Please check your connection and try again." });
        } else {
          res.status(500).json({ error: "Failed to get AI response. Please try again." });
        }
      } else {
        res.status(500).json({ error: "Failed to get AI response" });
      }
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
