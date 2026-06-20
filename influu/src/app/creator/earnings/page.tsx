import type { Metadata } from "next";
import CreatorEarnings from "@/components/creator/CreatorEarnings";
export const metadata: Metadata = { title: "Earnings" };
export default function Page() { return <CreatorEarnings />; }
