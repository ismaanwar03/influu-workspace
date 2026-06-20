import type { Metadata } from "next";
import SignupPage from "@/components/auth/SignupPage";
export const metadata: Metadata = { title: "Create account" };
export default function Page() { return <SignupPage />; }
