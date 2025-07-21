import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return "Password must be at least 8 characters long";
    }
    if (!hasUpperCase) {
      return "Password must contain at least one uppercase letter";
    }
    if (!hasLowerCase) {
      return "Password must contain at least one lowercase letter";
    }
    if (!hasNumbers) {
      return "Password must contain at least one number";
    }
    if (!hasSpecialChar) {
      return "Password must contain at least one special character";
    }
    return null;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Enhanced validation
    if (!email.trim() || !password.trim() || !username.trim()) {
      setError("All fields are required");
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            username: username.trim(),
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        if (error.message.includes("User already registered")) {
          setError("An account with this email already exists. Please sign in instead.");
          setIsSignUp(false);
        } else if (error.message.includes("Password")) {
          setError("Password is too weak. Please choose a stronger password.");
        } else {
          setError(error.message);
        }
        return;
      }

      if (data.user && !data.session) {
        toast({
          title: "Check your email",
          description: "We've sent you a confirmation link to complete your registration.",
        });
      } else if (data.session) {
        // User is automatically logged in
        toast({
          title: `Welcome ${username}! 🎉`,
          description: "Your MindMate account is ready!",
        });
        // Clear form
        setEmail("");
        setPassword("");
        setUsername("");
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setError("Invalid email or password. Please check your credentials and try again.");
        } else if (error.message.includes("Email not confirmed")) {
          setError("Please check your email and click the confirmation link before signing in.");
        } else {
          setError(error.message);
        }
        return;
      }

      if (data.user) {
        const username = data.user.user_metadata?.username || data.user.email?.split('@')[0] || 'there';
        toast({
          title: `Welcome back ${username}! 🎉`,
          description: "Successfully signed in to MindMate",
        });
        // Clear form
        setEmail("");
        setPassword("");
      }
    } catch (error: any) {
      console.error("Signin error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
      <Card className="w-96 bg-white shadow-lg rounded-lg border-purple-200">
        <CardHeader className="flex flex-col items-center justify-center p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-t-lg">
          <h1 className="text-2xl font-semibold text-gray-800">{isSignUp ? "Create Account" : "Sign In"}</h1>
          <p className="text-sm text-gray-500 mt-1">Start your journey to a better you</p>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  className="mt-1 block w-full border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="mt-1 block w-full border-purple-200 focus:border-purple-400 focus:ring-purple-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your secure password"
                  className="mt-1 block w-full border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 px-3 flex items-center focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
              {isSignUp && (
                <div className="mt-2 text-xs text-gray-500">
                  Password must be at least 8 characters with uppercase, lowercase, number, and special character.
                </div>
              )}
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white mx-auto" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                `${isSignUp ? "Create Account" : "Sign In"}`
              )}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <button
              type="button"
              className="text-sm text-purple-500 hover:underline"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
              }}
            >
              {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
