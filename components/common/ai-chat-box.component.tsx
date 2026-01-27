import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// types
import type { FC } from "react";

// icons
import { Send, User, Sparkles, X } from "lucide-react";

// helpers
import clsx from "clsx";

interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
  time: string;
}

const AiChatBox: FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hi! I’m your Barsati AI. Ask me about deals, products, or anything you need.",
      time: getTime(),
    },

    {
      id: "2",
      role: "user",
      content:
        "Hi! I’m your Barsati AI. Ask me about deals, products, or anything you need.",
      time: getTime(),
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  function getTime() {
    return new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: "user",
        content: input,
        time: getTime(),
      },
    ]);

    setInput("");
    setTyping(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "We currently have premium discounts on Samsung, Apple, and OnePlus devices. Want me to narrow it down?",
          time: getTime(),
        },
      ]);
      setTyping(false);
    }, 1300);
  };

  return (
    <div className="relative flex h-full w-full max-w-sm flex-col overflow-hidden rounded-3xl border border-orange-200 bg-white shadow-xl">
      {/* Header */}
      <div className="relative px-5 py-4">
        <div className="relative flex items-center justify-between">
          {/* Left section */}
          <div className="flex items-center gap-3">
            {/* Avatar with glow */}
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-orange-400/40 blur-md" />
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-400 shadow-md">
                <Image
                  src="/header/barsati.png"
                  alt="Barsati AI"
                  width={18}
                  height={18}
                />
              </div>

              {/* Live status dot */}
              <span className="absolute -right-0.5 -bottom-0.5 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
              </span>
            </div>

            {/* Title + status */}
            <div className="leading-tight">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-gray-900">Barsati AI</p>
                <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-medium text-orange-600">
                  AI Assistant
                </span>
              </div>

              <p className="mt-0.5 text-xs text-gray-500">
                Online • Ready to help
              </p>
            </div>
          </div>

          {/* Close button */}
          <button className="rounded-full p-2 text-gray-400 transition hover:bg-orange-50 hover:text-gray-600">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Gradient divider */}
        <div className="mt-4 h-px bg-linear-to-r from-transparent via-orange-200 to-transparent" />
      </div>

      {/* Chat */}
      <div className="flex-1 space-y-6 overflow-y-auto bg-gradient-to-b from-orange-50/40 to-white px-5 py-6">
        {messages.map(({ id, role, content }) => (
          <div
            key={id}
            className={clsx(
              "flex items-end gap-3",
              role === "user" && "justify-end"
            )}
          >
            {role === "assistant" && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 shadow-sm">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
            )}

            <div
              className={clsx(
                "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                role === "assistant"
                  ? "bg-orange-50 text-gray-900 shadow-sm"
                  : "bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-md"
              )}
            >
              {content}
            </div>

            {role === "user" && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 shadow-sm">
                <User className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
        ))}

        {typing && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Sparkles className="h-4 w-4 animate-pulse text-orange-500" />
            Barsati AI is thinking…
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-black/5 px-4 py-4">
        <div className="flex items-center gap-3 rounded-full bg-white px-4 py-2 shadow-inner ring-1 ring-black/5 focus-within:ring-orange-400">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask Barsati AI anything…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-md transition disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiChatBox;
