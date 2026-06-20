"use client";
import { cn } from "@/lib/utils";
import { TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label, error, hint, className, ...props
}, ref) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.06em]">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        className={cn(
          "w-full bg-bg-card2 border border-white/7 rounded-xl px-3.5 py-3 text-sm text-text-primary",
          "placeholder:text-text-muted transition-all duration-150 resize-vertical min-h-[100px]",
          "focus:outline-none focus:border-brand focus:shadow-[0_0_0_3px_rgba(124,58,255,0.18)]",
          error && "border-danger/50",
          className
        )}
        {...props}
      />
      {error && <p className="text-[11px] text-danger mt-0.5">{error}</p>}
      {hint && !error && <p className="text-[11px] text-text-muted mt-0.5">{hint}</p>}
    </div>
  );
});

Textarea.displayName = "Textarea";
export default Textarea;
