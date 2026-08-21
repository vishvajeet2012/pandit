"use client";

import dynamic from "next/dynamic";

/** The preloader reads sessionStorage, so it never renders on the server. */
const Preloader = dynamic(() => import("./Preloader"), { ssr: false });

export default function Enter() {
  return <Preloader />;
}
