import { users, usageRecords, routeLogs, userConsumptionProfiles, type User, type UsageRecord, type RouteLog, type UserConsumptionProfile, type InsertUser, type InsertUsageRecord, type InsertRouteLog, type InsertUserConsumptionProfile, type SustainabilityTip } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { energyConsumptionData, sustainabilityTips } from "./data/kaggleData";

export interface IStorage {
  // User methods
  getUserById(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Usage record methods
  getUsageRecords(userId: number): Promise<UsageRecord[]>;
  addUsageRecord(record: InsertUsageRecord): Promise<UsageRecord>;
  
  // Route log methods
  getRouteLogs(userId: number): Promise<RouteLog[]>;
  addRouteLog(log: InsertRouteLog): Promise<RouteLog>;
  
  // Sustainability tips
  getSustainabilityTips(): Promise<SustainabilityTip[]>;
  
  // User consumption profile methods
  getUserConsumptionProfile(userId: number): Promise<UserConsumptionProfile | undefined>;
  upsertUserConsumptionProfile(profile: InsertUserConsumptionProfile): Promise<UserConsumptionProfile>;
  
  // Auth methods
  verifyPassword(email: string, password: string): Promise<User | null>;
}

export class DatabaseStorage implements IStorage {
  async getUserById(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const [user] = await db
      .insert(users)
      .values({ ...insertUser, password: hashedPassword })
      .returning();
    
    // Initialize usage records with Kaggle data for new user
    const kaggleRecords = energyConsumptionData.map(data => ({
      userId: user.id,
      date: data.date,
      energyKwh: data.energy_kwh.toString(),
      waterLiters: data.water_liters.toString(),
      co2Kg: data.co2_kg.toString(),
    }));
    
    await db.insert(usageRecords).values(kaggleRecords);
    
    return user;
  }

  async verifyPassword(email: string, password: string): Promise<User | null> {
    const user = await this.getUserByEmail(email);
    if (!user) return null;
    
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  async getUsageRecords(userId: number): Promise<UsageRecord[]> {
    return await db.select().from(usageRecords).where(eq(usageRecords.userId, userId));
  }

  async addUsageRecord(record: InsertUsageRecord): Promise<UsageRecord> {
    const [newRecord] = await db
      .insert(usageRecords)
      .values(record)
      .returning();
    return newRecord;
  }

  async getRouteLogs(userId: number): Promise<RouteLog[]> {
    return await db.select().from(routeLogs).where(eq(routeLogs.userId, userId));
  }

  async addRouteLog(log: InsertRouteLog): Promise<RouteLog> {
    const [newLog] = await db
      .insert(routeLogs)
      .values(log)
      .returning();
    return newLog;
  }

  async getSustainabilityTips(): Promise<SustainabilityTip[]> {
    return sustainabilityTips;
  }

  async getUserConsumptionProfile(userId: number): Promise<UserConsumptionProfile | undefined> {
    const [profile] = await db
      .select()
      .from(userConsumptionProfiles)
      .where(eq(userConsumptionProfiles.userId, userId));
    return profile || undefined;
  }

  async upsertUserConsumptionProfile(profile: InsertUserConsumptionProfile): Promise<UserConsumptionProfile> {
    const existing = await this.getUserConsumptionProfile(profile.userId);
    
    if (existing) {
      // Update existing profile
      const [updated] = await db
        .update(userConsumptionProfiles)
        .set({
          ...profile,
          updatedAt: new Date(),
        })
        .where(eq(userConsumptionProfiles.userId, profile.userId))
        .returning();
      return updated;
    } else {
      // Insert new profile
      const [newProfile] = await db
        .insert(userConsumptionProfiles)
        .values(profile)
        .returning();
      return newProfile;
    }
  }
}

export const storage = new DatabaseStorage();
