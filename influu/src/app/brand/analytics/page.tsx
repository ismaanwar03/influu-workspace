import type { Metadata } from "next";
import BrandAnalytics from "@/components/brand/BrandAnalytics";
export const metadata: Metadata = { title: "Analytics" };
export default function Page() { return <BrandAnalytics />; }
