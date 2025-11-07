import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getChatResponse, detectSafetyKeywords } from "./openai";
import {
  insertEmergencyContactSchema,
  insertConversationSchema,
  insertCycleTrackingSchema,
  insertMoodEntrySchema,
  insertWellnessMetricSchema,
  insertSafetyKeywordSchema,
  insertVoiceSettingsSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Emergency Contacts
  app.get("/api/emergency-contacts", async (_req, res) => {
    try {
      const contacts = await storage.getEmergencyContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch emergency contacts" });
    }
  });

  app.post("/api/emergency-contacts", async (req, res) => {
    try {
      const validatedData = insertEmergencyContactSchema.parse(req.body);
      const contact = await storage.createEmergencyContact(validatedData);
      res.json(contact);
    } catch (error) {
      res.status(400).json({ error: "Invalid contact data" });
    }
  });

  app.patch("/api/emergency-contacts/:id", async (req, res) => {
    try {
      const validatedData = insertEmergencyContactSchema.parse(req.body);
      const contact = await storage.updateEmergencyContact(req.params.id, validatedData);
      if (!contact) {
        return res.status(404).json({ error: "Contact not found" });
      }
      res.json(contact);
    } catch (error) {
      res.status(400).json({ error: "Invalid contact data" });
    }
  });

  app.delete("/api/emergency-contacts/:id", async (req, res) => {
    try {
      await storage.deleteEmergencyContact(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete contact" });
    }
  });

  // Conversations and Chat
  app.get("/api/conversations", async (_req, res) => {
    try {
      const conversations = await storage.getConversations();
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;
      
      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Invalid message" });
      }

      // Check for safety keywords
      console.log("incoming message ",message);
      
      const keywords = await storage.getSafetyKeywords();
      const activeKeywords = keywords
        .filter(k => k.isActive)
        .map(k => k.keyword);
      
      const isSafetyAlert = detectSafetyKeywords(message, activeKeywords);
      // Get AI response
      const { response: aiResponse } = await getChatResponse(message);

      // Save conversation
      const conversation = await storage.createConversation({
        userMessage: message,
        aiResponse,
        isSafetyAlert,
      });

      res.json(conversation);
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ error: "Failed to process chat message" });
    }
  });

  // Cycle Tracking
  app.get("/api/cycle-tracking", async (_req, res) => {
    try {
      const cycles = await storage.getCycleTracking();
      res.json(cycles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cycle tracking" });
    }
  });

  app.post("/api/cycle-tracking", async (req, res) => {
    try {
      const validatedData = insertCycleTrackingSchema.parse(req.body);
      const cycle = await storage.createCycleTracking(validatedData);
      res.json(cycle);
    } catch (error) {
      res.status(400).json({ error: "Invalid cycle data" });
    }
  });

  // Mood Entries
  app.get("/api/mood-entries", async (_req, res) => {
    try {
      const moods = await storage.getMoodEntries();
      res.json(moods);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch mood entries" });
    }
  });

  app.post("/api/mood-entries", async (req, res) => {
    try {
      const validatedData = insertMoodEntrySchema.parse(req.body);
      const mood = await storage.createMoodEntry(validatedData);
      res.json(mood);
    } catch (error) {
      res.status(400).json({ error: "Invalid mood data" });
    }
  });

  // Wellness Metrics
  app.get("/api/wellness-metrics", async (_req, res) => {
    try {
      const metrics = await storage.getWellnessMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch wellness metrics" });
    }
  });

  app.post("/api/wellness-metrics", async (req, res) => {
    try {
      const validatedData = insertWellnessMetricSchema.parse(req.body);
      const metric = await storage.createWellnessMetric(validatedData);
      res.json(metric);
    } catch (error) {
      res.status(400).json({ error: "Invalid wellness data" });
    }
  });

  // Safety Keywords
  app.get("/api/safety-keywords", async (_req, res) => {
    try {
      const keywords = await storage.getSafetyKeywords();
      res.json(keywords);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch safety keywords" });
    }
  });

  app.post("/api/safety-keywords", async (req, res) => {
    try {
      const validatedData = insertSafetyKeywordSchema.parse(req.body);
      const keyword = await storage.createSafetyKeyword(validatedData);
      res.json(keyword);
    } catch (error) {
      res.status(400).json({ error: "Invalid keyword data" });
    }
  });

  app.patch("/api/safety-keywords/:id", async (req, res) => {
    try {
      const { isActive } = req.body;
      if (typeof isActive !== "boolean") {
        return res.status(400).json({ error: "Invalid data" });
      }
      
      const keyword = await storage.updateSafetyKeyword(req.params.id, isActive);
      if (!keyword) {
        return res.status(404).json({ error: "Keyword not found" });
      }
      
      res.json(keyword);
    } catch (error) {
      res.status(500).json({ error: "Failed to update keyword" });
    }
  });

  // Voice Settings
  app.get("/api/voice-settings", async (_req, res) => {
    try {
      const settings = await storage.getVoiceSettings();
      if (!settings) {
        // Return default settings
        return res.json({
          id: "default",
          voiceName: "Google US English Female",
          pitch: 10,
          rate: 10,
          updatedAt: new Date(),
        });
      }
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch voice settings" });
    }
  });

  app.post("/api/voice-settings", async (req, res) => {
    try {
      const validatedData = insertVoiceSettingsSchema.parse(req.body);
      const settings = await storage.upsertVoiceSettings(validatedData);
      res.json(settings);
    } catch (error) {
      res.status(400).json({ error: "Invalid settings data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
