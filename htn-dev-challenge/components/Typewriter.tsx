"use client";

import { useState, useEffect } from "react";

interface TypewriterProps {
  /** The full text to type out character by character. */
  text: string;
  /** Delay in ms between each character. Default 80. */
  speed?: number;
  /** Delay in ms before typing starts. Default 300. */
  startDelay?: number;
  /** Optional className applied to the wrapper <span>. */
  className?: string;
}

/**
 * Typewriter component — types out text one character at a time.
 *
 * A blinking cursor (|) is shown while typing and continues blinking
 * after the text is fully rendered. Uses CSS animation for the cursor
 * blink so there's no extra JS timer running.
 *
 * Accessible: the full text is in an aria-label so screen readers
 * don't hear it letter by letter.
 */
export default function Typewriter({
  text,
  speed = 80,
  startDelay = 300,
  className = "",
}: TypewriterProps) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  // Wait for startDelay, then begin typing
  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(timeout);
  }, [startDelay]);

  // Type one character at a time
  useEffect(() => {
    if (!started) return;
    if (displayed.length >= text.length) return;

    const timeout = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1));
    }, speed);

    return () => clearTimeout(timeout);
  }, [started, displayed, text, speed]);

  return (
    <span className={className} aria-label={text}>
      <span aria-hidden="true">{displayed}</span>
      <span
        aria-hidden="true"
        className="inline-block w-[3px] translate-y-[2px] animate-pulse bg-white"
        style={{ height: "0.85em" }}
      />
    </span>
  );
}
