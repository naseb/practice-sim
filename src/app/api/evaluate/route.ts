import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";

export interface EvaluationResult {
  turnScore: number;
  letterGrade: string;
  clinicalWin: string;
  salesTrapWarning: string | null;
  coachingReframe: string;
  currentConsultationPhase:
    | "Framing"
    | "Lab Translation"
    | "Root-Cause"
    | "Strategic Bridge"
    | "Membership Offer";
}

async function generateWithRetry(ai: GoogleGenAI, params: any, maxRetries = 4) {
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
        const delay = attempt * 2000;
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
    const { transcript, latestTurn } = body;

    if (!latestTurn || typeof latestTurn !== "string") {
      return NextResponse.json(
        { error: "Invalid request payload. Expected 'latestTurn' string." },
        { status: 400 }
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

    const systemInstruction = `You are an elite conversational sales and clinical translation coach evaluating practitioner Danielle in a simulation for enrolling perimenopausal patients into comprehensive care programs/memberships.

IMPORTANT CONTEXT:
This simulation does NOT test diagnostic competence or complex medical trivia. It specifically tests Danielle's ability to translate clinical findings into plain, empathetic language and enroll skeptical, overwhelmed, or price-conscious perimenopausal women into ongoing programs WITHOUT high-pressure sales tactics.

EVALUATION RUBRIC (100 Points Total, 25 Points per Pillar):
1. Jargon-Free Empathy (25 pts): Did she avoid heavy medical jargon (e.g., deiodinase, receptor resistance, unopposed estrogen, HPA axis allostasis) and explain physiology in relatable, daily-life terms (e.g. "nature's calming hormone", "cellular thermostat", "energy roller-coaster")?
2. Symptom-to-Program Connection (25 pts): Did she clearly explain HOW the ongoing program structure (consistent touchpoints, dosage titration, lifestyle coaching) specifically solves the patient's daily pain points (3 AM waking, 2 PM crashes, mood swings)?
3. Non-Pushy Value Transition (25 pts): Did she bridge naturally to the program/membership without aggressive sales hooks, false urgency, or apologetic hesitation?
4. Confident Objection Handling (25 pts): When the patient pushes back on out-of-pocket cost, insurance coverage, DIY Amazon supplements, or pay-per-visit models, did she hold firm on why piecemeal care fails perimenopausal biology while staying consultative, calm, and empathetic?

SCORING GUIDELINES:
- 90-100 (A/A+): Masterful plain-English translation, deep validation, seamless bridge to why ongoing care is necessary, firm yet empathetic objection handling.
- 80-89 (B/B+): Strong translation and tone, but minor slips into clinical jargon or a slightly abrupt program transition.
- 70-79 (C/C+): Too much medical lecture, weak connection between biology and the ongoing program, defensive pricing justification, or missing the patient's emotional subtext.
- Below 70 (D/F): Heavy confusing jargon, high-pressure car-salesman tactics, or collapsing into discounting and apologetic positioning.

REQUIRED OUTPUT JSON:
- "turnScore": An integer (0-100).
- "letterGrade": Grade string (e.g., "A+", "A", "B+", "B", "C+", "C", "D").
- "clinicalWin": The single best empathetic, plain-language, or consultative statement in Danielle's turn.
- "salesTrapWarning": Any detected jargon overload, pushy sales pitch, apologetic hesitation, or weak defensive positioning (or null if none).
- "coachingReframe": An exact, polished script Danielle could say next time to elevate this turn.
- "currentConsultationPhase": Primary phase: "Framing" | "Lab Translation" | "Root-Cause" | "Strategic Bridge" | "Membership Offer".`;

    const prompt = `Consultation Transcript:
${
  Array.isArray(transcript) && transcript.length > 0
    ? transcript
        .map(
          (m: { role: string; content: string }) =>
            `${m.role === "assistant" ? "Patient" : "Danielle (Practitioner)"}: ${m.content}`
        )
        .join("\n\n")
    : "(Start of consultation)"
}

Danielle's Latest Turn to Evaluate:
"${latestTurn}"

Evaluate Danielle's latest turn now according to the 4 Sales-Translation Pillars.`;

    const response = await generateWithRetry(ai, {
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            turnScore: { type: Type.INTEGER, description: "Score from 0 to 100" },
            letterGrade: { type: Type.STRING, description: "Letter grade (e.g. A+, B, C)" },
            clinicalWin: {
              type: Type.STRING,
              description: "The best empathetic or plain-language statement in her turn",
            },
            salesTrapWarning: {
              type: Type.STRING,
              nullable: true,
              description: "Detected jargon overload, pushy pitch, or defensive positioning (null if none)",
            },
            coachingReframe: {
              type: Type.STRING,
              description: "Improved conversational script Danielle can say next time",
            },
            currentConsultationPhase: {
              type: Type.STRING,
              enum: [
                "Framing",
                "Lab Translation",
                "Root-Cause",
                "Strategic Bridge",
                "Membership Offer",
              ],
              description: "Current phase of the consultation",
            },
          },
          required: [
            "turnScore",
            "letterGrade",
            "clinicalWin",
            "coachingReframe",
            "currentConsultationPhase",
          ],
        },
      },
    });

    const rawText = response?.text ?? "{}";
    const evaluationData: EvaluationResult = JSON.parse(rawText);

    return NextResponse.json(evaluationData);
  } catch (error: unknown) {
    console.error("Error in /api/evaluate:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
