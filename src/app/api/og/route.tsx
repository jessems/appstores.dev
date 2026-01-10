import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const title = searchParams.get("title") || "appstores.dev";
  const description =
    searchParams.get("description") || "The App Store Directory";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          backgroundColor: "#1a1a2e",
          backgroundImage:
            "radial-gradient(circle at 25% 25%, #2d2d44 0%, transparent 50%), radial-gradient(circle at 75% 75%, #2d2d44 0%, transparent 50%)",
          padding: "60px 80px",
        }}
      >
        {/* Logo/Brand */}
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
              backgroundColor: "#bd93f9",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "16px",
            }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <span
            style={{
              fontSize: "28px",
              fontWeight: "600",
              color: "#f8f8f2",
              letterSpacing: "-0.5px",
            }}
          >
            appstores.dev
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "900px",
          }}
        >
          <h1
            style={{
              fontSize: title.length > 40 ? "48px" : "64px",
              fontWeight: "700",
              color: "#f8f8f2",
              lineHeight: 1.1,
              marginBottom: "24px",
              letterSpacing: "-1px",
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: "24px",
              color: "#a0a0b0",
              lineHeight: 1.4,
              maxWidth: "800px",
            }}
          >
            {description.length > 150
              ? description.slice(0, 150) + "..."
              : description}
          </p>
        </div>

        {/* Bottom decoration */}
        <div
          style={{
            position: "absolute",
            bottom: "60px",
            right: "80px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              backgroundColor: "#50fa7b",
              borderRadius: "50%",
            }}
          />
          <span
            style={{
              fontSize: "18px",
              color: "#6c6c80",
            }}
          >
            The App Store Directory
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
