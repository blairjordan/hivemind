'use client';

import React, { useState, useEffect } from 'react';

const SLOT_COUNT = 10;
const MAX_DURATION = 1000; // Maximum duration for a key press

function KeyPressComponent() {
  const [isKeyPressed, setIsKeyPressed] = useState(false);
  const [keydownTime, setKeydownTime] = useState(0);
  const [durations, setDurations] = useState(new Array(SLOT_COUNT).fill(0));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentVelocity, setCurrentVelocity] = useState(0);

  const calculateVelocity = () => {
    let newDurations = [...durations];
    if (isKeyPressed) {
      const ongoingDuration = Math.min(Date.now() - keydownTime, MAX_DURATION);
      newDurations[currentIndex] = ongoingDuration;
    } else {
      newDurations[currentIndex] = 0;
    }

    const totalDuration = newDurations.reduce((a, b) => a + b, 0);
    const maxPossibleDuration = SLOT_COUNT * MAX_DURATION;
    setCurrentVelocity(totalDuration / maxPossibleDuration);
    setDurations(newDurations);
    setCurrentIndex((currentIndex + 1) % SLOT_COUNT);
  };

  useEffect(() => {
    const interval = setInterval(calculateVelocity, 100);
    return () => clearInterval(interval);
  }, [isKeyPressed, keydownTime, durations, currentIndex, currentVelocity]);

  const handleKeyDown = (e) => {
    if (!isKeyPressed) {
      setKeydownTime(Date.now());
      setIsKeyPressed(true);
    }
  };

  const handleKeyUp = () => {
    if (isKeyPressed) {
      setIsKeyPressed(false);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isKeyPressed]);

  return (
    <div>
      <p>velocity: {currentVelocity.toFixed(2)}</p>
      <p>{isKeyPressed ? '⌨ key pressed' : '⌨ key released'}</p>
    </div>
  );
}

export default KeyPressComponent;
