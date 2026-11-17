import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Camera, Square, Volume2, VolumeX } from "lucide-react";
import { base44 } from "@/api/base44Client";
import CameraStage from "@/components/trainer/CameraStage";
import ExercisePicker from "@/components/trainer/ExercisePicker";
import ManualRepCounter from "@/components/trainer/ManualRepCounter";
import SessionSummary from "@/components/trainer/SessionSummary";
import TrainerHud from "@/components/trainer/TrainerHud";
import { usePoseLandmarker } from "@/components/trainer/usePoseLandmarker";
import GlassCard from "@/components/vitaliq/GlassCard";
import { exerciseById } from "@/lib/exercises";
import { createFormEngine } from "@/lib/formEngine";
import { drawSkeleton } from "@/lib/poseDraw";
import { setVoiceEnabled, speak, stopVoice } from "@/lib/voiceCoach";

const EMPTY_LIVE = { reps: 0, score: 100, phase: "ready", warnings: [], angle: null, hold: 0 };

export default function LiveTrainer() {
  const { landmarkerRef, status: engineStatus, error: engineError } = usePoseLandmarker();
  const [exerciseId, setExerciseId] = useState("squat");
  const [running, setRunning] = useState(false);
  const [voice, setVoice] = useState(true);
  const [camError, setCamError] = useState(null);
  const [live, setLive] = useState(EMPTY_LIVE);
  const [summary, setSummary] = useState(null);
  const [saved, setSaved] = useState("idle");

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const engineRef = useRef(createFormEngine("squat"));
  const startedRef = useRef(0);
  const paintedRef = useRef(0);
  const exercise = exerciseById(exerciseId);

  useEffect(() => setVoiceEnabled(voice), [voice]);
  useEffect(
    () => () => {
      stopVoice();
      streamRef.current?.getTracks().forEach((track) => track.stop());
    },
    [],
  );

  useEffect(() => {
    if (!running) return;
    let frame = 0;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const landmarker = landmarkerRef.current;
      if (!video || !canvas || !landmarker || video.readyState < 2) return;
      if (video.videoWidth && canvas.width !== video.videoWidth) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }
      const now = performance.now();
      let result = null;
      try {
        result = landmarker.detectForVideo(video, now);
      } catch {
        return;
      }
      drawSkeleton(canvas, result?.landmarks?.[0] ?? null);
      const out = engineRef.current.update(result?.landmarks?.[0] ?? null, now);
      out.speak.forEach((line) => speak(line));
      if (now - paintedRef.current > 110) {
        paintedRef.current = now;
        setLive(out);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running, engineStatus, landmarkerRef]);

  async function start() {
    setCamError(null);
    setSummary(null);
    setSaved("idle");
    setLive(EMPTY_LIVE);
    engineRef.current = createFormEngine(exerciseId);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      startedRef.current = Date.now();
      setRunning(true);
      speak(`${exercise.name}. ${exercise.cues.bottom ?? exercise.cues.hold ?? "Let's begin."}`);
    } catch (error) {
      console.error(error);
      setCamError(
        error?.name === "NotAllowedError" || error?.name === "SecurityError"
          ? "Camera access is blocked in this window. Open the published app on your phone, or analyse a video instead."
          : "No camera was found on this device. Analyse a video instead.",
      );
    }
  }

  async function stop() {
    setRunning(false);
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    stopVoice();

    const seconds = Math.max(1, Math.round((Date.now() - (startedRef.current || Date.now())) / 1000));
    const snapshot = engineRef.current.snapshot(seconds);
    setSummary(snapshot);
    setSaved("saving");

    try {
      await base44.entities.TrainerSession.create({
        exercise: exercise.name,
        mode: "live",
        reps: snapshot.reps,
        hold_seconds: snapshot.hold,
        form_score: snapshot.score,
        duration_sec: seconds,
        voice_enabled: voice,
        summary:
          snapshot.reps || snapshot.hold
            ? `${exercise.name}: ${exercise.static ? `${snapshot.hold}s hold` : `${snapshot.reps} reps`} in ${seconds}s at a form score of ${snapshot.score}.`
            : `No completed ${exercise.static ? "hold" : "reps"} detected in this ${seconds}s set.`,
        cues: [exercise.cues.bottom ?? exercise.cues.hold, exercise.cues.top].filter(Boolean),
        issues: snapshot.warnings.map((warning) => ({
          area: exercise.name,
          issue: warning.text,
          severity: warning.severity,
          fix: "Reset your position, slow the tempo and keep the full range.",
        })),
      });
      setSaved("saved");
    } catch (error) {
      console.error(error);
      setSaved("error");
    }
  }

  return (
    <div className="space-y-4">
      <ExercisePicker value={exerciseId} onChange={setExerciseId} disabled={running} />

      {camError ? (
        <GlassCard className="border-amber-300/25 bg-amber-400/[0.07]">
          <p className="text-[12px] font-semibold text-amber-100">Camera unavailable</p>
          <p className="mt-1 text-[11px] leading-relaxed text-white/60">{camError}</p>
          <Link
            to="/trainer/video"
            className="mt-3 inline-flex rounded-full bg-cyan-400 px-3.5 py-1.5 text-[11px] font-semibold text-slate-950"
          >
            Upload a video instead
          </Link>
        </GlassCard>
      ) : (
        <>
          <CameraStage
            videoRef={videoRef}
            canvasRef={canvasRef}
            running={running}
            engineStatus={engineStatus}
            engineError={engineError}
          />

          <div className="flex items-center gap-2">
            {running ? (
              <button
                type="button"
                onClick={stop}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-rose-500 px-4 py-3 text-[12px] font-semibold text-white"
              >
                <Square className="h-3.5 w-3.5" /> Finish set
              </button>
            ) : (
              <button
                type="button"
                onClick={start}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-cyan-400 px-4 py-3 text-[12px] font-semibold text-slate-950"
              >
                <Camera className="h-4 w-4" /> Start form check
              </button>
            )}
            <button
              type="button"
              onClick={() => setVoice((value) => !value)}
              aria-label={voice ? "Mute voice coach" : "Unmute voice coach"}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-white/60"
            >
              {voice ? <Volume2 className="h-4 w-4 text-cyan-300" /> : <VolumeX className="h-4 w-4" />}
            </button>
          </div>

          {running && <TrainerHud live={live} exercise={exercise} />}
          {!running && !summary && <p className="px-1 text-[11px] leading-relaxed text-white/40">{exercise.brief}</p>}
        </>
      )}

      {engineStatus === "error" && !running && <ManualRepCounter exerciseId={exerciseId} voice={voice} />}

      {summary && <SessionSummary snapshot={summary} exercise={exercise} saved={saved} onRestart={start} />}
    </div>
  );
}