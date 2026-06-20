"use client";
import { useRouter } from "next/navigation";
import { Clock, DollarSign, FileText, Star, AlertCircle, Search, BarChart2, ArrowUpRight } from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import StatCard from "@/components/shared/StatCard";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import { ROUTES } from "@/lib/constants"
import { formatPKRExact } from "@/lib/utils";

const CONTRACTS = [
  { id:"1", brand:"Khaadi",    title:"Eid Collection Reel",  platform:"Instagram", amount:8000,  status:"draft_needed", label:"Submit draft" },
  { id:"2", brand:"Gul Ahmed", title:"Summer Lawn Post",      platform:"Instagram", amount:5000,  status:"timer",        label:"Timer: 4d 12h left" },
  { id:"3", brand:"Alkaram",   title:"Story Campaign",        platform:"Instagram", amount:2500,  status:"paid",         label:"Paid out ✓" },
];

const STATUS_COLORS: Record<string, string> = {
  draft_needed: "#F59E0B",
  timer:        "#10D9A0",
  paid:         "#9F5FFF",
};

export default function CreatorDashboard() {
  const router = useRouter();

  return (
    <div>
      <TopBar
        title="Dashboard"
        sub="Good morning, Sara! 👋"
        action={{ label: "Browse campaigns", onClick: () => router.push(ROUTES.creator.browse) }}
      />

      <div className="p-7 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-3.5">
          <StatCard label="Pending earnings" value="₹15,500"  sub="3 active deals"    icon={<Clock size={17}/>}      color="#F59E0B"/>
          <StatCard label="Total earned"     value="₹89,200"  sub="All time"          icon={<DollarSign size={17}/>}  color="#10D9A0" trend={28}/>
          <StatCard label="Active contracts" value="3"        sub="In progress"       icon={<FileText size={17}/>}    color="#7C3AFF"/>
          <StatCard label="Avg. rating"      value="4.9 ★"    sub="From 24 reviews"   icon={<Star size={17}/>}        color="#DB2777"/>
        </div>

        {/* Alert banner */}
        <div className="rounded-2xl p-4 flex items-center gap-3.5"
          style={{ background: "linear-gradient(145deg,rgba(245,158,11,0.1),rgba(245,158,11,0.03))", border: "1px solid rgba(245,158,11,0.3)" }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)" }}>
            <AlertCircle size={20} color="#F59E0B" />
          </div>
          <div className="flex-1">
            <div className="text-[14px] font-bold text-text-primary mb-0.5">Draft pending — Khaadi · Eid Collection Reel</div>
            <div className="text-[13px]" style={{ color: "#4A4A66" }}>Submit your draft for review. Deadline in 2 days. ₹8,000 locked in escrow.</div>
          </div>
          <button onClick={() => router.push(ROUTES.creator.contracts)}
            className="px-4 py-2 rounded-xl text-[13px] font-bold text-white flex-shrink-0 transition-all hover:-translate-y-px"
            style={{ background: "#F59E0B", border: "none", cursor: "pointer" }}>
            Submit draft →
          </button>
        </div>

        {/* Active contracts */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "#10101E", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex justify-between items-center px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <h3 className="text-[15px] font-bold text-text-primary">Active contracts</h3>
            <button onClick={() => router.push(ROUTES.creator.contracts)}
              className="flex items-center gap-1 text-[13px] font-semibold hover:text-brand transition-colors"
              style={{ background: "none", border: "none", color: "#9F5FFF", cursor: "pointer" }}>
              View all <ArrowUpRight size={13} />
            </button>
          </div>
          <div>
            {CONTRACTS.map((c, i) => (
              <div key={c.id} className="flex items-center gap-3.5 px-5 py-3.5 table-row-hover transition-colors"
                style={{ borderBottom: i < CONTRACTS.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                <Avatar name={c.brand} size={36} />
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-bold text-text-primary mb-1">{c.title}</div>
                  <div className="flex gap-2">
                    <Badge color="#8B8BAA">{c.brand}</Badge>
                    <Badge color="#8B8BAA">{c.platform}</Badge>
                  </div>
                </div>
                <div className="text-[15px] font-extrabold tracking-tight flex-shrink-0" style={{ color: "#10D9A0" }}>
                  ₹{c.amount.toLocaleString()}
                </div>
                <Badge color={STATUS_COLORS[c.status] ?? "#8B8BAA"} dot={c.status === "draft_needed"}>
                  {c.label}
                </Badge>
                {c.status === "draft_needed" && (
                  <button onClick={() => router.push(ROUTES.creator.contracts)}
                    className="px-3.5 py-2 rounded-[9px] text-[12px] font-bold text-white flex-shrink-0 transition-all hover:-translate-y-px"
                    style={{ background: "linear-gradient(135deg,#7C3AFF,#DB2777)", border: "none", boxShadow: "0 2px 12px rgba(124,58,255,0.3)", cursor: "pointer" }}>
                    Submit →
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3.5">
          <div onClick={() => router.push(ROUTES.creator.browse)} className="hover-lift cursor-pointer rounded-2xl p-5"
            style={{ background: "linear-gradient(145deg,rgba(124,58,255,0.12),rgba(124,58,255,0.04))", border: "1px solid rgba(124,58,255,0.18)" }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
              style={{ background: "rgba(124,58,255,0.2)", color: "#7C3AFF" }}>
              <Search size={18} />
            </div>
            <div className="text-[14px] font-bold text-text-primary mb-1">Browse open campaigns</div>
            <div className="text-[12px] leading-relaxed" style={{ color: "#4A4A66" }}>6 new campaigns match your niche this week.</div>
          </div>
          <div onClick={() => router.push(ROUTES.creator.earnings)} className="hover-lift cursor-pointer rounded-2xl p-5"
            style={{ background: "linear-gradient(145deg,rgba(16,217,160,0.08),rgba(16,217,160,0.02))", border: "1px solid rgba(16,217,160,0.14)" }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
              style={{ background: "rgba(16,217,160,0.15)", color: "#10D9A0" }}>
              <BarChart2 size={18} />
            </div>
            <div className="text-[14px] font-bold text-text-primary mb-1">View earnings</div>
            <div className="text-[12px] leading-relaxed" style={{ color: "#4A4A66" }}>₹89,200 earned. +28% vs last month.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
