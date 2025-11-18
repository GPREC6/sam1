import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Shield, ArrowLeft, Camera, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import FaceCapture from "@/components/FaceCapture";
import { supabase } from "@/integrations/supabase/client";
import asmLogo from "@/assets/asm-logo.png";
import digitalBg from "@/assets/digital-bg.jpg";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    photo: null as string | null
  });
  const [faceDescriptor, setFaceDescriptor] = useState<number[] | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.fullName || !formData.email || !formData.password) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive"
        });
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Password Mismatch",
          description: "Passwords do not match.",
          variant: "destructive"
        });
        return;
      }
      setStep(2);
    }
  };

  const handlePhotoCapture = () => {
    // Simulate photo capture
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Create a gradient background
      const gradient = ctx.createRadialGradient(150, 150, 0, 150, 150, 150);
      gradient.addColorStop(0, '#8B5CF6');
      gradient.addColorStop(1, '#A855F7');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 300, 300);
      
      // Add some text to simulate a photo
      ctx.fillStyle = 'white';
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Sample Photo', 150, 150);
      
      const photoDataUrl = canvas.toDataURL();
      setFormData({ ...formData, photo: photoDataUrl });
    }
    
    toast({
      title: "Photo Captured",
      description: "Facial recognition data processed successfully.",
    });
  };

  const handleRegister = async () => {
    if (!formData.photo || !faceDescriptor) {
      toast({
        title: "Photo required",
        description: "Please capture your face to continue.",
        variant: "destructive",
      });
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });

    if (error) {
      toast({ title: "Registration failed", description: error.message, variant: "destructive" });
      return;
    }

    // Store lightweight profile & biometric descriptor locally for prototype
    const profile = {
      fullName: formData.fullName,
      email: formData.email,
      photo: formData.photo,
      registeredAt: new Date().toISOString(),
    };
    localStorage.setItem(`profile:${formData.email}`, JSON.stringify(profile));
    localStorage.setItem(`faceDescriptor:${formData.email}`, JSON.stringify(faceDescriptor));

    toast({
      title: "Registration Successful",
      description: "Account created. Please sign in to continue.",
    });
    navigate('/login');
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
                onClick={() => step === 1 ? navigate('/') : setStep(1)}
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
            <h1 className="text-3xl font-bold text-foreground">Create Your Digital ID</h1>
            <p className="text-muted-foreground mt-2">
              {step === 1 ? "Enter your personal information" : "Capture your facial data"}
            </p>
          </div>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 shadow-card">
            {step === 1 ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName" className="text-foreground">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="mt-1 bg-background/50 border-border/50 focus:border-identity-primary"
                    placeholder="Enter your full name"
                  />
                </div>
                
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
                    placeholder="Create a password"
                  />
                </div>
                
                <div>
                  <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="mt-1 bg-background/50 border-border/50 focus:border-identity-primary"
                    placeholder="Confirm your password"
                  />
                </div>
                
                <Button 
                  onClick={handleNext}
                  className="w-full mt-6"
                  variant="identity"
                  size="lg"
                >
                  Continue to Photo Capture
                </Button>
              </div>
            ) : (
              <div className="space-y-6 text-center">
                <FaceCapture
                  mode="enroll"
                  onCapture={(photo, desc) => {
                    setFormData({ ...formData, photo });
                    setFaceDescriptor(desc);
                  }}
                />

                {formData.photo && (
                  <div className="flex items-center justify-center text-identity-success">
                    <Check className="w-5 h-5 mr-2" />
                    <span>Facial data captured successfully</span>
                  </div>
                )}

                <div className="space-y-3">
                  {formData.photo && (
                    <Button 
                      onClick={() => {
                        setFormData({ ...formData, photo: null });
                        setFaceDescriptor(null);
                      }}
                      variant="outline"
                      size="lg"
                      className="w-full border-identity-primary/30 text-identity-primary hover:bg-identity-primary/10"
                    >
                      Retake Photo
                    </Button>
                  )}

                  {formData.photo && faceDescriptor && (
                    <Button 
                      onClick={handleRegister}
                      variant="hero"
                      size="lg"
                      className="w-full"
                    >
                      Complete Registration
                    </Button>
                  )}
                </div>
              </div>
            )}
          </Card>
          
          <div className="text-center mt-6">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <button 
                onClick={() => navigate('/login')}
                className="text-identity-primary hover:underline font-medium"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;