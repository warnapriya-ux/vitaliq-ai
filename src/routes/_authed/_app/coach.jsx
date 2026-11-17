import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Bot, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import PageTitle from "@/components/vitaliq/PageTitle";
import { useVitaliq } from "@/hooks/useVitaliq";
import { askCoach as askCoachFn } from "@/lib/server-fns";
import { profileSummary, recentSummary } from "@/lib/health";

export const Route = createFileRoute("/_authed/_app/coach")({
  head: () => ({ meta: [{ title: "VITALIQ Coach — AI personal trainer" }] }),
  component: CoachPage,
});

const PROMPTS = [
  "What should I eat after today's workout?",
  "How do I stay consistent on busy days?",
  "Is my progress on track for my target?",
];

function CoachPage() {
  const { profile, measurements, logs, user } = useVitaliq();
  const askCoach = useServerFn(askCoachFn);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    base44.entities.CoachMessage.list({ sort: "created_date", limit: 40 })
      .then((page) => setMessages(page.items ?? []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length, sending]);

  async function send(text) {
    const question = (text ?? input).trim();
    if (!question || sending) return;
    setInput("");
    setSending(true);
    try {
      const saved = await base44.entities.CoachMessage.create({ role: "user", content: question, module: "coach" });
      setMessages((m) => [...m, saved]);
      const res = await askCoach({
        data: {
          question,
          profileSummary: profileSummary(profile, measurements[measurements.length - 1]),
          recentSummary: recentSummary(logs),
        },
      });
      const reply = await base44.entities.CoachMessage.create({ role: "assistant", content: res.reply, module: "coach" });
      setMessages((m) => [...m, reply]);
    } catch (error) {
      console.error(error);
      toast.error("VITALIQ Coach could not reply just now. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-4">
      <PageTitle eyebrow="Vitaliq Coach" title="Your AI personal trainer" />

      <div className="rounded-[26px] border border-white/10 bg-gradient-to-br from-cyan-500/20 via-orange-500/10 to-transparent p-4">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/60">
          <Sparkles className="h-3.5 w-3.5" /> Guidance, not diagnosis
        </div>
        <p className="mt-1.5 text-xs leading-relaxed text-white/55">
          Your coach reads your profile, measurements and recent activity. For medical concerns it will always send you to a professional.
        </p>
      </div>

      <div className="space-y-3">
        {messages.length === 0 && (
          <div className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 to-orange-500 text-white">
              <Bot className="h-4 w-4" />
            </span>
            <div className="rounded-2xl rounded-tl-sm border border-white/10 bg-white/[0.05] px-4 py-3 text-sm leading-relaxed text-white/75">
              Hi {profile?.display_name || "there"} — I'm VITALIQ Coach. Ask me about training, recovery or how to hit your target weight.
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className={`flex items-start gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}>
            <span
              className={`grid h-9 w-9 shrink-0 place-items-center rounded-2xl text-white ${
                message.role === "user" ? "bg-white/10 text-xs font-semibold" : "bg-gradient-to-br from-cyan-400 to-orange-500"
              }`}
            >
              {message.role === "user" ? (user?.full_name || "Y").charAt(0) : <Bot className="h-4 w-4" />}
            </span>
            <div
              className={`max-w-[82%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                message.role === "user"
                  ? "rounded-tr-sm bg-cyan-400/15 text-cyan-50 ring-1 ring-cyan-300/20"
                  : "rounded-tl-sm border border-white/10 bg-white/[0.05] text-white/75"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}

        {sending && (
          <div className="flex items-center gap-3 pl-1 text-xs text-white/40">
            <Bot className="h-4 w-4 animate-pulse text-orange-300" /> Coach is thinking…
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="flex flex-wrap gap-2">
        {PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => send(prompt)}
            disabled={sending}
            className="rounded-full border border-white/10 px-3 py-1.5 text-[11px] text-white/55 transition hover:border-cyan-300/40 hover:text-white disabled:opacity-40"
          >
            {prompt}
          </button>
        ))}
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          send();
        }}
        className="sticky bottom-24 flex items-center gap-2 rounded-full border border-white/10 bg-[#0a1020]/90 p-1.5 backdrop-blur-xl lg:bottom-4"
      >
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask your coach anything…"
          className="flex-1 bg-transparent px-3 text-sm text-white placeholder:text-white/30 focus:outline-none"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-cyan-300 to-cyan-500 text-slate-950 transition disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}