
import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, MessageCircle, BookOpen, TrendingUp, Award, Calendar, HeartHandshake, Gamepad2 } from "lucide-react";
import ChatBot from "@/components/ChatBot";
import MoodTracker from "@/components/MoodTracker";
import Journal from "@/components/Journal";
import ProgressDashboard from "@/components/ProgressDashboard";
import BadgeSystem from "@/components/BadgeSystem";
import RemindersManager from "@/components/RemindersManager";
import CrisisSupport from "@/components/CrisisSupport";
import BreathingGame from "@/components/BreathingGame";

interface DashboardProps {
  user: User;
}

const Dashboard = ({ user }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState("chat");

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MindMate
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user.user_metadata?.username || user.email}
              </span>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 bg-white/50 backdrop-blur-sm">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Chat</span>
            </TabsTrigger>
            <TabsTrigger value="mood" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Mood</span>
            </TabsTrigger>
            <TabsTrigger value="journal" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Journal</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Progress</span>
            </TabsTrigger>
            <TabsTrigger value="badges" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              <span className="hidden sm:inline">Badges</span>
            </TabsTrigger>
            <TabsTrigger value="reminders" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Reminders</span>
            </TabsTrigger>
            <TabsTrigger value="crisis" className="flex items-center gap-2">
              <HeartHandshake className="h-4 w-4" />
              <span className="hidden sm:inline">Crisis</span>
            </TabsTrigger>
            <TabsTrigger value="games" className="flex items-center gap-2">
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
