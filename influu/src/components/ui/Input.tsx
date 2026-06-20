"use client";
import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  prefix?: string;
  suffix?: React.ReactNode;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label, error, hint, prefix, suffix, icon,
  className, ...props
}, ref) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.06em]">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-3.5 text-text-muted pointer-events-none flex">
            {icon}
          </span>
        )}
        {prefix && (
          <span className="absolute left-3.5 text-text-secondary text-sm font-semibold pointer-events-none">
            {prefix}
          </span>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full bg-bg-card2 border border-white/7 rounded-xl px-3.5 py-3 text-sm text-text-primary",
            "placeholder:text-text-muted transition-all duration-150",
            "focus:outline-none focus:border-brand focus:shadow-[0_0_0_3px_rgba(124,58,255,0.18)]",
            icon && "pl-10",
            prefix && "pl-7",
            suffix && "pr-10",
            error && "border-danger/50 focus:border-danger focus:shadow-[0_0_0_3px_rgba(244,91,105,0.18)]",
            className
          )}
          {...props}
        />
        {suffix && (
          <span className="absolute right-3.5 text-text-muted flex">{suffix}</span>
        )}
      </div>
      {error && <p className="text-[11px] text-danger mt-0.5">{error}</p>}
      {hint && !error && <p className="text-[11px] text-text-muted mt-0.5">{hint}</p>}
    </div>
  );
});

Input.displayName = "Input";
export default Input;
