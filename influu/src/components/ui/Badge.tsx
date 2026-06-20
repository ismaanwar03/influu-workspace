"use client";
import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  color?: string;
  dot?: boolean;
  pulse?: boolean;
}

export default function Badge({
  color = "#8B8BAA",
  dot = false,
  pulse = false,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap",
        className
      )}
      style={{
        background: `${color}18`,
        color,
      }}
      {...props}
    >
      {dot && (
        <span
          className={cn("w-1.5 h-1.5 rounded-full inline-block", pulse && "animate-pulse-dot")}
          style={{ background: color }}
        />
      )}
      {children}
    </span>
  );
}
