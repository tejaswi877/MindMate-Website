
import { analyzeEmotion } from './emotionAnalysis';

export const generateBotResponse = (userMessage: string): string => {
  const emotion = analyzeEmotion(userMessage);
  console.log('Detected emotion:', emotion, 'for message:', userMessage);
  
  switch (emotion) {
    case 'crisis':
      return `🚨 I'm really concerned about you right now. Your life has value and you matter deeply. Please reach out for immediate help:

**🔴 IMMEDIATE CRISIS SUPPORT:**
• **National Suicide Prevention Lifeline: 988**
• **Crisis Text Line: Text HOME to 741741**
• **International: iasp.info/resources/Crisis_Centres**

🏥 **If you're in immediate danger, please call emergency services (911) or go to your nearest emergency room.**

💜 You're not alone in this pain. There are people who want to help you through this difficult time. This feeling is temporary, but ending your life is permanent. Please reach out to someone you trust or a crisis helpline right now.

Would you like me to provide some grounding techniques to help you through this moment?`;

    case 'coping':
      const copingResponses = [
        `I'm so glad you're asking for coping strategies! That shows real strength and self-awareness. 💪 Here are some evidence-based techniques:

**🌬️ IMMEDIATE RELIEF TECHNIQUES:**
• **Box Breathing**: Inhale 4 counts → Hold 4 → Exhale 4 → Hold 4 (repeat 4-8 times)
• **5-4-3-2-1 Grounding**: Name 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste
• **Progressive Muscle Relaxation**: Tense shoulders for 5 seconds, then release

**🧠 EMOTIONAL REGULATION:**
• **Thought Challenging**: Ask "Is this thought helpful? Is it realistic?"
• **Self-Compassion**: Talk to yourself like you would a dear friend
• **Mindful Acceptance**: "I notice I'm feeling [emotion], and that's okay"

**🎯 BEHAVIORAL STRATEGIES:**
• Take a 5-minute walk outside
• Listen to calming music or nature sounds
• Write your feelings in a journal without judgment
• Do something creative with your hands

Which of these feels most doable for you right now?`,

        `You're taking such a positive step by seeking coping tools! 🌟 Here's a comprehensive toolkit:

**⚡ QUICK STRESS BUSTERS (0-5 minutes):**
• Cold water on face/wrists or hold ice cubes
• Deep belly breathing for 2 minutes
• Progressive muscle relaxation
• Listen to one favorite song

**🎨 EMOTIONAL OUTLETS (5-20 minutes):**
• Journal stream-of-consciousness style
• Draw, paint, or doodle your feelings
• Dance or move your body
• Call or text a trusted friend

**🌱 LONG-TERM WELLNESS (daily practices):**
• Morning gratitude practice (3 things)
• Evening reflection and self-compassion
• Regular sleep schedule
• Mindful eating and hydration

**🛠️ COGNITIVE TOOLS:**
• "This feeling will pass"
• "I can handle difficult emotions"
• "What would I tell a friend in this situation?"

What type of situation are you hoping to cope with better? I can provide more specific strategies.`
      ];
      return copingResponses[Math.floor(Math.random() * copingResponses.length)];

    case 'anxiety':
      return `I can sense you're feeling anxious right now. 💙 Anxiety is your mind's way of trying to protect you, but let's help you feel more grounded:

**🌬️ QUICK ANXIETY RELIEF:**
• **4-7-8 Breathing**: Inhale 4 → Hold 7 → Exhale 8 (repeat 3-4 times)
• **Grounding**: Feel your feet on the ground, name 3 blue things you can see
• **Reality Check**: "I am safe right now, this feeling will pass"

**💭 CALMING THOUGHTS:**
• "This is anxiety, not danger"
• "I have survived anxious moments before"
• "This feeling is temporary"

Anxiety often feels bigger than it actually is. You're going to be okay. What's on your mind that's making you feel this way?`;

    case 'depression':
      return `I hear you, and I want you to know that what you're feeling is valid. 💜 Depression can make everything feel heavy, but you're not alone:

**🌅 GENTLE STEPS:**
• **One small thing**: Maybe just drink a glass of water or step outside for 2 minutes
• **Self-compassion**: You're doing the best you can right now
• **Connection**: Even a small text to someone who cares counts

**💭 GENTLE REMINDERS:**
• This feeling is temporary, even when it doesn't feel that way
• You matter, even when depression tells you otherwise
• Taking care of yourself isn't selfish

What's one tiny thing that might bring you a little comfort right now? It doesn't have to be big.`;

    case 'anger':
      return `I can feel the intensity of your emotions. Anger is valid - it often tells us something important needs attention. 🔥

**⏰ IMMEDIATE COOLING:**
• **Step away** from the situation if possible
• **Deep breaths**: Focus on long, slow exhales
• **Cold water** on your wrists or face

**💭 ANGER PROCESSING:**
• "What is my anger trying to tell me?"
• "What need of mine isn't being met?"
• "How can I express this constructively?"

Anger is energy - let's channel it in a way that helps you. What's behind this feeling?`;

    case 'positive':
      return `It's wonderful to hear some positivity from you! 🌟 I'm genuinely happy you're feeling good:

**✨ SAVORING THE MOMENT:**
• Take 30 seconds to really feel this good feeling
• Notice what specifically is making you feel this way
• Remember this moment for tougher times

**🌱 BUILDING ON POSITIVITY:**
• What contributed to feeling this way?
• How can you create more moments like this?
• Share this joy with someone who cares about you

Positive emotions are like sunshine for our mental health. What's bringing you the most joy right now?`;

    case 'sleep':
      return `Sleep is so important for mental health. 😴 Let me help you with some effective strategies:

**🌙 TONIGHT'S SLEEP PREP:**
• No screens 1 hour before bed
• Keep room cool (65-68°F)
• Try 4-7-8 breathing in bed

**🛁 WIND-DOWN IDEAS:**
• Warm bath or shower
• Gentle stretching
• Reading a physical book
• Herbal tea (chamomile works well)

What's your current bedtime routine like? Sometimes small changes make a big difference.`;

    case 'negative':
      return `I can sense you're having a difficult time right now. 💙 It's completely okay to have hard days:

**🤗 GENTLE SELF-CARE:**
• Be kind to yourself - talk to yourself like you would a good friend
• Check basic needs: Have you eaten, hydrated, or rested today?
• One small step: What's one tiny thing that might help you feel 1% better?

**💭 GENTLE REMINDERS:**
• Difficult feelings are temporary
• You've gotten through 100% of your bad days so far
• It's okay to not be okay sometimes

What would help you feel most supported right now?`;

    default:
      const neutralResponses = [
        `Thank you for sharing with me. 💙 I'm here to listen and support you through whatever you're experiencing:

**💜 HOW I CAN HELP:**
• Provide emotional support and a listening ear
• Share coping strategies when you need them
• Offer perspective and gentle reminders
• Be a consistent, caring presence

**✨ REMEMBER:**
• Your feelings are valid
• You don't have to face challenges alone
• Small steps forward still count as progress

What's on your mind today? I'm here to listen and support you however feels most helpful.`,

        `Hello! I'm grateful you're here and sharing with me. 🌸 This is a safe space for whatever you're experiencing:

**🌈 WHAT I OFFER:**
• Non-judgmental listening and support
• Emotional validation and understanding
• Practical coping tools when you need them
• Consistent care on your wellness journey

**💪 YOUR STRENGTHS:**
• You're here, which shows courage
• You're taking care of your mental health
• You have the power to create positive change

How are you feeling today? What would be most helpful for you right now?`
      ];
      return neutralResponses[Math.floor(Math.random() * neutralResponses.length)];
  }
};
