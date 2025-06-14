
export const analyzeEmotion = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  // Crisis keywords - highest priority
  const crisisKeywords = [
    'suicide', 'kill myself', 'end it all', 'hurt myself', 'self harm', 
    'want to die', 'no point', 'give up', 'end my life', 'not worth living',
    'better off dead', 'suicidal thoughts', 'kill me', 'want to disappear',
    'can\'t go on', 'nothing matters', 'worthless', 'hopeless'
  ];
  if (crisisKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'crisis';
  }

  // Coping request keywords - specific request for help
  const copingKeywords = [
    'coping strategies', 'coping tips', 'help me cope', 'how to cope',
    'coping mechanisms', 'stress management', 'anxiety tips', 'depression help',
    'breathing exercises', 'relaxation techniques', 'mindfulness', 'meditation',
    'grounding techniques', 'what should i do', 'how can i feel better',
    'need advice', 'help with', 'strategies for', 'techniques for',
    'give me tips', 'show me ways', 'teach me how', 'need tools'
  ];
  if (copingKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'coping';
  }

  // Anxiety keywords
  const anxietyKeywords = [
    'anxious', 'anxiety', 'worried', 'panic', 'nervous', 'scared', 'fear', 
    'stress', 'overwhelmed', 'tense', 'restless', 'on edge', 'panic attack',
    'heart racing', 'can\'t breathe', 'sweating', 'shaking', 'racing thoughts',
    'butterflies', 'jittery', 'uneasy', 'freaking out'
  ];
  if (anxietyKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'anxiety';
  }

  // Depression keywords
  const depressionKeywords = [
    'depressed', 'depression', 'sad', 'hopeless', 'empty', 'worthless', 
    'lonely', 'numb', 'dark', 'heavy', 'exhausted', 'no energy', 'can\'t sleep',
    'sleeping too much', 'no motivation', 'don\'t care', 'feel nothing',
    'crying', 'tears', 'down', 'low', 'blue', 'miserable'
  ];
  if (depressionKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'depression';
  }

  // Anger keywords
  const angerKeywords = [
    'angry', 'mad', 'furious', 'rage', 'irritated', 'frustrated', 'annoyed', 
    'pissed', 'hate', 'can\'t stand', 'sick of', 'fed up', 'outraged',
    'livid', 'fuming', 'steaming', 'boiling'
  ];
  if (angerKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'anger';
  }

  // Positive keywords
  const positiveKeywords = [
    'happy', 'good', 'great', 'excellent', 'wonderful', 'amazing', 'fantastic', 
    'grateful', 'thankful', 'blessed', 'joy', 'excited', 'love', 'peaceful',
    'content', 'accomplished', 'proud', 'optimistic', 'hopeful', 'cheerful',
    'delighted', 'thrilled', 'elated'
  ];
  if (positiveKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'positive';
  }

  // Sleep issues
  const sleepKeywords = [
    'sleep', 'insomnia', 'tired', 'exhausted', 'can\'t sleep', 'sleepless',
    'nightmares', 'restless sleep', 'wake up', 'trouble sleeping', 'sleepy'
  ];
  if (sleepKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'sleep';
  }

  // Check for negative sentiment
  const negativeKeywords = [
    'bad', 'terrible', 'awful', 'horrible', 'worst', 'hate', 'sucks',
    'disappointed', 'upset', 'hurt', 'pain', 'struggling', 'difficult',
    'tough', 'hard', 'rough', 'challenging'
  ];
  if (negativeKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'negative';
  }

  return 'neutral';
};
