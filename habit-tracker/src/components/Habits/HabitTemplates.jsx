import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { getTodayISO } from '../../utils/dateUtils';
import toast from 'react-hot-toast';
import { isPro, isElite, getMaxHabits, ELITE_HABIT_PACKS } from '../../utils/planUtils';
import { useNavigate } from 'react-router-dom';

const TEMPLATE_PACKS = [
  {
    id: 'morning', name: 'Morning Routine', icon: '🌅', color: '#F59E0B',
    habits: [
      { name: 'Wake up at 6 AM', icon: '⏰', category: 'Personal', difficulty: 'medium', points: 25, notes: 'Start day early' },
      { name: 'Morning meditation', icon: '🧘', category: 'Health', difficulty: 'easy', points: 10, notes: '10 min mindfulness' },
      { name: 'Cold shower', icon: '🚿', category: 'Health', difficulty: 'hard', points: 50, notes: 'Boost energy' },
      { name: 'Healthy breakfast', icon: '🥗', category: 'Health', difficulty: 'easy', points: 10, notes: 'Fuel your body' },
      { name: 'Morning journaling', icon: '📝', category: 'Personal', difficulty: 'easy', points: 10, notes: '3 things grateful' }
    ]
  },
  {
    id: 'fitness', name: 'Fitness Pack', icon: '💪', color: '#EF4444',
    habits: [
      { name: '30 min workout', icon: '🏋️', category: 'Fitness', difficulty: 'hard', points: 50, notes: 'Strength training' },
      { name: '10,000 steps', icon: '🚶', category: 'Fitness', difficulty: 'medium', points: 25, notes: 'Walk all day' },
      { name: 'Drink 3L water', icon: '💧', category: 'Health', difficulty: 'easy', points: 10, notes: 'Stay hydrated' },
      { name: 'No junk food', icon: '🥦', category: 'Health', difficulty: 'hard', points: 50, notes: 'Eat clean' },
      { name: 'Post-workout stretch', icon: '🤸', category: 'Fitness', difficulty: 'easy', points: 10, notes: 'Flexibility work' }
    ]
  },
  {
    id: 'study', name: 'Study Pack', icon: '📚', color: '#8B5CF6',
    habits: [
      { name: '2hr deep work', icon: '💻', category: 'Work', difficulty: 'hard', points: 50, notes: 'No distractions' },
      { name: 'Read 30 pages', icon: '📖', category: 'Learning', difficulty: 'medium', points: 25, notes: 'Read every day' },
      { name: 'Review notes', icon: '📋', category: 'Learning', difficulty: 'easy', points: 10, notes: 'Spaced repetition' },
      { name: 'No social media before noon', icon: '📵', category: 'Personal', difficulty: 'hard', points: 50, notes: 'Protect focus' },
      { name: 'Practice one skill', icon: '🎯', category: 'Learning', difficulty: 'medium', points: 25, notes: '30 min practice' }
    ]
  },
  {
    id: 'mindfulness', name: 'Mindfulness Pack', icon: '🧠', color: '#06B6D4',
    habits: [
      { name: 'Meditate 15 min', icon: '🧘', category: 'Personal', difficulty: 'medium', points: 25, notes: 'Calm your mind' },
      { name: 'Gratitude journal', icon: '🙏', category: 'Personal', difficulty: 'easy', points: 10, notes: 'Write 3 things' },
      { name: 'Digital detox 1hr', icon: '📴', category: 'Personal', difficulty: 'medium', points: 25, notes: 'No screens' },
      { name: 'Deep breathing', icon: '💨', category: 'Health', difficulty: 'easy', points: 10, notes: '5 min breathing' },
      { name: 'Evening walk', icon: '🌙', category: 'Health', difficulty: 'easy', points: 10, notes: 'Relax outside' }
    ]
  },
  {
    id: 'productivity', name: 'Productivity Pack', icon: '⚡', color: '#F59E0B',
    habits: [
      { name: 'Plan tomorrow tonight', icon: '📅', category: 'Work', difficulty: 'easy', points: 10, notes: 'Top 3 tasks' },
      { name: 'Check emails once', icon: '📧', category: 'Work', difficulty: 'medium', points: 25, notes: 'Batch process' },
      { name: 'Complete MIT first', icon: '🎯', category: 'Work', difficulty: 'medium', points: 25, notes: 'Most important task' },
      { name: 'No meetings before 10', icon: '🚫', category: 'Work', difficulty: 'hard', points: 50, notes: 'Protect morning' },
      { name: 'Weekly review', icon: '📊', category: 'Work', difficulty: 'medium', points: 25, notes: 'Every Sunday' }
    ]
  },
  {
    id: 'health', name: 'Health Pack', icon: '❤️', color: '#10B981',
    habits: [
      { name: 'Sleep by 10 PM', icon: '😴', category: 'Health', difficulty: 'hard', points: 50, notes: '8 hours sleep' },
      { name: 'Take vitamins', icon: '💊', category: 'Health', difficulty: 'easy', points: 10, notes: 'Daily supplements' },
      { name: 'No alcohol', icon: '🚫', category: 'Health', difficulty: 'extreme', points: 100, notes: 'Stay sober' },
      { name: 'Meal prep', icon: '🍱', category: 'Health', difficulty: 'medium', points: 25, notes: 'Prepare ahead' },
      { name: 'Track calories', icon: '📱', category: 'Health', difficulty: 'medium', points: 25, notes: 'Stay on goal' }
    ]
  },
  {
    id: 'nutrition', name: 'Nutrition Pack', icon: '🍎', color: '#22C55E',
    habits: [
      { name: 'No sugar today', icon: '🚫', category: 'Health', difficulty: 'hard', points: 50, notes: 'Cut sugar' },
      { name: 'Eat 5 vegetables', icon: '🥕', category: 'Health', difficulty: 'medium', points: 25, notes: 'Micronutrients' },
      { name: 'Protein with every meal', icon: '🥩', category: 'Health', difficulty: 'medium', points: 25, notes: 'Build muscle' },
      { name: 'No processed food', icon: '🥗', category: 'Health', difficulty: 'hard', points: 50, notes: 'Eat whole foods' },
      { name: 'Intermittent fasting', icon: '⏰', category: 'Health', difficulty: 'extreme', points: 100, notes: '16:8 fasting' }
    ]
  },
  {
    id: 'developer', name: 'Developer Pack', icon: '💻', color: '#6366F1',
    habits: [
      { name: 'Code for 1 hour', icon: '⌨️', category: 'Work', difficulty: 'medium', points: 25, notes: 'Daily coding' },
      { name: 'Learn new tech', icon: '🔧', category: 'Learning', difficulty: 'medium', points: 25, notes: 'Stay updated' },
      { name: 'Solve DSA problem', icon: '🧩', category: 'Learning', difficulty: 'hard', points: 50, notes: 'LeetCode daily' },
      { name: 'GitHub contribution', icon: '🐙', category: 'Work', difficulty: 'medium', points: 25, notes: 'Green streak' },
      { name: 'Read tech blog', icon: '📰', category: 'Learning', difficulty: 'easy', points: 10, notes: 'Stay informed' }
    ]
  },
  {
    id: 'creative', name: 'Creative Pack', icon: '🎨', color: '#EC4899',
    habits: [
      { name: 'Draw or sketch', icon: '✏️', category: 'Personal', difficulty: 'easy', points: 10, notes: '15 min art' },
      { name: 'Write 500 words', icon: '✍️', category: 'Personal', difficulty: 'medium', points: 25, notes: 'Daily writing' },
      { name: 'Learn instrument', icon: '🎸', category: 'Personal', difficulty: 'hard', points: 50, notes: '30 min practice' },
      { name: 'Photography walk', icon: '📷', category: 'Personal', difficulty: 'easy', points: 10, notes: 'Capture moments' },
      { name: 'Creative project', icon: '🎭', category: 'Personal', difficulty: 'medium', points: 25, notes: 'Work on passion' }
    ]
  },
  {
    id: 'finance', name: 'Finance Pack', icon: '💰', color: '#84CC16',
    habits: [
      { name: 'Track expenses', icon: '📊', category: 'Personal', difficulty: 'easy', points: 10, notes: 'Log every spend' },
      { name: 'Save 20% income', icon: '🏦', category: 'Personal', difficulty: 'hard', points: 50, notes: 'Pay yourself first' },
      { name: 'No impulse buying', icon: '🛒', category: 'Personal', difficulty: 'hard', points: 50, notes: 'Wait 24 hours' },
      { name: 'Invest daily', icon: '📈', category: 'Personal', difficulty: 'medium', points: 25, notes: 'SIP or stocks' },
      { name: 'Read finance book', icon: '📚', category: 'Learning', difficulty: 'easy', points: 10, notes: '10 pages daily' }
    ]
  },
  {
    id: 'social', name: 'Social Pack', icon: '🤝', color: '#F97316',
    habits: [
      { name: 'Call family', icon: '📞', category: 'Personal', difficulty: 'easy', points: 10, notes: 'Stay connected' },
      { name: 'Make new friend', icon: '👋', category: 'Personal', difficulty: 'medium', points: 25, notes: 'Expand network' },
      { name: 'Help someone today', icon: '🤲', category: 'Personal', difficulty: 'easy', points: 10, notes: 'Random kindness' },
      { name: 'Professional networking', icon: '💼', category: 'Work', difficulty: 'medium', points: 25, notes: 'LinkedIn daily' },
      { name: 'Send gratitude message', icon: '💌', category: 'Personal', difficulty: 'easy', points: 10, notes: 'Appreciate others' }
    ]
  },
  {
    id: 'sleep', name: 'Sleep Pack', icon: '😴', color: '#7C3AED',
    habits: [
      { name: 'Sleep by 10 PM', icon: '🌙', category: 'Health', difficulty: 'hard', points: 50, notes: 'Consistent bedtime' },
      { name: 'No screen before bed', icon: '📴', category: 'Health', difficulty: 'medium', points: 25, notes: '1hr before sleep' },
      { name: 'Read before sleep', icon: '📖', category: 'Personal', difficulty: 'easy', points: 10, notes: 'Wind down' },
      { name: 'Wake same time daily', icon: '⏰', category: 'Health', difficulty: 'hard', points: 50, notes: 'Fix circadian' },
      { name: 'Limit naps to 20 min', icon: '💤', category: 'Health', difficulty: 'medium', points: 25, notes: 'No long naps' }
    ]
  },
  {
    id: 'nature', name: 'Nature Pack', icon: '🌿', color: '#059669',
    habits: [
      { name: 'Morning sunlight', icon: '☀️', category: 'Health', difficulty: 'easy', points: 10, notes: '10 min outside' },
      { name: 'Outdoor walk', icon: '🌳', category: 'Health', difficulty: 'easy', points: 10, notes: 'Fresh air daily' },
      { name: 'Water plants', icon: '🪴', category: 'Personal', difficulty: 'easy', points: 10, notes: 'Care for nature' },
      { name: 'Cycle instead of drive', icon: '🚲', category: 'Fitness', difficulty: 'medium', points: 25, notes: 'Eco friendly' },
      { name: 'No plastic today', icon: '♻️', category: 'Personal', difficulty: 'medium', points: 25, notes: 'Save environment' }
    ]
  },
  {
    id: 'student', name: 'Student Pack', icon: '🎓', color: '#0EA5E9',
    habits: [
      { name: 'Attend all classes', icon: '🏫', category: 'Learning', difficulty: 'medium', points: 25, notes: 'Never miss class' },
      { name: 'Complete assignments', icon: '📝', category: 'Learning', difficulty: 'medium', points: 25, notes: 'On time always' },
      { name: 'Group study session', icon: '👥', category: 'Learning', difficulty: 'easy', points: 10, notes: 'Learn together' },
      { name: 'Daily revision', icon: '🔄', category: 'Learning', difficulty: 'medium', points: 25, notes: 'Revise yesterday' },
      { name: 'Exam preparation', icon: '📚', category: 'Learning', difficulty: 'hard', points: 50, notes: 'Practice papers' }
    ]
  },
  {
    id: 'entrepreneur', name: 'Entrepreneur Pack', icon: '🚀', color: '#DC2626',
    habits: [
      { name: 'Work on business', icon: '💼', category: 'Work', difficulty: 'hard', points: 50, notes: '2hr on startup' },
      { name: 'Learn marketing', icon: '📣', category: 'Learning', difficulty: 'medium', points: 25, notes: 'Growth skills' },
      { name: 'Customer call', icon: '📞', category: 'Work', difficulty: 'medium', points: 25, notes: 'Talk to users' },
      { name: 'Track revenue', icon: '💰', category: 'Work', difficulty: 'easy', points: 10, notes: 'Daily metrics' },
      { name: 'Business networking', icon: '🤝', category: 'Work', difficulty: 'medium', points: 25, notes: 'Build connections' }
    ]
  },
  {
    id: 'cardio', name: 'Cardio Pack', icon: '🏃', color: '#EF4444',
    habits: [
      { name: 'Morning run', icon: '🏃', category: 'Fitness', difficulty: 'hard', points: 50, notes: '5km daily' },
      { name: 'Cycling 30 min', icon: '🚴', category: 'Fitness', difficulty: 'medium', points: 25, notes: 'Outdoor cycling' },
      { name: 'Jump rope', icon: '⚡', category: 'Fitness', difficulty: 'medium', points: 25, notes: '10 min skipping' },
      { name: 'Swim 20 laps', icon: '🏊', category: 'Fitness', difficulty: 'hard', points: 50, notes: 'Full body cardio' },
      { name: 'Climb stairs', icon: '🏢', category: 'Fitness', difficulty: 'easy', points: 10, notes: 'No elevator' }
    ]
  },
  {
    id: 'yoga', name: 'Yoga Pack', icon: '🧘', color: '#8B5CF6',
    habits: [
      { name: 'Morning yoga', icon: '🌅', category: 'Fitness', difficulty: 'medium', points: 25, notes: '20 min flow' },
      { name: 'Pranayama', icon: '💨', category: 'Health', difficulty: 'easy', points: 10, notes: 'Breathing exercises' },
      { name: 'Sun salutation', icon: '☀️', category: 'Fitness', difficulty: 'medium', points: 25, notes: '12 rounds' },
      { name: 'Evening yoga', icon: '🌙', category: 'Fitness', difficulty: 'easy', points: 10, notes: 'Relax muscles' },
      { name: 'Yoga meditation', icon: '🧘', category: 'Personal', difficulty: 'easy', points: 10, notes: 'End with peace' }
    ]
  },
  {
    id: 'cooking', name: 'Cooking Pack', icon: '🍳', color: '#F97316',
    habits: [
      { name: 'Cook at home', icon: '🍳', category: 'Health', difficulty: 'medium', points: 25, notes: 'No takeout' },
      { name: 'Try new recipe', icon: '📖', category: 'Personal', difficulty: 'medium', points: 25, notes: 'Experiment weekly' },
      { name: 'Meal prep Sunday', icon: '🍱', category: 'Health', difficulty: 'hard', points: 50, notes: 'Prep for week' },
      { name: 'No takeout today', icon: '🚫', category: 'Health', difficulty: 'hard', points: 50, notes: 'Cook everything' },
      { name: 'Healthy snack only', icon: '🥜', category: 'Health', difficulty: 'medium', points: 25, notes: 'No chips/biscuits' }
    ]
  },
  {
    id: 'digital', name: 'Digital Wellness', icon: '📱', color: '#0EA5E9',
    habits: [
      { name: 'Screen time under 2hr', icon: '📱', category: 'Personal', difficulty: 'hard', points: 50, notes: 'Reduce phone use' },
      { name: 'No phone morning', icon: '🌅', category: 'Personal', difficulty: 'hard', points: 50, notes: 'First hour free' },
      { name: 'App detox day', icon: '🗑️', category: 'Personal', difficulty: 'extreme', points: 100, notes: 'Delete time wasters' },
      { name: 'Blue light glasses', icon: '👓', category: 'Health', difficulty: 'easy', points: 10, notes: 'Protect eyes' },
      { name: 'Offline hobby 1hr', icon: '🎨', category: 'Personal', difficulty: 'medium', points: 25, notes: 'Non-digital fun' }
    ]
  },
  {
    id: 'language', name: 'Language Pack', icon: '🌍', color: '#10B981',
    habits: [
      { name: 'Duolingo lesson', icon: '🦉', category: 'Learning', difficulty: 'easy', points: 10, notes: '15 min daily' },
      { name: '10 new words', icon: '📝', category: 'Learning', difficulty: 'easy', points: 10, notes: 'Vocabulary build' },
      { name: 'Watch foreign show', icon: '🎬', category: 'Learning', difficulty: 'easy', points: 10, notes: 'Immersion method' },
      { name: 'Speaking practice', icon: '🗣️', category: 'Learning', difficulty: 'medium', points: 25, notes: 'Speak out loud' },
      { name: 'Write in target language', icon: '✍️', category: 'Learning', difficulty: 'medium', points: 25, notes: 'Journal in language' }
    ]
  },
  {
    id: 'music', name: 'Music Pack', icon: '🎵', color: '#EC4899',
    habits: [
      { name: 'Practice instrument', icon: '🎸', category: 'Personal', difficulty: 'hard', points: 50, notes: '30 min daily' },
      { name: 'Learn new song', icon: '🎵', category: 'Personal', difficulty: 'medium', points: 25, notes: 'One song weekly' },
      { name: 'Music theory', icon: '📖', category: 'Learning', difficulty: 'medium', points: 25, notes: 'Study scales' },
      { name: 'Ear training', icon: '👂', category: 'Learning', difficulty: 'medium', points: 25, notes: 'Interval recognition' },
      { name: 'Compose melody', icon: '🎼', category: 'Personal', difficulty: 'hard', points: 50, notes: 'Create original' }
    ]
  },
  {
    id: 'writing', name: 'Writing Pack', icon: '✍️', color: '#6366F1',
    habits: [
      { name: 'Morning pages', icon: '📝', category: 'Personal', difficulty: 'easy', points: 10, notes: '3 pages free write' },
      { name: 'Write blog post', icon: '💻', category: 'Work', difficulty: 'hard', points: 50, notes: 'Publish weekly' },
      { name: 'Write a poem', icon: '🎭', category: 'Personal', difficulty: 'medium', points: 25, notes: 'Creative expression' },
      { name: 'Short story writing', icon: '📚', category: 'Personal', difficulty: 'hard', points: 50, notes: '500 words daily' },
      { name: 'Write letter to friend', icon: '💌', category: 'Personal', difficulty: 'easy', points: 10, notes: 'Handwritten' }
    ]
  },
  {
    id: 'home', name: 'Home Pack', icon: '🏠', color: '#84CC16',
    habits: [
      { name: 'Make bed daily', icon: '🛏️', category: 'Personal', difficulty: 'easy', points: 10, notes: 'First win of day' },
      { name: 'Clean room', icon: '🧹', category: 'Personal', difficulty: 'easy', points: 10, notes: '15 min tidy up' },
      { name: 'Organize desk', icon: '🗂️', category: 'Work', difficulty: 'easy', points: 10, notes: 'Clear workspace' },
      { name: 'Do laundry', icon: '👕', category: 'Personal', difficulty: 'easy', points: 10, notes: 'Weekly laundry' },
      { name: 'Declutter 1 item', icon: '🗑️', category: 'Personal', difficulty: 'easy', points: 10, notes: 'Minimize daily' }
    ]
  },
  {
    id: 'family', name: 'Family Pack', icon: '👨‍👩‍👧', color: '#F59E0B',
    habits: [
      { name: 'Family dinner together', icon: '🍽️', category: 'Personal', difficulty: 'medium', points: 25, notes: 'No phones at table' },
      { name: 'Call parents', icon: '📞', category: 'Personal', difficulty: 'easy', points: 10, notes: 'Daily check in' },
      { name: 'Play with kids', icon: '🎮', category: 'Personal', difficulty: 'easy', points: 10, notes: '30 min quality time' },
      { name: 'Date night', icon: '❤️', category: 'Personal', difficulty: 'medium', points: 25, notes: 'Weekly partner time' },
      { name: 'Family walk', icon: '🚶', category: 'Health', difficulty: 'easy', points: 10, notes: 'Evening together' }
    ]
  },
  {
    id: 'spiritual', name: 'Spiritual Pack', icon: '🙏', color: '#7C3AED',
    habits: [
      { name: 'Morning prayer/namaz', icon: '🕌', category: 'Personal', difficulty: 'medium', points: 25, notes: 'Connect with God' },
      { name: 'Read scripture', icon: '📖', category: 'Personal', difficulty: 'easy', points: 10, notes: '15 min daily' },
      { name: 'Practice gratitude', icon: '🙏', category: 'Personal', difficulty: 'easy', points: 10, notes: 'Count blessings' },
      { name: 'Give charity', icon: '💝', category: 'Personal', difficulty: 'medium', points: 25, notes: 'Sadaqah daily' },
      { name: 'Fasting', icon: '🌙', category: 'Health', difficulty: 'extreme', points: 100, notes: 'Spiritual discipline' }
    ]
  },
  {
    id: 'selfcare', name: 'Self Care Pack', icon: '💆', color: '#EC4899',
    habits: [
      { name: 'Skincare routine', icon: '✨', category: 'Health', difficulty: 'easy', points: 10, notes: 'Morning and night' },
      { name: 'Hair care', icon: '💆', category: 'Health', difficulty: 'easy', points: 10, notes: 'Weekly treatment' },
      { name: 'Self massage', icon: '💆', category: 'Health', difficulty: 'easy', points: 10, notes: '10 min relaxation' },
      { name: 'Pamper yourself', icon: '🛁', category: 'Personal', difficulty: 'easy', points: 10, notes: 'Weekly me-time' },
      { name: 'Mental health check', icon: '🧠', category: 'Health', difficulty: 'easy', points: 10, notes: 'How are you feeling' }
    ]
  },
  {
    id: 'sports', name: 'Sports Pack', icon: '🏏', color: '#059669',
    habits: [
      { name: 'Cricket practice', icon: '🏏', category: 'Fitness', difficulty: 'hard', points: 50, notes: 'Bat or bowl' },
      { name: 'Football practice', icon: '⚽', category: 'Fitness', difficulty: 'hard', points: 50, notes: 'Team sport' },
      { name: 'Badminton', icon: '🏸', category: 'Fitness', difficulty: 'medium', points: 25, notes: '30 min match' },
      { name: 'Swimming', icon: '🏊', category: 'Fitness', difficulty: 'hard', points: 50, notes: '20 laps' },
      { name: 'Martial arts', icon: '🥋', category: 'Fitness', difficulty: 'extreme', points: 100, notes: 'Train discipline' }
    ]
  },
  {
    id: 'gaming_detox', name: 'Gaming Detox', icon: '🎮', color: '#6366F1',
    habits: [
      { name: 'Limit gaming 1hr', icon: '⏱️', category: 'Personal', difficulty: 'hard', points: 50, notes: 'Set time limit' },
      { name: 'Outdoor instead', icon: '🌳', category: 'Fitness', difficulty: 'medium', points: 25, notes: 'Replace gaming' },
      { name: 'Read instead', icon: '📚', category: 'Learning', difficulty: 'medium', points: 25, notes: 'Books over games' },
      { name: 'Creative hobby', icon: '🎨', category: 'Personal', difficulty: 'medium', points: 25, notes: 'Make not consume' },
      { name: 'Social time', icon: '👥', category: 'Personal', difficulty: 'easy', points: 10, notes: 'Real connections' }
    ]
  },
  {
    id: 'environment', name: 'Environment Pack', icon: '🌱', color: '#10B981',
    habits: [
      { name: 'No single use plastic', icon: '♻️', category: 'Personal', difficulty: 'medium', points: 25, notes: 'Carry reusable bag' },
      { name: 'Plant a tree', icon: '🌳', category: 'Personal', difficulty: 'extreme', points: 100, notes: 'Monthly challenge' },
      { name: 'Save water', icon: '💧', category: 'Personal', difficulty: 'easy', points: 10, notes: 'Short showers' },
      { name: 'Cycle to work', icon: '🚲', category: 'Fitness', difficulty: 'hard', points: 50, notes: 'Zero emission' },
      { name: 'Compost waste', icon: '🌿', category: 'Personal', difficulty: 'medium', points: 25, notes: 'Reduce landfill' }
    ]
  },
  {
    id: 'travel', name: 'Travel Pack', icon: '✈️', color: '#0EA5E9',
    habits: [
      { name: 'Learn local phrase', icon: '🗣️', category: 'Learning', difficulty: 'easy', points: 10, notes: 'Speak local' },
      { name: 'Walk 15k steps', icon: '🚶', category: 'Fitness', difficulty: 'hard', points: 50, notes: 'Explore on foot' },
      { name: 'Try local food', icon: '🍲', category: 'Personal', difficulty: 'easy', points: 10, notes: 'New cuisine' },
      { name: 'Journal the day', icon: '📓', category: 'Personal', difficulty: 'medium', points: 25, notes: 'Record memories' },
      { name: 'Drink safe water', icon: '💧', category: 'Health', difficulty: 'easy', points: 10, notes: 'Stay hydrated safely' }
    ]
  },
  {
    id: 'minimalist', name: 'Minimalist Pack', icon: '🤍', color: '#9CA3AF',
    habits: [
      { name: 'Declutter 1 item', icon: '🗑️', category: 'Personal', difficulty: 'easy', points: 10, notes: 'One less thing' },
      { name: 'Clear inbox', icon: '📧', category: 'Work', difficulty: 'medium', points: 25, notes: 'Inbox zero' },
      { name: 'No shopping today', icon: '🛍️', category: 'Personal', difficulty: 'hard', points: 50, notes: 'Zero spend' },
      { name: 'Clear workspace', icon: '🧹', category: 'Work', difficulty: 'easy', points: 10, notes: 'Empty desk' },
      { name: '10 min silence', icon: '🧘', category: 'Health', difficulty: 'medium', points: 25, notes: 'Mental declutter' }
    ]
  },
  {
    id: 'stoic', name: 'Stoic Pack', icon: '🏛️', color: '#4B5563',
    habits: [
      { name: 'Morning reflection', icon: '🌅', category: 'Personal', difficulty: 'medium', points: 25, notes: 'Prep for day' },
      { name: 'Evening review', icon: '🌙', category: 'Personal', difficulty: 'medium', points: 25, notes: 'Review actions' },
      { name: 'Cold exposure', icon: '🥶', category: 'Health', difficulty: 'hard', points: 50, notes: 'Cold shower' },
      { name: 'Read philosophy', icon: '📚', category: 'Learning', difficulty: 'medium', points: 25, notes: '10 pages' },
      { name: 'Acceptance practice', icon: '🙏', category: 'Personal', difficulty: 'hard', points: 50, notes: 'Amor Fati' }
    ]
  },
  {
    id: 'mental_toughness', name: 'Mental Toughness', icon: '🧠', color: '#1F2937',
    habits: [
      { name: 'Do hard thing first', icon: '🐸', category: 'Work', difficulty: 'hard', points: 50, notes: 'Eat the frog' },
      { name: 'No complaining', icon: '🤐', category: 'Personal', difficulty: 'extreme', points: 100, notes: 'Zero complaints' },
      { name: 'Push past comfort', icon: '🔥', category: 'Personal', difficulty: 'hard', points: 50, notes: '1 extra rep/minute' },
      { name: 'Delay gratification', icon: '⏳', category: 'Personal', difficulty: 'medium', points: 25, notes: 'Wait 10 mins' },
      { name: 'Face a fear', icon: '🦁', category: 'Personal', difficulty: 'extreme', points: 100, notes: 'Micro bravery' }
    ]
  },
  {
    id: 'remote', name: 'Remote Worker', icon: '🏡', color: '#3B82F6',
    habits: [
      { name: 'Start at same time', icon: '⏰', category: 'Work', difficulty: 'medium', points: 25, notes: 'Routine start' },
      { name: 'Dress for work', icon: '👔', category: 'Personal', difficulty: 'easy', points: 10, notes: 'No pyjamas' },
      { name: 'Take lunch break', icon: '🥪', category: 'Health', difficulty: 'medium', points: 25, notes: 'Away from desk' },
      { name: 'Overcommunicate', icon: '💬', category: 'Work', difficulty: 'medium', points: 25, notes: 'Keep team updated' },
      { name: 'Hard stop at 6PM', icon: '🛑', category: 'Work', difficulty: 'hard', points: 50, notes: 'Close laptop' }
    ]
  },
  {
    id: 'pet', name: 'Pet Owner', icon: '🐾', color: '#F59E0B',
    habits: [
      { name: 'Morning walk', icon: '🐕', category: 'Health', difficulty: 'medium', points: 25, notes: '20 mins minimum' },
      { name: 'Play session', icon: '🎾', category: 'Personal', difficulty: 'easy', points: 10, notes: '15 mins play' },
      { name: 'Grooming', icon: '🪮', category: 'Personal', difficulty: 'medium', points: 25, notes: 'Brush/clean' },
      { name: 'Training 5 mins', icon: '🎯', category: 'Learning', difficulty: 'medium', points: 25, notes: 'New trick/reinforce' },
      { name: 'Clean bowls/litter', icon: '🧼', category: 'Personal', difficulty: 'easy', points: 10, notes: 'Hygiene' }
    ]
  },
  {
    id: 'garden', name: 'Gardening Pack', icon: '🪴', color: '#10B981',
    habits: [
      { name: 'Water plants', icon: '🚿', category: 'Personal', difficulty: 'easy', points: 10, notes: 'Check moisture' },
      { name: 'Weeding 10 mins', icon: '🌿', category: 'Personal', difficulty: 'medium', points: 25, notes: 'Keep it clean' },
      { name: 'Pruning', icon: '✂️', category: 'Personal', difficulty: 'medium', points: 25, notes: 'Remove dead leaves' },
      { name: 'Compost check', icon: '🍂', category: 'Personal', difficulty: 'easy', points: 10, notes: 'Turn or add' },
      { name: 'Sunlight check', icon: '☀️', category: 'Personal', difficulty: 'easy', points: 10, notes: 'Rotate indoor plants' }
    ]
  },
  {
    id: 'leadership', name: 'Leadership Pack', icon: '👑', color: '#8B5CF6',
    habits: [
      { name: 'Praise a team member', icon: '👏', category: 'Work', difficulty: 'medium', points: 25, notes: 'Public or private' },
      { name: 'Read leadership book', icon: '📚', category: 'Learning', difficulty: 'medium', points: 25, notes: '10 pages' },
      { name: 'Listen actively', icon: '👂', category: 'Work', difficulty: 'hard', points: 50, notes: 'No interrupting' },
      { name: 'Review vision', icon: '🔭', category: 'Work', difficulty: 'easy', points: 10, notes: 'Align goals' },
      { name: 'Mentor someone', icon: '🤝', category: 'Work', difficulty: 'hard', points: 50, notes: 'Share knowledge' }
    ]
  },
  {
    id: 'wealth', name: 'Wealth Building', icon: '💎', color: '#059669',
    habits: [
      { name: 'Review net worth', icon: '📊', category: 'Personal', difficulty: 'easy', points: 10, notes: 'Weekly check' },
      { name: 'No spend day', icon: '🚫', category: 'Personal', difficulty: 'hard', points: 50, notes: 'Zero non-essentials' },
      { name: 'Learn market trend', icon: '📈', category: 'Learning', difficulty: 'medium', points: 25, notes: '15 mins research' },
      { name: 'Side hustle 1hr', icon: '💼', category: 'Work', difficulty: 'hard', points: 50, notes: 'Build extra income' },
      { name: 'Read business news', icon: '📰', category: 'Learning', difficulty: 'easy', points: 10, notes: 'Stay informed' }
    ]
  },
  {
    id: 'speaking', name: 'Public Speaking', icon: '🎙️', color: '#EC4899',
    habits: [
      { name: 'Vocal warmups', icon: '🗣️', category: 'Personal', difficulty: 'medium', points: 25, notes: '5 mins daily' },
      { name: 'Record self speaking', icon: '📱', category: 'Learning', difficulty: 'hard', points: 50, notes: '2 mins impromptu' },
      { name: 'Watch TED talk', icon: '📺', category: 'Learning', difficulty: 'easy', points: 10, notes: 'Analyze delivery' },
      { name: 'Practice gestures', icon: '👋', category: 'Learning', difficulty: 'medium', points: 25, notes: 'Mirror work' },
      { name: 'Eliminate filler words', icon: '🚫', category: 'Personal', difficulty: 'extreme', points: 100, notes: 'No umms/ahhs' }
    ]
  },
  {
    id: 'creator', name: 'Content Creator', icon: '📸', color: '#F43F5E',
    habits: [
      { name: 'Post content', icon: '📱', category: 'Work', difficulty: 'medium', points: 25, notes: 'Daily upload' },
      { name: 'Write 3 ideas', icon: '💡', category: 'Work', difficulty: 'easy', points: 10, notes: 'Brainstorm' },
      { name: 'Engage with audience', icon: '💬', category: 'Work', difficulty: 'medium', points: 25, notes: 'Reply to comments' },
      { name: 'Study hook hooks', icon: '🎣', category: 'Learning', difficulty: 'medium', points: 25, notes: 'Analyze what works' },
      { name: 'Script a video', icon: '📝', category: 'Work', difficulty: 'hard', points: 50, notes: 'Draft content' }
    ]
  }
];

const difficultyColors = {
  easy: '#10B981',
  medium: '#F59E0B',
  hard: '#EF4444',
  extreme: '#7C3AED',
};

const generateHabitFromSearch = (query) => {
  const words = query.toLowerCase().split(' ');
  const categories = {
    health: ['health', 'water', 'sleep', 'medicine', 'doctor', 'gym', 'diet', 'food', 'eat'],
    fitness: ['workout', 'run', 'exercise', 'walk', 'swim', 'sport', 'yoga', 'gym', 'cardio'],
    work: ['work', 'email', 'meeting', 'project', 'code', 'study', 'learn', 'job'],
    personal: ['journal', 'read', 'meditate', 'family', 'friend', 'hobby', 'play', 'game'],
    learning: ['learn', 'study', 'read', 'book', 'course', 'language'],
  };
  
  let category = 'Personal';
  for (const [cat, keywords] of Object.entries(categories)) {
    if (keywords.some(k => words.some(w => w.includes(k)))) {
      category = cat.charAt(0).toUpperCase() + cat.slice(1);
      break;
    }
  }
  
  let difficulty = 'medium';
  let points = 25;
  if (words.some(w => ['easy', 'simple', 'quick', 'daily'].includes(w))) {
    difficulty = 'easy';
    points = 10;
  } else if (words.some(w => ['hard', 'difficult', 'challenge', 'extreme'].includes(w))) {
    difficulty = 'hard';
    points = 50;
  }
  
  const iconMap = {
    run: '🏃', read: '📚', write: '✍️', 
    meditate: '🧘', water: '💧', code: '💻',
    gym: '🏋️', swim: '🏊', cook: '🍳',
    music: '🎵', draw: '✏️', play: '🎮',
    call: '📞', drink: '💧', eat: '🍽️', sleep: '😴'
  };
  
  let icon = '⭐';
  for (const [keyword, emoji] of Object.entries(iconMap)) {
    if (words.some(w => w.includes(keyword))) {
      icon = emoji;
      break;
    }
  }
  
  return {
    name: query.charAt(0).toUpperCase() + query.slice(1),
    icon,
    category,
    difficulty,
    points,
    notes: `Custom habit: ${query}`,
    isGenerated: true
  };
};

const HabitTemplates = ({ onAddTemplate, currentHabitsCount = 0 }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPack, setExpandedPack] = useState(null);
  const navigate = useNavigate();
  const pro = isPro();
  const elite = isElite();
  const maxAllowed = getMaxHabits();
  const allPacks = elite ? [...TEMPLATE_PACKS, ...ELITE_HABIT_PACKS] : TEMPLATE_PACKS;
  
  const getAccessiblePackCount = () => {
    if (elite) return 45;
    if (pro) return 30;
    return 3;
  };
  
  const accessibleCount = getAccessiblePackCount();
  const allowedPacks = allPacks;
  
  const isPackAccessible = (index) => index < accessibleCount;

  const searchResults = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return { found: [], generated: null };
    
    const query = searchQuery.toLowerCase();
    const results = [];
    
    allowedPacks.forEach(pack => {
      pack.habits.forEach(habit => {
        if (habit.name.toLowerCase().includes(query) || 
            query.includes(habit.name.toLowerCase()) ||
            pack.name.toLowerCase().includes(query)) {
          results.push({ ...habit, packName: pack.name, packColor: pack.color });
        }
      });
    });
    
    if (results.length < 2) {
      const generated = generateHabitFromSearch(searchQuery);
      return { found: results.slice(0, 10), generated };
    }
    
    return { found: results.slice(0, 10), generated: null };
  }, [searchQuery]);

  const addHabit = (habit, packName = null) => {
    if (currentHabitsCount >= maxAllowed) {
      toast.error(`Habit limit reached! Upgrade to add more.`);
      return;
    }
    const newHabit = {
      id: uuidv4(),
      name: habit.name,
      icon: habit.icon,
      category: habit.category,
      difficulty: habit.difficulty,
      notes: habit.notes || '',
      priority: 'Medium',
      points: habit.points || 25,
      isActive: true,
      createdAt: getTodayISO(),
      completionLog: {},
      currentStreak: 0,
      longestStreak: 0,
    };
    onAddTemplate([newHabit]);
    toast.success(`✓ Added: ${habit.name}${packName ? ` from ${packName}` : ''}`);
  };

  const addAllFromPack = (pack) => {
    if (currentHabitsCount + pack.habits.length > maxAllowed) {
      toast.error(`Cannot add ${pack.habits.length} habits. It exceeds your limit!`);
      return;
    }
    const newHabits = pack.habits.map(habit => ({
      id: uuidv4(),
      name: habit.name,
      icon: habit.icon,
      category: habit.category,
      difficulty: habit.difficulty,
      notes: habit.notes || '',
      priority: 'Medium',
      points: habit.points || 25,
      isActive: true,
      createdAt: getTodayISO(),
      completionLog: {},
      currentStreak: 0,
      longestStreak: 0,
    }));
    onAddTemplate(newHabits);
    toast.success(`✓ Added ${pack.habits.length} habits from ${pack.name}! 🎉`);
  };

  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: 'var(--text)' }}>
          Habit Templates ({allowedPacks.length} packs)
        </h3>
        <div style={{
          padding: '6px 12px',
          background: currentHabitsCount >= maxAllowed ? '#EF444420' : '#10B98120',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: 600,
          color: currentHabitsCount >= maxAllowed ? '#EF4444' : '#10B981'
        }}>
          {currentHabitsCount}/{maxAllowed} habits used
          {!pro && ' (Free Plan)'}
        </div>
      </div>
      
      <div style={{ position: 'relative', marginBottom: '16px' }}>
        <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px' }}>🔍</span>
        <input
          type="text"
          placeholder="Search habits or describe what you want..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 40px 12px 40px',
            borderRadius: '10px',
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            color: 'var(--text)',
            fontSize: '14px',
            outline: 'none',
          }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            ✕
          </button>
        )}
      </div>

      {searchQuery.length >= 2 && (
        <div style={{ marginBottom: '16px', padding: '12px', background: 'var(--surface)', borderRadius: '10px', border: '1px solid var(--border)' }}>
          {searchResults.generated ? (
            <div>
              <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#F59E0B' }}>
                No habits found for '{searchQuery}' — Generating with AI... ✨
              </p>
              <div style={{ display: 'flex', alignItems: 'center', padding: '10px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px' }}>
                <span style={{ fontSize: '20px', marginRight: '10px' }}>{searchResults.generated.icon}</span>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)' }}>{searchResults.generated.name}</span>
                  <span style={{ marginLeft: '8px', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: difficultyColors[searchResults.generated.difficulty] + '20', color: difficultyColors[searchResults.generated.difficulty], fontWeight: 600 }}>
                    {searchResults.generated.difficulty}
                  </span>
                  <span style={{ marginLeft: '4px', fontSize: '10px', color: '#10B981', fontWeight: 600 }}>
                    +{searchResults.generated.points} pts
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addHabit(searchResults.generated)}
                  style={{
                    background: '#10B981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Add
                </motion.button>
              </div>
            </div>
          ) : (
            <div>
              <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
                Showing {searchResults.found.length} results for '{searchQuery}'
              </p>
              {searchResults.found.map((habit, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', padding: '8px', borderBottom: idx < searchResults.found.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <span style={{ fontSize: '18px', marginRight: '10px' }}>{habit.icon}</span>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)' }}>{habit.name}</span>
                    <span style={{ marginLeft: '6px', fontSize: '11px', color: 'var(--text-secondary)' }}>in {habit.packName}</span>
                    <span style={{ marginLeft: '6px', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: difficultyColors[habit.difficulty] + '20', color: difficultyColors[habit.difficulty], fontWeight: 600 }}>
                      {habit.difficulty}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => addHabit(habit, habit.packName)}
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--border)',
                      borderRadius: '6px',
                      width: '28px',
                      height: '28px',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    +
                  </motion.button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div style={{
        display: 'grid',
gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '8px',
      }}>
        {allowedPacks.map((pack, index) => {
          const isAccessible = isPackAccessible(index);
          return (
            <motion.div
              key={pack.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                border: `1px solid ${isAccessible ? pack.color + '33' : '#9CA3AF33'}`,
                borderRadius: '12px',
                overflow: 'hidden',
                background: isAccessible ? pack.color + '14' : '#9CA3AF14',
                opacity: isAccessible ? 1 : 0.7,
                position: 'relative',
              }}
            >
              {!isAccessible && (
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  background: '#EF4444',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: 600,
                  zIndex: 10,
                }}>
                  🔒 LOCKED
                </div>
              )}
              <div
                style={{
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                }}
                onClick={() => isAccessible && setExpandedPack(expandedPack === pack.id ? null : pack.id)}
              >
                <span style={{ fontSize: '22px' }}>{pack.icon}</span>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a1a' }}>
                    {pack.name}
                  </span>
                </div>
                <span style={{ fontSize: '11px', color: '#666' }}>5 habits</span>
                {(() => {
                  const remaining = maxAllowed - currentHabitsCount;
                  const canAdd = isAccessible && remaining >= pack.habits.length;
                  return (
                    <motion.button
                      whileHover={canAdd ? { scale: 1.05 } : {}}
                      whileTap={canAdd ? { scale: 0.95 } : {}}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isAccessible) {
                          navigate('/upgrade');
                          return;
                        }
                        addAllFromPack(pack);
                      }}
                      disabled={!canAdd}
                      style={{
                        background: canAdd ? pack.color : '#9CA3AF',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '5px 10px',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: canAdd ? 'pointer' : 'not-allowed',
                      }}
                    >
                      {canAdd ? 'Add All' : (isAccessible ? 'Limit Reached' : 'Locked')}
                    </motion.button>
                  );
                })()}
                <span style={{ color: '#666', fontSize: '11px' }}>
                  {expandedPack === pack.id ? '▲' : '▼'}
                </span>
              </div>
              
              <AnimatePresence>
                {expandedPack === pack.id && isAccessible && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ padding: '0 12px 12px' }}>
                      {pack.habits.map((habit, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '8px 0',
                            borderBottom: idx < pack.habits.length - 1 ? '1px solid var(--border)' : 'none',
                          }}
                        >
                          <span style={{ fontSize: '16px', marginRight: '8px' }}>{habit.icon}</span>
                          <div style={{ flex: 1 }}>
                            <span style={{ fontSize: '13px', color: 'var(--text)' }}>
                              {habit.name}
                            </span>
                          </div>
                          <span style={{ marginRight: '6px', fontSize: '9px', padding: '2px 5px', borderRadius: '3px', background: difficultyColors[habit.difficulty] + '20', color: difficultyColors[habit.difficulty], fontWeight: 600 }}>
                            {habit.difficulty}
                          </span>
                          <span style={{ marginRight: '6px', fontSize: '9px', color: '#10B981', fontWeight: 600 }}>
                            +{habit.points}
                          </span>
                          <motion.button
                            whileHover={{ scale: isAccessible ? 1.1 : 1 }}
                            whileTap={{ scale: isAccessible ? 0.9 : 1 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!isAccessible) {
                                navigate('/upgrade');
                                return;
                              }
                              addHabit(habit, pack.name);
                            }}
                            disabled={!isAccessible}
                            style={{
                              background: isAccessible ? 'transparent' : '#9CA3AF',
                              border: `1px solid ${isAccessible ? 'var(--border)' : '#9CA3AF'}`,
                              borderRadius: '5px',
                              width: '24px',
                              height: '24px',
                              cursor: isAccessible ? 'pointer' : 'not-allowed',
                              fontSize: '12px',
                              opacity: isAccessible ? 1 : 0.5,
                            }}
                          >
                            {isAccessible ? '+' : '🔒'}
                          </motion.button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {!elite && pro && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginTop: '24px',
            padding: '24px',
            background: 'linear-gradient(135deg, #BA751711, #f59e0b11)',
            border: '1px solid #BA751733',
            borderRadius: '16px',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>👑</div>
          <h4 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', margin: '0 0 8px 0' }}>
            Unlock Elite Exclusive Habit Packs
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '0 0 20px 0' }}>
            Get access to advanced packs like CEO Morning Protocol, Navy SEAL Discipline, and more!
          </p>
          <button
            onClick={() => navigate('/upgrade')}
            style={{
              background: 'linear-gradient(135deg, #BA7517, #f59e0b)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Upgrade to Elite
          </button>
        </motion.div>
      )}

      {!pro && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginTop: '24px',
            padding: '24px',
            background: 'linear-gradient(135deg, #534AB711, #8b5cf611)',
            border: '1px solid #534AB733',
            borderRadius: '16px',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>💎</div>
          <h4 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', margin: '0 0 8px 0' }}>
            Upgrade to Pro for Unlimited Habits
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '0 0 20px 0' }}>
            You're on the FREE plan with limit of {maxAllowed} habits. Upgrade to Pro for unlimited habits and more features!
          </p>
          <button
            onClick={() => navigate('/upgrade')}
            style={{
              background: 'linear-gradient(135deg, #534AB7, #8b5cf6)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Upgrade to Pro
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default HabitTemplates;
