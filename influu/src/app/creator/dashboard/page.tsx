import type { Metadata } from "next";
import CreatorDashboard from "@/components/creator/CreatorDashboard";
export const metadata: Metadata = { title: "Dashboard" };
export default function Page() { return <CreatorDashboard />; }
