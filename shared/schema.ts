import { z } from "zod";
import { pgTable, serial, varchar, text, timestamp, integer, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

// Drizzle Users Table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export const selectUserSchema = createSelectSchema(users);

// Login/Signup schemas
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
});

// Usage Records Table
export const usageRecords = pgTable("usage_records", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  date: varchar("date", { length: 50 }).notNull(),
  energyKwh: decimal("energy_kwh", { precision: 10, scale: 2 }).notNull(),
  waterLiters: decimal("water_liters", { precision: 10, scale: 2 }),
  co2Kg: decimal("co2_kg", { precision: 10, scale: 2 }),
  predictedEnergyKwh: decimal("predicted_energy_kwh", { precision: 10, scale: 2 }),
});

export type UsageRecord = typeof usageRecords.$inferSelect;
export const insertUsageRecordSchema = createInsertSchema(usageRecords).omit({ id: true });
export type InsertUsageRecord = z.infer<typeof insertUsageRecordSchema>;

// Route Logs Table
export const routeLogs = pgTable("route_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  origin: varchar("origin", { length: 255 }).notNull(),
  destination: varchar("destination", { length: 255 }).notNull(),
  pickedRoute: varchar("picked_route", { length: 255 }).notNull(),
  savedCo2Kg: decimal("saved_co2_kg", { precision: 10, scale: 2 }).notNull(),
  distanceKm: decimal("distance_km", { precision: 10, scale: 2 }).notNull(),
  durationMin: integer("duration_min").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export type RouteLog = typeof routeLogs.$inferSelect;
export const insertRouteLogSchema = createInsertSchema(routeLogs).omit({ id: true, timestamp: true });
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

// User Consumption Profile (current baseline metrics)
export const userConsumptionProfiles = pgTable("user_consumption_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique().references(() => users.id),
  monthlyEnergyKwh: decimal("monthly_energy_kwh", { precision: 10, scale: 2 }),
  monthlyWaterLiters: decimal("monthly_water_liters", { precision: 10, scale: 2 }),
  monthlyCo2Kg: decimal("monthly_co2_kg", { precision: 10, scale: 2 }),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type UserConsumptionProfile = typeof userConsumptionProfiles.$inferSelect;
export const insertUserConsumptionProfileSchema = createInsertSchema(userConsumptionProfiles).omit({ id: true, updatedAt: true });
export type InsertUserConsumptionProfile = z.infer<typeof insertUserConsumptionProfileSchema>;

// User consumption input form schema
export const userConsumptionInputSchema = z.object({
  userId: z.number(),
  monthlyEnergyKwh: z.number().min(0).optional(),
  monthlyWaterLiters: z.number().min(0).optional(),
  monthlyCo2Kg: z.number().min(0).optional(),
});

export type UserConsumptionInput = z.infer<typeof userConsumptionInputSchema>;
