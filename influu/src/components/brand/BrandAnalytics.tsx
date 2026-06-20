"use client";
import { Users, TrendingUp, Briefcase, DollarSign } from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import StatCard from "@/components/shared/StatCard";
import Avatar from "@/components/ui/Avatar";

const MONTHS = [
  { m:"Jan",v:12000 },{ m:"Feb",v:8500 },{ m:"Mar",v:18000 },
  { m:"Apr",v:14000 },{ m:"May",v:22000 },{ m:"Jun",v:15500 },
];
const TOP_CREATORS = [
  { name:"Bilal Ahmed",  reach:"280K", roi:"4.2x", eng:"6.8%" },
  { name:"Amna Khalid",  reach:"195K", roi:"3.8x", eng:"4.2%" },
  { name:"Sara Malik",   reach:"142K", roi:"3.1x", eng:"5.1%" },
];
const maxV = Math.max(...MONTHS.map((m) => m.v));

export default function BrandAnalytics() {
  return (
    <div>
      <TopBar title="Analytics" sub="Campaign performance and ROI overview" />
      <div className="p-7 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-3.5">
          <StatCard label="Total reach"     value="1.2M"  sub="Across all campaigns" icon={<Users size={17}/>}      color="#7C3AFF" trend={18}/>
          <StatCard label="Avg. engagement" value="5.4%"  sub="Above industry avg"   icon={<TrendingUp size={17}/>}  color="#10D9A0" trend={4}/>
          <StatCard label="Campaigns run"   value="12"    sub="Last 6 months"        icon={<Briefcase size={17}/>}   color="#DB2777"/>
          <StatCard label="Cost per reach"  value="₹0.04" sub="Per impression"       icon={<DollarSign size={17}/>}  color="#F59E0B" trend={-3}/>
        </div>

        <div className="grid gap-3.5" style={{ gridTemplateColumns: "1fr 300px" }}>
          {/* Bar chart */}
          <div className="rounded-2xl p-5" style={{ background: "#10101E", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-[14px] font-bold text-text-primary">Monthly spend (PKR)</h3>
              <span className="text-[12px] px-3 py-1 rounded-full font-semibold" style={{ background: "rgba(74,74,102,0.3)", color: "#4A4A66" }}>Last 6 months</span>
            </div>
            <div className="flex items-end gap-3" style={{ height: 160 }}>
              {MONTHS.map((m) => {
                const h = Math.round((m.v / maxV) * 140);
                const isCurrent = m.m === "Jun";
                return (
                  <div key={m.m} className="flex-1 flex flex-col items-center gap-1.5">
                    <div className="text-[10px] font-bold" style={{ color: isCurrent ? "#10D9A0" : "transparent" }}>
                      ₹{(m.v / 1000).toFixed(1)}K
                    </div>
                    <div className="w-full rounded-t-[5px] transition-all duration-500"
                      style={{
                        height: h,
                        background: isCurrent ? "linear-gradient(135deg,#7C3AFF,#DB2777)" : "rgba(124,58,255,0.18)",
                        boxShadow: isCurrent ? "0 0 20px rgba(124,58,255,0.3)" : "none",
                      }} />
                    <span className="text-[11px] font-medium" style={{ color: isCurrent ? "#9F5FFF" : "#4A4A66" }}>{m.m}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top creators */}
          <div className="rounded-2xl overflow-hidden" style={{ background: "#10101E", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <h3 className="text-[14px] font-bold text-text-primary">Top performing creators</h3>
            </div>
            <div className="p-4 space-y-0">
              {TOP_CREATORS.map((c, i) => (
                <div key={c.name} className="flex items-center gap-2.5 py-3"
                  style={{ borderBottom: i < TOP_CREATORS.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                  <span className="text-[13px] font-bold w-5 flex-shrink-0" style={{ color: "#4A4A66" }}>#{i + 1}</span>
                  <Avatar name={c.name} size={30} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-bold text-text-primary">{c.name.split(" ")[0]}</div>
                    <div className="text-[11px]" style={{ color: "#4A4A66" }}>{c.reach} reach · {c.eng} eng</div>
                  </div>
                  <span className="text-[13px] font-extrabold" style={{ color: "#10D9A0" }}>{c.roi}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
