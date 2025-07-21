
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
    
    if (!email.trim() || !password.trim() || !username.trim() || !confirmPassword.trim()) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
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
        toast({
          title: `Welcome ${username}! 🎉`,
          description: "Your MindMate account is ready!",
        });
        setEmail("");
        setPassword("");
        setUsername("");
        setConfirmPassword("");
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
    <div className="min-h-screen" style={{
      background: 'linear-gradient(120deg, #f2e8f7, #e8d4f0)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-sm mx-auto text-center" style={{ margin: '50px auto' }}>
          {/* Header */}
          <div className="mb-5">
            <div className="flex flex-col items-center">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
                style={{ backgroundColor: '#c7b8ea' }}
              >
                <span className="text-2xl text-white font-bold">M</span>
              </div>
              <h1 className="text-3xl font-normal mb-0" style={{ marginBottom: '1px' }}>
                MindMate
              </h1>
              <p className="text-gray-600 text-sm">Your AI Mental Health Companion</p>
            </div>
          </div>

          {/* Login Box */}
          <div 
            className="bg-white p-5 rounded-lg shadow-lg"
            style={{ 
              border: '1px solid #ddd',
              boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div className="w-10 h-10 flex items-center justify-center mx-auto mb-5">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-lg">🤖</span>
              </div>
            </div>
            
            <h2 className="text-lg mb-1">
              {isSignUp ? "Join MindMate" : "Welcome Back"}
            </h2>
            <p className="text-gray-600 text-sm mb-5">
              {isSignUp 
                ? "Create an account to start your mental wellness journey"
                : "Log in to continue your mental wellness journey"
              }
            </p>

            <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="mt-5">
              {isSignUp && (
                <div className="mb-4">
                  <label className="block text-left text-xs font-bold mb-1" htmlFor="username">
                    Username
                  </label>
                  <Input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full h-10 mb-4 p-2 border-none rounded-lg shadow-inner"
                    style={{ 
                      backgroundColor: '#f5f5f5',
                      boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </div>
              )}
              
              <div className="mb-4">
                <label className="block text-left text-xs font-bold mb-1" htmlFor="email">
                  Email
                </label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full h-10 mb-4 p-2 border-none rounded-lg shadow-inner"
                  style={{ 
                    backgroundColor: '#f5f5f5',
                    boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </div>

              <div className="mb-4">
                <label className="block text-left text-xs font-bold mb-1" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full h-10 mb-4 p-2 pr-10 border-none rounded-lg shadow-inner"
                    style={{ 
                      backgroundColor: '#f5f5f5',
                      boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {isSignUp && (
                <div className="mb-4">
                  <label className="block text-left text-xs font-bold mb-1" htmlFor="confirm-password">
                    Confirm Password
                  </label>
                  <Input
                    type="password"
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full h-10 mb-4 p-2 border-none rounded-lg shadow-inner"
                    style={{ 
                      backgroundColor: '#f5f5f5',
                      boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </div>
              )}

              {error && (
                <div className="text-red-500 text-xs mb-4 text-left">
                  {error}
                </div>
              )}

              <Button
                disabled={loading}
                className="w-full h-10 text-white border-none rounded-lg cursor-pointer mb-2"
                style={{ 
                  backgroundColor: '#806ab5',
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    (e.target as HTMLElement).style.backgroundColor = '#b5a3d6';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    (e.target as HTMLElement).style.backgroundColor = '#806ab5';
                  }
                }}
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white mx-auto" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  `${isSignUp ? "Sign up" : "Log in"}`
                )}
              </Button>
            </form>

            <div className="mt-4">
              <button
                type="button"
                className="w-full h-10 mt-2 border-none rounded-lg cursor-pointer font-bold"
                style={{
                  backgroundColor: '#e0d4f5',
                  color: '#3f2d56'
                }}
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError("");
                  setEmail("");
                  setPassword("");
                  setUsername("");
                  setConfirmPassword("");
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = '#d0c2ec';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = '#e0d4f5';
                }}
              >
                {isSignUp ? "Already have an account? Log in" : "Need an account? Sign up"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
