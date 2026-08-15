const classes = [
  { label: "Road", pct: 97.194, color: "bg-zinc-400 dark:bg-zinc-600" },
  { label: "Left Boundary", pct: 1.421, color: "bg-emerald-400 dark:bg-emerald-500" },
  { label: "Right Boundary", pct: 1.385, color: "bg-amber-400 dark:bg-amber-500" },
];

export default function ClassImbalance() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        {classes.map((c) => (
          <div key={c.label} className="flex items-center gap-4">
            <span className="w-36 shrink-0 text-sm text-zinc-600 dark:text-zinc-400">
              {c.label}
            </span>
            <div className="h-6 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-900">
              <div
                className={`h-full ${c.color}`}
                style={{ width: `${Math.max(c.pct, 1.5)}%` }}
              />
            </div>
            <span className="w-16 shrink-0 text-right font-mono text-sm text-zinc-950 dark:text-zinc-50">
              {c.pct}%
            </span>
          </div>
        ))}
      </div>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Measured over the full validation split (4 episodes, 2,000 frames,
        ~24.6M pixels). Background outnumbers each boundary class by roughly
        68×. Without correcting for this, a model can get ~97% pixel accuracy
        while never predicting a single boundary pixel.
      </p>
    </div>
  );
}
