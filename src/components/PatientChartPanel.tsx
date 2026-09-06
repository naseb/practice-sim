import React, { useState } from "react";
import { PatientScenario, LabMarker } from "@/data/scenarios";
import {
  FileText,
  Activity,
  Brain,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Briefcase,
  HelpCircle,
  X,
  Search,
} from "lucide-react";

interface PatientChartPanelProps {
  scenario: PatientScenario;
  isOpen: boolean;
  onClose: () => void;
}

export const PatientChartPanel: React.FC<PatientChartPanelProps> = ({
  scenario,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"labs" | "history" | "psychology">("labs");
  const [expandedLabIndex, setExpandedLabIndex] = useState<number | null>(null);
  const [searchFilter, setSearchFilter] = useState("");

  if (!isOpen) return null;

  const filteredLabs = scenario.labs.filter(
    (lab) =>
      lab.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      lab.significance.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <aside className="w-full lg:w-[420px] xl:w-[440px] flex flex-col border-r border-slate-800 bg-slate-900/95 shrink-0 z-20 h-full overflow-hidden">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-slate-800 p-4 sm:p-5 bg-slate-950/40">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">Patient Electronic Chart</h2>
            <p className="text-xs sm:text-sm text-slate-400">Intake & Diagnostic Panel</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Patient Summary Card */}
      <div className="border-b border-slate-800/80 bg-slate-950/30 p-4 sm:p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-100">{scenario.name}</h3>
              <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-bold text-teal-300 border border-slate-700">
                {scenario.age} yo
              </span>
            </div>
            <div className="mt-1.5 flex items-center gap-2 text-sm text-slate-300">
              <Briefcase className="h-4 w-4 text-slate-400 shrink-0" />
              <span>{scenario.occupation}</span>
            </div>
          </div>
        </div>

        {/* Chief Complaints Tags */}
        <div className="mt-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Chief Complaints & Pain Points
          </span>
          <div className="flex flex-wrap gap-2">
            {scenario.chiefComplaints.map((cc, i) => (
              <span
                key={i}
                className="rounded-lg bg-rose-950/40 border border-rose-900/50 px-3 py-1.5 text-xs sm:text-sm font-medium text-rose-200 flex items-start gap-1.5 leading-snug shadow-sm"
              >
                <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{cc}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-950/20 px-4 sm:px-5">
        <button
          onClick={() => setActiveTab("labs")}
          className={`flex items-center gap-2 border-b-2 py-3 px-3.5 text-sm sm:text-base font-semibold transition-colors ${
            activeTab === "labs"
              ? "border-teal-500 text-teal-300"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Activity className="h-4 w-4" />
          <span>Labs ({scenario.labs.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`flex items-center gap-2 border-b-2 py-3 px-3.5 text-sm sm:text-base font-semibold transition-colors ${
            activeTab === "history"
              ? "border-teal-500 text-teal-300"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>History</span>
        </button>
        <button
          onClick={() => setActiveTab("psychology")}
          className={`flex items-center gap-2 border-b-2 py-3 px-3.5 text-sm sm:text-base font-semibold transition-colors ${
            activeTab === "psychology"
              ? "border-teal-500 text-teal-300"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Brain className="h-4 w-4" />
          <span>Persona & Objection</span>
        </button>
      </div>

      {/* Tab Content Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {activeTab === "labs" && (
          <div className="space-y-3.5">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search biomarker or significance..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/70 pl-9 pr-3.5 py-2.5 text-sm text-slate-200 placeholder-slate-400 focus:border-teal-500/50 focus:outline-none focus:ring-1 focus:ring-teal-500/30"
              />
            </div>

            <div className="text-xs sm:text-sm text-slate-400 flex items-center justify-between font-medium">
              <span>Interactive Biomarker Analysis</span>
              <span className="text-teal-400">Click card for clinical insight</span>
            </div>

            {filteredLabs.map((lab: LabMarker, idx: number) => {
              const isExpanded = expandedLabIndex === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setExpandedLabIndex(isExpanded ? null : idx)}
                  className="rounded-xl border border-slate-800/90 bg-slate-950/60 p-4 hover:border-slate-700 transition-all cursor-pointer shadow-sm hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-100 leading-snug">
                        {lab.name}
                      </h4>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-base sm:text-lg font-extrabold text-amber-400 font-mono">
                          {lab.value}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="rounded-md bg-amber-950/50 border border-amber-800/50 px-2 py-1 text-xs font-bold text-amber-300">
                        Suboptimal
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Range Comparison Table */}
                  <div className="mt-3 grid grid-cols-2 gap-2.5 rounded-xl bg-slate-900/90 p-3 text-xs sm:text-sm border border-slate-800/60">
                    <div>
                      <span className="text-slate-400 block text-xs font-semibold mb-0.5">Conventional Range</span>
                      <span className="font-mono text-slate-200 font-medium">{lab.conventionalRange}</span>
                    </div>
                    <div>
                      <span className="text-teal-400 block text-xs font-bold mb-0.5">Functional Optimal</span>
                      <span className="font-mono text-teal-300 font-bold">{lab.functionalOptimal}</span>
                    </div>
                  </div>

                  {/* Clinical Significance Expansion */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-slate-800/80 text-sm sm:text-base text-slate-200 bg-slate-900/50 rounded-xl p-3.5 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-teal-400 mb-1">
                        <HelpCircle className="h-4 w-4 shrink-0" />
                        <span>Plain-Language Clinical Translation:</span>
                      </div>
                      <p className="leading-relaxed text-slate-300">{lab.significance}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "history" && (
          <div className="rounded-xl border border-slate-800/80 bg-slate-950/50 p-4 sm:p-5 text-sm sm:text-base text-slate-200 leading-relaxed space-y-3.5">
            <h4 className="font-bold text-slate-100 flex items-center gap-2 text-base">
              <FileText className="h-4 w-4 text-teal-400" />
              <span>Comprehensive Health Narrative</span>
            </h4>
            <p className="whitespace-pre-line text-slate-300 leading-relaxed">{scenario.history}</p>
          </div>
        )}

        {activeTab === "psychology" && (
          <div className="rounded-xl border border-slate-800/80 bg-slate-950/50 p-4 sm:p-5 text-sm sm:text-base text-slate-200 leading-relaxed space-y-3.5">
            <h4 className="font-bold text-slate-100 flex items-center gap-2 text-base">
              <Brain className="h-4 w-4 text-teal-400" />
              <span>Mindset, Skepticism & Key Objection</span>
            </h4>
            <p className="whitespace-pre-line text-slate-300 leading-relaxed">{scenario.psychology}</p>
          </div>
        )}
      </div>
    </aside>
  );
};
