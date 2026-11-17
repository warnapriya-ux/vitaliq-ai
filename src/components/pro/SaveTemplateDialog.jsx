import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SaveTemplateDialog({ open, onOpenChange, defaultName, onSave }) {
  const [name, setName] = useState(defaultName || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setName(defaultName || "");
  }, [open, defaultName]);

  async function submit() {
    setSaving(true);
    try {
      await onSave(name.trim() || defaultName || "Workout template");
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm border-white/10 bg-[#0b1220] text-white">
        <DialogHeader>
          <DialogTitle className="text-sm">Save as template</DialogTitle>
        </DialogHeader>
        <Input
          autoFocus
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Template name"
          className="h-10 border-white/10 bg-[#070d18] text-[13px] text-white"
        />
        <p className="text-[11px] text-white/35">Reuse it for any of your clients later.</p>
        <DialogFooter>
          <Button onClick={submit} disabled={saving} className="h-10 w-full rounded-xl bg-cyan-400 text-xs font-semibold text-slate-950 hover:bg-cyan-300">
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}