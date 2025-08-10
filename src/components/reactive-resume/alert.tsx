import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";

const alertVariants = cva(
  "relative w-full rounded p-4 transition-colors [&>svg+div]:translate-y-[-4px] [&>svg]:absolute [&>svg]:left-3.5 [&>svg]:top-[18px] [&>svg~*]:pl-6",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground [&>svg]:text-foreground",
        primary: "bg-primary text-primary-foreground [&>svg]:text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground [&>svg]:text-secondary-foreground",
        error: "bg-error text-error-foreground [&>svg]:text-error-foreground",
        warning: "bg-warning text-warning-foreground [&>svg]:text-warning-foreground",
        info: "bg-info text-info-foreground [&>svg]:text-info-foreground",
        success: "bg-success text-success-foreground [&>svg]:text-success-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type AlertProps = React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>;

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, ...props }, ref) => (
    <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
  ),
);

Alert.displayName = "Alert";

export const AlertTitle = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h5 ref={ref} className={cn("font-medium tracking-tight", className)} {...props}>
    {children}
  </h5>
));

AlertTitle.displayName = "AlertTitle";

export const AlertDescription = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("pt-0.5 leading-normal", className)} {...props} />
));

AlertDescription.displayName = "AlertDescription";
