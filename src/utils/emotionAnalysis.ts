
export const analyzeEmotion = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  // Website/app related queries - highest priority for user support
  const websiteKeywords = [
    'how to use', 'how do i', 'what is', 'what does', 'benefits', 'features', 
    'help me', 'guide', 'tutorial', 'explain', 'dashboard', 'mood tracker', 
    'journal', 'breathing', 'badges', 'reminders', 'crisis support',
    'mindmate', 'app', 'website', 'platform', 'tool', 'function'
  ];
  if (websiteKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'website_help';
  }

  // Crisis keywords - second highest priority
  const crisisKeywords = [
    'suicide', 'kill myself', 'end it all', 'hurt myself', 'self harm', 
    'want to die', 'no point', 'give up', 'can\'t go on', 'worthless life'
  ];
  if (crisisKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'crisis';
  }

  // Anxiety keywords
  const anxietyKeywords = [
    'anxious', 'anxiety', 'worried', 'panic', 'nervous', 'scared', 'fear', 
    'stress', 'overwhelmed', 'tense', 'racing thoughts', 'can\'t breathe', 
    'heart racing', 'sweating', 'shaking'
  ];
  if (anxietyKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'anxiety';
  }

  // Depression keywords
  const depressionKeywords = [
    'depressed', 'depression', 'sad', 'hopeless', 'empty', 'worthless', 
    'lonely', 'numb', 'dark', 'heavy', 'tired of life', 'no energy', 
    'can\'t sleep', 'sleeping too much'
  ];
  if (depressionKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'depression';
  }

  // Anger keywords
  const angerKeywords = [
    'angry', 'mad', 'furious', 'rage', 'irritated', 'frustrated', 
    'annoyed', 'pissed', 'hate', 'can\'t stand'
  ];
  if (angerKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'anger';
  }

  // Positive keywords
  const positiveKeywords = [
    'happy', 'good', 'great', 'excellent', 'wonderful', 'amazing', 
    'fantastic', 'grateful', 'thankful', 'blessed', 'joy', 'excited', 'proud'
  ];
  if (positiveKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'positive';
  }

  // Coping request keywords
  const copingKeywords = [
    'help', 'tips', 'advice', 'strategies', 'coping', 'cope', 'what can i do', 
    'how to', 'support', 'manage', 'deal with', 'handle', 'get through'
  ];
  if (copingKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'coping';
  }

  // Sleep keywords
  const sleepKeywords = [
    'sleep', 'insomnia', 'tired', 'exhausted', 'can\'t sleep', 'sleepless', 
    'nightmares', 'restless', 'fatigue'
  ];
  if (sleepKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'sleep';
  }

  return 'neutral';
};
