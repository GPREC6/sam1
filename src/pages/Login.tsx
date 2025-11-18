import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Shield, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import asmLogo from "@/assets/asm-logo.png";
import digitalBg from "@/assets/digital-bg.jpg";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    if (isLocked) {
      toast({
        title: "Account Locked",
        description: "Too many failed attempts. Please check your email for unlock instructions.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.email || !formData.password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      
      if (newAttempts >= 5) {
        setIsLocked(true);
        // Send unlock email
        await supabase.auth.resetPasswordForEmail(formData.email);
        toast({ 
          title: "Account Locked", 
          description: "Too many failed attempts. Check your email for unlock instructions.",
          variant: "destructive" 
        });
        return;
      }
      
      toast({ 
        title: "Login Failed", 
        description: `${error.message}. ${5 - newAttempts} attempts remaining.`,
        variant: "destructive" 
      });
      return;
    }

    // Check if user has face data registered
    const faceKey = `faceDescriptor:${formData.email}`;
    const hasFaceData = localStorage.getItem(faceKey);
    
    if (hasFaceData) {
      toast({ title: "Welcome Back!", description: "Password verified. Continue with face verification." });
      navigate('/face-verify', { state: { email: formData.email } });
    } else {
      toast({ title: "Welcome Back!", description: "Login successful!" });
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 opacity-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${digitalBg})` }}
      />
      
      {/* ASM Logo Background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5">
        <img src={asmLogo} alt="ASM" className="w-96 h-96 object-contain" />
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90" />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6 relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/')}
                className="absolute left-0 text-muted-foreground hover:text-identity-primary"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex flex-col items-center space-y-3">
                <img src={asmLogo} alt="ASM Digital Identity" className="w-16 h-16 object-contain" />
                <span className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
                  ASM Digital ID
                </span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground">Welcome Back</h1>
            <p className="text-muted-foreground mt-2">
              Sign in to access your digital identity
            </p>
          </div>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 shadow-card">
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-foreground">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 bg-background/50 border-border/50 focus:border-identity-primary"
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <Label htmlFor="password" className="text-foreground">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="mt-1 bg-background/50 border-border/50 focus:border-identity-primary"
                  placeholder="Enter your password"
                />
                <div className="mt-2 text-right">
                  <button
                    onClick={() => navigate('/forgot-password')}
                    className="text-sm text-identity-primary hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>
              
              <Button 
                onClick={handleLogin}
                className="w-full mt-6"
                variant="identity"
                size="lg"
              >
                Sign In
              </Button>
            </div>
          </Card>
          
          <div className="text-center mt-6">
            <p className="text-muted-foreground">
              Don't have an account?{" "}
              <button 
                onClick={() => navigate('/register')}
                className="text-identity-primary hover:underline font-medium"
              >
                Create your digital ID
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;