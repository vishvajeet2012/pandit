import Link from "next/link";
import "./globals.css";

/**
 * Reached only for paths outside a locale, so it carries its own document —
 * the root layout lives under [locale].
 */
export default function RootNotFound() {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          background: "#f7f3eb",
          color: "#1f252e",
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        <main style={{ padding: "0 clamp(24px, 7.2vw, 140px)" }}>
          <p
            style={{
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#c5a46e",
              marginBottom: 32,
            }}
          >
            Not found
          </p>
          <h1 style={{ fontSize: "clamp(34px, 5vw, 72px)", lineHeight: 0.96, margin: 0, fontWeight: 400 }}>
            This page is not in the house.
          </h1>
          <p style={{ marginTop: 40, color: "#5c6675", maxWidth: "48ch", fontFamily: "system-ui, sans-serif" }}>
            The link may be old, or the page may never have been written.
          </p>
          <p style={{ marginTop: 48 }}>
            <Link
              href="/en"
              style={{
                color: "#c5a46e",
                fontFamily: "system-ui, sans-serif",
                fontSize: 14,
                borderBottom: "1px solid rgba(197,164,110,.4)",
                paddingBottom: 2,
                textDecoration: "none",
              }}
            >
              Return to the front door →
            </Link>
          </p>
        </main>
      </body>
    </html>
  );
}
