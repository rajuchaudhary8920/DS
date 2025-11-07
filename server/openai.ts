import OpenAI from "openai";
import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config()
// const openai = new OpenAI({ apiKey: process.env.AI_API });
const groq = new Groq({ apiKey: process.env.GROQ });

export async function getChatResponse(
  message: string
): Promise<{ response: string; isSafetyAlert: boolean }> {
  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system", 
          content: `You are a supportive, empathetic AI companion for women's wellness and safety. Be warm, non-judgmental, and encouraging. please do not add any emoji or special character just simple responce`,
        },
        {
          role: "user", 
          content: message,
        },
      ],
      model: "openai/gpt-oss-20b",
    });

    return {
      response:
        response.choices[0]?.message?.content ||
        "I'm here for you. How can I help?",
      isSafetyAlert: false,
    };
  } catch (error: any) {
    console.error(
      "OpenAI API error:",
      error.response?.data || error.message || error
    );
    throw new Error("Failed to get AI response");
  }
}

export function detectSafetyKeywords(
  message: string,
  keywords: string[]
): boolean {
  const lowerMessage = message.toLowerCase();
  return keywords.some((keyword) =>
    lowerMessage.includes(keyword.toLowerCase())
  );
}