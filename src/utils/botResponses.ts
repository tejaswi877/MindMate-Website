
import { analyzeEmotion } from './emotionAnalysis';

const getSpecificFeatureResponse = (userMessage: string): string => {
  const lowerMessage = userMessage.toLowerCase();
  
  if (/chat|chatbot|ai chat/.test(lowerMessage)) {
    return "💬 **AI Chat Support - Your 24/7 Companion**\n\nI'm here to provide emotional support and guidance whenever you need it! Here's how our chat works:\n\n**🤖 What I Can Do:**\n• Listen without judgment to whatever you want to share\n• Detect emotions in your messages and respond appropriately\n• Provide coping strategies for stress, anxiety, depression, and anger\n• Offer situational advice and problem-solving guidance\n• Give immediate crisis support and resources\n• Help with breathing exercises and grounding techniques\n\n**💜 How It Works:**\n• Just talk to me naturally - share your feelings, thoughts, or ask questions\n• I analyze the emotion in your message and adapt my response\n• All conversations are private and stored securely\n• You can start new chat sessions anytime\n• Access your previous conversations through chat history\n\n**🌟 Special Features:**\n• Crisis detection with immediate support resources\n• Personalized coping strategies based on your needs\n• Gentle, empathetic responses tailored to your emotional state\n• Available 24/7 whenever you need someone to talk to\n\nFeel free to share anything that's on your mind - I'm here for you! 💙";
  }
  
  if (/mood.*(tracking|tracker)/.test(lowerMessage)) {
    return "📊 **Mood Tracking - Monitor Your Emotional Patterns**\n\nTrack your daily moods to better understand your emotional patterns and triggers!\n\n**🎯 How It Works:**\n• Rate your mood on a scale from 1-10 daily\n• Add optional notes about what influenced your mood\n• Choose from various mood descriptions\n• View your mood trends over time with beautiful charts\n\n**📈 What You'll Discover:**\n• Patterns in your emotional well-being\n• Triggers that affect your mood\n• Progress over time\n• Correlation between activities and feelings\n\n**🌟 Benefits:**\n• Increased self-awareness\n• Better understanding of your emotional cycles\n• Data to share with healthcare providers\n• Motivation to maintain positive habits\n\n**🎨 Visual Insights:**\n• Colorful mood charts and graphs\n• Weekly and monthly mood summaries\n• Trend analysis to spot patterns\n• Export data for external use\n\nStart tracking today to gain valuable insights into your emotional journey! 🌈";
  }
  
  if (/journal|journaling/.test(lowerMessage)) {
    return "📝 **Private Journaling - Your Secure Digital Diary**\n\nExpress your thoughts and feelings in a completely private, secure space designed just for you!\n\n**🔒 Privacy & Security:**\n• End-to-end encryption for all entries\n• Optional lock feature for extra privacy\n• Only you can access your journal\n• Secure cloud storage with Supabase\n\n**✍️ Journaling Features:**\n• Write unlimited entries\n• Add custom titles to organize thoughts\n• Date and time stamps for every entry\n• Rich text formatting capabilities\n• Search through your entries\n\n**🌟 Mental Health Benefits:**\n• Process emotions and experiences\n• Track personal growth over time\n• Reduce stress through written expression\n• Improve self-reflection and awareness\n• Document your mental health journey\n\n**💡 Journaling Tips:**\n• Write regularly, even if just a few sentences\n• Be honest and authentic\n• Use it to work through difficult emotions\n• Celebrate positive moments and achievements\n• Review past entries to see your progress\n\nYour thoughts deserve a safe space - start journaling today! 📖✨";
  }
  
  if (/breathing.*(games|exercises)/.test(lowerMessage)) {
    return "🌬️ **Breathing Games - Interactive Relaxation**\n\nCalm your mind and body with our engaging breathing exercises designed to reduce stress and anxiety!\n\n**🎮 Interactive Features:**\n• Visual breathing guides with animations\n• Different breathing patterns for various needs\n• Timed sessions from 1-10 minutes\n• Calming background sounds and visuals\n• Progress tracking for consistency\n\n**💨 Breathing Techniques Available:**\n• **Box Breathing**: 4-4-4-4 pattern for stress relief\n• **Deep Belly Breathing**: For instant calm\n• **4-7-8 Technique**: Perfect for sleep preparation\n• **Coherent Breathing**: 5-second in, 5-second out\n• **Energizing Breath**: Morning activation technique\n\n**🎯 When to Use:**\n• Feeling anxious or overwhelmed\n• Before important meetings or events\n• When you can't sleep\n• During panic attacks\n• For daily mindfulness practice\n\n**🌟 Benefits:**\n• Immediate stress reduction\n• Improved focus and clarity\n• Better emotional regulation\n• Enhanced sleep quality\n• Increased mindfulness\n\n**🏆 Gamification:**\n• Earn badges for consistency\n• Track your breathing sessions\n• Set daily breathing goals\n• Share achievements (optional)\n\nTake a deep breath and start your relaxation journey! 🧘‍♀️✨";
  }
  
  if (/badges|achievements/.test(lowerMessage)) {
    return "🏆 **Achievement Badges - Celebrate Your Progress**\n\nEarn meaningful badges as you progress on your mental wellness journey and celebrate every step forward!\n\n**🎖️ Badge Categories:**\n• **Consistency Badges**: Daily check-ins, regular journaling\n• **Milestone Badges**: 7-day streaks, 30-day challenges\n• **Growth Badges**: Mood improvements, coping skill usage\n• **Community Badges**: Sharing positivity, helping others\n• **Wellness Badges**: Completing breathing exercises, self-care activities\n\n**🌟 How to Earn Badges:**\n• Chat regularly with MindMate\n• Complete daily mood tracking\n• Write journal entries consistently\n• Practice breathing exercises\n• Use coping strategies we suggest\n• Maintain positive habits\n\n**🎯 Sample Achievements:**\n• **First Steps**: Complete your first mood entry\n• **Consistent Tracker**: 7 days of mood logging\n• **Mindful Moments**: 10 breathing sessions completed\n• **Reflection Master**: 30 journal entries written\n• **Emotional Warrior**: Use 5 different coping strategies\n\n**💪 Why Badges Matter:**\n• Visual representation of your progress\n• Motivation to maintain healthy habits\n• Recognition of your hard work\n• Boosted confidence and self-esteem\n• Tangible proof of your mental health journey\n\n**🌈 Special Features:**\n• Beautiful badge designs\n• Share achievements with trusted friends (optional)\n• Badge collection gallery\n• Progress tracking towards next badge\n\nEvery small step counts - start earning your first badge today! ⭐";
  }
  
  if (/reminders/.test(lowerMessage)) {
    return "⏰ **Smart Reminders - Never Miss Your Self-Care**\n\nSet personalized reminders to maintain your mental wellness routine and build healthy habits!\n\n**🔔 Reminder Types:**\n• **Mood Check-ins**: Daily emotional awareness\n• **Journaling Prompts**: Regular self-reflection time\n• **Breathing Breaks**: Mindfulness moments throughout the day\n• **Self-Care Activities**: Custom wellness activities\n• **Medication Reminders**: Important health routines\n• **Gratitude Practice**: Daily positivity boosts\n\n**⚙️ Customization Options:**\n• Set specific times for each reminder\n• Choose frequency (daily, weekly, custom)\n• Personalize reminder messages\n• Set different tones for different activities\n• Enable/disable reminders as needed\n\n**📱 Smart Features:**\n• Gentle, encouraging reminder messages\n• Snooze options for flexibility\n• Progress tracking for each reminder type\n• Adaptive timing based on your patterns\n• Integration with all MindMate features\n\n**🌟 Popular Reminder Examples:**\n• \"Time for your daily mood check-in! How are you feeling? 💙\"\n• \"Take a moment to breathe deeply and center yourself 🌬️\"\n• \"Your journal is waiting for your thoughts today 📝\"\n• \"Remember to practice gratitude - what made you smile today? 😊\"\n\n**💡 Tips for Success:**\n• Start with just 1-2 reminders\n• Choose realistic times that work for your schedule\n• Be consistent for at least 21 days to build habits\n• Adjust timing as you learn your preferences\n\nBuilding healthy habits one reminder at a time! 🌱✨";
  }
  
  if (/progress.*(tracking|analytics)/.test(lowerMessage)) {
    return "📈 **Progress Analytics - Track Your Mental Wellness Journey**\n\nVisualize your mental health progress with comprehensive analytics and insights!\n\n**📊 What We Track:**\n• **Mood Trends**: Daily/weekly/monthly mood patterns\n• **Chat Activity**: Frequency and sentiment of conversations\n• **Journal Consistency**: Writing habits and reflection patterns\n• **Breathing Practice**: Session frequency and duration\n• **Badge Progress**: Achievements and milestone tracking\n• **Coping Strategy Usage**: Which techniques work best for you\n\n**🎨 Visual Dashboards:**\n• Beautiful charts and graphs\n• Color-coded mood calendars\n• Progress bars for goals\n• Trend lines showing improvement\n• Weekly/monthly summary reports\n\n**🔍 Insights & Analysis:**\n• Identify patterns in your emotional well-being\n• Discover what activities boost your mood\n• Track consistency in self-care practices\n• Monitor emotional regulation improvements\n• See correlation between activities and mood\n\n**📋 Reports Available:**\n• **Weekly Wellness Summary**: Overview of your week\n• **Monthly Progress Report**: Detailed monthly analysis\n• **Mood Pattern Analysis**: Deep dive into emotional trends\n• **Activity Impact Report**: How different activities affect you\n• **Achievement Timeline**: Your badge and milestone history\n\n**🎯 Goal Setting & Monitoring:**\n• Set personal wellness goals\n• Track progress towards objectives\n• Celebrate milestones reached\n• Adjust goals based on insights\n\n**💡 Privacy Note:**\n• All data is private and encrypted\n• You control what information is tracked\n• Export data for healthcare providers if desired\n• Delete any data anytime\n\nYour mental wellness journey deserves to be celebrated - see how far you've come! 🌟📊";
  }
  
  if (/crisis.*(support|help)/.test(lowerMessage)) {
    return "🆘 **Crisis Support - Immediate Help When You Need It Most**\n\nWe take your safety seriously and provide immediate access to professional crisis support resources.\n\n**🚨 Immediate Crisis Resources:**\n• **National Suicide Prevention Lifeline**: **988**\n• **Crisis Text Line**: Text HOME to **741741**\n• **Emergency Services**: **911**\n• **International Crisis Lines**: Available for global users\n\n**🤖 AI Crisis Detection:**\n• Our AI automatically detects crisis language in your messages\n• Immediate response with support resources\n• Gentle, supportive guidance during difficult moments\n• No judgment, just immediate help and connection\n\n**📞 24/7 Professional Support:**\n• Trained crisis counselors available anytime\n• Text, call, or chat options\n• Confidential and free services\n• Specialized support for different age groups\n\n**💜 MindMate Crisis Features:**\n• Instant crisis resource display\n• Emergency contact integration\n• Safety planning tools\n• Follow-up check-ins after crisis episodes\n• Connection to local mental health services\n\n**🛡️ Safety Planning:**\n• Identify personal warning signs\n• Create coping strategies list\n• Emergency contact information\n• Safe environment planning\n• Professional support contacts\n\n**🌟 Remember:**\n• You are not alone in this\n• Crisis feelings are temporary\n• Professional help is available 24/7\n• Your life has value and meaning\n• Recovery and healing are possible\n\n**Important**: If you're having thoughts of self-harm, please reach out immediately to **988** or **911**. You deserve support and care. 💙\n\nWe're here for you, always. 🤗";
  }
  
  // Default response for unmatched specific features
  return "I'd be happy to tell you more about that feature! Could you be more specific about which aspect of MindMate you'd like to learn about? I can explain:\n\n• 💬 **Chat Support** - How our AI conversation works\n• 📊 **Mood Tracking** - Daily emotional monitoring\n• 📝 **Journaling** - Private, secure writing space\n• 🌬️ **Breathing Games** - Interactive relaxation exercises\n• 🏆 **Achievement Badges** - Progress celebration system\n• ⏰ **Smart Reminders** - Wellness routine support\n• 📈 **Progress Analytics** - Track your mental health journey\n• 🆘 **Crisis Support** - Immediate help resources\n\nJust ask about any specific feature and I'll give you all the details! 🌟";
};

export const generateBotResponse = (userMessage: string): string => {
  const emotion = analyzeEmotion(userMessage);
  const lowerMessage = userMessage.toLowerCase();
  console.log('Detected emotion:', emotion);
  
  // Check if user is asking for tips/advice specifically
  const askingForTips = /\b(tips?|advice|help|suggest|what should i do|how to|strategies|coping|ways to)\b/.test(lowerMessage);
  
  switch (emotion) {
    case 'crisis':
      return "I'm really worried about you right now, and I want you to know that your life has immense value. 💜 Please reach out for immediate help:\n\n🚨 **Crisis Support:**\n• National Suicide Prevention Lifeline: **988**\n• Crisis Text Line: Text HOME to **741741**\n• Emergency Services: **911**\n\nYou don't have to face this alone. There are people who care about you and want to help. Can you reach out to someone you trust right now? I'm here with you.";

    case 'specific_feature':
      return getSpecificFeatureResponse(userMessage);

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
      return "Hi there! I'm so glad you asked! 😊 Welcome to **MindMate** - your comprehensive mental wellness companion!\n\n**🌟 Core Features:**\n💬 **AI Chat Support**: I'm here 24/7 to listen, provide emotional support, and offer personalized guidance\n📊 **Mood Tracking**: Monitor your emotional patterns and see insights over time\n📝 **Private Journaling**: Secure space for your thoughts with lock feature for extra privacy\n📈 **Progress Analytics**: Visual insights into your wellness journey and growth\n🏆 **Achievement Badges**: Celebrate your self-care milestones and consistency\n⏰ **Smart Reminders**: Gentle nudges for self-care activities and check-ins\n🆘 **Crisis Support**: Immediate access to professional help resources\n🎮 **Breathing Games**: Interactive relaxation exercises and mindfulness activities\n\n**🤖 What I Can Help You With:**\n• Emotional support and active listening\n• Coping strategies for stress, anxiety, depression, and anger\n• Situational advice and problem-solving guidance\n• Mental health tips and techniques\n• Crisis support and resource connections\n• Daily wellness check-ins and motivation\n• Breathing exercises and grounding techniques\n\n**💡 How to Use MindMate:**\nJust talk to me naturally! Share your feelings, ask questions, request coping strategies, or tell me about your day. I adapt my responses to what you need - whether that's a listening ear, practical advice, or immediate support.\n\n**🔒 Your Privacy Matters:**\nAll conversations are confidential, and your journal entries are encrypted. You control your data completely.\n\nWhat would you like to explore first? I'm excited to support your mental wellness journey! 🌈✨\n\n*Tip: Try asking me about specific features like \"How does mood tracking work?\" or \"Tell me about breathing games\" for detailed explanations!*";

    default:
      const neutralResponses = [
        "I'm really glad you're here talking with me. 💙 This is your safe space, and I'm here to listen to whatever you want to share.\n\nHow are you doing today? What's been on your mind? I'm here for you, no matter what you're going through.",
        "Hi there! 🌸 Thank you for reaching out to me. Whatever brought you here today, I'm glad you took this step.\n\nI'm here to listen and support you. What's going on in your world? How can I be helpful to you today?",
        "Hello! 🌟 I'm MindMate, and I'm genuinely happy you're here. This is your space - free from judgment, full of understanding.\n\nWhat would feel most helpful to talk about right now? I'm here to meet you wherever you are and support you however you need."
      ];
      return neutralResponses[Math.floor(Math.random() * neutralResponses.length)];
  }
};
