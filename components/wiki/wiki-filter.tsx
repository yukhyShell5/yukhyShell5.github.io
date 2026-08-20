"use client";

import { useState } from "react";

export type WikiTab = "cours" | "blog";

interface WikiFilterProps {
  coursesView: React.ReactNode;
  blogView: React.ReactNode;
  coursesCount?: number;
  blogCount?: number;
}

export function WikiFilter({
  coursesView,
  blogView,
  coursesCount,
  blogCount,
}: WikiFilterProps) {
  const [tab, setTab] = useState<WikiTab>("cours");

  const tabClass = (active: boolean) =>
    `flex items-center gap-2 rounded px-3 py-1.5 text-sm font-mono transition-colors cursor-pointer ${
      active
        ? "bg-primary text-primary-foreground"
        : "text-muted-foreground hover:text-foreground"
    }`;

  return (
    <div>
      <div className="mb-8 inline-flex items-center gap-1 rounded border border-border bg-card p-1">
        <button onClick={() => setTab("cours")} className={tabClass(tab === "cours")}>
          Cours
          {typeof coursesCount === "number" && (
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded ${
                tab === "cours" ? "bg-primary-foreground/15" : "bg-accent"
              }`}
            >
              {coursesCount}
            </span>
          )}
        </button>
        <button onClick={() => setTab("blog")} className={tabClass(tab === "blog")}>
          Blog
          {typeof blogCount === "number" && (
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded ${
                tab === "blog" ? "bg-primary-foreground/15" : "bg-accent"
              }`}
            >
              {blogCount}
            </span>
          )}
        </button>
      </div>

      {tab === "cours" ? coursesView : blogView}
    </div>
  );
}
