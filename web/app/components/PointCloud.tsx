"use client";

import { useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

type CloudData = {
  width: number;
  height: number;
  depth: number[];
  color: number[][];
};

function Cloud({ data }: { data: CloudData }) {
  const { positions, colors } = useMemo(() => {
    const { width, height, depth, color } = data;
    const positions = new Float32Array(width * height * 3);
    const colors = new Float32Array(width * height * 3);

    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        const i = row * width + col;

        positions[i * 3] = ((col - width / 2) / width) * 4;
        positions[i * 3 + 1] = -((row - height / 2) / height) * 3;
        positions[i * 3 + 2] = depth[i] * 2.5;

        colors[i * 3] = color[i][0] / 255;
        colors[i * 3 + 1] = color[i][1] / 255;
        colors[i * 3 + 2] = color[i][2] / 255;
      }
    }
    return { positions, colors };
  }, [data]);

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

export default function PointCloud() {
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
      <Cloud data={data} />
      <OrbitControls enableDamping dampingFactor={0.08} />
    </Canvas>
  );
}
