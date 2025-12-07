"use client";
import { useState, useEffect } from 'react';

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
    <h1 className={className}>
      {displayedText}
      {showCursor && !(index === text.length && !loop) && (
        <span className="animate-pulse text-primary">|</span>
      )}
    </h1>
  );
};

export default Typewriter;
