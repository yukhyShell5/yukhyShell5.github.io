import type { Root } from "mdast";
import type { WikiData } from "./types";

export interface WikiLinkContext {
  domaine: string;
  cours: string;
}

export type WikiLinkResolver = (
  target: string,
  ctx?: WikiLinkContext
) => string | null;

interface LinkCandidate {
  url: string;
  domaine?: string;
  cours?: string;
}

/**
 * Build a resolver that maps Obsidian-style [[wiki-links]] to /wiki routes.
 * Full paths (cours/<domaine>/<cours>/<chapitre>) hit the map directly;
 * bare filenames ([[01-bash-en-profondeur]]) resolve through a basename index,
 * preferring the current course, then the current discipline.
 */
export function createWikiLinkResolver(data: WikiData): WikiLinkResolver {
  const map = new Map<string, string>();
  const byBasename = new Map<string, LinkCandidate[]>();

  const pushBasename = (name: string, candidate: LinkCandidate) => {
    const list = byBasename.get(name) ?? [];
    list.push(candidate);
    byBasename.set(name, list);
  };

  for (const d of data.disciplines) {
    map.set(`cours/${d.slug}/${d.slug}`, `/wiki/${d.slug}`);
    pushBasename(d.slug, { url: `/wiki/${d.slug}`, domaine: d.slug });

    for (const c of d.courses) {
      const hubUrl = `/wiki/${d.slug}/${c.slug}`;
      map.set(`cours/${d.slug}/${c.slug}/00-hub`, hubUrl);
      pushBasename("00-hub", { url: hubUrl, domaine: d.slug, cours: c.slug });

      for (const ch of c.chapters) {
        const url = `/wiki/${d.slug}/${c.slug}/${ch.slug}`;
        map.set(`cours/${d.slug}/${c.slug}/${ch.slug}`, url);
        pushBasename(ch.slug, { url, domaine: d.slug, cours: c.slug });
      }
    }
  }

  // accueil (excluded from the wiki itself, but linked from many courses)
  map.set("cours/_accueil", "/wiki");
  map.set("cours/_accueil.md", "/wiki");

  return (target, ctx) => {
    let t = target.trim();
    if (t.endsWith(".md")) t = t.slice(0, -3);

    if (t.startsWith("cours/")) {
      return map.get(t) ?? null;
    }

    const candidates = byBasename.get(t);
    if (!candidates?.length) return null;
    if (candidates.length === 1) return candidates[0].url;

    if (ctx) {
      const sameCourse = candidates.find(
        (c) => c.domaine === ctx.domaine && c.cours === ctx.cours
      );
      if (sameCourse) return sameCourse.url;
      const sameDiscipline = candidates.find((c) => c.domaine === ctx.domaine);
      if (sameDiscipline) return sameDiscipline.url;
    }
    return candidates[0].url;
  };
}

const WIKI_LINK_RE = /\[\[([^\]|]+?)(?:\|([^\]]+))?\]\]/g;

function defaultAlias(target: string): string {
  const t = target.trim().replace(/\.md$/, "");
  return t.split("/").pop() ?? t;
}

interface Segment {
  type: "text" | "link";
  value?: string;
  url?: string;
  children?: { type: "text"; value: string }[];
  data?: { hProperties: Record<string, string> };
}

function splitWikiLinks(
  value: string,
  resolve: WikiLinkResolver,
  ctx?: WikiLinkContext
): Segment[] {
  const segments: Segment[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  WIKI_LINK_RE.lastIndex = 0;
  while ((m = WIKI_LINK_RE.exec(value))) {
    if (m.index > last) {
      segments.push({ type: "text", value: value.slice(last, m.index) });
    }
    const target = m[1].trim();
    const alias = m[2]?.trim() || defaultAlias(target);
    const url = resolve(target, ctx);
    if (url) {
      segments.push({
        type: "link",
        url,
        children: [{ type: "text", value: alias }],
        data: { hProperties: { "data-wiki": "true" } },
      });
    } else {
      segments.push({ type: "text", value: m[0] });
    }
    last = m.index + m[0].length;
  }
  if (last < value.length) {
    segments.push({ type: "text", value: value.slice(last) });
  }
  return segments;
}

interface MdNode {
  type: string;
  value?: string;
  children?: MdNode[];
  [key: string]: unknown;
}

function walk(node: MdNode, resolve: WikiLinkResolver, ctx?: WikiLinkContext) {
  if (!node || typeof node !== "object") return;
  const children = node.children;
  if (!Array.isArray(children)) return;

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (child?.type === "text" && typeof child.value === "string" && child.value.includes("[[")) {
      const segments = splitWikiLinks(child.value, resolve, ctx);
      if (segments.length > 1 || (segments.length === 1 && segments[0].type === "link")) {
        children.splice(i, 1, ...(segments as MdNode[]));
        i += segments.length - 1;
        continue;
      }
    }
    walk(child, resolve, ctx);
  }
}

export function remarkWikiLinks(options: {
  resolve: WikiLinkResolver;
  ctx?: WikiLinkContext;
}) {
  const { resolve, ctx } = options;
  return (tree: Root) => {
    walk(tree as unknown as MdNode, resolve, ctx);
  };
}

/* ------------------------------------------------------------------ */
/* Obsidian callouts                                                   */
/* ------------------------------------------------------------------ */

const CALLOUT_RE = /^\s*\[!(\w+)\]\s*([^\n]*)/;

const CALLOUT_TYPES = new Set([
  "abstract",
  "note",
  "info",
  "tip",
  "warning",
  "danger",
  "example",
  "question",
  "quote",
  "success",
  "failure",
  "bug",
]);

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function walkCallouts(node: MdNode) {
  if (!node || typeof node !== "object") return;
  const children = node.children;
  if (!Array.isArray(children)) return;

  for (const child of children) {
    if (child?.type === "blockquote" && isPlainObject(child)) {
      const first = Array.isArray(child.children) ? child.children[0] : undefined;
      if (first?.type === "paragraph" && Array.isArray(first.children)) {
        const textNode = first.children.find(
          (c) => c?.type === "text" && typeof c.value === "string"
        );
        if (textNode && typeof textNode.value === "string") {
          const m = CALLOUT_RE.exec(textNode.value);
          if (m && CALLOUT_TYPES.has(m[1].toLowerCase())) {
            const type = m[1].toLowerCase();
            const title = m[2].trim();
            // drop the marker line, keep any body text on following lines
            textNode.value = textNode.value.replace(CALLOUT_RE, "");
            if (!textNode.value.trim()) {
              const rest = first.children.filter((c) => c !== textNode);
              if (rest.length === 0) {
                (child.children as MdNode[]) = (
                  child.children as MdNode[]
                ).filter((c) => c !== first);
              } else {
                (first.children as MdNode[]) = rest;
              }
            }
            const hProperties: Record<string, string> = {
              className: `callout callout-${type}`,
              "data-callout-type": type,
            };
            if (title) hProperties["data-callout-title"] = title;
            (child.data as Record<string, unknown>) = {
              ...(isPlainObject(child.data) ? child.data : {}),
              hProperties,
            };
          }
        }
      }
    }
    walkCallouts(child);
  }
}

export function remarkCallouts() {
  return (tree: Root) => {
    walkCallouts(tree as unknown as MdNode);
  };
}
