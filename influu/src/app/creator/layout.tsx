"use client";
import AppShell from "@/components/layout/AppShell";
import {
  Home, Search, Package, FileText, Wallet, MessageSquare, Settings,
} from "lucide-react";

const navItems = [
  { id: "dashboard", label: "Dashboard",       href: "/creator/dashboard", icon: <Home size={16} /> },
  { id: "browse",    label: "Browse campaigns",href: "/creator/browse",    icon: <Search size={16} /> },
  { id: "packages",  label: "My packages",     href: "/creator/packages",  icon: <Package size={16} /> },
  { id: "contracts", label: "Contracts",        href: "/creator/contracts", icon: <FileText size={16} />, badge: 1 },
  { id: "earnings",  label: "Earnings",         href: "/creator/earnings",  icon: <Wallet size={16} /> },
  { id: "messages",  label: "Messages",         href: "/creator/messages",  icon: <MessageSquare size={16} /> },
  { id: "settings",  label: "Settings",         href: "/creator/settings",  icon: <Settings size={16} /> },
];

export default function CreatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell navItems={navItems} user={{ name: "Sara Malik", sub: "28K · Fashion · Karachi" }}>
      {children}
    </AppShell>
  );
}
