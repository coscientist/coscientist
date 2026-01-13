import { ImageResponse } from "@vercel/og";
import type { NextRequest } from "next/server";
import { getFacultyGlyphic } from "@/lib/og/fonts";

export const runtime = "edge";

const OG_WIDTH = 2400;
const OG_HEIGHT = 1260;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get("title") || "Coscientist";
  const description = searchParams.get("description") || "";

  const facultyGlyphicFont = await getFacultyGlyphic();

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "100px",
        backgroundColor: "#0a0a0a",
        fontFamily: "Faculty Glyphic",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "48px",
        }}
      >
        <h1
          style={{
            fontSize: "144px",
            fontWeight: 400,
            color: "#ffffff",
            margin: 0,
            lineHeight: 1.1,
            maxWidth: "1800px",
          }}
        >
          {title}
        </h1>

        {description && (
          <p
            style={{
              fontSize: "64px",
              fontWeight: 400,
              color: "#a1a1aa",
              margin: 0,
              lineHeight: 1.4,
              maxWidth: "1600px",
            }}
          >
            {description.length > 120
              ? `${description.slice(0, 120)}...`
              : description}
          </p>
        )}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "100px",
          left: "100px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: "56px",
            fontWeight: 400,
            color: "#71717a",
          }}
        >
          coscientist.app
        </span>
      </div>

      <div
        style={{
          position: "absolute",
          top: "0",
          right: "0",
          width: "1200px",
          height: "1200px",
          background:
            "radial-gradient(circle at top right, rgba(59, 130, 246, 0.15) 0%, transparent 70%)",
        }}
      />
    </div>,
    {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      fonts: [
        {
          name: "Faculty Glyphic",
          data: facultyGlyphicFont,
          weight: 400,
          style: "normal",
        },
      ],
    },
  );
}
