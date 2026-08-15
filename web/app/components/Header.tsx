const stack = ["PyTorch", "Next.js", "Three.js"];

export default function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-10 flex w-full items-center justify-between px-6 py-5">
      <span className="text-sm font-semibold tracking-tight text-white">
        Multitask Road Vision
      </span>
      <div className="flex items-center gap-4">
        <div className="hidden gap-2 sm:flex">
          {stack.map((s) => (
            <span
              key={s}
              className="rounded-full border border-white/25 px-2.5 py-1 font-mono text-xs text-zinc-200"
            >
              {s}
            </span>
          ))}
        </div>
        <a
          href="https://github.com/JiyoungYoonDev/multitask-road-vision-3d"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-white/40 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
        >
          GitHub ↗
        </a>
      </div>
    </header>
  );
}
