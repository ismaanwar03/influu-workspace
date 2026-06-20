"use client";
import AppShell from "@/components/layout/AppShell";
import { usePathname, useRouter } from "next/navigation";
import {
  Home, Briefcase, Plus, Search, FileText, Wallet, BarChart2, Settings,
} from "lucide-react";

const navItems = [
  { id: "dashboard",    label: "Dashboard",     href: "/brand/dashboard",     icon: <Home size={16} /> },
  { id: "campaigns",   label: "Campaigns",      href: "/brand/campaigns",     icon: <Briefcase size={16} /> },
  { id: "new",         label: "New campaign",   href: "/brand/campaigns/new", icon: <Plus size={16} /> },
  { id: "find",        label: "Find creators",  href: "/brand/find-creators", icon: <Search size={16} /> },
  { id: "contracts",   label: "Contracts",      href: "/brand/contracts",     icon: <FileText size={16} />, badge: 2 },
  { id: "payments",    label: "Payments",       href: "/brand/payments",      icon: <Wallet size={16} /> },
  { id: "analytics",   label: "Analytics",      href: "/brand/analytics",     icon: <BarChart2 size={16} /> },
  { id: "settings",    label: "Settings",       href: "/brand/settings",      icon: <Settings size={16} /> },
];

export default function BrandLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell navItems={navItems} user={{ name: "Ahmed Khan", sub: "Khaadi Brand" }}>
      {children}
    </AppShell>
  );
}
