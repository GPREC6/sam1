import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // After magic link, user should be logged in
    supabase.auth.getUser().then(({ data: { user } }) => {
      setReady(!!user);
    });
  }, []);

  const handleSubmit = async () => {
    if (!password || password !== confirmPassword) {
      toast({ title: "Check passwords", description: "Passwords must match.", variant: "destructive" });
      return;
    }
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Password updated", description: "You can now sign in." });
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Change Password</h1>
          <p className="text-muted-foreground mt-2">Enter a new password for your account</p>
        </div>

        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 shadow-card">
          <div className="space-y-4">
            <div>
              <Label htmlFor="password" className="text-foreground">New Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 bg-background/50 border-border/50 focus:border-identity-primary"
                placeholder="Enter new password"
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword" className="text-foreground">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 bg-background/50 border-border/50 focus:border-identity-primary"
                placeholder="Confirm new password"
              />
            </div>

            <Button onClick={handleSubmit} className="w-full mt-6" variant="identity" size="lg" disabled={!ready}>
              Submit
            </Button>
            {!ready && (
              <p className="text-xs text-muted-foreground text-center">Open this page from the reset link sent to your email.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
