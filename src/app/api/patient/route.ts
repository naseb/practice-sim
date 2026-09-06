import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { getScenarioById } from "@/data/scenarios";

async function generateWithRetry(ai: GoogleGenAI, params: any, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await ai.models.generateContent(params);
    } catch (err: any) {
      const isTransient =
        err?.message?.includes("503") ||
        err?.message?.includes("high demand") ||
        err?.message?.includes("RESOURCE_EXHAUSTED") ||
        err?.status === 503;
      if (isTransient && attempt < maxRetries) {
        const delay = attempt * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      throw err;
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { scenarioId, messages } = body;

    if (!scenarioId || !messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid request payload. Expected scenarioId and messages array." },
        { status: 400 }
      );
    }

    const scenario = getScenarioById(scenarioId);
    if (!scenario) {
      return NextResponse.json(
        { error: `Scenario with id '${scenarioId}' not found.` },
        { status: 404 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured on the server." },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    // Map conversation history to Gemini contents format
    const contents = messages.map((msg: { role: string; content: string }) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const response = await generateWithRetry(ai, {
      model: "gemini-3.6-flash",
      contents,
      config: {
        systemInstruction: scenario.systemPrompt,
      },
    });

    const reply = response?.text ?? "";

    return NextResponse.json({ response: reply });
  } catch (error: unknown) {
    console.error("Error in /api/patient:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
