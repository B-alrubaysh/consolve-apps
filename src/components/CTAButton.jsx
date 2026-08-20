import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Consolve global button — one reusable component for every button on the site.
// Built on the same primitives as the shadcn Button (cva + Radix Slot) so it
// composes with `asChild` to render <a> links without changing actions/hrefs.
//
// Variants (Consolve palette only — no new colors):
//   primary   Coral bg, white text, soft coral shadow. Pass `cta` for the slow
//             sheen + stronger glow reserved for lead-generating CTAs.
//   secondary White bg, Dark Teal text + border, very light coral hover.
//   ghost     Transparent, Dark Teal text, subtle hover background.
//
// Shared micro-interactions: 250ms transition, hover lift (-2px), press scale
// 0.98, accessible focus ring. Icons animate subtly on hover.
// ─────────────────────────────────────────────────────────────────────────────

const base =
  "group relative inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium rounded-[15px] " +
  "transition-all duration-[250ms] ease-out select-none " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E87B59]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F7F5] " +
  "disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] " +
  "[&_svg]:size-[18px] [&_svg]:shrink-0";

const consolveButtonVariants = cva(base, {
  variants: {
    variant: {
      primary:
        "bg-[#E87B59] text-white shadow-[0_6px_18px_-4px_rgba(232,123,89,0.45)] " +
        "hover:bg-[#d96a49] hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-6px_rgba(232,123,89,0.55)]",
      secondary:
        "bg-white text-[#0D2528] border-2 border-[#0D2528] shadow-sm " +
        "hover:-translate-y-0.5 hover:bg-[#E87B59]/[0.08] hover:shadow-md",
      ghost:
        "bg-transparent text-[#0D2528] hover:-translate-y-0.5 hover:bg-[#0D2528]/5",
    },
    size: {
      default: "h-[52px] px-8 text-sm sm:text-base",
      sm: "h-11 px-6 text-sm",
      block: "h-[52px] w-full px-8 text-sm sm:text-base",
    },
  },
  defaultVariants: { variant: "primary", size: "default" },
});

const CTAButton = React.forwardRef(function CTAButton(
  { className, variant = "primary", size = "default", asChild = false, cta = false, leftIcon, rightIcon, children, ...props },
  ref
) {
  const Comp = asChild ? Slot : "button";
  // The sheen is reserved for primary conversion CTAs only.
  const withShine = cta && variant === "primary";

  const inner = (
    <>
      {leftIcon && (
        <span className="inline-flex transition-transform duration-200 group-hover:-translate-x-0.5">{leftIcon}</span>
      )}
      {children}
      {rightIcon && (
        <span className="inline-flex transition-transform duration-200 group-hover:translate-x-0.5">{rightIcon}</span>
      )}
    </>
  );

  return (
    <Comp
      ref={ref}
      className={cn(consolveButtonVariants({ variant, size }), withShine && "cta-shine", className)}
      {...props}
    >
      {asChild ? children : inner}
    </Comp>
  );
});

export { CTAButton, consolveButtonVariants };
export default CTAButton;