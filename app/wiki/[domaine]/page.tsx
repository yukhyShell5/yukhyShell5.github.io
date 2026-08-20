import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getWikiData, findDiscipline } from "@/lib/wiki/data";
import { createWikiLinkResolver } from "@/lib/wiki/remark";
import { WikiShell } from "@/components/wiki/shell";
import { WikiMarkdown } from "@/components/wiki/markdown";

export const dynamicParams = false;

export function generateStaticParams() {
  return getWikiData().disciplines.map((discipline) => ({
    domaine: discipline.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domaine: string }>;
}) {
  const { domaine } = await params;
  const discipline = findDiscipline(domaine);
  return {
    title: discipline
      ? `${discipline.title} — Wiki | yukhyShell5`
      : "Wiki | yukhyShell5",
  };
}

export default async function DisciplinePage({
  params,
}: {
  params: Promise<{ domaine: string }>;
}) {
  const { domaine } = await params;
  const discipline = findDiscipline(domaine);
  if (!discipline) notFound();

  const data = getWikiData();
  const resolve = createWikiLinkResolver(data);

  return (
    <WikiShell discipline={discipline} expandAll>
      <div className="mb-6 flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
        <Link href="/wiki" className="transition-colors hover:text-foreground">
          wiki
        </Link>
        <span>/</span>
        <span className="text-foreground">{discipline.slug}</span>
      </div>

      {discipline.sommaireContent ? (
        <WikiMarkdown
          content={discipline.sommaireContent}
          resolve={resolve}
          ctx={{ domaine, cours: "" }}
        />
      ) : (
        <div>
          <h1 className="font-mono text-3xl font-bold">{discipline.title}</h1>
          <ul className="mt-6 flex flex-col gap-2">
            {discipline.courses.map((course) => (
              <li key={course.slug}>
                <Link
                  href={`/wiki/${domaine}/${course.slug}`}
                  className="group flex items-center gap-2 rounded border border-border bg-card p-3 font-mono text-sm transition-colors hover:border-primary/40"
                >
                  <span className="text-primary/60">{course.numero}</span>
                  <span className="font-medium">{course.title}</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {course.chapters.length} chapitres
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </WikiShell>
  );
}
