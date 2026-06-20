"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Clock } from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { campaignSchema, type CampaignInput } from "@/lib/validations";
import { CONTENT_TYPES, ROUTES } from "@/lib/constants";
import { getPaymentTimer } from "@/lib/utils";
import toast from "react-hot-toast";

const PLATFORMS = [
  { id: "tiktok",    label: "🎵 TikTok" },
  { id: "instagram", label: "📸 Instagram" },
  { id: "youtube",   label: "▶ YouTube" },
  { id: "facebook",  label: "👤 Facebook" },
];
const MIN_FOLLOWERS = ["No minimum", "1K+", "5K+", "10K+", "50K+", "100K+"];
const STEP_LABELS   = ["Campaign details", "Budget & timeline", "Review & post"];

function ChipBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className="px-3 py-1.5 rounded-lg text-[13px] transition-all"
      style={{
        border:     `1.5px solid ${active ? "#7C3AFF" : "rgba(255,255,255,0.07)"}`,
        background: active ? "rgba(124,58,255,0.15)" : "#161628",
        color:      active ? "#9F5FFF" : "#8B8BAA",
        fontWeight: active ? 700 : 400,
      }}>
      {label}
    </button>
  );
}

export default function CreateCampaign() {
  const router  = useRouter();
  const [plat, setPlat]   = useState("");
  const [ctype, setCtype] = useState("");
  const [minFol, setMinFol] = useState("No minimum");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<CampaignInput>({
    resolver: zodResolver(campaignSchema),
    defaultValues: { maxRevisions: 2, minFollowers: 0 },
  });

  const contentTypes = plat ? (CONTENT_TYPES as Record<string, readonly string[]>)[plat] ?? [] : [];
  const timer = ctype ? getPaymentTimer(ctype) : null;

  const onSubmit = async (data: CampaignInput) => {
    if (!plat || !ctype) { toast.error("Select a platform and content type"); return; }
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 900));
      toast.success("Campaign posted!");
      router.push(ROUTES.brand.campaigns);
    } catch {
      toast.error("Failed to post campaign");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <TopBar title="New campaign" sub="Fill in the brief — creators will apply or you can send direct offers" breadcrumb="Campaigns" />

      <div className="p-7 max-w-[680px]">
        <div className="rounded-2xl overflow-hidden" style={{ background: "#10101E", border: "1px solid rgba(255,255,255,0.07)" }}>
          {/* Step bar */}
          <div className="flex items-center gap-2 px-6 py-4" style={{ background: "#161628", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            {STEP_LABELS.map((l, i) => (
              <div key={l} className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{
                    background: i === 0 ? "linear-gradient(135deg,#7C3AFF,#DB2777)" : "rgba(255,255,255,0.06)",
                    color: i === 0 ? "#fff" : "#4A4A66",
                    boxShadow: i === 0 ? "0 2px 8px rgba(124,58,255,0.4)" : "none",
                  }}>
                  {i + 1}
                </div>
                <span className="text-[13px]" style={{ color: i === 0 ? "#F0F0FF" : "#4A4A66", fontWeight: i === 0 ? 700 : 400 }}>{l}</span>
                {i < STEP_LABELS.length - 1 && <span className="text-[14px] mx-1" style={{ color: "#4A4A66" }}>›</span>}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
            {/* Title */}
            <Input label="Campaign title" placeholder="e.g. Eid Collection Launch Reel"
              error={errors.title?.message} {...register("title")} />

            {/* Platform + Type */}
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.06em] block mb-2.5" style={{ color: "#4A4A66" }}>Platform</label>
                <div className="flex flex-wrap gap-2">
                  {PLATFORMS.map((p) => (
                    <ChipBtn key={p.id} label={p.label}
                      active={plat === p.id}
                      onClick={() => { setPlat(p.id); setCtype(""); }} />
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.06em] block mb-2.5" style={{ color: "#4A4A66" }}>Content type</label>
                <div className="flex flex-wrap gap-2">
                  {contentTypes.length > 0
                    ? contentTypes.map((t) => (
                        <ChipBtn key={t} label={t} active={ctype === t} onClick={() => setCtype(t)} />
                      ))
                    : <span className="text-[13px]" style={{ color: "#4A4A66" }}>Select platform first</span>
                  }
                </div>
              </div>
            </div>

            {/* Timer info banner */}
            {timer && (
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl"
                style={{ background: "rgba(16,217,160,0.08)", border: "1px solid rgba(16,217,160,0.2)" }}>
                <Clock size={13} color="#10D9A0" />
                <span className="text-[13px] font-semibold" style={{ color: "#10D9A0" }}>
                  Payment timer: {timer.label} — escrow releases after post is verified live
                </span>
              </div>
            )}

            {/* Brief */}
            <Textarea label="Content brief" placeholder="Be specific: tone, style, dos/don'ts, required hashtags or mentions, product focus…"
              error={errors.brief?.message} style={{ minHeight: 110 }} {...register("brief")} />

            {/* Budget / Deadline / Revisions */}
            <div className="grid grid-cols-3 gap-4">
              <Input label="Budget (PKR)" type="number" placeholder="12,000" prefix="₹"
                error={errors.budget?.message}
                {...register("budget", { valueAsNumber: true })} />
              <Input label="Deadline" type="date"
                error={errors.deadline?.message} {...register("deadline")} />
              <Select label="Max revisions"
                options={[{ value:"1",label:"1 revision" },{ value:"2",label:"2 revisions" },{ value:"3",label:"3 revisions" }]}
                {...register("maxRevisions", { valueAsNumber: true })} />
            </div>

            {/* Min followers */}
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-[0.06em] block mb-2.5" style={{ color: "#4A4A66" }}>
                Min. follower count
              </label>
              <div className="flex flex-wrap gap-2">
                {MIN_FOLLOWERS.map((f) => (
                  <ChipBtn key={f} label={f} active={minFol === f} onClick={() => setMinFol(f)} />
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => router.push(ROUTES.brand.campaigns)}
                className="flex-1 py-3 rounded-xl text-[14px] font-semibold text-text-primary hover:bg-white/5 transition-all"
                style={{ background: "#161628", border: "1px solid rgba(255,255,255,0.07)", cursor: "pointer" }}>
                Cancel
              </button>
              <Button type="submit" className="flex-[2]" size="lg" loading={loading}>
                Post campaign
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
