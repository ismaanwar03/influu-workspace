"use client";
import { DollarSign, Lock, TrendingUp } from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import StatCard from "@/components/shared/StatCard";
import Badge from "@/components/ui/Badge";

const TRANSACTIONS = [
  { id:"1", title:"Summer TikTok Series", creator:"Bilal Ahmed",  amount:"₹7,820",  fee:"₹680",  date:"12 Jun 2025", status:"released" },
  { id:"2", title:"Brand Story — Ramzan", creator:"Sara Malik",   amount:"₹3,220",  fee:"₹280",  date:"10 Jun 2025", status:"released" },
  { id:"3", title:"Spring Reel",          creator:"Mahnoor Ali",  amount:"₹8,280",  fee:"₹720",  date:"2 Jun 2025",  status:"released" },
  { id:"4", title:"Eid Collection Reel",  creator:"Amna Khalid",  amount:"₹12,000", fee:"—",      date:"In escrow",   status:"escrow" },
];

export default function BrandPayments() {
  return (
    <div>
      <TopBar title="Payments" sub="Transaction history and escrow status" />
      <div className="p-7 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3.5">
          <StatCard label="Total spent"    value="₹48,500" sub="All time"        icon={<DollarSign size={17}/>} color="#10D9A0" trend={8}/>
          <StatCard label="In escrow now"  value="₹12,000" sub="1 active deal"   icon={<Lock size={17}/>}      color="#F59E0B"/>
          <StatCard label="Deals completed" value="11"     sub="Successfully paid" icon={<TrendingUp size={17}/>} color="#7C3AFF" trend={15}/>
        </div>

        {/* Table */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "#10101E", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", background: "#161628" }}>
            <h3 className="text-[14px] font-bold text-text-primary">Transaction history</h3>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ background: "#161628" }}>
                {["Campaign", "Creator", "Amount", "Platform fee (8%)", "Date", "Status"].map((h) => (
                  <th key={h} className="px-5 py-2.5 text-left text-[11px] font-bold uppercase tracking-[0.06em]"
                    style={{ color: "#4A4A66", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TRANSACTIONS.map((t, i) => (
                <tr key={t.id} className="table-row-hover transition-colors"
                  style={{ borderBottom: i < TRANSACTIONS.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                  <td className="px-5 py-3.5"><div className="text-[13px] font-bold text-text-primary">{t.title}</div></td>
                  <td className="px-5 py-3.5"><span className="text-[13px]" style={{ color: "#8B8BAA" }}>{t.creator}</span></td>
                  <td className="px-5 py-3.5"><span className="text-[14px] font-extrabold tracking-tight" style={{ color: "#10D9A0" }}>{t.amount}</span></td>
                  <td className="px-5 py-3.5"><span className="text-[13px]" style={{ color: "#4A4A66" }}>{t.fee}</span></td>
                  <td className="px-5 py-3.5"><span className="text-[13px]" style={{ color: "#4A4A66" }}>{t.date}</span></td>
                  <td className="px-5 py-3.5">
                    <Badge color={t.status === "released" ? "#10D9A0" : "#F59E0B"} dot={t.status === "escrow"}>
                      {t.status === "released" ? "Released" : "In escrow"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
