import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Shield, ArrowLeft, Scan, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface VerificationResult {
  success: boolean;
  userData?: {
    name: string;
    email: string;
    id: string;
    verified: boolean;
  };
  error?: string;
}

const Verify = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    // Check if we have a profile parameter in URL (from QR scan)
    const profileId = searchParams.get('profile');
    if (profileId) {
      loadProfileData(profileId);
    }
  }, [searchParams]);

  const loadProfileData = async (profileId: string) => {
    try {
      // In a real app, you'd fetch profile data from your database
      // For now, we'll simulate loading profile data
      setScanning(true);
      
      setTimeout(() => {
        setResult({
          success: true,
          userData: {
            name: "John Doe",
            email: "john@example.com",
            id: profileId,
            verified: true
          }
        });
        setScanning(false);
        
        toast({
          title: "Profile Loaded",
          description: "Digital identity verified successfully.",
        });
      }, 1500);
    } catch (error) {
      setResult({
        success: false,
        error: "Failed to load profile data"
      });
      setScanning(false);
    }
  };

  const simulateQRScan = () => {
    setScanning(true);
    setResult(null);

    // Simulate scanning process
    setTimeout(() => {
      // Check if there's a current user to simulate a successful scan
      const currentUser = localStorage.getItem('currentUser');
      
      if (currentUser && Math.random() > 0.3) {
        const userData = JSON.parse(currentUser);
        setResult({
          success: true,
          userData: {
            name: userData.fullName,
            email: userData.email,
            id: userData.id,
            verified: true
          }
        });
        toast({
          title: "Identity Verified!",
          description: "The scanned identity is authentic and verified.",
        });
      } else {
        setResult({
          success: false,
          error: "Invalid or corrupted QR code. Verification failed."
        });
        toast({
          title: "Verification Failed",
          description: "The scanned QR code could not be verified.",
          variant: "destructive"
        });
      }
      setScanning(false);
    }, 2000);
  };

  const resetVerification = () => {
    setResult(null);
    setScanning(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="px-6 py-4 flex items-center border-b border-border/50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="text-muted-foreground hover:text-identity-primary mr-4"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-bold text-lg text-foreground">Identity Verification</h1>
        </div>
      </nav>

      <div className="p-6 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Verify Digital Identity
          </h2>
          <p className="text-muted-foreground">
            Scan a QR code to verify someone's digital identity instantly
          </p>
        </div>

        {/* Scanner Interface */}
        <Card className="p-8 bg-card/50 backdrop-blur-sm border-border/50 shadow-card">
          <div className="text-center space-y-6">
            {!result ? (
              <>
                {/* Scanner Area */}
                <div className={`w-64 h-64 mx-auto border-4 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  scanning 
                    ? "border-identity-primary bg-identity-primary/10 shadow-glow" 
                    : "border-border/50 bg-gradient-card"
                }`}>
                  {scanning ? (
                    <div className="text-center">
                      <Scan className="w-16 h-16 text-identity-primary mx-auto mb-4 animate-pulse" />
                      <p className="text-identity-primary font-medium">Scanning QR Code...</p>
                      <div className="mt-2 w-32 h-1 bg-identity-primary/20 rounded-full mx-auto overflow-hidden">
                        <div className="h-full bg-identity-primary rounded-full animate-pulse w-full"></div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Scan className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Position QR code here</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <Button 
                    onClick={simulateQRScan}
                    disabled={scanning}
                    variant="verify"
                    size="lg"
                    className="w-full"
                  >
                    {scanning ? "Scanning..." : "Start QR Scan"}
                  </Button>
                  
                  <p className="text-sm text-muted-foreground">
                    Point your camera at a SmartID QR code to verify the person's identity
                  </p>
                </div>
              </>
            ) : (
              <>
                {/* Verification Result */}
                <div className="space-y-6">
                  <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center ${
                    result.success 
                      ? "bg-identity-success/20 text-identity-success" 
                      : "bg-identity-error/20 text-identity-error"
                  }`}>
                    {result.success ? (
                      <CheckCircle className="w-12 h-12" />
                    ) : (
                      <XCircle className="w-12 h-12" />
                    )}
                  </div>

                  <div className="text-center">
                    <h3 className={`text-2xl font-bold mb-2 ${
                      result.success ? "text-identity-success" : "text-identity-error"
                    }`}>
                      {result.success ? "Identity Verified!" : "Verification Failed"}
                    </h3>
                    
                    {result.success && result.userData ? (
                      <div className="space-y-3">
                        <Card className="p-4 bg-identity-success/10 border-identity-success/20">
                          <div className="space-y-2">
                            <p className="font-medium text-foreground">{result.userData.name}</p>
                            <p className="text-sm text-muted-foreground">{result.userData.email}</p>
                            <div className="flex items-center justify-center space-x-2 text-identity-success">
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-sm font-medium">Verified Identity</span>
                            </div>
                          </div>
                        </Card>
                      </div>
                    ) : (
                      <Card className="p-4 bg-identity-error/10 border-identity-error/20">
                        <div className="flex items-center space-x-2 text-identity-error">
                          <AlertTriangle className="w-4 h-4" />
                          <p className="text-sm">{result.error}</p>
                        </div>
                      </Card>
                    )}
                  </div>

                  <Button 
                    onClick={resetVerification}
                    variant="outline"
                    size="lg"
                    className="w-full border-border/50 text-foreground hover:bg-accent"
                  >
                    Scan Another QR Code
                  </Button>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Security Notice */}
        <Card className="mt-6 p-4 bg-card/30 border-border/50">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-identity-primary mt-0.5" />
            <div>
              <h4 className="font-medium text-foreground text-sm">Secure Verification</h4>
              <p className="text-xs text-muted-foreground mt-1">
                All identity verification is processed using encrypted protocols. 
                No personal data is stored during the verification process.
              </p>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="mt-6 flex gap-3">
          <Button 
            variant="ghost" 
            className="flex-1 text-muted-foreground hover:text-identity-primary"
            onClick={() => navigate('/dashboard')}
          >
            My Dashboard
          </Button>
          <Button 
            variant="ghost" 
            className="flex-1 text-muted-foreground hover:text-identity-primary"
            onClick={() => navigate('/')}
          >
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Verify;