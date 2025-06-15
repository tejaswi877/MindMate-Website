
export const analyzeEmotion = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  // Crisis keywords - highest priority
  const crisisKeywords = ['suicide', 'kill myself', 'end it all', 'hurt myself', 'self harm', 'want to die', 'no point', 'give up', 'can\'t go on', 'end my life'];
  if (crisisKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'crisis';
  }

  // Website/feature questions - check early
  const websitePatterns = [
    /what is this/,
    /how (does|do) (this|it|mindmate) work/,
    /how to use/,
    /what can (you|this|mindmate) do/,
    /features/,
    /help with (website|app|mindmate)/,
    /what are your capabilities/,
    /tell me about (this|mindmate)/
  ];
  
  if (websitePatterns.some(pattern => pattern.test(lowerMessage))) {
    return 'website_help';
  }

  // Help/guidance seeking patterns
  const helpPatterns = [
    /need (help|advice|support|guidance)/,
    /what should i do/,
    /how (can|do) i/,
    /any (tips|suggestions|advice)/,
    /help me (with|understand)/,
    /don't know what to do/,
    /looking for (help|advice|tips)/,
    /can you (help|suggest|advise)/
  ];
  
  if (helpPatterns.some(pattern => pattern.test(lowerMessage))) {
    return 'seeking_help';
  }

  // Negative emotion patterns - improved detection
  const negativePatterns = [
    /not feeling (good|well|okay|fine)/,
    /feeling (bad|terrible|awful|horrible|sad|down|low|depressed)/,
    /don't feel (good|well|okay|fine)/,
    /feeling (tired|exhausted|drained|empty)/,
    /can't (handle|cope|deal)/,
    /everything is (wrong|bad|terrible)/,
    /having a (hard|tough|difficult) time/,
    /struggling with/,
    /feel like (giving up|crying|nothing matters)/
  ];
  
  if (negativePatterns.some(pattern => pattern.test(lowerMessage))) {
    return 'depression';
  }

  // Anxiety keywords and patterns
  const anxietyPatterns = [
    /anxious|anxiety|worried|panic|nervous|scared|fear|stress|overwhelmed|tense/,
    /can't (stop|sleep|relax|calm down)/,
    /heart (racing|pounding)/,
    /feel (restless|on edge|jittery)/,
    /what if/,
    /constantly thinking/
  ];
  
  if (anxietyPatterns.some(pattern => pattern.test(lowerMessage))) {
    return 'anxiety';
  }

  // Anger keywords and patterns
  const angerPatterns = [
    /angry|mad|furious|rage|irritated|frustrated|annoyed|pissed/,
    /so (angry|mad|frustrated)/,
    /can't stand/,
    /hate (it|this|everything)/,
    /makes me (angry|mad|furious)/
  ];
  
  if (angerPatterns.some(pattern => pattern.test(lowerMessage))) {
    return 'anger';
  }

  // Positive keywords and patterns
  const positivePatterns = [
    /feeling (good|great|happy|wonderful|amazing|fantastic|blessed)/,
    /having a (good|great|wonderful) (day|time)/,
    /so (happy|excited|grateful|thankful)/,
    /everything is (good|great|going well)/,
    /feel (better|amazing|fantastic|grateful)/
  ];
  
  if (positivePatterns.some(pattern => pattern.test(lowerMessage))) {
    return 'positive';
  }

  return 'neutral';
};
