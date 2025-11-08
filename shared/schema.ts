import { z } from "zod";

// User schema for Firebase authentication
export const userSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  name: z.string(),
  photoURL: z.string().optional(),
  provider: z.string(),
  preferences: z.object({
    theme: z.enum(["light", "dark"]).default("light"),
  }).optional(),
});

export type User = z.infer<typeof userSchema>;

export const insertUserSchema = userSchema.omit({ uid: true });
export type InsertUser = z.infer<typeof insertUserSchema>;

// Usage Record schema
export const usageRecordSchema = z.object({
  id: z.string(),
  uid: z.string(),
  date: z.string(),
  energy_kwh: z.number(),
  water_liters: z.number().optional(),
  co2_kg: z.number().optional(),
  predicted_energy_kwh: z.number().optional(),
});

export type UsageRecord = z.infer<typeof usageRecordSchema>;

export const insertUsageRecordSchema = usageRecordSchema.omit({ id: true });
export type InsertUsageRecord = z.infer<typeof insertUsageRecordSchema>;

// Route Log schema
export const routeLogSchema = z.object({
  id: z.string(),
  uid: z.string(),
  origin: z.string(),
  destination: z.string(),
  pickedRoute: z.string(),
  savedCo2Kg: z.number(),
  distance_km: z.number(),
  duration_min: z.number(),
  timestamp: z.string(),
});

export type RouteLog = z.infer<typeof routeLogSchema>;

export const insertRouteLogSchema = routeLogSchema.omit({ id: true, timestamp: true });
export type InsertRouteLog = z.infer<typeof insertRouteLogSchema>;

// Prediction Request/Response schemas
export const predictionRequestSchema = z.object({
  temperature: z.number().min(-50).max(60),
  day: z.number().min(1).max(31),
  usage_prev: z.number().min(0),
});

export type PredictionRequest = z.infer<typeof predictionRequestSchema>;

export const predictionResponseSchema = z.object({
  predicted_usage: z.number(),
  confidence: z.number().optional(),
  timestamp: z.string(),
});

export type PredictionResponse = z.infer<typeof predictionResponseSchema>;

// Route Request schema
export const routeRequestSchema = z.object({
  origin: z.string().min(1),
  destination: z.string().min(1),
});

export type RouteRequest = z.infer<typeof routeRequestSchema>;

// Route Option schema
export const routeOptionSchema = z.object({
  name: z.string(),
  distance_km: z.number(),
  duration_min: z.number(),
  co2_kg: z.number(),
  type: z.enum(["car", "public_transit", "bike", "walk"]),
  recommended: z.boolean().optional(),
});

export type RouteOption = z.infer<typeof routeOptionSchema>;

// Sustainability Tip schema
export const sustainabilityTipSchema = z.object({
  id: z.string(),
  category: z.string(),
  tip: z.string(),
  impact: z.enum(["low", "medium", "high"]),
});

export type SustainabilityTip = z.infer<typeof sustainabilityTipSchema>;
