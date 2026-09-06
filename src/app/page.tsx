"use client";

import React, { useState, useMemo } from "react";
import { SCENARIOS, getScenarioById, PatientScenario } from "@/data/scenarios";
import {
  Message,
  EvaluationResult,
  ConsultationPhase,
  ConsultationSummary,
} from "@/types";
import { Header } from "@/components/Header";
import { PatientChartPanel } from "@/components/PatientChartPanel";
import { ConsultationRoom } from "@/components/ConsultationRoom";
import { EvaluatorDrawer } from "@/components/EvaluatorDrawer";
import { ConsultationSummaryModal } from "@/components/ConsultationSummaryModal";

export default function Home() {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(
    SCENARIOS[0].id
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingPatient, setIsLoadingPatient] = useState<boolean>(false);
  const [isLoadingEvaluation, setIsLoadingEvaluation] = useState<boolean>(false);

  // Layout drawer states
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState<boolean>(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState<boolean>(true);

  // Consultation progress & evaluation states
  const [currentPhase, setCurrentPhase] = useState<ConsultationPhase>("Framing");
  const [completedPhases, setCompletedPhases] = useState<Set<ConsultationPhase>>(
    new Set()
  );
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState<boolean>(false);

  // Active scenario
  const scenario: PatientScenario = useMemo(() => {
    return getScenarioById(selectedScenarioId) || SCENARIOS[0];
  }, [selectedScenarioId]);

  // All evaluations from practitioner messages
  const evaluationsList = useMemo(() => {
    return messages
      .filter((m) => m.role === "user" && m.evaluation)
      .map((m) => ({
        messageId: m.id,
        evaluation: m.evaluation as EvaluationResult,
        turnText: m.content,
      }));
  }, [messages]);

  // Currently displayed evaluation in right drawer
  const activeEvaluation: EvaluationResult | null = useMemo(() => {
    if (selectedMessageId) {
      const found = messages.find((m) => m.id === selectedMessageId);
      if (found?.evaluation) return found.evaluation;
    }
    if (evaluationsList.length > 0) {
      return evaluationsList[evaluationsList.length - 1].evaluation;
    }
    return null;
  }, [selectedMessageId, messages, evaluationsList]);

  // Calculate session running average
  const runningAverage = useMemo(() => {
    if (evaluationsList.length === 0) return null;
    const total = evaluationsList.reduce(
      (sum, item) => sum + item.evaluation.turnScore,
      0
    );
    return Math.round(total / evaluationsList.length);
  }, [evaluationsList]);

  const computeLetterGrade = (score: number): string => {
    if (score >= 95) return "A+";
    if (score >= 90) return "A";
    if (score >= 87) return "A-";
    if (score >= 83) return "B+";
    if (score >= 80) return "B";
    if (score >= 77) return "B-";
    if (score >= 73) return "C+";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    return "F";
  };

  const handleSelectScenario = (scenarioId: string) => {
    if (scenarioId === selectedScenarioId) return;
    if (
      messages.length > 0 &&
      !window.confirm(
        "Switching scenarios will start a new session for that patient. Proceed?"
      )
    ) {
      return;
    }
    setSelectedScenarioId(scenarioId);
    handleReset();
  };

  const handleReset = () => {
    setMessages([]);
    setCurrentPhase("Framing");
    setCompletedPhases(new Set());
    setSelectedMessageId(null);
    setIsSummaryModalOpen(false);
  };

  const handleSendMessage = async (text: string) => {
    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const userMessageId = `msg-${Date.now()}`;
    const newUserMessage: Message = {
      id: userMessageId,
      role: "user",
      content: text,
      timestamp,
    };

    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setSelectedMessageId(userMessageId);

    // Call Patient simulation API
    setIsLoadingPatient(true);
    const BASE_PATH = "/practice";
    const patientPromise = fetch(`${BASE_PATH}/api/patient`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scenarioId: scenario.id,
        messages: updatedMessages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `HTTP error ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        const patientMessage: Message = {
          id: `msg-${Date.now() + 1}`,
          role: "assistant",
          content: data.response,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prev) => [...prev, patientMessage]);
      })
      .catch((err) => {
        console.error("Patient response failed:", err);
        const errorReply: Message = {
          id: `msg-${Date.now() + 1}`,
          role: "assistant",
          content: `(System Note: Unable to generate patient response. Please verify that GEMINI_API_KEY is configured in .env.local: ${err.message})`,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prev) => [...prev, errorReply]);
      })
      .finally(() => {
        setIsLoadingPatient(false);
      });

    // Call Evaluator API concurrently
    setIsLoadingEvaluation(true);
    const evaluatePromise = fetch(`${BASE_PATH}/api/evaluate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transcript: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        latestTurn: text,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `HTTP error ${res.status}`);
        }
        return res.json();
      })
      .then((evalData: EvaluationResult) => {
        // Attach evaluation to this user message
        setMessages((prev) =>
          prev.map((m) =>
            m.id === userMessageId ? { ...m, evaluation: evalData } : m
          )
        );

        if (evalData.currentConsultationPhase) {
          setCurrentPhase(evalData.currentConsultationPhase);
          setCompletedPhases((prev) =>
            new Set([...Array.from(prev), evalData.currentConsultationPhase])
          );
        }
      })
      .catch((err) => {
        console.error("Evaluation failed:", err);
      })
      .finally(() => {
        setIsLoadingEvaluation(false);
      });

    await Promise.allSettled([patientPromise, evaluatePromise]);
  };

  // Compile summary data for end of consultation audit
  const summaryData: ConsultationSummary = useMemo(() => {
    const avg = runningAverage ?? 0;
    const grade = computeLetterGrade(avg);
    const completed = Array.from(completedPhases);

    const strengths: string[] = [];
    const growthAreas: string[] = [];

    evaluationsList.forEach((item) => {
      if (item.evaluation.clinicalWin) {
        strengths.push(item.evaluation.clinicalWin);
      }
      if (item.evaluation.salesTrapWarning) {
        growthAreas.push(item.evaluation.salesTrapWarning);
      }
    });

    return {
      averageScore: avg,
      finalLetterGrade: grade,
      completedPhases: completed,
      strengths: Array.from(new Set(strengths)).slice(0, 4),
      growthAreas: Array.from(new Set(growthAreas)).slice(0, 4),
      totalTurns: evaluationsList.length,
    };
  }, [runningAverage, completedPhases, evaluationsList]);

  return (
    <div className="flex h-screen flex-col bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* 1. Header with Scenario Selector & 5-Stage Tracker */}
      <Header
        currentScenarioId={scenario.id}
        onSelectScenario={handleSelectScenario}
        currentPhase={currentPhase}
        completedPhases={completedPhases}
        onReset={handleReset}
        onEndConsultation={() => setIsSummaryModalOpen(true)}
        onToggleLeftPanel={() => setIsLeftPanelOpen(!isLeftPanelOpen)}
        onToggleRightPanel={() => setIsRightPanelOpen(!isRightPanelOpen)}
        isLeftPanelOpen={isLeftPanelOpen}
        isRightPanelOpen={isRightPanelOpen}
        hasStarted={messages.length > 0}
      />

      {/* Main Simulation Viewport (3 Panels) */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* 2. Patient Chart & Labs Panel (Left Sidebar) */}
        <PatientChartPanel
          scenario={scenario}
          isOpen={isLeftPanelOpen}
          onClose={() => setIsLeftPanelOpen(false)}
        />

        {/* 3. Consultation Room (Center Panel) */}
        <ConsultationRoom
          scenario={scenario}
          messages={messages}
          isLoadingPatient={isLoadingPatient}
          isLoadingEvaluation={isLoadingEvaluation}
          onSendMessage={handleSendMessage}
          onSelectEvaluationMessage={(msg) => setSelectedMessageId(msg.id)}
          selectedMessageId={selectedMessageId}
        />

        {/* 4. Live Evaluator Drawer / Scorecard (Right Sidebar) */}
        <EvaluatorDrawer
          evaluation={activeEvaluation}
          runningAverage={runningAverage}
          totalEvaluatedTurns={evaluationsList.length}
          evaluationsHistory={evaluationsList}
          isOpen={isRightPanelOpen}
          onClose={() => setIsRightPanelOpen(false)}
          onSelectHistoricalTurn={(id) => setSelectedMessageId(id)}
          selectedMessageId={selectedMessageId}
        />
      </div>

      {/* 5. End of Consultation Summary Modal */}
      <ConsultationSummaryModal
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        summary={summaryData}
        scenario={scenario}
        messages={messages}
        onRestart={handleReset}
      />
    </div>
  );
}
