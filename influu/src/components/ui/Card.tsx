"use client";
import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "brand" | "success" | "warning";
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

export default function Card({
  variant = "default",
  hover = false,
  padding = "md",
  className,
  children,
  ...props
}: CardProps) {
  const variants = {
    default: "bg-bg-card border border-white/7",
    glass:   "glass",
    brand:   "bg-card-brand border border-brand/20",
    success: "bg-card-success border border-success/15",
    warning: "bg-card-warning border border-warning/25",
  };

  const paddings = {
    none: "",
    sm:   "p-4",
    md:   "p-5",
    lg:   "p-8",
  };

  return (
    <div
      className={cn(
        "rounded-2xl",
        variants[variant],
        paddings[padding],
        hover && "hover-lift cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
