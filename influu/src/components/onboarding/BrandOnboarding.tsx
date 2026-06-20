"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, CheckCircle } from "lucide-react";
import Logo from "@/components/layout/Logo";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { INDUSTRIES, ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const PLATFORMS   = ["TikTok", "Instagram", "YouTube", "Facebook"];
const BUDGETS     = ["₹5K–20K", "₹20K–50K", "₹50K–100K", "₹100K+"];
const STEPS       = ["Company details", "Preferences", "Done!"];

function StepBar({ current }: { current: number }) {
  return (
    <div>
      {STEPS.map((label, i) => (
        <div key={label} className="flex gap-3 mb-6 items-start">
          <div className="flex flex-col items-center">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 transition-all"
              style={{
                background: current > i ? "#10D9A0" : current === i ? "#7C3AFF" : "rgba(255,255,255,0.06)",
                border: `2px solid ${current > i ? "#10D9A0" : current === i ? "#7C3AFF" : "rgba(255,255,255,0.1)"}`,
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

function ChipButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className="px-3 py-1.5 rounded-lg text-[13px] transition-all duration-150"
      style={{
        border:      `1.5px solid ${active ? "#7C3AFF" : "rgba(255,255,255,0.07)"}`,
        background:  active ? "rgba(124,58,255,0.15)" : "#161628",
        color:       active ? "#9F5FFF" : "#8B8BAA",
        fontWeight:  active ? 700 : 400,
      }}>
      {label}
    </button>
  );
}

export default function BrandOnboarding() {
  const router   = useRouter();
  const [step, setStep]         = useState(0);
  const [companyName, setCN]    = useState("");
  const [website, setWS]        = useState("");
  const [industry, setInd]      = useState("");
  const [platforms, setPlats]   = useState<string[]>([]);
  const [budget, setBudget]     = useState("");
  const [saving, setSaving]     = useState(false);

  const togglePlat = (p: string) =>
    setPlats((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]);

  const handleFinish = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Brand profile created!");
    setStep(2);
    setSaving(false);
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#07070F" }}>
      {/* Sidebar */}
      <div className="w-64 flex flex-col flex-shrink-0 p-7" style={{ background: "#0C0C1A", borderRight: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="mb-11"><Logo /></div>
        <p className="text-[10px] font-bold uppercase tracking-[0.1em] mb-5" style={{ color: "#4A4A66" }}>Brand setup</p>
        <StepBar current={step} />
        <div className="mt-auto rounded-xl p-4" style={{ background: "rgba(124,58,255,0.08)", border: "1px solid rgba(124,58,255,0.2)" }}>
          <div className="text-[12px] font-bold mb-1" style={{ color: "#9F5FFF" }}>Almost there!</div>
          <div className="text-[12px] leading-relaxed" style={{ color: "#4A4A66" }}>
            Complete setup to post campaigns and find the right creators in minutes.
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="w-full max-w-[520px] animate-fade-up">

          {/* Step 0 — Company details */}
          {step === 0 && (
            <div>
              <h2 className="text-[26px] font-extrabold text-text-primary mb-1.5 tracking-tight">Tell us about your brand</h2>
              <p className="text-text-secondary text-sm mb-7">Creators use this to decide whether to work with you</p>
              <div className="space-y-4 mb-5">
                <Input label="Company / brand name" placeholder="e.g. Khaadi, Gul Ahmed, Sapphire…"
                  value={companyName} onChange={(e) => setCN(e.target.value)} />
                <Input label="Website (optional)" placeholder="https://yoursite.pk"
                  value={website} onChange={(e) => setWS(e.target.value)} />
              </div>
              <div className="mb-7">
                <label className="text-[11px] font-semibold uppercase tracking-[0.06em] block mb-3" style={{ color: "#4A4A66" }}>Industry</label>
                <div className="flex flex-wrap gap-2">
                  {INDUSTRIES.map((ind) => (
                    <ChipButton key={ind} label={ind} active={industry === ind} onClick={() => setInd(ind)} />
                  ))}
                </div>
              </div>
              <Button fullWidth size="lg" icon={<ArrowRight size={15} />} iconPosition="right"
                onClick={() => setStep(1)} disabled={!companyName || !industry}>
                Continue
              </Button>
            </div>
          )}

          {/* Step 1 — Preferences */}
          {step === 1 && (
            <div>
              <h2 className="text-[26px] font-extrabold text-text-primary mb-1.5 tracking-tight">Campaign preferences</h2>
              <p className="text-text-secondary text-sm mb-7">We'll match you with the most relevant creators</p>

              <div className="mb-6">
                <label className="text-[11px] font-semibold uppercase tracking-[0.06em] block mb-3" style={{ color: "#4A4A66" }}>
                  Platforms you want to run campaigns on
                </label>
                <div className="flex flex-wrap gap-2">
                  {PLATFORMS.map((p) => (
                    <ChipButton key={p} label={p} active={platforms.includes(p)} onClick={() => togglePlat(p)} />
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <label className="text-[11px] font-semibold uppercase tracking-[0.06em] block mb-3" style={{ color: "#4A4A66" }}>
                  Monthly campaign budget
                </label>
                <div className="flex flex-wrap gap-2">
                  {BUDGETS.map((b) => (
                    <ChipButton key={b} label={b} active={budget === b} onClick={() => setBudget(b)} />
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(0)} className="flex-1 py-3 rounded-xl text-[14px] font-semibold text-text-primary transition-all hover:bg-white/5"
                  style={{ background: "#161628", border: "1px solid rgba(255,255,255,0.07)" }}>
                  Back
                </button>
                <Button className="flex-[2]" size="lg" loading={saving}
                  disabled={platforms.length === 0 || !budget}
                  onClick={handleFinish}>
                  Finish setup
                </Button>
              </div>
            </div>
          )}

          {/* Step 2 — Done */}
          {step === 2 && (
            <div className="text-center animate-fade-up">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: "rgba(16,217,160,0.12)", border: "1px solid rgba(16,217,160,0.3)" }}>
                <CheckCircle size={42} color="#10D9A0" />
              </div>
              <h2 className="text-[30px] font-extrabold text-text-primary mb-2.5 tracking-tight">You're all set! 🎉</h2>
              <p className="text-text-secondary text-[15px] leading-relaxed max-w-[340px] mx-auto mb-8">
                Your brand account is live. Post your first campaign or browse verified Pakistani creators now.
              </p>
              <div className="flex gap-3 justify-center">
                <Button icon={<ArrowRight size={15} />} iconPosition="right"
                  onClick={() => router.push(ROUTES.brand.newCampaign)}>
                  Post campaign
                </Button>
                <button onClick={() => router.push(ROUTES.brand.dashboard)}
                  className="px-5 py-2.5 rounded-xl text-[14px] font-semibold text-text-primary transition-all hover:bg-white/5"
                  style={{ background: "#161628", border: "1px solid rgba(255,255,255,0.07)" }}>
                  Go to dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
