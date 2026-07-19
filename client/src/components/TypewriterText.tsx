import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

type TypewriterTextProps = {
  phrases: string[];
  className?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
};

export function TypewriterText({
  phrases,
  className,
  typingSpeed = 72,
  deletingSpeed = 34,
  pauseDuration = 1900,
}: TypewriterTextProps) {
  const reduceMotion = useReducedMotion();
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduceMotion || phrases.length === 0) return;
    const phrase = phrases[phraseIndex] ?? "";
    const isComplete = displayText === phrase;
    const isEmpty = displayText.length === 0;
    const delay = isComplete && !deleting
      ? pauseDuration
      : deleting
        ? deletingSpeed
        : typingSpeed;

    const timer = window.setTimeout(() => {
      if (isComplete && !deleting) {
        setDeleting(true);
        return;
      }
      if (isEmpty && deleting) {
        setDeleting(false);
        setPhraseIndex(index => (index + 1) % phrases.length);
        return;
      }
      setDisplayText(current => deleting
        ? phrase.slice(0, Math.max(0, current.length - 1))
        : phrase.slice(0, current.length + 1));
    }, delay);

    return () => window.clearTimeout(timer);
  }, [deleting, deletingSpeed, displayText, pauseDuration, phraseIndex, phrases, reduceMotion, typingSpeed]);

  const visibleText = reduceMotion ? phrases[0] : displayText;

  return (
    <span className={className}>
      <span aria-hidden="true">{visibleText}</span>
      {!reduceMotion ? (
        <motion.span
          aria-hidden="true"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.55, repeat: Infinity, repeatType: "reverse" }}
          className="ml-1 inline-block h-[0.9em] w-[3px] translate-y-[0.08em] rounded-full bg-primary"
        />
      ) : null}
      <span className="sr-only">{phrases[0]}</span>
    </span>
  );
}
