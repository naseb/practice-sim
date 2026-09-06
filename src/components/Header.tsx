import React from "react";
import { SCENARIOS } from "@/data/scenarios";
import { ConsultationPhase } from "@/types";
import {
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  User,
  PanelLeft,
  PanelRight,
  LogOut,
  Stethoscope,
} from "lucide-react";

interface HeaderProps {
  currentScenarioId: string;
  onSelectScenario: (scenarioId: string) => void;
  currentPhase: ConsultationPhase;
  completedPhases: Set<ConsultationPhase>;
  onReset: () => void;
  onEndConsultation: () => void;
  onToggleLeftPanel: () => void;
  onToggleRightPanel: () => void;
  isLeftPanelOpen: boolean;
  isRightPanelOpen: boolean;
  hasStarted: boolean;
}

const PHASES: ConsultationPhase[] = [
  "Framing",
  "Lab Translation",
  "Root-Cause",
  "Strategic Bridge",
  "Membership Offer",
];

export const Header: React.FC<HeaderProps> = ({
  currentScenarioId,
  onSelectScenario,
  currentPhase,
  completedPhases,
  onReset,
  onEndConsultation,
  onToggleLeftPanel,
  onToggleRightPanel,
  isLeftPanelOpen,
  isRightPanelOpen,
  hasStarted,
}) => {
  return (
    <header className="sticky top-0 z-30 flex flex-col border-b border-slate-800 bg-slate-900/95 backdrop-blur shadow-sm">
      {/* Top Bar */}
      <div className="flex h-18 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleLeftPanel}
            title={isLeftPanelOpen ? "Collapse Patient Chart" : "Expand Patient Chart"}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <PanelLeft className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Stethoscope className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                Clinical Simulation
                <span className="hidden sm:inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-slate-800 text-teal-400 border border-teal-500/30">
                  Sales Translation
                </span>
              </h1>
            </div>
          </div>
        </div>

        {/* Center: Scenario Selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2.5 bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 shadow-inner">
            <User className="h-5 w-5 text-teal-400 shrink-0" />
            <span className="text-sm font-semibold text-slate-400 hidden sm:inline">Patient Avatar:</span>
            <select
              value={currentScenarioId}
              onChange={(e) => onSelectScenario(e.target.value)}
              className="bg-transparent text-sm sm:text-base font-bold text-slate-100 focus:outline-none cursor-pointer pr-2"
            >
              {SCENARIOS.map((s) => (
                <option key={s.id} value={s.id} className="bg-slate-900 text-slate-100 text-sm">
                  {s.name} ({s.age} yo — {s.occupation.split("&")[0].trim()})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onReset}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            title="Reset consultation session"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="hidden md:inline">Reset</span>
          </button>

          <button
            onClick={onEndConsultation}
            disabled={!hasStarted}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold shadow-sm transition-all ${
              hasStarted
                ? "bg-gradient-to-r from-teal-600 to-emerald-600 text-white hover:from-teal-500 hover:to-emerald-500 shadow-teal-900/30 cursor-pointer"
                : "bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed"
            }`}
          >
            <LogOut className="h-4 w-4" />
            <span>End Consultation</span>
          </button>

          <button
            onClick={onToggleRightPanel}
            title={isRightPanelOpen ? "Collapse Evaluator" : "Expand Evaluator"}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <PanelRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Visual Consultation Stage Tracker */}
      <div className="flex items-center justify-between border-t border-slate-800/80 bg-slate-950/60 px-4 sm:px-6 py-2.5 overflow-x-auto scrollbar-none">
        <div className="flex items-center min-w-max gap-2 sm:gap-3 mx-auto">
          {PHASES.map((phase, idx) => {
            const isActive = currentPhase === phase;
            const isCompleted = completedPhases.has(phase);

            return (
              <React.Fragment key={phase}>
                <div
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm shadow-teal-500/20 ring-1 ring-teal-500/40"
                      : isCompleted
                      ? "bg-emerald-950/50 text-emerald-400 border border-emerald-800/40"
                      : "text-slate-400 hover:text-slate-300"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  ) : isActive ? (
                    <span className="relative flex h-2.5 w-2.5 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
                    </span>
                  ) : (
                    <span className="h-4 w-4 flex items-center justify-center text-xs rounded-full bg-slate-800 text-slate-400 shrink-0 font-bold">
                      {idx + 1}
                    </span>
                  )}
                  <span>{phase}</span>
                </div>
                {idx < PHASES.length - 1 && (
                  <ChevronRight className="h-4 w-4 text-slate-700 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </header>
  );
};
