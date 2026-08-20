import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getWikiData, findDiscipline, findCourse, readFileContent } from "@/lib/wiki/data";
import { createWikiLinkResolver } from "@/lib/wiki/remark";
import { WikiShell } from "@/components/wiki/shell";
import { WikiMarkdown } from "@/components/wiki/markdown";

export const dynamicParams = false;

export function generateStaticParams() {
  const data = getWikiData();
  return data.disciplines.flatMap((discipline) =>
    discipline.courses.map((course) => ({
      domaine: discipline.slug,
      cours: course.slug,
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domaine: string; cours: string }>;
}) {
  const { domaine, cours } = await params;
  const course = findCourse(domaine, cours);
  return {
    title: course
      ? `${course.title} — Wiki | yukhyShell5`
      : "Wiki | yukhyShell5",
  };
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ domaine: string; cours: string }>;
}) {
  const { domaine, cours } = await params;
  const discipline = findDiscipline(domaine);
  const course = findCourse(domaine, cours);
  if (!discipline || !course) notFound();

  const resolve = createWikiLinkResolver(getWikiData());
  const content = readFileContent(`${domaine}/${cours}/00-hub.md`);
  const firstChapter = course.chapters[0];

  return (
    <WikiShell discipline={discipline} activeCourseSlug={cours}>
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
        <span className="text-foreground">{cours}</span>
      </div>

      {content ? (
        <>
          <WikiMarkdown
            content={content}
            resolve={resolve}
            ctx={{ domaine, cours }}
          />
          {firstChapter && (
            <div className="mt-12 flex justify-end border-t border-border pt-6">
              <Link
                href={`/wiki/${domaine}/${cours}/${firstChapter.slug}`}
                className="group flex items-center gap-2 rounded border border-border bg-card px-4 py-3 font-mono text-sm transition-colors hover:border-primary/40"
              >
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Suivant</div>
                  <div className="text-foreground transition-colors group-hover:text-primary">
                    {firstChapter.numero} — {firstChapter.title}
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            </div>
          )}
        </>
      ) : (
        <div className="rounded border border-border bg-card p-8 font-mono text-sm text-muted-foreground">
          Contenu introuvable pour ce cours.
        </div>
      )}
    </WikiShell>
  );
}
