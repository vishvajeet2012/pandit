import type { ReactNode } from "react";

/** The standing head for every page that is not the landing page. */
export default function PageHead({
  eyebrow,
  title,
  accent,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  intro?: string;
  children?: ReactNode;
}) {
  return (
    <header className="act pt-[clamp(120px,14vw,200px)]">
      <p className="eyebrow mb-8">{eyebrow}</p>
      <h1 className="display max-w-[18ch] text-[clamp(34px,5vw,72px)] leading-[0.96]">
        {title}
        {accent && (
          <>
            {" "}
            <span className="italic-gold">{accent}</span>
          </>
        )}
      </h1>
      {intro && <p className="body-muted mt-10 max-w-[58ch]">{intro}</p>}
      {children}
    </header>
  );
}
