
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

  useEffect(() => {
    // Initialize authentication state
    const initializeAuth = async () => {
      try {
        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          setUser(null);
        } else if (session?.user) {
          // Refresh user profile from database
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          // Update user metadata with fresh profile data
          if (profile) {
            const updatedUser = {
              ...session.user,
              user_metadata: {
                ...session.user.user_metadata,
                username: profile.username
              }
            };
            setUser(updatedUser);
          } else {
            setUser(session.user);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes with proper user refresh
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: string, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        
        if (session?.user) {
          // Refresh user profile from database on auth change
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          const updatedUser = profile ? {
            ...session.user,
            user_metadata: {
              ...session.user.user_metadata,
              username: profile.username
            }
          } : session.user;
          
          setUser(updatedUser);
        } else {
          setUser(null);
        }
        
        setLoading(false);
        
        if (event === 'SIGNED_IN') {
          const username = session?.user?.user_metadata?.username || session?.user?.email?.split('@')[0] || 'there';
          toast({
            title: `Welcome back, ${username}! 🎉`,
            description: "Great to see you again. How are you feeling today?",
          });
        }
        
        if (event === 'SIGNED_UP') {
          const username = session?.user?.user_metadata?.username || session?.user?.email?.split('@')[0] || 'there';
          toast({
            title: `Welcome to MindMate, ${username}! 🌟`,
            description: "Your mental wellness journey starts now. I'm here to support you every step of the way.",
          });
        }
        
        if (event === 'SIGNED_OUT') {
          // Clear all local data on sign out
          localStorage.clear();
          sessionStorage.clear();
          toast({
            title: "Take care! 💙",
            description: "Remember, I'm always here when you need someone to talk to.",
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

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

  // Show Dashboard when user is authenticated
  if (user) {
    return (
      <>
        <Dashboard user={user} />
        <Toaster />
      </>
    );
  }

  // Show authentication page for non-authenticated users
  return (
    <div className="min-h-screen">
      <AuthPage />
      <Toaster />
    </div>
  );
};

export default Index;
