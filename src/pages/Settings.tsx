import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { 
  Shield, 
  ArrowLeft, 
  User, 
  Lock, 
  Bell, 
  Download, 
  Trash2, 
  Eye, 
  EyeOff,
  Smartphone,
  Globe,
  FileText,
  Phone,
  Mail,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { exportUserData, downloadDataAsJSON, downloadDataAsCSV } from "@/utils/dataExport";
import SAMLogo from "@/components/SAMLogo";
import settingsVisual from "@/assets/settings-visual.jpg";
import secureShield from "@/assets/secure-shield-visual.jpg";
import profileVisual from "@/assets/profile-visual.jpg";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [publicProfile, setPublicProfile] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }
      setUser(user);
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

  const handleUpdateProfile = async () => {
    try {
      const nameElement = document.getElementById('name') as HTMLInputElement;
      const { error } = await supabase.auth.updateUser({
        data: { 
          fullName: nameElement?.value,
          phoneNumber: phoneNumber
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast({
        title: "Password Required",
        description: "Please enter your password to delete your account.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Verify password first
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: deletePassword
      });

      if (signInError) {
        toast({
          title: "Invalid Password",
          description: "The password you entered is incorrect.",
          variant: "destructive"
        });
        return;
      }

      // Delete user account
      await supabase.auth.signOut();
      
      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted.",
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete account. Please contact support.",
        variant: "destructive"
      });
    }
    setShowDeleteDialog(false);
    setDeletePassword("");
  };

  const handleSendUnlockEmail = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user?.email || '');
      if (error) throw error;
      
      toast({
        title: "Unlock Email Sent",
        description: "Check your email for account unlock instructions.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
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
          description: "Your data has been exported as JSON file and downloaded to your system.",
        });
      } else {
        downloadDataAsCSV(data);
        toast({
          title: "Data Exported", 
          description: "Your data has been exported as CSV file and downloaded to your system.",
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
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <img src={settingsVisual} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="fixed inset-0 bg-gradient-mesh opacity-30 pointer-events-none"></div>
      
      {/* Navigation */}
      <nav className="relative px-6 py-4 flex items-center border-b border-border/30 glass-effect sticky top-0 z-50">
        <Button
          variant="glass"
          size="icon"
          onClick={() => navigate('/dashboard')}
          className="hover:text-identity-primary mr-4"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <SAMLogo size="sm" />
        <span className="ml-3 font-bold text-lg gradient-text">Settings</span>
      </nav>

      <div className="relative p-6 max-w-5xl mx-auto space-y-6">{/* Profile Settings */}
        <Card className="glass-effect p-8 hover-lift group relative overflow-hidden animate-fade-in">
          {/* Background Image */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-all duration-500">
            <img src={profileVisual} alt="" className="w-full h-full object-cover" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold gradient-text">Profile Settings</h3>
                <p className="text-sm text-muted-foreground">Manage your personal information</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" className="text-sm font-semibold">Full Name</Label>
                  <Input
                    id="name"
                    defaultValue={user.user_metadata?.fullName || ''}
                    className="mt-2 glass-effect"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm font-semibold">Email Address</Label>
                  <Input
                    id="email"
                    defaultValue={user.email || ''}
                    disabled
                    className="mt-2"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="phone" className="text-sm font-semibold">Phone Number</Label>
                  <Input
                    id="phone"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="mt-2 glass-effect"
                  />
                </div>
              </div>
              
              <Button onClick={handleUpdateProfile} variant="premium" className="w-full md:w-auto">
                Update Profile
              </Button>
            </div>
          </div>
        </Card>

        {/* Security Settings */}
        <Card className="glass-effect p-8 hover-lift group relative overflow-hidden animate-fade-in" style={{ animationDelay: "100ms" }}>
          {/* Background Image */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-all duration-500">
            <img src={secureShield} alt="" className="w-full h-full object-cover" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-secondary rounded-xl flex items-center justify-center shadow-glow">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold gradient-text">Security & Privacy</h3>
                <p className="text-sm text-muted-foreground">Control your security preferences</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 glass-effect rounded-xl hover:bg-white/5 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Biometric Login</h4>
                    <p className="text-sm text-muted-foreground">Use face recognition for quick access</p>
                  </div>
                </div>
                <Switch checked={biometric} onCheckedChange={setBiometric} />
              </div>
              
              <Separator className="opacity-20" />
              
              <div className="flex items-center justify-between p-4 glass-effect rounded-xl hover:bg-white/5 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-secondary rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Two-Factor Authentication</h4>
                    <p className="text-sm text-muted-foreground">Extra security with email verification</p>
                  </div>
                </div>
                <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
              </div>
              
              <Separator className="opacity-20" />
              
              <div className="flex items-center justify-between p-4 glass-effect rounded-xl hover:bg-white/5 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-accent rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Public Profile</h4>
                    <p className="text-sm text-muted-foreground">Allow others to view your verified status</p>
                  </div>
                </div>
                <Switch checked={publicProfile} onCheckedChange={setPublicProfile} />
              </div>
              
              <Separator className="opacity-20" />
              
              <div className="space-y-4 p-4 glass-effect rounded-xl">
                <h4 className="font-semibold text-foreground text-lg">Login Security</h4>
                <div className="bg-muted/20 p-4 rounded-lg border border-border/30">
                  <div className="flex items-center justify-between text-sm mb-3">
                    <span className="text-muted-foreground font-medium">Failed Login Attempts:</span>
                    <span className="font-bold text-lg gradient-text">{loginAttempts}/5</span>
                  </div>
                  {loginAttempts >= 5 && (
                    <div className="mt-3 flex items-center gap-2 text-destructive text-sm p-3 bg-destructive/10 rounded-lg">
                      <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                      <span className="flex-1">Account locked for 10 minutes</span>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleSendUnlockEmail}
                      >
                        Unlock
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              <Separator className="opacity-20" />
              
              <div className="p-4 glass-effect rounded-xl">
                <h4 className="font-semibold text-foreground mb-4 text-lg">Change Password</h4>
                <div className="flex gap-3">
                  <Button variant="glass" className="flex-1">
                    Change Password
                  </Button>
                  <Button 
                    variant="glass" 
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-5 h-5 text-identity-primary" />
            <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-foreground">Push Notifications</h4>
                <p className="text-sm text-muted-foreground">Get notified about verification requests</p>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
          </div>
        </Card>

        {/* Data Management */}
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-5 h-5 text-identity-primary" />
            <h3 className="text-lg font-semibold text-foreground">Data Management</h3>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-foreground mb-2">Export Your Data</h4>
                <p className="text-sm text-muted-foreground mb-3">Download all your stored documents and data to your system</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => handleExportData('json')}
                  className="flex-1 border-identity-primary/30 text-identity-primary hover:bg-identity-primary/10"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export as JSON
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleExportData('csv')}
                  className="flex-1 border-identity-secondary/30 text-identity-secondary hover:bg-identity-secondary/10"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export as CSV
                </Button>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-foreground">Storage Usage</h4>
                <p className="text-sm text-muted-foreground">12.5 MB of 1 GB used</p>
              </div>
              <div className="w-32 h-2 bg-muted rounded-full">
                <div className="w-3 h-2 bg-identity-primary rounded-full"></div>
              </div>
            </div>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="glass-effect p-8 border-2 border-destructive/30 hover:border-destructive/50 transition-all animate-fade-in" style={{ animationDelay: "300ms" }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-destructive/20 rounded-xl flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-destructive">Danger Zone</h3>
              <p className="text-sm text-muted-foreground">Irreversible actions</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-destructive/5 rounded-xl border border-destructive/20">
              <div>
                <h4 className="font-semibold text-foreground mb-1">Delete Account</h4>
                <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
              </div>
              <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="sm:w-auto">
                    Delete Account
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-effect">
                  <DialogHeader>
                    <DialogTitle className="text-destructive text-xl">⚠️ Delete Account</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      This action cannot be undone. Enter your password to confirm account deletion.
                    </p>
                    <div>
                      <Label htmlFor="deletePassword" className="text-sm font-semibold">Current Password</Label>
                      <Input
                        id="deletePassword"
                        type="password"
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        placeholder="Enter your password"
                        className="mt-2 glass-effect"
                      />
                    </div>
                    <div className="flex gap-3 justify-end">
                      <Button variant="glass" onClick={() => setShowDeleteDialog(false)}>
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={handleDeleteAccount}>
                        Delete Forever
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </Card>

        {/* App Info */}
        <Card className="glass-effect p-6 text-center animate-fade-in" style={{ animationDelay: "350ms" }}>
          <SAMLogo size="md" className="mx-auto mb-4" />
          <h4 className="font-bold text-foreground text-lg mb-1">SAM Digital Identity</h4>
          <p className="text-sm text-muted-foreground mb-1">Version 1.0.0</p>
          <p className="text-xs text-muted-foreground">
            Secure digital identity management powered by advanced biometric technology
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Settings;