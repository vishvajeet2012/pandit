import { ImageResponse } from "next/og";
import { site } from "@/config/site";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  const { glyph, background, foreground, radius, scale, fontFamily, fontWeight } = site.favicon;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background,
          color: foreground,
          borderRadius: size.width * radius,
          fontFamily,
          fontWeight,
          fontSize: size.width * scale,
          letterSpacing: "0.02em",
        }}
      >
        {glyph}
      </div>
    ),
    size
  );
}
