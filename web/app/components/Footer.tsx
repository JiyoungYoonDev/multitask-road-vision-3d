export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-200 bg-zinc-50 dark:border-zinc-900 dark:bg-black">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-6 py-10 text-sm text-zinc-500 dark:text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <p className="font-medium text-zinc-900 dark:text-zinc-200">
            Jiyoung Yoon
          </p>
          <p>Multitask Road Vision — built while learning CNNs at UT Austin.</p>
        </div>
        <div className="flex flex-col gap-1 sm:items-end">
          <a
            href="https://github.com/JiyoungYoonDev/multitask-road-vision-3d"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-zinc-700 underline-offset-4 hover:underline dark:text-zinc-300"
          >
            View source on GitHub
          </a>
          <p className="font-mono text-xs">PyTorch · Next.js · react-three-fiber</p>
        </div>
      </div>
    </footer>
  );
}
