import type { Metadata } from "next";
import BrandCampaigns from "@/components/brand/BrandCampaigns";
export const metadata: Metadata = { title: "Campaigns" };
export default function Page() { return <BrandCampaigns />; }
