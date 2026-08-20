import Link from "next/link";
import type { Discipline } from "@/lib/wiki/types";

interface WikiSidebarProps {
  discipline: Discipline;
  activeCourseSlug?: string;
  activeChapterSlug?: string;
  expandAll?: boolean;
}

function cleanChapterTitle(title: string): string {
  return title.replace(/^\d{2}\s*[—–-]\s*/, "").trim();
}

export function WikiSidebar({
  discipline,
  activeCourseSlug,
  activeChapterSlug,
  expandAll,
}: WikiSidebarProps) {
  const isDisciplinePage = !activeCourseSlug && !activeChapterSlug;

  const rootLinkClass = (active: boolean) =>
    `flex items-center gap-1.5 rounded px-2 py-1.5 text-sm transition-colors font-mono ${
      active
        ? "bg-primary/10 text-primary"
        : "text-muted-foreground hover:text-foreground hover:bg-accent"
    }`;

  const courseLinkClass = (active: boolean) =>
    `flex items-center gap-1.5 rounded px-2 py-1.5 text-sm transition-colors font-mono ${
      active
        ? "bg-primary/10 text-primary"
        : "text-muted-foreground hover:text-foreground hover:bg-accent"
    }`;

  const chapterLinkClass = (active: boolean) =>
    `flex items-center gap-1.5 rounded px-2 py-1 text-[13px] transition-colors font-mono ${
      active
        ? "text-primary"
        : "text-muted-foreground/80 hover:text-foreground hover:bg-accent"
    }`;

  return (
    <nav className="flex flex-col gap-0.5">
      <Link href="/wiki" className={rootLinkClass(false)}>
        <span className="text-primary">❯</span>
        <span className="font-semibold">Wiki</span>
      </Link>
      <Link
        href={`/wiki/${discipline.slug}`}
        className={rootLinkClass(isDisciplinePage)}
      >
        <span className="text-primary/60">~/</span>
        <span className="font-semibold">{discipline.title}</span>
      </Link>

      <div className="mt-2 flex flex-col gap-0.5 border-t border-border pt-2">
        {discipline.courses.map((course) => {
          const expanded =
            expandAll || activeCourseSlug === course.slug;
          const courseActive = activeCourseSlug === course.slug && !activeChapterSlug;
          return (
            <div key={course.slug}>
              <Link
                href={`/wiki/${discipline.slug}/${course.slug}`}
                className={courseLinkClass(courseActive)}
              >
                {course.numero && (
                  <span className="shrink-0 text-primary/60">{course.numero}</span>
                )}
                <span className="truncate">{course.title}</span>
              </Link>
              {expanded && (
                <div className="ml-3 flex flex-col gap-0.5 border-l border-border pl-2 py-0.5">
                  <Link
                    href={`/wiki/${discipline.slug}/${course.slug}`}
                    className={chapterLinkClass(
                      activeCourseSlug === course.slug && !activeChapterSlug
                    )}
                  >
                    <span className="text-primary/50">00</span>
                    <span>Intro</span>
                  </Link>
                  {course.chapters.map((chapter) => (
                    <Link
                      key={chapter.slug}
                      href={`/wiki/${discipline.slug}/${course.slug}/${chapter.slug}`}
                      className={chapterLinkClass(activeChapterSlug === chapter.slug)}
                    >
                      {chapter.numero && (
                        <span className="shrink-0 text-primary/50">{chapter.numero}</span>
                      )}
                      <span className="truncate">{cleanChapterTitle(chapter.title)}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
