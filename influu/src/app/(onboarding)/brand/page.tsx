import type { Metadata } from "next";
import BrandOnboarding from "@/components/onboarding/BrandOnboarding";
export const metadata: Metadata = { title: "Brand setup" };
export default function Page() { return <BrandOnboarding />; }
