import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: [
          "bg-primary text-primary-foreground",
          "hover:bg-primary/90",
          "shadow-[0_1px_2px_hsl(0_0%_0%/0.1),0_2px_8px_hsl(var(--primary)/0.2)]",
          "hover:shadow-[0_2px_4px_hsl(0_0%_0%/0.1),0_4px_16px_hsl(var(--primary)/0.3)]",
          "rounded-xl"
        ],
        destructive: [
          "bg-destructive text-destructive-foreground",
          "hover:bg-destructive/90",
          "rounded-xl"
        ],
        outline: [
          "border border-border/60 bg-transparent",
          "hover:bg-muted/50 hover:border-border",
          "rounded-xl"
        ],
        secondary: [
          "bg-muted text-foreground",
          "hover:bg-muted/80",
          "rounded-xl"
        ],
        ghost: [
          "hover:bg-muted/50",
          "rounded-xl"
        ],
        link: [
          "text-primary underline-offset-4 hover:underline"
        ],
        premium: [
          "bg-gradient-to-r from-primary to-secondary text-primary-foreground",
          "shadow-[0_2px_8px_hsl(var(--primary)/0.3),0_4px_16px_hsl(var(--secondary)/0.2)]",
          "hover:shadow-[0_4px_16px_hsl(var(--primary)/0.4),0_8px_32px_hsl(var(--secondary)/0.3)]",
          "hover:brightness-110",
          "rounded-xl"
        ],
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
