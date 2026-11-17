// Small geometry helpers for pose landmarks (normalised 0-1 coordinates).
export function angleAt(a, b, c) {
  if (!a || !b || !c) return null;
  const abx = a.x - b.x;
  const aby = a.y - b.y;
  const cbx = c.x - b.x;
  const cby = c.y - b.y;
  const magnitude = Math.hypot(abx, aby) * Math.hypot(cbx, cby);
  if (!magnitude) return null;
  const cosine = Math.min(1, Math.max(-1, (abx * cbx + aby * cby) / magnitude));
  return (Math.acos(cosine) * 180) / Math.PI;
}

export function midpoint(a, b) {
  return a && b ? { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 } : null;
}

// Degrees away from vertical between two points (used for trunk lean).
export function tiltFromVertical(from, to) {
  if (!from || !to) return 0;
  return (Math.atan2(Math.abs(to.x - from.x), Math.abs(to.y - from.y)) * 180) / Math.PI;
}