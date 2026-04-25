import { createActor } from "@/backend";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSubscription } from "@/hooks/useSubscription";
import { useActor } from "@caffeineai/core-infrastructure";
import {
  Bot,
  Brain,
  Calendar,
  ChevronRight,
  Crown,
  Lock,
  Send,
  Sparkles,
  Trash2,
  UtensilsCrossed,
  X,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

type APIMessage = { role: string; content: string };

export const FREE_MESSAGE_LIMIT = 5;
const MAX_HISTORY = 10;

export const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi! I'm **CORE AI** — your science-based fitness and nutrition coach.\n\nI specialise in:\n- **Exercise form & technique** — proper mechanics to maximise results and prevent injury\n- **Nutrition & macros** — protein targets, calorie deficits, meal timing\n- **Workout programming** — hypertrophy, fat loss, strength, HIIT\n- **Recovery & sleep** — rest days, soreness, deload strategies\n- **TDEE & body composition** — calculating your maintenance and deficit targets\n\nAsk me anything — I give direct, science-backed answers.",
};

export const SUGGESTED_PROMPTS = [
  "What's the best macro split for fat loss?",
  "How much protein do I need to build muscle?",
  "Design a 4-day push/pull/legs routine for me",
  "How do I break a weight-loss plateau?",
  "What's the difference between HIIT and LISS cardio?",
  "How many calories should I eat in a deficit?",
];

interface CoreAIChatProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade?: () => void;
  /** When set, pre-fills the input field as soon as the chat opens */
  prefilledPrompt?: string | null;
  /** Called once the prefilled prompt has been consumed (set to input) */
  onPrefilledConsumed?: () => void;
}

// ----- Markdown rendering -----
function BoldSegment({ text }: { text: string }) {
  if (text.startsWith("**") && text.endsWith("**")) {
    return <strong className="font-semibold">{text.slice(2, -2)}</strong>;
  }
  return <span>{text}</span>;
}

function MarkdownLine({ text }: { text: string }) {
  const trimmed = text.trim();
  const isBullet = trimmed.startsWith("- ") || trimmed.startsWith("• ");
  const content = isBullet ? trimmed.slice(2) : trimmed;
  const segments = content.split(/(\*\*[^*]+\*\*)/g);
  const rendered = segments.map((seg, i) => (
    <BoldSegment key={`${i}-${seg.slice(0, 10)}`} text={seg} />
  ));
  if (isBullet)
    return (
      <li className="ml-5 list-disc leading-relaxed text-[0.85rem]">
        {rendered}
      </li>
    );
  if (!trimmed) return <div className="h-2" />;
  return (
    <span className="block leading-relaxed text-[0.85rem]">{rendered}</span>
  );
}

export function MarkdownContent({ text }: { text: string }) {
  return (
    <div className="space-y-0.5">
      {text.split("\n").map((line, i) => (
        <MarkdownLine key={`${i}-${line.slice(0, 20)}`} text={line} />
      ))}
    </div>
  );
}

// ----- Message bubble -----
export function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div
      className={`flex items-end gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mb-0.5 shadow-md">
          <Brain className="w-4 h-4 text-primary-foreground" />
        </div>
      )}

      {/* Bubble */}
      <div
        className={[
          "max-w-[80%] rounded-2xl px-4 py-3 shadow-sm",
          isUser
            ? "bg-primary text-primary-foreground rounded-br-sm"
            : "bg-card border border-border text-foreground rounded-bl-sm",
        ].join(" ")}
      >
        {isUser ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
        ) : (
          <MarkdownContent text={message.content} />
        )}
      </div>
    </div>
  );
}

// ----- Typing dots -----
export function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 px-1 py-1">
      <span className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce [animation-delay:0s]" />
      <span className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce [animation-delay:0.15s]" />
      <span className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce [animation-delay:0.3s]" />
    </div>
  );
}

// ----- Message limit banner -----
export function LimitBanner({ onUpgrade }: { onUpgrade?: () => void }) {
  return (
    <div
      className="mx-1 my-3 rounded-2xl border-2 border-amber-400/50 bg-amber-50 dark:bg-amber-950/40 p-4 flex flex-col gap-3"
      data-ocid="core_ai.limit_banner"
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
          <Crown className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-amber-900 dark:text-amber-200 leading-tight">
            Free message limit reached
          </p>
          <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
            5 of 5 free messages used this session
          </p>
        </div>
      </div>
      <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
        Upgrade to <strong className="font-semibold">CORE Premium</strong> for
        unlimited AI conversations, personalised workout plans, and expert
        nutrition guidance.
      </p>
      {onUpgrade && (
        <button
          type="button"
          onClick={onUpgrade}
          data-ocid="core_ai.limit_upgrade_button"
          className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-white text-sm font-bold transition-smooth shadow-md"
        >
          <Zap className="w-4 h-4" />
          Unlock Premium — Unlimited AI
        </button>
      )}
    </div>
  );
}

// ----- Premium quick action button -----
function PremiumActionButton({
  icon: Icon,
  label,
  isPremium,
  onClick,
  ocid,
}: {
  icon: React.ElementType;
  label: string;
  isPremium: boolean;
  onClick: () => void;
  ocid: string;
}) {
  return (
    <button
      type="button"
      onClick={isPremium ? onClick : undefined}
      disabled={!isPremium}
      data-ocid={ocid}
      className={[
        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-smooth",
        isPremium
          ? "border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 hover:border-primary/60"
          : "border-border bg-muted/50 text-muted-foreground cursor-not-allowed opacity-50",
      ].join(" ")}
      title={isPremium ? label : `${label} — Premium only`}
      aria-label={isPremium ? label : `${label} — requires Premium`}
    >
      {isPremium ? (
        <Icon className="w-3.5 h-3.5" />
      ) : (
        <Lock className="w-3 h-3" />
      )}
      {label}
    </button>
  );
}

// ----- Helper: extract text from any AI response shape -----
function extractResponseText(response: unknown): string {
  if (typeof response === "string") {
    return response.trim();
  }
  if (response !== null && typeof response === "object") {
    const r = response as Record<string, unknown>;
    if (r.__kind__ === "ok" && r.ok !== null && typeof r.ok === "object") {
      const ok = r.ok as Record<string, unknown>;
      if (typeof ok.response === "string") return ok.response.trim();
    }
    if (r.__kind__ === "err") {
      return "";
    }
    if (typeof r.response === "string") return r.response.trim();
    if (typeof r.text === "string") return r.text.trim();
    if (typeof r.message === "string") return r.message.trim();
    if (typeof r.content === "string") return r.content.trim();
  }
  return "";
}

// ----- Main chat panel -----
export function CoreAIChat({
  isOpen,
  onClose,
  onUpgrade,
  prefilledPrompt,
  onPrefilledConsumed,
}: CoreAIChatProps) {
  const { actor, isFetching } = useActor(createActor);
  const { isPremium, isFounder, loading: subLoading } = useSubscription();
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userMessageCount, setUserMessageCount] = useState(0);
  const scrollEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesRef = useRef<ChatMessage[]>(messages);
  messagesRef.current = messages;

  const hasUnlimitedAccess =
    subLoading || isPremium || isFounder === true || isFounder === null;
  const isAtLimit =
    !hasUnlimitedAccess && userMessageCount >= FREE_MESSAGE_LIMIT;
  const remaining = Math.max(0, FREE_MESSAGE_LIMIT - userMessageCount);

  const scrollToBottom = useCallback(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => textareaRef.current?.focus(), 150);
      if (prefilledPrompt) {
        setInput(prefilledPrompt);
        onPrefilledConsumed?.();
      }
    }
  }, [isOpen, prefilledPrompt, onPrefilledConsumed]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const callAI = useCallback(
    async (history: APIMessage[], messageCount: number): Promise<string> => {
      if (!actor) return "";

      const makeCall = () =>
        hasUnlimitedAccess
          ? actor.queryAI(history)
          : actor.queryAIGated(history, BigInt(messageCount));

      const raw = await makeCall();
      const text = extractResponseText(raw);

      if (text.length < 10) {
        const retryRaw = await makeCall();
        const retryText = extractResponseText(retryRaw);
        if (retryText.length >= 10) return retryText;
        return (
          text ||
          "I didn't receive a complete response. Please try rephrasing your question."
        );
      }

      return text;
    },
    [actor, hasUnlimitedAccess],
  );

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading || !actor || isFetching) return;
    if (isAtLimit) return;

    const id = `user-${Date.now()}`;
    const userMsg: ChatMessage = { id, role: "user", content: trimmed };
    const updated = [...messagesRef.current, userMsg].slice(-MAX_HISTORY);

    setMessages(updated);
    setInput("");
    setIsLoading(true);
    const newCount = userMessageCount + 1;
    setUserMessageCount(newCount);
    scrollToBottom();

    const history: APIMessage[] = updated.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const responseText = await callAI(history, newCount);
      const displayText =
        responseText.length > 0
          ? responseText
          : "I'm having trouble connecting right now. Please try again in a moment.";

      setMessages((prev) => [
        ...prev,
        { id: `ai-${Date.now()}`, role: "assistant", content: displayText },
      ]);
      scrollToBottom();
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content:
            "I couldn't reach the AI service right now. Please check your connection and try again.",
        },
      ]);
      scrollToBottom();
    } finally {
      setIsLoading(false);
    }
  }, [
    input,
    isLoading,
    actor,
    isFetching,
    isAtLimit,
    userMessageCount,
    scrollToBottom,
    callAI,
  ]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handlePrompt = (prompt: string) => {
    setInput(prompt);
    textareaRef.current?.focus();
  };

  const handleClear = () => {
    setMessages([WELCOME_MESSAGE]);
    setInput("");
    setUserMessageCount(0);
  };

  const handleWorkoutPlan = () => {
    handlePrompt(
      "Build me a personalised 4-week workout plan based on my goals and available equipment.",
    );
  };

  const handleNutritionPlan = () => {
    handlePrompt(
      "Create a custom nutrition and meal plan to support my fitness goals.",
    );
  };

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const ta = e.target;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop — mobile overlay */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: aria-hidden backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Chat panel */}
      <dialog
        open
        aria-label="CORE AI Chat"
        data-ocid="core_ai.dialog"
        className={[
          "fixed z-[70] flex flex-col m-0 p-0 overflow-hidden",
          // Mobile: full screen
          "inset-0",
          // Desktop: right sidebar
          "md:inset-auto md:top-[64px] md:right-0 md:bottom-0 md:w-[440px]",
          // Background — high contrast dark panel in dark mode
          "bg-white dark:bg-[#0f0f12]",
          "border-0 md:border-l md:border-border",
          "shadow-2xl",
        ].join(" ")}
      >
        {/* ── Header ────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-border bg-card flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md flex-shrink-0">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-display font-bold text-foreground text-base leading-none">
                  CORE AI
                </p>
                {(isPremium || isFounder === true) && (
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-400/50 text-amber-700 dark:text-amber-300 text-[10px] font-bold tracking-wide">
                    <Crown className="w-2.5 h-2.5" />
                    {isFounder === true ? "FOUNDER" : "PRO"}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {hasUnlimitedAccess
                  ? "Unlimited AI coaching"
                  : `${remaining} free message${remaining !== 1 ? "s" : ""} left`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClear}
              aria-label="Clear chat"
              data-ocid="core_ai.clear_button"
              className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Close chat"
              data-ocid="core_ai.close_button"
              className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* ── Quick actions strip ───────────────────────────────── */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-muted/20 flex-shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
          <span className="text-xs text-muted-foreground font-medium mr-1">
            Quick actions:
          </span>
          <PremiumActionButton
            icon={Calendar}
            label="Workout Plan"
            isPremium={hasUnlimitedAccess}
            onClick={handleWorkoutPlan}
            ocid="core_ai.workout_plan_button"
          />
          <PremiumActionButton
            icon={UtensilsCrossed}
            label="Nutrition Plan"
            isPremium={hasUnlimitedAccess}
            onClick={handleNutritionPlan}
            ocid="core_ai.nutrition_plan_button"
          />
        </div>

        {/* ── Free message counter (visible to free users) ─────── */}
        {!hasUnlimitedAccess && userMessageCount > 0 && !isAtLimit && (
          <div
            className={[
              "px-4 py-2 flex items-center justify-between text-xs border-b border-border flex-shrink-0",
              remaining <= 1
                ? "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400"
                : "bg-muted/30 text-muted-foreground",
            ].join(" ")}
            data-ocid="core_ai.message_counter"
          >
            <div className="flex items-center gap-1.5">
              <div
                className={`w-1.5 h-1.5 rounded-full ${remaining <= 1 ? "bg-amber-500" : "bg-primary"}`}
              />
              <span className="font-medium">
                {remaining} of {FREE_MESSAGE_LIMIT} free messages remaining
              </span>
            </div>
            <button
              type="button"
              onClick={onUpgrade}
              data-ocid="core_ai.counter_upgrade_link"
              className="flex items-center gap-0.5 font-bold text-primary hover:underline transition-smooth"
            >
              Upgrade
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* ── Messages list ─────────────────────────────────────── */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="px-4 py-4 space-y-5">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}

            {/* Limit banner — shown after limit is hit */}
            {isAtLimit && <LimitBanner onUpgrade={onUpgrade} />}

            {/* Suggested prompts — only on welcome state */}
            {messages.length === 1 && !isLoading && (
              <div className="space-y-2.5 pt-1" data-ocid="core_ai.suggestions">
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide px-1">
                  Try asking…
                </p>
                <div className="flex flex-col gap-2">
                  {SUGGESTED_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => handlePrompt(prompt)}
                      data-ocid="core_ai.suggestion_chip"
                      className="flex items-center justify-between gap-2 w-full text-left text-xs px-3.5 py-2.5 rounded-xl border border-border bg-card hover:bg-primary/5 hover:border-primary/40 text-foreground hover:text-primary transition-smooth font-medium group"
                    >
                      <span>{prompt}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary flex-shrink-0 transition-smooth" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Typing indicator */}
            {isLoading && (
              <div
                className="flex items-end gap-2.5"
                data-ocid="core_ai.loading_state"
              >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mb-0.5 shadow-md">
                  <Brain className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                  <TypingDots />
                  <p className="text-xs text-muted-foreground mt-1">
                    CORE AI is thinking…
                  </p>
                </div>
              </div>
            )}

            <div ref={scrollEndRef} />
          </div>
        </ScrollArea>

        {/* ── Input area ────────────────────────────────────────── */}
        <div className="flex-shrink-0 border-t border-border bg-card p-3">
          {isAtLimit ? (
            /* Limit reached — show upgrade CTA instead of input */
            <div
              className="flex flex-col items-center gap-3 py-2"
              data-ocid="core_ai.limit_input_state"
            >
              <p className="text-sm text-muted-foreground text-center font-medium">
                You've used all 5 free messages.
              </p>
              <button
                type="button"
                onClick={onUpgrade}
                data-ocid="core_ai.input_upgrade_button"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-white text-sm font-bold transition-smooth shadow-md"
              >
                <Crown className="w-4 h-4" />
                Upgrade to Premium — Unlimited AI
              </button>
              <p className="text-xs text-muted-foreground">
                ₹1500 / 3 months · No ads · Full exercise library
              </p>
            </div>
          ) : (
            /* Normal input */
            <div className="flex flex-col gap-2">
              <div className="flex items-end gap-2">
                {/* ── THE INPUT FIELD — high contrast, always visible ── */}
                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about nutrition, workouts, or exercise form…"
                    rows={1}
                    data-ocid="core_ai.input"
                    disabled={isLoading || !actor || isFetching || isAtLimit}
                    className={[
                      // Layout
                      "w-full resize-none min-h-[48px] max-h-[120px] px-4 py-3",
                      // Shape
                      "rounded-xl",
                      // Typography
                      "text-sm font-medium leading-relaxed",
                      // ── Light mode: dark text on light bg ──
                      "bg-gray-100 text-gray-900 placeholder:text-gray-500",
                      // ── Dark mode: light text on dark bg ──
                      "dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-400",
                      // Border
                      "border border-gray-300 dark:border-zinc-600",
                      // Focus ring — very visible
                      "outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary",
                      "dark:focus:ring-primary/70 dark:focus:border-primary",
                      // Disabled
                      "disabled:opacity-50 disabled:cursor-not-allowed",
                      // Transition
                      "transition-all duration-200",
                    ].join(" ")}
                    style={{ overflowY: "auto" }}
                  />
                </div>

                {/* Send button */}
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={
                    !input.trim() ||
                    isLoading ||
                    !actor ||
                    isFetching ||
                    isAtLimit
                  }
                  aria-label="Send message"
                  data-ocid="core_ai.send_button"
                  className={[
                    "flex-shrink-0 h-12 w-12 rounded-xl flex items-center justify-center",
                    "bg-primary text-primary-foreground",
                    "hover:bg-primary/90 active:scale-95",
                    "disabled:opacity-40 disabled:cursor-not-allowed",
                    "transition-all duration-200 shadow-md",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  ].join(" ")}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>

              {/* Hint text */}
              <p className="text-[11px] text-muted-foreground text-center select-none">
                Press{" "}
                <kbd className="px-1 py-0.5 rounded bg-muted border border-border text-[10px] font-mono">
                  Enter
                </kbd>{" "}
                to send ·{" "}
                <kbd className="px-1 py-0.5 rounded bg-muted border border-border text-[10px] font-mono">
                  Shift + Enter
                </kbd>{" "}
                for new line
              </p>
            </div>
          )}
        </div>
      </dialog>
    </>
  );
}
