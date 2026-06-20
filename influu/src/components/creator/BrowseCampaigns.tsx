"use client";
import { useState, useMemo } from "react";
import { Search, Filter } from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import toast from "react-hot-toast";

const CAMPAIGNS = [
  { id:"1", brand:"Khaadi",      title:"Eid Collection Shoot",  platform:"Instagram", type:"Reel",  budget:"₹10K–15K", deadline:"20 Jun", apps:7,  niche:"Fashion",   hot:true },
  { id:"2", brand:"Foodpanda PK",title:"App Feature Promo",     platform:"TikTok",    type:"Video", budget:"₹8K–12K",  deadline:"22 Jun", apps:14, niche:"Food",      hot:false },
  { id:"3", brand:"Daraz",       title:"11.11 Sale Awareness",  platform:"Instagram", type:"Story", budget:"₹3K–5K",   deadline:"25 Jun", apps:22, niche:"Lifestyle", hot:false },
  { id:"4", brand:"Telenor PK",  title:"JazzCash Feature",      platform:"Instagram", type:"Story", budget:"₹5K–8K",   deadline:"28 Jun", apps:9,  niche:"Tech",      hot:true },
  { id:"5", brand:"Gul Ahmed",   title:"Lawn Season Launch",    platform:"YouTube",   type:"Video", budget:"₹20K–30K", deadline:"30 Jun", apps:4,  niche:"Fashion",   hot:true },
  { id:"6", brand:"Nestlé PK",   title:"Product Review Reel",   platform:"TikTok",    type:"Video", budget:"₹6K–10K",  deadline:"2 Jul",  apps:18, niche:"Food",      hot:false },
];

const PLATFORM_TABS = ["All", "TikTok", "Instagram", "YouTube"];

export default function BrowseCampaigns() {
  const [q, setQ]   = useState("");
  const [pf, setPf] = useState("All");

  const shown = useMemo(() =>
    CAMPAIGNS.filter((c) =>
      (q === "" || c.title.toLowerCase().includes(q.toLowerCase()) || c.brand.toLowerCase().includes(q.toLowerCase())) &&
      (pf === "All" || c.platform === pf)
    ), [q, pf]
  );

  return (
    <div>
      <TopBar title="Browse campaigns" sub="Open campaigns you can apply to right now" />
      <div className="p-7">
        {/* Search bar */}
        <div className="flex gap-2.5 mb-5 items-center">
          <div className="flex-1 relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#4A4A66" }} />
            <input value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Search campaigns or brands…"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-text-primary transition-all focus:outline-none"
              style={{ background: "#10101E", border: "1.5px solid rgba(255,255,255,0.07)" }}
              onFocus={(e) => { e.target.style.borderColor = "#7C3AFF"; }}
              onBlur={(e)  => { e.target.style.borderColor = "rgba(255,255,255,0.07)"; }} />
          </div>
          {PLATFORM_TABS.map((p) => (
            <button key={p} onClick={() => setPf(p)}
              className="px-4 py-2.5 rounded-[9px] text-[13px] whitespace-nowrap transition-all"
              style={{
                border:     `1.5px solid ${pf === p ? "#7C3AFF" : "rgba(255,255,255,0.07)"}`,
                background: pf === p ? "rgba(124,58,255,0.15)" : "#10101E",
                color:      pf === p ? "#9F5FFF" : "#8B8BAA",
                fontWeight: pf === p ? 700 : 400,
                cursor: "pointer",
              }}>
              {p}
            </button>
          ))}
          <button className="px-3.5 py-2.5 rounded-[9px] flex items-center gap-1.5 text-[13px] transition-all hover:text-text-primary"
            style={{ background: "#10101E", border: "1px solid rgba(255,255,255,0.07)", color: "#8B8BAA", cursor: "pointer" }}>
            <Filter size={13} /> Filter
          </button>
        </div>

        <p className="text-[12px] font-medium mb-4" style={{ color: "#4A4A66" }}>{shown.length} campaign{shown.length !== 1 ? "s" : ""} available</p>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-3.5">
          {shown.map((c) => (
            <div key={c.id} className="hover-lift rounded-2xl cursor-pointer relative"
              style={{ background: "#10101E", border: "1px solid rgba(255,255,255,0.07)", padding: 18 }}>
              {c.hot && (
                <div className="absolute top-3.5 right-3.5 px-2 py-0.5 rounded-full text-[10px] font-bold"
                  style={{ background: "rgba(244,91,105,0.15)", border: "1px solid rgba(244,91,105,0.3)", color: "#F45B69" }}>
                  🔥 Hot
                </div>
              )}

              <div className="flex items-center gap-2.5 mb-3.5">
                <Avatar name={c.brand} size={36} />
                <div>
                  <div className="text-[14px] font-bold text-text-primary">{c.title}</div>
                  <div className="text-[11px] mt-0.5" style={{ color: "#4A4A66" }}>{c.brand}</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-3.5">
                <Badge color="#8B8BAA">{c.platform}</Badge>
                <Badge color="#8B8BAA">{c.type}</Badge>
                <Badge color="#9F5FFF">{c.niche}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3.5">
                <div className="rounded-[9px] p-2.5" style={{ background: "#161628" }}>
                  <div className="text-[14px] font-extrabold tracking-tight" style={{ color: "#10D9A0" }}>{c.budget}</div>
                  <div className="text-[9px] uppercase tracking-[0.05em] mt-0.5" style={{ color: "#4A4A66" }}>Budget range</div>
                </div>
                <div className="rounded-[9px] p-2.5" style={{ background: "#161628" }}>
                  <div className="text-[14px] font-extrabold text-text-primary">by {c.deadline}</div>
                  <div className="text-[9px] uppercase tracking-[0.05em] mt-0.5" style={{ color: "#4A4A66" }}>Deadline</div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[12px]" style={{ color: "#4A4A66" }}>{c.apps} applicants</span>
                <button
                  onClick={() => toast.success(`Applied to ${c.title}!`)}
                  className="px-4 py-2 rounded-[9px] text-[12px] font-bold text-white transition-all hover:-translate-y-px"
                  style={{ background: "linear-gradient(135deg,#7C3AFF,#DB2777)", border: "none", boxShadow: "0 2px 12px rgba(124,58,255,0.3)", cursor: "pointer" }}>
                  Apply now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
