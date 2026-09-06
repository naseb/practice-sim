import React, { useState } from "react";
import { EvaluationResult, Message } from "@/types";
import {
  Sparkles,
  Award,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Copy,
  Check,
  X,
  Layers,
  History,
  TrendingUp,
  ShieldCheck,
  MessageSquareQuote,
  Target,
} from "lucide-react";

interface EvaluatorDrawerProps {
  evaluation: EvaluationResult | null;
  runningAverage: number | null;
  totalEvaluatedTurns: number;
  evaluationsHistory: { messageId: string; evaluation: EvaluationResult; turnText: string }[];
  isOpen: boolean;
  onClose: () => void;
  onSelectHistoricalTurn?: (messageId: string) => void;
  selectedMessageId?: string | null;
}

export const EvaluatorDrawer: React.FC<EvaluatorDrawerProps> = ({
  evaluation,
  runningAverage,
  totalEvaluatedTurns,
  evaluationsHistory,
  isOpen,
  onClose,
  onSelectHistoricalTurn,
  selectedMessageId,
}) => {
  const [copied, setCopied] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-400 border-emerald-500/40 bg-emerald-950/50";
    if (score >= 80) return "text-teal-400 border-teal-500/40 bg-teal-950/50";
    if (score >= 70) return "text-amber-400 border-amber-500/40 bg-amber-950/50";
    return "text-rose-400 border-rose-500/40 bg-rose-950/50";
  };

  return (
    <aside className="w-full lg:w-[420px] xl:w-[450px] flex flex-col border-l border-slate-800 bg-slate-900/95 shrink-0 z-20 h-full overflow-hidden">
      {/* Drawer Header */}
      <div className="flex items-center justify-between border-b border-slate-800 p-4 sm:p-5 bg-slate-950/40">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">Sales Translation Coach</h2>
            <p className="text-xs sm:text-sm text-slate-400">4-Pillar Enrollment Scorecard</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {evaluationsHistory.length > 1 && (
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`rounded-xl px-2.5 py-1.5 text-xs sm:text-sm font-semibold border transition-colors flex items-center gap-1.5 ${
                showHistory
                  ? "bg-indigo-950/70 border-indigo-700/60 text-indigo-200"
                  : "bg-slate-800 border-slate-700 text-slate-300 hover:text-white"
              }`}
              title="Toggle Turn History"
            >
              <History className="h-4 w-4" />
              <span>Turns ({evaluationsHistory.length})</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Running Average & Session Stat Banner */}
      <div className="border-b border-slate-800/80 bg-slate-950/50 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-950 border border-teal-800 text-teal-400">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block">Session Running Avg</span>
            <span className="text-sm sm:text-base font-extrabold text-slate-100">
              {runningAverage !== null ? `${runningAverage} / 100` : "No turns yet"}
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-semibold text-slate-400 block">Evaluated Turns</span>
          <span className="text-sm sm:text-base font-bold text-teal-400 font-mono">
            {totalEvaluatedTurns} {totalEvaluatedTurns === 1 ? "turn" : "turns"}
          </span>
        </div>
      </div>

      {/* 4 Pillars Quick Reference Strip */}
      <div className="border-b border-slate-800/70 bg-slate-950/30 px-4 py-2.5 grid grid-cols-2 gap-2 text-xs font-medium text-slate-300">
        <div className="flex items-center gap-1.5 truncate">
          <MessageSquareQuote className="h-3.5 w-3.5 text-teal-400 shrink-0" />
          <span className="truncate">Jargon-Free Empathy (25)</span>
        </div>
        <div className="flex items-center gap-1.5 truncate">
          <Target className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
          <span className="truncate">Symptom ➔ Program (25)</span>
        </div>
        <div className="flex items-center gap-1.5 truncate">
          <Sparkles className="h-3.5 w-3.5 text-amber-400 shrink-0" />
          <span className="truncate">Non-Pushy Value (25)</span>
        </div>
        <div className="flex items-center gap-1.5 truncate">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          <span className="truncate">Objection Holding (25)</span>
        </div>
      </div>

      {/* Turn History View if toggled */}
      {showHistory && evaluationsHistory.length > 0 && (
        <div className="border-b border-slate-800 bg-slate-950/80 p-3.5 max-h-52 overflow-y-auto space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Select Turn to View Evaluation:
          </span>
          {evaluationsHistory.map((item, idx) => (
            <button
              key={item.messageId}
              onClick={() => {
                onSelectHistoricalTurn?.(item.messageId);
                setShowHistory(false);
              }}
              className={`w-full text-left p-2.5 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between gap-2.5 ${
                selectedMessageId === item.messageId
                  ? "bg-indigo-950/70 border-indigo-500/60 text-indigo-100"
                  : "bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
              }`}
            >
              <div className="truncate flex-1">
                <span className="font-bold text-slate-200">Turn #{idx + 1}: </span>
                <span className="italic truncate">{item.turnText}</span>
              </div>
              <span className={`px-2 py-0.5 rounded-md text-xs font-black shrink-0 ${getScoreColor(item.evaluation.turnScore)}`}>
                {item.evaluation.turnScore} ({item.evaluation.letterGrade})
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Main Scorecard Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
        {!evaluation ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-3.5">
            <div className="h-12 w-12 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm sm:text-base font-bold text-slate-200">Awaiting Practitioner Response</p>
              <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
                Respond to the patient in the consultation room to receive live feedback on plain-language translation, connecting symptoms to your ongoing care program, and consultative objection handling.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Turn Score Pill & Grade Badge */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Turn Assessment
                  </span>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-black text-slate-100 font-mono">
                      {evaluation.turnScore}
                    </span>
                    <span className="text-sm sm:text-base text-slate-400 font-mono">/ 100</span>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Grade
                  </span>
                  <span
                    className={`rounded-xl border px-4 py-1 text-base sm:text-lg font-black shadow-sm ${getScoreColor(
                      evaluation.turnScore
                    )}`}
                  >
                    {evaluation.letterGrade}
                  </span>
                </div>
              </div>

              {/* Consultation Phase Badge */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs sm:text-sm">
                <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                  <Layers className="h-4 w-4 text-teal-400" />
                  <span>Detected Phase:</span>
                </span>
                <span className="font-bold text-teal-300 bg-teal-950/70 border border-teal-800/60 px-3 py-1 rounded-lg">
                  {evaluation.currentConsultationPhase}
                </span>
              </div>
            </div>

            {/* 1. Clinical Win Card (Green highlight) */}
            <div className="rounded-2xl border border-emerald-800/40 bg-emerald-950/30 p-4 sm:p-5 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-emerald-400">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                <span>Plain-Language & Empathy Win</span>
              </div>
              <p className="text-sm sm:text-base text-emerald-100 leading-relaxed">
                {evaluation.clinicalWin}
              </p>
            </div>

            {/* 2. Sales Trap Warning Card (Amber/Red highlight - hidden if null) */}
            {evaluation.salesTrapWarning && (
              <div className="rounded-2xl border border-amber-800/50 bg-amber-950/30 p-4 sm:p-5 shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-amber-400">
                  <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />
                  <span>Sales Trap / Jargon / Positioning Caution</span>
                </div>
                <p className="text-sm sm:text-base text-amber-100 leading-relaxed">
                  {evaluation.salesTrapWarning}
                </p>
              </div>
            )}

            {/* 3. Suggested Script Reframe Card (Blue highlight) */}
            <div className="rounded-2xl border border-indigo-800/40 bg-indigo-950/30 p-4 sm:p-5 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-indigo-400">
                  <Lightbulb className="h-5 w-5 text-indigo-400 shrink-0" />
                  <span>Conversational Script Reframe</span>
                </div>
                <button
                  onClick={() => handleCopy(evaluation.coachingReframe)}
                  className="flex items-center gap-1.5 rounded-lg bg-indigo-900/70 hover:bg-indigo-800 px-2.5 py-1 text-xs font-semibold text-indigo-200 transition-colors cursor-pointer"
                  title="Copy reframe script"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <div className="bg-slate-950/70 rounded-xl p-3.5 border border-indigo-900/40">
                <p className="text-base sm:text-lg text-indigo-100 italic leading-relaxed">
                  "{evaluation.coachingReframe}"
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
};
