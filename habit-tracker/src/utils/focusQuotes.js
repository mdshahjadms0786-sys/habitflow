export const FOCUS_QUOTES = {
  health: [
    { text: "Your body can do it. Now convince your mind.", author: "Unknown" },
    { text: "Health is not about weight. It's about strength.", author: "Unknown" },
    { text: "Take care of your body. It's the only place you have to live.", author: "Jim Rohn" },
    { text: "A healthy mind needs a healthy body.", author: "Unknown" },
    { text: "The greatest wealth is health.", author: "Virgil" },
    { text: "Take care of your body. It's the only place you have to live.", author: "Jim Rohn" },
    { text: "Wellness is the mind-body connection.", author: "Unknown" },
    { text: "Health is the condition of wisdom.", author: "Plato" },
    { text: "An apple a day keeps the doctor away.", author: "Proverb" },
    { text: "Listen to your body. It knows what it needs.", author: "Unknown" }
  ],
  work: [
    { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
    { text: "The key to success is to focus.", author: "Jack Canfield" },
    { text: "Work hard at your job and you'll be rewarded.", author: "Unknown" },
    { text: "Productivity is never an accident.", author: "Paul J. Meyer" },
    { text: "Do the work. Every single day.", author: "Unknown" },
    { text: "Your future self will thank you.", author: "Unknown" },
    { text: "Excellence is not a skill. It's an attitude.", author: "Ralph Marston" },
    { text: "Success is the sum of small efforts.", author: "Unknown" },
    { text: "Don't watch the clock. Do what it does.", author: "Unknown" },
    { text: "Stay focused and keep working.", author: "Unknown" }
  ],
  personal: [
    { text: "Be who you are meant to be.", author: "Unknown" },
    { text: "Your only limit is you.", author: "Unknown" },
    { text: "Growth happens outside your comfort zone.", author: "Unknown" },
    { text: "The best time to start was yesterday. The next best is now.", author: "Unknown" },
    { text: "You are enough just as you are.", author: "Unknown" },
    { text: "Every day is a new beginning.", author: "Unknown" },
    { text: "Small steps lead to big changes.", author: "Unknown" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "Your potential is unlimited.", author: "Unknown" },
    { text: "Embrace the journey.", author: "Unknown" }
  ],
  fitness: [
    { text: "Strength does not come from physical capacity.", author: "George Everett" },
    { text: "The only bad workout is the one that didn't happen.", author: "Unknown" },
    { text: "Your body hears what your mind says.", author: "Unknown" },
    { text: "Sore today, strong tomorrow.", author: "Unknown" },
    { text: "Champions are made when no one is watching.", author: "Unknown" },
    { text: "Push yourself because no one else will.", author: "Unknown" },
    { text: "The pain you feel today will be the strength you feel tomorrow.", author: "Unknown" },
    { text: "Don't stop when you're tired. Stop when you're done.", author: "Unknown" },
    { text: "Your only limit is your mind.", author: "Unknown" },
    { text: "Make yourself proud.", author: "Unknown" }
  ],
  learning: [
    { text: "Learning is not attained by chance, it must be sought.", author: "Abigail Adams" },
    { text: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
    { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
    { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
    { text: "The mind is not a vessel to be filled but a fire to be kindled.", author: "Plutarch" },
    { text: "Education is the passport to the future.", author: "Malcolm X" },
    { text: "Never stop learning because life never stops teaching.", author: "Unknown" },
    { text: "Reading is to the mind what exercise is to the body.", author: "Unknown" },
    { text: "Smart people like to learn. Stupid people like to teach.", author: "Unknown" },
    { text: "Learn from yesterday, live for today.", author: "Unknown" }
  ],
  default: [
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "It's not about having time, it's about making time.", author: "Unknown" },
    { text: "Don't wait for inspiration. Just start.", author: "Unknown" },
    { text: "Your only limit is you.", author: "Unknown" },
    { text: "Progress, not perfection.", author: "Unknown" },
    { text: "You are stronger than you think.", author: "Unknown" },
    { text: "One day or day one. You decide.", author: "Unknown" },
    { text: "Small steps every day.", author: "Unknown" },
    { text: "Focus on the step in front of you.", author: "Unknown" },
    { text: "Start where you are. Use what you have.", author: "Unknown" }
  ]
};

export const getQuoteForHabit = (category = 'default') => {
  const quotes = FOCUS_QUOTES[category] || FOCUS_QUOTES.default;
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
};

export const getNextQuote = (category = 'default', currentIndex = -1) => {
  const quotes = FOCUS_QUOTES[category] || FOCUS_QUOTES.default;
  const nextIndex = (currentIndex + 1) % quotes.length;
  return quotes[nextIndex];
};

export default { FOCUS_QUOTES, getQuoteForHabit, getNextQuote };