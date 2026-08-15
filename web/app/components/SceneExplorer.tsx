"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import PointCloud from "./PointCloudLoader";
import type { ColorMode } from "./PointCloud";

type Mode = "rgb" | "seg" | "depth" | "3d";

type PixelData = {
  width: number;
  height: number;
  classNames: string[];
  segClass: number[];
  depth: number[];
};

const TABS: { mode: Mode; label: string }[] = [
  { mode: "rgb", label: "RGB" },
  { mode: "seg", label: "Segmentation" },
  { mode: "depth", label: "Depth" },
  { mode: "3d", label: "3D" },
];

const MODE_IMAGE: Record<"rgb" | "seg" | "depth", string> = {
  rgb: "/images/sample-input.png",
  seg: "/images/sample-segmentation.png",
  depth: "/images/sample-depth.png",
};

const MODE_CAPTION: Record<Mode, string> = {
  rgb: "A single camera frame — no labels, no depth, just RGB pixels.",
  seg: "It first answers WHAT? — road, left boundary, or right boundary, per pixel.",
  depth: "Then HOW FAR? — same encoder, a second head, a distance instead of a class.",
  "3d": "Now step inside its prediction — every pixel pushed back in space by its predicted depth.",
};

const CLASS_IDS = [0, 1, 2];

export default function SceneExplorer() {
  const [mode, setMode] = useState<Mode>("rgb");
  const [pixelData, setPixelData] = useState<PixelData | null>(null);
  const [hover, setHover] = useState<{ x: number; y: number; cls: string; depth: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [colorMode, setColorMode] = useState<ColorMode>("rgb");
  const [visibleClasses, setVisibleClasses] = useState<Set<number>>(new Set(CLASS_IDS));

  useEffect(() => {
    fetch("/data/pixel-inspector.json")
      .then((res) => res.json())
      .then(setPixelData);
  }, []);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!pixelData) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;
    const col = Math.min(pixelData.width - 1, Math.max(0, Math.floor(relX * pixelData.width)));
    const row = Math.min(pixelData.height - 1, Math.max(0, Math.floor(relY * pixelData.height)));
    const i = row * pixelData.width + col;

    setHover({
      x: col,
      y: row,
      cls: pixelData.classNames[pixelData.segClass[i]],
      depth: pixelData.depth[i],
    });
  };

  const toggleClass = (id: number) => {
    setVisibleClasses((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        if (next.size > 1) next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.mode}
            onClick={() => setMode(t.mode)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              mode === t.mode
                ? "border-zinc-950 bg-zinc-950 text-zinc-50 dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-950"
                : "border-zinc-200 text-zinc-600 hover:border-zinc-400 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-600"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950">
          {mode === "3d" ? (
            <div className="h-[420px] w-full">
              <PointCloud colorMode={colorMode} visibleClasses={visibleClasses} />
            </div>
          ) : (
            <div
              ref={containerRef}
              className="relative cursor-crosshair"
              onMouseMove={handleMove}
              onMouseLeave={() => setHover(null)}
            >
              <Image
                src={MODE_IMAGE[mode]}
                alt={mode}
                width={960}
                height={720}
                className="pointer-events-none h-auto w-full select-none"
                priority
              />
              {hover && (
                <>
                  <div
                    className="pointer-events-none absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow"
                    style={{
                      left: `${(hover.x / pixelData!.width) * 100}%`,
                      top: `${(hover.y / pixelData!.height) * 100}%`,
                    }}
                  />
                  <div
                    className="pointer-events-none absolute rounded-lg bg-black/85 px-3 py-2 font-mono text-xs text-white shadow-lg"
                    style={{
                      left: `${(hover.x / pixelData!.width) * 100}%`,
                      top: `${(hover.y / pixelData!.height) * 100}%`,
                      transform: "translate(16px, -50%)",
                    }}
                  >
                    <div>Pixel ({hover.x}, {hover.y})</div>
                    <div>Class&nbsp; {hover.cls}</div>
                    <div>Depth&nbsp; {hover.depth.toFixed(2)}</div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {mode === "3d" && (
          <div className="flex w-full flex-col gap-5 rounded-2xl border border-zinc-200 bg-white p-4 text-sm dark:border-zinc-800 dark:bg-zinc-950 sm:w-48">
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Color by
              </p>
              {(["rgb", "semantic", "depth"] as ColorMode[]).map((cm) => (
                <label key={cm} className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                  <input
                    type="radio"
                    name="colorMode"
                    checked={colorMode === cm}
                    onChange={() => setColorMode(cm)}
                  />
                  {cm === "rgb" ? "RGB" : cm === "semantic" ? "Semantic class" : "Depth"}
                </label>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Visible classes
              </p>
              {pixelData?.classNames.map((name, id) => (
                <label key={id} className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                  <input
                    type="checkbox"
                    checked={visibleClasses.has(id)}
                    onChange={() => toggleClass(id)}
                  />
                  {name}
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      <p className="text-lg leading-7 text-zinc-600 dark:text-zinc-400">
        {MODE_CAPTION[mode]}
      </p>
    </div>
  );
}
