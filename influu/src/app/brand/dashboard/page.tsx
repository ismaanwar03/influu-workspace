import type { Metadata } from "next";
import BrandDashboard from "@/components/brand/BrandDashboard";
export const metadata: Metadata = { title: "Dashboard" };
export default function Page() { return <BrandDashboard />; }
