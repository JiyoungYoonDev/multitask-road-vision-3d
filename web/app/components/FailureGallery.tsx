import Image from "next/image";

const cases = [
  { name: "worst-1", iou: 0.331, label: "worst #1" },
  { name: "worst-2", iou: 0.333, label: "worst #2" },
  { name: "worst-3", iou: 0.336, label: "worst #3" },
  { name: "best-1", iou: 0.875, label: "for contrast" },
];

export default function FailureGallery() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {cases.map((c) => (
        <div
          key={c.name}
          className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
              {c.label}
            </span>
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 font-mono text-xs text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
              IoU {c.iou}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900">
              <Image
                src={`/images/failures/${c.name}-input.png`}
                alt="input"
                width={200}
                height={150}
                className="h-auto w-full"
              />
              <p className="p-1 text-center text-[10px] text-zinc-500">input</p>
            </div>
            <div className="overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900">
              <Image
                src={`/images/failures/${c.name}-gt.png`}
                alt="ground truth"
                width={200}
                height={150}
                className="h-auto w-full"
              />
              <p className="p-1 text-center text-[10px] text-zinc-500">ground truth</p>
            </div>
            <div className="overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900">
              <Image
                src={`/images/failures/${c.name}-pred.png`}
                alt="prediction"
                width={200}
                height={150}
                className="h-auto w-full"
              />
              <p className="p-1 text-center text-[10px] text-zinc-500">prediction</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
