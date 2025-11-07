import {
  type EmergencyContact,
  type InsertEmergencyContact,
  type Conversation,
  type InsertConversation,
  type CycleTracking,
  type InsertCycleTracking,
  type MoodEntry,
  type InsertMoodEntry,
  type WellnessMetric,
  type InsertWellnessMetric,
  type SafetyKeyword,
  type InsertSafetyKeyword,
  type VoiceSettings,
  type InsertVoiceSettings,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getEmergencyContacts(): Promise<EmergencyContact[]>;
  getEmergencyContact(id: string): Promise<EmergencyContact | undefined>;
  createEmergencyContact(contact: InsertEmergencyContact): Promise<EmergencyContact>;
  updateEmergencyContact(id: string, contact: InsertEmergencyContact): Promise<EmergencyContact | undefined>;
  deleteEmergencyContact(id: string): Promise<void>;

  getConversations(): Promise<Conversation[]>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;

  getCycleTracking(): Promise<CycleTracking[]>;
  createCycleTracking(cycle: InsertCycleTracking): Promise<CycleTracking>;

  getMoodEntries(): Promise<MoodEntry[]>;
  createMoodEntry(mood: InsertMoodEntry): Promise<MoodEntry>;

  getWellnessMetrics(): Promise<WellnessMetric[]>;
  createWellnessMetric(metric: InsertWellnessMetric): Promise<WellnessMetric>;

  getSafetyKeywords(): Promise<SafetyKeyword[]>;
  createSafetyKeyword(keyword: InsertSafetyKeyword): Promise<SafetyKeyword>;
  updateSafetyKeyword(id: string, isActive: boolean): Promise<SafetyKeyword | undefined>;

  getVoiceSettings(): Promise<VoiceSettings | undefined>;
  upsertVoiceSettings(settings: InsertVoiceSettings): Promise<VoiceSettings>;
}

export class MemStorage implements IStorage {
  private emergencyContacts: Map<string, EmergencyContact>;
  private conversations: Map<string, Conversation>;
  private cycleTracking: Map<string, CycleTracking>;
  private moodEntries: Map<string, MoodEntry>;
  private wellnessMetrics: Map<string, WellnessMetric>;
  private safetyKeywords: Map<string, SafetyKeyword>;
  private voiceSettings: VoiceSettings | undefined;

  constructor() {
    this.emergencyContacts = new Map();
    this.conversations = new Map();
    this.cycleTracking = new Map();
    this.moodEntries = new Map();
    this.wellnessMetrics = new Map();
    this.safetyKeywords = new Map();

    this.seedDefaultKeywords();
  }

  private seedDefaultKeywords() {
    const defaultKeywords = ["help", "emergency", "danger", "unsafe"];
    defaultKeywords.forEach((keyword) => {
      const id = randomUUID();
      this.safetyKeywords.set(id, {
        id,
        keyword,
        isActive: true,
        createdAt: new Date(),
      });
    });
  }

  async getEmergencyContacts(): Promise<EmergencyContact[]> {
    return Array.from(this.emergencyContacts.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getEmergencyContact(id: string): Promise<EmergencyContact | undefined> {
    return this.emergencyContacts.get(id);
  }

  async createEmergencyContact(insertContact: InsertEmergencyContact): Promise<EmergencyContact> {
    const id = randomUUID();
    const contact: EmergencyContact = {
      ...insertContact,
      id,
      createdAt: new Date(),
    };
    this.emergencyContacts.set(id, contact);
    return contact;
  }

  async updateEmergencyContact(id: string, insertContact: InsertEmergencyContact): Promise<EmergencyContact | undefined> {
    const existing = this.emergencyContacts.get(id);
    if (!existing) return undefined;

    const updated: EmergencyContact = {
      ...insertContact,
      id,
      createdAt: existing.createdAt,
    };
    this.emergencyContacts.set(id, updated);
    return updated;
  }

  async deleteEmergencyContact(id: string): Promise<void> {
    this.emergencyContacts.delete(id);
  }

  async getConversations(): Promise<Conversation[]> {
    return Array.from(this.conversations.values()).sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
    );
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const id = randomUUID();
    const conversation: Conversation = {
      ...insertConversation,
      id,
      createdAt: new Date(),
    };
    this.conversations.set(id, conversation);
    return conversation;
  }

  async getCycleTracking(): Promise<CycleTracking[]> {
    return Array.from(this.cycleTracking.values()).sort(
      (a, b) => b.startDate.getTime() - a.startDate.getTime()
    );
  }

  async createCycleTracking(insertCycle: InsertCycleTracking): Promise<CycleTracking> {
    const id = randomUUID();
    const cycle: CycleTracking = {
      ...insertCycle,
      id,
      createdAt: new Date(),
    };
    this.cycleTracking.set(id, cycle);
    return cycle;
  }

  async getMoodEntries(): Promise<MoodEntry[]> {
    return Array.from(this.moodEntries.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async createMoodEntry(insertMood: InsertMoodEntry): Promise<MoodEntry> {
    const id = randomUUID();
    const mood: MoodEntry = {
      ...insertMood,
      id,
      createdAt: new Date(),
    };
    this.moodEntries.set(id, mood);
    return mood;
  }

  async getWellnessMetrics(): Promise<WellnessMetric[]> {
    return Array.from(this.wellnessMetrics.values()).sort(
      (a, b) => b.date.getTime() - a.date.getTime()
    );
  }

  async createWellnessMetric(insertMetric: InsertWellnessMetric): Promise<WellnessMetric> {
    const id = randomUUID();
    const metric: WellnessMetric = {
      ...insertMetric,
      id,
      createdAt: new Date(),
    };
    this.wellnessMetrics.set(id, metric);
    return metric;
  }

  async getSafetyKeywords(): Promise<SafetyKeyword[]> {
    return Array.from(this.safetyKeywords.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async createSafetyKeyword(insertKeyword: InsertSafetyKeyword): Promise<SafetyKeyword> {
    const id = randomUUID();
    const keyword: SafetyKeyword = {
      ...insertKeyword,
      id,
      createdAt: new Date(),
    };
    this.safetyKeywords.set(id, keyword);
    return keyword;
  }

  async updateSafetyKeyword(id: string, isActive: boolean): Promise<SafetyKeyword | undefined> {
    const keyword = this.safetyKeywords.get(id);
    if (!keyword) return undefined;
    
    const updated: SafetyKeyword = {
      ...keyword,
      isActive,
    };
    this.safetyKeywords.set(id, updated);
    return updated;
  }

  async getVoiceSettings(): Promise<VoiceSettings | undefined> {
    return this.voiceSettings;
  }

  async upsertVoiceSettings(insertSettings: InsertVoiceSettings): Promise<VoiceSettings> {
    const settings: VoiceSettings = {
      ...insertSettings,
      id: this.voiceSettings?.id || randomUUID(),
      updatedAt: new Date(),
    };
    this.voiceSettings = settings;
    return settings;
  }
}

export const storage = new MemStorage();
