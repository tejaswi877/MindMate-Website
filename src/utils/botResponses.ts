
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

    case 'coping_strategies':
      const copingStrategies = [
        "I'd love to share some effective coping strategies with you! Here are some evidence-based techniques:\n\n🌬️ **Breathing Techniques:**\n• Box breathing: In for 4, hold for 4, out for 4, hold for 4\n• Deep belly breathing for instant calm\n\n🧠 **Grounding (5-4-3-2-1):**\n• 5 things you can see\n• 4 things you can touch\n• 3 things you can hear\n• 2 things you can smell\n• 1 thing you can taste\n\n💪 **Physical Release:**\n• Progressive muscle relaxation\n• Gentle stretching or yoga\n• Short walk outside\n\n🎵 **Sensory Comfort:**\n• Calming music or nature sounds\n• Warm shower or cold water on wrists\n• Comfort items (soft blanket, tea)\n\nWhich of these resonates with you? I can guide you through any technique!",
        
        "Here are some powerful coping strategies for different situations:\n\n🌟 **For Stress:**\n• Time-blocking and prioritizing tasks\n• Regular breaks (even 2-minute breathing breaks)\n• Saying 'no' to protect your energy\n\n💙 **For Anxiety:**\n• Challenge worry thoughts: 'Is this likely? Can I control it?'\n• Create a worry time (15 mins daily to process anxious thoughts)\n• Focus on what you can control right now\n\n🌱 **For Low Mood:**\n• Small accomplishments (make bed, drink water)\n• Connect with one person who cares\n• Gentle movement or sunlight\n\n🔥 **For Anger:**\n• Pause before reacting (count to 10)\n• Physical release (punch a pillow, fast walk)\n• Express in writing first\n\nWhat specific situation would you like help with?",
        
        "Let me share some quick daily coping tools you can use:\n\n⏰ **Morning Reset (5 mins):**\n• 3 deep breaths\n• Set one small intention\n• Notice something you're grateful for\n\n🌟 **Midday Check-in:**\n• How am I feeling right now?\n• What do I need in this moment?\n• One kind thing I can do for myself\n\n🌙 **Evening Wind-down:**\n• What went well today?\n• Release what didn't serve me\n• Prepare for rest\n\n🆘 **Emergency Toolkit:**\n• Ice cube on wrists for immediate grounding\n• Call/text a trusted friend\n• Listen to a favorite calming song\n• MindMate's breathing games!\n\nWould you like me to walk you through any of these techniques step by step?"
      ];
      return copingStrategies[Math.floor(Math.random() * copingStrategies.length)];

    case 'situational_help':
      const situationalResponses = [
        "I'm here to help you work through whatever situation you're facing. 🤝 Every challenge has a path forward, even when it feels overwhelming.\n\n**Let's break this down together:**\n• What's the main issue you're dealing with?\n• What aspects feel most stressful or difficult?\n• What would a positive outcome look like for you?\n• What resources or support do you have available?\n\nSometimes just talking through a situation can help us see new perspectives and solutions. I'm here to listen and help you think through your options. What's going on?",
        
        "It sounds like you're navigating something challenging right now. 💪 That takes courage, and I want to help you find a way forward.\n\n**Here's how we can approach this:**\n1️⃣ **Clarify the situation** - What exactly is happening?\n2️⃣ **Identify what you can control** - What's within your power to change?\n3️⃣ **Explore your options** - What different approaches could you try?\n4️⃣ **Consider support** - Who or what could help you?\n5️⃣ **Take one small step** - What's one thing you could do today?\n\nRemember: You don't have to solve everything at once. Small steps can lead to big changes. What situation would you like to talk through?",
        
        "I can sense you're dealing with something difficult, and I want you to know that seeking guidance shows real strength. 🌟\n\n**Common situations I can help with:**\n• Work/school stress and conflicts\n• Relationship challenges\n• Family dynamics\n• Life transitions and changes\n• Decision-making dilemmas\n• Communication problems\n• Setting boundaries\n\n**My approach:**\n• Listen without judgment\n• Help you explore your feelings and options\n• Offer different perspectives\n• Suggest practical strategies\n• Support you in finding your own solutions\n\nWhat specific situation would you like to explore together? I'm here to support you through this."
      ];
      return situationalResponses[Math.floor(Math.random() * situationalResponses.length)];

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
      return "Hi there! I'm so glad you asked! 😊 Welcome to **MindMate** - your comprehensive mental wellness companion!\n\n**🌟 Core Features:**\n💬 **AI Chat Support**: I'm here 24/7 to listen, provide emotional support, and offer personalized guidance\n📊 **Mood Tracking**: Monitor your emotional patterns and see insights over time\n📝 **Private Journaling**: Secure space for your thoughts with lock feature for extra privacy\n📈 **Progress Analytics**: Visual insights into your wellness journey and growth\n🏆 **Achievement Badges**: Celebrate your self-care milestones and consistency\n⏰ **Smart Reminders**: Gentle nudges for self-care activities and check-ins\n🆘 **Crisis Support**: Immediate access to professional help resources\n🎮 **Breathing Games**: Interactive relaxation exercises and mindfulness activities\n\n**🤖 What I Can Help You With:**\n• Emotional support and active listening\n• Coping strategies for stress, anxiety, depression, and anger\n• Situational advice and problem-solving guidance\n• Mental health tips and techniques\n• Crisis support and resource connections\n• Daily wellness check-ins and motivation\n• Breathing exercises and grounding techniques\n\n**💡 How to Use MindMate:**\nJust talk to me naturally! Share your feelings, ask questions, request coping strategies, or tell me about your day. I adapt my responses to what you need - whether that's a listening ear, practical advice, or immediate support.\n\n**🔒 Your Privacy Matters:**\nAll conversations are confidential, and your journal entries are encrypted. You control your data completely.\n\nWhat would you like to explore first? I'm excited to support your mental wellness journey! 🌈✨";

    default:
      const neutralResponses = [
        "I'm really glad you're here talking with me. 💙 This is your safe space, and I'm here to listen to whatever you want to share.\n\nHow are you doing today? What's been on your mind? I'm here for you, no matter what you're going through.",
        "Hi there! 🌸 Thank you for reaching out to me. Whatever brought you here today, I'm glad you took this step.\n\nI'm here to listen and support you. What's going on in your world? How can I be helpful to you today?",
        "Hello! 🌟 I'm MindMate, and I'm genuinely happy you're here. This is your space - free from judgment, full of understanding.\n\nWhat would feel most helpful to talk about right now? I'm here to meet you wherever you are and support you however you need."
      ];
      return neutralResponses[Math.floor(Math.random() * neutralResponses.length)];
  }
};
