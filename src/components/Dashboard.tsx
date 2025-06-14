
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, MessageCircle, BookOpen, TrendingUp, Award, Calendar, HeartHandshake, Gamepad2, User as UserIcon } from "lucide-react";
import ChatBot from "@/components/ChatBot";
import MoodTracker from "@/components/MoodTracker";
import Journal from "@/components/Journal";
import ProgressDashboard from "@/components/ProgressDashboard";
import BadgeSystem from "@/components/BadgeSystem";
import RemindersManager from "@/components/RemindersManager";
import CrisisSupport from "@/components/CrisisSupport";
import BreathingGame from "@/components/BreathingGame";
import { toast } from "@/hooks/use-toast";

interface DashboardProps {
  user: User;
}

const Dashboard = ({ user }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState("chat");
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    // Greet user when they login
    const username = user.user_metadata?.username || user.email?.split('@')[0] || 'there';
    toast({
      title: `Welcome back, ${username}! 🌟`,
      description: "Ready to continue your mental wellness journey?",
    });

    // Fetch user profile
    fetchUserProfile();
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      setUserProfile(profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out successfully",
      description: "Take care and remember - you're never alone! 💜",
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    const username = userProfile?.username || user.user_metadata?.username || user.email?.split('@')[0] || 'Friend';
    
    if (hour < 12) return `Good morning, ${username}! ☀️`;
    if (hour < 17) return `Good afternoon, ${username}! 🌤️`;
    return `Good evening, ${username}! 🌙`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-purple-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  MindMate
                </h1>
                <p className="text-sm text-gray-600">Your AI Mental Health Companion</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-700">
                  {getGreeting()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <UserIcon className="h-4 w-4 text-purple-600" />
                </div>
                <Button variant="outline" onClick={handleSignOut} className="hover:bg-purple-50">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Welcome Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">{getGreeting()}</h2>
                <p className="text-purple-100">
                  How are you feeling today? I'm here to support your mental wellness journey. 💜
                </p>
              </div>
              <div className="hidden sm:block">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <UserIcon className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 bg-white/70 backdrop-blur-sm border shadow-sm">
            <TabsTrigger value="chat" className="flex items-center gap-2 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700">
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Chat</span>
            </TabsTrigger>
            <TabsTrigger value="mood" className="flex items-center gap-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Mood</span>
            </TabsTrigger>
            <TabsTrigger value="journal" className="flex items-center gap-2 data-[state=active]:bg-green-100 data-[state=active]:text-green-700">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Journal</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Progress</span>
            </TabsTrigger>
            <TabsTrigger value="badges" className="flex items-center gap-2 data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-700">
              <Award className="h-4 w-4" />
              <span className="hidden sm:inline">Badges</span>
            </TabsTrigger>
            <TabsTrigger value="reminders" className="flex items-center gap-2 data-[state=active]:bg-pink-100 data-[state=active]:text-pink-700">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Reminders</span>
            </TabsTrigger>
            <TabsTrigger value="crisis" className="flex items-center gap-2 data-[state=active]:bg-red-100 data-[state=active]:text-red-700">
              <HeartHandshake className="h-4 w-4" />
              <span className="hidden sm:inline">Crisis</span>
            </TabsTrigger>
            <TabsTrigger value="games" className="flex items-center gap-2 data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700">
              <Gamepad2 className="h-4 w-4" />
              <span className="hidden sm:inline">Games</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat">
            <ChatBot user={user} />
          </TabsContent>

          <TabsContent value="mood">
            <MoodTracker user={user} />
          </TabsContent>

          <TabsContent value="journal">
            <Journal user={user} />
          </TabsContent>

          <TabsContent value="progress">
            <ProgressDashboard user={user} />
          </TabsContent>

          <TabsContent value="badges">
            <BadgeSystem user={user} />
          </TabsContent>

          <TabsContent value="reminders">
            <RemindersManager user={user} />
          </TabsContent>

          <TabsContent value="crisis">
            <CrisisSupport />
          </TabsContent>

          <TabsContent value="games">
            <BreathingGame user={user} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
