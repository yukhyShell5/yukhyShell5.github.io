"use client";

import { motion } from "framer-motion";
import { ExternalLink, Layers, Clock, Github } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface Project {
  name: string;
  description: string;
  path: string;
  githubUrl?: string;
  tags: string[];
  status: "active" | "coming-soon" | "archived";
}

const projects: Project[] = [
  {
    name: "logs-anonymizer",
    description: "Tool for anonymizing sensitive data in log files. Supports custom patterns and regex-based detection.",
    path: "/logs-anonymizer",
    githubUrl: "https://github.com/yukhyShell5/logs-anonymizer",
    tags: ["Security", "Privacy", "Tool"],
    status: "active",
  },
  {
    name: "chess-learn",
    description: "Interactive chess learning platform with study tools and variant visualization.",
    path: "/chess-learn",
    githubUrl: "https://github.com/yukhyShell5/chess-learn",
    tags: ["Game", "Learning", "React"],
    status: "active",
  },
  {
    name: "crackstation",
    description: "Advanced password analysis and security testing toolkit. Coming soon.",
    path: "/crackstation",
    tags: ["Security", "Cryptography", "Tool"],
    status: "coming-soon",
  },
];

const statusBadge = {
  active: { label: "Active", className: "bg-success/10 text-success border-success/20" },
  "coming-soon": { label: "Coming Soon", className: "bg-primary/10 text-primary border-primary/20" },
  archived: { label: "Archived", className: "bg-muted text-muted-foreground border-muted" },
};

export function Projects() {
  return (
    <section id="projects" className="py-24 px-6 bg-card/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-2">Projects</h2>
          <p className="text-muted-foreground">Open source tools and experiments</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, idx) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              {project.status === "coming-soon" ? (
                <div className="group block p-6 rounded-lg border border-border bg-card opacity-70 cursor-default h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Layers className="w-5 h-5 text-muted-foreground" />
                      <span className="font-mono font-semibold">{project.name}</span>
                    </div>
                    <Clock className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className={statusBadge[project.status].className}>
                      {statusBadge[project.status].label}
                    </Badge>
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  href={project.path}
                  className="group block p-6 rounded-lg border border-border bg-card hover:border-primary/50 transition-all h-full"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Layers className="w-5 h-5 text-muted-foreground" />
                      <span className="font-mono font-semibold">{project.name}</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className={statusBadge[project.status].className}>
                      {statusBadge[project.status].label}
                    </Badge>
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </Link>
              )}
            </motion.div>
          ))}
        </div>

        {/* GitHub Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <a
            href="https://github.com/yukhyShell5"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="w-5 h-5" />
            <span>View all projects on GitHub</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
