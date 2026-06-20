"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, LogOut, X } from "lucide-react";
import Logo from "./Logo";
import Avatar from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/utils";

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

interface SidebarProps {
  items: NavItem[];
  user: { name: string; sub: string };
}

const mockNotifs = [
  { id: "1", icon: "✅", msg: "Draft approved by Khaadi",    time: new Date(Date.now() - 2 * 60000).toISOString() },
  { id: "2", icon: "💰", msg: "₹8,500 payment released",     time: new Date(Date.now() - 3600000).toISOString() },
  { id: "3", icon: "📝", msg: "New offer from Daraz",         time: new Date(Date.now() - 3 * 3600000).toISOString() },
];

export default function Sidebar({ items, user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [notifOpen, setNotifOpen] = useState(false);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
    router.push("/login");
  };

  return (
    <div className="relative">
      <aside className="w-[228px] flex flex-col min-h-screen sticky top-0 flex-shrink-0"
        style={{ background: "#0C0C1A", borderRight: "1px solid rgba(255,255,255,0.07)" }}>

        {/* Logo */}
        <div className="px-[18px] py-5 border-b border-white/7">
          <Logo />
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2.5 py-3 overflow-y-auto space-y-0.5">
          {items.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link key={item.id} href={item.href}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                  "border-l-2",
                  active
                    ? "bg-brand/15 text-brand-light border-brand"
                    : "text-text-secondary border-transparent hover:bg-white/3 hover:text-text-primary"
                )}>
                <span className={cn("flex-shrink-0 transition-opacity", active ? "opacity-100" : "opacity-60")}>
                  {item.icon}
                </span>
                <span className="flex-1">{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <span className="bg-brand text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-2.5 pb-3 space-y-1 border-t border-white/7 pt-2">
          {/* Notifications */}
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-text-secondary hover:bg-white/3 hover:text-text-primary transition-all border border-white/7"
          >
            <Bell size={15} />
            <span className="flex-1 text-left">Notifications</span>
            <span className="bg-danger text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">3</span>
          </button>

          {/* User */}
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-white/7">
            <Avatar name={user.name} size={30} />
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-text-primary truncate">{user.name}</div>
              <div className="text-[11px] text-text-muted truncate">{user.sub}</div>
            </div>
            <button
              onClick={handleLogout}
              className="text-text-muted hover:text-text-primary transition-colors p-1"
              title="Sign out"
            >
              <LogOut size={13} />
            </button>
          </div>
        </div>
      </aside>

      {/* Notification panel */}
      {notifOpen && (
        <div
          className="fixed z-50 w-72 rounded-2xl border border-white/7 shadow-card animate-fade-up p-4"
          style={{ background: "#161628", bottom: 80, left: 238 }}
        >
          <div className="flex justify-between items-center mb-3">
            <span className="font-bold text-sm text-text-primary">Notifications</span>
            <button onClick={() => setNotifOpen(false)} className="text-text-secondary hover:text-text-primary">
              <X size={14} />
            </button>
          </div>
          {mockNotifs.map((n, i) => (
            <div key={n.id} className={cn("flex gap-2.5 py-2.5", i < mockNotifs.length - 1 && "border-b border-white/7")}>
              <div className="w-8 h-8 rounded-[9px] bg-brand/15 flex items-center justify-center text-sm flex-shrink-0">
                {n.icon}
              </div>
              <div>
                <div className="text-[13px] text-text-primary mb-0.5">{n.msg}</div>
                <div className="text-[11px] text-text-muted">{formatRelativeTime(n.time)}</div>
              </div>
            </div>
          ))}
          <button className="w-full text-center text-[12px] text-brand-light font-semibold mt-3 pt-3 border-t border-white/7">
            Mark all as read
          </button>
        </div>
      )}
    </div>
  );
}
