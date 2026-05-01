import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const ctaVariants = cva(
  "relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-[10px] font-heading font-semibold leading-none transition-[transform,box-shadow,background-color] duration-200 cursor-pointer disabled:pointer-events-none disabled:opacity-60 active:translate-y-0",
  {
    variants: {
      variant: {
        wpp: "bg-whatsapp text-white shadow-[0_4px_14px_rgba(37,211,102,0.32)] hover:bg-whatsapp-deep hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(37,211,102,0.42)]",
        solar:
          "bg-solar text-white shadow-[0_4px_14px_rgba(255,107,0,0.28)] hover:bg-solar-deep hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(255,107,0,0.4)]",
        ghost:
          "bg-white text-deep border border-gray-300 hover:border-deep hover:-translate-y-0.5",
      },
      size: {
        sm: "px-4 py-2.5 text-sm",
        md: "px-[22px] py-[14px] text-base",
        lg: "px-7 py-[18px] text-lg",
      },
    },
    defaultVariants: {
      variant: "solar",
      size: "md",
    },
  },
);

type CtaProps = React.ComponentProps<"a"> &
  VariantProps<typeof ctaVariants> & {
    asChild?: boolean;
    pulse?: boolean;
  };

export function CtaButton({
  className,
  variant,
  size,
  asChild,
  pulse,
  children,
  ...props
}: CtaProps) {
  const Comp = asChild ? Slot.Root : "a";
  return (
    <Comp
      className={cn(ctaVariants({ variant, size }), pulse && "btn-pulse", className)}
      {...props}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(120deg,transparent_30%,rgba(255,255,255,0.35)_50%,transparent_70%)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/cta:translate-x-full"
      />
      <span className="relative inline-flex items-center gap-2.5">{children}</span>
    </Comp>
  );
}
