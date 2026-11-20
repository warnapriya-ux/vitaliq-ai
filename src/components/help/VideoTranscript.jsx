import { clockLabel, timedVideo } from "@/lib/tutorialTiming";

/** The written transcript of one tutorial, one line per chapter with its real timing. */
export default function VideoTranscript({ video, className = "" }) {
  const { scenes } = timedVideo(video);
  return (
    <div className={`mt-2 space-y-1.5 ${className}`}>
      {scenes.map((scene) => (
        <p key={scene.id} className="text-[11.5px] leading-relaxed text-white/55">
          <span className="mr-1.5 text-[10px] tabular-nums text-cyan-300/70">
            {clockLabel(scene.start)}
          </span>
          {scene.transcript}
        </p>
      ))}
    </div>
  );
}