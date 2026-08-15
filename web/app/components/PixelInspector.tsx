"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type PixelData = {
  width: number;
  height: number;
  classNames: string[];
  segClass: number[];
  depth: number[];
};

export default function PixelInspector() {
  const [data, setData] = useState<PixelData | null>(null);
  const [hover, setHover] = useState<{
    x: number;
    y: number;
    cls: string;
    depth: number;
  } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/data/pixel-inspector.json")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-zinc-500">
        loading pixel data...
      </div>
    );
  }

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;

    const col = Math.min(data.width - 1, Math.max(0, Math.floor(relX * data.width)));
    const row = Math.min(data.height - 1, Math.max(0, Math.floor(relY * data.height)));
    const i = row * data.width + col;

    setHover({
      x: col,
      y: row,
      cls: data.classNames[data.segClass[i]],
      depth: data.depth[i],
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <div
        ref={containerRef}
        className="relative w-full max-w-md cursor-crosshair overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800"
        onMouseMove={handleMove}
        onMouseLeave={() => setHover(null)}
      >
        <Image
          src="/images/sample-input.png"
          alt="hover to inspect"
          width={640}
          height={480}
          className="pointer-events-none h-auto w-full select-none"
        />
        {hover && (
          <div
            className="pointer-events-none absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow"
            style={{
              left: `${(hover.x / data.width) * 100}%`,
              top: `${(hover.y / data.height) * 100}%`,
            }}
          />
        )}
      </div>

      <div className="flex gap-6 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div>
          <p className="text-zinc-500 dark:text-zinc-400">pixel</p>
          <p className="font-mono text-zinc-950 dark:text-zinc-50">
            {hover ? `${hover.x}, ${hover.y}` : "— hover the image —"}
          </p>
        </div>
        <div>
          <p className="text-zinc-500 dark:text-zinc-400">predicted class</p>
          <p className="font-mono text-zinc-950 dark:text-zinc-50">
            {hover ? hover.cls : "—"}
          </p>
        </div>
        <div>
          <p className="text-zinc-500 dark:text-zinc-400">predicted depth</p>
          <p className="font-mono text-zinc-950 dark:text-zinc-50">
            {hover ? hover.depth.toFixed(3) : "—"}
          </p>
        </div>
      </div>
    </div>
  );
}
