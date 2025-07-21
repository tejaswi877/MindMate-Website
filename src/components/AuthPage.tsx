import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

interface AuthFormProps {
  isLogin: boolean;
  setIsLogin: (isLogin: boolean) => void;
}

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Enhanced password validation
    if (!isLogin) {
      if (password.length < 8) {
        toast({
          title: "Weak Password",
          description: "Password must be at least 8 characters long",
          variant: "destructive",
        });
        return;
      }
      
      if (password !== confirmPassword) {
        toast({
          title: "Password Mismatch",
          description: "Passwords do not match",
          variant: "destructive",
        });
        return;
      }

      if (!username.trim()) {
        toast({
          title: "Username Required",
          description: "Please enter a username",
          variant: "destructive",
        });
        return;
      }
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            throw new Error('Invalid email or password. Please check your credentials and try again.');
          }
          throw error;
        }

        if (data.user) {
          // Clear any existing data and refresh
          window.location.reload();
        }
      } else {
        // Sign up new user
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              username: username.trim(),
            }
          }
        });

        if (error) {
          if (error.message.includes('User already registered')) {
            throw new Error('An account with this email already exists. Please sign in instead.');
          }
          throw error;
        }

        if (data.user) {
          // Clear form
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          setUsername("");
          
          // If user is immediately confirmed (no email verification), they're logged in
          if (data.session) {
            toast({
              title: `Welcome ${username}! 🎉`,
              description: "Your MindMate journey begins now!",
            });
            // Refresh to start fresh
            window.location.reload();
          } else {
            // Email confirmation required
            toast({
              title: "Check Your Email! 📧",
              description: `We've sent a confirmation link to ${email}. Please check your email and click the link to activate your account.`,
            });
            setIsLogin(true);
          }
        }
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast({
        title: isLogin ? "Sign In Failed" : "Sign Up Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Card className="w-96 p-4 shadow-lg border-purple-200">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold text-center">
            {isLogin ? "Sign In" : "Create Account"}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {!isLogin && (
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                className="border-purple-300 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="Enter email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="border-purple-300 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                placeholder="Enter password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="border-purple-300 focus:border-purple-500 focus:ring-purple-500 pr-10"
              />
              <Button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                variant="ghost"
                className="absolute right-1 top-0 h-full rounded-none p-0 text-gray-500 hover:bg-gray-100"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
                <span className="sr-only">Show password</span>
              </Button>
            </div>
          </div>
          {!isLogin && (
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                placeholder="Confirm password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                className="border-purple-300 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
          )}
          <Button onClick={handleAuth} disabled={loading} className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white">
            {loading ? (isLogin ? "Signing In..." : "Creating Account...") : (isLogin ? "Sign In" : "Sign Up")}
          </Button>
        </CardContent>
        <div className="mt-4 text-center">
          <Button variant="link" onClick={() => setIsLogin(!isLogin)} disabled={loading}>
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AuthPage;
