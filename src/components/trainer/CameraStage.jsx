import { Loader2, ScanFace } from "lucide-react";

export default function CameraStage({ videoRef, canvasRef, running, engineStatus, engineError }) {
  return (
    <div className="relative aspect-[3/4] overflow-hidden rounded-[26px] border border-white/10 bg-black/70 sm:aspect-video">
      <video ref={videoRef} playsInline muted className="absolute inset-0 h-full w-full scale-x-[-1] object-cover" />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full scale-x-[-1] object-cover" />

      {!running && (
        <div className="absolute inset-0 grid place-items-center bg-[#04070d]/85 px-6 text-center">
          <div>
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-cyan-300/30 bg-cyan-400/10 text-cyan-200">
              <ScanFace className="h-5 w-5" />
            </span>
            <p className="mt-3 font-heading text-sm font-semibold text-white">Camera ready when you are</p>
            <p className="mt-1 text-[11px] leading-relaxed text-white/45">
              Stand two metres back so your whole body stays in frame. Nothing is uploaded, the pose model runs on your device.
            </p>
          </div>
        </div>
      )}

      {running && engineStatus === "loading" && (
        <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 text-[10px] text-cyan-100 backdrop-blur">
          <Loader2 className="h-3 w-3 animate-spin" /> Starting pose engine
        </div>
      )}
      {running && engineStatus === "error" && (
        <div className="absolute inset-x-3 bottom-3 rounded-2xl bg-black/70 px-3 py-2 text-[10px] text-amber-200 backdrop-blur">
          {engineError} Use manual counting below.
        </div>
      )}
    </div>
  );
}