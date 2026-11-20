function formatTime(value) {
  const total = Math.max(0, Math.floor(value));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

/** The written transcript of one tutorial, one line per scene with its timestamp. */
export default function VideoTranscript({ video, className = "" }) {
  return (
    <div className={`mt-2 space-y-1.5 ${className}`}>
      {video.scenes.map((scene) => (
        <p key={scene.id} className="text-[11.5px] leading-relaxed text-white/55">
          <span className="mr-1.5 text-[10px] tabular-nums text-cyan-300/70">
            {formatTime(scene.start)}
          </span>
          {scene.transcript}
        </p>
      ))}
    </div>
  );
}