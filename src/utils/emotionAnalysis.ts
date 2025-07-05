export const detectEmotion = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  // Crisis keywords - highest priority
  const crisisKeywords = ['suicide', 'kill myself', 'end it all', 'hurt myself', 'self harm', 'want to die', 'no point', 'give up', 'can\'t go on', 'end my life'];
  if (crisisKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'crisis';
  }

  // Specific feature questions - new category
  const featurePatterns = [
    // Chat feature
    /how (does|do) (chat|chatbot|ai chat|mindmate chat) work/,
    /tell me about (chat|chatbot|ai chat)/,
    /what is (chat|chatbot|ai chat)/,
    /explain (chat|chatbot|ai chat)/,
    
    // Mood tracking
    /how (does|do) mood (tracking|tracker) work/,
    /tell me about mood (tracking|tracker)/,
    /what is mood (tracking|tracker)/,
    /explain mood (tracking|tracker)/,
    
    // Journal feature
    /how (does|do) (journal|journaling) work/,
    /tell me about (journal|journaling)/,
    /what is (journal|journaling)/,
    /explain (journal|journaling)/,
    
    // Breathing games
    /how (does|do) breathing (games|exercises) work/,
    /tell me about breathing (games|exercises)/,
    /what is breathing (games|exercises)/,
    /explain breathing (games|exercises)/,
    
    // Badges/achievements
    /how (does|do) (badges|achievements) work/,
    /tell me about (badges|achievements)/,
    /what (are|is) (badges|achievements)/,
    /explain (badges|achievements)/,
    
    // Reminders
    /how (does|do) reminders work/,
    /tell me about reminders/,
    /what (are|is) reminders/,
    /explain reminders/,
    
    // Progress tracking
    /how (does|do) progress (tracking|analytics) work/,
    /tell me about progress (tracking|analytics)/,
    /what is progress (tracking|analytics)/,
    /explain progress (tracking|analytics)/,
    
    // Crisis support
    /how (does|do) crisis support work/,
    /tell me about crisis support/,
    /what is crisis support/,
    /explain crisis support/
  ];
  
  if (featurePatterns.some(pattern => pattern.test(lowerMessage))) {
    return 'specific_feature';
  }

  // Website/general features questions - expanded patterns
  const websitePatterns = [
    /what is (this|mindmate)/,
    /how (does|do) (this|it|mindmate) work/,
    /how to use/,
    /what can (you|this|mindmate) do/,
    /what are (your|mindmate|the) (features|capabilities)/,
    /help with (website|app|mindmate)/,
    /tell me about (this|mindmate)/,
    /what services/,
    /mindmate features/,
    /app features/,
    /explain (mindmate|features)/,
    /what is available/,
    /show me features/,
    /list features/,
    /all features/
  ];
  
  if (websitePatterns.some(pattern => pattern.test(lowerMessage))) {
    return 'website_help';
  }

  // Coping strategies requests
  const copingPatterns = [
    /how to (reduce|manage|cope with|deal with|handle) (stress|anxiety|depression|anger|sadness|worry)/,
    /coping (strategies|techniques|methods|skills)/,
    /stress (relief|management|reduction)/,
    /anxiety (relief|help|techniques)/,
    /relaxation (techniques|methods)/,
    /breathing (exercises|techniques)/,
    /mindfulness/,
    /meditation/,
    /grounding (techniques|exercises)/,
    /self care/,
    /how to feel better/,
    /ways to (relax|calm down|unwind)/,
    /mental health (tips|strategies)/,
    /emotional (regulation|coping)/
  ];

  if (copingPatterns.some(pattern => pattern.test(lowerMessage))) {
    return 'coping_strategies';
  }

  // Situational questions
  const situationalPatterns = [
    /(what should i do|help me) (when|if)/,
    /having trouble (with|at)/,
    /difficult (situation|time|relationship)/,
    /problem (with|at) (work|school|home|relationship)/,
    /conflict (with|at)/,
    /struggling (with|at)/,
    /advice (for|about)/,
    /how to handle/,
    /dealing with/,
    /going through/,
    /facing (challenges|problems)/,
    /need guidance/
  ];

  if (situationalPatterns.some(pattern => pattern.test(lowerMessage))) {
    return 'situational_help';
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

  // Negative emotion patterns
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

// Keep the old function name as alias for backward compatibility
export const analyzeEmotion = detectEmotion;
