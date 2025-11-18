import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Shield, LogOut, Download, Settings, QrCode, Camera, Upload, FileCheck, Fingerprint } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import QRCode from 'qrcode';
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import FileUpload from "@/components/FileUpload";
import ShareButton from "@/components/ShareButton";
import { exportUserData, downloadDataAsJSON, downloadDataAsCSV, saveToGallery } from "@/utils/dataExport";
import SAMLogo from "@/components/SAMLogo";
import dashboardBg from "@/assets/dashboard-bg.jpg";
import profileVisual from "@/assets/profile-visual.jpg";
import storageVisual from "@/assets/storage-visual.jpg";
import qrVerification from "@/assets/qr-verification-visual.jpg";

interface FileRecord {
  id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  storage_path: string;
  uploaded_at: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [userFiles, setUserFiles] = useState<FileRecord[]>([]);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      setUser(user);
      await fetchUserFiles();

      // Generate QR code for the user's digital ID with profile redirect
      try {
        const profileUrl = `${window.location.origin}/verify?profile=${user.id}`;
        const idData = {
          id: user.id,
          name: user.user_metadata?.fullName || user.email,
          email: user.email,
          verified: true,
          timestamp: Date.now(),
          profileUrl: profileUrl
        };
        const qrDataUrl = await QRCode.toDataURL(profileUrl, {
          width: 300,
          margin: 2,
          color: { dark: '#8B5CF6', light: '#FFFFFF' },
        });
        setQrCodeUrl(qrDataUrl);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session?.user) {
        navigate('/login');
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchUserFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('user_files')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setUserFiles(data || []);
    } catch (error: any) {
      toast({ title: "Error", description: "Failed to load files", variant: "destructive" });
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({ title: "Logout failed", description: error.message, variant: "destructive" });
    } else {
      navigate('/login');
    }
  };

  const profileUrl = `${window.location.origin}/verify?profile=${user?.id}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Link Copied",
        description: "Profile link copied to clipboard.",
      });
    });
  };

  const handleDownload = async () => {
    if (qrCodeUrl) {
      const success = await saveToGallery(qrCodeUrl, 'asm-digital-id-qr.png');
      
      toast({
        title: success ? "QR Code Saved" : "Download Started",
        description: success ? "Your digital ID QR code has been saved to gallery." : "Your QR code download has started.",
      });
    }
  };

  const handleExportData = async (format: 'json' | 'csv') => {
    try {
      const data = await exportUserData();
      
      if (format === 'json') {
        downloadDataAsJSON(data);
        toast({
          title: "Data Exported",
          description: "Your data has been exported as JSON file.",
        });
      } else {
        downloadDataAsCSV(data);
        toast({
          title: "Data Exported", 
          description: "Your data has been exported as CSV file.",
        });
      }
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export your data. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-white animate-pulse" />
          </div>
          <p className="text-muted-foreground">Loading your digital identity...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <img src={dashboardBg} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="fixed inset-0 bg-gradient-mesh opacity-30 pointer-events-none"></div>
      
      {/* Navigation */}
      <nav className="relative px-6 py-4 flex justify-between items-center border-b border-border/30 glass-effect sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <SAMLogo size="sm" />
          <div>
            <h1 className="font-bold text-lg gradient-text">Dashboard</h1>
            <p className="text-xs text-muted-foreground">Secure Identity Hub</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="glass" 
            size="icon" 
            onClick={() => navigate('/settings')}
            className="hover:text-identity-primary"
          >
            <Settings className="w-5 h-5" />
          </Button>
          <Button 
            variant="glass" 
            size="icon" 
            onClick={handleLogout}
            className="hover:text-destructive"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </nav>

      <div className="relative p-6 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <h2 className="text-4xl font-black mb-3">
            <span className="gradient-text">Welcome back,</span> {user.user_metadata?.fullName?.split(' ')[0] || user.email?.split('@')[0]}!
          </h2>
          <p className="text-lg text-muted-foreground">
            Your digital identity is secure and ready for verification.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Digital ID Card */}
          <Card className="glass-effect p-6 hover-lift group relative overflow-hidden animate-fade-in">
            {/* Background Image */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-all duration-500">
              <img src={profileVisual} alt="" className="w-full h-full object-cover" />
            </div>
            
            <div className="relative z-10 text-center space-y-4">
              <h3 className="text-xl font-bold gradient-text mb-6">Your Digital ID</h3>
              
              <div className="w-32 h-32 mx-auto relative">
                <div className="absolute inset-0 bg-gradient-primary rounded-full animate-glow-pulse blur-xl opacity-50"></div>
                <div className="relative w-full h-full bg-gradient-primary rounded-full flex items-center justify-center border-4 border-white/10 shadow-neon">
                  <Shield className="w-16 h-16 text-white" />
                </div>
              </div>
              
              <div className="space-y-3 pt-4">
                <h4 className="text-xl font-bold text-foreground">{user.user_metadata?.fullName || user.email}</h4>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <div className="flex items-center justify-center space-x-2 text-identity-success bg-identity-success/10 py-2 px-4 rounded-full">
                  <div className="w-2 h-2 bg-identity-success rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold">Verified Identity</span>
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  onClick={() => navigate('/face-verify')} 
                  className="w-full gap-2"
                  variant="premium"
                >
                  <Camera className="w-4 h-4" />
                  Face Verification
                </Button>
              </div>
            </div>
          </Card>

          {/* QR Code Section */}
          <Card className="glass-effect p-6 hover-lift group relative overflow-hidden animate-fade-in" style={{ animationDelay: "100ms" }}>
            {/* Background Image */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-all duration-500">
              <img src={qrVerification} alt="" className="w-full h-full object-cover" />
            </div>
            
            <div className="relative z-10 text-center space-y-4">
              <h3 className="text-xl font-bold gradient-text mb-6">Verification QR Code</h3>
              
              {qrCodeUrl ? (
                <div className="relative mx-auto w-fit">
                  <div className="absolute inset-0 bg-gradient-primary rounded-2xl blur-xl opacity-30 animate-glow-pulse"></div>
                  <div className="relative w-52 h-52 bg-white rounded-2xl p-4 shadow-elevated neon-border">
                    <img 
                      src={qrCodeUrl} 
                      alt="QR Code" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              ) : (
                <div className="w-52 h-52 mx-auto glass-effect rounded-2xl flex items-center justify-center">
                  <QrCode className="w-20 h-20 text-identity-primary animate-pulse" />
                </div>
              )}
              
              <p className="text-sm text-muted-foreground px-4">
                Present this QR code for instant identity verification
              </p>
              
              <div className="flex gap-2 justify-center pt-2">
                <ShareButton 
                  profileUrl={profileUrl}
                  userName={user.user_metadata?.fullName || user.email}
                />
                <Button 
                  variant="glass" 
                  size="sm"
                  onClick={handleDownload}
                  disabled={!qrCodeUrl}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </Card>

          {/* File Upload Section */}
          <div className="space-y-6 animate-fade-in" style={{ animationDelay: "200ms" }}>
            <Card className="glass-effect p-6 hover-lift group relative overflow-hidden">
              {/* Background Image */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-all duration-500">
                <img src={storageVisual} alt="" className="w-full h-full object-cover" />
              </div>
              
              <div className="relative z-10 text-center space-y-4 mb-6">
                <div className="w-16 h-16 mx-auto bg-gradient-secondary rounded-xl flex items-center justify-center shadow-glow group-hover:scale-110 transition-spring">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold gradient-text mb-2">Secure Document Storage</h3>
                  <p className="text-sm text-muted-foreground px-2">
                    Store your personal documents, ID cards, certificates, and important files securely. 
                    All files are encrypted and only accessible by you.
                  </p>
                </div>
              </div>
            </Card>
            <FileUpload 
              userFiles={userFiles} 
              onRefresh={fetchUserFiles}
              onFileUploaded={fetchUserFiles}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-10 animate-fade-in" style={{ animationDelay: "300ms" }}>
          <h3 className="text-2xl font-bold gradient-text mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <Button 
              variant="neon" 
              className="h-24 flex-col space-y-2 hover-lift"
              onClick={() => navigate('/verify')}
            >
              <QrCode className="w-7 h-7" />
              <span className="text-sm font-semibold">Scan QR</span>
            </Button>
            <Button 
              variant="glass" 
              className="h-24 flex-col space-y-2 hover-lift"
              onClick={() => navigate('/face-verify')}
            >
              <Fingerprint className="w-7 h-7" />
              <span className="text-sm font-semibold">Face ID</span>
            </Button>
            <Button 
              variant="glass" 
              className="h-24 flex-col space-y-2 hover-lift"
              onClick={() => handleExportData('json')}
            >
              <FileCheck className="w-7 h-7" />
              <span className="text-sm font-semibold">Export Data</span>
            </Button>
            <Button 
              variant="glass" 
              className="h-24 flex-col space-y-2 hover-lift"
              onClick={handleDownload}
              disabled={!qrCodeUrl}
            >
              <Download className="w-7 h-7" />
              <span className="text-sm font-semibold">QR Code</span>
            </Button>
            <Button 
              variant="glass" 
              className="h-24 flex-col space-y-2 hover-lift"
              onClick={() => navigate('/settings')}
            >
              <Settings className="w-7 h-7" />
              <span className="text-sm font-semibold">Settings</span>
            </Button>
          </div>
        </div>

        {/* Security Info */}
        <Card className="mt-10 p-8 glass-effect neon-border relative overflow-hidden group animate-fade-in" style={{ animationDelay: "400ms" }}>
          <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-all duration-500"></div>
          <div className="relative z-10 flex items-start space-x-6">
            <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow flex-shrink-0">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h4 className="text-xl font-bold gradient-text mb-2">Your Identity is Secure</h4>
              <p className="text-muted-foreground leading-relaxed">
                Protected by military-grade encryption and privacy-preserving technology. 
                All your files are private and secure. Your data never leaves your control.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;