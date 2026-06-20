"use client";
import { Zap } from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import toast from "react-hot-toast";

const PACKAGES = [
  { type:"Instagram Story", icon:"📸", timer:"24-hour release", rate:"₹3,000", active:true },
  { type:"Instagram Reel",  icon:"🎬", timer:"7-day release",   rate:"₹8,000", active:true },
  { type:"TikTok Video",    icon:"🎵", timer:"7-day release",   rate:"₹6,000", active:true },
  { type:"YouTube Video",   icon:"▶",  timer:"7-day release",   rate:"Not set", active:false },
];

export default function CreatorPackages() {
  return (
    <div>
      <TopBar title="My packages" sub="Your rates — brands purchase directly or send custom offers"
        action={{ label: "Add package", onClick: () => toast("Package builder coming soon!") }} />
      <div className="p-7 max-w-[620px]">
        {/* Info banner */}
        <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl mb-5"
          style={{ background: "rgba(124,58,255,0.08)", border: "1px solid rgba(124,58,255,0.2)" }}>
          <Zap size={14} color="#9F5FFF" className="mt-0.5 flex-shrink-0" />
          <span className="text-[13px] leading-relaxed" style={{ color: "#9F5FFF" }}>
            Active packages are visible on your public profile. Brands can purchase directly or send custom offers with different terms.
          </span>
        </div>

        {/* Package list */}
        <div className="space-y-3">
          {PACKAGES.map((p) => (
            <div key={p.type}
              className="flex items-center gap-3.5 px-5 py-4 rounded-2xl transition-all"
              style={{
                background: p.active ? "#10101E" : "rgba(255,255,255,0.02)",
                border: `1.5px solid ${p.active ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.04)"}`,
                opacity: p.active ? 1 : 0.5,
              }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-[20px] flex-shrink-0"
                style={{ background: "#161628" }}>
                {p.icon}
              </div>
              <div className="flex-1">
                <div className="text-[14px] font-bold text-text-primary mb-0.5">{p.type}</div>
                <div className="text-[12px]" style={{ color: "#4A4A66" }}>
                  {p.timer}
                  <span className="mx-1.5">·</span>
                  <span style={{ color: p.active ? "#10D9A0" : "#4A4A66" }}>{p.active ? "Visible to brands" : "Not set up yet"}</span>
                </div>
              </div>
              <div className="text-right mr-4">
                <div className="text-[18px] font-extrabold tracking-tight"
                  style={{ color: p.active ? "#10D9A0" : "#4A4A66" }}>{p.rate}</div>
                <div className="text-[11px]" style={{ color: "#4A4A66" }}>per post</div>
              </div>
              <button
                onClick={() => toast.success(p.active ? `Editing ${p.type}…` : `Setting up ${p.type}…`)}
                className="px-3.5 py-2 rounded-[9px] text-[12px] font-semibold text-text-secondary hover:text-text-primary transition-colors"
                style={{ background: "#161628", border: "1px solid rgba(255,255,255,0.07)", cursor: "pointer" }}>
                {p.active ? "Edit" : "Set up"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
