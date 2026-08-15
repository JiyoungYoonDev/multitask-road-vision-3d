function Node({
  title,
  subtitle,
  emphasis,
}: {
  title: string;
  subtitle?: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border px-5 py-3 text-center ${
        emphasis
          ? "border-zinc-950 bg-zinc-950 text-zinc-50 dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-950"
          : "border-zinc-200 bg-white text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
      }`}
    >
      <p className="text-sm font-semibold">{title}</p>
      {subtitle && (
        <p
          className={`text-xs ${
            emphasis
              ? "text-zinc-300 dark:text-zinc-600"
              : "text-zinc-500 dark:text-zinc-400"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default function SimpleArchitecture() {
  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <Node title="WHAT?" subtitle="Road / Boundary" />
      <span className="text-2xl text-zinc-300 dark:text-zinc-700" aria-hidden>
        ↑
      </span>
      <div className="flex items-center gap-4">
        <Node title="CAMERA" subtitle="RGB frame" />
        <span className="text-2xl text-zinc-300 dark:text-zinc-700" aria-hidden>
          →
        </span>
        <Node title="SHARED VISION" subtitle="one encoder" emphasis />
      </div>
      <span className="text-2xl text-zinc-300 dark:text-zinc-700" aria-hidden>
        ↓
      </span>
      <Node title="WHERE?" subtitle="Near / Far" />
    </div>
  );
}
