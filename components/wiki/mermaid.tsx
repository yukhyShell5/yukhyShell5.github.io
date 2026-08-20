"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

let initialized = false;

function initMermaid() {
  if (initialized) return;
  mermaid.initialize({
    startOnLoad: false,
    theme: "dark",
    securityLevel: "loose",
    fontFamily: "'JetBrains Mono', monospace",
    themeVariables: {
      darkMode: true,
      background: "#1e1e22",
      primaryColor: "#26262b",
      primaryTextColor: "#eae8ee",
      primaryBorderColor: "#cba6f7",
      lineColor: "#908f96",
      secondaryColor: "#26262b",
      tertiaryColor: "#17171a",
      fontFamily: "'JetBrains Mono', monospace",
    },
  });
  initialized = true;
}

export function Mermaid({ code }: { code: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    initMermaid();
    const id = `mermaid-${Math.random().toString(36).slice(2, 10)}`;
    mermaid
      .render(id, code)
      .then(({ svg }) => {
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg;
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
        }
      });
    return () => {
      cancelled = true;
    };
  }, [code]);

  if (error) {
    return (
      <div className="rounded border border-critical/40 bg-critical/5 p-3 font-mono text-xs text-muted-foreground">
        <p className="mb-2 text-critical">Erreur de rendu du diagramme :</p>
        <pre className="whitespace-pre-wrap">{code}</pre>
        <p className="mt-2 text-[10px] opacity-70">{error}</p>
      </div>
    );
  }

  return <div ref={ref} className="mermaid-wrap" />;
}
