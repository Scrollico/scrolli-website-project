"use client";

import dynamic from "next/dynamic";

const NextTopLoader = dynamic(
  (() => import("nextjs-toploader").catch((err) => {
    console.error("NextTopLoader load failed", err);
    return { default: () => null };
  })) as any,
  { ssr: false }
);

export default function NextTopLoaderClient() {
  return (
    <NextTopLoader
      color="#16A34A"
      initialPosition={0.08}
      crawlSpeed={500}
      height={2}
      crawl={true}
      showSpinner={false}
      easing="ease"
      speed={500}
      shadow="0 0 10px #16A34A,0 0 5px #16A34A"
      zIndex={1600}
    />
  );
}
