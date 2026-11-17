// Spoken coaching on top of the browser speech synthesis API.
let enabled = true;
let cachedVoice = null;
let lastText = "";
let lastAt = 0;

function pickVoice() {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices() ?? [];
  return (
    voices.find((voice) => /en[-_](US|GB)/i.test(voice.lang) && /female|samantha|jenny|aria|zira|google/i.test(voice.name)) ??
    voices.find((voice) => /^en/i.test(voice.lang)) ??
    null
  );
}

export function setVoiceEnabled(value) {
  enabled = value;
  if (!value) stopVoice();
}

export function stopVoice() {
  if (typeof window !== "undefined") window.speechSynthesis?.cancel();
}

// Speak several lines as one coaching sequence, in order.
export function speakSequence(lines) {
  if (!enabled || typeof window === "undefined" || !window.speechSynthesis) return;
  const spoken = (lines ?? []).filter((line) => typeof line === "string" && line.trim());
  if (!spoken.length) return;
  if (!cachedVoice) cachedVoice = pickVoice();
  window.speechSynthesis.cancel();
  spoken.forEach((line) => {
    const utterance = new SpeechSynthesisUtterance(line);
    utterance.rate = 1.02;
    utterance.pitch = 1.02;
    if (cachedVoice) utterance.voice = cachedVoice;
    window.speechSynthesis.speak(utterance);
  });
  lastText = "";
  lastAt = 0;
}

export function speak(text) {
  if (!enabled || !text || typeof window === "undefined" || !window.speechSynthesis) return;
  const now = Date.now();
  if (text === lastText && now - lastAt < 2500) return;
  lastText = text;
  lastAt = now;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.03;
  utterance.pitch = 1.02;
  if (!cachedVoice) cachedVoice = pickVoice();
  if (cachedVoice) utterance.voice = cachedVoice;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}