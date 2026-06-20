"use client";
import { useRouter } from "next/navigation";
import { Briefcase, Lock, Clock, Users, Plus, Search, ArrowUpRight } from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import StatCard from "@/components/shared/StatCard";
import EscrowPipeline from "@/components/shared/EscrowPipeline";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import { ROUTES } from "@/lib/constants";
import { formatPKRExact } from "@/lib/utils";

const ACTIVE_CAMPAIGNS = [
  { id: "1", title: "Eid Collection Reel",    platform: "Instagram", creator: "Amna Khalid",  amount: 12000, status: "draft_submitted", deadline: "2d left" },
  { id: "2", title: "Summer TikTok Series",   platform: "TikTok",   creator: "Bilal Ahmed",   amount: 8500,  status: "timer_running",   deadline: "5d left" },
  { id: "3", title: "Brand Story — Ramzan",   platform: "Instagram", creator: "Sara Malik",    amount: 3500,  status: "payment_released",deadline: "Done" },
  { id: "4", title: "YouTube Unboxing",        platform: "YouTube",   creator: "Hassan Raza",  amount: 25000, status: "active",           deadline: "8d left" },
];

const STATUS_COLORS: Record<string, string> = {
  active:           "#8B8BAA",
  draft_submitted:  "#F59E0B",
  draft_approved:   "#10D9A0",
  timer_running:    "#10D9A0",
  payment_released: "#9F5FFF",
  disputed:         "#F45B69",
};

const STATUS_LABELS: Record<string, string> = {
  active:           "Awaiting draft",
  draft_submitted:  "Review draft",
  draft_approved:   "Draft approved",
  timer_running:    "Post live ✓",
  payment_released: "Paid out",
  disputed:         "Disputed",
};

export default function BrandDashboard() {
  const router = useRouter();

  return (
    <div>
      <TopBar
        title="Dashboard"
        sub="Wednesday, 15 May 2025 · Good morning, Ahmed"
        action={{ label: "New campaign", onClick: () => router.push(ROUTES.brand.newCampaign) }}
      />

      <div className="p-7 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-3.5">
          <StatCard label="Active campaigns" value="3"       sub="2 need attention" icon={<Briefcase size={17}/>} color="#7C3AFF" trend={12}/>
          <StatCard label="In escrow"        value="₹48,500" sub="4 deals locked"   icon={<Lock size={17}/>}      color="#10D9A0" trend={8}/>
          <StatCard label="Pending action"   value="2"       sub="Draft to review"  icon={<Clock size={17}/>}     color="#F59E0B"/>
          <StatCard label="Creators hired"   value="18"      sub="All time"         icon={<Users size={17}/>}     color="#DB2777" trend={22}/>
        </div>

        {/* Active campaigns table */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "#10101E", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex justify-between items-center px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <h3 className="text-[15px] font-bold text-text-primary">Active campaigns</h3>
            <button onClick={() => router.push(ROUTES.brand.campaigns)}
              className="flex items-center gap-1 text-[13px] font-semibold text-brand-light hover:text-brand transition-colors"
              style={{ background: "none", border: "none", cursor: "pointer" }}>
              View all <ArrowUpRight size={13}/>
            </button>
          </div>

          <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            {ACTIVE_CAMPAIGNS.map((c) => {
              const color = STATUS_COLORS[c.status] ?? "#8B8BAA";
              const label = STATUS_LABELS[c.status] ?? c.status;
              const isDraft = c.status === "draft_submitted";

              return (
                <div key={c.id}
                  className="flex items-center gap-4 px-5 py-3.5 transition-colors cursor-pointer"
                  style={{ background: "transparent" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  onClick={() => isDraft && router.push(ROUTES.brand.contracts)}>

                  <Avatar name={c.creator} size={36}/>

                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-bold text-text-primary mb-1">{c.title}</div>
                    <div className="flex items-center gap-2">
                      <Badge color="#8B8BAA">{c.platform}</Badge>
                      <Badge color="#8B8BAA">{c.creator}</Badge>
                      <span className="text-[11px]" style={{ color: "#4A4A66" }}>{c.deadline}</span>
                    </div>
                  </div>

                  {/* Pipeline */}
                  <EscrowPipeline status={c.status} compact />

                  <div className="text-right flex-shrink-0">
                    <div className="text-[15px] font-extrabold mb-1 tracking-tight" style={{ color: "#10D9A0" }}>
                      {formatPKRExact(c.amount)}
                    </div>
                    <Badge color={color} dot={isDraft}>{label}</Badge>
                  </div>

                  {isDraft && (
                    <button
                      onClick={(e) => { e.stopPropagation(); router.push(ROUTES.brand.contracts); }}
                      className="px-3.5 py-2 rounded-[9px] text-[12px] font-bold text-white flex-shrink-0 transition-all hover:-translate-y-px"
                      style={{ background: "linear-gradient(135deg,#7C3AFF,#DB2777)", border: "none", boxShadow: "0 2px 12px rgba(124,58,255,0.3)" }}>
                      Review →
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3.5">
          <div onClick={() => router.push(ROUTES.brand.newCampaign)} className="hover-lift cursor-pointer rounded-2xl p-5"
            style={{ background: "linear-gradient(145deg,rgba(124,58,255,0.15),rgba(124,58,255,0.04))", border: "1px solid rgba(124,58,255,0.2)" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
              style={{ background: "rgba(124,58,255,0.2)", border: "1px solid rgba(124,58,255,0.3)", color: "#7C3AFF" }}>
              <Plus size={19}/>
            </div>
            <div className="text-[14px] font-bold text-text-primary mb-1">Post a new campaign</div>
            <div className="text-[12px] leading-relaxed" style={{ color: "#4A4A66" }}>
              Set your brief, budget and deadline. Creators apply or receive direct offers.
            </div>
          </div>

          <div onClick={() => router.push(ROUTES.brand.findCreators)} className="hover-lift cursor-pointer rounded-2xl p-5"
            style={{ background: "linear-gradient(145deg,rgba(16,217,160,0.08),rgba(16,217,160,0.02))", border: "1px solid rgba(16,217,160,0.14)" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
              style={{ background: "rgba(16,217,160,0.15)", border: "1px solid rgba(16,217,160,0.25)", color: "#10D9A0" }}>
              <Search size={19}/>
            </div>
            <div className="text-[14px] font-bold text-text-primary mb-1">Find creators directly</div>
            <div className="text-[12px] leading-relaxed" style={{ color: "#4A4A66" }}>
              Browse verified Pakistani creators filtered by niche, platform and engagement rate.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
