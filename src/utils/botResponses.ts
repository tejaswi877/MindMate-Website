
import { analyzeEmotion } from './emotionAnalysis';

export const generateBotResponse = (userMessage: string): string => {
  const emotion = analyzeEmotion(userMessage);
  const lowerMessage = userMessage.toLowerCase();
  console.log('Detected emotion:', emotion);
  
  // Check if user is asking for tips/advice specifically
  const askingForTips = /\b(tips?|advice|help|suggest|what should i do|how to|strategies|coping|ways to)\b/.test(lowerMessage);
  
  switch (emotion) {
    case 'crisis':
      return "I'm really worried about you right now, and I want you to know that your life has immense value. 💜 Please reach out for immediate help:\n\n🚨 **Crisis Support:**\n• National Suicide Prevention Lifeline: **988**\n• Crisis Text Line: Text HOME to **741741**\n• Emergency Services: **911**\n\nYou don't have to face this alone. There are people who care about you and want to help. Can you reach out to someone you trust right now? I'm here with you.";

    case 'depression':
      if (askingForTips) {
        const depressionTips = [
          "I understand you're looking for ways to feel better. Here are some gentle approaches that might help:\n\n🌅 **Small steps**: Try spending just 5 minutes by a window for natural light\n💧 **Stay hydrated**: Sometimes a glass of water can lift our energy\n🛁 **Comfort yourself**: A warm shower or wrapping up in a soft blanket\n📞 **Reach out**: Even a simple text to someone who cares\n\nWhat feels most manageable for you right now?",
          "Since you're asking for suggestions, here are some things that have helped others:\n\n🎵 **Music**: One song that used to bring you joy\n🌱 **Nature**: Just 2 minutes outside if possible\n📝 **Express**: Write down one feeling, no pressure to make it perfect\n🤗 **Self-compassion**: Talk to yourself like you would a dear friend\n\nWhich of these resonates with you?"
        ];
        return depressionTips[Math.floor(Math.random() * depressionTips.length)];
      } else {
        const depressionResponses = [
          "I can hear that you're going through a tough time right now. 💙 That takes courage to share, and I'm glad you did. Your feelings are completely valid.\n\nI'm here to listen to whatever you're experiencing. Sometimes just having someone understand can help a little. What's been weighing on your mind the most?",
          "Thank you for trusting me with how you're feeling. 🌸 It sounds like things feel really heavy right now, and I want you to know that's okay - you don't have to carry this alone.\n\nI'm here for you. Would you like to tell me more about what's going on? Sometimes talking through things can help us feel a bit less alone."
        ];
        return depressionResponses[Math.floor(Math.random() * depressionResponses.length)];
      }

    case 'anxiety':
      if (askingForTips) {
        const anxietyTips = [
          "I can help you with some techniques for managing anxiety:\n\n🌬️ **Box Breathing**: In for 4, hold for 4, out for 4, hold for 4\n🏠 **5-4-3-2-1 Grounding**: Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste\n❄️ **Cold water**: On your wrists or face\n\nWhich one would you like to try first?",
          "Here are some gentle techniques that can help with anxiety:\n\n🤲 **Progressive relaxation**: Tense your shoulders for 5 seconds, then release\n💭 **Grounding thoughts**: 'I am safe right now. This feeling will pass.'\n🚶 **Movement**: Even gentle stretching can help\n\nWhat feels most doable for you in this moment?"
        ];
        return anxietyTips[Math.floor(Math.random() * anxietyTips.length)];
      } else {
        const anxietyResponses = [
          "I can sense there's some anxiety in what you're sharing. 💜 Anxiety can feel so overwhelming, but you're not alone in this feeling.\n\nI'm here with you. Can you tell me a bit more about what's making you feel anxious? Sometimes naming it can help make it feel less scary.",
          "It sounds like you might be feeling anxious or worried about something. 🌊 Those feelings are so real and valid, even when they feel overwhelming.\n\nI'm here to listen and support you. What's going through your mind right now? You don't have to face this alone."
        ];
        return anxietyResponses[Math.floor(Math.random() * anxietyResponses.length)];
      }

    case 'anger':
      if (askingForTips) {
        const angerTips = [
          "I understand you want some ways to work with this anger. Here are some healthy outlets:\n\n🚶 **Movement**: A quick walk or some jumping jacks to channel the energy\n📝 **Express**: Write out your feelings, no filter needed\n🌬️ **Breathe**: 10 deep breaths, focusing on the exhale\n\nWhat feels right for you?",
          "Here are some constructive ways to handle anger:\n\n⏰ **Pause**: Step away for 10 minutes if possible\n🎨 **Create**: Draw, write, or make something with your hands\n💭 **Reframe**: Ask yourself 'What can I control here?'\n\nWhich approach appeals to you most?"
        ];
        return angerTips[Math.floor(Math.random() * angerTips.length)];
      } else {
        const angerResponses = [
          "I can feel the intensity of your emotions. 🔥 Anger often tells us something important - that something you care about feels threatened or hurt.\n\nI'm here to listen. What's behind this anger? Sometimes understanding what's underneath can help us figure out what we need.",
          "It sounds like you're feeling really angry about something. 💪 That energy is telling you that something matters to you, and that's actually important information.\n\nI'm here to hear you out. What's making you feel this way? Your feelings are valid, and I want to understand."
        ];
        return angerResponses[Math.floor(Math.random() * angerResponses.length)];
      }

    case 'positive':
      const positiveResponses = [
        "It's so wonderful to hear some positivity from you! 🌟 Your good energy just brightened my day too. I love seeing you in a good space.\n\nWhat's bringing you the most joy today? I'd love to hear more about what's making you feel good!",
        "Your positive energy is contagious! ✨ I'm genuinely happy that you're feeling good - you deserve these moments of joy.\n\nTell me more about what's going well for you. Sometimes celebrating the good times helps us remember them when we need them most."
      ];
      return positiveResponses[Math.floor(Math.random() * positiveResponses.length)];

    case 'seeking_help':
      const helpResponses = [
        "I'm really glad you're reaching out - that takes courage. 💜 I'm here to help and support you however I can.\n\nWhat's going on that you'd like some guidance with? I'm here to listen and help you work through whatever you're facing.",
        "Thank you for coming to me for help. 🌟 I'm honored that you feel comfortable reaching out, and I want you to know I'm here for you.\n\nWhat would be most helpful right now? I'm here to listen, offer support, or help you think through whatever is on your mind."
      ];
      return helpResponses[Math.floor(Math.random() * helpResponses.length)];

    case 'website_help':
      return "Hi there! I'm so glad you asked! 😊 Welcome to MindMate - I'm your personal mental wellness companion.\n\n**Here's what I can do for you:**\n💬 **Chat**: I'm here 24/7 to listen, support, and provide gentle guidance\n📊 **Mood Tracking**: Track how you're feeling over time to see patterns\n📝 **Journaling**: A private space for your thoughts (with lock feature for extra privacy!)\n📈 **Progress**: See your wellness journey unfold with visual insights\n🏆 **Badges**: Celebrate your self-care milestones and achievements\n⏰ **Reminders**: Set gentle nudges for self-care activities\n🆘 **Crisis Support**: Immediate resources when you need them most\n🎮 **Breathing Games**: Fun, interactive ways to relax and center yourself\n\n**How to use me:** Just talk to me like you would a trusted friend! Share your feelings, ask questions, or tell me about your day. I'm here to listen without judgment and provide support tailored to what you need.\n\nWhat would you like to explore first? I'm excited to be part of your wellness journey! 🌟";

    default:
      const neutralResponses = [
        "I'm really glad you're here talking with me. 💙 This is your safe space, and I'm here to listen to whatever you want to share.\n\nHow are you doing today? What's been on your mind? I'm here for you, no matter what you're going through.",
        "Hi there! 🌸 Thank you for reaching out to me. Whatever brought you here today, I'm glad you took this step.\n\nI'm here to listen and support you. What's going on in your world? How can I be helpful to you today?",
        "Hello! 🌟 I'm MindMate, and I'm genuinely happy you're here. This is your space - free from judgment, full of understanding.\n\nWhat would feel most helpful to talk about right now? I'm here to meet you wherever you are and support you however you need."
      ];
      return neutralResponses[Math.floor(Math.random() * neutralResponses.length)];
  }
};
