import { Menu } from "lucide-react";
import type { Discipline } from "@/lib/wiki/types";
import { WikiSidebar } from "./sidebar";

interface WikiShellProps {
  discipline: Discipline;
  activeCourseSlug?: string;
  activeChapterSlug?: string;
  expandAll?: boolean;
  children: React.ReactNode;
}

export function WikiShell({
  discipline,
  activeCourseSlug,
  activeChapterSlug,
  expandAll,
  children,
}: WikiShellProps) {
  return (
    <div className="mx-auto flex max-w-7xl">
      {/* Desktop sidebar */}
      <aside className="hidden w-72 shrink-0 border-r border-border lg:block">
        <div className="sticky top-[60px] h-[calc(100vh-60px)] overflow-y-auto p-4 pr-2">
          <WikiSidebar
            discipline={discipline}
            activeCourseSlug={activeCourseSlug}
            activeChapterSlug={activeChapterSlug}
            expandAll={expandAll}
          />
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        {/* Mobile nav */}
        <details className="group border-b border-border lg:hidden">
          <summary className="flex cursor-pointer items-center gap-2 px-6 py-3 font-mono text-sm text-muted-foreground select-none hover:text-foreground">
            <Menu className="h-4 w-4 text-primary" />
            Chapitres
            <span className="ml-auto text-xs text-term-dim">
              {discipline.title}
            </span>
          </summary>
          <div className="border-t border-border px-4 py-3">
            <WikiSidebar
              discipline={discipline}
              activeCourseSlug={activeCourseSlug}
              activeChapterSlug={activeChapterSlug}
              expandAll={expandAll}
            />
          </div>
        </details>

        <article className="mx-auto w-full max-w-4xl px-8 py-12">{children}</article>
      </main>
    </div>
  );
}
