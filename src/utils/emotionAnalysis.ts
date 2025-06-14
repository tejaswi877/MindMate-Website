
export const analyzeEmotion = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  // Crisis keywords - highest priority
  const crisisKeywords = ['suicide', 'kill myself', 'end it all', 'hurt myself', 'self harm', 'want to die', 'no point', 'give up'];
  if (crisisKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'crisis';
  }

  // Anxiety keywords
  const anxietyKeywords = ['anxious', 'anxiety', 'worried', 'panic', 'nervous', 'scared', 'fear', 'stress', 'overwhelmed', 'tense'];
  if (anxietyKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'anxiety';
  }

  // Depression keywords
  const depressionKeywords = ['depressed', 'depression', 'sad', 'hopeless', 'empty', 'worthless', 'lonely', 'numb', 'dark', 'heavy'];
  if (depressionKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'depression';
  }

  // Anger keywords
  const angerKeywords = ['angry', 'mad', 'furious', 'rage', 'irritated', 'frustrated', 'annoyed', 'pissed'];
  if (angerKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'anger';
  }

  // Positive keywords
  const positiveKeywords = ['happy', 'good', 'great', 'excellent', 'wonderful', 'amazing', 'fantastic', 'grateful', 'thankful', 'blessed', 'joy'];
  if (positiveKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'positive';
  }

  // Coping request keywords
  const copingKeywords = ['help', 'tips', 'advice', 'strategies', 'coping', 'cope', 'what can i do', 'how to', 'support'];
  if (copingKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'coping';
  }

  // Sleep keywords
  const sleepKeywords = ['sleep', 'insomnia', 'tired', 'exhausted', 'can\'t sleep', 'sleepless'];
  if (sleepKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'sleep';
  }

  return 'neutral';
};
