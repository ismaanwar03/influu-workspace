import { Zap } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
}

export default function Logo({ size = "md", href = "/", className }: LogoProps) {
  const dims = { sm: { icon: 28, font: "text-base" }, md: { icon: 34, font: "text-lg" }, lg: { icon: 42, font: "text-2xl" } };
  const d = dims[size];

  const content = (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className="flex items-center justify-center rounded-[11px] flex-shrink-0"
        style={{
          width: d.icon, height: d.icon,
          background: "linear-gradient(135deg,#7C3AFF,#DB2777)",
          boxShadow: "0 4px 16px rgba(124,58,255,0.4)",
        }}
      >
        <Zap size={d.icon * 0.5} color="#fff" strokeWidth={2.5} />
      </div>
      <span className={cn("font-extrabold tracking-tight text-text-primary", d.font)}>
        influu
      </span>
      <span className="text-[11px] font-bold text-brand-light bg-brand/15 px-1.5 py-0.5 rounded-md">
        .pk
      </span>
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}
