import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-primary text-white shadow-glow hover:shadow-elevated hover:scale-105 transition-bounce font-medium",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-card",
        outline: "border-2 border-primary/30 bg-transparent text-foreground hover:bg-primary/10 hover:border-primary/60 backdrop-blur-sm",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-card",
        ghost: "hover:bg-accent/50 hover:text-accent-foreground backdrop-blur-sm",
        link: "text-primary underline-offset-4 hover:underline",
        hero: "bg-gradient-hero text-white shadow-elevated hover:shadow-neon transform hover:scale-105 transition-spring font-bold text-lg shine-effect",
        identity: "bg-identity-primary text-white hover:bg-identity-secondary shadow-card border border-identity-primary/20 hover-lift",
        verify: "bg-identity-accent text-white hover:bg-identity-accent/90 shadow-card hover-lift",
        success: "bg-identity-success text-white hover:bg-identity-success/90 shadow-float",
        warning: "bg-identity-warning text-white hover:bg-identity-warning/90 shadow-float",
        error: "bg-identity-error text-white hover:bg-identity-error/90 shadow-float",
        premium: "bg-gradient-primary text-white shadow-neon hover:shadow-elevated border-2 border-white/20 hover:scale-105 transition-spring font-semibold neon-border",
        glass: "glass-effect text-foreground hover:bg-card/70 border border-primary/20 hover:border-primary/40 backdrop-blur-xl",
        neon: "bg-transparent text-primary border-2 border-primary shadow-neon hover:bg-primary hover:text-white transition-spring animate-glow-pulse",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        hero: "h-14 px-12 py-4 text-lg rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
