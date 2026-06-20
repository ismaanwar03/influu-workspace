import type { Metadata } from "next";
import CreatorOnboarding from "@/components/onboarding/CreatorOnboarding";
export const metadata: Metadata = { title: "Creator setup" };
export default function Page() { return <CreatorOnboarding />; }
