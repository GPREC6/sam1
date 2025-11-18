import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, ArrowLeft, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import FaceCapture from "@/components/FaceCapture";
import { supabase } from "@/integrations/supabase/client";

const FaceVerify = () => {
  const navigate = useNavigate();
  const location = useLocation() as any;
  const { toast } = useToast();
  const email: string | undefined = location?.state?.email;
  const [expectedDescriptor, setExpectedDescriptor] = useState<number[] | null>(null);
  const [match, setMatch] = useState<{ ok: boolean; distance: number } | null>(null);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }
      const key = `faceDescriptor:${email || user.email}`;
      const stored = localStorage.getItem(key);
      if (!stored) {
        toast({ title: "No face data found", description: "Please enroll your face during sign up.", variant: "destructive" });
        navigate('/register');
        return;
      }
      setExpectedDescriptor(JSON.parse(stored));
    };
    init();
  }, [email, navigate, toast]);

  const handleVerify = (ok: boolean, distance: number) => {
    setMatch({ ok, distance });
    if (ok) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card relative overflow-hidden flex items-center justify-center p-6">
      {/* Background Pattern with ASM Logo */}
      <div className="absolute inset-0 bg-digital-bg bg-cover bg-center opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
      <div className="absolute inset-0 flex items-center justify-center opacity-5">
        <img src="/src/assets/asm-logo.png" alt="ASM" className="w-96 h-96 object-contain" />
      </div>
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
          <h1 className="text-3xl font-bold text-foreground">Face Verification</h1>
          <p className="text-muted-foreground mt-2">Look at the camera to verify it's you</p>
        </div>

        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 shadow-card">
          <FaceCapture
            mode="verify"
            expectedDescriptor={expectedDescriptor || undefined}
            onVerify={(ok, distance) => handleVerify(ok, distance)}
          />

          {match && (
            <div className={`mt-4 flex items-center justify-center ${match.ok ? 'text-identity-success' : 'text-destructive'}`}>
              <Check className="w-5 h-5 mr-2" />
              <span>{match.ok ? 'Face verified successfully' : 'Face did not match. Try again.'}</span>
            </div>
          )}

          <div className="mt-6 text-center">
            <Button
              variant="outline"
              className="border-identity-primary/30 text-identity-primary hover:bg-identity-primary/10"
              onClick={() => navigate('/login')}
            >
              Use password instead
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FaceVerify;
