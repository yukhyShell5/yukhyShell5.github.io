import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Chapter, Course, Discipline, WikiData } from "./types";

const COURS_DIR = "cours";
const HUB_FILE = "00-hub.md";

let cached: WikiData | null = null;

/**
 * Resolve the vault's cours/ directory. The vault lives outside this repo,
 * so we try several layouts and allow an explicit override:
 *   1. $VAULT_PATH (absolute path to a cours/ dir)
 *   2. ../vault/cours  (local dev: vault is a sibling of yukhyShell5.github.io)
 *   3. ./vault/cours   (CI: the deploy workflow checks the vault out inside the workspace)
 */
export function resolveCoursDir(): string | null {
  const candidates = [
    process.env.VAULT_PATH,
    path.join(process.cwd(), "..", "vault", COURS_DIR),
    path.join(process.cwd(), "vault", COURS_DIR),
  ].filter(Boolean) as string[];

  for (const dir of candidates) {
    if (fs.existsSync(dir)) return dir;
  }
  return null;
}

function numeroOf(name: string): string | undefined {
  const m = /^(\d{2})[-\s]/.exec(name);
  return m?.[1];
}

function readFrontmatter(filePath: string): { data: Record<string, unknown>; content: string } {
  try {
    const parsed = matter(fs.readFileSync(filePath, "utf8"));
    return { data: (parsed.data ?? {}) as Record<string, unknown>, content: parsed.content };
  } catch {
    return { data: {}, content: "" };
  }
}

/** First `> [!abstract] …` callout content, else first paragraph, used as a summary. */
function extractSummary(content: string): string | undefined {
  const lines = content.split("\n");
  let inAbstract = false;
  const abstractLines: string[] = [];
  for (const line of lines) {
    const abstractMatch = /^>\s*\[!abstract\]\s*(.*)$/.exec(line);
    if (abstractMatch) {
      inAbstract = true;
      if (abstractMatch[1].trim()) abstractLines.push(abstractMatch[1].trim());
      continue;
    }
    if (inAbstract) {
      const cont = /^>\s?(.*)$/.exec(line);
      if (cont && cont[1].trim()) {
        abstractLines.push(cont[1].trim());
      } else if (/^>\s*$/.test(line)) {
        abstractLines.push("");
      } else {
        inAbstract = false;
      }
    }
  }
  if (abstractLines.length) return abstractLines.join(" ").trim();

  // fallback: first non-empty paragraph that isn't a heading/table/list
  const para: string[] = [];
  for (const line of lines) {
    const t = line.trim();
    if (!t) {
      if (para.length) break;
      continue;
    }
    if (/^#{1,6}\s/.test(t) || /^\|/.test(t) || /^[-*]\s/.test(t) || /^>\s/.test(t)) {
      if (para.length) break;
      continue;
    }
    para.push(t);
  }
  return para.join(" ").trim() || undefined;
}

function readChapter(domaine: string, cours: string, dir: string, file: string): Chapter | null {
  const filePath = path.join(dir, file);
  const { data, content } = readFrontmatter(filePath);
  const slug = file.replace(/\.md$/, "");
  let title = (data.titre as string) ?? "";
  if (!title) {
    const h1 = /^#\s+(.+)$/m.exec(content);
    title = h1?.[1]?.trim() ?? slug;
  }
  return {
    slug,
    file: path.join(COURS_DIR, domaine, cours, file).replace(/\\/g, "/"),
    title,
    numero: numeroOf(file),
    statut: (data.statut as string) ?? undefined,
    difficulte: (data.difficulte as string) ?? undefined,
    date: data.date ? String(data.date) : undefined,
  };
}

function parseWiki(): WikiData {
  const sourceDir = resolveCoursDir();
  if (!sourceDir) return { disciplines: [], sourceDir: null };

  const disciplines: Discipline[] = [];
  const dirEntries = fs
    .readdirSync(sourceDir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith("_"))
    .sort((a, b) => a.name.localeCompare(b.name, "fr"));

  for (const entry of dirEntries) {
    const disciplineDir = path.join(sourceDir, entry.name);
    const slug = entry.name;

    // <domaine>.md — sommaire of the discipline
    const sommaireFile = path.join(disciplineDir, `${slug}.md`);
    let title = slug;
    let description: string | undefined;
    let sommaireContent: string | undefined;
    if (fs.existsSync(sommaireFile)) {
      const { data, content } = readFrontmatter(sommaireFile);
      title = (data.titre as string) ?? slug;
      description = extractSummary(content);
      sommaireContent = content;
    }

    const courses: Course[] = [];
    const courseDirs = fs
      .readdirSync(disciplineDir, { withFileTypes: true })
      .filter((e) => e.isDirectory() && !e.name.startsWith("_"))
      .sort((a, b) => a.name.localeCompare(b.name, "fr", { numeric: true }));

    for (const courseEntry of courseDirs) {
      const courseDir = path.join(disciplineDir, courseEntry.name);
      const courseSlug = courseEntry.name;
      const hubFile = path.join(courseDir, HUB_FILE);
      let courseTitle = courseSlug.replace(/^\d+-\s*/, "").replace(/-/g, " ");
      let courseDescription: string | undefined;
      let courseStatut: string | undefined;
      let courseDifficulte: string | undefined;
      let courseDate: string | undefined;
      if (fs.existsSync(hubFile)) {
        const { data, content } = readFrontmatter(hubFile);
        courseTitle = (data.titre as string) ?? courseTitle;
        courseDescription = extractSummary(content);
        courseStatut = (data.statut as string) ?? undefined;
        courseDifficulte = (data.difficulte as string) ?? undefined;
        courseDate = data.date ? String(data.date) : undefined;
      }

      const chapters: Chapter[] = [];
      const files = fs
        .readdirSync(courseDir)
        .filter((f) => f.endsWith(".md") && f !== HUB_FILE && !f.startsWith("_"))
        .sort((a, b) => a.localeCompare(b, "fr", { numeric: true }));

      for (const file of files) {
        const chapter = readChapter(slug, courseSlug, courseDir, file);
        if (chapter) chapters.push(chapter);
      }

      courses.push({
        slug: courseSlug,
        numero: numeroOf(courseSlug),
        title: courseTitle,
        description: courseDescription,
        statut: courseStatut,
        difficulte: courseDifficulte,
        date: courseDate,
        chapters,
      });
    }

    disciplines.push({ slug, title, description, sommaireContent, courses });
  }

  return { disciplines, sourceDir };
}

/** Memoized accessor — the vault is immutable during a build. */
export function getWikiData(): WikiData {
  if (!cached) cached = parseWiki();
  return cached;
}

export function findDiscipline(slug: string): Discipline | undefined {
  return getWikiData().disciplines.find((d) => d.slug === slug);
}

export function findCourse(domaine: string, cours: string): Course | undefined {
  return findDiscipline(domaine)?.courses.find((c) => c.slug === cours);
}

export function findChapter(
  domaine: string,
  cours: string,
  chapitre: string
): Chapter | undefined {
  return findCourse(domaine, cours)?.chapters.find((c) => c.slug === chapitre);
}

export function chapterHref(domaine: string, cours: string, chapitre?: string): string {
  return `/wiki/${domaine}/${cours}${chapitre ? `/${chapitre}` : ""}`;
}

/** Read a file's markdown body (frontmatter stripped), relative to cours/. */
export function readFileContent(relativePath: string): string | null {
  const dir = resolveCoursDir();
  if (!dir) return null;
  const filePath = path.join(dir, relativePath);
  if (!fs.existsSync(filePath)) return null;
  try {
    return matter(fs.readFileSync(filePath, "utf8")).content;
  } catch {
    return null;
  }
}
