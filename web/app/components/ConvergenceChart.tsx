"use client";

import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Point = { epoch: number; iou: number };

export default function ConvergenceChart() {
  const [merged, setMerged] = useState<
    { epoch: number; weighted?: number; unweighted?: number }[] | null
  >(null);

  useEffect(() => {
    Promise.all([
      fetch("/data/weighted-curve.json").then((r) => r.json()),
      fetch("/data/unweighted-curve.json").then((r) => r.json()),
    ]).then(([weighted, unweighted]: [Point[], Point[]]) => {
      const byEpoch = new Map<number, { epoch: number; weighted?: number; unweighted?: number }>();
      for (const p of weighted) byEpoch.set(p.epoch, { epoch: p.epoch, weighted: p.iou });
      for (const p of unweighted) {
        const existing = byEpoch.get(p.epoch) ?? { epoch: p.epoch };
        existing.unweighted = p.iou;
        byEpoch.set(p.epoch, existing);
      }
      setMerged([...byEpoch.values()].sort((a, b) => a.epoch - b.epoch));
    });
  }, []);

  if (!merged) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-zinc-500">
        loading convergence curve..
      </div>
    );
  }

  return (
    <div className="h-72 w-full rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={merged} margin={{ top: 8, right: 16, bottom: 0, left: -16 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-800" />
          <XAxis
            dataKey="epoch"
            tick={{ fontSize: 12 }}
            className="fill-zinc-500"
            label={{ value: "epoch", position: "insideBottom", offset: -2, fontSize: 12 }}
          />
          <YAxis
            domain={[0, 1]}
            tick={{ fontSize: 12 }}
            className="fill-zinc-500"
            label={{ value: "val IoU", angle: -90, position: "insideLeft", fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8 }}
            formatter={(v) => (typeof v === "number" ? v.toFixed(3) : v)}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line
            type="monotone"
            dataKey="weighted"
            name="weighted [1,10,10]"
            stroke="#34d399"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="unweighted"
            name="unweighted"
            stroke="#a1a1aa"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
