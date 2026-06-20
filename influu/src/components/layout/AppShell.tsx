"use client";
import Sidebar from "./Sidebar";
import { ReactNode } from "react";

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

interface AppShellProps {
  children: ReactNode;
  navItems: NavItem[];
  user: { name: string; sub: string };
}

export default function AppShell({ children, navItems, user }: AppShellProps) {
  return (
    <div className="flex min-h-screen" style={{ background: "#07070F" }}>
      <Sidebar items={navItems} user={user} />
      <main className="flex-1 overflow-auto min-w-0">
        {children}
      </main>
    </div>
  );
}
