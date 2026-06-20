import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, CartItem } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send, Sparkles, Coffee, AlertCircle, RefreshCw, ChefHat, User, SendHorizontal } from "lucide-react";

interface ChatBotProps {
  cartItems: CartItem[];
  selectedTableId: number | null;
  onNavigateToTab: (tab: "home" | "menu" | "book" | "reviews") => void;
  onSelectTable: (id: number) => void;
}

const CHAT_SUGGESTIONS = [
  "What is your special dish?",
  "Is there a table available for 4?",
  "Where is the cafe located in Gadarwara?",
  "What are sweet options on your menu?"
];

export default function ChatBot({
  cartItems,
  selectedTableId,
  onNavigateToTab,
  onSelectTable
}: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I am **Tip Top AI**, your premium Gadarwara cafe concierge. 🌸 I can assist you with our hand-crafted menu recommendations, table reservations, directions, or customizing dishes! Ask me anything.",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [errorState, setErrorState] = useState<string | null>(null);

  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chats
  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isTyping) return;

    setErrorState(null);
    const userMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      role: "user",
      content: textToSend,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsTyping(true);

    try {
      // Map chat messages format for backend
      const payloadMessages = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: payloadMessages,
          currentCart: cartItems,
          selectedTableId: selectedTableId
        })
      });

      const data = await res.json();

      if (res.ok && data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: `r-${Date.now()}`,
            role: "assistant",
            content: data.reply,
            timestamp: new Date()
          }
        ]);
      } else {
        throw new Error(data.error || "Failed to receive a valid response from the concierge.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorState(err.message || "An error occurred during communication.");
    } finally {
      setIsTyping(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputMessage);
  };

  // Helper to render markdown bolding and lists beautifully
  const renderMessageContent = (content: string) => {
    // Basic bold and list parser
    const lines = content.split("\n");
    return lines.map((line, idx) => {
      let trimmed = line.trim();
      let isBullet = trimmed.startsWith("•") || trimmed.startsWith("-") || trimmed.startsWith("* ");
      
      let cleanText = line;
      if (isBullet) {
        cleanText = trimmed.replace(/^[•\-\*]\s*/, "");
      }

      // Parse bold tags **text** -> strong
      const parts = cleanText.split(/\*\*([^*]+)\*\*/g);
      const parsedElements = parts.map((part, pIdx) => {
        if (pIdx % 2 === 1) {
          return <strong key={pIdx} className="font-extrabold text-amber-300">{part}</strong>;
        }
        return part;
      });

      if (isBullet) {
        return (
          <li key={idx} className="list-disc ml-4 text-xs text-slate-200 mt-1 leading-relaxed">
            {parsedElements}
          </li>
        );
      }

      return (
        <p key={idx} className="text-xs text-slate-200 leading-relaxed mb-2 last:mb-0">
          {parsedElements}
        </p>
      );
    });
  };

  // Reset chat thread
  const handleClearHistory = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "Hello! Thread cleared. Let's start fresh. How can I guide your dining experience at Tip Top Cafe today?",
        timestamp: new Date()
      }
    ]);
  };

  return (
    <>
      {/* CORNER FLOATING AI CHAT TRIGGER BUTTON */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 p-4 bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-500 text-zinc-950 rounded-full shadow-[0_8px_30px_rgb(245,158,11,0.3)] hover:shadow-[0_8px_30px_rgb(245,158,11,0.5)] z-40 transition-all duration-300 pointer-events-auto border-2 border-yellow-300/40 hover:scale-[1.08] active:scale-95 cursor-pointer flex items-center justify-center"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
        title="Chat with Tip Top AI Team"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div 
              key="close" 
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div 
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              className="relative"
            >
              <MessageSquare className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-amber-400 animate-ping" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* CHAT WIDGET WINDOW */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed bottom-24 right-6 w-full max-w-sm h-[500px] md:h-[550px] bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl z-45 overflow-hidden flex flex-col justify-between text-white"
          >
            {/* Widget Header */}
            <div className="p-4 bg-slate-900 border-b border-slate-800/85 flex justify-between items-center relative">
              <div className="absolute top-0 right-0 -mr-12 -mt-12 w-24 h-24 bg-gradient-to-tr from-amber-500/10 to-transparent rounded-full blur-xl pointer-events-none" />

              <div className="flex items-center gap-2.5 relative z-10">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center border border-amber-400/30">
                  <ChefHat className="w-5 h-5 text-zinc-950" />
                </div>
                <div>
                  <h4 className="font-bold text-sm flex items-center gap-1.5">
                    Tip Top AI Concierge
                    <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                  </h4>
                  <span className="text-[10px] uppercase font-mono text-emerald-400 font-bold block flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping" />
                    Interactive Support Connected
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleClearHistory}
                  className="p-1 px-1.5 hover:bg-slate-800/80 rounded font-mono text-[9px] text-slate-400 hover:text-white transition"
                  title="Reset Conversation thread"
                >
                  <RefreshCw className="w-3.5 h-3.5 inline mr-0.5" /> Reset
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-850 rounded-lg transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chats Body Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900/60 scrollbar-thin scrollbar-thumb-slate-800">
              
              {messages.map((m) => {
                const isAssistant = m.role === "assistant";
                return (
                  <div
                    key={m.id}
                    className={`flex items-start gap-2.5 ${isAssistant ? "justify-start" : "justify-end"}`}
                  >
                    {isAssistant && (
                      <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-slate-800 flex items-center justify-center shrink-0 mt-0.5 text-amber-400">
                        <ChefHat className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-[80%] p-3.5 rounded-2xl ${
                        isAssistant
                          ? "bg-slate-900/90 border border-slate-800 rounded-tl-none shadow-md"
                          : "bg-amber-400 text-zinc-950 rounded-tr-none shadow-md font-medium"
                      }`}
                    >
                      {isAssistant ? (
                        <div className="space-y-1">{renderMessageContent(m.content)}</div>
                      ) : (
                        <p className="text-xs font-semibold leading-relaxed break-words">{m.content}</p>
                      )}
                      
                      <span
                        className={`text-[9px] block text-right mt-1.5 opacity-60 font-mono ${
                          isAssistant ? "text-slate-500" : "text-zinc-800"
                        }`}
                      >
                        {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {!isAssistant && (
                      <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center shrink-0 mt-0.5 border border-amber-300 text-zinc-950 font-bold text-xs font-mono">
                        U
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Loader Thinking animation */}
              {isTyping && (
                <div className="flex items-start gap-2.5 justify-start">
                  <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-slate-800 flex items-center justify-center shrink-0 text-amber-400">
                    <ChefHat className="w-4 h-4" />
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl rounded-tl-none flex items-center space-x-1 shadow-sm">
                    <span className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-bounce delay-100" />
                    <span className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-bounce delay-200" />
                    <span className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-bounce delay-300" />
                  </div>
                </div>
              )}

              {/* Embedded Errors banner inside thread */}
              {errorState && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <div>
                    <span className="font-bold">Concierge Error</span>
                    <p className="text-[10px] opacity-80 mt-0.5">{errorState}</p>
                  </div>
                </div>
              )}

              <div ref={endOfMessagesRef} />
            </div>

            {/* Quick Suggestions Bubbles */}
            {messages.length < 5 && (
              <div className="px-4 py-2 border-t border-slate-900/40 bg-slate-950 overflow-x-auto flex space-x-2 scrollbar-none pb-2">
                {CHAT_SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSendMessage(s)}
                    disabled={isTyping}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-850 hover:border-slate-700 active:scale-95 rounded-xl text-[10px] text-slate-300 whitespace-nowrap tracking-wide border border-slate-800 transition cursor-pointer disabled:opacity-50"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input Form Footer */}
            <form
              onSubmit={handleFormSubmit}
              className="p-4 border-t border-slate-900 bg-slate-900/50 flex gap-2"
            >
              <input
                type="text"
                placeholder="Type your question..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={isTyping}
                className="flex-1 bg-slate-950 border border-emerald-900/10 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 placeholder-slate-500 text-white pl-4 pr-3 py-2.5 rounded-xl text-xs outline-none transition disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                className={`p-2.5 px-3 bg-gradient-to-tr from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-zinc-950 rounded-xl flex items-center justify-center transition-all ${
                  inputMessage.trim() && !isTyping
                    ? "opacity-100 scale-100 hover:scale-[1.04] cursor-pointer"
                    : "opacity-40 scale-95 cursor-not-allowed"
                }`}
              >
                <SendHorizontal className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
