import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Copy, MessageCircle, Mail, Facebook, Twitter, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ShareButtonProps {
  profileUrl: string;
  userName?: string;
}

const ShareButton = ({ profileUrl, userName = "My Profile" }: ShareButtonProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const shareText = `Check out ${userName}'s verified digital identity: ${profileUrl}`;
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(profileUrl);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Link Copied!",
        description: "Profile link has been copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy link. Please try again.",
        variant: "destructive"
      });
    }
  };

  const shareOptions = [
    {
      name: "Copy Link",
      icon: copied ? Check : Copy,
      action: handleCopyLink,
      className: copied ? "text-identity-success" : ""
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      action: () => window.open(`https://wa.me/?text=${encodedText}`, '_blank'),
      className: "text-green-500"
    },
    {
      name: "Email",
      icon: Mail,
      action: () => window.open(`mailto:?subject=Verified Digital Identity&body=${encodedText}`, '_blank'),
      className: "text-blue-500"
    },
    {
      name: "Twitter",
      icon: Twitter,
      action: () => window.open(`https://twitter.com/intent/tweet?text=${encodedText}`, '_blank'),
      className: "text-blue-400"
    },
    {
      name: "Facebook",
      icon: Facebook,
      action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank'),
      className: "text-blue-600"
    }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="gap-2 border-identity-primary/30 text-identity-primary hover:bg-identity-primary/10"
        >
          <Share2 className="w-4 h-4" />
          Share Profile
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {shareOptions.map((option) => {
          const IconComponent = option.icon;
          return (
            <DropdownMenuItem
              key={option.name}
              onClick={option.action}
              className={`cursor-pointer gap-2 ${option.className}`}
            >
              <IconComponent className="w-4 h-4" />
              {option.name}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShareButton;