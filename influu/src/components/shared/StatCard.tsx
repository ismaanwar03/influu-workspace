import Card from "@/components/ui/Card";
import { ChevronUp, ChevronDown } from "lucide-react";
import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: ReactNode;
  color: string;
  trend?: number;
}

export default function StatCard({ label, value, sub, icon, color, trend }: StatCardProps) {
  return (
    <Card
      hover
      className="border"
      style={{
        background: `linear-gradient(145deg, ${color}18, #10101E)`,
        borderColor: `${color}22`,
      } as React.CSSProperties}
    >
      <div className="flex justify-between items-start mb-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: `${color}22`, border: `1px solid ${color}35`, color }}
        >
          {icon}
        </div>
        {trend !== undefined && (
          <div
            className="flex items-center gap-1 text-xs font-bold"
            style={{ color: trend >= 0 ? "#10D9A0" : "#F45B69" }}
          >
            {trend >= 0 ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="text-2xl font-extrabold text-text-primary tracking-tight mb-1">{value}</div>
      <div className="text-sm font-medium text-text-secondary">{label}</div>
      {sub && <div className="text-[11px] text-text-muted mt-1">{sub}</div>}
    </Card>
  );
}
