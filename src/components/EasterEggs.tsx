'use client';

import { useEffect, useState } from 'react';

/**
 * Easter Eggs Component
 * 
 * Hidden features and surprises:
 * 1. Konami Code - ↑ ↑ ↓ ↓ ← → ← → B A
 * 2. Type "developer" anywhere
 * 3. Triple click the logo
 * 4. Click corners in order: TL, TR, BR, BL
 */

const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

export function EasterEggs() {
  const [konamiProgress, setKonamiProgress] = useState(0);
  const [secretWord, setSecretWord] = useState('');

  useEffect(() => {
    let secretWordTimeout: NodeJS.Timeout;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Konami code detection
      if (e.key === KONAMI_CODE[konamiProgress]) {
        const newProgress = konamiProgress + 1;
        setKonamiProgress(newProgress);

        if (newProgress === KONAMI_CODE.length) {
          activateKonamiMode();
          setKonamiProgress(0);
        }
      } else {
        setKonamiProgress(0);
      }

      // Secret word detection
      const newSecretWord = (secretWord + e.key).slice(-9);
      setSecretWord(newSecretWord);

      if (newSecretWord === 'developer') {
        activateDeveloperMode();
        setSecretWord('');
      }

      // Clear secret word after 2 seconds of inactivity
      clearTimeout(secretWordTimeout);
      secretWordTimeout = setTimeout(() => {
        setSecretWord('');
      }, 2000);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(secretWordTimeout);
    };
  }, [konamiProgress, secretWord]);

  const activateKonamiMode = () => {
    // Confetti effect
    console.log('🎉 Konami Code activated!');
    
    // Create confetti
    createConfetti();
    
    // Show special message
    showMessage('🎮 Konami Code! You found the secret!', 'success');
    
    // Add special class to body for 10 seconds
    document.body.classList.add('konami-mode');
    setTimeout(() => {
      document.body.classList.remove('konami-mode');
    }, 10000);
  };

  const activateDeveloperMode = () => {
    console.log('👨‍💻 Developer mode activated!');
    
    showMessage('🔧 Developer Mode! Check the console!', 'info');
    
    // Log useful debugging info
    console.group('🎯 Portfolio Debug Info');
    console.log('Version:', '3.0.0');
    console.log('Build Date:', new Date().toISOString());
    console.log('User Agent:', navigator.userAgent);
    console.log('Screen:', `${window.screen.width}x${window.screen.height}`);
    console.log('Viewport:', `${window.innerWidth}x${window.innerHeight}`);
    console.log('Performance:', performance.getEntriesByType('navigation')[0]);
    console.groupEnd();
  };

  return null; // This component doesn't render anything
}

function createConfetti() {
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
  const confettiCount = 50;

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.cssText = `
      position: fixed;
      width: 10px;
      height: 10px;
      background-color: ${colors[Math.floor(Math.random() * colors.length)]};
      left: ${Math.random() * 100}%;
      top: -10px;
      opacity: 1;
      transform: rotate(${Math.random() * 360}deg);
      z-index: 9999;
      pointer-events: none;
      animation: confetti-fall ${2 + Math.random() * 2}s linear forwards;
    `;
    document.body.appendChild(confetti);

    setTimeout(() => {
      confetti.remove();
    }, 4000);
  }

  // Add animation if not exists
  if (!document.getElementById('confetti-animation')) {
    const style = document.createElement('style');
    style.id = 'confetti-animation';
    style.textContent = `
      @keyframes confetti-fall {
        to {
          top: 100vh;
          transform: translateX(${Math.random() * 200 - 100}px) rotate(${
      Math.random() * 720
    }deg);
          opacity: 0;
        }
      }
      .konami-mode {
        animation: rainbow-bg 2s linear infinite;
      }
      @keyframes rainbow-bg {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }
}

function showMessage(message: string, type: 'success' | 'info' | 'warning' | 'error') {
  const toast = document.createElement('div');
  
  const colors = {
    success: 'bg-green-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
  };

  toast.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-[9999] animate-slide-in`;
  toast.textContent = message;
  toast.style.cssText = `
    animation: slide-in 0.3s ease-out forwards, slide-out 0.3s ease-in 2.7s forwards;
  `;

  document.body.appendChild(toast);

  // Add animations if not exists
  if (!document.getElementById('toast-animations')) {
    const style = document.createElement('style');
    style.id = 'toast-animations';
    style.textContent = `
      @keyframes slide-in {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slide-out {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

/**
 * Logo Easter Egg Hook
 * Use in the Logo component
 */
export function useLogoEasterEgg() {
  const [clickCount, setClickCount] = useState(0);

  const handleLogoClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (newCount === 3) {
      // Triple click detected
      console.log('🎨 Logo Easter Egg!');
      showMessage('🎨 You found the logo secret!', 'info');
      
      // Trigger special animation
      const logo = document.querySelector('[data-logo]');
      if (logo) {
        logo.classList.add('animate-bounce');
        setTimeout(() => {
          logo.classList.remove('animate-bounce');
        }, 1000);
      }
      
      setClickCount(0);
    }

    // Reset counter after 1 second
    setTimeout(() => {
      setClickCount(0);
    }, 1000);
  };

  return { handleLogoClick };
}

/**
 * Corner Click Easter Egg Hook
 * Click corners in order: Top-Left, Top-Right, Bottom-Right, Bottom-Left
 */
export function useCornerEasterEgg() {
  const [sequence, setSequence] = useState<number[]>([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const corner = getClickedCorner(e);
      if (corner !== null) {
        const newSequence = [...sequence, corner].slice(-4);
        setSequence(newSequence);

        // Check if sequence is correct: 0, 1, 2, 3 (TL, TR, BR, BL)
        if (
          newSequence.length === 4 &&
          newSequence[0] === 0 &&
          newSequence[1] === 1 &&
          newSequence[2] === 2 &&
          newSequence[3] === 3
        ) {
          console.log('🎯 Corner sequence complete!');
          showMessage('🎯 You found the corner secret!', 'success');
          createConfetti();
          setSequence([]);
        }
      }
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [sequence]);

  return null;
}

function getClickedCorner(e: MouseEvent): number | null {
  const threshold = 100; // pixels from corner
  const { clientX, clientY } = e;
  const { innerWidth, innerHeight } = window;

  // Top-Left
  if (clientX < threshold && clientY < threshold) return 0;
  // Top-Right
  if (clientX > innerWidth - threshold && clientY < threshold) return 1;
  // Bottom-Right
  if (clientX > innerWidth - threshold && clientY > innerHeight - threshold) return 2;
  // Bottom-Left
  if (clientX < threshold && clientY > innerHeight - threshold) return 3;

  return null;
}
