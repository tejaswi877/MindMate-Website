
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Bot } from "lucide-react";

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Sign In Failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !username) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username.trim(),
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        toast({
          title: "Sign Up Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Account Created! 🎉",
          description: "Please check your email to verify your account before signing in.",
        });
        // Reset form and switch to sign in
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setUsername("");
        setIsSignUp(false);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(120deg, #f2e8f7, #e8d4f0)',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-5">
          <div className="flex flex-col items-center">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
              style={{ backgroundColor: '#c7b8ea' }}
            >
              <span className="text-2xl text-white font-bold">M</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">MindMate</h1>
            <p className="text-gray-600">Your AI Mental Health Companion</p>
          </div>
        </div>

        {/* Auth Form */}
        <div 
          className="bg-white p-5 rounded-lg shadow-lg border border-gray-300"
          style={{ boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}
        >
          <div className="text-center mb-5">
            <div className="w-10 h-10 flex items-center justify-center mx-auto mb-5">
              <Bot className="w-10 h-10" style={{ color: '#806ab5' }} />
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-1">
              {isSignUp ? "Join MindMate" : "Welcome Back"}
            </h2>
            <p className="text-gray-600 text-sm">
              {isSignUp 
                ? "Create an account to start your mental wellness journey"
                : "Log in to continue your mental wellness journey"
              }
            </p>
          </div>

          <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="mt-5">
            {isSignUp && (
              <div className="mb-4">
                <label className="block text-left text-sm font-bold text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full h-10 px-3 py-2 border-none rounded-lg bg-gray-100 shadow-inner"
                  style={{ 
                    backgroundColor: '#f5f5f5',
                    boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.1)',
                    width: '100%'
                  }}
                  placeholder="Enter your username"
                  disabled={loading}
                />
              </div>
            )}

            <div className="mb-4">
              <label className="block text-left text-sm font-bold text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 px-3 py-2 border-none rounded-lg bg-gray-100 shadow-inner"
                style={{ 
                  backgroundColor: '#f5f5f5',
                  boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.1)',
                  width: '100%'
                }}
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>

            <div className="mb-4">
              <label className="block text-left text-sm font-bold text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10 px-3 py-2 border-none rounded-lg bg-gray-100 shadow-inner"
                style={{ 
                  backgroundColor: '#f5f5f5',
                  boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.1)',
                  width: '100%'
                }}
                placeholder="Enter your password"
                disabled={loading}
              />
            </div>

            {isSignUp && (
              <div className="mb-4">
                <label className="block text-left text-sm font-bold text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-10 px-3 py-2 border-none rounded-lg bg-gray-100 shadow-inner"
                  style={{ 
                    backgroundColor: '#f5f5f5',
                    boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.1)',
                    width: '100%'
                  }}
                  placeholder="Confirm your password"
                  disabled={loading}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 text-white border-none rounded-lg cursor-pointer font-medium transition-colors"
              style={{ 
                backgroundColor: '#806ab5',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#b5a3d6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#806ab5';
              }}
            >
              {loading 
                ? (isSignUp ? "Creating Account..." : "Logging In...") 
                : (isSignUp ? "Sign up" : "Log in")
              }
            </button>
          </form>

          <div className="mt-3">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="w-full h-10 border-none rounded-lg cursor-pointer font-bold transition-colors"
              style={{ 
                backgroundColor: '#e0d4f5',
                color: '#3f2d56'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#d0c2ec';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#e0d4f5';
              }}
            >
              {isSignUp 
                ? "Already have an account? Log In" 
                : "Don't have an account? Sign Up"
              }
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Your mental health matters. We're here to support you.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
