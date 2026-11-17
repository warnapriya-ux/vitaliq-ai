import { useEffect, useRef, useState } from "react";

// MediaPipe pose model, loaded in the browser only when the trainer is opened.
const CDN = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14";
const MODEL =
  "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task";

export function usePoseLandmarker() {
  const landmarkerRef = useRef(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const bundleUrl = `${CDN}/vision_bundle.mjs`;
        const vision = await import(/* @vite-ignore */ bundleUrl);
        const fileset = await vision.FilesetResolver.forVisionTasks(`${CDN}/wasm`);
        const options = (delegate) => ({
          baseOptions: { modelAssetPath: MODEL, delegate },
          runningMode: "VIDEO",
          numPoses: 1,
          minPoseDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        let landmarker;
        try {
          landmarker = await vision.PoseLandmarker.createFromOptions(fileset, options("GPU"));
        } catch {
          landmarker = await vision.PoseLandmarker.createFromOptions(fileset, options("CPU"));
        }

        if (!alive) {
          landmarker.close?.();
          return;
        }
        landmarkerRef.current = landmarker;
        setStatus("ready");
      } catch (loadError) {
        if (!alive) return;
        console.error(loadError);
        setError("The pose engine could not start on this device.");
        setStatus("error");
      }
    })();

    return () => {
      alive = false;
      try {
        landmarkerRef.current?.close?.();
      } catch {
        /* already closed */
      }
      landmarkerRef.current = null;
    };
  }, []);

  return { landmarkerRef, status, error };
}