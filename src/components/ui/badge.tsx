import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: [
          "border-transparent bg-primary/15 text-primary",
          "shadow-[0_0_0_1px_hsl(var(--primary)/0.2)]",
        ],
        secondary: [
          "border-transparent bg-muted text-muted-foreground",
        ],
        destructive: [
          "border-transparent bg-destructive/15 text-destructive",
          "shadow-[0_0_0_1px_hsl(var(--destructive)/0.2)]",
        ],
        outline: [
          "border-border/50 text-foreground bg-transparent",
        ],
        success: [
          "border-transparent bg-primary/15 text-primary",
          "shadow-[0_0_0_1px_hsl(var(--primary)/0.2)]",
        ],
        warning: [
          "border-transparent bg-[hsl(42_85%_55%/0.15)] text-[hsl(42_85%_55%)]",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
