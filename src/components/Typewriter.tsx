"use client";
import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";

const Typewriter = ({
  text,
  speed = 150,
  className,
  showCursor = true,
  loop = false,
  deleteSpeed = 50,
  pauseTime = 2000
}: {
  text: string,
  speed?: number,
  className?: string,
  showCursor?: boolean,
  loop?: boolean,
  deleteSpeed?: number,
  pauseTime?: number
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) {
      const pauseTimeout = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, pauseTime);
      return () => clearTimeout(pauseTimeout);
    }

    if (!loop && index === text.length && !isDeleting) {
      return;
    }

    if (isDeleting) {
      if (displayedText.length === 0) {
        setIsDeleting(false);
        setIndex(0);
        return;
      }
      const timeoutId = setTimeout(() => {
        setDisplayedText((prev) => prev.slice(0, -1));
      }, deleteSpeed);
      return () => clearTimeout(timeoutId);
    }

    if (index < text.length) {
      const timeoutId = setTimeout(() => {
        setDisplayedText((prev) => prev + text.charAt(index));
        setIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeoutId);
    } else if (loop && !isPaused) {
      setIsPaused(true);
    }
  }, [index, text, speed, isDeleting, displayedText, loop, deleteSpeed, pauseTime, isPaused]);

  return (
    <h1 className={cn(className, "transition-all duration-300")}>
      <span className="relative z-10">{displayedText}</span>
      {/* Neon Glow Effect */}
      <span className="absolute inset-0 blur-lg opacity-50 z-0 select-none pointer-events-none text-primary" aria-hidden="true">
        {displayedText}
      </span>
      {showCursor && !(index === text.length && !loop) && (
        <span className="animate-pulse text-primary drop-shadow-[0_0_8px_currentColor]">|</span>
      )}
    </h1>
  );
};

export default Typewriter;
