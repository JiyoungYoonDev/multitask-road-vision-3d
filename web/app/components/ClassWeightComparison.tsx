import ConvergenceChart from "./ConvergenceChart";

const rows = [
  { label: "Road", withW: 0.9744, noW: 0.9851 },
  { label: "Left Boundary", withW: 0.5252, noW: 0.5801 },
  { label: "Right Boundary", withW: 0.5084, noW: 0.5742 },
];

function Bar({ value, colorClass }: { value: number; colorClass: string }) {
  return (
    <div className="h-3 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-900">
      <div className={`h-full ${colorClass}`} style={{ width: `${value * 100}%` }} />
    </div>
  );
}

export default function ClassWeightComparison() {
  return (
    <div className="flex flex-col gap-6">
      <ConvergenceChart />

      <div className="flex flex-col gap-4">
        {rows.map((r) => (
          <div key={r.label} className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">{r.label}</span>
              <span className="font-mono text-xs text-zinc-500 dark:text-zinc-500">
                IoU
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-24 shrink-0 text-xs text-zinc-500 dark:text-zinc-400">
                weighted
              </span>
              <Bar value={r.withW} colorClass="bg-emerald-400 dark:bg-emerald-500" />
              <span className="w-12 shrink-0 text-right font-mono text-xs text-zinc-950 dark:text-zinc-50">
                {r.withW.toFixed(3)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-24 shrink-0 text-xs text-zinc-500 dark:text-zinc-400">
                unweighted
              </span>
              <Bar value={r.noW} colorClass="bg-zinc-400 dark:bg-zinc-600" />
              <span className="w-12 shrink-0 text-right font-mono text-xs text-zinc-950 dark:text-zinc-50">
                {r.noW.toFixed(3)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-4 text-sm leading-6 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
        <p className="mb-2 font-medium text-zinc-950 dark:text-zinc-50">
          Honest result: at a matched 20-epoch budget, the unweighted model
          actually finished ahead.
        </p>
        <p>
          Both curves above are the same setup — 20 epochs, same seed, same
          everything — with only <code className="font-mono">class_weights</code>{" "}
          different, so this is a fair fight, not the earlier 50-epoch
          checkpoint. And the unweighted run won on every class (Road 0.985
          vs. 0.974, Left 0.580 vs. 0.525, Right 0.574 vs. 0.508). What the
          chart makes clear is <em>why</em> that&apos;s not the whole story:
          the weighted model jumps to IoU ≈0.47 in epoch 1 and never looks
          back, while the unweighted model is stuck near 0.33 — background
          only — for its first ~7 epochs before catching up and eventually
          overtaking. So the weights buy a faster, safer start, not a higher
          ceiling, at least at this scale. I&apos;m also only running one
          seed per condition, so part of that late-game crossover could be
          noise rather than a real effect — I&apos;d want a few more seeds
          before trusting the exact ranking at epoch 20.
        </p>
      </div>
    </div>
  );
}
