"use client";

import { useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

export type ColorMode = "rgb" | "semantic" | "depth";

type CloudData = {
  width: number;
  height: number;
  classNames: string[];
  depth: number[];
  color: number[][];
  segClass: number[];
};

const SEMANTIC_COLORS: [number, number, number][] = [
  [0.55, 0.55, 0.58],
  [0.2, 0.78, 0.53],
  [0.95, 0.68, 0.18],
];

function depthColor(d: number): [number, number, number] {
  const near: [number, number, number] = [0.15, 0.35, 0.9];
  const far: [number, number, number] = [0.95, 0.75, 0.15];
  return [
    near[0] + (far[0] - near[0]) * d,
    near[1] + (far[1] - near[1]) * d,
    near[2] + (far[2] - near[2]) * d,
  ];
}

function Cloud({
  data,
  colorMode,
  visibleClasses,
}: {
  data: CloudData;
  colorMode: ColorMode;
  visibleClasses: Set<number>;
}) {
  const { positions, colors } = useMemo(() => {
    const { width, height, depth, color, segClass } = data;
    const positions: number[] = [];
    const colors: number[] = [];

    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        const i = row * width + col;
        const cls = segClass[i];
        if (!visibleClasses.has(cls)) continue;

        positions.push(
          -((col - width / 2) / width) * 4, // negated: camera looks toward +Z, which mirrors X
          -((row - height / 2) / height) * 3,
          depth[i] * 2.5,
        );

        let rgb: [number, number, number];
        if (colorMode === "semantic") {
          rgb = SEMANTIC_COLORS[cls] ?? [1, 1, 1];
        } else if (colorMode === "depth") {
          rgb = depthColor(depth[i]);
        } else {
          rgb = [color[i][0] / 255, color[i][1] / 255, color[i][2] / 255];
        }
        colors.push(...rgb);
      }
    }
    return {
      positions: new Float32Array(positions),
      colors: new Float32Array(colors),
    };
  }, [data, colorMode, visibleClasses]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.025} vertexColors sizeAttenuation />
    </points>
  );
}

export default function PointCloud({
  colorMode = "rgb",
  visibleClasses = new Set([0, 1, 2]),
}: {
  colorMode?: ColorMode;
  visibleClasses?: Set<number>;
}) {
  const [data, setData] = useState<CloudData | null>(null);

  useEffect(() => {
    fetch("/data/pointcloud.json")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) {
    return (
      <div className="flex h-full w-full items-center justify-center text-sm text-zinc-500">
        loading point cloud...
      </div>
    );
  }

  return (
    <Canvas camera={{ position: [0, 0.3, -3.5], fov: 55 }}>
      <ambientLight intensity={1.2} />
      <Cloud data={data} colorMode={colorMode} visibleClasses={visibleClasses} />
      <OrbitControls enableDamping dampingFactor={0.08} />
    </Canvas>
  );
}
