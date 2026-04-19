import { createActor } from "@/backend";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@caffeineai/core-infrastructure";
import { Bot, Brain, Send, Trash2, User, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

type APIMessage = { role: string; content: string };

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi! I'm **CORE AI** — your personal fitness and nutrition guide. Ask me about nutrition, diet plans, or exercise recommendations tailored to your goals.",
};

const SUGGESTED_PROMPTS = [
  "Best exercises for weight loss",
  "High protein meal plan",
  "Beginner workout routine",
  "Recovery nutrition tips",
];

const MAX_HISTORY = 10;

interface CoreAIChatProps {
  isOpen: boolean;
  onClose: () => void;
}

// ----- Markdown rendering -----
function BoldSegment({ text }: { text: string }) {
  if (text.startsWith("**") && text.endsWith("**")) {
    return <strong>{text.slice(2, -2)}</strong>;
  }
  return <span>{text}</span>;
}

function MarkdownLine({ text }: { text: string }) {
  const trimmed = text.trim();
  const isBullet = trimmed.startsWith("- ") || trimmed.startsWith("• ");
  const content = isBullet ? trimmed.slice(2) : trimmed;
  const segments = content.split(/(\*\*[^*]+\*\*)/g);
  const rendered = segments.map((seg) => <BoldSegment key={seg} text={seg} />);
  if (isBullet) return <li className="ml-4 list-disc">{rendered}</li>;
  if (!trimmed) return <br />;
  return <span className="block">{rendered}</span>;
}

function MarkdownContent({ text }: { text: string }) {
  return (
    <div className="space-y-0.5">
      {text.split("\n").map((line) => (
        <MarkdownLine key={`${line.slice(0, 20)}-${line.length}`} text={line} />
      ))}
    </div>
  );
}

// ----- Message bubble -----
function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div
      className={`flex items-start gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
          isUser ? "bg-secondary/20" : "bg-primary/15"
        }`}
      >
        {isUser ? (
          <User className="w-3.5 h-3.5 text-secondary-foreground" />
        ) : (
          <Bot className="w-3.5 h-3.5 text-primary" />
        )}
      </div>
      <div
        className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "bg-primary text-primary-foreground rounded-tr-sm"
            : "bg-muted text-foreground rounded-tl-sm"
        }`}
      >
        {isUser ? (
          <span>{message.content}</span>
        ) : (
          <MarkdownContent text={message.content} />
        )}
      </div>
    </div>
  );
}

// ----- Typing dots -----
function TypingDots() {
  return (
    <div className="flex items-center gap-1 h-4">
      <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce [animation-delay:0s]" />
      <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce [animation-delay:0.15s]" />
      <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce [animation-delay:0.3s]" />
    </div>
  );
}

// ----- Main chat panel -----
export function CoreAIChat({ isOpen, onClose }: CoreAIChatProps) {
  const { actor, isFetching } = useActor(createActor);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // Ref to capture latest messages for API call without adding to useCallback deps
  const messagesRef = useRef<ChatMessage[]>(messages);
  messagesRef.current = messages;

  const scrollToBottom = useCallback(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading || !actor || isFetching) return;

    const id = `user-${Date.now()}`;
    const userMsg: ChatMessage = { id, role: "user", content: trimmed };
    const updated = [...messagesRef.current, userMsg].slice(-MAX_HISTORY);

    setMessages(updated);
    setInput("");
    setIsLoading(true);
    scrollToBottom();

    const history: APIMessage[] = updated.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const response = await actor.queryAI(history);
      setMessages((prev) => [
        ...prev,
        { id: `ai-${Date.now()}`, role: "assistant", content: response },
      ]);
      scrollToBottom();
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: "Sorry, I couldn't process your request. Please try again.",
        },
      ]);
      scrollToBottom();
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, actor, isFetching, scrollToBottom]);

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
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop — mobile only */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: aria-hidden backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-foreground/20 backdrop-blur-sm md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Chat panel */}
      <dialog
        open
        aria-label="CORE AI Chat"
        data-ocid="core_ai.dialog"
        className={[
          "fixed z-[70] flex flex-col m-0 p-0",
          "bg-card/95 backdrop-blur-md border border-border shadow-2xl",
          "inset-0 md:inset-auto",
          "md:top-[64px] md:right-0 md:bottom-0 md:w-[380px]",
          "md:border-l md:border-t-0 md:rounded-none",
        ].join(" ")}
      >
        {/* Panel header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-subtle">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="font-display font-bold text-foreground leading-none">
                CORE AI
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Your fitness &amp; nutrition guide
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
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Close chat"
              data-ocid="core_ai.close_button"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Messages list */}
        <ScrollArea className="flex-1 px-4 py-3">
          <div className="space-y-4">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}

            {/* Suggested prompts — only on welcome state */}
            {messages.length === 1 && (
              <div className="space-y-2" data-ocid="core_ai.suggestions">
                <p className="text-xs text-muted-foreground font-medium px-1">
                  Suggested questions
                </p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => handlePrompt(prompt)}
                      data-ocid="core_ai.suggestion_chip"
                      className="text-xs px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary hover:bg-primary/15 transition-smooth font-medium"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Typing indicator */}
            {isLoading && (
              <div
                className="flex items-start gap-2"
                data-ocid="core_ai.loading_state"
              >
                <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                  <TypingDots />
                </div>
              </div>
            )}
            <div ref={scrollEndRef} />
          </div>
        </ScrollArea>

        {/* Input area */}
        <div className="p-3 border-t border-border bg-card/80">
          <div className="flex gap-2 items-end">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about nutrition, diet, or exercise…"
              rows={1}
              data-ocid="core_ai.input"
              disabled={isLoading || !actor || isFetching}
              className="resize-none min-h-[40px] max-h-[120px] flex-1 text-sm bg-background border-input focus-visible:ring-primary/50"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading || !actor || isFetching}
              aria-label="Send message"
              data-ocid="core_ai.send_button"
              size="icon"
              className="h-10 w-10 bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-[11px] text-muted-foreground mt-2 text-center">
            Enter to send · Shift+Enter for newline
          </p>
        </div>
      </dialog>
    </>
  );
}
