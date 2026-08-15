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

      <p className="mt-6 max-w-xl text-center text-sm text-zinc-500 dark:text-zinc-400">
        Both heads reuse skip connections from the encoder (
        <code className="font-mono">feature1</code>,{" "}
        <code className="font-mono">feature2</code>) to recover spatial
        detail lost while downsampling — the same trick U-Net uses.
      </p>
    </div>
  );
}
