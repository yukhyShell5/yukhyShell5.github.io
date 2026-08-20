import React from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import {
  remarkCallouts,
  remarkWikiLinks,
  type WikiLinkContext,
  type WikiLinkResolver,
} from "@/lib/wiki/remark";
import { Mermaid } from "./mermaid";
import {
  ScrollText,
  Lightbulb,
  TriangleAlert,
  Info,
  StickyNote,
  FlaskConical,
  HelpCircle,
  OctagonAlert,
  CheckCircle2,
  XCircle,
  Bug,
  Quote,
  type LucideIcon,
} from "lucide-react";

const CALLOUT_ICONS: Record<string, LucideIcon> = {
  abstract: ScrollText,
  note: StickyNote,
  info: Info,
  tip: Lightbulb,
  warning: TriangleAlert,
  danger: OctagonAlert,
  example: FlaskConical,
  question: HelpCircle,
  success: CheckCircle2,
  failure: XCircle,
  bug: Bug,
  quote: Quote,
};

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function childrenToText(children: React.ReactNode): string {
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }
  if (Array.isArray(children)) return children.map(childrenToText).join("");
  if (React.isValidElement(children)) {
    return childrenToText((children.props as { children?: React.ReactNode }).children);
  }
  return "";
}

function nodeToString(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeToString).join("");
  if (React.isValidElement(node)) return nodeToString((node.props as { children?: React.ReactNode }).children);
  return "";
}

interface WikiMarkdownProps {
  content: string;
  resolve: WikiLinkResolver;
  ctx?: WikiLinkContext;
}

export function WikiMarkdown({ content, resolve, ctx }: WikiMarkdownProps) {
  const seen = new Set<string>();

  const heading = (level: 1 | 2 | 3 | 4) =>
    function Heading({
      children,
    }: {
      children?: React.ReactNode;
    }) {
      const text = childrenToText(children);
      let id = slugify(text) || `section-${level}`;
      let n = 2;
      while (seen.has(id)) {
        id = `${slugify(text) || "section"}-${n++}`;
      }
      seen.add(id);
      const Tag = `h${level}` as const;
      return (
        <Tag id={id} className="group scroll-mt-24">
          {children}
          <a
            href={`#${id}`}
            aria-label={`Lien vers « ${text} »`}
            className="heading-anchor"
          >
            #
          </a>
        </Tag>
      );
    };

  return (
    <div className="prose-wiki">
      <ReactMarkdown
        remarkPlugins={[
          remarkCallouts,
          [remarkWikiLinks, { resolve, ctx }],
          remarkGfm,
        ]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h1: heading(1),
          h2: heading(2),
          h3: heading(3),
          h4: heading(4),
          a: ({ href, children }) => {
            if (href?.startsWith("/wiki")) {
              return (
                <Link href={href} className="wiki-link">
                  {children}
                </Link>
              );
            }
            if (href?.startsWith("http")) {
              return (
                <a href={href} target="_blank" rel="noopener noreferrer" className="wiki-link">
                  {children}
                </a>
              );
            }
            return (
              <a href={href} className="wiki-link">
                {children}
              </a>
            );
          },
          code: ({ className, children }) => {
            const isMermaid = /language-mermaid/.test(className ?? "");
            if (isMermaid) {
              return <Mermaid code={nodeToString(children)} />;
            }
            return <code className={className}>{children}</code>;
          },
          table: ({ children }) => (
            <div className="table-wrap">
              <table>{children}</table>
            </div>
          ),
          blockquote: ({ node, children }) => {
            const properties = (node as { properties?: Record<string, unknown> } | undefined)
              ?.properties;
            const cls = properties?.className;
            const isCallout = typeof cls === "string" && cls.includes("callout");
            if (!isCallout) return <blockquote>{children}</blockquote>;
            const type = String(properties?.["data-callout-type"] ?? "note");
            const title = properties?.["data-callout-title"];
            const Icon = CALLOUT_ICONS[type] ?? StickyNote;
            return (
              <div className={`callout callout-${type}`}>
                {typeof title === "string" && title ? (
                  <div className="callout-title">
                    <Icon className="callout-icon" aria-hidden />
                    <span>{title}</span>
                  </div>
                ) : null}
                <div className="callout-body">{children}</div>
              </div>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
