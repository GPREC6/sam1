import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Shield, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");

  const handleSend = async () => {
    if (!email) {
      toast({ title: "Email required", description: "Please enter your email.", variant: "destructive" });
      return;
    }
    const redirectTo = `${window.location.origin}/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) {
      toast({ title: "Failed to send", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Check your email", description: "We sent a password reset link." });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/login')}
              className="absolute left-0 text-muted-foreground hover:text-identity-primary"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Forgot Password?</h1>
          <p className="text-muted-foreground mt-2">Enter your email to receive a reset link</p>
        </div>

        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 shadow-card">
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-foreground">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 bg-background/50 border-border/50 focus:border-identity-primary"
                placeholder="Enter your email"
              />
            </div>

            <Button onClick={handleSend} className="w-full mt-6" variant="identity" size="lg">
              Send Reset Link
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
