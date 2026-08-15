const rows = [
  { label: "Road", withW: 0.9815, noW: 0.9851 },
  { label: "Left Boundary", withW: 0.5901, noW: 0.5801 },
  { label: "Right Boundary", withW: 0.5906, noW: 0.5742 },
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
          Honest result: the gap is smaller than I expected.
        </p>
        <p>
          After 20 epochs, unweighted training does eventually learn the
          boundary classes — final IoU is only ~1–2 points lower than the
          weighted model (0.580 vs 0.590, 0.574 vs 0.591), and it even edges
          out the weighted model on background IoU and overall pixel
          accuracy. What the weights actually bought was convergence speed:
          the unweighted run&apos;s mean IoU was stuck near 0.33 — background
          only, boundary classes essentially ignored — for the first ~7
          epochs, while the weighted model (trained longer, 50 epochs in the
          original run) never went through that dead zone. With a short
          training budget or a harder dataset, that gap would likely matter
          a lot more.
        </p>
      </div>
    </div>
  );
}
