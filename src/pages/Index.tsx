import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, AuthChangeEvent } from "@supabase/supabase-js";
import AuthPage from "@/components/AuthPage";
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
      async (event: AuthChangeEvent, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        setUser(session?.user ?? null);
        setLoading(false);
        
        if (event === 'SIGNED_IN') {
          const username = session?.user?.user_metadata?.username || session?.user?.email?.split('@')[0] || 'there';
          toast({
            title: `Welcome to MindMate, ${username}! 🎉`,
            description: "Start your mental wellness journey today.",
          });
        }
        
        if (event === 'SIGNED_UP') {
          const username = session?.user?.user_metadata?.username || session?.user?.email?.split('@')[0] || 'there';
          toast({
            title: `Welcome to MindMate, ${username}! 🌟`,
            description: "Your account has been created successfully. Begin your journey to better mental health!",
          });
        }
        
        if (event === 'SIGNED_OUT') {
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

  // Simple welcome page for authenticated users
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to MindMate!</h1>
          <p className="text-gray-600 mb-6">You're successfully logged in as {user.email}</p>
          <button
            onClick={() => supabase.auth.signOut()}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>
        <Toaster />
      </div>
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
