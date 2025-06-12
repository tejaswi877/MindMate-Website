
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface MoodTrackerProps {
  user: User;
}

interface MoodEntry {
  id: string;
  mood_level: number;
  mood_description: string;
  notes: string;
  created_at: string;
}

const MoodTracker = ({ user }: MoodTrackerProps) => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [moodDescription, setMoodDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [recentEntries, setRecentEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const moodLevels = [
    { level: 1, emoji: "😢", label: "Very Low", color: "bg-red-500" },
    { level: 2, emoji: "😔", label: "Low", color: "bg-orange-500" },
    { level: 3, emoji: "😐", label: "Neutral", color: "bg-yellow-500" },
    { level: 4, emoji: "😊", label: "Good", color: "bg-green-500" },
    { level: 5, emoji: "😄", label: "Excellent", color: "bg-blue-500" },
  ];

  useEffect(() => {
    fetchRecentEntries();
  }, []);

  const fetchRecentEntries = async () => {
    try {
      const { data, error } = await supabase
        .from("mood_entries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(7);

      if (error) throw error;
      setRecentEntries(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch mood entries",
        variant: "destructive",
      });
    }
  };

  const handleSubmitMood = async () => {
    if (!selectedMood) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("mood_entries")
        .insert([
          {
            user_id: user.id,
            mood_level: selectedMood,
            mood_description: moodDescription,
            notes: notes,
          },
        ]);

      if (error) throw error;

      toast({
        title: "Mood Logged! 📊",
        description: "Your mood has been recorded successfully.",
      });

      // Reset form
      setSelectedMood(null);
      setMoodDescription("");
      setNotes("");
      
      // Refresh entries
      fetchRecentEntries();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to log mood",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const averageMood = recentEntries.length > 0 
    ? (recentEntries.reduce((sum, entry) => sum + entry.mood_level, 0) / recentEntries.length).toFixed(1)
    : "0";

  return (
    <div className="space-y-6">
      {/* Mood Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            How are you feeling today?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mood Selection */}
          <div>
            <h3 className="text-lg font-medium mb-3">Select your mood level:</h3>
            <div className="grid grid-cols-5 gap-3">
              {moodLevels.map((mood) => (
                <button
                  key={mood.level}
                  onClick={() => setSelectedMood(mood.level)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedMood === mood.level
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-3xl mb-2">{mood.emoji}</div>
                  <div className="text-sm font-medium">{mood.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Mood Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Describe your mood (optional):
            </label>
            <input
              type="text"
              value={moodDescription}
              onChange={(e) => setMoodDescription(e.target.value)}
              placeholder="e.g., Feeling anxious about work..."
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Additional notes (optional):
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What contributed to this mood? Any thoughts or events..."
              rows={3}
            />
          </div>

          <Button 
            onClick={handleSubmitMood} 
            disabled={!selectedMood || loading}
            className="w-full"
          >
            {loading ? "Logging..." : "Log Mood"}
          </Button>
        </CardContent>
      </Card>

      {/* Recent Entries & Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Your Mood Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{averageMood}</div>
                <div className="text-sm text-gray-600">Average mood (last 7 days)</div>
              </div>
              <div className="grid grid-cols-5 gap-1">
                {moodLevels.map((mood) => {
                  const count = recentEntries.filter(entry => entry.mood_level === mood.level).length;
                  return (
                    <div key={mood.level} className="text-center">
                      <div className={`h-2 ${mood.color} rounded-full mb-1`} 
                           style={{ opacity: count > 0 ? 1 : 0.2 }}></div>
                      <div className="text-xs">{count}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Entries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Entries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentEntries.slice(0, 5).map((entry) => {
                const mood = moodLevels.find(m => m.level === entry.mood_level);
                return (
                  <div key={entry.id} className="flex items-center justify-between p-2 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{mood?.emoji}</span>
                      <div>
                        <div className="font-medium">{mood?.label}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(entry.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    {entry.mood_description && (
                      <Badge variant="outline" className="text-xs">
                        {entry.mood_description}
                      </Badge>
                    )}
                  </div>
                );
              })}
              {recentEntries.length === 0 && (
                <div className="text-center text-gray-500 py-4">
                  No mood entries yet. Start tracking your mood today!
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MoodTracker;
