"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function UpgradeSuccessBanner() {
  const params = useSearchParams();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (params.get("upgrade") === "success") {
      setShow(true);
      const t = setTimeout(() => setShow(false), 6000);
      return () => clearTimeout(t);
    }
  }, [params]);

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "var(--rv-ink)",
        color: "#fff",
        padding: "0.75rem 1.25rem",
        borderRadius: 4,
        boxShadow: "0 8px 24px rgba(15,14,13,0.2)",
        fontSize: "0.85rem",
        fontWeight: 600,
        animation: "rv-fade-up 0.3s ease",
      }}
    >
      <span style={{ fontSize: "1rem" }}>✦</span>
      Welcome to Pro! All features are now unlocked.
      <button
        onClick={() => setShow(false)}
        style={{
          marginLeft: 8,
          background: "none",
          border: "none",
          color: "rgba(255,255,255,0.6)",
          cursor: "pointer",
          fontSize: "1rem",
          lineHeight: 1,
        }}
      >
        ×
      </button>
    </div>
  );
}
