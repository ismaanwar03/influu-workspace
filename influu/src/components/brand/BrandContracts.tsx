"use client";
import { useState } from "react";
import { Eye, CheckCircle, Edit3, Lock, AlertCircle, Play, Check } from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import EscrowPipeline from "@/components/shared/EscrowPipeline";
import { formatPKRExact } from "@/lib/utils";
import toast from "react-hot-toast";

const CONTRACTS = [
  { id:"1", title:"Eid Collection Reel",  creator:"Amna Khalid", platform:"Instagram", type:"Reel",  amount:12000, status:"draft_submitted", deadline:"2 days left" },
  { id:"2", title:"Summer TikTok Series", creator:"Bilal Ahmed",  platform:"TikTok",   type:"Video", amount:8500,  status:"timer_running",   deadline:"5 days left" },
  { id:"3", title:"Brand Story — Ramzan", creator:"Sara Malik",   platform:"Instagram", type:"Story", amount:3500,  status:"payment_released",deadline:"Completed" },
];

const STATUS_COLORS: Record<string, string> = {
  draft_submitted:  "#F59E0B",
  timer_running:    "#10D9A0",
  payment_released: "#9F5FFF",
  disputed:         "#F45B69",
};

const STATUS_LABELS: Record<string, string> = {
  draft_submitted:  "Review draft",
  timer_running:    "Post live · timer running",
  payment_released: "Paid out",
};

const CHECKLIST = [
  "Product visible in first 3 seconds",
  "Required hashtags included",
  "Caption mentions link in bio",
  "No competitor brands visible",
  "Minimum 20 seconds long",
];

function DraftReviewPanel({ onClose }: { onClose: () => void }) {
  const [checks, setChecks] = useState<Record<number, boolean>>({});
  const [view, setView]     = useState<"review" | "approved" | "revision">("review");
  const [feedback, setFb]   = useState("");
  const allChecked = CHECKLIST.every((_, i) => checks[i]);

  if (view === "approved") return (
    <div className="text-center py-6">
      <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
        style={{ background: "rgba(16,217,160,0.12)", border: "1px solid rgba(16,217,160,0.3)" }}>
        <CheckCircle size={34} color="#10D9A0" />
      </div>
      <h3 className="text-[20px] font-extrabold text-text-primary mb-2 tracking-tight">Draft approved!</h3>
      <p className="text-text-secondary text-sm leading-relaxed mb-6 max-w-[340px] mx-auto">
        Amna has been notified and can now post the content live on Instagram.
        You'll be notified once the post is verified by our API. The 7-day timer will then begin.
      </p>
      <div className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl mb-6"
        style={{ background: "rgba(16,217,160,0.08)", border: "1px solid rgba(16,217,160,0.2)" }}>
        <Lock size={13} color="#10D9A0" />
        <span className="text-[13px] font-semibold" style={{ color: "#10D9A0" }}>₹12,000 stays locked until post verified</span>
      </div>
      <Button onClick={onClose} variant="secondary">Back to contracts</Button>
    </div>
  );

  if (view === "revision") return (
    <div>
      <button onClick={() => setView("review")} className="text-text-muted text-[13px] flex items-center gap-1 mb-5 hover:text-text-secondary transition-colors"
        style={{ background: "none", border: "none", cursor: "pointer" }}>
        ← Back to draft
      </button>
      <h3 className="text-[19px] font-extrabold text-text-primary mb-2 tracking-tight">Request a revision</h3>
      <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl mb-5"
        style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)" }}>
        <AlertCircle size={15} color="#F59E0B" className="mt-0.5 flex-shrink-0" />
        <span className="text-[13px] leading-relaxed" style={{ color: "#F59E0B" }}>
          This is revision <strong>1 of 2</strong> allowed. Be specific — vague feedback wastes revisions.
        </span>
      </div>
      <label className="text-[11px] font-semibold uppercase tracking-[0.06em] block mb-2" style={{ color: "#4A4A66" }}>
        Your feedback for the creator
      </label>
      <textarea value={feedback} onChange={(e) => setFb(e.target.value)}
        placeholder="Be specific: 'The product isn't visible in the first 3 seconds — please open with a close-up shot. The caption looks great but please add #KhaadiFashion.'"
        className="w-full rounded-xl px-3.5 py-3 text-sm text-text-primary transition-all focus:outline-none resize-y"
        style={{ background: "#161628", border: "1.5px solid rgba(255,255,255,0.07)", minHeight: 130, fontFamily: "inherit", lineHeight: 1.6 }}
        onFocus={(e) => { e.target.style.borderColor = "#7C3AFF"; }}
        onBlur={(e)  => { e.target.style.borderColor = "rgba(255,255,255,0.07)"; }}
      />
      <div className="flex gap-3 mt-4">
        <button onClick={() => setView("review")}
          className="flex-1 py-3 rounded-xl text-[14px] font-semibold text-text-primary hover:bg-white/5 transition-all"
          style={{ background: "#161628", border: "1px solid rgba(255,255,255,0.07)", cursor: "pointer" }}>
          Cancel
        </button>
        <button
          disabled={!feedback.trim()}
          onClick={() => { toast.success("Revision request sent!"); onClose(); }}
          className="flex-[2] py-3 rounded-xl text-[14px] font-bold transition-all"
          style={{
            background: feedback.trim() ? "#F59E0B" : "rgba(255,255,255,0.04)",
            border: "none",
            color: feedback.trim() ? "#fff" : "#4A4A66",
            cursor: feedback.trim() ? "pointer" : "not-allowed",
          }}>
          Send revision request
        </button>
      </div>
    </div>
  );

  return (
    <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 300px" }}>
      {/* Left: preview */}
      <div>
        {/* Video placeholder */}
        <div className="rounded-2xl overflow-hidden mb-3" style={{ background: "#161628", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="h-[300px] flex flex-col items-center justify-center relative"
            style={{ background: "#000" }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
              style={{ background: "rgba(124,58,255,0.2)" }}>
              <Play size={26} color="#9F5FFF" />
            </div>
            <p className="text-text-secondary text-sm font-medium">draft_reel_v1.mp4</p>
            <p className="text-[12px] mt-1" style={{ color: "#4A4A66" }}>Instagram Reel · 0:28 · 48.2 MB</p>
            <span className="absolute bottom-3 right-3 text-[11px] font-bold text-white px-2 py-0.5 rounded-md" style={{ background: "rgba(0,0,0,0.8)" }}>0:28</span>
            <span className="absolute top-3 left-3 text-[11px] font-bold text-white px-2 py-0.5 rounded-md" style={{ background: "rgba(124,58,255,0.9)" }}>DRAFT v1</span>
          </div>
          <div className="p-4">
            <div className="text-[11px] font-bold uppercase tracking-[0.06em] mb-2" style={{ color: "#4A4A66" }}>Draft caption</div>
            <p className="text-[13px] text-text-secondary leading-relaxed">
              Eid vibes are HERE ✨ Obsessing over this new collection by @KhaadiFashion — the colours, the cuts, everything is just *chef's kiss* 🌸 Shop the link in bio!{" "}
              <span style={{ color: "#9F5FFF" }}>#KhaadiFashion #EidCollection2025 #PakistanFashion</span>
            </p>
          </div>
        </div>

        {/* Files */}
        <div className="rounded-xl p-4" style={{ background: "#161628", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="text-[11px] font-bold uppercase tracking-[0.06em] mb-3" style={{ color: "#4A4A66" }}>Submitted files</div>
          {[["draft_reel_v1.mp4","48.2 MB","🎬"],["thumbnail.jpg","2.1 MB","🖼️"]].map(([name, size, icon]) => (
            <div key={name} className="flex items-center gap-2.5 py-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <span className="text-[18px]">{icon}</span>
              <div className="flex-1"><div className="text-[13px] font-semibold text-text-primary">{name}</div><div className="text-[11px]" style={{ color: "#4A4A66" }}>{size}</div></div>
              <button className="px-3 py-1 rounded-lg text-[11px] font-medium text-text-secondary hover:text-text-primary transition-colors"
                style={{ background: "#10101E", border: "1px solid rgba(255,255,255,0.07)", cursor: "pointer" }}>
                Download
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Right: actions */}
      <div className="space-y-3">
        {/* Deal summary */}
        <div className="rounded-xl p-4" style={{ background: "#161628", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="text-[11px] font-bold uppercase tracking-[0.06em] mb-3.5" style={{ color: "#4A4A66" }}>Deal summary</div>
          {[["Creator","Amna Khalid"],["Platform","Instagram Reel"],["Deadline","15 Jun 2025"],["Revisions left","2 of 2"],["Timer","7 days after post"]].map(([k,v]) => (
            <div key={k} className="flex justify-between mb-2.5">
              <span className="text-[12px]" style={{ color: "#4A4A66" }}>{k}</span>
              <span className="text-[12px] font-bold text-text-primary">{v}</span>
            </div>
          ))}
          <div className="mt-3 pt-3 flex items-center gap-2 px-3 py-2.5 rounded-xl"
            style={{ background: "rgba(16,217,160,0.08)", border: "1px solid rgba(16,217,160,0.2)", borderTop: "none" }}>
            <Lock size={12} color="#10D9A0" />
            <span className="text-[13px] font-bold" style={{ color: "#10D9A0" }}>₹12,000 locked in escrow</span>
          </div>
        </div>

        {/* Checklist */}
        <div className="rounded-xl p-4" style={{ background: "#161628", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="text-[11px] font-bold uppercase tracking-[0.06em] mb-1.5" style={{ color: "#4A4A66" }}>Brief checklist</div>
          <p className="text-[11px] mb-3.5" style={{ color: "#4A4A66" }}>Tick all items before approving</p>
          {CHECKLIST.map((item, i) => (
            <div key={i} onClick={() => setChecks((p) => ({ ...p, [i]: !p[i] }))}
              className="flex items-start gap-2.5 mb-2.5 cursor-pointer">
              <div className="w-[17px] h-[17px] rounded-[5px] flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
                style={{
                  border:     `1.5px solid ${checks[i] ? "#10D9A0" : "rgba(255,255,255,0.1)"}`,
                  background: checks[i] ? "rgba(16,217,160,0.15)" : "transparent",
                }}>
                {checks[i] && <Check size={9} color="#10D9A0" />}
              </div>
              <span className="text-[12px] leading-[1.4]" style={{ color: checks[i] ? "#F0F0FF" : "#8B8BAA", transition: "color .15s" }}>{item}</span>
            </div>
          ))}
        </div>

        {/* Approve */}
        <button
          disabled={!allChecked}
          onClick={() => setView("approved")}
          className="w-full py-3.5 rounded-xl text-[14px] font-bold flex items-center justify-center gap-2 transition-all"
          style={{
            background: allChecked ? "linear-gradient(135deg,#10D9A0,#0BA5D3)" : "rgba(255,255,255,0.04)",
            border: "none",
            color: allChecked ? "#fff" : "#4A4A66",
            boxShadow: allChecked ? "0 4px 20px rgba(16,217,160,0.3)" : "none",
            cursor: allChecked ? "pointer" : "not-allowed",
          }}>
          <CheckCircle size={16} />
          {allChecked ? "Approve draft" : "Tick all checklist items first"}
        </button>

        {/* Revision */}
        <button onClick={() => setView("revision")}
          className="w-full py-3 rounded-xl text-[14px] font-bold flex items-center justify-center gap-2 transition-all hover:-translate-y-px"
          style={{ background: "rgba(245,158,11,0.08)", border: "1.5px solid rgba(245,158,11,0.3)", color: "#F59E0B", cursor: "pointer" }}>
          <Edit3 size={14} /> Request revision (2 left)
        </button>
      </div>
    </div>
  );
}

export default function BrandContracts() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div>
      <TopBar title="Contracts" sub="All your active and completed deals" />
      <div className="p-7 space-y-3">
        {CONTRACTS.map((c) => {
          const color = STATUS_COLORS[c.status] ?? "#8B8BAA";
          const label = STATUS_LABELS[c.status] ?? c.status;
          const isDraft = c.status === "draft_submitted";

          return (
            <div key={c.id} className="rounded-2xl p-5 flex items-center gap-3.5"
              style={{
                background: isDraft ? "linear-gradient(145deg,rgba(245,158,11,0.05),rgba(16,16,30,0.9))" : "#10101E",
                border: `1px solid ${isDraft ? "rgba(245,158,11,0.35)" : "rgba(255,255,255,0.07)"}`,
              }}>
              <Avatar name={c.creator} size={44} />
              <div className="flex-1 min-w-0">
                <div className="text-[15px] font-bold text-text-primary mb-1.5">{c.title}</div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge color="#8B8BAA">{c.creator}</Badge>
                  <Badge color="#8B8BAA">{c.platform}</Badge>
                  <Badge color="#8B8BAA">{c.type}</Badge>
                  <span className="text-[12px]" style={{ color: "#4A4A66" }}>· {c.deadline}</span>
                </div>
              </div>
              <EscrowPipeline status={c.status} compact />
              <div className="text-right flex-shrink-0">
                <div className="text-[18px] font-extrabold tracking-tight mb-1.5" style={{ color: "#10D9A0" }}>
                  {formatPKRExact(c.amount)}
                </div>
                <Badge color={color} dot={isDraft}>{label}</Badge>
              </div>
              {isDraft ? (
                <button onClick={() => setModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl text-[13px] font-bold text-white flex items-center gap-1.5 flex-shrink-0 transition-all hover:-translate-y-px"
                  style={{ background: "linear-gradient(135deg,#7C3AFF,#DB2777)", border: "none", boxShadow: "0 4px 16px rgba(124,58,255,0.4)", cursor: "pointer" }}>
                  <Eye size={14} /> Review draft
                </button>
              ) : (
                <button className="px-4 py-2.5 rounded-xl text-[13px] font-semibold text-text-secondary hover:text-text-primary transition-colors flex-shrink-0"
                  style={{ background: "#161628", border: "1px solid rgba(255,255,255,0.07)", cursor: "pointer" }}>
                  View
                </button>
              )}
            </div>
          );
        })}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Review draft — Eid Collection Reel · Amna Khalid" wide>
        <DraftReviewPanel onClose={() => setModalOpen(false)} />
      </Modal>
    </div>
  );
}
