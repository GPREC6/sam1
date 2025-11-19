import { Shield } from "lucide-react";

interface SAMLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showIcon?: boolean;
  className?: string;
}

const SAMLogo = ({ size = "md", showIcon = true, className = "" }: SAMLogoProps) => {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-4xl",
    xl: "text-6xl"
  };

  const iconSizes = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-10 h-10",
    xl: "w-16 h-16"
  };

  const containerSizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-20 h-20"
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {showIcon && (
        <div className={`${containerSizes[size]} bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow transition-smooth hover:scale-110`}>
          <Shield className={`${iconSizes[size]} text-white`} />
        </div>
      )}
      <div className={`${sizeClasses[size]} font-black tracking-tight`}>
        <span className="bg-gradient-primary bg-clip-text text-transparent">
          S
        </span>
        <span className="bg-gradient-secondary bg-clip-text text-transparent">
          A
        </span>
        <span className="bg-gradient-accent bg-clip-text text-transparent">
          M
        </span>
      </div>
    </div>
  );
};

export default SAMLogo;
