import React, { useState, useRef, useEffect } from "react";
import { Message, EvaluationResult } from "@/types";
import { PatientScenario } from "@/data/scenarios";
import {
  Send,
  Mic,
  MicOff,
  User,
  Sparkles,
  Bot,
  Clock,
  Award,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";

interface ConsultationRoomProps {
  scenario: PatientScenario;
  messages: Message[];
  isLoadingPatient: boolean;
  isLoadingEvaluation: boolean;
  onSendMessage: (text: string) => void;
  onSelectEvaluationMessage?: (message: Message) => void;
  selectedMessageId?: string | null;
}

// Support browser SpeechRecognition types
interface IWindow extends Window {
  webkitSpeechRecognition?: any;
  SpeechRecognition?: any;
}

export const ConsultationRoom: React.FC<ConsultationRoomProps> = ({
  scenario,
  messages,
  isLoadingPatient,
  isLoadingEvaluation,
  onSendMessage,
  onSelectEvaluationMessage,
  selectedMessageId,
}) => {
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoadingPatient]);

  // Adjust textarea height dynamically
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        180
      )}px`;
    }
  }, [inputText]);

  // Handle Speech Recognition setup
  useEffect(() => {
    const win = typeof window !== "undefined" ? (window as unknown as IWindow) : null;
    const SpeechRecognitionClass =
      win?.SpeechRecognition || win?.webkitSpeechRecognition;

    if (SpeechRecognitionClass) {
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: any) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + " ";
          }
        }
        if (finalTranscript) {
          setInputText((prev) => (prev ? `${prev.trim()} ${finalTranscript.trim()}` : finalTranscript.trim()));
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        if (event.error !== "no-speech") {
          setSpeechError(`Microphone error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    setSpeechError(null);
    if (!recognitionRef.current) {
      setSpeechError("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("Failed to start speech recognition:", err);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed || isLoadingPatient) return;
    onSendMessage(trimmed);
    setInputText("");
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const starterPrompts = [
    `"${scenario.name.split(" ")[0]}, thank you for meeting today. I reviewed your intake and labs—I'd love to hear in your own words what daily life has felt like lately."`,
    `"I saw that your previous doctor told you your labs were 'normal for your age'. Let's walk through why you're feeling that 2 PM crash and 3 AM waking, in plain English."`,
    `"Before we dive into the numbers, my goal today is to connect the dots on your symptoms and discuss a comprehensive plan so you finally get lasting relief."`,
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden">
      {/* Header Banner */}
      <div className="border-b border-slate-800/80 bg-slate-900/40 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5 text-sm sm:text-base text-slate-300">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-semibold text-slate-200">Consultation Room</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-300">Danielle (Practitioner) & {scenario.name}</span>
        </div>
        {isLoadingEvaluation && (
          <div className="flex items-center gap-2 text-xs sm:text-sm text-indigo-400 font-bold animate-pulse">
            <Sparkles className="h-4 w-4" />
            <span>AI Coach analyzing sales translation...</span>
          </div>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 max-w-xl mx-auto space-y-5">
            <div className="h-14 w-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center shadow-lg">
              <Bot className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-100">
                Ready to Consult with {scenario.name}
              </h3>
              <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
                Step into the practitioner seat. Begin by setting the agenda (Framing), validating her frustrations with conventional dismissals, and translating lab findings into plain English without medical jargon.
              </p>
            </div>

            <div className="w-full space-y-3 pt-2">
              <span className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 justify-center">
                <Lightbulb className="h-4 w-4 text-amber-400" />
                <span>Suggested Opening Scripts</span>
              </span>
              <div className="space-y-2 text-left">
                {starterPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInputText(prompt.replace(/"/g, ""))}
                    className="w-full text-sm sm:text-base text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-teal-500/50 rounded-xl p-3.5 transition-all text-left shadow-sm hover:shadow leading-relaxed"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isPractitioner = msg.role === "user";
            const isSelected = selectedMessageId === msg.id;

            return (
              <div
                key={msg.id}
                className={`flex gap-3.5 ${isPractitioner ? "justify-end" : "justify-start"}`}
              >
                {!isPractitioner && (
                  <div className="h-10 w-10 rounded-full bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center shrink-0 mt-1 shadow-md">
                    <User className="h-5 w-5" />
                  </div>
                )}

                <div
                  className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-5 sm:p-6 shadow-md transition-all ${
                    isPractitioner
                      ? `bg-gradient-to-br from-teal-950/90 to-slate-900 border ${
                          isSelected ? "border-teal-400 ring-2 ring-teal-500/30" : "border-teal-800/50"
                        } text-slate-100 rounded-tr-none`
                      : "bg-slate-900/95 border border-slate-800 text-slate-100 rounded-tl-none"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 mb-2.5 text-xs sm:text-sm">
                    <span className={`font-bold ${isPractitioner ? "text-teal-300" : "text-slate-300"}`}>
                      {isPractitioner ? "Danielle (Practitioner)" : scenario.name}
                    </span>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{msg.timestamp}</span>
                    </div>
                  </div>

                  <p className="text-base sm:text-lg leading-relaxed whitespace-pre-line text-slate-100 font-normal">
                    {msg.content}
                  </p>

                  {/* Practitioner Evaluation Pill if available */}
                  {isPractitioner && msg.evaluation && (
                    <div className="mt-3.5 pt-3 border-t border-teal-900/50 flex flex-wrap items-center justify-between gap-2.5">
                      <button
                        onClick={() => onSelectEvaluationMessage?.(msg)}
                        className="flex items-center gap-2 rounded-lg bg-teal-950/80 border border-teal-700/60 px-3 py-1 text-xs sm:text-sm font-bold text-teal-200 hover:bg-teal-900 transition-colors shadow-sm cursor-pointer"
                      >
                        <Award className="h-4 w-4 text-teal-400" />
                        <span>Score: {msg.evaluation.turnScore}/100</span>
                        <span className="font-extrabold text-white">({msg.evaluation.letterGrade})</span>
                      </button>

                      {msg.evaluation.salesTrapWarning && (
                        <span className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-amber-300 bg-amber-950/50 border border-amber-800/50 px-2.5 py-0.5 rounded-md">
                          <AlertTriangle className="h-4 w-4 text-amber-400" />
                          <span>Sales Trap Flag</span>
                        </span>
                      )}

                      <span className="text-xs sm:text-sm font-medium text-slate-400">
                        {msg.evaluation.currentConsultationPhase}
                      </span>
                    </div>
                  )}
                </div>

                {isPractitioner && (
                  <div className="h-10 w-10 rounded-full bg-teal-600/20 border border-teal-500/40 text-teal-300 flex items-center justify-center shrink-0 mt-1 shadow-md">
                    <span className="text-sm font-extrabold">D</span>
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Patient typing indicator */}
        {isLoadingPatient && (
          <div className="flex gap-3.5 justify-start items-center">
            <div className="h-10 w-10 rounded-full bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center shrink-0">
              <User className="h-5 w-5" />
            </div>
            <div className="rounded-2xl rounded-tl-none bg-slate-900/95 border border-slate-800 px-5 py-4 flex items-center gap-2 shadow-sm">
              <span className="text-sm sm:text-base font-medium text-slate-300 mr-1">{scenario.name} is responding</span>
              <span className="h-2 w-2 rounded-full bg-teal-400 animate-bounce"></span>
              <span className="h-2 w-2 rounded-full bg-teal-400 animate-bounce [animation-delay:0.2s]"></span>
              <span className="h-2 w-2 rounded-full bg-teal-400 animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Speech error toast */}
      {speechError && (
        <div className="px-5 py-2 bg-amber-950/80 border-t border-amber-900/60 text-xs sm:text-sm text-amber-200 flex items-center justify-between">
          <span>{speechError}</span>
          <button
            onClick={() => setSpeechError(null)}
            className="text-amber-300 hover:text-white ml-2 text-sm font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Input Bar */}
      <div className="p-4 sm:p-5 border-t border-slate-800/80 bg-slate-900/90">
        <div className="relative flex items-end gap-3 bg-slate-950/95 rounded-2xl border border-slate-800 p-2.5 shadow-inner focus-within:border-teal-500/60 focus-within:ring-2 focus-within:ring-teal-500/20 transition-all">
          <button
            type="button"
            onClick={toggleListening}
            title={isListening ? "Stop voice listening" : "Start voice dictation"}
            className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all shrink-0 cursor-pointer ${
              isListening
                ? "bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/40"
                : "bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800"
            }`}
          >
            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </button>

          <textarea
            ref={textareaRef}
            rows={1}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isListening
                ? "Listening... Speak clearly into your mic..."
                : "Type your clinical response... (Enter to send, Shift+Enter for new line)"
            }
            className="flex-1 max-h-44 bg-transparent text-base sm:text-lg text-slate-100 placeholder-slate-400 focus:outline-none resize-none py-2 px-2 leading-relaxed"
          />

          <button
            type="button"
            onClick={handleSend}
            disabled={!inputText.trim() || isLoadingPatient}
            className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all shrink-0 ${
              inputText.trim() && !isLoadingPatient
                ? "bg-gradient-to-r from-teal-500 to-emerald-600 text-white hover:from-teal-400 hover:to-emerald-500 shadow-md shadow-teal-900/40 cursor-pointer"
                : "bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed"
            }`}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
