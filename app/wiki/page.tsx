import Link from "next/link";
import { BookOpen, ChevronRight, Feather } from "lucide-react";
import { getWikiData } from "@/lib/wiki/data";
import { WikiFilter } from "@/components/wiki/wiki-filter";

export const metadata = {
  title: "Wiki — Cours | yukhyShell5",
  description:
    "Cours et notes de recherche : Linux, Kubernetes, Docker, Git, vLLM et plus.",
};

export default function WikiHome() {
  const data = getWikiData();
  const coursesCount = data.disciplines.reduce(
    (sum, discipline) => sum + discipline.courses.length,
    0
  );

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14">
      <div className="mb-10">
        <div className="mb-4 flex items-center gap-2 font-mono text-xs text-primary">
          <BookOpen className="h-4 w-4" />
          <span className="uppercase tracking-wider">~/wiki</span>
        </div>
        <h1 className="font-mono text-3xl font-bold sm:text-4xl">
          Wiki <span className="text-primary">&amp;</span> cours
        </h1>
        <p className="mt-3 max-w-2xl font-mono text-sm text-muted-foreground">
          Tous les cours de mon vault Obsidian, avec leurs chapitres. Choisis
          une discipline pour commencer — chaque cours est découpé en chapitres
          numérotés, comme une documentation.
        </p>
      </div>

      <WikiFilter
        coursesCount={coursesCount}
        blogCount={0}
        coursesView={
          data.disciplines.length === 0 ? (
            <div className="rounded border border-border bg-card p-8 font-mono text-sm text-muted-foreground">
              <p className="mb-2 font-semibold text-foreground">
                Aucun contenu trouvé.
              </p>
              <p>
                Le dossier <code className="text-primary">cours/</code> du vault
                n&apos;a pas été trouvé au moment du build. Vérifie que le vault
                est présent (ou définit la variable{" "}
                <code className="text-primary">VAULT_PATH</code>), puis relance
                le build.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.disciplines.map((discipline) => (
                <Link
                  key={discipline.slug}
                  href={`/wiki/${discipline.slug}`}
                  className="group flex flex-col rounded border border-border bg-card p-5 transition-colors hover:border-primary/40 hover:bg-card/80"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="font-mono text-lg font-semibold">
                      {discipline.title}
                    </h2>
                    <span className="shrink-0 font-mono text-xs text-muted-foreground">
                      {discipline.courses.length} cours
                    </span>
                  </div>
                  {discipline.description && (
                    <p className="mt-2 line-clamp-2 font-mono text-xs leading-relaxed text-muted-foreground">
                      {discipline.description}
                    </p>
                  )}
                  <ul className="mt-4 flex-1 space-y-1.5">
                    {discipline.courses.map((course) => (
                      <li
                        key={course.slug}
                        className="flex items-center gap-2 font-mono text-sm"
                      >
                        <span className="w-6 shrink-0 text-primary/60">
                          {course.numero ?? "•"}
                        </span>
                        <span className="truncate text-muted-foreground transition-colors group-hover:text-foreground">
                          {course.title}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex items-center gap-1 font-mono text-xs text-primary/80">
                    Explorer
                    <ChevronRight className="h-3.5 w-3.5 transition-all group-hover:translate-x-0.5" />
                  </div>
                </Link>
              ))}
            </div>
          )
        }
        blogView={
          <div className="flex flex-col items-center justify-center rounded border border-dashed border-border bg-card/40 px-6 py-16 text-center">
            <Feather className="mb-4 h-8 w-8 text-primary/60" />
            <h2 className="font-mono text-lg font-semibold">
              Aucun article pour l&apos;instant
            </h2>
            <p className="mt-2 max-w-sm font-mono text-sm text-muted-foreground">
              Les blog posts arriveront bientôt ici. Les articles seront listés
              dans cet onglet dès qu&apos;ils seront publiés.
            </p>
          </div>
        }
      />
    </div>
  );
}
