import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ColdPitch — AI Cold Email Generator";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
              marginRight: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              color: "white",
            }}
          >
            CP
          </div>
          <span
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#E2E8F0",
              letterSpacing: "-0.02em",
            }}
          >
            ColdPitch
          </span>
        </div>

        <div
          style={{
            fontSize: "56px",
            fontWeight: 800,
            color: "#F8FAFC",
            textAlign: "center",
            lineHeight: 1.2,
            letterSpacing: "-0.03em",
            marginBottom: "24px",
            maxWidth: "900px",
          }}
        >
          Paste a URL. Get a cold email. 30 seconds.
        </div>

        <div
          style={{
            fontSize: "22px",
            color: "#94A3B8",
            textAlign: "center",
          }}
        >
          coldpitch.site
        </div>
      </div>
    ),
    { ...size }
  );
}
