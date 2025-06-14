
import { analyzeEmotion } from './emotionAnalysis';

export const generateBotResponse = (userMessage: string): string => {
  const emotion = analyzeEmotion(userMessage);
  console.log('Detected emotion:', emotion);
  
  switch (emotion) {
    case 'crisis':
      const crisisResponses = [
        "🚨 I'm really concerned about you right now. Your life has value and you matter. Please reach out for immediate help:\n\n🔴 **Crisis Hotlines:**\n• National Suicide Prevention Lifeline: **988**\n• Crisis Text Line: Text HOME to **741741**\n• International Association for Suicide Prevention: **iasp.info**\n\nYou're not alone in this. Would you like me to guide you to more crisis resources? Please consider reaching out to someone you trust or emergency services if you're in immediate danger.",
        "🚨 I hear that you're in a lot of pain right now, and I want you to know that your life matters. Please don't give up. There are people who want to help:\n\n**Immediate Support:**\n• Call 988 - National Suicide Prevention Lifeline\n• Text 'HELLO' to 741741 - Crisis Text Line\n• Go to your nearest emergency room\n\nRemember: This pain you're feeling is temporary, but ending your life is permanent. You deserve support and care. Can you reach out to someone today?"
      ];
      return crisisResponses[Math.floor(Math.random() * crisisResponses.length)];

    case 'anxiety':
      const anxietyResponses = [
        "I can hear the anxiety in your message, and I want you to know that what you're feeling is valid. 💙 Let's try this together:\n\n**Quick Anxiety Relief:**\n🌬️ **Box Breathing**: Breathe in for 4, hold for 4, out for 4, hold for 4\n🏠 **5-4-3-2-1 Grounding**: Name 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste\n💭 **Remind yourself**: 'This feeling will pass. I am safe right now.'\n\nAnxiety is your mind trying to protect you, but sometimes it gets overactive. You've gotten through anxious moments before - you can get through this one too.",
        "Anxiety can feel so overwhelming, but remember - you are stronger than your anxiety. 🌸 Here's what can help right now:\n\n**Immediate Techniques:**\n🤲 **Progressive Muscle Relaxation**: Tense your shoulders for 5 seconds, then release\n🧊 **Cold Water**: Splash cold water on your face or hold an ice cube\n📱 **Positive Self-Talk**: 'I am safe. This will pass. I can handle this.'\n\nWhat's one small thing that usually brings you comfort? Sometimes focusing on tiny, manageable actions helps break the anxiety cycle."
      ];
      return anxietyResponses[Math.floor(Math.random() * anxietyResponses.length)];

    case 'depression':
      const depressionResponses = [
        "I'm so sorry you're feeling this heavy right now. Depression can make everything feel impossible, but please know you're not alone. 💜\n\n**Gentle Steps for Today:**\n💧 **Hydration**: Try to drink a glass of water\n🌅 **Sunlight**: Sit by a window or step outside for 2 minutes\n🤗 **Self-Compassion**: Talk to yourself like you would a good friend\n✅ **One Small Task**: Maybe just making your bed or brushing teeth\n\nDepression lies to us and says we're worthless, but that's not true. You matter. Your life has value. What's one tiny thing you managed to do today?",
        "Thank you for trusting me with how you're feeling. Depression can feel like being stuck in a dark tunnel, but there is light ahead. 🌅\n\n**Small Acts of Self-Care:**\n🛁 **Comfort**: Take a warm shower or wrap yourself in a soft blanket\n📝 **Journaling**: Write down one thing you're grateful for, even if it's small\n🎵 **Music**: Listen to one song that used to make you feel something\n📞 **Connection**: Consider texting one person you trust\n\nHealing isn't linear - some days will be harder than others, and that's okay. You're brave for reaching out."
      ];
      return depressionResponses[Math.floor(Math.random() * depressionResponses.length)];

    case 'anger':
      const angerResponses = [
        "I can feel the intensity of your emotions right now. Anger is a valid feeling, and it's okay to feel this way. 🔥\n\n**Healthy Ways to Process Anger:**\n🚶 **Movement**: Go for a walk, do jumping jacks, or punch a pillow\n📝 **Expression**: Write your feelings in a journal or voice memo\n🌬️ **Breathing**: Take 10 deep breaths, focusing on the exhale\n❄️ **Cool Down**: Splash cold water on your face or hold an ice pack\n\nAnger often masks other emotions like hurt, frustration, or fear. What do you think might be underneath this anger?",
        "Your anger is telling you that something important to you has been affected. Let's channel this energy constructively. 💪\n\n**Anger Management Techniques:**\n⏰ **Time-Out**: Step away from the situation for 10-15 minutes\n🎯 **Focus**: Ask yourself 'What can I control in this situation?'\n💭 **Reframe**: Try to see the situation from another perspective\n🎨 **Creative Outlet**: Draw, write, or create something with your hands\n\nWhat's one constructive action you could take to address what's making you angry?"
      ];
      return angerResponses[Math.floor(Math.random() * angerResponses.length)];

    case 'positive':
      const positiveResponses = [
        "It's wonderful to hear some positivity in your message! 🌟 I'm genuinely happy you're feeling good. These moments are so precious.\n\n**Amplifying Positive Feelings:**\n📝 **Gratitude Journal**: Write down what's making you feel good\n📞 **Share Joy**: Tell someone about your positive experience\n🎯 **Savor**: Take a moment to really feel and appreciate this feeling\n🌱 **Plant Seeds**: What can you do to create more moments like this?\n\nPositive emotions are like sunshine for our mental health. What specifically is contributing to you feeling this way today?",
        "Your positive energy is contagious! ✨ I love hearing when you're doing well. Let's make the most of this good feeling:\n\n**Building on Positivity:**\n🎯 **Mindful Appreciation**: Take 30 seconds to really notice what feels good\n📸 **Memory Making**: Do something small to remember this moment\n💪 **Future Planning**: How can you create more experiences like this?\n🤗 **Self-Recognition**: Give yourself credit for creating this positive moment\n\nWhat's bringing you the most joy right now?"
      ];
      return positiveResponses[Math.floor(Math.random() * positiveResponses.length)];

    case 'coping':
      const copingResponses = [
        "I'm so glad you're asking for coping strategies! That shows real self-awareness and strength. 💪 Here are some powerful techniques:\n\n**Immediate Coping Strategies:**\n🌬️ **4-7-8 Breathing**: Inhale 4, hold 7, exhale 8 (repeat 4 times)\n🧘 **Grounding (5-4-3-2-1)**: 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste\n❄️ **Ice Technique**: Hold ice cubes or splash cold water on face\n🚶 **Movement**: Take a 5-minute walk or do gentle stretches\n📱 **Distraction**: Call a friend, watch funny videos, or listen to music\n\nWhich of these feels most doable for you right now?",
        "You're taking such a positive step by seeking coping strategies! 🌟 Here's a toolkit of techniques:\n\n**Emotional Regulation Tools:**\n📝 **Journaling**: Write your thoughts without judgment for 10 minutes\n🎨 **Creative Expression**: Draw, paint, or create something with your hands\n🛁 **Self-Soothing**: Take a warm bath, use aromatherapy, or listen to calming music\n🤗 **Self-Compassion**: Talk to yourself like you would your best friend\n📞 **Social Connection**: Reach out to someone you trust\n🌱 **Nature**: Spend time outdoors or with plants\n\nWhat type of situation are you hoping to cope with better?",
        "Asking for coping strategies is a sign of wisdom and self-care! 🧠💚 Here are evidence-based techniques:\n\n**Stress Management Arsenal:**\n💭 **Cognitive Restructuring**: Challenge negative thoughts with 'Is this thought helpful? Is it true?'\n⏰ **Time Management**: Break overwhelming tasks into tiny, manageable steps\n🎯 **Problem-Solving**: Write down the problem, brainstorm solutions, pick one to try\n🔄 **Progressive Muscle Relaxation**: Tense and release each muscle group\n📚 **Learning**: Read, listen to podcasts, or watch videos on topics that interest you\n🎶 **Music Therapy**: Create playlists for different moods\n\nWhich area of your life feels most challenging right now?"
      ];
      return copingResponses[Math.floor(Math.random() * copingResponses.length)];

    case 'sleep':
      return "Sleep is so crucial for mental health, and I understand how frustrating sleep issues can be. 😴\n\n**Better Sleep Strategies:**\n🌅 **Sleep Hygiene**: Go to bed and wake up at the same time daily\n📱 **Digital Sunset**: No screens 1 hour before bed\n🛁 **Wind-Down Ritual**: Warm bath, reading, or gentle stretching\n🌡️ **Cool Environment**: Keep bedroom around 65-68°F (18-20°C)\n🌬️ **4-7-8 Breathing**: This technique can help calm your nervous system\n☕ **Limit Caffeine**: Avoid after 2 PM\n\nWhat's your current bedtime routine like? Sometimes small changes can make a big difference.";

    default:
      const neutralResponses = [
        "Thank you for sharing with me. 💙 I'm here to listen and support you through whatever you're experiencing. Your feelings are valid, and this is a safe space for you.\n\n**How I Can Help:**\n🎯 **Specific Support**: Tell me what's on your mind and I'll provide targeted strategies\n💭 **Processing**: Sometimes just talking through feelings can be incredibly helpful\n🛠️ **Practical Tools**: I can share coping techniques for whatever you're facing\n🤗 **Emotional Support**: I'm here to remind you that you're not alone\n\nWhat would be most helpful for you right now?",
        "I'm grateful you're here and willing to share with me. 🌸 Whatever brought you here today, know that reaching out is a brave and positive step.\n\n**Remember:**\n💪 You're stronger than you realize\n🌱 Growth happens one day at a time\n🤝 You don't have to face challenges alone\n🌈 Difficult feelings are temporary\n✨ You deserve support and care\n\nWhat's been on your mind lately? I'm here to listen without judgment.",
        "Hello! I'm so glad you're here. 🌟 As your mental health companion, I want you to know that this is your space - free from judgment, full of support.\n\n**What I'm Here For:**\n👂 **Active Listening**: Share anything that's on your heart or mind\n🧠 **Mental Health Education**: Learn about emotions, coping, and wellness\n🛠️ **Practical Strategies**: Get tools you can use immediately\n💚 **Encouragement**: Remind you of your strength and worth\n\nHow are you feeling today? What brought you here to chat with me?"
      ];
      return neutralResponses[Math.floor(Math.random() * neutralResponses.length)];
  }
};
