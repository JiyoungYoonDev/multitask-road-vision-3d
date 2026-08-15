function Box({
  title,
  subtitle,
  accent,
}: {
  title: string;
  subtitle: string;
  accent?: "seg" | "depth";
}) {
  const accentClass =
    accent === "seg"
      ? "border-emerald-400/50 dark:border-emerald-500/40"
      : accent === "depth"
        ? "border-amber-400/50 dark:border-amber-500/40"
        : "border-zinc-200 dark:border-zinc-800";

  return (
    <div
      className={`rounded-xl border ${accentClass} bg-white px-4 py-3 text-center shadow-sm dark:bg-zinc-950`}
    >
      <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
        {title}
      </p>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">{subtitle}</p>
    </div>
  );
}

function Arrow() {
  return (
    <div className="flex h-6 items-center justify-center text-zinc-300 dark:text-zinc-700">
      <span aria-hidden>↓</span>
    </div>
  );
}

export default function Architecture() {
  return (
    <div className="flex flex-col items-center gap-0">
      <Box title="RGB Image" subtitle="96 × 128 × 3" />
      <Arrow />
      <Box title="Shared Encoder" subtitle="down1 → down2 → down3, 3 → 64 channels" />

      <div className="mt-4 grid w-full grid-cols-2 gap-6">
        <div className="flex flex-col items-center gap-0">
          <Arrow />
          <Box title="Segmentation Head" subtitle="seg_up1 → seg_up2" accent="seg" />
          <Arrow />
          <Box title="Segmentation" subtitle="per-pixel class" accent="seg" />
        </div>
        <div className="flex flex-col items-center gap-0">
          <Arrow />
          <Box title="Depth Head" subtitle="depth_up1 → depth_up2" accent="depth" />
          <Arrow />
          <Box title="Depth" subtitle="per-pixel distance" accent="depth" />
        </div>
      </div>

      <div className="mt-6 grid w-full gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-white p-4 text-left dark:border-zinc-800 dark:bg-zinc-950">
          <span className="w-fit rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
            Skip connections
          </span>
          <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Both heads reuse{" "}
            <code className="font-mono">feature1</code> and{" "}
            <code className="font-mono">feature2</code> from the encoder to
            recover spatial detail lost while downsampling — the same trick
            U-Net uses.
          </p>
        </div>
        <div className="flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-white p-4 text-left dark:border-zinc-800 dark:bg-zinc-950">
          <span className="w-fit rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
            Loss balancing
          </span>
          <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            𝓛<sub>seg</sub> (weighted cross-entropy) and 𝓛<sub>depth</sub>{" "}
            (plain MSE) sit on very different scales, summed with λ = 1 and
            no explicit normalization. It works here — but it&apos;s a
            shortcut that stops working once one term is 100× the
            other&apos;s magnitude.
          </p>
        </div>
      </div>
    </div>
  );
}
