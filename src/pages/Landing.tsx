import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Scan, UserCheck, Zap, Lock, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SAMLogo from "@/components/SAMLogo";
import heroIdentity from "@/assets/hero-identity.jpg";
import securityNetwork from "@/assets/security-network.jpg";
import faceRecognition from "@/assets/face-recognition-visual.jpg";
import qrVerification from "@/assets/qr-verification-visual.jpg";
import secureShield from "@/assets/secure-shield-visual.jpg";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Shield,
      title: "Privacy-First Design",
      description: "Your identity data stays secure with zero-knowledge proofs and advanced encryption.",
      image: secureShield
    },
    {
      icon: Scan,
      title: "Facial Recognition",
      description: "State-of-the-art AI-powered facial recognition for seamless identity verification.",
      image: faceRecognition
    },
    {
      icon: UserCheck,
      title: "Instant Verification",
      description: "Quick and reliable identity verification through QR code scanning.",
      image: qrVerification
    },
    {
      icon: Zap,
      title: "Real-time Processing",
      description: "Lightning-fast identity checks with our advanced processing algorithms.",
      image: securityNetwork
    },
    {
      icon: Lock,
      title: "Secure Storage",
      description: "Military-grade encryption ensures your personal data remains protected.",
      image: secureShield
    },
    {
      icon: Eye,
      title: "Anomaly Detection",
      description: "Advanced AI detects and prevents fraudulent identity attempts.",
      image: faceRecognition
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="px-6 py-4 flex justify-between items-center border-b border-border/50 bg-background/80 backdrop-blur-lg sticky top-0 z-50">
        <SAMLogo size="md" />
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/login')}
            className="text-foreground hover:text-identity-primary transition-smooth"
          >
            Sign In
          </Button>
          <Button 
            variant="default"
            onClick={() => navigate('/register')}
            className="bg-gradient-primary hover:shadow-glow transition-smooth"
          >
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-32 text-center relative overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0 opacity-30">
          <img 
            src={heroIdentity} 
            alt="Digital Identity Verification" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-mesh animate-glow-pulse"></div>
        <div className="absolute inset-0 bg-gradient-hero opacity-20"></div>
        
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-identity-primary/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-identity-secondary/30 rounded-full blur-3xl animate-pulse delay-700"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto animate-fade-in">
          <div className="mb-8 flex justify-center">
            <div className="animate-scale-in">
              <SAMLogo size="xl" showIcon={true} />
            </div>
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
            <span className="gradient-text">
              Secure Digital
            </span>
            <br />
            <span className="bg-gradient-secondary bg-clip-text text-transparent">
              Identity System
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Secure, instant, and private identity verification powered by advanced AI and biometric technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              variant="premium" 
              size="hero"
              onClick={() => navigate('/register')}
              className="min-w-[240px] animate-slide-up"
            >
              Create Your Digital ID
            </Button>
            <Button 
              variant="glass" 
              size="lg"
              onClick={() => navigate('/verify')}
              className="min-w-[200px] animate-slide-up delay-150"
            >
              Verify Identity
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 py-20 bg-gradient-card">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">
              Revolutionary Identity Technology
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the future of digital identity with our cutting-edge features designed for maximum security and privacy.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="glass-effect p-8 hover-lift group cursor-pointer transform transition-spring hover:shadow-elevated animate-fade-in overflow-hidden relative"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Background Image */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-all duration-500">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-spring shadow-glow">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-foreground group-hover:gradient-text transition-smooth">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 relative">
        <div className="absolute inset-0 opacity-20">
          <img 
            src={securityNetwork} 
            alt="Security Network" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="glass-effect p-12 md:p-16 rounded-3xl neon-border shadow-elevated relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-primary opacity-5"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black mb-6 gradient-text">
                Ready to Secure Your Digital Identity?
              </h2>
              <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
                Join thousands of users who trust SAM for their digital identity needs. Experience the future of secure authentication.
              </p>
              <Button 
                variant="premium" 
                size="hero"
                onClick={() => navigate('/register')}
                className="mx-auto"
              >
                Start Your Journey
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-10 border-t border-border/30 glass-effect">
        <div className="max-w-6xl mx-auto text-center">
          <SAMLogo size="sm" className="mx-auto mb-4" />
          <p className="text-muted-foreground">&copy; 2025 SAM. Securing digital identities with privacy-first technology.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;