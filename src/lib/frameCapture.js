// Pull evenly spaced still frames out of a workout video so the AI can review form.
function seek(video, time) {
  return new Promise((resolve) => {
    const done = () => {
      video.removeEventListener("seeked", done);
      resolve();
    };
    video.addEventListener("seeked", done);
    video.currentTime = time;
  });
}

export async function captureFrames(file, count = 6) {
  const url = URL.createObjectURL(file);
  const video = document.createElement("video");
  video.src = url;
  video.muted = true;
  video.playsInline = true;
  video.preload = "auto";

  try {
    await new Promise((resolve, reject) => {
      video.onloadedmetadata = () => resolve();
      video.onerror = () => reject(new Error("That video could not be read. Try an MP4 or MOV clip."));
    });

    const duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 0;
    if (!duration) throw new Error("That video has no readable length.");

    const sourceWidth = video.videoWidth || 640;
    const sourceHeight = video.videoHeight || 480;
    const scale = Math.min(1, 720 / Math.max(sourceWidth, sourceHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(sourceWidth * scale);
    canvas.height = Math.round(sourceHeight * scale);
    const context = canvas.getContext("2d");

    const frames = [];
    for (let index = 0; index < count; index += 1) {
      const target = Math.min((duration * (index + 0.5)) / count, Math.max(0, duration - 0.05));
      await seek(video, target);
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.82));
      if (blob) frames.push(new File([blob], `form-frame-${index + 1}.jpg`, { type: "image/jpeg" }));
    }

    return { frames, duration };
  } finally {
    URL.revokeObjectURL(url);
    video.src = "";
  }
}