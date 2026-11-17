import { cn } from "@/lib/utils";

export default function GlassCard({ className, children, ...rest }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl shadow-[0_24px_70px_-45px_rgba(0,0,0,1)]",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}