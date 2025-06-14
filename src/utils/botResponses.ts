
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
      const anxietyResponses = [
        `I can hear the anxiety in your message, and I want you to know that what you're feeling is completely valid. 💙 Let's work through this together:

**🌬️ IMMEDIATE ANXIETY RELIEF:**
• **4-7-8 Breathing**: Inhale 4 → Hold 7 → Exhale 8 (repeat 3-4 times)
• **Grounding Technique**: Feel your feet on the ground, notice 3 things you can see right now
• **Cold Therapy**: Splash cold water on face or hold an ice cube

**💭 ANXIETY THOUGHTS REFRAME:**
• "This feeling is temporary and will pass"
• "My anxiety is trying to protect me, but I am safe right now"
• "I have gotten through anxious moments before"

**🎯 FOCUS REDIRECTORS:**
• Count backwards from 100 by 7s
• Name all blue objects you can see
• Focus intensely on one object for 30 seconds

Remember: Anxiety feels overwhelming, but you are stronger than your anxiety. What's one small thing that usually brings you comfort?`,

        `Anxiety can feel so overwhelming, but you're not alone in this feeling. 🌸 Here's what can help right now:

**🤲 PHYSICAL TECHNIQUES:**
• Tense and release your shoulders 3 times
• Gentle neck rolls and stretches
• Press your palms together firmly for 10 seconds

**🧘 MENTAL TECHNIQUES:**
• Visualize a calm, safe place in detail
• Repeat: "I am safe, I am strong, this will pass"
• Practice the "STOP" technique: Stop, Take a breath, Observe, Proceed mindfully

**📱 QUICK DISTRACTIONS:**
• Text someone who makes you smile
• Watch a funny video or look at cute animals
• Do a simple task like organizing a drawer

Anxiety often peaks and then naturally decreases. You're doing great by reaching out. What's happening right now that's making you feel anxious?`
      ];
      return anxietyResponses[Math.floor(Math.random() * anxietyResponses.length)];

    case 'depression':
      const depressionResponses = [
        `I'm so sorry you're feeling this heavy right now. Depression can make everything feel impossible, but please know you're not alone. 💜

**🌅 GENTLE STEPS FOR TODAY:**
• **Hydration**: Try to drink one glass of water
• **Light**: Sit by a window or step outside for 2 minutes
• **Movement**: Even stretching in bed counts
• **Self-Compassion**: You're doing the best you can with what you have

**✅ TINY ACCOMPLISHMENTS (choose just one):**
• Make your bed or just pull up the covers
• Brush your teeth
• Send one text to someone who cares
• Eat one nutritious thing

**💭 GENTLE REMINDERS:**
• Depression lies to us about our worth - you DO matter
• Healing isn't linear - some days will be harder
• You're brave for reaching out
• This feeling is temporary, even when it doesn't feel that way

What's one tiny thing you managed to do today? I want to celebrate that with you. 🌟`,

        `Thank you for trusting me with how you're feeling. Depression can feel like being stuck in a dark tunnel, but there is light ahead, even when you can't see it. 🌅

**🛁 COMFORT STRATEGIES:**
• Take a warm shower or bath
• Wrap yourself in a soft blanket
• Drink something warm and soothing
• Listen to gentle, comforting music

**📝 GENTLE ACTIVITIES:**
• Write down one thing you're grateful for (even if it's small)
• Look at photos that bring back good memories
• Watch something that used to make you laugh
• Pet an animal or water a plant

**🤗 CONNECTION IDEAS:**
• Reach out to someone you trust, even if it's just to say "hi"
• Join an online support community
• Remember people who care about you

Depression can make us feel isolated and worthless, but that's the illness talking, not the truth. You are valuable, you matter, and you deserve support. What feels most manageable for you right now?`
      ];
      return depressionResponses[Math.floor(Math.random() * depressionResponses.length)];

    case 'anger':
      const angerResponses = [
        `I can feel the intensity of your emotions right now, and that's completely valid. Anger is a normal human emotion that often tells us something important. 🔥

**🚶 IMMEDIATE ANGER RELEASE:**
• Take a 5-10 minute walk (even if it's just around your room)
• Do jumping jacks or push-ups to release physical tension
• Punch a pillow or scream into a towel
• Take 10 deep breaths, focusing on long exhales

**💭 ANGER PROCESSING:**
• Ask yourself: "What is my anger trying to tell me?"
• Write your feelings without censoring - just let it all out
• What need of yours isn't being met right now?

**❄️ COOLING DOWN TECHNIQUES:**
• Splash cold water on your face
• Hold an ice pack or ice cubes
• Count to 10 (or 100) before responding
• Step away from the situation if possible

Anger often masks other emotions like hurt, frustration, or feeling unheard. What do you think might be underneath this anger?`,

        `Your anger is telling you that something important to you has been affected or violated. Let's channel this energy constructively. 💪

**⏰ IMMEDIATE PAUSE STRATEGIES:**
• Take a 15-minute time-out from the situation
• Use the "STOP" method: Stop, Take a breath, Observe your feelings, Proceed thoughtfully

**🎯 CONSTRUCTIVE CHANNELING:**
• Write a letter to express your feelings (you don't have to send it)
• Exercise vigorously - run, bike, lift weights
• Clean or organize something with intensity
• Create art, music, or write to express your emotions

**🔄 REFRAME QUESTIONS:**
• "What can I control in this situation?"
• "How can I communicate my needs clearly?"
• "What would a solution look like?"
• "How important will this be in a week/month/year?"

What's one constructive action you could take right now to address what's making you angry? Remember, feeling angry is okay - it's what we do with it that matters.`
      ];
      return angerResponses[Math.floor(Math.random() * angerResponses.length)];

    case 'positive':
      const positiveResponses = [
        `It's wonderful to hear some positivity in your message! 🌟 I'm genuinely happy you're feeling good. These moments are precious and worth celebrating.

**🌈 AMPLIFYING POSITIVE FEELINGS:**
• **Savor the moment**: Take 30 seconds to really feel and appreciate this feeling
• **Gratitude practice**: Write down what specifically is making you feel good
• **Share the joy**: Tell someone about your positive experience
• **Memory making**: Take a photo or do something small to remember this moment

**🌱 BUILDING ON POSITIVITY:**
• What contributed to you feeling this way? Can you create more experiences like this?
• How can you extend this good feeling throughout your day?
• What positive self-talk helped you get here?

**✨ POSITIVE MOMENTUM:**
• Use this energy to tackle something you've been putting off
• Reach out to someone who might need encouragement
• Do something kind for yourself or others

Positive emotions are like sunshine for our mental health. What specifically is bringing you the most joy right now? I'd love to hear more about what's going well! 😊`,

        `Your positive energy is absolutely contagious! ✨ I love hearing when you're doing well. Let's make the most of this beautiful feeling:

**🎯 MINDFUL APPRECIATION:**
• Notice what's happening in your body when you feel this good
• Pay attention to your thoughts and how different they feel
• Really soak in this moment - you deserve to feel this way

**📸 POSITIVE ANCHORING:**
• Create a "good moments" journal entry
• Take a mental snapshot of exactly how this feels
• Think about what you want to remember about today

**💪 STRENGTH RECOGNITION:**
• Give yourself credit for creating or contributing to this positive moment
• Remember that you have the power to influence your emotional state
• You're building resilience every time you notice and appreciate good feelings

**🔄 FUTURE PLANNING:**
• What patterns led to this positive feeling?
• How can you create more moments like this?
• What would you tell your past self about getting through tough times?

Keep shining! What's bringing you the most joy right now? 🌟`
      ];
      return positiveResponses[Math.floor(Math.random() * positiveResponses.length)];

    case 'sleep':
      return `Sleep is so crucial for mental health, and I understand how frustrating sleep issues can be. 😴 Let me help you with some effective strategies:

**🌙 IMMEDIATE SLEEP PREPARATION:**
• **Digital sunset**: No screens 1 hour before bed
• **Cool environment**: Keep bedroom 65-68°F (18-20°C)
• **4-7-8 breathing**: This activates your parasympathetic nervous system

**🛁 WIND-DOWN RITUALS (1-2 hours before bed):**
• Warm bath or shower
• Gentle stretching or yoga
• Reading a physical book
• Herbal tea (chamomile, valerian, passionflower)
• Journaling to "brain dump" worries

**📅 SLEEP HYGIENE FUNDAMENTALS:**
• Same bedtime and wake time daily (even weekends)
• Bedroom only for sleep and intimacy
• Blackout curtains or eye mask
• White noise or earplugs if needed

**☕ DAYTIME FACTORS:**
• No caffeine after 2 PM
• Get sunlight within 1 hour of waking
• Exercise regularly (but not close to bedtime)
• Limit naps to 20-30 minutes before 3 PM

What's your current bedtime routine like? Sometimes small changes can make a huge difference in sleep quality.`;

    case 'negative':
      return `I can sense you're going through a difficult time right now. 💙 It's completely okay to have hard days - they're part of the human experience.

**🤗 GENTLE SELF-CARE:**
• **Be kind to yourself**: Talk to yourself like you would a good friend
• **Basic needs check**: Have you eaten, hydrated, or rested today?
• **One small step**: What's one tiny thing that might help you feel 1% better?

**💭 PERSPECTIVE REMINDERS:**
• Difficult feelings are temporary, even when they feel permanent
• You've gotten through 100% of your bad days so far
• It's okay to not be okay sometimes
• Asking for support is a sign of strength, not weakness

**🌱 SMALL COMFORTS:**
• Wrap yourself in something soft and warm
• Listen to music that matches or soothes your mood
• Step outside for a few minutes if possible
• Do something creative, even if it's just doodling

Remember: You don't have to feel better right away. Sometimes we just need to sit with difficult feelings and be gentle with ourselves. What would help you feel most supported right now?`;

    default:
      const neutralResponses = [
        `Thank you for sharing with me. 💙 I'm here to listen and support you through whatever you're experiencing. This is a safe space where all your feelings are valid and welcome.

**🤗 HOW I CAN SUPPORT YOU:**
• **Active listening**: Share anything that's on your heart or mind
• **Emotional support**: I'm here to remind you that you're not alone
• **Practical tools**: I can share coping techniques for whatever you're facing
• **Mental health education**: Learn about emotions, wellness, and self-care

**💜 GENTLE REMINDERS:**
• You're stronger than you realize
• It's okay to have difficult days
• Growth happens one moment at a time
• You deserve support and compassion

What's been on your mind lately? I'm here to listen without judgment and offer support in whatever way feels most helpful to you. How are you feeling right now? 🌟`,

        `Hello! I'm so grateful you're here and willing to connect with me. 🌸 Whatever brought you here today, know that reaching out is always a brave and positive step.

**✨ WHAT I'M HERE FOR:**
• Providing a non-judgmental space to express your thoughts and feelings
• Offering emotional support and validation
• Sharing evidence-based coping strategies and wellness techniques
• Being a consistent, caring presence on your mental health journey

**🌈 REMEMBER:**
• Your feelings and experiences are valid
• You don't have to face challenges alone
• Small steps forward still count as progress
• You are worthy of care, support, and happiness

I'm curious - what's brought you here today? Is there anything specific you'd like to talk about or explore together? I'm here to listen and support you in whatever way feels most helpful. 💚`,

        `Hi there! 🌟 I'm MindMate, and I'm genuinely glad you're here. As your mental health companion, I want you to know that this space is completely yours - free from judgment and full of compassion.

**🧠 MENTAL WELLNESS SUPPORT I OFFER:**
• **Crisis support**: Immediate resources when you need them most
• **Emotional processing**: Help working through complex feelings
• **Coping strategies**: Practical tools you can use right away
• **Encouragement**: Reminders of your strength and resilience

**💪 YOUR STRENGTHS:**
• You showed courage by reaching out
• You're taking an active role in your mental health
• You have the power to create positive change in your life
• You've survived every difficult day you've ever had

How are you feeling today? What would be most helpful for you right now? I'm here to listen, support, and walk alongside you on your wellness journey. 🤝`
      ];
      return neutralResponses[Math.floor(Math.random() * neutralResponses.length)];
  }
};
