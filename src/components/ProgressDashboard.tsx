
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Calendar, TrendingUp, BookOpen, MessageCircle, Award } from "lucide-react";

interface ProgressDashboardProps {
  user: User;
}

interface MoodData {
  date: string;
  mood: number;
}

interface StatsData {
  totalMoodEntries: number;
  totalJournalEntries: number;
  totalChatMessages: number;
  totalBadges: number;
  averageMood: number;
  streakDays: number;
}

const ProgressDashboard = ({ user }: ProgressDashboardProps) => {
  const [moodData, setMoodData] = useState<MoodData[]>([]);
  const [stats, setStats] = useState<StatsData>({
    totalMoodEntries: 0,
    totalJournalEntries: 0,
    totalChatMessages: 0,
    totalBadges: 0,
    averageMood: 0,
    streakDays: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgressData();
  }, []);

  const fetchProgressData = async () => {
    try {
      // Fetch mood data for the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: moodEntries, error: moodError } = await supabase
        .from("mood_entries")
        .select("mood_level, created_at")
        .eq("user_id", user.id)
        .gte("created_at", sevenDaysAgo.toISOString())
        .order("created_at", { ascending: true });

      if (moodError) throw moodError;

      // Process mood data for chart
      const chartData: MoodData[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];
        
        const dayEntries = moodEntries?.filter(entry => 
          entry.created_at.startsWith(dateStr)
        ) || [];
        
        const averageMood = dayEntries.length > 0
          ? dayEntries.reduce((sum, entry) => sum + entry.mood_level, 0) / dayEntries.length
          : 0;

        chartData.push({
          date: date.toLocaleDateString("en-US", { weekday: "short" }),
          mood: Math.round(averageMood * 10) / 10,
        });
      }
      setMoodData(chartData);

      // Fetch overall stats
      const [moodCount, journalCount, chatCount, badgeCount] = await Promise.all([
        supabase.from("mood_entries").select("*", { count: "exact" }).eq("user_id", user.id),
        supabase.from("journal_entries").select("*", { count: "exact" }).eq("user_id", user.id),
        supabase.from("chat_messages").select("*", { count: "exact" }).eq("user_id", user.id).eq("is_bot", false),
        supabase.from("user_badges").select("*", { count: "exact" }).eq("user_id", user.id),
      ]);

      // Calculate average mood
      const { data: allMoodEntries } = await supabase
        .from("mood_entries")
        .select("mood_level")
        .eq("user_id", user.id);

      const averageMood = allMoodEntries && allMoodEntries.length > 0
        ? allMoodEntries.reduce((sum, entry) => sum + entry.mood_level, 0) / allMoodEntries.length
        : 0;

      // Calculate streak (simplified - consecutive days with mood entries)
      let streakDays = 0;
      const today = new Date();
      for (let i = 0; i < 30; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() - i);
        const dateStr = checkDate.toISOString().split("T")[0];
        
        const hasEntry = moodEntries?.some(entry => 
          entry.created_at.startsWith(dateStr)
        );
        
        if (hasEntry) {
          streakDays++;
        } else {
          break;
        }
      }

      setStats({
        totalMoodEntries: moodCount.count || 0,
        totalJournalEntries: journalCount.count || 0,
        totalChatMessages: chatCount.count || 0,
        totalBadges: badgeCount.count || 0,
        averageMood: Math.round(averageMood * 10) / 10,
        streakDays,
      });

    } catch (error: any) {
      console.error("Error fetching progress data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-600">{stats.totalMoodEntries}</p>
                <p className="text-sm text-gray-600">Mood Entries</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.totalJournalEntries}</p>
                <p className="text-sm text-gray-600">Journal Entries</p>
              </div>
              <BookOpen className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-purple-600">{stats.totalChatMessages}</p>
                <p className="text-sm text-gray-600">Chat Messages</p>
              </div>
              <MessageCircle className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-yellow-600">{stats.totalBadges}</p>
                <p className="text-sm text-gray-600">Badges Earned</p>
              </div>
              <Award className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Mood Trend */}
        <Card>
          <CardHeader>
            <CardTitle>7-Day Mood Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={moodData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="mood" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={moodData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="mood" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Insights */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Wellness Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Average Mood</span>
              <Badge variant={stats.averageMood >= 4 ? "default" : stats.averageMood >= 3 ? "secondary" : "destructive"}>
                {stats.averageMood}/5
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Current Streak</span>
              <Badge variant="outline">
                {stats.streakDays} days
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Engagement Level</span>
              <Badge variant={stats.totalChatMessages > 50 ? "default" : "secondary"}>
                {stats.totalChatMessages > 50 ? "High" : stats.totalChatMessages > 20 ? "Medium" : "Getting Started"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.totalMoodEntries >= 7 && (
                <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Week Tracker - 7 mood entries</span>
                </div>
              )}
              {stats.totalJournalEntries >= 5 && (
                <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                  <BookOpen className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Journaling Enthusiast - 5 entries</span>
                </div>
              )}
              {stats.totalChatMessages >= 25 && (
                <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
                  <MessageCircle className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">Conversation Starter - 25 messages</span>
                </div>
              )}
              {stats.streakDays >= 3 && (
                <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
                  <Award className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Consistency Champion - 3 day streak</span>
                </div>
              )}
              {stats.totalMoodEntries === 0 && stats.totalJournalEntries === 0 && (
                <div className="text-center text-gray-500 py-4">
                  Start tracking your mood and journaling to unlock achievements!
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProgressDashboard;
