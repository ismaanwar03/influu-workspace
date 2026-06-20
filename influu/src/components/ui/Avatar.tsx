"use client";
import { getAvatarColor, initials } from "@/lib/utils";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface AvatarProps {
  name: string;
  src?: string;
  size?: number;
  className?: string;
}

export default function Avatar({ name, src, size = 36, className }: AvatarProps) {
  const color = getAvatarColor(name);
  const abbrev = initials(name);

  if (src) {
    return (
      <div
        className={cn("relative rounded-full overflow-hidden flex-shrink-0", className)}
        style={{ width: size, height: size }}
      >
        <Image src={src} alt={name} fill className="object-cover" />
      </div>
    );
  }

  return (
    <div
      className={cn("flex items-center justify-center rounded-full flex-shrink-0 font-bold", className)}
      style={{
        width: size,
        height: size,
        background: `${color}25`,
        border: `1.5px solid ${color}40`,
        color,
        fontSize: size * 0.38,
      }}
    >
      {abbrev || name[0]?.toUpperCase()}
    </div>
  );
}
