"use client";
import { Bell, Plus } from "lucide-react";
import Button from "@/components/ui/Button";

interface TopBarProps {
  title: string;
  sub?: string;
  breadcrumb?: string;
  action?: { label: string; onClick: () => void; icon?: React.ReactNode };
}

export default function TopBar({ title, sub, breadcrumb, action }: TopBarProps) {
  return (
    <div
      className="flex justify-between items-center px-7 py-3.5 sticky top-0 z-10"
      style={{ background: "#0C0C1A", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div>
        {breadcrumb && (
          <p className="text-[11px] text-text-muted font-medium mb-0.5">{breadcrumb}</p>
        )}
        <h2 className="text-[19px] font-extrabold text-text-primary tracking-tight">{title}</h2>
        {sub && <p className="text-[12px] text-text-secondary mt-0.5">{sub}</p>}
      </div>

      <div className="flex items-center gap-2.5">
        <button className="relative w-9 h-9 rounded-xl bg-bg-card border border-white/7 flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-danger border border-bg-side" />
        </button>

        {action && (
          <Button
            variant="primary"
            size="sm"
            icon={action.icon ?? <Plus size={14} />}
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        )}
      </div>
    </div>
  );
}
