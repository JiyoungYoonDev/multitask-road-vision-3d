import { ImageResponse } from "next/og";

export const alt = "Multitask Road Vision";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#09090b",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <svg width="40" height="40" viewBox="0 0 32 32">
            <rect width="32" height="32" rx="7" fill="#18181b" />
            <path
              d="M9 27 L14 6 L18 6 L23 27 Z"
              fill="none"
              stroke="#e4e4e7"
              strokeWidth="1.6"
            />
            <circle cx="16" cy="12.5" r="2.4" fill="#34d399" />
          </svg>
          <div style={{ display: "flex", color: "#a1a1aa", fontSize: 28, letterSpacing: 2 }}>
            MULTITASK ROAD VISION
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              display: "flex",
              color: "#fafafa",
              fontSize: 62,
              fontWeight: 700,
              lineHeight: 1.15,
              maxWidth: 980,
            }}
          >
            One CNN. Two questions about every pixel.
          </div>
          <div style={{ display: "flex", color: "#a1a1aa", fontSize: 28 }}>
            Segmentation + depth from a single shared encoder — with a real,
            honest class-imbalance experiment.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", width: 10, height: 10, borderRadius: 999, backgroundColor: "#34d399" }} />
          <div style={{ display: "flex", width: 10, height: 10, borderRadius: 999, backgroundColor: "#f0b429" }} />
          <div style={{ display: "flex", color: "#71717a", fontSize: 24, marginLeft: 8 }}>
            Jiyoung Yoon
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
