import type { Metadata } from "next";
import CreatorPackages from "@/components/creator/CreatorPackages";
export const metadata: Metadata = { title: "My packages" };
export default function Page() { return <CreatorPackages />; }
