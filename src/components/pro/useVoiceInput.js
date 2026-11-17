import { useEffect, useRef, useState } from "react";

// Browser speech recognition with a graceful fallback when it is unavailable.
export function useVoiceInput(onText) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const recognition = useRef(null);
  const handler = useRef(onText);
  handler.current = onText;

  useEffect(() => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setSupported(!!Recognition);
    if (!Recognition) return;

    const instance = new Recognition();
    instance.continuous = true;
    instance.interimResults = false;
    instance.lang = "en-US";
    instance.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        if (event.results[i].isFinal) handler.current?.(event.results[i][0].transcript);
      }
    };
    instance.onend = () => setListening(false);
    instance.onerror = () => setListening(false);
    recognition.current = instance;
    return () => instance.abort();
  }, []);

  function toggle() {
    if (!recognition.current) return;
    if (listening) {
      recognition.current.stop();
      setListening(false);
    } else {
      recognition.current.start();
      setListening(true);
    }
  }

  return { listening, supported, toggle };
}