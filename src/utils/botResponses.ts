
interface BotResponse {
  response: string;
  followUp?: string;
}

const greetingMessages = [
  "Hello! I'm MindMate, your mental health companion. How are you feeling today?",
  "Hi there! I'm here to support you. What's on your mind?",
  "Welcome! I'm MindMate. How can I help you today?",
  "Hello! Ready to check in with yourself? How are you doing?",
  "Hi! I'm your wellness companion. What would you like to talk about?"
];

const positiveResponses = [
  "That's wonderful to hear! 😊",
  "I'm so glad you're feeling good!",
  "That sounds really positive! 🌟",
  "Great to hear! Keep that energy going!",
  "Fantastic! What's been going well for you?"
];

const anxietyResponses = [
  "I hear that you're feeling anxious. That's completely valid.",
  "Anxiety can be tough. Let's work through this together.",
  "Thank you for sharing. Anxiety is very common and manageable.",
  "I'm here to help with your anxiety. You're not alone.",
  "Let's take this one step at a time. Deep breaths can help."
];

const sadResponses = [
  "I'm sorry you're feeling this way. Your feelings matter.",
  "It's okay to feel sad sometimes. I'm here to listen.",
  "Thank you for trusting me with how you're feeling.",
  "Sadness is a natural emotion. You're being brave by sharing.",
  "I hear you. Sometimes we need to sit with difficult feelings."
];

const stressResponses = [
  "Stress can be overwhelming. Let's find ways to manage it.",
  "I understand you're feeling stressed. That's really common.",
  "Stress affects us all. What's been weighing on you?",
  "Let's work on some stress relief techniques together.",
  "It's important to address stress. You're taking the right step."
];

const angerResponses = [
  "Anger is a valid emotion. Let's explore what's behind it.",
  "I hear your frustration. It's okay to feel angry sometimes.",
  "Thank you for sharing your anger with me. That takes courage.",
  "Anger often signals something important. What triggered this?",
  "Let's find healthy ways to process these angry feelings."
];

const crisisKeywords = [
  'suicide', 'kill myself', 'end it all', 'not worth living', 'want to die',
  'harm myself', 'hurt myself', 'can\'t go on', 'no point', 'give up'
];

const featuresResponses = {
  mood: "The mood tracker helps you log daily emotions and see patterns over time.",
  journal: "Your private journal is a safe space to write thoughts and feelings.",
  progress: "Progress shows your wellness journey with charts and insights.",
  badges: "Badges celebrate your wellness milestones and consistency!",
  reminders: "Set personalized reminders for self-care and check-ins.",
  crisis: "Crisis support provides immediate help and emergency contacts."
};

const copingStrategies = [
  "Try the 4-7-8 breathing: inhale for 4, hold for 7, exhale for 8.",
  "Ground yourself: name 5 things you see, 4 you hear, 3 you touch.",
  "Take a short walk or do gentle stretching.",
  "Write down three things you're grateful for today.",
  "Practice progressive muscle relaxation.",
  "Listen to calming music or nature sounds."
];

const supportiveResponses = [
  "You're stronger than you know. I believe in you.",
  "Taking care of your mental health is so important.",
  "Every small step counts in your wellness journey.",
  "It's okay to have difficult days. Tomorrow is a new start.",
  "You deserve support and kindness, especially from yourself.",
  "Progress isn't always linear, and that's perfectly normal."
];

const helpResponses = [
  "I'm here to support your mental wellness journey.",
  "I can help with mood tracking, journaling, or just listening.",
  "Try exploring the different features - mood, journal, or games.",
  "Feel free to share what's on your mind, or ask about app features.",
  "I'm here 24/7 to provide support and guidance."
];

export const getBotResponse = (userMessage: string): BotResponse => {
  const message = userMessage.toLowerCase();
  
  // Check for crisis indicators first
  if (crisisKeywords.some(keyword => message.includes(keyword))) {
    return {
      response: "I'm really concerned about you right now. Please reach out for immediate help.",
      followUp: "Contact a crisis helpline: 988 (US), or visit your nearest emergency room. You matter and help is available."
    };
  }

  // Greeting detection
  if (message.includes('hello') || message.includes('hi') || message.includes('hey') || message === '') {
    return {
      response: greetingMessages[Math.floor(Math.random() * greetingMessages.length)]
    };
  }

  // Positive emotions
  if (message.includes('good') || message.includes('great') || message.includes('happy') || 
      message.includes('excited') || message.includes('wonderful') || message.includes('amazing')) {
    return {
      response: positiveResponses[Math.floor(Math.random() * positiveResponses.length)]
    };
  }

  // Anxiety indicators
  if (message.includes('anxious') || message.includes('worried') || message.includes('nervous') || 
      message.includes('panic') || message.includes('fear')) {
    return {
      response: anxietyResponses[Math.floor(Math.random() * anxietyResponses.length)],
      followUp: copingStrategies[Math.floor(Math.random() * copingStrategies.length)]
    };
  }

  // Sadness indicators
  if (message.includes('sad') || message.includes('depressed') || message.includes('down') || 
      message.includes('hopeless') || message.includes('empty')) {
    return {
      response: sadResponses[Math.floor(Math.random() * sadResponses.length)],
      followUp: "Would you like to try journaling about these feelings?"
    };
  }

  // Stress indicators
  if (message.includes('stress') || message.includes('overwhelmed') || message.includes('pressure') || 
      message.includes('busy') || message.includes('exhausted')) {
    return {
      response: stressResponses[Math.floor(Math.random() * stressResponses.length)],
      followUp: copingStrategies[Math.floor(Math.random() * copingStrategies.length)]
    };
  }

  // Anger indicators
  if (message.includes('angry') || message.includes('mad') || message.includes('frustrated') || 
      message.includes('annoyed') || message.includes('furious')) {
    return {
      response: angerResponses[Math.floor(Math.random() * angerResponses.length)],
      followUp: "Try taking deep breaths or stepping away for a moment."
    };
  }

  // Feature inquiries
  for (const [feature, description] of Object.entries(featuresResponses)) {
    if (message.includes(feature)) {
      return {
        response: description,
        followUp: `Would you like to explore the ${feature} feature now?`
      };
    }
  }

  // Help requests
  if (message.includes('help') || message.includes('support') || message.includes('what can you do')) {
    return {
      response: helpResponses[Math.floor(Math.random() * helpResponses.length)],
      followUp: "What would you like to focus on today?"
    };
  }

  // Gratitude or thanks
  if (message.includes('thank') || message.includes('thanks')) {
    return {
      response: "You're very welcome! I'm here whenever you need support. 💜"
    };
  }

  // Default supportive response
  return {
    response: "I hear you. Thank you for sharing that with me.",
    followUp: "Would you like to talk more about it, or can I help you with something specific?"
  };
};

export const getRandomSupportiveMessage = (): string => {
  return supportiveResponses[Math.floor(Math.random() * supportiveResponses.length)];
};

export const getRandomCopingStrategy = (): string => {
  return copingStrategies[Math.floor(Math.random() * copingStrategies.length)];
};
