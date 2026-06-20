"use client";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = "left",
  className,
  children,
  disabled,
  ...props
}, ref) => {
  const base = "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed select-none";

  const variants = {
    primary:   "bg-brand-gradient text-white shadow-brand hover:-translate-y-px hover:shadow-glow",
    secondary: "bg-bg-card2 border border-white/10 text-text-primary hover:border-white/20 hover:-translate-y-px",
    ghost:     "bg-white/5 border border-white/10 text-text-secondary hover:bg-white/8 hover:text-text-primary hover:border-white/16",
    danger:    "bg-danger/10 border border-danger/30 text-danger hover:bg-danger/20",
    success:   "bg-success-gradient text-white shadow-[0_4px_20px_rgba(16,217,160,0.35)] hover:-translate-y-px",
  };

  const sizes = {
    sm: "text-xs px-3 py-2 rounded-lg",
    md: "text-sm px-5 py-2.5",
    lg: "text-base px-7 py-3.5 rounded-2xl",
  };

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(base, variants[variant], sizes[size], fullWidth && "w-full", className)}
      {...props}
    >
      {loading ? (
        <Loader2 size={size === "sm" ? 14 : 16} className="animate-spin" />
      ) : (
        icon && iconPosition === "left" && <span className="flex">{icon}</span>
      )}
      {children}
      {!loading && icon && iconPosition === "right" && (
        <span className="flex">{icon}</span>
      )}
    </button>
  );
});

Button.displayName = "Button";
export default Button;
