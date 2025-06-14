
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, AuthChangeEvent } from "@supabase/supabase-js";
import AuthPage from "@/components/AuthPage";
import Dashboard from "@/components/Dashboard";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        setUser(session?.user ?? null);
        setLoading(false);
        
        if (event === AuthChangeEvent.SIGNED_IN) {
          const username = session?.user?.user_metadata?.username || session?.user?.email?.split('@')[0] || 'there';
          toast({
            title: `Welcome to MindMate, ${username}! 🎉`,
            description: "Start your mental wellness journey today.",
          });
        }
        
        if (event === AuthChangeEvent.SIGNED_UP) {
          const username = session?.user?.user_metadata?.username || session?.user?.email?.split('@')[0] || 'there';
          toast({
            title: `Welcome to MindMate, ${username}! 🌟`,
            description: "Your account has been created successfully. Begin your journey to better mental health!",
          });
        }
        
        if (event === AuthChangeEvent.SIGNED_OUT) {
          toast({
            title: "See you soon! 👋",
            description: "You've been signed out. Remember, we're here whenever you need support.",
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

  // Show the full Dashboard when user is logged in
  if (user) {
    return (
      <>
        <Dashboard user={user} />
        <Toaster />
      </>
    );
  }

  return (
    <div className="min-h-screen">
      <AuthPage />
      <Toaster />
    </div>
  );
};

export default Index;
