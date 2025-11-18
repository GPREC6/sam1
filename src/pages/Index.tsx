import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Users, Lock, FileText, ArrowRight, CheckCircle } from "lucide-react";
import asmLogo from "@/assets/asm-logo.png";
import digitalBg from "@/assets/digital-bg.jpg";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 opacity-20 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${digitalBg})` }}
      />
      
      {/* ASM Logo Background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5">
        <img src={asmLogo} alt="ASM" className="w-96 h-96 object-contain" />
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90" />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src={asmLogo} alt="ASM Logo" className="w-12 h-12 object-contain" />
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              ASM Digital ID
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Sign In
            </Button>
            <Button variant="identity" onClick={() => navigate('/register')}>
              Get Started
            </Button>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="px-6 py-20 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <img src={asmLogo} alt="ASM Digital Identity" className="w-24 h-24 mx-auto object-contain" />
            
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-hero bg-clip-text text-transparent leading-tight">
              Your Digital Identity,
              <br />
              Secured Forever
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Store, manage, and share your personal documents with military-grade security. 
              Your digital vault powered by biometric authentication.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                variant="hero" 
                size="hero" 
                onClick={() => navigate('/register')}
                className="group"
              >
                Create Your Digital ID
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="hero"
                onClick={() => navigate('/login')}
                className="border-identity-primary/30 text-identity-primary hover:bg-identity-primary/10"
              >
                <Shield className="w-5 h-5 mr-2" />
                Sign In Securely
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 bg-gradient-primary bg-clip-text text-transparent">
              Why Choose ASM Digital ID?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-card p-8 rounded-2xl border border-border/50 shadow-card hover:shadow-neon transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-6">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">Biometric Security</h3>
                <p className="text-muted-foreground">
                  Advanced facial recognition technology ensures only you can access your digital identity.
                </p>
              </div>
              
              <div className="bg-gradient-card p-8 rounded-2xl border border-border/50 shadow-card hover:shadow-neon transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-secondary rounded-2xl flex items-center justify-center mb-6">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">Document Vault</h3>
                <p className="text-muted-foreground">
                  Store all your important documents - IDs, cards, certificates - in one secure location.
                </p>
              </div>
              
              <div className="bg-gradient-card p-8 rounded-2xl border border-border/50 shadow-card hover:shadow-neon transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-accent rounded-2xl flex items-center justify-center mb-6">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">Easy Sharing</h3>
                <p className="text-muted-foreground">
                  Share your verified identity instantly via QR codes or secure links across platforms.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="px-6 py-20 bg-card/30">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-muted-foreground">
              Join the digital identity revolution with enterprise-grade security
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="flex items-center justify-center space-x-3">
                <CheckCircle className="w-6 h-6 text-identity-success" />
                <span className="text-foreground font-medium">Bank-Level Encryption</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <CheckCircle className="w-6 h-6 text-identity-success" />
                <span className="text-foreground font-medium">GDPR Compliant</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <CheckCircle className="w-6 h-6 text-identity-success" />
                <span className="text-foreground font-medium">99.9% Uptime</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-20">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Ready to Secure Your Digital Future?
            </h2>
            <p className="text-xl text-muted-foreground">
              Create your ASM Digital ID today and experience the future of identity management.
            </p>
            <Button 
              variant="hero" 
              size="hero" 
              onClick={() => navigate('/register')}
              className="shadow-identity"
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 py-8 border-t border-border/50">
          <div className="max-w-6xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <img src={asmLogo} alt="ASM Logo" className="w-8 h-8 object-contain" />
              <span className="text-lg font-semibold bg-gradient-primary bg-clip-text text-transparent">
                ASM Digital Identity
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Secure • Private • Verified | © 2024 ASM Digital ID. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
