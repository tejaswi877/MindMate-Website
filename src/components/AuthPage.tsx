
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailPattern.test(email)) {
      newErrors.email = "Please enter a valid email.";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password cannot be empty.";
    }

    // For signup, validate additional fields
    if (!isLogin) {
      if (!username.trim()) {
        newErrors.username = "Username is required.";
      }
      
      if (!confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password.";
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { username },
            emailRedirectTo: `${window.location.origin}/`
          }
        });
        if (error) throw error;
        toast({
          title: "Account created successfully!",
          description: "Please check your email to verify your account.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{
      background: "linear-gradient(120deg, #f2e8f7, #e8d4f0)",
      fontFamily: "Arial, sans-serif"
    }}>
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="text-center mb-5">
            <div className="flex flex-col items-center mb-5">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2" style={{backgroundColor: "#c7b8ea"}}>
                <span className="text-2xl text-white font-bold">M</span>
              </div>
              <h1 className="text-3xl font-bold mb-1">MindMate</h1>
              <p className="text-gray-600 text-sm">Your AI Mental Health Companion</p>
            </div>
          </div>

          {/* Login/Signup Box */}
          <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-200">
            {/* Icon */}
            <div className="flex justify-center mb-5">
              <div className="w-10 h-10 flex items-center justify-center">
                <Bot className="w-10 h-10 text-purple-600" />
              </div>
            </div>

            <h2 className="text-lg font-semibold text-center mb-1">
              {isLogin ? "Welcome Back" : "Join MindMate"}
            </h2>
            <p className="text-gray-600 text-center text-sm mb-5">
              {isLogin 
                ? "Log in to continue your mental wellness journey"
                : "Create an account to start your mental wellness journey"
              }
            </p>

            <form onSubmit={handleAuth} className="space-y-4">
              {!isLogin && (
                <div>
                  <Label htmlFor="username" className="block text-left text-sm font-bold mb-1">
                    Username
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full h-10 mb-3 p-3 border-none rounded-xl bg-gray-100 shadow-inner"
                    style={{
                      backgroundColor: "#f5f5f5",
                      boxShadow: "inset 0 0 5px rgba(0, 0, 0, 0.1)"
                    }}
                  />
                  {errors.username && (
                    <small className="text-red-500 text-xs block -mt-2 mb-2">{errors.username}</small>
                  )}
                </div>
              )}

              <div>
                <Label htmlFor="email" className="block text-left text-sm font-bold mb-1">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 mb-3 p-3 border-none rounded-xl bg-gray-100 shadow-inner"
                  style={{
                    backgroundColor: "#f5f5f5",
                    boxShadow: "inset 0 0 5px rgba(0, 0, 0, 0.1)"
                  }}
                />
                {errors.email && (
                  <small className="text-red-500 text-xs block -mt-2 mb-2">{errors.email}</small>
                )}
              </div>

              <div>
                <Label htmlFor="password" className="block text-left text-sm font-bold mb-1">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-10 mb-3 p-3 border-none rounded-xl bg-gray-100 shadow-inner"
                  style={{
                    backgroundColor: "#f5f5f5",
                    boxShadow: "inset 0 0 5px rgba(0, 0, 0, 0.1)"
                  }}
                />
                {errors.password && (
                  <small className="text-red-500 text-xs block -mt-2 mb-2">{errors.password}</small>
                )}
              </div>

              {!isLogin && (
                <div>
                  <Label htmlFor="confirm-password" className="block text-left text-sm font-bold mb-1">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-10 mb-3 p-3 border-none rounded-xl bg-gray-100 shadow-inner"
                    style={{
                      backgroundColor: "#f5f5f5",
                      boxShadow: "inset 0 0 5px rgba(0, 0, 0, 0.1)"
                    }}
                  />
                  {errors.confirmPassword && (
                    <small className="text-red-500 text-xs block -mt-2 mb-2">{errors.confirmPassword}</small>
                  )}
                </div>
              )}

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-10 border-none rounded-xl cursor-pointer font-medium"
                style={{
                  backgroundColor: "#806ab5",
                  color: "#fff"
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#b5a3d6"}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#806ab5"}
              >
                {loading ? "Loading..." : (isLogin ? "Log in" : "Sign up")}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <Button
                variant="link"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrors({});
                }}
                className="w-full h-10 mt-2 rounded-xl font-bold cursor-pointer"
                style={{
                  backgroundColor: "#e0d4f5",
                  color: "#3f2d56"
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#d0c2ec"}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#e0d4f5"}
              >
                {isLogin
                  ? "Need an account? Sign up"
                  : "Already have an account? Sign in"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
