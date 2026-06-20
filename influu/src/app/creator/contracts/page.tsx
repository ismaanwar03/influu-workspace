import type { Metadata } from "next";
import CreatorContracts from "@/components/creator/CreatorContracts";
export const metadata: Metadata = { title: "Contracts" };
export default function Page() { return <CreatorContracts />; }
