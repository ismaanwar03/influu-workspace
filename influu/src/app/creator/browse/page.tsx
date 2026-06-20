import type { Metadata } from "next";
import BrowseCampaigns from "@/components/creator/BrowseCampaigns";
export const metadata: Metadata = { title: "Browse campaigns" };
export default function Page() { return <BrowseCampaigns />; }
