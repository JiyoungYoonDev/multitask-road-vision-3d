const badges = [
  {
    value: "0.87 ms",
    label: "per frame",
    sub: "≈ 1,150 FPS, batch size 1, Apple M5 Pro (MPS)",
  },
  {
    value: "142.8K",
    label: "params (multitask)",
    sub: "vs. ~215.3K for two separate single-task models",
  },
  {
    value: "33.7%",
    label: "fewer parameters",
    sub: "saved by sharing one encoder instead of two",
  },
];

export default function PerformanceBadges() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {badges.map((b) => (
          <div
            key={b.label}
            className="flex flex-col gap-1 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
          >
            <p className="font-mono text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
              {b.value}
            </p>
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {b.label}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{b.sub}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Measured locally (forward pass only, no data-loading or pre/post-processing
        overhead) — not a datacenter GPU benchmark, just what this model actually
        costs to run on the hardware I have.
      </p>
    </div>
  );
}
