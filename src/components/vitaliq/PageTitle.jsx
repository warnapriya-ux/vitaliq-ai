export default function PageTitle({ eyebrow, title, action }) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div>
        {eyebrow && <p className="text-[12px] uppercase tracking-[0.24em] text-white/60">{eyebrow}</p>}
        <h1 className="mt-1.5 font-heading text-[24px] font-semibold tracking-tight text-white">{title}</h1>
      </div>
      {action}
    </div>
  );
}