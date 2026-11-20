import { AlertTriangle, Check, Lightbulb } from "lucide-react";

const cautionTone = {
  warning: "border-amber-300/25 bg-amber-300/[0.06] text-amber-200",
  medical: "border-rose-400/25 bg-rose-400/[0.06] text-rose-200",
};

function NumberedSteps({ steps }) {
  return (
    <ol className="mt-3 space-y-4">
      {steps.map((step, index) => (
        <li key={step.title} className="flex gap-3">
          <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-cyan-400/15 text-[11.5px] font-semibold text-cyan-300 ring-1 ring-cyan-400/30">
            {index + 1}
          </span>
          <div className="min-w-0">
            <p className="font-heading text-[13.5px] font-semibold leading-snug text-white">
              {step.title}
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-white/65">{step.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** The body of a written guide: overview, prerequisites, steps, cautions and fixes. */
export default function ArticleBody({ article }) {
  return (
    <div className="space-y-4">
      {article.overview?.length > 0 && (
        <section className="rounded-[26px] border border-white/10 bg-white/[0.035] p-4 lg:p-5">
          <p className="text-[12px] uppercase tracking-[0.2em] text-white/50">Overview</p>
          <div className="mt-2 space-y-2">
            {article.overview.map((paragraph) => (
              <p key={paragraph} className="text-[13px] leading-relaxed text-white/70">
                {paragraph}
              </p>
            ))}
          </div>
          {article.capabilities?.length > 0 && (
            <ul className="mt-3 space-y-1.5">
              {article.capabilities.map((item) => (
                <li key={item} className="flex gap-2 text-[12.5px] leading-relaxed text-white/65">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-300" /> {item}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {article.before?.length > 0 && (
        <section className="rounded-[26px] border border-white/10 bg-white/[0.035] p-4 lg:p-5">
          <p className="text-[12px] uppercase tracking-[0.2em] text-white/50">Before you start</p>
          <ul className="mt-2.5 space-y-1.5">
            {article.before.map((item) => (
              <li key={item} className="flex gap-2 text-[13px] leading-relaxed text-white/65">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan-300/70" /> {item}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-[26px] border border-white/10 bg-white/[0.035] p-4 lg:p-5">
        <p className="text-[12px] uppercase tracking-[0.2em] text-white/50">Step by step</p>
        <NumberedSteps steps={article.steps} />
      </section>

      {article.more?.steps?.length > 0 && (
        <section className="rounded-[26px] border border-white/10 bg-white/[0.035] p-4 lg:p-5">
          <p className="text-[12px] uppercase tracking-[0.2em] text-white/50">
            {article.more.title}
          </p>
          <NumberedSteps steps={article.more.steps} />
        </section>
      )}

      {article.caution && (
        <section
          className={`rounded-[26px] border p-4 lg:p-5 ${cautionTone[article.caution.level] ?? cautionTone.warning}`}
        >
          <p className="flex items-center gap-1.5 font-heading text-[12.5px] font-semibold">
            <AlertTriangle className="h-3.5 w-3.5" /> {article.caution.title}
          </p>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/75">{article.caution.body}</p>
        </section>
      )}

      {article.tips?.length > 0 && (
        <section className="rounded-[26px] border border-white/10 bg-white/[0.035] p-4 lg:p-5">
          <p className="text-[12px] uppercase tracking-[0.2em] text-white/50">Good to know</p>
          <ul className="mt-2.5 space-y-2">
            {article.tips.map((tip) => (
              <li key={tip} className="flex gap-2 text-[13px] leading-relaxed text-white/65">
                <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-300" /> {tip}
              </li>
            ))}
          </ul>
        </section>
      )}

      {article.issues?.length > 0 && (
        <section className="rounded-[26px] border border-white/10 bg-white/[0.035] p-4 lg:p-5">
          <p className="text-[12px] uppercase tracking-[0.2em] text-white/50">
            If something goes wrong
          </p>
          <div className="mt-2.5 space-y-3">
            {article.issues.map((issue) => (
              <div key={issue.problem}>
                <p className="font-heading text-[13px] font-semibold text-white">{issue.problem}</p>
                <p className="mt-0.5 text-[13px] leading-relaxed text-white/65">{issue.fix}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}