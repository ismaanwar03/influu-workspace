"use client";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useEffect, useCallback } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  wide?: boolean;
  className?: string;
}

export default function Modal({ open, onClose, title, children, wide, className }: ModalProps) {
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, handleKey]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "bg-bg-card2 rounded-3xl border border-white/7 w-full shadow-card animate-fade-up",
          "max-h-[88vh] overflow-auto",
          wide ? "max-w-2xl" : "max-w-lg",
          className
        )}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/7">
            <h3 className="text-base font-bold text-text-primary">{title}</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-bg-card border border-white/7 flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
            >
              <X size={15} />
            </button>
          </div>
        )}
        <div className={title ? "p-6" : "p-6"}>{children}</div>
      </div>
    </div>
  );
}
