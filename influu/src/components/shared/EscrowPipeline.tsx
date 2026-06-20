import { Check } from "lucide-react";
import { PIPELINE_STAGES, getPipelineStage } from "@/lib/utils";

interface EscrowPipelineProps {
  status: string;
  compact?: boolean;
}

export default function EscrowPipeline({ status, compact = false }: EscrowPipelineProps) {
  const currentStage = getPipelineStage(status);

  return (
    <div className="flex items-center gap-1">
      {PIPELINE_STAGES.map((stage, i) => {
        const done    = i < currentStage;
        const current = i === currentStage;

        return (
          <div key={stage} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className="rounded-full flex items-center justify-center text-[10px] font-bold transition-all"
                style={{
                  width: compact ? 7 : 22,
                  height: compact ? 7 : 22,
                  background: done ? "#10D9A0" : current ? "rgba(245,158,11,0.6)" : "rgba(255,255,255,0.07)",
                  border: `2px solid ${done ? "#10D9A0" : current ? "#F59E0B" : "rgba(255,255,255,0.1)"}`,
                  color: "#fff",
                }}
                title={stage}
              >
                {!compact && (done ? <Check size={10} /> : i + 1)}
              </div>
              {!compact && (
                <span
                  className="text-[9px] font-semibold whitespace-nowrap"
                  style={{ color: done ? "#10D9A0" : current ? "#F59E0B" : "#4A4A66" }}
                >
                  {stage}
                </span>
              )}
            </div>
            {i < PIPELINE_STAGES.length - 1 && (
              <div
                className="h-px transition-all"
                style={{
                  width: compact ? 10 : 16,
                  background: i < currentStage - 1 ? "#10D9A0" : "rgba(255,255,255,0.07)",
                  marginBottom: compact ? 0 : 14,
                  margin: compact ? "0 3px" : "0 2px 14px",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
