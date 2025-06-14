
import { analyzeEmotion } from './emotionAnalysis';

export const generateBotResponse = (userMessage: string): string => {
  const emotion = analyzeEmotion(userMessage);
  console.log('Detected emotion:', emotion);
  
  switch (emotion) {
    case 'crisis':
      return "I'm really worried about you right now, and I want you to know that your life has immense value. 💜 Please reach out for immediate help:\n\n🚨 **Crisis Support:**\n• National Suicide Prevention Lifeline: **988**\n• Crisis Text Line: Text HOME to **741741**\n• Emergency Services: **911**\n\nYou don't have to face this alone. There are people who care about you and want to help. Can you reach out to someone you trust right now? I'm here with you.";

    case 'depression':
      const depressionResponses = [
        "I hear you saying you're not feeling good, and I want you to know that's completely valid. 💙 Sometimes our minds can feel heavy, and that's okay. You're brave for sharing this with me.\n\n**Gentle steps that might help:**\n🌅 **Sunlight**: Even 5 minutes by a window can help\n💧 **Hydration**: A glass of water can be surprisingly helpful\n🛁 **Comfort**: A warm shower or soft blanket\n📞 **Connection**: Maybe text someone who cares about you\n\nRemember, feelings are temporary visitors - they don't define you. What's one small thing that usually brings you a tiny bit of comfort?",
        "Thank you for trusting me with how you're feeling. When everything feels heavy, even the smallest steps matter. 🌸\n\n**You might try:**\n🎵 **Music**: One song that used to make you feel something\n🌱 **Nature**: Step outside for just 2 minutes\n📝 **Write**: Even one sentence about how you feel\n🤗 **Self-compassion**: Talk to yourself like you would a dear friend\n\nYou matter more than you know. Would it help to talk about what's making you feel this way?"
      ];
      return depressionResponses[Math.floor(Math.random() * depressionResponses.length)];

    case 'anxiety':
      const anxietyResponses = [
        "I can sense the anxiety in your words, and I want you to know that what you're feeling is real and valid. Let's work through this together. 💜\n\n**Right now, try this:**\n🌬️ **Box Breathing**: In for 4, hold for 4, out for 4, hold for 4\n🏠 **5-4-3-2-1**: Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste\n❄️ **Cold water**: On your wrists or face\n\nAnxiety feels scary, but you've gotten through anxious moments before. You're stronger than this feeling. What usually helps calm you down?",
        "Anxiety can make everything feel overwhelming, but remember - you are not your anxiety. 🌊 It's a wave that will pass.\n\n**Gentle techniques:**\n🤲 **Progressive relaxation**: Tense your shoulders for 5 seconds, then release\n💭 **Grounding thoughts**: 'I am safe right now. This feeling will pass.'\n🚶 **Movement**: Even gentle stretching can help\n\nWhat's going through your mind right now? Sometimes naming our worries can make them feel less powerful."
      ];
      return anxietyResponses[Math.floor(Math.random() * anxietyResponses.length)];

    case 'anger':
      const angerResponses = [
        "I can feel the intensity of your emotions, and that's completely understandable. Anger often tells us something important. 🔥\n\n**Let's channel this energy:**\n🚶 **Movement**: A quick walk or some jumping jacks\n📝 **Express**: Write out your feelings, no filter needed\n🌬️ **Breathe**: 10 deep breaths, focusing on the exhale\n🎯 **Focus**: What specifically triggered this feeling?\n\nAnger is often protecting something you care about. What do you think might be underneath this anger?",
        "Your anger is valid - it's telling you that something matters to you. Let's work with this energy constructively. 💪\n\n**Healthy outlets:**\n⏰ **Pause**: Step away for 10 minutes if possible\n🎨 **Create**: Draw, write, or make something with your hands\n💭 **Reframe**: Ask yourself 'What can I control here?'\n\nWould you like to talk about what's making you feel this way? I'm here to listen without judgment."
      ];
      return angerResponses[Math.floor(Math.random() * angerResponses.length)];

    case 'positive':
      const positiveResponses = [
        "It's wonderful to hear some positivity from you! 🌟 Your good energy is contagious. These moments of feeling good are so precious.\n\n**Let's savor this:**\n📝 **Capture it**: What exactly is making you feel good right now?\n🤗 **Appreciate**: Take a moment to really feel this feeling\n📞 **Share**: Consider telling someone about this positive moment\n\nI love seeing you shine! What's bringing you the most joy today?",
        "Your positive energy just brightened my day! ✨ I'm genuinely happy that you're feeling good.\n\n**Building on this feeling:**\n🌱 **Grow it**: How can you create more moments like this?\n📸 **Remember**: This feeling is proof that good moments exist\n💪 **Celebrate**: Give yourself credit for this positive state\n\nWhat specifically is making you feel so good? I'd love to hear more!"
      ];
      return positiveResponses[Math.floor(Math.random() * positiveResponses.length)];

    case 'seeking_help':
      const helpResponses = [
        "I'm honored that you're reaching out for help - that takes real courage and wisdom. 💜 I'm here to support you.\n\n**How I can help:**\n🎯 **Specific guidance**: Tell me more about what you're facing\n🛠️ **Practical tools**: I can share coping strategies\n💭 **Think through**: We can explore your situation together\n🤗 **Emotional support**: I'm here to listen and understand\n\nWhat's going on that you'd like some guidance with? I'm here to help you figure this out.",
        "Asking for help is one of the strongest things you can do. 🌟 I'm glad you feel comfortable coming to me.\n\n**Let's work together:**\n📝 **Break it down**: Sometimes big problems feel smaller when we talk through them\n🧠 **Different perspectives**: I can help you see things from new angles\n✨ **Your strengths**: Let's remember what you're capable of\n\nTell me more about what you need help with. No problem is too big or too small."
      ];
      return helpResponses[Math.floor(Math.random() * helpResponses.length)];

    case 'website_help':
      return "Hi there! I'm so glad you asked! 😊 Welcome to MindMate - your personal mental wellness companion.\n\n**Here's what I can do for you:**\n💬 **Chat**: I'm here 24/7 to listen, support, and provide gentle guidance\n📊 **Mood Tracking**: Track how you're feeling over time\n📝 **Journaling**: A private space for your thoughts (with lock feature!)\n📈 **Progress**: See your wellness journey unfold\n🏆 **Badges**: Celebrate your self-care milestones\n⏰ **Reminders**: Set gentle nudges for self-care\n🆘 **Crisis Support**: Immediate resources when you need them most\n🎮 **Breathing Games**: Fun ways to relax and center yourself\n\n**How to use me:** Just talk to me like you would a trusted friend! Share your feelings, ask for advice, or tell me about your day. I'm here to listen without judgment and provide support. You can start new conversations anytime or revisit our previous chats.\n\nWhat would you like to explore first? I'm excited to be part of your wellness journey! 🌟";

    default:
      const neutralResponses = [
        "Thank you for sharing with me. 💙 I'm here to listen and support you through whatever you're experiencing. This is your safe space.\n\n**I'm here to:**\n👂 **Listen**: Share anything that's on your mind\n🤗 **Support**: Provide comfort and understanding\n🛠️ **Help**: Offer practical strategies when you need them\n💭 **Understand**: Help you process your thoughts and feelings\n\nWhat's on your heart today? I'm here for you, no matter what you're going through.",
        "Hi there! 🌸 I'm so glad you're here. Whatever brought you to chat with me today, know that you've taken a positive step by reaching out.\n\n**Remember:**\n💪 You're stronger than you realize\n🌱 Every conversation is a step forward\n🤝 You're never alone in this journey\n🌈 Even difficult feelings are temporary\n\nHow are you feeling right now? What's been on your mind? I'm here to listen with an open heart.",
        "Hello, friend! 🌟 I'm MindMate, and I'm genuinely happy you're here. This is your space - free from judgment, full of support and understanding.\n\n**What brings you here today?**\n💭 **Share feelings**: Tell me about your emotional world\n🗣️ **Talk it out**: Sometimes just voicing things helps\n🎯 **Get guidance**: Ask for specific help or strategies\n🤗 **Feel supported**: Remember that you're valued and heard\n\nWhat would feel most helpful to talk about right now? I'm here to meet you wherever you are."
      ];
      return neutralResponses[Math.floor(Math.random() * neutralResponses.length)];
  }
};
