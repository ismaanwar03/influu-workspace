import type { Metadata } from "next";
import BrandPayments from "@/components/brand/BrandPayments";
export const metadata: Metadata = { title: "Payments" };
export default function Page() { return <BrandPayments />; }
