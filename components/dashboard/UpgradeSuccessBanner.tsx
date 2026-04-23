"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function UpgradeSuccessBanner() {
  const params = useSearchParams();
  const [show, setShow] = useState(() => params.get("upgrade") === "success");

  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => setShow(false), 6000);
    return () => clearTimeout(t);
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-200 flex items-center gap-2.5 bg-rv-ink text-white px-5 py-3 rounded-lg shadow-[0_8px_24px_rgba(15,14,13,0.2)] text-[0.85rem] font-semibold animate-[rv-fade-up_0.3s_ease]">
      <span className="text-base">✦</span>
      Welcome to Pro! All features are now unlocked.
      <button
        onClick={() => setShow(false)}
        className="ml-2 bg-transparent border-0 text-white/60 cursor-pointer text-base leading-none hover:text-white transition-colors"
      >
        ×
      </button>
    </div>
  );
}
