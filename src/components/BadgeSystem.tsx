
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Star, Trophy, Target, Heart, Brain, Calendar, MessageCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface BadgeSystemProps {
  user: User;
}

interface UserBadge {
  id: string;
  badge_type: string;
  badge_name: string;
  badge_description: string;
  earned_at: string;
}

interface BadgeDefinition {
  type: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  requirement: string;
}

const BadgeSystem = ({ user }: BadgeSystemProps) => {
  const [earnedBadges, setEarnedBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);

  const availableBadges: BadgeDefinition[] = [
    {
      type: "first_mood",
      name: "First Steps",
      description: "Logged your first mood entry",
      icon: <Heart className="h-6 w-6" />,
      color: "bg-pink-500",
      requirement: "Log 1 mood entry",
    },
    {
      type: "mood_week",
      name: "Week Tracker",
      description: "Tracked mood for 7 days",
      icon: <Calendar className="h-6 w-6" />,
      color: "bg-blue-500",
      requirement: "Log mood for 7 days",
    },
    {
      type: "mood_streak",
      name: "Consistency Champion",
      description: "Maintained a 7-day mood tracking streak",
      icon: <Target className="h-6 w-6" />,
      color: "bg-green-500",
      requirement: "7-day consecutive mood tracking",
    },
    {
      type: "first_journal",
      name: "Thoughtful Writer",
      description: "Wrote your first journal entry",
      icon: <Brain className="h-6 w-6" />,
      color: "bg-purple-500",
      requirement: "Write 1 journal entry",
    },
    {
      type: "journal_enthusiast",
      name: "Journaling Enthusiast",
      description: "Wrote 10 journal entries",
      icon: <Star className="h-6 w-6" />,
      color: "bg-indigo-500",
      requirement: "Write 10 journal entries",
    },
    {
      type: "chat_starter",
      name: "Conversation Starter",
      description: "Sent 25 messages to MindMate",
      icon: <MessageCircle className="h-6 w-6" />,
      color: "bg-orange-500",
      requirement: "Send 25 chat messages",
    },
    {
      type: "wellness_warrior",
      name: "Wellness Warrior",
      description: "Used all MindMate features",
      icon: <Trophy className="h-6 w-6" />,
      color: "bg-yellow-500",
      requirement: "Use mood tracking, journaling, and chat",
    },
    {
      type: "positive_vibes",
      name: "Positive Vibes",
      description: "Maintained an average mood of 4+ for a week",
      icon: <Award className="h-6 w-6" />,
      color: "bg-emerald-500",
      requirement: "Average mood 4+ for 7 days",
    },
  ];

  useEffect(() => {
    fetchBadges();
    checkAndAwardBadges();
  }, []);

  const fetchBadges = async () => {
    try {
      const { data, error } = await supabase
        .from("user_badges")
        .select("*")
        .eq("user_id", user.id)
        .order("earned_at", { ascending: false });

      if (error) throw error;
      setEarnedBadges(data || []);
    } catch (error: any) {
      console.error("Error fetching badges:", error);
    } finally {
      setLoading(false);
    }
  };

  const awardBadge = async (badgeType: string, badgeName: string, badgeDescription: string) => {
    try {
      // Check if badge already earned
      const existing = earnedBadges.find(badge => badge.badge_type === badgeType);
      if (existing) return;

      const { error } = await supabase
        .from("user_badges")
        .insert([
          {
            user_id: user.id,
            badge_type: badgeType,
            badge_name: badgeName,
            badge_description: badgeDescription,
          },
        ]);

      if (error) throw error;

      toast({
        title: "🏆 Badge Earned!",
        description: `You've earned the "${badgeName}" badge!`,
      });

      fetchBadges();
    } catch (error: any) {
      console.error("Error awarding badge:", error);
    }
  };

  const checkAndAwardBadges = async () => {
    try {
      // Get user activity data
      const [moodEntries, journalEntries, chatMessages] = await Promise.all([
        supabase.from("mood_entries").select("*").eq("user_id", user.id),
        supabase.from("journal_entries").select("*").eq("user_id", user.id),
        supabase.from("chat_messages").select("*").eq("user_id", user.id).eq("is_bot", false),
      ]);

      const moodCount = moodEntries.data?.length || 0;
      const journalCount = journalEntries.data?.length || 0;
      const chatCount = chatMessages.data?.length || 0;

      // Check badge requirements
      if (moodCount >= 1) {
        await awardBadge("first_mood", "First Steps", "Logged your first mood entry");
      }

      if (moodCount >= 7) {
        await awardBadge("mood_week", "Week Tracker", "Tracked mood for 7 days");
      }

      if (journalCount >= 1) {
        await awardBadge("first_journal", "Thoughtful Writer", "Wrote your first journal entry");
      }

      if (journalCount >= 10) {
        await awardBadge("journal_enthusiast", "Journaling Enthusiast", "Wrote 10 journal entries");
      }

      if (chatCount >= 25) {
        await awardBadge("chat_starter", "Conversation Starter", "Sent 25 messages to MindMate");
      }

      if (moodCount >= 1 && journalCount >= 1 && chatCount >= 1) {
        await awardBadge("wellness_warrior", "Wellness Warrior", "Used all MindMate features");
      }

      // Check mood streak and positive vibes (simplified logic)
      if (moodEntries.data && moodEntries.data.length >= 7) {
        const recentMoods = moodEntries.data
          .slice(-7)
          .map(entry => entry.mood_level)
          .filter(level => level !== null) as number[];
        
        if (recentMoods.length >= 7) {
          const averageMood = recentMoods.reduce((sum, mood) => sum + mood, 0) / recentMoods.length;
          
          if (averageMood >= 4) {
            await awardBadge("positive_vibes", "Positive Vibes", "Maintained an average mood of 4+ for a week");
          }
        }
      }

    } catch (error: any) {
      console.error("Error checking badges:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const earnedBadgeTypes = earnedBadges.map(badge => badge.badge_type);

  return (
    <div className="space-y-6">
      {/* Earned Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Your Badges ({earnedBadges.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {earnedBadges.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {earnedBadges.map((badge) => {
                const definition = availableBadges.find(def => def.type === badge.badge_type);
                return (
                  <div
                    key={badge.id}
                    className="flex flex-col items-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border-2 border-yellow-200"
                  >
                    <div className={`p-3 rounded-full ${definition?.color || "bg-gray-500"} text-white mb-2`}>
                      {definition?.icon || <Award className="h-6 w-6" />}
                    </div>
                    <h3 className="font-medium text-center text-sm">{badge.badge_name}</h3>
                    <p className="text-xs text-gray-600 text-center mt-1">{badge.badge_description}</p>
                    <Badge variant="outline" className="text-xs mt-2">
                      {new Date(badge.earned_at).toLocaleDateString()}
                    </Badge>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Trophy className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No badges earned yet</p>
              <p className="text-sm text-gray-400 mt-2">Start using MindMate to unlock achievements!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-500" />
            Available Badges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {availableBadges.map((badge) => {
              const isEarned = earnedBadgeTypes.includes(badge.type);
              return (
                <div
                  key={badge.type}
                  className={`flex flex-col items-center p-4 rounded-lg border-2 ${
                    isEarned
                      ? "bg-green-50 border-green-200"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className={`p-3 rounded-full ${isEarned ? badge.color : "bg-gray-400"} text-white mb-2 ${
                    !isEarned && "opacity-60"
                  }`}>
                    {badge.icon}
                  </div>
                  <h3 className={`font-medium text-center text-sm ${!isEarned && "text-gray-600"}`}>
                    {badge.name}
                  </h3>
                  <p className={`text-xs text-center mt-1 ${isEarned ? "text-green-600" : "text-gray-500"}`}>
                    {badge.description}
                  </p>
                  <Badge variant={isEarned ? "default" : "secondary"} className="text-xs mt-2">
                    {isEarned ? "Earned!" : badge.requirement}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BadgeSystem;
