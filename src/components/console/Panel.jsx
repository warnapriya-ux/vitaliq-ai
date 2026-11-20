export default function Panel({ title, subtitle, action, className = "", children }) {
  return (
    <section className={`rounded-2xl border border-white/10 bg-white/[0.03] p-5 ${className}`}>
      {(title || action) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title && <h2 className="font-heading text-sm font-semibold text-white">{title}</h2>}
            {subtitle && <p className="mt-0.5 text-[12px] text-white/60">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}