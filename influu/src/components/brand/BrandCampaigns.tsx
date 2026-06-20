"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import TopBar from "@/components/layout/TopBar";
import Badge from "@/components/ui/Badge";
import { ROUTES } from "@/lib/constants";

const ALL_CAMPAIGNS = [
  { id:"1", title:"Eid Collection Reel",  platform:"Instagram", type:"Reel",  budget:"₹12,000", deadline:"20 Jun", apps:8,  status:"active" },
  { id:"2", title:"Summer TikTok Series", platform:"TikTok",   type:"Video", budget:"₹8,500",  deadline:"25 Jun", apps:12, status:"active" },
  { id:"3", title:"Winter Tease Story",   platform:"Instagram", type:"Story", budget:"₹3,500",  deadline:"30 Jun", apps:5,  status:"draft" },
  { id:"4", title:"YouTube Unboxing",     platform:"YouTube",  type:"Video", budget:"₹25,000", deadline:"5 Jul",  apps:3,  status:"active" },
  { id:"5", title:"Product Review Reel",  platform:"TikTok",   type:"Video", budget:"₹6,000",  deadline:"10 Jul", apps:15, status:"completed" },
];

const STATUS_COLORS: Record<string, string> = {
  active:    "#10D9A0",
  draft:     "#F59E0B",
  completed: "#9F5FFF",
  cancelled: "#F45B69",
};

const FILTERS = ["All", "Active", "Draft", "Completed"];

export default function BrandCampaigns() {
  const router = useRouter();
  const [filter, setFilter] = useState("All");

  const shown = filter === "All"
    ? ALL_CAMPAIGNS
    : ALL_CAMPAIGNS.filter((c) => c.status === filter.toLowerCase());

  return (
    <div>
      <TopBar
        title="Campaigns"
        sub={`${ALL_CAMPAIGNS.length} total campaigns`}
        action={{ label: "New campaign", onClick: () => router.push(ROUTES.brand.newCampaign) }}
      />

      <div className="p-7">
        {/* Filter tabs */}
        <div className="flex gap-2 mb-5">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-4 py-2 rounded-[9px] text-[13px] transition-all"
              style={{
                border:     `1.5px solid ${filter === f ? "#7C3AFF" : "rgba(255,255,255,0.07)"}`,
                background: filter === f ? "rgba(124,58,255,0.15)" : "#10101E",
                color:      filter === f ? "#9F5FFF" : "#8B8BAA",
                fontWeight: filter === f ? 700 : 400,
                cursor: "pointer",
              }}>
              {f}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "#10101E", border: "1px solid rgba(255,255,255,0.07)" }}>
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ background: "#161628" }}>
                {["Campaign", "Platform", "Budget", "Deadline", "Applications", "Status", ""].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-[0.06em]"
                    style={{ color: "#4A4A66", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shown.map((c, i) => (
                <tr key={c.id} style={{ borderBottom: i < shown.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}
                  className="table-row-hover transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="text-[13px] font-bold text-text-primary">{c.title}</div>
                    <div className="text-[11px] mt-0.5" style={{ color: "#4A4A66" }}>{c.type}</div>
                  </td>
                  <td className="px-5 py-3.5"><Badge color="#8B8BAA">{c.platform}</Badge></td>
                  <td className="px-5 py-3.5">
                    <span className="text-[14px] font-extrabold tracking-tight" style={{ color: "#10D9A0" }}>{c.budget}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-[13px]" style={{ color: "#8B8BAA" }}>{c.deadline}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[12px] font-bold"
                      style={{ background: "rgba(124,58,255,0.12)", color: "#9F5FFF" }}>
                      {c.apps}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge color={STATUS_COLORS[c.status] ?? "#8B8BAA"}
                      className="capitalize">{c.status}</Badge>
                  </td>
                  <td className="px-5 py-3.5">
                    <button className="px-3 py-1.5 rounded-lg text-[12px] font-medium text-text-secondary transition-all hover:text-text-primary"
                      style={{ background: "#161628", border: "1px solid rgba(255,255,255,0.07)", cursor: "pointer" }}>
                      View
                    </button>
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
