"use client";
import { useState, useMemo } from "react";
import { Search, Filter, Check } from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import toast from "react-hot-toast";

const CREATORS = [
  { id:"1", name:"Amna Khalid",  niche:"Fashion",   city:"Karachi",   platform:"Instagram", followers:"45K",  eng:"4.2%", rate:"₹8,000",  verified:true,  score:94 },
  { id:"2", name:"Bilal Ahmed",  niche:"Food",      city:"Lahore",    platform:"TikTok",    followers:"120K", eng:"6.8%", rate:"₹12,000", verified:true,  score:97 },
  { id:"3", name:"Sara Malik",   niche:"Beauty",    city:"Islamabad", platform:"Instagram", followers:"28K",  eng:"5.1%", rate:"₹5,000",  verified:true,  score:89 },
  { id:"4", name:"Hassan Raza",  niche:"Tech",      city:"Karachi",   platform:"YouTube",   followers:"89K",  eng:"3.9%", rate:"₹22,000", verified:true,  score:91 },
  { id:"5", name:"Fatima Noor",  niche:"Lifestyle", city:"Lahore",    platform:"Instagram", followers:"62K",  eng:"4.7%", rate:"₹10,000", verified:false, score:85 },
  { id:"6", name:"Usman Tariq",  niche:"Fitness",   city:"Karachi",   platform:"TikTok",    followers:"33K",  eng:"7.2%", rate:"₹7,000",  verified:true,  score:93 },
  { id:"7", name:"Zainab Shah",  niche:"Beauty",    city:"Karachi",   platform:"Instagram", followers:"18K",  eng:"8.1%", rate:"₹4,000",  verified:true,  score:88 },
  { id:"8", name:"Omar Cheema",  niche:"Travel",    city:"Lahore",    platform:"YouTube",   followers:"55K",  eng:"4.4%", rate:"₹15,000", verified:false, score:82 },
  { id:"9", name:"Mahnoor Ali",  niche:"Fashion",   city:"Karachi",   platform:"TikTok",    followers:"78K",  eng:"5.9%", rate:"₹9,000",  verified:true,  score:96 },
];

const PLATFORM_FILTERS = ["All", "TikTok", "Instagram", "YouTube"];

export default function FindCreators() {
  const [q, setQ]       = useState("");
  const [pf, setPf]     = useState("All");

  const shown = useMemo(() =>
    CREATORS.filter((c) =>
      (q === "" || c.name.toLowerCase().includes(q.toLowerCase()) || c.niche.toLowerCase().includes(q.toLowerCase())) &&
      (pf === "All" || c.platform === pf)
    ),
    [q, pf]
  );

  return (
    <div>
      <TopBar title="Find creators" sub="Browse verified Pakistani creators" />

      <div className="p-7">
        {/* Search + filters */}
        <div className="flex gap-2.5 mb-5 items-center">
          <div className="flex-1 relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#4A4A66" }} />
            <input value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name or niche…"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-text-primary transition-all focus:outline-none"
              style={{ background: "#10101E", border: "1.5px solid rgba(255,255,255,0.07)" }}
              onFocus={(e) => { e.target.style.borderColor = "#7C3AFF"; }}
              onBlur={(e)  => { e.target.style.borderColor = "rgba(255,255,255,0.07)"; }} />
          </div>
          {PLATFORM_FILTERS.map((p) => (
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
          <button className="px-3.5 py-2.5 rounded-[9px] text-[13px] flex items-center gap-1.5 transition-all"
            style={{ background: "#10101E", border: "1px solid rgba(255,255,255,0.07)", color: "#8B8BAA", cursor: "pointer" }}>
            <Filter size={13} /> Filter
          </button>
        </div>

        <p className="text-[12px] mb-4 font-medium" style={{ color: "#4A4A66" }}>{shown.length} creator{shown.length !== 1 ? "s" : ""} found</p>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-3.5">
          {shown.map((c) => (
            <div key={c.id} className="hover-lift rounded-2xl p-4.5 cursor-pointer"
              style={{ background: "#10101E", border: "1px solid rgba(255,255,255,0.07)", padding: "18px" }}>
              {/* Header */}
              <div className="flex justify-between items-start mb-3.5">
                <div className="flex gap-2.5 items-center">
                  <Avatar name={c.name} size={38} />
                  <div>
                    <div className="text-[13px] font-bold text-text-primary flex items-center gap-1">
                      {c.name.split(" ")[0]}
                      {c.verified && (
                        <span className="w-3.5 h-3.5 rounded-full inline-flex items-center justify-center flex-shrink-0"
                          style={{ background: "rgba(16,217,160,0.2)", border: "1px solid rgba(16,217,160,0.4)" }}>
                          <Check size={7} color="#10D9A0" />
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] mt-0.5" style={{ color: "#4A4A66" }}>{c.niche} · {c.city}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-medium mb-0.5" style={{ color: "#4A4A66" }}>Score</div>
                  <div className="text-[16px] font-extrabold" style={{ color: c.score > 90 ? "#10D9A0" : "#F59E0B" }}>{c.score}</div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-1.5 mb-3.5">
                {[["Followers", c.followers], ["Engagement", c.eng], ["Platform", c.platform]].map(([l, v]) => (
                  <div key={l} className="rounded-[8px] p-2 text-center" style={{ background: "#161628" }}>
                    <div className="text-[12px] font-bold text-text-primary">{v}</div>
                    <div className="text-[9px] uppercase tracking-[0.05em] mt-0.5" style={{ color: "#4A4A66" }}>{l}</div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[15px] font-extrabold tracking-tight" style={{ color: "#10D9A0" }}>{c.rate}</span>
                  <span className="text-[11px] ml-1" style={{ color: "#4A4A66" }}>/post</span>
                </div>
                <button
                  onClick={() => toast.success(`Offer sent to ${c.name}!`)}
                  className="px-3.5 py-1.5 rounded-[9px] text-[12px] font-bold text-white transition-all hover:-translate-y-px"
                  style={{ background: "linear-gradient(135deg,#7C3AFF,#DB2777)", border: "none", boxShadow: "0 2px 12px rgba(124,58,255,0.3)", cursor: "pointer" }}>
                  Send offer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
