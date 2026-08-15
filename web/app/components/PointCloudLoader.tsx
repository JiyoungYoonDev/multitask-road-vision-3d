"use client";

import dynamic from "next/dynamic";

const PointCloud = dynamic(() => import("./PointCloud"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-sm text-zinc-500">
      loading point cloud...
    </div>
  ),
});

export default function PointCloudLoader() {
  return <PointCloud />;
}
