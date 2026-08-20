"use client";

import { motion } from "framer-motion";
import { ExternalLink, Clock, Github, Folder } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useI18n, type TranslationKey } from "@/components/i18n";

interface Project {
  name: string;
  descKey: TranslationKey;
  path: string;
  githubUrl?: string;
  tags: string[];
  status: "active" | "coming-soon" | "archived";
}

export function Projects() {
  const { t } = useI18n();

  const projects: Project[] = [
    {
      name: "logs-anonymizer",
      descKey: "projects.desc.logs",
      path: "/logs-anonymizer",
      githubUrl: "https://github.com/yukhyShell5/logs-anonymizer",
      tags: ["Security", "Privacy", "Tool"],
      status: "active",
    },
    {
      name: "chess-learn",
      descKey: "projects.desc.chess",
      path: "/chess-learn",
      githubUrl: "https://github.com/yukhyShell5/chess-learn",
      tags: ["Game", "Learning", "React"],
      status: "active",
    },
    {
      name: "crackstation",
      descKey: "projects.desc.crackstation",
      path: "/crackstation",
      tags: ["Security", "Cryptography", "Tool"],
      status: "coming-soon",
    },
  ];

  const statusBadge = {
    active: { label: t("projects.status.active"), className: "text-[#a6e3a1] border-[#a6e3a1]/30 bg-[#a6e3a1]/10" },
    "coming-soon": { label: t("projects.status.soon"), className: "text-[#f9e2af] border-[#f9e2af]/30 bg-[#f9e2af]/10" },
    archived: { label: t("projects.status.archived"), className: "text-muted-foreground border-border bg-muted" },
  };

  return (
    <section id="projects" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 font-mono"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-primary text-sm">03</span>
            <span className="text-2xl font-bold">
              <span className="text-primary">#</span> {t("section.projects")}
            </span>
          </div>
          <p className="text-muted-foreground text-sm">
            <span className="text-term-muted">$</span> ls ~/projects
          </p>
          <p className="text-muted-foreground text-sm mt-1">
            <span className="text-term-muted">→</span> {t("projects.subtitle")}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, idx) => {
            const status = statusBadge[project.status];
            const isSoon = project.status === "coming-soon";
            return (
              <motion.div
                key={project.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                {isSoon ? (
                  <div className="block p-5 rounded border border-border bg-card opacity-70 cursor-default h-full font-mono">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Folder className="w-4 h-4 text-term-muted" />
                        <span className="font-semibold text-sm">~/</span>
                        <span className="font-semibold">{project.name}</span>
                      </div>
                      <Clock className="w-4 h-4 text-term-muted" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {t(project.descKey)}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className={status.className}>
                        {status.label}
                      </Badge>
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs text-term-muted border border-border rounded px-1.5 py-0.5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    href={project.path}
                    className="group block p-5 rounded border border-border bg-card hover:border-primary/50 transition-all h-full font-mono"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Folder className="w-4 h-4 text-term-muted" />
                        <span className="font-semibold text-sm">~/</span>
                        <span className="font-semibold group-hover:text-primary transition-colors">
                          {project.name}
                        </span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {t(project.descKey)}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className={status.className}>
                        {status.label}
                      </Badge>
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs text-term-muted border border-border rounded px-1.5 py-0.5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </Link>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* GitHub Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center font-mono"
        >
          <a
            href="https://github.com/yukhyShell5"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="text-term-prompt">❯</span>
            <Github className="w-4 h-4" />
            <span>{t("projects.all")}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
