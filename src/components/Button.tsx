import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md font-display transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wax/60 focus-visible:ring-offset-2 focus-visible:ring-offset-parchment motion-reduce:transition-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-wax text-parchment hover:bg-wax/90",
        secondary: "border border-ink/40 bg-transparent text-ink hover:bg-ink/10",
        ghost: "text-ink hover:bg-ink/10",
      },
      size: {
        sm: "min-h-8 px-3 text-sm",
        md: "min-h-10 px-4 text-base",
        lg: "min-h-12 px-6 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, type = "button", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button, buttonVariants };
