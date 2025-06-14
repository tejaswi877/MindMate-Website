
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LogOut, MessageCircle, Bot } from "lucide-react";
import ChatBot from "@/components/ChatBot";
import { toast } from "@/hooks/use-toast";

interface DashboardProps {
  user: User;
}

const Dashboard = ({ user }: DashboardProps) => {
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const username = user.user_metadata?.username || user.email?.split('@')[0] || 'there';
    toast({
      title: `Welcome ${username}! 🌟`,
      description: "Ready to continue your mental wellness journey?",
    });

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
                <Bot className="h-6 w-6 text-white" />
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
              <Button variant="outline" onClick={handleSignOut} className="hover:bg-purple-50">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
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
                <p className="text-purple-100 text-lg">
                  How are you feeling today? I'm here to support your mental wellness journey. 💜
                </p>
              </div>
              <div className="hidden sm:block">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Chat */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chat Section */}
          <div className="lg:col-span-8">
            <ChatBot user={user} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <Card className="bg-white/90 backdrop-blur-sm border-purple-200 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">💜 Mental Wellness Tips</h3>
                <div className="space-y-4 text-sm text-gray-600">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <strong>🌬️ Box Breathing:</strong> Inhale for 4, hold for 4, exhale for 4, hold for 4. Repeat 4 times.
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <strong>🧘 5-4-3-2-1 Grounding:</strong> Name 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste.
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <strong>💭 Positive Affirmations:</strong> "I am strong. I am resilient. I can handle this."
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <strong>🚨 Crisis Support:</strong> If you're in crisis, call 988 (Suicide & Crisis Lifeline) or text HOME to 741741.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
