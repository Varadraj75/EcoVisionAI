import type { User, UsageRecord, RouteLog, SustainabilityTip, InsertUsageRecord, InsertRouteLog } from "@shared/schema";
import { randomUUID } from "crypto";
import { energyConsumptionData, sustainabilityTips } from "./data/kaggleData";

export interface IStorage {
  // User methods
  getUser(uid: string): Promise<User | undefined>;
  upsertUser(user: User): Promise<User>;
  
  // Usage record methods
  getUsageRecords(uid: string): Promise<UsageRecord[]>;
  addUsageRecord(record: InsertUsageRecord): Promise<UsageRecord>;
  
  // Route log methods
  getRouteLogs(uid: string): Promise<RouteLog[]>;
  addRouteLog(log: InsertRouteLog): Promise<RouteLog>;
  
  // Sustainability tips
  getSustainabilityTips(): Promise<SustainabilityTip[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private usageRecords: Map<string, UsageRecord[]>;
  private routeLogs: Map<string, RouteLog[]>;
  private tips: SustainabilityTip[];

  constructor() {
    this.users = new Map();
    this.usageRecords = new Map();
    this.routeLogs = new Map();
    this.tips = sustainabilityTips;
    
    // Initialize with Kaggle data for demo user
    this.initializeKaggleData();
  }

  private initializeKaggleData() {
    // Create a demo user's usage records from Kaggle data
    const demoRecords: UsageRecord[] = energyConsumptionData.map((data, index) => ({
      id: `record-${index}`,
      uid: "demo",
      date: data.date,
      energy_kwh: data.energy_kwh,
      water_liters: data.water_liters,
      co2_kg: data.co2_kg,
      predicted_energy_kwh: undefined,
    }));
    
    this.usageRecords.set("demo", demoRecords);
  }

  async getUser(uid: string): Promise<User | undefined> {
    return this.users.get(uid);
  }

  async upsertUser(user: User): Promise<User> {
    this.users.set(user.uid, user);
    
    // Initialize usage records for new user with Kaggle data
    if (!this.usageRecords.has(user.uid)) {
      const userRecords: UsageRecord[] = energyConsumptionData.map((data, index) => ({
        id: `${user.uid}-record-${index}`,
        uid: user.uid,
        date: data.date,
        energy_kwh: data.energy_kwh,
        water_liters: data.water_liters,
        co2_kg: data.co2_kg,
        predicted_energy_kwh: undefined,
      }));
      this.usageRecords.set(user.uid, userRecords);
    }
    
    return user;
  }

  async getUsageRecords(uid: string): Promise<UsageRecord[]> {
    return this.usageRecords.get(uid) || [];
  }

  async addUsageRecord(record: InsertUsageRecord): Promise<UsageRecord> {
    const id = randomUUID();
    const newRecord: UsageRecord = { ...record, id };
    
    const userRecords = this.usageRecords.get(record.uid) || [];
    userRecords.push(newRecord);
    this.usageRecords.set(record.uid, userRecords);
    
    return newRecord;
  }

  async getRouteLogs(uid: string): Promise<RouteLog[]> {
    return this.routeLogs.get(uid) || [];
  }

  async addRouteLog(log: InsertRouteLog): Promise<RouteLog> {
    const id = randomUUID();
    const timestamp = new Date().toISOString();
    const newLog: RouteLog = { ...log, id, timestamp };
    
    const userLogs = this.routeLogs.get(log.uid) || [];
    userLogs.push(newLog);
    this.routeLogs.set(log.uid, userLogs);
    
    return newLog;
  }

  async getSustainabilityTips(): Promise<SustainabilityTip[]> {
    return this.tips;
  }
}

export const storage = new MemStorage();
