import { useRef, useState } from "react";
import { ArrowDown, Loader2 } from "lucide-react";

const THRESHOLD = 70;

// The nearest scrollable ancestor: the phone-frame panel on desktop, null on phones (window scrolls).
function scrollParent(node) {
  let current = node?.parentElement ?? null;
  while (current) {
    const style = window.getComputedStyle(current);
    if (/(auto|scroll)/.test(style.overflowY) && current.scrollHeight > current.clientHeight) return current;
    current = current.parentElement;
  }
  return null;
}

export default function PullToRefresh({ onRefresh, children }) {
  const [pull, setPull] = useState(0);
  const [busy, setBusy] = useState(false);
  const startY = useRef(null);
  const rootRef = useRef(null);

  function onTouchStart(event) {
    if (busy) {
      startY.current = null;
      return;
    }
    const scroller = scrollParent(rootRef.current);
    const top = scroller ? scroller.scrollTop : window.scrollY;
    if (top > 0) {
      startY.current = null;
      return;
    }
    startY.current = event.touches[0].clientY;
  }

  function onTouchMove(event) {
    if (startY.current == null) return;
    const delta = event.touches[0].clientY - startY.current;
    if (delta <= 0) {
      setPull(0);
      return;
    }
    setPull(Math.min(delta * 0.5, 90));
  }

  async function onTouchEnd() {
    if (startY.current == null) return;
    startY.current = null;
    if (pull < THRESHOLD) {
      setPull(0);
      return;
    }
    setBusy(true);
    setPull(THRESHOLD);
    try {
      await onRefresh?.();
    } finally {
      setBusy(false);
      setPull(0);
    }
  }

  const ready = pull >= THRESHOLD;

  return (
    <div ref={rootRef} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
      <div
        className="flex items-center justify-center gap-1.5 overflow-hidden text-[12px] text-white/60"
        style={{ height: `${pull}px` }}
      >
        {busy ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-cyan-300" />
        ) : (
          <ArrowDown
            className="h-3.5 w-3.5 transition-transform"
            style={{ transform: ready ? "rotate(180deg)" : "none" }}
          />
        )}
        <span>{busy ? "Refreshing…" : ready ? "Release to refresh" : "Pull to refresh"}</span>
      </div>
      {children}
    </div>
  );
}