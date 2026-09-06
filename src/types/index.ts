import { PatientScenario, LabMarker } from "@/data/scenarios";

export type ConsultationPhase =
  | "Framing"
  | "Lab Translation"
  | "Root-Cause"
  | "Strategic Bridge"
  | "Membership Offer";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  evaluation?: EvaluationResult;
}

export interface EvaluationResult {
  turnScore: number;
  letterGrade: string;
  clinicalWin: string;
  salesTrapWarning: string | null;
  coachingReframe: string;
  currentConsultationPhase: ConsultationPhase;
}

export interface ConsultationSummary {
  averageScore: number;
  finalLetterGrade: string;
  completedPhases: ConsultationPhase[];
  strengths: string[];
  growthAreas: string[];
  totalTurns: number;
}
