import { useState, useEffect, useCallback } from 'react';
import { getDailyQuests, saveDailyQuests, checkAndCompleteQuests, updateQuestStreak, getQuestStreak } from '../utils/questUtils';
import { useHabits } from './useHabits';
import { useMoodLog } from './useMoodLog';

export const useQuests = () => {
  const { habits } = useHabits();
  const { moodLog } = useMoodLog();
  const [quests, setQuests] = useState([]);
  const [questStreak, setQuestStreak] = useState(0);
  const [justCompleted, setJustCompleted] = useState(null);
  
  useEffect(() => {
    const data = getDailyQuests();
    setQuests(data.quests || []);
    setQuestStreak(data.questStreak || 0);
  }, []);
  
  const onQuestComplete = useCallback((quest) => {
    setJustCompleted(quest);
    setTimeout(() => setJustCompleted(null), 3000);
  }, []);
  
  useEffect(() => {
    if (!quests || quests.length === 0 || !habits) return;
    
    const updated = checkAndCompleteQuests(quests, habits, moodLog, onQuestComplete);
    setQuests(updated);
    saveDailyQuests(updated);
    
    const allCompleted = updated.every(q => q.completed);
    if (allCompleted && updated.some(q => q.completed)) {
      const newStreak = updateQuestStreak(true);
      setQuestStreak(newStreak);
    }
  }, [habits, moodLog]);
  
  const refreshQuests = useCallback(() => {
    const data = getDailyQuests();
    setQuests(data.quests || []);
    setQuestStreak(data.questStreak || 0);
  }, []);
  
  return { quests, questStreak, refreshQuests, justCompleted };
};

export default useQuests;