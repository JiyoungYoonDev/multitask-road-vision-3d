"use client";

import { useState } from "react";
import SimpleArchitecture from "./SimpleArchitecture";
import Architecture from "./Architecture";

export default function ArchitectureExplorer() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex flex-col items-center gap-6">
      <SimpleArchitecture />

      <button
        onClick={() => setExpanded((v) => !v)}
        className="rounded-full border border-zinc-300 px-5 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-500 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500"
      >
        {expanded ? "Hide the details ↑" : "Explore the architecture ↓"}
      </button>

      {expanded && (
        <div className="w-full border-t border-zinc-200 pt-8 dark:border-zinc-900">
          <Architecture />
        </div>
      )}
    </div>
  );
}
