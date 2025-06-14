
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Bot } from "lucide-react";

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const clearErrors = () => {
    setEmailError("");
    setPasswordError("");
    setUsernameError("");
    setConfirmError("");
  };

  const validateEmail = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleSignIn = async () => {
    clearErrors();
    let isValid = true;

    if (!email || !validateEmail(email)) {
      setEmailError("Please enter a valid email.");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Password cannot be empty.");
      isValid = false;
    }

    if (!isValid) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast({
            title: "Sign In Failed",
            description: "Invalid email or password. Please check your credentials and try again.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return;
      }

      if (data.user) {
        const username = data.user.user_metadata?.username || data.user.email?.split('@')[0] || 'there';
        toast({
          title: `Welcome back, ${username}! 🌟`,
          description: "Successfully signed in. Ready to continue your wellness journey?",
        });
      }
    } catch (error: any) {
      console.error("Signin error:", error);
      toast({
        title: "Sign In Failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    clearErrors();
    let isValid = true;

    if (!username.trim()) {
      setUsernameError("Username is required.");
      isValid = false;
    }

    if (!email || !validateEmail(email)) {
      setEmailError("Please enter a valid email.");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Password is required.");
      isValid = false;
    }

    if (!confirmPassword) {
      setConfirmError("Please confirm your password.");
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmError("Passwords do not match.");
      isValid = false;
    }

    if (!isValid) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
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
        if (error.message.includes("already registered")) {
          toast({
            title: "Account Exists",
            description: "An account with this email already exists. Please sign in instead.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return;
      }

      if (data.user && !data.session) {
        toast({
          title: "Welcome to MindMate! 🎉",
          description: "Please check your email to verify your account and complete the signup process.",
        });
      } else {
        toast({
          title: "Welcome to MindMate! 🎉",
          description: "Your account has been created successfully. Start your mental wellness journey!",
        });
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Signup Failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      handleSignUp();
    } else {
      handleSignIn();
    }
  };

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      background: 'linear-gradient(120deg, #f2e8f7, #e8d4f0)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        maxWidth: '400px',
        margin: '50px auto',
        textAlign: 'center' as const
      }}>
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column' as const,
            alignItems: 'center'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              backgroundColor: '#c7b8ea',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '10px'
            }}>
              <span style={{
                fontSize: '24px',
                color: '#fff',
                fontWeight: 'bold'
              }}>M</span>
            </div>
            <h1 style={{
              fontSize: '30px',
              marginBottom: '1px',
              margin: '0'
            }}>MindMate</h1>
            <p style={{
              color: '#666',
              margin: '5px 0 0 0'
            }}>Your AI Mental Health Companion</p>
          </div>
        </div>

        <div style={{
          backgroundColor: '#fff',
          padding: '20px',
          border: '1px solid #ddd',
          borderRadius: '10px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '0 auto 20px'
          }}>
            <Bot size={40} color="#806ab5" />
          </div>

          <h2 style={{
            fontSize: '18px',
            marginBottom: '5px'
          }}>
            {isSignUp ? 'Join MindMate' : 'Welcome Back'}
          </h2>
          <p style={{
            color: '#666',
            marginBottom: '20px'
          }}>
            {isSignUp 
              ? 'Create an account to start your mental wellness journey'
              : 'Log in to continue your mental wellness journey'
            }
          </p>

          <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
            {isSignUp && (
              <>
                <label htmlFor="username" style={{
                  display: 'block',
                  textAlign: 'left' as const,
                  fontSize: 'small',
                  marginBottom: '5px',
                  fontWeight: 'bold'
                }}>Username</label>
                <input
                  type="text"
                  id="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  style={{
                    width: '95%',
                    height: '20px',
                    marginBottom: '15px',
                    padding: '10px',
                    border: 'none',
                    borderRadius: '10px',
                    backgroundColor: '#f5f5f5',
                    boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.1)'
                  }}
                />
                {usernameError && (
                  <small style={{ color: 'red', display: 'block', marginBottom: '10px' }}>
                    {usernameError}
                  </small>
                )}
              </>
            )}

            <label htmlFor="email" style={{
              display: 'block',
              textAlign: 'left' as const,
              fontSize: 'small',
              marginBottom: '5px',
              fontWeight: 'bold'
            }}>Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              style={{
                width: '95%',
                height: '20px',
                marginBottom: '15px',
                padding: '10px',
                border: 'none',
                borderRadius: '10px',
                backgroundColor: '#f5f5f5',
                boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.1)'
              }}
            />
            {emailError && (
              <small style={{ color: 'red', display: 'block', marginBottom: '10px' }}>
                {emailError}
              </small>
            )}

            <label htmlFor="password" style={{
              display: 'block',
              textAlign: 'left' as const,
              fontSize: 'small',
              marginBottom: '5px',
              fontWeight: 'bold'
            }}>Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              style={{
                width: '95%',
                height: '20px',
                marginBottom: '15px',
                padding: '10px',
                border: 'none',
                borderRadius: '10px',
                backgroundColor: '#f5f5f5',
                boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.1)'
              }}
            />
            {passwordError && (
              <small style={{ color: 'red', display: 'block', marginBottom: '10px' }}>
                {passwordError}
              </small>
            )}

            {isSignUp && (
              <>
                <label htmlFor="confirm-password" style={{
                  display: 'block',
                  textAlign: 'left' as const,
                  fontSize: 'small',
                  marginBottom: '5px',
                  fontWeight: 'bold'
                }}>Confirm Password</label>
                <input
                  type="password"
                  id="confirm-password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  style={{
                    width: '95%',
                    height: '20px',
                    marginBottom: '15px',
                    padding: '10px',
                    border: 'none',
                    borderRadius: '10px',
                    backgroundColor: '#f5f5f5',
                    boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.1)'
                  }}
                />
                {confirmError && (
                  <small style={{ color: 'red', display: 'block', marginBottom: '10px' }}>
                    {confirmError}
                  </small>
                )}
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                height: '40px',
                backgroundColor: '#806ab5',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: 'normal'
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = '#b5a3d6';
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = '#806ab5';
              }}
            >
              {loading ? (isSignUp ? 'Creating account...' : 'Signing in...') : (isSignUp ? 'Sign up' : 'Log in')}
            </button>
          </form>

          <button
            onClick={() => setIsSignUp(!isSignUp)}
            style={{
              width: '100%',
              height: '40px',
              marginTop: '10px',
              backgroundColor: '#e0d4f5',
              color: '#3f2d56',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#d0c2ec';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#e0d4f5';
            }}
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
