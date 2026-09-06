import React from "react";
import { ConsultationPhase, ConsultationSummary, Message } from "@/types";
import { PatientScenario } from "@/data/scenarios";
import {
  Award,
  CheckCircle2,
  XCircle,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Download,
  RotateCcw,
  X,
  User,
  Layers,
} from "lucide-react";

interface ConsultationSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: ConsultationSummary;
  scenario: PatientScenario;
  messages: Message[];
  onRestart: () => void;
}

const ALL_PHASES: ConsultationPhase[] = [
  "Framing",
  "Lab Translation",
  "Root-Cause",
  "Strategic Bridge",
  "Membership Offer",
];

export const ConsultationSummaryModal: React.FC<ConsultationSummaryModalProps> = ({
  isOpen,
  onClose,
  summary,
  scenario,
  messages,
  onRestart,
}) => {
  if (!isOpen) return null;

  const getGradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "text-emerald-400 bg-emerald-950/60 border-emerald-500/50";
    if (grade.startsWith("B")) return "text-teal-400 bg-teal-950/60 border-teal-500/50";
    if (grade.startsWith("C")) return "text-amber-400 bg-amber-950/60 border-amber-500/50";
    return "text-rose-400 bg-rose-950/60 border-rose-500/50";
  };

  const handleExportTranscript = () => {
    const transcriptText = `--- CLINICAL CONSULTATION & SALES TRANSLATION AUDIT ---
Patient: ${scenario.name} (${scenario.age} yo, ${scenario.occupation})
Session Score: ${summary.averageScore}/100 (Grade: ${summary.finalLetterGrade})
Total Turns: ${summary.totalTurns}
Completed Stages: ${summary.completedPhases.join(", ")}

--- CONVERSATION TRANSCRIPT ---
${messages
  .map(
    (m) =>
      `[${m.timestamp}] ${
        m.role === "user" ? "Danielle (Practitioner)" : scenario.name
      }:\n${m.content}\n${
        m.evaluation
          ? `>> Score: ${m.evaluation.turnScore}/100 (${m.evaluation.letterGrade}) | Phase: ${m.evaluation.currentConsultationPhase}\n`
          : ""
      }`
  )
  .join("\n")}
`;

    const blob = new Blob([transcriptText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Sales_Translation_Audit_${scenario.name.replace(/\s+/g, "_")}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-5 sm:p-6 bg-slate-950/60">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20 shadow-md">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-100">
                Consultation & Enrollment Performance Audit
              </h2>
              <p className="text-sm text-slate-400">
                Sales Translation Practice with {scenario.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Score Hero Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Overall Score
                </span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-4xl font-black text-slate-100 font-mono">
                    {summary.averageScore}
                  </span>
                  <span className="text-base text-slate-400 font-mono">/ 100</span>
                </div>
                <span className="text-xs sm:text-sm text-slate-400 mt-1 block">
                  Across {summary.totalTurns} practitioner {summary.totalTurns === 1 ? "turn" : "turns"}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Final Grade
                </span>
                <span
                  className={`rounded-2xl border px-5 py-2 text-3xl font-black shadow-lg ${getGradeColor(
                    summary.finalLetterGrade
                  )}`}
                >
                  {summary.finalLetterGrade}
                </span>
              </div>
            </div>

            {/* Stage Progress Summary */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Layers className="h-4 w-4 text-teal-400" />
                  <span>5-Stage Journey</span>
                </span>
                <span className="text-sm font-bold text-teal-400">
                  {summary.completedPhases.length} / 5 Stages
                </span>
              </div>

              <div className="space-y-2 mt-2.5">
                {ALL_PHASES.map((phase) => {
                  const isDone = summary.completedPhases.includes(phase);
                  return (
                    <div
                      key={phase}
                      className="flex items-center justify-between text-xs sm:text-sm py-1.5 px-2.5 rounded-lg bg-slate-900/60 border border-slate-800/60"
                    >
                      <span className={isDone ? "text-slate-200 font-semibold" : "text-slate-400"}>
                        {phase}
                      </span>
                      {isDone ? (
                        <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Demonstrated</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-xs text-slate-400">
                          <XCircle className="h-4 w-4" />
                          <span>Not Reached</span>
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Key Strengths (Clinical Wins) */}
          {summary.strengths.length > 0 && (
            <div className="rounded-2xl border border-emerald-900/40 bg-emerald-950/20 p-5 space-y-3">
              <h3 className="text-xs sm:text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <span>Key Plain-Language & Enrollment Strengths</span>
              </h3>
              <ul className="space-y-2">
                {summary.strengths.map((win, idx) => (
                  <li
                    key={idx}
                    className="text-sm sm:text-base text-emerald-100 leading-relaxed flex items-start gap-2.5 bg-emerald-950/40 rounded-xl p-3 border border-emerald-900/30"
                  >
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{win}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Growth Areas & Sales Traps */}
          {summary.growthAreas.length > 0 ? (
            <div className="rounded-2xl border border-amber-900/40 bg-amber-950/20 p-5 space-y-3">
              <h3 className="text-xs sm:text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-400" />
                <span>Sales Traps & Areas for Growth</span>
              </h3>
              <ul className="space-y-2">
                {summary.growthAreas.map((area, idx) => (
                  <li
                    key={idx}
                    className="text-sm sm:text-base text-amber-100 leading-relaxed flex items-start gap-2.5 bg-amber-950/40 rounded-xl p-3 border border-amber-900/30"
                  >
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="rounded-2xl border border-teal-900/40 bg-teal-950/20 p-5 text-sm sm:text-base text-teal-300 flex items-center gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-teal-400" />
              <span>No major sales traps or jargon pitfalls detected. Excellent consultative communication!</span>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between border-t border-slate-800 p-5 sm:p-6 bg-slate-950/70">
          <button
            onClick={handleExportTranscript}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>Export Transcript & Audit</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              Review Chat
            </button>
            <button
              onClick={onRestart}
              className="flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-teal-500 shadow-md transition-colors cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Start New Simulation</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
