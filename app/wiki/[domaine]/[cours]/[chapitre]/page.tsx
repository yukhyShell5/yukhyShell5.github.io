import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  getWikiData,
  findDiscipline,
  findCourse,
  findChapter,
  readFileContent,
} from "@/lib/wiki/data";
import { createWikiLinkResolver } from "@/lib/wiki/remark";
import { WikiShell } from "@/components/wiki/shell";
import { WikiMarkdown } from "@/components/wiki/markdown";

export const dynamicParams = false;

export function generateStaticParams() {
  const data = getWikiData();
  return data.disciplines.flatMap((discipline) =>
    discipline.courses.flatMap((course) =>
      course.chapters.map((chapter) => ({
        domaine: discipline.slug,
        cours: course.slug,
        chapitre: chapter.slug,
      }))
    )
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domaine: string; cours: string; chapitre: string }>;
}) {
  const { domaine, cours, chapitre } = await params;
  const chapter = findChapter(domaine, cours, chapitre);
  const course = findCourse(domaine, cours);
  return {
    title: chapter
      ? `${chapter.title} — ${course?.title ?? cours} | yukhyShell5`
      : "Wiki | yukhyShell5",
  };
}

interface NavItem {
  label: string;
  href: string;
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ domaine: string; cours: string; chapitre: string }>;
}) {
  const { domaine, cours, chapitre } = await params;
  const discipline = findDiscipline(domaine);
  const course = findCourse(domaine, cours);
  const chapter = findChapter(domaine, cours, chapitre);
  if (!discipline || !course || !chapter) notFound();

  const resolve = createWikiLinkResolver(getWikiData());
  const content = readFileContent(`${domaine}/${cours}/${chapitre}.md`);

  const courseHref = `/wiki/${domaine}/${cours}`;
  const items: NavItem[] = [
    { label: "Introduction", href: courseHref },
    ...course.chapters.map((c) => ({
      label: `${c.numero ?? ""} ${c.title}`.trim(),
      href: `/wiki/${domaine}/${cours}/${c.slug}`,
    })),
  ];
  const index = items.findIndex((item) => item.href.endsWith(`/${chapitre}`));
  const prev = index > 0 ? items[index - 1] : null;
  const next = index >= 0 && index < items.length - 1 ? items[index + 1] : null;

  return (
    <WikiShell
      discipline={discipline}
      activeCourseSlug={cours}
      activeChapterSlug={chapitre}
    >
      <div className="mb-6 flex flex-wrap items-center gap-1.5 font-mono text-xs text-muted-foreground">
        <Link href="/wiki" className="transition-colors hover:text-foreground">
          wiki
        </Link>
        <span>/</span>
        <Link
          href={`/wiki/${domaine}`}
          className="transition-colors hover:text-foreground"
        >
          {discipline.slug}
        </Link>
        <span>/</span>
        <Link
          href={courseHref}
          className="transition-colors hover:text-foreground"
        >
          {cours}
        </Link>
        <span>/</span>
        <span className="text-foreground">{chapitre}</span>
      </div>

      {content ? (
        <>
          <WikiMarkdown
            content={content}
            resolve={resolve}
            ctx={{ domaine, cours }}
          />

          <nav className="mt-12 grid gap-4 border-t border-border pt-6 sm:grid-cols-2">
            {prev ? (
              <Link
                href={prev.href}
                className="group flex items-center gap-2 rounded border border-border bg-card px-4 py-3 font-mono text-sm transition-colors hover:border-primary/40"
              >
                <ChevronLeft className="h-4 w-4 shrink-0 text-muted-foreground/40 transition-all group-hover:-translate-x-0.5 group-hover:text-primary" />
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground">Précédent</div>
                  <div className="truncate text-foreground transition-colors group-hover:text-primary">
                    {prev.label}
                  </div>
                </div>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={next.href}
                className="group flex items-center justify-end gap-2 rounded border border-border bg-card px-4 py-3 font-mono text-sm transition-colors hover:border-primary/40 sm:col-start-2"
              >
                <div className="min-w-0 text-right">
                  <div className="text-xs text-muted-foreground">Suivant</div>
                  <div className="truncate text-foreground transition-colors group-hover:text-primary">
                    {next.label}
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </>
      ) : (
        <div className="rounded border border-border bg-card p-8 font-mono text-sm text-muted-foreground">
          Contenu introuvable pour ce chapitre.
        </div>
      )}
    </WikiShell>
  );
}
