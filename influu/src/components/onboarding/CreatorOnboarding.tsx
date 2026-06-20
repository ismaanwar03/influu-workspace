"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, CheckCircle, Shield } from "lucide-react";
import Logo from "@/components/layout/Logo";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { NICHES, ROUTES } from "@/lib/constants";
import toast from "react-hot-toast";

const STEPS   = ["Your profile", "Connect socials", "Set your rates"];
const SOCIALS = [
  { id: "tiktok",    label: "TikTok",    icon: "🎵", note: "Most popular in Pakistan" },
  { id: "instagram", label: "Instagram", icon: "📸", note: "Fashion & lifestyle" },
  { id: "youtube",   label: "YouTube",   icon: "▶",  note: "Long-form content" },
  { id: "facebook",  label: "Facebook",  icon: "👤",  note: "Wider age range" },
];
const RATES = [
  { key: "story", label: "Instagram Story",           timer: "24-hour release", ph: "3,000" },
  { key: "reel",  label: "Instagram Post / Reel",     timer: "7-day release",   ph: "8,000" },
  { key: "tiktok",label: "TikTok Video",              timer: "7-day release",   ph: "6,000" },
  { key: "yt",    label: "YouTube Video",             timer: "7-day release",   ph: "25,000" },
];

function StepBar({ current }: { current: number }) {
  return (
    <div>
      {STEPS.map((label, i) => (
        <div key={label} className="flex gap-3 mb-6 items-start">
          <div className="flex flex-col items-center">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 transition-all"
              style={{
                background: current > i ? "#10D9A0" : current === i ? "#10D9A0" : "rgba(255,255,255,0.06)",
                border: `2px solid ${current > i ? "#10D9A0" : current === i ? "#10D9A0" : "rgba(255,255,255,0.1)"}`,
              }}>
              {current > i ? <Check size={13} /> : i + 1}
            </div>
            {i < STEPS.length - 1 && (
              <div className="w-px mt-1" style={{ height: 20, background: current > i ? "#10D9A0" : "rgba(255,255,255,0.07)" }} />
            )}
          </div>
          <div className="pt-1">
            <div className="text-[14px]" style={{ color: current >= i ? "#F0F0FF" : "#4A4A66", fontWeight: current === i ? 700 : 400 }}>
              {label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CreatorOnboarding() {
  const router = useRouter();
  const [step, setStep]       = useState(0);
  const [niche, setNiche]     = useState("");
  const [bio, setBio]         = useState("");
  const [city, setCity]       = useState("");
  const [connected, setConn]  = useState<string[]>([]);
  const [saving, setSaving]   = useState(false);

  const toggleConn = (id: string) =>
    setConn((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const handleFinish = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    toast.success("Creator profile ready!");
    router.push(ROUTES.creator.dashboard);
    setSaving(false);
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#07070F" }}>
      {/* Sidebar */}
      <div className="w-64 flex flex-col flex-shrink-0 p-7" style={{ background: "#0C0C1A", borderRight: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="mb-11"><Logo /></div>
        <p className="text-[10px] font-bold uppercase tracking-[0.1em] mb-5" style={{ color: "#4A4A66" }}>Creator setup</p>
        <StepBar current={step} />
        <div className="mt-auto rounded-xl p-4" style={{ background: "rgba(16,217,160,0.08)", border: "1px solid rgba(16,217,160,0.2)" }}>
          <div className="text-[12px] font-bold mb-1" style={{ color: "#10D9A0" }}>Verified = more deals</div>
          <div className="text-[12px] leading-relaxed" style={{ color: "#4A4A66" }}>
            Brands trust verified creators 2× more. Connect your accounts to unlock top campaigns.
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="w-full max-w-[520px] animate-fade-up">

          {/* Step 0 — Profile */}
          {step === 0 && (
            <div>
              <h2 className="text-[26px] font-extrabold text-text-primary mb-1.5 tracking-tight">Build your creator profile</h2>
              <p className="text-text-secondary text-sm mb-7">Brands use this to discover and hire you</p>
              <div className="space-y-4 mb-5">
                <Input label="Full name" placeholder="Sara Malik" />
                <Input label="City" placeholder="Karachi, Lahore, Islamabad…"
                  value={city} onChange={(e) => setCity(e.target.value)} />
                <Input label="Short bio" placeholder="Fashion creator · 50K+ followers · Authenticity first"
                  value={bio} onChange={(e) => setBio(e.target.value)} />
              </div>
              <div className="mb-7">
                <label className="text-[11px] font-semibold uppercase tracking-[0.06em] block mb-3" style={{ color: "#4A4A66" }}>Your niche</label>
                <div className="flex flex-wrap gap-2">
                  {NICHES.map((n) => (
                    <button key={n} onClick={() => setNiche(n)}
                      className="px-3 py-1.5 rounded-lg text-[13px] transition-all duration-150"
                      style={{
                        border:     `1.5px solid ${niche === n ? "#10D9A0" : "rgba(255,255,255,0.07)"}`,
                        background: niche === n ? "rgba(16,217,160,0.12)" : "#161628",
                        color:      niche === n ? "#10D9A0" : "#8B8BAA",
                        fontWeight: niche === n ? 700 : 400,
                      }}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={() => setStep(1)} disabled={!niche}
                className="w-full py-3.5 rounded-xl text-[15px] font-bold flex items-center justify-center gap-2 transition-all"
                style={{
                  background: niche ? "rgba(16,217,160,0.12)" : "rgba(255,255,255,0.04)",
                  border: niche ? "1px solid rgba(16,217,160,0.3)" : "1px solid rgba(255,255,255,0.07)",
                  color: niche ? "#10D9A0" : "#4A4A66",
                  cursor: niche ? "pointer" : "not-allowed",
                }}>
                Continue <ArrowRight size={15} />
              </button>
            </div>
          )}

          {/* Step 1 — Connect socials */}
          {step === 1 && (
            <div>
              <h2 className="text-[26px] font-extrabold text-text-primary mb-1.5 tracking-tight">Connect your social accounts</h2>
              <p className="text-text-secondary text-sm mb-7">We verify your stats via Phyllo API — brands trust verified creators</p>

              <div className="flex flex-col gap-2.5 mb-4">
                {SOCIALS.map((s) => {
                  const on = connected.includes(s.id);
                  return (
                    <div key={s.id} className="flex items-center gap-3.5 p-4 rounded-[13px] transition-all"
                      style={{
                        background: on ? "rgba(16,217,160,0.06)" : "#10101E",
                        border: `1.5px solid ${on ? "rgba(16,217,160,0.3)" : "rgba(255,255,255,0.07)"}`,
                      }}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[18px] flex-shrink-0" style={{ background: "#161628" }}>
                        {s.icon}
                      </div>
                      <div className="flex-1">
                        <div className="text-[14px] font-bold text-text-primary">{s.label}</div>
                        <div className="text-[11px]" style={{ color: "#4A4A66" }}>
                          {on ? "Connected · Stats pulled via Phyllo" : s.note}
                        </div>
                      </div>
                      <button onClick={() => toggleConn(s.id)}
                        className="px-3.5 py-1.5 rounded-[9px] text-[12px] font-bold transition-all"
                        style={{
                          background: on ? "rgba(16,217,160,0.12)" : "linear-gradient(135deg,#7C3AFF,#DB2777)",
                          border: on ? "1px solid rgba(16,217,160,0.3)" : "none",
                          color: on ? "#10D9A0" : "#fff",
                          boxShadow: on ? "none" : "0 2px 12px rgba(124,58,255,0.3)",
                        }}>
                        {on ? "Connected ✓" : "Connect"}
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl mb-6"
                style={{ background: "rgba(124,58,255,0.08)", border: "1px solid rgba(124,58,255,0.2)" }}>
                <Shield size={14} color="#9F5FFF" className="mt-0.5 flex-shrink-0" />
                <span className="text-[12px] leading-relaxed" style={{ color: "#9F5FFF" }}>
                  Connect at least 1 account to receive offers. You can add more from settings.
                </span>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(0)} className="flex-1 py-3 rounded-xl text-[14px] font-semibold text-text-primary hover:bg-white/5 transition-all"
                  style={{ background: "#161628", border: "1px solid rgba(255,255,255,0.07)" }}>
                  Back
                </button>
                <button onClick={() => setStep(2)} disabled={connected.length === 0}
                  className="flex-[2] py-3 rounded-xl text-[15px] font-bold flex items-center justify-center gap-2 transition-all"
                  style={{
                    background: connected.length > 0 ? "rgba(16,217,160,0.12)" : "rgba(255,255,255,0.04)",
                    border: connected.length > 0 ? "1px solid rgba(16,217,160,0.3)" : "1px solid rgba(255,255,255,0.07)",
                    color: connected.length > 0 ? "#10D9A0" : "#4A4A66",
                    cursor: connected.length > 0 ? "pointer" : "not-allowed",
                  }}>
                  Continue <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* Step 2 — Set rates */}
          {step === 2 && (
            <div>
              <h2 className="text-[26px] font-extrabold text-text-primary mb-1.5 tracking-tight">Set your starting rates</h2>
              <p className="text-text-secondary text-sm mb-7">You can update these anytime. Brands can also send custom offers.</p>

              <div className="space-y-3.5 mb-7">
                {RATES.map((r) => (
                  <div key={r.key}>
                    <label className="text-[11px] font-semibold uppercase tracking-[0.06em] block mb-2" style={{ color: "#4A4A66" }}>
                      {r.label} <span style={{ color: "#10D9A0" }}>· {r.timer}</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[14px] font-semibold" style={{ color: "#8B8BAA" }}>₹</span>
                      <input type="number" placeholder={r.ph}
                        className="w-full pl-7 pr-4 py-3 rounded-xl text-sm text-text-primary transition-all focus:outline-none"
                        style={{ background: "#161628", border: "1.5px solid rgba(255,255,255,0.07)" }}
                        onFocus={(e) => { e.target.style.borderColor = "#7C3AFF"; e.target.style.boxShadow = "0 0 0 3px rgba(124,58,255,0.18)"; }}
                        onBlur={(e)  => { e.target.style.borderColor = "rgba(255,255,255,0.07)"; e.target.style.boxShadow = "none"; }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl text-[14px] font-semibold text-text-primary hover:bg-white/5 transition-all"
                  style={{ background: "#161628", border: "1px solid rgba(255,255,255,0.07)" }}>
                  Back
                </button>
                <Button className="flex-[2]" size="lg" loading={saving} onClick={handleFinish}
                  icon={<ArrowRight size={15} />} iconPosition="right">
                  Go to dashboard
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
