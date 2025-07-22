
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import AuthPage from "@/components/AuthPage";
import Dashboard from "@/components/Dashboard";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasShownWelcome, setHasShownWelcome] = useState(false);

  useEffect(() => {
    // Enhanced session checking and auth state management
    const initializeAuth = async () => {
      try {
        // Check initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session error:", error);
          setUser(null);
        } else {
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Enhanced auth state listener with better error handling
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        
        try {
          setUser(session?.user ?? null);
          setLoading(false);
          
          if (event === 'SIGNED_IN' && !hasShownWelcome) {
            const username = session?.user?.user_metadata?.username || 
                           session?.user?.email?.split('@')[0] || 'there';
            toast({
              title: `Welcome back ${username}! 🎉`,
              description: "Your MindMate session is ready for you!",
            });
            setHasShownWelcome(true);
          }
          
          if (event === 'SIGNED_OUT') {
            setUser(null);
            setHasShownWelcome(false);
            toast({
              title: "Signed Out Safely 👋",
              description: "Your data is secure. Sign in anytime to continue your wellness journey!",
            });
          }

          if (event === 'TOKEN_REFRESHED') {
            console.log("Token refreshed successfully");
          }

          if (event === 'USER_UPDATED') {
            console.log("User profile updated");
          }

        } catch (error) {
          console.error("Auth state change error:", error);
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [hasShownWelcome]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading MindMate...</h2>
          <p className="text-gray-500">Preparing your mental wellness companion</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {user ? <Dashboard user={user} /> : <AuthPage />}
      <Toaster />
    </div>
  );
};

export default Index;
