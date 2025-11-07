import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Emergency Contacts
export const emergencyContacts = pgTable("emergency_contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  relationship: text("relationship").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertEmergencyContactSchema = createInsertSchema(emergencyContacts).omit({
  id: true,
  createdAt: true,
});

export type InsertEmergencyContact = z.infer<typeof insertEmergencyContactSchema>;
export type EmergencyContact = typeof emergencyContacts.$inferSelect;

// Conversation Messages
export const conversations = pgTable("conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userMessage: text("user_message").notNull(),
  aiResponse: text("ai_response").notNull(),
  isSafetyAlert: boolean("is_safety_alert").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  createdAt: true,
});

export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversations.$inferSelect;

// Health Tracking - Cycle
export const cycleTracking = pgTable("cycle_tracking", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  startDate: timestamp("start_date").notNull(),
  cycleLength: integer("cycle_length").notNull().default(28),
  periodLength: integer("period_length").notNull().default(5),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCycleTrackingSchema = createInsertSchema(cycleTracking).omit({
  id: true,
  createdAt: true,
});

export type InsertCycleTracking = z.infer<typeof insertCycleTrackingSchema>;
export type CycleTracking = typeof cycleTracking.$inferSelect;

// Health Tracking - Mood
export const moodEntries = pgTable("mood_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  mood: text("mood").notNull(), // happy, calm, anxious, sad, energetic, stressed
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMoodEntrySchema = createInsertSchema(moodEntries).omit({
  id: true,
  createdAt: true,
});

export type InsertMoodEntry = z.infer<typeof insertMoodEntrySchema>;
export type MoodEntry = typeof moodEntries.$inferSelect;

// Health Tracking - Wellness Metrics
export const wellnessMetrics = pgTable("wellness_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: timestamp("date").notNull(),
  waterIntake: integer("water_intake").default(0).notNull(), // in ml
  sleepHours: integer("sleep_hours"), // in hours
  exerciseMinutes: integer("exercise_minutes"), // in minutes
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertWellnessMetricSchema = createInsertSchema(wellnessMetrics).omit({
  id: true,
  createdAt: true,
});

export type InsertWellnessMetric = z.infer<typeof insertWellnessMetricSchema>;
export type WellnessMetric = typeof wellnessMetrics.$inferSelect;

// Safety Keywords
export const safetyKeywords = pgTable("safety_keywords", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  keyword: text("keyword").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSafetyKeywordSchema = createInsertSchema(safetyKeywords).omit({
  id: true,
  createdAt: true,
});

export type InsertSafetyKeyword = z.infer<typeof insertSafetyKeywordSchema>;
export type SafetyKeyword = typeof safetyKeywords.$inferSelect;

// Voice Settings
export const voiceSettings = pgTable("voice_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  voiceName: text("voice_name").notNull().default("Google US English Female"),
  pitch: integer("pitch").notNull().default(1), // 0-2 (stored as int, will be divided by 10)
  rate: integer("rate").notNull().default(1), // 0-2 (stored as int, will be divided by 10)
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertVoiceSettingsSchema = createInsertSchema(voiceSettings).omit({
  id: true,
  updatedAt: true,
});

export type InsertVoiceSettings = z.infer<typeof insertVoiceSettingsSchema>;
export type VoiceSettings = typeof voiceSettings.$inferSelect;
