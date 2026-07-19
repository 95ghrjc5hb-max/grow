import React from "react";

export default function StatCard({ title, value, icon: Icon, trend, color = "teal" }) {
  const colorMap = {
    teal: "from-teal-500/20 to-teal-500/5 border-teal-500/20 text-teal-400",
    blue: "from-blue-500/20 to-blue-500/5 border-blue-500/20 text-blue-400",
    purple: "from-purple-500/20 to-purple-500/5 border-purple-500/20 text-purple-400",
    amber: "from-amber-500/20 to-amber-500/5 border-amber-500/20 text-amber-400",
  };

  return (
    <div className={`relative overflow-hidden rounded-xl border bg-gradient-to-br ${colorMap[color]} p-6 transition-all hover:scale-[1.02]`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-white">{value}</p>
          {trend && (
            <p className="mt-1 text-xs text-slate-500">{trend}</p>
          )}
        </div>
        <div className="p-3 rounded-xl bg-white/5">
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}