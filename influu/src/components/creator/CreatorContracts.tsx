"use client";
import { useState } from "react";
import { Upload, CheckCircle } from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import toast from "react-hot-toast";

const OTHER_CONTRACTS = [
  { brand:"Gul Ahmed", title:"Summer Lawn Post",  amount:"₹5,000", status:"timer", label:"Timer: 4d 12h left" },
  { brand:"Alkaram",   title:"Story Campaign",     amount:"₹2,500", status:"paid",  label:"Paid out ✓" },
];

export default function CreatorContracts() {
  const [submitted, setSubmitted] = useState(false);
  const [caption,   setCaption]   = useState("");
  const [dragging,  setDragging]  = useState(false);
  const [fileName,  setFileName]  = useState<string | null>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) setFileName(file.name);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  };

  const handleSubmit = () => {
    if (!fileName) { toast.error("Please upload your draft video first"); return; }
    if (!caption.trim()) { toast.error("Please add your draft caption"); return; }
    setSubmitted(true);
    toast.success("Draft submitted for review!");
  };

  return (
    <div>
      <TopBar title="Contracts" sub="Your active and completed deals" />
      <div className="p-7 max-w-[700px] space-y-3">

        {/* Active contract — action needed */}
        <div className="rounded-2xl p-5"
          style={{ background: "linear-gradient(145deg,rgba(245,158,11,0.08),rgba(16,16,30,0.95))", border: "2px solid rgba(245,158,11,0.3)" }}>

          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-[0.04em]"
                  style={{ background: "rgba(245,158,11,0.15)", color: "#F59E0B" }}>
                  ⚡ Action needed
                </span>
              </div>
              <h3 className="text-[15px] font-extrabold text-text-primary mb-1.5 tracking-tight">
                Eid Collection Reel — Khaadi
              </h3>
              <div className="flex gap-1.5">
                <Badge color="#9F5FFF">Instagram</Badge>
                <Badge color="#8B8BAA">Reel</Badge>
                <Badge color="#10D9A0">₹8,000</Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[12px] font-medium mb-0.5" style={{ color: "#4A4A66" }}>Deadline</div>
              <div className="text-[15px] font-extrabold" style={{ color: "#F59E0B" }}>2 days left</div>
            </div>
          </div>

          {/* Brief */}
          <div className="rounded-xl px-4 py-3.5 mb-4" style={{ background: "rgba(0,0,0,0.3)" }}>
            <div className="text-[11px] font-bold uppercase tracking-[0.06em] mb-2" style={{ color: "#4A4A66" }}>Brief</div>
            <p className="text-[13px] leading-relaxed" style={{ color: "#8B8BAA" }}>
              Create an Instagram Reel showcasing the Eid collection. Product visible in first 3 seconds.
              Include <span style={{ color: "#9F5FFF" }}>#KhaadiFashion</span>. Mention link in bio. Min 20 seconds. Upbeat festive tone.
            </p>
            <div className="flex gap-5 mt-2.5">
              <span className="text-[12px]" style={{ color: "#4A4A66" }}>
                <span className="font-bold text-text-primary">Revisions:</span> 2 allowed
              </span>
              <span className="text-[12px]" style={{ color: "#4A4A66" }}>
                <span className="font-bold text-text-primary">Submitted:</span> No drafts yet
              </span>
            </div>
          </div>

          {/* Upload / Submitted state */}
          {!submitted ? (
            <div>
              {/* Drag & drop zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById("draft-upload")?.click()}
                className="rounded-xl p-6 text-center mb-3.5 cursor-pointer transition-all"
                style={{
                  border:      `2px dashed ${dragging ? "rgba(124,58,255,0.7)" : fileName ? "rgba(16,217,160,0.4)" : "rgba(124,58,255,0.3)"}`,
                  background:  dragging ? "rgba(124,58,255,0.1)" : fileName ? "rgba(16,217,160,0.05)" : "rgba(124,58,255,0.04)",
                }}>
                <input id="draft-upload" type="file" accept="video/*" className="hidden" onChange={handleFileChange} />
                {fileName ? (
                  <>
                    <div className="text-2xl mb-2">🎬</div>
                    <div className="text-[14px] font-bold text-text-primary mb-0.5">{fileName}</div>
                    <div className="text-[12px]" style={{ color: "#10D9A0" }}>Click to replace</div>
                  </>
                ) : (
                  <>
                    <Upload size={24} color="#7C3AFF" style={{ margin: "0 auto 10px" }} />
                    <div className="text-[14px] font-bold text-text-primary mb-1">Upload your draft video</div>
                    <div className="text-[12px]" style={{ color: "#4A4A66" }}>MP4, MOV · up to 500 MB · Drag & drop or click</div>
                  </>
                )}
              </div>

              {/* Caption */}
              <div className="mb-3.5">
                <label className="text-[11px] font-semibold uppercase tracking-[0.06em] block mb-2" style={{ color: "#4A4A66" }}>
                  Draft caption
                </label>
                <textarea value={caption} onChange={(e) => setCaption(e.target.value)}
                  placeholder="The caption you plan to use when you post live…"
                  className="w-full rounded-xl px-3.5 py-3 text-sm text-text-primary transition-all focus:outline-none resize-y"
                  style={{ background: "rgba(0,0,0,0.3)", border: "1.5px solid rgba(255,255,255,0.07)", minHeight: 80, fontFamily: "inherit", lineHeight: 1.6 }}
                  onFocus={(e) => { e.target.style.borderColor = "#7C3AFF"; e.target.style.boxShadow = "0 0 0 3px rgba(124,58,255,0.18)"; }}
                  onBlur={(e)  => { e.target.style.borderColor = "rgba(255,255,255,0.07)"; e.target.style.boxShadow = "none"; }}
                />
              </div>

              <button onClick={handleSubmit}
                className="w-full py-3.5 rounded-xl text-[15px] font-bold text-white flex items-center justify-center gap-2 transition-all hover:-translate-y-px"
                style={{ background: "linear-gradient(135deg,#7C3AFF,#DB2777)", border: "none", boxShadow: "0 4px 20px rgba(124,58,255,0.35)", cursor: "pointer" }}>
                <Upload size={15} /> Submit draft for review
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl"
              style={{ background: "rgba(16,217,160,0.08)", border: "1px solid rgba(16,217,160,0.25)" }}>
              <CheckCircle size={20} color="#10D9A0" className="flex-shrink-0" />
              <div>
                <div className="text-[14px] font-bold" style={{ color: "#10D9A0" }}>Draft submitted!</div>
                <div className="text-[12px] mt-0.5" style={{ color: "#4A4A66" }}>
                  Khaadi is reviewing your draft. If no response in 48h, it auto-approves.
                  You'll be notified instantly on their decision.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Other contracts */}
        {OTHER_CONTRACTS.map((c) => (
          <div key={c.title} className="flex items-center gap-3.5 px-5 py-4 rounded-2xl"
            style={{ background: "#10101E", border: "1px solid rgba(255,255,255,0.07)" }}>
            <Avatar name={c.brand} size={40} />
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-bold text-text-primary mb-1">{c.title}</div>
              <Badge color="#8B8BAA">{c.brand}</Badge>
            </div>
            <div className="text-right">
              <div className="text-[15px] font-extrabold tracking-tight mb-1.5" style={{ color: "#10D9A0" }}>{c.amount}</div>
              <Badge color={c.status === "timer" ? "#10D9A0" : "#9F5FFF"} dot={c.status === "timer"}>{c.label}</Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
