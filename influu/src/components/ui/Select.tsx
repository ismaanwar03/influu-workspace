"use client";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { SelectHTMLAttributes, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label, error, options, className, ...props
}, ref) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.06em]">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            "w-full appearance-none bg-bg-card2 border border-white/7 rounded-xl px-3.5 py-3 text-sm text-text-primary",
            "focus:outline-none focus:border-brand focus:shadow-[0_0_0_3px_rgba(124,58,255,0.18)]",
            "transition-all duration-150 cursor-pointer",
            error && "border-danger/50",
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
        />
      </div>
      {error && <p className="text-[11px] text-danger mt-0.5">{error}</p>}
    </div>
  );
});

Select.displayName = "Select";
export default Select;
