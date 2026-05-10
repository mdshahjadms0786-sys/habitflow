import { useState, useEffect, useCallback, useRef } from 'react';
import { useHabitContext } from '../context/HabitContext';
import { getTodayISO } from '../utils/dateUtils';

const WORK_DURATION = 25 * 60;
const BREAK_DURATION = 5 * 60;

export const useTimer = (onWorkComplete, onBreakComplete) => {
  const [timeLeft, setTimeLeft] = useState(WORK_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [habitId, setHabitId] = useState(null);

  const intervalRef = useRef(null);
  const onWorkCompleteRef = useRef(onWorkComplete);
  const onBreakCompleteRef = useRef(onBreakComplete);

  useEffect(() => {
    onWorkCompleteRef.current = onWorkComplete;
    onBreakCompleteRef.current = onBreakComplete;
  }, [onWorkComplete, onBreakComplete]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            if (!isBreak) {
              onWorkCompleteRef.current?.(habitId);
              setSessions((s) => s + 1);
              setIsBreak(true);
              return BREAK_DURATION;
            } else {
              onBreakCompleteRef.current?.();
              setIsBreak(false);
              return WORK_DURATION;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, isBreak, habitId]);

  const startTimer = useCallback((id) => {
    setHabitId(id);
    setIsBreak(false);
    setTimeLeft(WORK_DURATION);
    setIsRunning(true);
  }, []);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resumeTimer = useCallback(() => {
    setIsRunning(true);
  }, []);

  const resetTimer = useCallback(() => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(WORK_DURATION);
    setHabitId(null);
    setSessions(0);
  }, []);

  const skipBreak = useCallback(() => {
    clearInterval(intervalRef.current);
    setIsBreak(false);
    setTimeLeft(WORK_DURATION);
    setIsRunning(true);
  }, []);

  return {
    timeLeft,
    isRunning,
    isBreak,
    sessions,
    habitId,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    skipBreak,
  };
};

export default useTimer;
