"use client";
import { DollarSign, Clock, TrendingUp } from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import StatCard from "@/components/shared/StatCard";
import Avatar from "@/components/ui/Avatar";

const MONTHS = [
  { m:"Jan", v:12000 }, { m:"Feb", v:8500  }, { m:"Mar", v:18000 },
  { m:"Apr", v:14000 }, { m:"May", v:22000 }, { m:"Jun", v:15500 },
];

const TRANSACTIONS = [
  { title:"Summer Lawn Post",  brand:"Gul Ahmed",  amount:"+₹5,000", date:"12 Jun", paid:true  },
  { title:"Brand Story",       brand:"Alkaram",    amount:"+₹2,500", date:"10 Jun", paid:true  },
  { title:"Spring Campaign",   brand:"Sapphire",   amount:"+₹9,000", date:"5 Jun",  paid:true  },
  { title:"Eid Collection",    brand:"Khaadi",     amount:"₹8,000",  date:"Pending",paid:false },
];

const maxV = Math.max(...MONTHS.map((m) => m.v));

export default function CreatorEarnings() {
  return (
    <div>
      <TopBar title="Earnings" sub="Your income from brand deals — updated in real time" />
      <div className="p-7 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3.5">
          <StatCard label="Total earned"     value="₹89,200" sub="All time"              icon={<DollarSign size={17}/>} color="#10D9A0" trend={28}/>
          <StatCard label="Pending release"  value="₹15,500" sub="3 deals in progress"  icon={<Clock size={17}/>}      color="#F59E0B"/>
          <StatCard label="This month"       value="₹15,500" sub="Jun 2025"              icon={<TrendingUp size={17}/>} color="#7C3AFF" trend={28}/>
        </div>

        <div className="grid gap-3.5" style={{ gridTemplateColumns: "1fr 290px" }}>
          {/* Bar chart */}
          <div className="rounded-2xl p-5" style={{ background: "#10101E", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-[14px] font-bold text-text-primary">Monthly earnings (PKR)</h3>
              <span className="text-[12px] px-3 py-1 rounded-full font-semibold"
                style={{ background: "rgba(74,74,102,0.3)", color: "#4A4A66" }}>Last 6 months</span>
            </div>
            <div className="flex items-end gap-3" style={{ height: 160 }}>
              {MONTHS.map((m) => {
                const h = Math.round((m.v / maxV) * 140);
                const isCurrent = m.m === "Jun";
                return (
                  <div key={m.m} className="flex-1 flex flex-col items-center gap-1.5">
                    <div className="text-[10px] font-bold transition-all"
                      style={{ color: isCurrent ? "#10D9A0" : "transparent" }}>
                      ₹{(m.v / 1000).toFixed(1)}K
                    </div>
                    <div className="w-full rounded-t-[5px] transition-all duration-500"
                      style={{
                        height: h,
                        background: isCurrent
                          ? "linear-gradient(135deg,#7C3AFF,#DB2777)"
                          : "rgba(124,58,255,0.18)",
                        boxShadow: isCurrent ? "0 0 20px rgba(124,58,255,0.3)" : "none",
                      }} />
                    <span className="text-[11px] font-medium"
                      style={{ color: isCurrent ? "#9F5FFF" : "#4A4A66" }}>{m.m}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent transactions */}
          <div className="rounded-2xl overflow-hidden" style={{ background: "#10101E", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="px-4 py-3.5" style={{ background: "#161628", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <h3 className="text-[13px] font-bold text-text-primary">Recent transactions</h3>
            </div>
            <div>
              {TRANSACTIONS.map((t, i) => (
                <div key={t.title}
                  className="flex items-center gap-2.5 px-4 py-3 table-row-hover transition-colors"
                  style={{ borderBottom: i < TRANSACTIONS.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                  <Avatar name={t.brand} size={30} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-bold text-text-primary truncate">{t.title}</div>
                    <div className="text-[11px]" style={{ color: "#4A4A66" }}>{t.brand} · {t.date}</div>
                  </div>
                  <span className="text-[14px] font-extrabold tracking-tight flex-shrink-0"
                    style={{ color: t.paid ? "#10D9A0" : "#F59E0B" }}>
                    {t.amount}
                  </span>
                </div>
              ))}
            </div>

            {/* Payout CTA */}
            <div className="p-4" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
              <button className="w-full py-2.5 rounded-xl text-[13px] font-bold text-white transition-all hover:-translate-y-px"
                style={{ background: "linear-gradient(135deg,#10D9A0,#0BA5D3)", border: "none", boxShadow: "0 4px 16px rgba(16,217,160,0.3)", cursor: "pointer" }}>
                Withdraw earnings
              </button>
              <p className="text-center text-[11px] mt-2" style={{ color: "#4A4A66" }}>
                JazzCash · EasyPaisa · Bank transfer
              </p>
            </div>
          </div>
        </div>

        {/* Platform breakdown */}
        <div className="rounded-2xl p-5" style={{ background: "#10101E", border: "1px solid rgba(255,255,255,0.07)" }}>
          <h3 className="text-[14px] font-bold text-text-primary mb-4">Earnings by platform</h3>
          <div className="grid grid-cols-4 gap-3">
            {[
              { platform:"Instagram", icon:"📸", amount:"₹62,000", pct:70, color:"#DB2777" },
              { platform:"TikTok",    icon:"🎵", amount:"₹18,200", pct:20, color:"#7C3AFF" },
              { platform:"YouTube",   icon:"▶",  amount:"₹9,000",  pct:10, color:"#F59E0B" },
              { platform:"Facebook",  icon:"👤",  amount:"₹0",      pct:0,  color:"#4A4A66"  },
            ].map((p) => (
              <div key={p.platform} className="rounded-xl p-4 text-center" style={{ background: "#161628" }}>
                <div className="text-2xl mb-2">{p.icon}</div>
                <div className="text-[13px] font-bold text-text-primary mb-0.5">{p.amount}</div>
                <div className="text-[11px] mb-2.5" style={{ color: "#4A4A66" }}>{p.platform}</div>
                {/* Bar */}
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${p.pct}%`, background: p.color }} />
                </div>
                <div className="text-[10px] mt-1.5 font-semibold" style={{ color: p.color }}>{p.pct}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
