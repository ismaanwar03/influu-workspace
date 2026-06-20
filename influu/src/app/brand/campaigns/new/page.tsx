import type { Metadata } from "next";
import CreateCampaign from "@/components/brand/CreateCampaign";
export const metadata: Metadata = { title: "New campaign" };
export default function Page() { return <CreateCampaign />; }
