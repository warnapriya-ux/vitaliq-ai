import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";

export default function SelectSheet({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-11 w-full items-center justify-between gap-2 rounded-xl border border-white/10 bg-[#0b1220] px-3 text-left text-sm text-white focus:border-cyan-400/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
      >
        <span className="truncate">{selected?.label ?? "Select"}</span>
        <ChevronDown className="h-4 w-4 shrink-0 text-white/40" />
      </button>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="border-white/10 bg-[#080d16]">
          <DrawerHeader className="pb-1 text-left">
            <DrawerTitle className="font-heading text-sm text-white">{label}</DrawerTitle>
          </DrawerHeader>
          <div className="max-h-[55vh] overflow-y-auto px-2 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-1">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className="flex min-h-[44px] w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-left text-[14px] text-white/80 transition hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
              >
                <span className="truncate">{option.label}</span>
                {option.value === value && <Check className="h-4 w-4 shrink-0 text-cyan-300" />}
              </button>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}