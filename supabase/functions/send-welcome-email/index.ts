
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  username: string;
  isSignup: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, username, isSignup }: WelcomeEmailRequest = await req.json();

    const subject = isSignup ? "Welcome to MindMate! 🌟" : "Welcome Back to MindMate! 💜";
    const greeting = isSignup ? "Welcome to MindMate" : "Welcome Back";
    const message = isSignup 
      ? "Thank you for joining MindMate! We're excited to support you on your mental wellness journey."
      : "Welcome back! We're here to continue supporting your mental wellness journey.";

    const emailResponse = await resend.emails.send({
      from: "MindMate <onboarding@resend.dev>",
      to: [email],
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #8B5CF6, #3B82F6); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
              <span style="color: white; font-size: 24px; font-weight: bold;">M</span>
            </div>
            <h1 style="color: #4C1D95; margin: 0;">${greeting}, ${username}!</h1>
          </div>
          
          <div style="background: linear-gradient(135deg, #F3E8FF, #DBEAFE); padding: 30px; border-radius: 12px; margin-bottom: 20px;">
            <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">${message}</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #8B5CF6;">
              <h3 style="color: #8B5CF6; margin-top: 0;">🤖 Your AI Mental Health Companion is Ready!</h3>
              <ul style="color: #6B7280; margin: 0;">
                <li>24/7 emotional support and listening</li>
                <li>Personalized coping strategies based on your emotions</li>
                <li>Crisis support resources when you need them most</li>
                <li>Mood tracking and progress insights</li>
              </ul>
            </div>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${Deno.env.get('SITE_URL') || 'https://mindmate.lovable.app'}" 
               style="background: linear-gradient(135deg, #8B5CF6, #3B82F6); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">
              Start Your Wellness Journey
            </a>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
            <p style="color: #9CA3AF; font-size: 14px; margin: 0;">
              Remember: You're never alone on this journey. We're here to support you every step of the way. 💜
            </p>
            <p style="color: #9CA3AF; font-size: 12px; margin: 10px 0 0 0;">
              MindMate - Your trusted AI mental health companion
            </p>
          </div>
        </div>
      `,
    });

    console.log("Welcome email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending welcome email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
