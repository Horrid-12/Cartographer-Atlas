import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../lib/utils";

const cardVariants = cva("rounded-lg border p-6", {
  variants: {
    variant: {
      default: "border-ink/15 bg-parchment-soft",
      sunken: "border-ink/20 bg-ink/5 shadow-inner",
      framed: "border-gold/50 bg-transparent ring-1 ring-gold/30",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, variant, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(cardVariants({ variant }), className)}
      {...props}
    />
  );
});
Card.displayName = "Card";

export { Card, cardVariants };
